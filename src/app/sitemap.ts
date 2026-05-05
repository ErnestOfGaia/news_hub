import type { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'

export default function sitemap(): MetadataRoute.Sitemap {
  const db = getDb()
  const articles = db
    .prepare(
      `SELECT slug, updated_at FROM content WHERE published=1 AND tier='free' AND type='article' ORDER BY created_at DESC`
    )
    .all() as { slug: string; updated_at: string }[]

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://news.ernestofgaia.xyz'

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...articleEntries,
  ]
}
