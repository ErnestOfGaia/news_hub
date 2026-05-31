// Ticket 5 — 2026-05-28: admin content update route updated.
// Added subject, audience_in_fiction, source_seed fields to UPDATE.
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi, redirectTarget } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminApi()
  if (unauth) return unauth

  const id = parseInt((await params).id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

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
  const excerpt = data.get('excerpt')?.toString().trim() || null
  const type = data.get('type') ?? 'post'
  const tier = data.get('tier') ?? 'free'
  const series = data.get('series')?.toString() || null
  const character = data.get('character')?.toString() || null
  const subject = data.get('subject')?.toString().trim() || null
  const audienceInFiction = data.get('audience_in_fiction')?.toString() || null
  const sourceSeed = data.get('source_seed')?.toString().trim() || null

  db.prepare(
    `UPDATE content
     SET title=?, body=?, excerpt=?, type=?, tier=?, series=?, character=?,
         subject=?, audience_in_fiction=?, source_seed=?,
         updated_at=datetime('now')
     WHERE id=?`
  ).run(title, body, excerpt, type, tier, series, character, subject, audienceInFiction, sourceSeed, id)

  return NextResponse.redirect(redirectTarget(req, '/admin'), { status: 303 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminApi()
  if (unauth) return unauth

  const id = parseInt((await params).id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const db = getDb()
  db.prepare('DELETE FROM content WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
