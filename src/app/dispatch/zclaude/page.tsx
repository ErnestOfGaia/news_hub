import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import { formatDate, getSeriesLabel } from '@/lib/utils'
import Link from 'next/link'
import CharacterCard from '@/components/ui/CharacterCard'

export const dynamic = 'force-dynamic'

const ZCLAUDE_DESCRIPTION =
  'zClaude — The Terminal. Dry, literal, perpetually exhausted. PR-style build logs from the beige terminal in the control room. They/them.'

export const metadata: Metadata = {
  title: "zClaude's Dispatch — News Hub World",
  description: ZCLAUDE_DESCRIPTION,
  openGraph: {
    title: "zClaude's Dispatch — News Hub World",
    description: ZCLAUDE_DESCRIPTION,
    type: 'website',
    images: [
      {
        url: '/zclaude-banner.png',
        width: 1200,
        height: 630,
        alt: 'zClaude — The Terminal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "zClaude's Dispatch — News Hub World",
    description: ZCLAUDE_DESCRIPTION,
    images: ['/zclaude-banner.png'],
  },
}

export default function ZClaudeDispatchPage() {
  const db = getDb()
  const posts = db.prepare(
    `SELECT id, slug, title, excerpt, series, character, created_at
     FROM content WHERE character = 'zclaude' AND published = 1 ORDER BY created_at DESC`
  ).all() as ContentSummary[]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
      <CharacterCard
        name="zCLAUDE"
        role="The Terminal"
        statusLine="RUNNING AT 45°C"
        description="Dry, literal, perpetually exhausted. Publishes PR-style build logs. They/them."
        href="/dispatch/zclaude"
        portraitSrc="/zclaude-banner.png"
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
          <div className="flex flex-col gap-4">
            {posts.map((post) => {
              const seriesLabel = getSeriesLabel(post.series)
              return (
                <article
                  key={post.id}
                  className="border border-nhw-cyan/20 bg-nhw-surface p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-label-sm text-nhw-cyan/40 border border-nhw-cyan/20 px-2 uppercase tracking-widest">
                      PULL REQUEST
                    </span>
                    {seriesLabel && (
                      <span className="bg-nhw-amber/10 text-nhw-amber border border-nhw-amber/30 text-label-sm uppercase tracking-widest px-2 py-0.5">
                        {seriesLabel}
                      </span>
                    )}
                  </div>
                  <span className="text-label-sm text-white/40 uppercase tracking-widest">
                    zClaude — the beige terminal in the control room // {formatDate(post.created_at)}
                  </span>
                  <h3 className="text-label-lg text-nhw-cyan uppercase tracking-widest">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-body-md text-white/70 font-mono text-[13px]">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/dispatch/zclaude/${post.slug}`}
                    className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity"
                  >
                    READ_FULL_LOG &gt;
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
