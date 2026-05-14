import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { Content } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT title, excerpt FROM content WHERE character = 'comics' AND slug = ? AND published = 1`
  ).get(slug) as Pick<Content, 'title' | 'excerpt'> | undefined

  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function ComicsPostPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT * FROM content WHERE character = 'comics' AND slug = ? AND published = 1`
  ).get(slug) as Content | undefined

  if (!post) notFound()

  const panels = post.comic_panels ? JSON.parse(post.comic_panels) : []

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Link
          href="/dispatch/comics"
          className="text-label-sm text-nhw-cyan hover:opacity-70 transition-opacity"
        >
          ← COMIC STRIPS ARCHIVE
        </Link>
        <h1 className="text-headline-lg text-nhw-cyan uppercase mt-4">{post.title}</h1>
      </div>

      <div className="flex flex-col items-center w-full gap-4 pb-20">
        {panels.length === 0 ? (
          <p className="text-body-lg text-white/50">No comic panels found.</p>
        ) : (
          panels.map((panelSrc: string, index: number) => (
            <img
              key={index}
              src={panelSrc}
              alt={`Panel ${index + 1}`}
              className="w-full h-auto object-contain border border-nhw-cyan/20"
            />
          ))
        )}
      </div>
    </main>
  )
}
