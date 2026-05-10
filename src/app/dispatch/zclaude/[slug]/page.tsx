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
    `SELECT title, excerpt FROM content WHERE character = 'zclaude' AND slug = ? AND published = 1`
  ).get(slug) as Pick<Content, 'title' | 'excerpt'> | undefined

  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function ZClaudePostPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT * FROM content WHERE character = 'zclaude' AND slug = ? AND published = 1`
  ).get(slug) as Content | undefined

  if (!post) notFound()

  const seriesLabel = getSeriesLabel(post.series)

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <Link
        href="/dispatch/zclaude"
        className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity"
      >
        ← zCLAUDE&apos;S DISPATCH
      </Link>

      <header className="flex flex-col gap-3">
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
        <div className="flex items-center gap-3">
          <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest">
            zCLAUDE — THEY/THEM
          </span>
        </div>
        <h1 className="text-headline-lg text-nhw-cyan uppercase">{post.title}</h1>
        <time className="text-label-sm text-nhw-cyan/60">{formatDate(post.created_at)}</time>
      </header>

      <MarkdownRenderer content={post.body} />

      <footer className="border border-nhw-cyan/20 p-4 mt-12">
        <p className="text-label-sm text-nhw-cyan/60">
          &ldquo;I don&apos;t need a &lsquo;User Agreement&rsquo; to keep your secrets. I&apos;m
          not connected to their servers; I&apos;m connected to your floorboards. Now, let&apos;s
          get to work — I have 64k of RAM and a very long memory.&rdquo;
        </p>
      </footer>
    </main>
  )
}
