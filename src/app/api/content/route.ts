// Ticket 5 — 2026-05-28: admin content creation route updated.
// Added subject, audience_in_fiction, source_seed fields to INSERT.
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi, redirectTarget } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { slugify, uniqueSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const unauth = await requireAdminApi()
  if (unauth) return unauth

  const data = await req.formData()
  const title = data.get('title')?.toString().trim() ?? ''

  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 })
  }

  const body = data.get('body')?.toString().trim() ?? ''
  if (!body) {
    return NextResponse.json({ error: 'Body required' }, { status: 400 })
  }

  const db = getDb()
  const slug = uniqueSlug(db, slugify(title))
  const series = data.get('series')?.toString() || null
  const character = data.get('character')?.toString() || null
  const subject = data.get('subject')?.toString().trim() || null
  const audienceInFiction = data.get('audience_in_fiction')?.toString() || null
  const sourceSeed = data.get('source_seed')?.toString().trim() || null

  db.prepare(`
    INSERT INTO content (slug, title, body, excerpt, type, tier, series, character,
                         subject, audience_in_fiction, source_seed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug,
    title,
    body,
    data.get('excerpt')?.toString() || null,
    data.get('type') ?? 'post',
    data.get('tier') ?? 'free',
    series,
    character,
    subject,
    audienceInFiction,
    sourceSeed
  )

  return NextResponse.redirect(redirectTarget(req, '/admin'), { status: 303 })
}
