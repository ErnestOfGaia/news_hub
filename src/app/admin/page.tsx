import { getDb } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { authorChip, voiceChip } from '@/components/admin/chips'
import type { ContentStatus, ContentSummary } from '@/types'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const COLUMNS: { status: ContentStatus; label: string }[] = [
  { status: 'draft', label: 'Draft' },
  { status: 'pending_review', label: 'Pending Review' },
  { status: 'changes_requested', label: 'Changes Requested' },
  { status: 'approved', label: 'Approved' },
  { status: 'published', label: 'Published' },
]

type KanbanRow = Pick<
  ContentSummary,
  'id' | 'title' | 'author' | 'character' | 'status' | 'updated_at'
>

export default async function AdminPage() {
  await requireAdmin()

  const db = getDb()
  const rows = db
    .prepare(
      `SELECT id, title, author, character, status, updated_at
       FROM content
       ORDER BY updated_at DESC`
    )
    .all() as KanbanRow[]

  const byStatus = Object.fromEntries(
    COLUMNS.map(({ status }) => [status, rows.filter((r) => r.status === status)])
  ) as Record<ContentStatus, KanbanRow[]>

  return (
    <main className="p-6 min-h-screen bg-stone-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Editorial Board</h1>
        <Link
          href="/admin/new"
          className="bg-stone-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          + New draft
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(({ status, label }) => {
          const cards = byStatus[status]
          return (
            <div
              key={status}
              className="flex-none w-64 bg-white border border-stone-200 rounded-lg shadow-sm flex flex-col"
            >
              <div className="px-4 py-3 border-b border-stone-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-stone-700">{label}</span>
                <span className="text-xs text-stone-400 font-medium">{cards.length}</span>
              </div>

              <div className="flex flex-col gap-2 p-3 flex-1">
                {cards.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-6">No items</p>
                ) : (
                  cards.map((card) => {
                    const author = authorChip(card.author)
                    const voice = voiceChip(card.character)
                    return (
                      <Link
                        key={card.id}
                        href={`/admin/${card.id}`}
                        className="block bg-stone-50 border border-stone-200 rounded-md p-3 hover:border-stone-400 hover:bg-white transition-colors"
                      >
                        <p className="text-sm font-medium text-stone-900 line-clamp-2 mb-2">
                          {card.title}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span
                            className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${author.className}`}
                          >
                            {author.label}
                          </span>
                          {voice && (
                            <span
                              className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${voice.className}`}
                            >
                              {voice.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400">{formatDate(card.updated_at)}</p>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
