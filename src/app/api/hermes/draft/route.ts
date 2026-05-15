import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { getDb } from '@/lib/db'
import { slugify, uniqueSlug } from '@/lib/utils'
import type { ContentCharacter, ContentSeries } from '@/types'

const VALID_CHARACTERS = ['pelican', 'gremlin', 'zclaude', 'ag'] as const
const VALID_SERIES = ['build-log', 'new-news', 'jules-experience', 'pull-request'] as const

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
  const auth = checkBearer(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let payload: DraftBody
  try {
    payload = (await req.json()) as DraftBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  const body = typeof payload.body === 'string' ? payload.body.trim() : ''
  if (!title || !body) {
    return NextResponse.json({ error: 'title and body are required' }, { status: 400 })
  }

  let character: ContentCharacter = null
  if (payload.character !== undefined && payload.character !== null) {
    if (typeof payload.character !== 'string' || !(VALID_CHARACTERS as readonly string[]).includes(payload.character)) {
      return NextResponse.json({ error: 'Invalid character' }, { status: 400 })
    }
    character = payload.character as ContentCharacter
  }

  let series: ContentSeries = null
  if (payload.series !== undefined && payload.series !== null) {
    if (typeof payload.series !== 'string' || !(VALID_SERIES as readonly string[]).includes(payload.series)) {
      return NextResponse.json({ error: 'Invalid series' }, { status: 400 })
    }
    series = payload.series as ContentSeries
  }

  let excerpt: string | null = null
  if (payload.excerpt !== undefined && payload.excerpt !== null) {
    if (typeof payload.excerpt !== 'string') {
      return NextResponse.json({ error: 'excerpt must be a string' }, { status: 400 })
    }
    const trimmed = payload.excerpt.trim()
    excerpt = trimmed === '' ? null : trimmed
  }

  let comicPanels: string | null = null
  if (payload.comic_panels !== undefined && payload.comic_panels !== null) {
    if (typeof payload.comic_panels !== 'string') {
      return NextResponse.json({ error: 'comic_panels must be a JSON string' }, { status: 400 })
    }
    try {
      const parsed: unknown = JSON.parse(payload.comic_panels)
      if (!Array.isArray(parsed) || !parsed.every((p) => typeof p === 'string')) {
        return NextResponse.json({ error: 'comic_panels must be a JSON array of strings' }, { status: 400 })
      }
      comicPanels = payload.comic_panels
    } catch {
      return NextResponse.json({ error: 'comic_panels must be a JSON array of strings' }, { status: 400 })
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
    return NextResponse.json({ id: Number(result.lastInsertRowid), slug }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
