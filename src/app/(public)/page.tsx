// Home feed — lists all published free content, newest first
import { getDb } from '@/lib/db'
import { Content } from '@/types'
import PostCard from '@/components/layout/PostCard'
import ArticleCard from '@/components/layout/ArticleCard'

export default function HomePage() {
  const db = getDb()

  const items = db.prepare(
    `SELECT id, slug, title, body, excerpt, type, tier, series, published, x_thread_url, created_at, updated_at
     FROM content WHERE published = 1 AND tier = 'free' ORDER BY created_at DESC`
  ).all() as Content[]

  if (items.length === 0) {
    return (
      <main className="py-12">
        <p className="text-stone-500 italic">Nothing published yet — check back soon.</p>
      </main>
    )
  }

  return (
    <main className="py-12 flex flex-col gap-8">
      {items.map((item) => {
      if (item.type === 'post') {
        return <PostCard key={item.id} post={item} />
      }
      if (item.type === 'article') {
        return <ArticleCard key={item.id} article={item} />
      }
        return null
      })}
    </main>
  )
}
