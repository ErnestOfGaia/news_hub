import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://news.ernestofgaia.xyz'

export async function GET() {
  const db = getDb()
  const items = db
    .prepare(
      `SELECT slug, title, excerpt, body, type, created_at FROM content WHERE published=1 AND tier='free' ORDER BY created_at DESC LIMIT 50`
    )
    .all() as {
    slug: string
    title: string
    excerpt: string | null
    body: string
    type: string
    created_at: string
  }[]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Ernest of Gaia — Build Logs &amp; Trade Notes</title>
  <description>Build logs, trade insights, and process notes from an Oregon coast tradesperson who teaches AI tools.</description>
  <link>${BASE}</link>
  <language>en-us</language>
  <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
  ${items
    .map((item) => {
      const link = item.type === 'article' ? `${BASE}/articles/${item.slug}` : BASE
      const desc = item.excerpt ?? item.body.slice(0, 200) + '…'
      // Use the slug in the guid for posts to avoid duplicates if multiple posts link to BASE
      const guid = item.type === 'article' ? link : `${BASE}/#${item.slug}`
      return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${new Date(item.created_at).toUTCString()}</pubDate>
      <guid isPermaLink="false">${guid}</guid>
    </item>`
    })
    .join('')}
</channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
