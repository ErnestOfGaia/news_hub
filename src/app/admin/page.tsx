import { getDb } from '@/lib/db'
import { ContentSummary } from '@/types'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const SERIES_LABELS: Record<string, string> = {
  'build-log': 'The Build Log',
  'new-news': 'New News',
  'jules-experience': 'The Jules Experience',
}

export default function AdminPage() {
  const db = getDb()
  const items = db.prepare(
    `SELECT id, slug, title, type, tier, series, published, created_at FROM content ORDER BY created_at DESC`
  ).all() as ContentSummary[]

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
        <Link
          href="/admin/new"
          className="bg-stone-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          New Content
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-6 py-4 text-sm font-semibold text-stone-900">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-stone-900">Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-stone-900">Series</th>
              <th className="px-6 py-4 text-sm font-semibold text-stone-900">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-stone-900">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-stone-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-stone-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 text-sm text-stone-600 capitalize">
                  {item.type}
                </td>
                <td className="px-6 py-4 text-sm text-stone-600">
                  {item.series ? SERIES_LABELS[item.series] || '—' : '—'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {item.published === 1 ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Published
                    </span>
                  ) : (
                    <span className="bg-stone-100 text-stone-800 text-xs px-2 py-1 rounded-full font-medium">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-stone-600">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium">
                  <Link
                    href={`/admin/${item.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-stone-500 text-sm">
                  No content found. Click "New Content" to create some.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
