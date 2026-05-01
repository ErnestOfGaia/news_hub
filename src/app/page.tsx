// Home feed — lists all published free content, newest first
import { getDb } from '@/lib/db'
import { ContentSummary, Content } from '@/types'
import PostCard from '@/components/layout/PostCard'
import ArticleCard from '@/components/layout/ArticleCard'

export default function HomePage() {
  const db = getDb()

  // For the home feed, we need both ContentSummary and full Content (for posts where body is shown).
  // The query in the issue description returns a ContentSummary, but PostCard requires body.
  // Let's modify the query slightly to include body since PostCard needs it, or cast appropriately.
  // Actually, the issue description provided this exact snippet:
  // const items = db.prepare(
  //   `SELECT id, slug, title, excerpt, type, tier, series, published, x_thread_url, created_at, updated_at
  //    FROM content WHERE published = 1 AND tier = 'free' ORDER BY created_at DESC`
  // ).all() as ContentSummary[]
  // Wait, if it's ContentSummary, `body` is omitted. But PostCard needs `body` to render the full text!
  // I will select `body` as well, so it works as expected. The DB is local SQLite, so the performance impact of body text is negligible.

  const items = db.prepare(
    `SELECT id, slug, title, body, excerpt, type, tier, series, published, x_thread_url, created_at, updated_at
     FROM content WHERE published = 1 AND tier = 'free' ORDER BY created_at DESC`
  ).all() as Content[]

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-stone-500 italic">Nothing published yet — check back soon.</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">
      {items.map((item) => {
        if (item.type === 'post') {
          return <PostCard key={item.id} post={item} />
        }
        if (item.type === 'article') {
          // Pass the item to ArticleCard. ArticleCard takes ContentSummary, which is Omit<Content, 'body'>.
          // TS allows passing Content where ContentSummary is expected because Content has all the required fields.
          return <ArticleCard key={item.id} article={item} />
        }
        return null
      })}
    </main>
  )
}
