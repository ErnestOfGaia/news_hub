// Ticket 4 — 2026-05-28: /api/hermes/draft is deprecated.
// - Returns Deprecation + Sunset headers on every response.
// - VALID_CHARACTERS updated to renamed enum (beacon/static) so in-flight integrations
//   using the new character values don't fail during the deprecation window.
// - Still fully functional for one release; retire after /api/publishing-agent/draft ships clean.

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getDb } from '@/lib/db'
import { slugify, uniqueSlug } from '@/lib/utils'
import type { ContentCharacter, ContentSeries } from '@/types'

// Updated to renamed enum values; old values (pelican/gremlin) are no longer valid.
const VALID_CHARACTERS = ['beacon', 'static', 'zclaude', 'ag'] as const
const VALID_SERIES = ['build-log', 'new-news', 'jules-experience', 'pull-request'] as const

// Deprecation headers per RFC 9745
const DEPRECATION_DATE = '2026-05-28'
const DEPRECATION_HEADERS = {
  'Deprecation': `date="${DEPRECATION_DATE}"`,
  'Link': '</api/publishing-agent/draft>; rel="successor-version"',
}

function checkBearer(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const expected = process.env.HERMES_API_KEY
  if (!expected) return { ok: false, status: 500, error: 'HERMES_API_KEY not configured' }

  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Bearer ')) return { ok: false, status: 401, error: 'Unauthorized' }

  const presented = header.slice('Bearer '.length)
  const a = Buffer.from(presented)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return { ok: false, status: 401, error: 'Unauthorized' }
  if (!timingSafeEqual(a, b)) return { ok: false, status: 401, error: 'Unauthorized' }

  return { ok: true }
}

interface DraftBody {
  title?: unknown
  body?: unknown
  character?: unknown
  series?: unknown
  excerpt?: unknown
  comic_panels?: unknown
}

export async function POST(req: NextRequest) {
  console.warn(
    '[DEPRECATED] POST /api/hermes/draft — migrate callers to POST /api/publishing-agent/draft'
  )

  const auth = checkBearer(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: DEPRECATION_HEADERS })
  }

  let payload: DraftBody
  try {
    payload = (await req.json()) as DraftBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: DEPRECATION_HEADERS })
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  const body = typeof payload.body === 'string' ? payload.body.trim() : ''
  if (!title || !body) {
    return NextResponse.json(
      { error: 'title and body are required' },
      { status: 400, headers: DEPRECATION_HEADERS }
    )
  }

  let character: ContentCharacter = null
  if (payload.character !== undefined && payload.character !== null) {
    if (typeof payload.character !== 'string' || !(VALID_CHARACTERS as readonly string[]).includes(payload.character)) {
      return NextResponse.json(
        { error: 'Invalid character' },
        { status: 400, headers: DEPRECATION_HEADERS }
      )
    }
    character = payload.character as ContentCharacter
  }

  let series: ContentSeries = null
  if (payload.series !== undefined && payload.series !== null) {
    if (typeof payload.series !== 'string' || !(VALID_SERIES as readonly string[]).includes(payload.series)) {
      return NextResponse.json(
        { error: 'Invalid series' },
        { status: 400, headers: DEPRECATION_HEADERS }
      )
    }
    series = payload.series as ContentSeries
  }

  let excerpt: string | null = null
  if (payload.excerpt !== undefined && payload.excerpt !== null) {
    if (typeof payload.excerpt !== 'string') {
      return NextResponse.json(
        { error: 'excerpt must be a string' },
        { status: 400, headers: DEPRECATION_HEADERS }
      )
    }
    const trimmed = payload.excerpt.trim()
    excerpt = trimmed === '' ? null : trimmed
  }

  let comicPanels: string | null = null
  if (payload.comic_panels !== undefined && payload.comic_panels !== null) {
    if (typeof payload.comic_panels !== 'string') {
      return NextResponse.json(
        { error: 'comic_panels must be a JSON string' },
        { status: 400, headers: DEPRECATION_HEADERS }
      )
    }
    try {
      const parsed: unknown = JSON.parse(payload.comic_panels)
      if (!Array.isArray(parsed) || !parsed.every((p) => typeof p === 'string')) {
        return NextResponse.json(
          { error: 'comic_panels must be a JSON array of strings' },
          { status: 400, headers: DEPRECATION_HEADERS }
        )
      }
      comicPanels = payload.comic_panels
    } catch {
      return NextResponse.json(
        { error: 'comic_panels must be a JSON array of strings' },
        { status: 400, headers: DEPRECATION_HEADERS }
      )
    }
  }

  try {
    const db = getDb()
    const slug = uniqueSlug(db, slugify(title))
    const result = db
      .prepare(
        `INSERT INTO content (slug, title, body, excerpt, type, tier, series, character, comic_panels)
         VALUES (?, ?, ?, ?, 'post', 'free', ?, ?, ?)`
      )
      .run(slug, title, body, excerpt, series, character, comicPanels)
    return NextResponse.json(
      { id: Number(result.lastInsertRowid), slug },
      { status: 201, headers: DEPRECATION_HEADERS }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500, headers: DEPRECATION_HEADERS })
  }
}
