import { notFound } from 'next/navigation'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import XDiscussButton from '@/components/ui/XDiscussButton'
import { getDb } from '@/lib/db'
import { Content } from '@/types'
import { formatDate } from '@/lib/utils'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb()
  const item = db.prepare('SELECT * FROM content WHERE slug = ?').get(slug) as Content | undefined

  if (!item || item.published === 0 || item.tier !== 'free') {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <main>
        <article className="max-w-prose mx-auto">
          {item.series && (
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4 block">
              {item.series === 'build-log' ? 'The Build Log' : item.series === 'new-news' ? 'New News' : 'The Jules Experience'}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-newsreader font-medium text-stone-900 mb-6">{item.title}</h1>
          <time className="text-sm text-stone-500 mb-8 block">{formatDate(item.created_at)}</time>
          <MarkdownRenderer content={item.body} />
          {item.x_thread_url && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <XDiscussButton xThreadUrl={item.x_thread_url} articleTitle={item.title} />
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
