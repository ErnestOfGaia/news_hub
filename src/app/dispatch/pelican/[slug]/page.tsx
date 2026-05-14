import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { Content } from '@/types'
import { formatDate, getSeriesLabel } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import Image from 'next/image'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT title, excerpt FROM content WHERE character = 'pelican' AND slug = ? AND published = 1`
  ).get(slug) as Pick<Content, 'title' | 'excerpt'> | undefined

  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function PelicanPostPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT * FROM content WHERE character = 'pelican' AND slug = ? AND published = 1`
  ).get(slug) as Content | undefined

  if (!post) notFound()

  const seriesLabel = getSeriesLabel(post.series)

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <Link
        href="/dispatch/pelican"
        className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity"
      >
        ← PELICAN&apos;S DISPATCH
      </Link>

      {/* Banner */}
      <section className="w-full h-48 sm:h-64 lg:h-80 relative overflow-hidden border-2 border-nhw-cyan group">
        <Image
          src="/pelican-banner.png"
          alt="Pelican Banner"
          fill
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nhw-surface/90 via-transparent to-transparent pointer-events-none" />
      </section>

      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest">
            PELICAN — THE GUARDIAN
          </span>
          {seriesLabel && (
            <span className="bg-nhw-amber/10 text-nhw-amber border border-nhw-amber/30 text-label-sm uppercase tracking-widest px-2 py-0.5">
              {seriesLabel}
            </span>
          )}
        </div>
        <h1 className="text-headline-lg text-nhw-cyan uppercase">{post.title}</h1>
        <time className="text-label-sm text-nhw-cyan/60">{formatDate(post.created_at)}</time>
      </header>

      <MarkdownRenderer content={post.body} />
    </main>
  )
}
