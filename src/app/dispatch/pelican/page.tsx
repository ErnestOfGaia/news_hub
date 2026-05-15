import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import { formatDate, getSeriesLabel } from '@/lib/utils'
import Link from 'next/link'
import CharacterCard from '@/components/ui/CharacterCard'
import NewsCard from '@/components/ui/NewsCard'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function PelicanDispatchPage() {
  const db = getDb()
  const posts = db.prepare(
    `SELECT id, slug, title, excerpt, series, character, created_at
     FROM content WHERE character = 'pelican' AND status = 'published' ORDER BY created_at DESC`
  ).all() as ContentSummary[]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">

      <CharacterCard
        name="PELICAN"
        role="The Guardian"
        statusLine="MONITORING THE HORIZON"
        description="Warm authority. Reports project updates in mission-briefing format. Owns New News."
        href="/dispatch/pelican"
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
                href={`/dispatch/pelican/${post.slug}`}
                openInNewTab={true}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
