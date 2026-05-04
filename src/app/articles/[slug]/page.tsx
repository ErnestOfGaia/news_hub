import { getDb } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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
    .get(slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="max-w-prose mx-auto py-12 px-4">
      {/* Article content implementation in a future issue */}
      <p className="text-stone-500 italic">Article: {slug}</p>
    </main>
  )
}
