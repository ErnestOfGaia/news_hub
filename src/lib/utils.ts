import type Database from 'better-sqlite3'
import { ContentSeries } from '@/types'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uniqueSlug(db: Database.Database, base: string): string {
  const rows = db
    .prepare('SELECT slug FROM content WHERE slug = ? OR slug LIKE ?')
    .all(base, `${base}-%`) as { slug: string }[]
  const existing = new Set(rows.map((r) => r.slug))
  if (!existing.has(base)) return base
  let n = 2
  while (existing.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function getSeriesLabel(series: ContentSeries): string | null {
  if (series === 'build-log') return 'The Build Log'
  if (series === 'new-news') return 'New News'
  if (series === 'jules-experience') return 'The Jules Experience'
  return null
}
