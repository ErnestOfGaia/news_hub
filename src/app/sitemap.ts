import type { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

type ContentSitemapRow = {
  slug: string
  character: 'beacon' | 'static' | 'zclaude' | 'comics' | 'ag' | null
  updated_at: string
}

export default function sitemap(): MetadataRoute.Sitemap {
  const db = getDb()
  const rows = db
    .prepare(
      `SELECT slug, character, updated_at
       FROM content
       WHERE status = 'published' AND tier = 'free'
       ORDER BY created_at DESC`
    )
    .all() as ContentSitemapRow[]

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://news.ernestofgaia.xyz'

  const contentEntries: MetadataRoute.Sitemap = rows
    .filter((r) => r.character !== null)
    .map((r) => ({
      url: `${base}/dispatch/${r.character}/${r.slug}`,
      lastModified: new Date(r.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  const staticPages: MetadataRoute.Sitemap = [
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
    {
      url: `${base}/dispatch/beacon`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/dispatch/static`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/dispatch/zclaude`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/dispatch/comics`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  return [...staticPages, ...contentEntries]
}
