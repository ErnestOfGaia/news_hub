import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import { Content } from '@/types'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const db = getDb()
  const article = db.prepare('SELECT title, excerpt FROM content WHERE slug = ? AND published = 1').get(slug) as Pick<Content, 'title' | 'excerpt'> | undefined

  if (!article) {
    return {}
  }

  return {
    title: article.title,
    description: article.excerpt || undefined,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = getDb()
  const article = db.prepare('SELECT title FROM content WHERE slug = ? AND published = 1').get(slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="max-w-prose mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{slug} — to be implemented in Issue #4</h1>
      <p>Article content placeholder.</p>
    </main>
  )
}
