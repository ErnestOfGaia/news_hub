import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import { formatDate, getSeriesLabel } from '@/lib/utils'
import Link from 'next/link'
import CharacterCard from '@/components/ui/CharacterCard'

export const dynamic = 'force-dynamic'

const GREMLIN_DESCRIPTION =
  'Gremlin — The Gremlin. Chaotic-good field reports on The Build Log with snarky commentary, transmitted up the chain to Pelican.'

export const metadata: Metadata = {
  title: "Gremlin's Dispatch — News Hub World",
  description: GREMLIN_DESCRIPTION,
  openGraph: {
    title: "Gremlin's Dispatch — News Hub World",
    description: GREMLIN_DESCRIPTION,
    type: 'website',
    images: [
      {
        url: '/gremlin-banner.png',
        width: 1200,
        height: 630,
        alt: 'Gremlin — Field Reporter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Gremlin's Dispatch — News Hub World",
    description: GREMLIN_DESCRIPTION,
    images: ['/gremlin-banner.png'],
  },
}

export default function GremlinDispatchPage() {
  const db = getDb()
  const posts = db.prepare(
    `SELECT id, slug, title, excerpt, series, character, created_at
     FROM content WHERE character = 'gremlin' AND published = 1 ORDER BY created_at DESC`
  ).all() as ContentSummary[]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
      <CharacterCard
        name="GREMLIN"
        role="The Gremlin"
        statusLine="FIELD REPORT INCOMING"
        description="Chaotic-good. Gets The Build Log, adds snarky commentary, reports to Pelican."
        href="/dispatch/gremlin"
        portraitSrc="/gremlin-banner.png"
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
          <div className="flex flex-col gap-6">
            {posts.map((post) => {
              const seriesLabel = getSeriesLabel(post.series)
              return (
                <article
                  key={post.id}
                  className="border-l-2 border-nhw-amber pl-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-label-sm text-nhw-amber/60 uppercase tracking-widest">
                      FIELD LOG — {formatDate(post.created_at)}
                    </span>
                    {seriesLabel && (
                      <span className="bg-nhw-amber/10 text-nhw-amber border border-nhw-amber/30 text-label-sm uppercase tracking-widest px-2 py-0.5">
                        {seriesLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-label-lg text-nhw-cyan uppercase tracking-widest">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-body-md text-white/70">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/dispatch/gremlin/${post.slug}`}
                    className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity"
                  >
                    READ_FULL_REPORT &gt;
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
