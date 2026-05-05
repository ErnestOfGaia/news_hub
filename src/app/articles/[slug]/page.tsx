import { getDb } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Content } from '@/types'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = getDb()
  const article = db
    .prepare('SELECT title, excerpt FROM content WHERE slug = ? AND published = 1')
    .get(slug) as { title: string; excerpt: string | null } | undefined

  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt || undefined,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const db = getDb()
  const article = db
    .prepare('SELECT * FROM content WHERE slug = ? AND published = 1')
    .get(slug) as Content | undefined

  if (!article) {
    notFound()
  }

  return (
    <main className="max-w-prose mx-auto py-12 px-4 space-y-8">
      <Link
        href="/"
        className="text-sm text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
      >
        ← Back to feed
      </Link>

      <article className="space-y-6">
        <header className="space-y-2">
          {article.series && (
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              {article.series.replace('-', ' ')}
            </span>
          )}
          <h1 className="text-4xl font-serif font-bold text-stone-900 leading-tight">
            {article.title}
          </h1>
          <div className="text-sm text-stone-500">{formatDate(article.created_at)}</div>
        </header>

        <MarkdownRenderer content={article.body} />
      </article>

      <hr className="border-stone-200" />

      <footer className="py-8 space-y-4">
        <h3 className="font-serif text-xl font-bold text-stone-900">Questions or thoughts?</h3>
        <p className="text-stone-600">
          Connect with Ernest on LinkedIn to discuss this article.
        </p>
        <a
          href="https://www.linkedin.com/in/ernestofgaia/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-stone-900 text-stone-50 px-6 py-3 rounded-none font-medium hover:bg-stone-800 transition-colors"
        >
          Discuss on LinkedIn
        </a>
      </footer>
    </main>
  )
}
