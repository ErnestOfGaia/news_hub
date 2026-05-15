import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import { getSeriesLabel } from '@/lib/utils'
import CharacterCard from '@/components/ui/CharacterCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const COMICS_DESCRIPTION =
  'Comic Strips — The Archive. Visual logs and stories from the Coastal Command Center.'

export const metadata: Metadata = {
  title: 'Comic Strips Archive — News Hub World',
  description: COMICS_DESCRIPTION,
  openGraph: {
    title: 'Comic Strips Archive — News Hub World',
    description: COMICS_DESCRIPTION,
    type: 'website',
    images: [
      {
        url: '/comics-banner.png',
        width: 1200,
        height: 630,
        alt: 'Comic Strips — The Archive',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comic Strips Archive — News Hub World',
    description: COMICS_DESCRIPTION,
    images: ['/comics-banner.png'],
  },
}

export default function ComicsDispatchPage() {
  const db = getDb()
  const posts = db.prepare(
    `SELECT id, slug, title, excerpt, series, character, created_at, comic_panels
     FROM content WHERE character = 'comics' AND status = 'published' ORDER BY created_at DESC`
  ).all() as ContentSummary[]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">

      <CharacterCard
        name="COMIC STRIPS"
        role="The Archive"
        statusLine="AVAILABLE"
        description="Visual logs and stories from the Coastal Command Center."
        href="/dispatch/comics"
        portraitSrc="/comics-banner.png"
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
          <div className="flex flex-col gap-8">
            {posts.map((post) => {
              const panels = post.comic_panels ? JSON.parse(post.comic_panels) : []
              const coverImage = panels.length > 0 ? panels[0] : '/placeholder.jpg'

              return (
                <Link
                  key={post.id}
                  href={`/dispatch/comics/${post.slug}`}
                  className="relative block w-full h-64 md:h-80 lg:h-96 rounded-sm overflow-hidden border border-nhw-cyan/30 hover:border-nhw-cyan/60 group bg-nhw-surface"
                >
                  <img
                    src={coverImage}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nhw-bg/90 via-nhw-bg/20 to-transparent z-0 pointer-events-none" />
                  
                  <div className="absolute bottom-0 left-0 p-6 z-10 w-full flex flex-col gap-2">
                    {post.series && (
                      <span className="text-label-sm text-nhw-amber uppercase tracking-widest">
                        {getSeriesLabel(post.series)}
                      </span>
                    )}
                    <h3 className="text-headline-md text-nhw-cyan uppercase drop-shadow-md">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
