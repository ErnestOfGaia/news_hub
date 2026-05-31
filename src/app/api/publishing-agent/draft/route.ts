// Ticket 3 — 2026-05-28: New canonical publishing-agent draft endpoint.
// Replaces /api/hermes/draft for new submissions.
// Auth:   PUBLISHING_AGENT_API_KEY (fallback to HERMES_API_KEY during transition).
// Result: status='pending_review', author='publishing_agent' on INSERT.

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getDb } from '@/lib/db'
import { slugify, uniqueSlug } from '@/lib/utils'
import type { ContentCharacter, ContentSeries } from '@/types'

const VALID_CHARACTERS = ['beacon', 'static', 'zclaude', 'ag'] as const
const VALID_SERIES = ['build-log', 'new-news', 'jules-experience', 'pull-request'] as const
const VALID_AUDIENCE = ['beacon'] as const

function checkBearer(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  // Prefer PUBLISHING_AGENT_API_KEY; fall back to HERMES_API_KEY during transition window.
  const expected = process.env.PUBLISHING_AGENT_API_KEY ?? process.env.HERMES_API_KEY
  if (!expected) return { ok: false, status: 500, error: 'PUBLISHING_AGENT_API_KEY not configured' }

  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Bearer ')) return { ok: false, status: 401, error: 'Unauthorized' }

  const presented = header.slice('Bearer '.length)
  try {
    const a = Buffer.from(presented)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return { ok: false, status: 401, error: 'Unauthorized' }
    if (!timingSafeEqual(a, b)) return { ok: false, status: 401, error: 'Unauthorized' }
  } catch {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  return { ok: true }
}

// comic_panels accepts both legacy (array of strings) and new (array of objects) shapes.
function validateComicPanels(raw: string): { ok: true; value: string } | { ok: false; error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'comic_panels must be valid JSON' }
  }
  if (!Array.isArray(parsed)) return { ok: false, error: 'comic_panels must be a JSON array' }
  for (const item of parsed) {
    if (typeof item === 'string') continue // legacy shape
    if (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).image === 'string'
    ) continue // new shape: { image, caption?, alt? }
    return { ok: false, error: 'comic_panels items must be strings or {image, caption?, alt?} objects' }
  }
  return { ok: true, value: raw }
}

interface DraftBody {
  title?: unknown
  slug?: unknown
  body?: unknown
  excerpt?: unknown
  type?: unknown
  series?: unknown
  character?: unknown
  narrator?: unknown      // alias for character (used in Stage 5 frontmatter)
  subject?: unknown
  audience_in_fiction?: unknown
  source_seed?: unknown
  comic_panels?: unknown
}

export async function POST(req: NextRequest) {
  const auth = checkBearer(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let payload: DraftBody
  try {
    payload = (await req.json()) as DraftBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Required fields
  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  const body = typeof payload.body === 'string' ? payload.body.trim() : ''
  if (!title || !body) {
    return NextResponse.json({ error: 'title and body are required' }, { status: 400 })
  }

  // Optional slug (else derived from title)
  const slugBase =
    typeof payload.slug === 'string' && payload.slug.trim()
      ? slugify(payload.slug.trim())
      : slugify(title)

  // character / narrator (narrator is the Stage 5 frontmatter key; both accepted)
  const rawChar = payload.narrator ?? payload.character
  let character: ContentCharacter = null
  if (rawChar !== undefined && rawChar !== null) {
    if (
      typeof rawChar !== 'string' ||
      !(VALID_CHARACTERS as readonly string[]).includes(rawChar)
    ) {
      return NextResponse.json(
        { error: `character/narrator must be one of: ${VALID_CHARACTERS.join(', ')}` },
        { status: 400 }
      )
    }
    character = rawChar as ContentCharacter
  }

  // series
  let series: ContentSeries = null
  if (payload.series !== undefined && payload.series !== null) {
    if (
      typeof payload.series !== 'string' ||
      !(VALID_SERIES as readonly string[]).includes(payload.series)
    ) {
      return NextResponse.json(
        { error: `series must be one of: ${VALID_SERIES.join(', ')}` },
        { status: 400 }
      )
    }
    series = payload.series as ContentSeries
  }

  // excerpt
  let excerpt: string | null = null
  if (payload.excerpt !== undefined && payload.excerpt !== null) {
    if (typeof payload.excerpt !== 'string') {
      return NextResponse.json({ error: 'excerpt must be a string' }, { status: 400 })
    }
    const trimmed = payload.excerpt.trim()
    excerpt = trimmed === '' ? null : trimmed
  }

  // subject (free-form, max 100 chars)
  let subject: string | null = null
  if (payload.subject !== undefined && payload.subject !== null) {
    if (typeof payload.subject !== 'string') {
      return NextResponse.json({ error: 'subject must be a string' }, { status: 400 })
    }
    const trimmed = payload.subject.trim().slice(0, 100)
    subject = trimmed === '' ? null : trimmed
  }

  // audience_in_fiction
  let audienceInFiction: 'beacon' | null = null
  if (payload.audience_in_fiction !== undefined && payload.audience_in_fiction !== null) {
    if (
      typeof payload.audience_in_fiction !== 'string' ||
      !(VALID_AUDIENCE as readonly string[]).includes(payload.audience_in_fiction)
    ) {
      return NextResponse.json(
        { error: `audience_in_fiction must be one of: ${VALID_AUDIENCE.join(', ')}` },
        { status: 400 }
      )
    }
    audienceInFiction = payload.audience_in_fiction as 'beacon'
  }

  // source_seed (free-form filename, max 200 chars)
  let sourceSeed: string | null = null
  if (payload.source_seed !== undefined && payload.source_seed !== null) {
    if (typeof payload.source_seed !== 'string') {
      return NextResponse.json({ error: 'source_seed must be a string' }, { status: 400 })
    }
    const trimmed = payload.source_seed.trim().slice(0, 200)
    sourceSeed = trimmed === '' ? null : trimmed
  }

  // comic_panels (JSON string — array of strings OR array of {image,caption?,alt?})
  let comicPanels: string | null = null
  if (payload.comic_panels !== undefined && payload.comic_panels !== null) {
    if (typeof payload.comic_panels !== 'string') {
      return NextResponse.json({ error: 'comic_panels must be a JSON string' }, { status: 400 })
    }
    const result = validateComicPanels(payload.comic_panels)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    comicPanels = result.value
  }

  // type (default 'article' for agent submissions)
  const type = payload.type === 'post' ? 'post' : 'article'

  try {
    const db = getDb()
    const slug = uniqueSlug(db, slugBase)
    const result = db
      .prepare(
        `INSERT INTO content
           (slug, title, body, excerpt, type, tier, series, character,
            comic_panels, subject, audience_in_fiction, source_seed,
            status, author)
         VALUES (?, ?, ?, ?, ?, 'free', ?, ?, ?, ?, ?, ?, 'pending_review', 'publishing_agent')`
      )
      .run(slug, title, body, excerpt, type, series, character, comicPanels, subject, audienceInFiction, sourceSeed)
    const id = Number(result.lastInsertRowid)
    return NextResponse.json({ id, slug, adminUrl: `/admin/${id}` }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
