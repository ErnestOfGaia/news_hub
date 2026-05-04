import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

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

  const action = data.get('action')
  let published = action === 'publish' ? 1 : 0
  if (action === 'unpublish') {
    published = 0
  }

  const db = getDb()
  const excerpt = data.get('excerpt')?.toString().trim() || null
  const type = data.get('type') ?? 'post'
  const tier = data.get('tier') ?? 'free'
  const series = data.get('series')?.toString() || null
  const xUrl = data.get('x_thread_url')?.toString().trim() || null

  db.prepare(
    `UPDATE content SET title=?,body=?,excerpt=?,type=?,tier=?,series=?,published=?,x_thread_url=?,updated_at=datetime('now') WHERE id=?`
  ).run(title, body, excerpt, type, tier, series, published, xUrl, id)

  return NextResponse.redirect(new URL('/admin', req.url), { status: 303 })
}
