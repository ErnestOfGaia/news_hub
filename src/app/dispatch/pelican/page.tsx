import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import { formatDate, getSeriesLabel } from '@/lib/utils'
import Link from 'next/link'
import CharacterCard from '@/components/ui/CharacterCard'

export default function PelicanDispatchPage() {
  const db = getDb()
  const posts = db.prepare(
    `SELECT id, slug, title, excerpt, series, character, created_at
     FROM content WHERE character = 'pelican' AND published = 1 ORDER BY created_at DESC`
  ).all() as ContentSummary[]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
      <CharacterCard
        name="PELICAN"
        role="The Guardian"
        statusLine="MONITORING THE HORIZON"
        description="Warm authority. Reports project updates in mission-briefing format. Owns New News."
        href="/dispatch/pelican"
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
                <article key={post.id} className="flex flex-col gap-2 border-b border-nhw-cyan/10 pb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest">
                      STATUS: ACTIVE // {formatDate(post.created_at)}
                    </span>
                    {seriesLabel && (
                      <span className="bg-nhw-amber/10 text-nhw-amber border border-nhw-amber/30 text-label-sm uppercase tracking-widest px-2 py-0.5">
                        {seriesLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-headline-md text-nhw-cyan uppercase">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-body-md text-white/70">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/dispatch/pelican/${post.slug}`}
                    className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity"
                  >
                    READ_SIGNAL &gt;
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
