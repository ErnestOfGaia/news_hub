import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { slugify } from '@/lib/utils'
import Database from 'better-sqlite3'

function uniqueSlug(db: Database.Database, base: string): string {
  const rows = db
    .prepare('SELECT slug FROM content WHERE slug = ? OR slug LIKE ?')
    .all(base, `${base}-%`) as { slug: string }[]

  const existingSlugs = new Set(rows.map((r) => r.slug))

  if (!existingSlugs.has(base)) {
    return base
  }

  let n = 2
  while (existingSlugs.has(`${base}-${n}`)) {
    n++
  }
  return `${base}-${n}`
}

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
  const published = data.get('action') === 'publish' ? 1 : 0
  const series = data.get('series')?.toString() || null

  db.prepare(`
    INSERT INTO content (slug, title, body, excerpt, type, tier, series, published, x_thread_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug,
    title,
    body,
    data.get('excerpt')?.toString() || null,
    data.get('type') ?? 'post',
    data.get('tier') ?? 'free',
    series,
    published,
    data.get('x_thread_url')?.toString() || null
  )

  return NextResponse.redirect(new URL('/admin', req.url))
}
