<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main

  return {
    title: article.title,
    description: article.excerpt || undefined,
  }
}
<<<<<<< HEAD

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
=======

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
>>>>>>> origin/main
    </main>
  )
}
