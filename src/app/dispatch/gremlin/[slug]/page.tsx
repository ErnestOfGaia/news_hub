import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { Content } from '@/types'
import { formatDate, getSeriesLabel } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT title, excerpt FROM content WHERE character = 'gremlin' AND slug = ? AND published = 1`
  ).get(slug) as Pick<Content, 'title' | 'excerpt'> | undefined

  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function GremlinPostPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT * FROM content WHERE character = 'gremlin' AND slug = ? AND published = 1`
  ).get(slug) as Content | undefined

  if (!post) notFound()

  const seriesLabel = getSeriesLabel(post.series)

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <Link
        href="/dispatch/gremlin"
        className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity"
      >
        ← GREMLIN&apos;S DISPATCH
      </Link>

      <header className="flex flex-col gap-3 border-l-2 border-nhw-amber pl-4">
        <div className="flex items-center gap-3">
          <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest">
            GREMLIN — THE GREMLIN
          </span>
          {seriesLabel && (
            <span className="bg-nhw-amber/10 text-nhw-amber border border-nhw-amber/30 text-label-sm uppercase tracking-widest px-2 py-0.5">
              {seriesLabel}
            </span>
          )}
        </div>
        <h1 className="text-headline-lg text-nhw-cyan uppercase">{post.title}</h1>
        <time className="text-label-sm text-nhw-amber/60">{formatDate(post.created_at)}</time>
      </header>

      <MarkdownRenderer content={post.body} />
    </main>
  )
}
