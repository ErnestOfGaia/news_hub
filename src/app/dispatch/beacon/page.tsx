// Ticket 9 — 2026-05-28: /dispatch/beacon — replaces /dispatch/pelican.
// Queries use character='beacon' (post-migration value).
// Old URL /dispatch/pelican → 308 redirect to /dispatch/beacon (in next.config.ts).

import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import { getSeriesLabel } from '@/lib/utils'
import Link from 'next/link'
import CharacterCard from '@/components/ui/CharacterCard'
import NewsCard from '@/components/ui/NewsCard'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const BEACON_DESCRIPTION =
  "Beacon — The Guardian. Warm authority reporting project updates in mission-briefing format from the Coastal Command Center."

export const metadata: Metadata = {
  title: "Beacon's Dispatch — News Hub World",
  description: BEACON_DESCRIPTION,
  openGraph: {
    title: "Beacon's Dispatch — News Hub World",
    description: BEACON_DESCRIPTION,
    type: 'website',
    images: [
      {
        url: '/pelican-banner.png',
        width: 1200,
        height: 630,
        alt: "Beacon — The Guardian",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Beacon's Dispatch — News Hub World",
    description: BEACON_DESCRIPTION,
    images: ['/pelican-banner.png'],
  },
}

export default function BeaconDispatchPage() {
  const db = getDb()
  const posts = db.prepare(
    `SELECT id, slug, title, excerpt, series, character, created_at
     FROM content WHERE character = 'beacon' AND status = 'published' ORDER BY created_at DESC`
  ).all() as ContentSummary[]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">

      <CharacterCard
        name="BEACON"
        role="The Guardian"
        statusLine="MONITORING THE HORIZON"
        description="Warm authority. Reports project updates in mission-briefing format. In-fiction audience for Static's Reports."
        href="/dispatch/beacon"
        portraitSrc="/pelican-banner.png"
      />

      <section>
        <h2 className="text-label-lg text-nhw-cyan uppercase tracking-widest mb-6">
          TRANSMISSIONS ──────────── ((•))
        </h2>

        {posts.length === 0 ? (
          <p className="text-label-lg text-nhw-cyan/40 text-center py-12">
            NO TRANSMISSIONS ON FILE
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <NewsCard
                key={post.id}
                seriesLabel={getSeriesLabel(post.series)}
                date={post.created_at}
                headline={post.title}
                excerpt={post.excerpt}
                href={`/dispatch/beacon/${post.slug}`}
                openInNewTab={true}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
