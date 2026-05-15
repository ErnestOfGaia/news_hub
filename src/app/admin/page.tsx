import { getDb } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { KanbanBoard, type KanbanRow } from '@/components/admin/KanbanBoard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

      <KanbanBoard initialItems={rows} />
    </main>
  )
}
