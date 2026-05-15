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
    `SELECT title, excerpt, comic_panels FROM content WHERE character = 'comics' AND slug = ? AND status = 'published'`
  ).get(slug) as Pick<Content, 'title' | 'excerpt' | 'comic_panels'> | undefined

  if (!post) return {}

  const description = post.excerpt ?? undefined
  const ogTitle = `${post.title} — Comic Strips Archive`
  const panels = post.comic_panels ? (JSON.parse(post.comic_panels) as string[]) : []
  const ogImage = panels.length > 0 ? panels[0] : '/comics-banner.png'

  return {
    title: post.title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [ogImage],
    },
  }
}

export default async function ComicsPostPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()
  const post = db.prepare(
    `SELECT * FROM content WHERE character = 'comics' AND slug = ? AND status = 'published'`
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
