'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NewContentPage() {
  const [actionValue, setActionValue] = useState('draft')

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">New Content</h1>
        <Link href="/admin" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      <form action="/api/content" method="POST" className="space-y-6">
        <input type="hidden" name="action" value={actionValue} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              placeholder="e.g. Building the New News Hub"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-stone-700 mb-1">Type</label>
            <select
              id="type"
              name="type"
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              defaultValue="post"
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
              defaultValue="free"
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
              defaultValue=""
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
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              placeholder="A brief summary (optional)"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="body" className="block text-sm font-medium text-stone-700 mb-1">Body * (Markdown)</label>
            <textarea
              id="body"
              name="body"
              required
              rows={20}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 font-mono text-sm"
              placeholder="Write the content in Markdown..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-200">
          <button
            type="submit"
            onClick={() => setActionValue('draft')}
            className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-md shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500"
          >
            Save Draft
          </button>
          <button
            type="submit"
            onClick={() => setActionValue('publish')}
            className="px-4 py-2 text-sm font-medium text-white bg-stone-900 border border-transparent rounded-md shadow-sm hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
          >
            Publish
          </button>
        </div>
      </form>
    </main>
  )
}
