import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { slugify, uniqueSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  await requireAdmin()

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

  db.prepare(`
    INSERT INTO content (slug, title, body, excerpt, type, tier, series, character, x_thread_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug,
    title,
    body,
    data.get('excerpt')?.toString() || null,
    data.get('type') ?? 'post',
    data.get('tier') ?? 'free',
    series,
    character,
    data.get('x_thread_url')?.toString() || null
  )

  return NextResponse.redirect(new URL('/admin', req.url))
}
