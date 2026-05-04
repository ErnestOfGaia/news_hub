import Link from 'next/link'
import { getDb } from '@/lib/db'
import { Content } from '@/types'
import { notFound } from 'next/navigation'

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id)

  if (isNaN(id)) {
    notFound()
  }

  const db = getDb()
  const item = db.prepare('SELECT * FROM content WHERE id = ?').get(id) as Content | undefined

  if (!item) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Edit Content</h1>
        <Link href="/admin" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      <form action={`/api/content/${id}`} method="POST" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
            <p className="text-stone-400 text-sm font-mono bg-stone-50 px-3 py-2 border border-stone-200 rounded-md">
              {item.slug}
            </p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={item.title}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-stone-700 mb-1">Type</label>
            <select
              id="type"
              name="type"
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              defaultValue={item.type}
            >
              <option value="post">Post (Short-form)</option>
              <option value="article">Article (Long-form)</option>
            </select>
          </div>

          <div>
            <label htmlFor="tier" className="block text-sm font-medium text-stone-700 mb-1">Tier</label>
            <select
              id="tier"
              name="tier"
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              defaultValue={item.tier}
            >
              <option value="free">Free (Public)</option>
              <option value="premium">Premium (Gated)</option>
            </select>
          </div>

          <div>
            <label htmlFor="series" className="block text-sm font-medium text-stone-700 mb-1">Series</label>
            <select
              id="series"
              name="series"
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              defaultValue={item.series || ''}
            >
              <option value="">(none)</option>
              <option value="build-log">The Build Log</option>
              <option value="new-news">New News</option>
              <option value="jules-experience">The Jules Experience</option>
            </select>
          </div>

          <div>
            <label htmlFor="x_thread_url" className="block text-sm font-medium text-stone-700 mb-1">X Thread URL</label>
            <input
              type="url"
              id="x_thread_url"
              name="x_thread_url"
              defaultValue={item.x_thread_url || ''}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              placeholder="https://x.com/..."
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-stone-700 mb-1">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={item.excerpt || ''}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="body" className="block text-sm font-medium text-stone-700 mb-1">Body * (Markdown)</label>
            <textarea
              id="body"
              name="body"
              required
              rows={20}
              defaultValue={item.body}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 font-mono text-sm"
            />
          </div>
        </div>

        {/*
          To prevent Enter from triggering Unpublish by default,
          we place a hidden submit button first.
        */}
        <button type="submit" name="action" value={item.published === 1 ? 'publish' : 'draft'} className="hidden" aria-hidden="true" tabIndex={-1} />

        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <div>
            {item.published === 1 && (
              <button
                type="submit"
                name="action"
                value="unpublish"
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Unpublish
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              name="action"
              value="draft"
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-md shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500"
            >
              Save Draft
            </button>
            <button
              type="submit"
              name="action"
              value="publish"
              className="px-4 py-2 text-sm font-medium text-white bg-stone-900 border border-transparent rounded-md shadow-sm hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
            >
              Update & Publish
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
