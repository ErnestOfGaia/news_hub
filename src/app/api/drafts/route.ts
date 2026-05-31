import { NextRequest, NextResponse } from 'next/server'
import { requireHermesKey } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { slugify, uniqueSlug } from '@/lib/utils'
import type { ContentSeries, ContentType } from '@/types'

const VALID_TYPES: ContentType[] = ['post', 'article']
const VALID_SERIES: ContentSeries[] = [
  'build-log',
  'new-news',
  'jules-experience',
  'pull-request',
]

interface DraftPayload {
  title?: unknown
  slug?: unknown
  body?: unknown
  excerpt?: unknown
  type?: unknown
  series?: unknown
}

export async function POST(req: NextRequest) {
  if (!requireHermesKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: DraftPayload
  try {
    payload = (await req.json()) as DraftPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  const body = typeof payload.body === 'string' ? payload.body.trim() : ''
  if (!title || !body) {
    return NextResponse.json({ error: 'title and body are required' }, { status: 400 })
  }

  const excerpt =
    typeof payload.excerpt === 'string' && payload.excerpt.trim()
      ? payload.excerpt.trim()
      : null

  let type: ContentType = 'post'
  if (payload.type !== undefined) {
    if (!VALID_TYPES.includes(payload.type as ContentType)) {
      return NextResponse.json(
        { error: `type must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }
    type = payload.type as ContentType
  }

  let series: ContentSeries = null
  if (payload.series !== undefined && payload.series !== null) {
    if (!VALID_SERIES.includes(payload.series as ContentSeries)) {
      return NextResponse.json(
        { error: `series must be one of: ${VALID_SERIES.join(', ')}` },
        { status: 400 }
      )
    }
    series = payload.series as ContentSeries
  }

  try {
    const db = getDb()
    const baseSlug =
      typeof payload.slug === 'string' && payload.slug.trim()
        ? slugify(payload.slug.trim())
        : slugify(title)
    const slug = uniqueSlug(db, baseSlug)

    const result = db
      .prepare(
        `INSERT INTO content
           (slug, title, body, excerpt, type, tier, series, status, author)
         VALUES (?, ?, ?, ?, ?, 'free', ?, 'pending_review', 'hermes')`
      )
      .run(slug, title, body, excerpt, type, series)

    const id = Number(result.lastInsertRowid)
    return NextResponse.json({ id, adminUrl: `/admin/${id}` }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
