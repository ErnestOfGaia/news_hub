'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ContentStatus, ContentSummary } from '@/types'
import { canTransition } from '@/lib/content-transitions'
import { authorChip, voiceChip } from '@/components/admin/chips'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export type KanbanRow = Pick<
  ContentSummary,
  'id' | 'title' | 'author' | 'character' | 'status' | 'updated_at'
>

const COLUMNS: { status: ContentStatus; label: string }[] = [
  { status: 'draft', label: 'Draft' },
  { status: 'pending_review', label: 'Pending Review' },
  { status: 'changes_requested', label: 'Changes Requested' },
  { status: 'approved', label: 'Approved' },
  { status: 'published', label: 'Published' },
]

interface Toast {
  message: string
  ok: boolean
}

// ─── Card ────────────────────────────────────────────────────────────────────

function KanbanCard({ card }: { card: KanbanRow }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(card.id),
    data: card,
  })
  const author = authorChip(card.author)
  const voice = voiceChip(card.character)
  const style = transform
    ? { transform: CSS.Transform.toString(transform), opacity: isDragging ? 0.4 : 1 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-stone-50 border border-stone-200 rounded-md p-3 cursor-grab active:cursor-grabbing touch-none select-none hover:border-stone-400 hover:bg-white transition-colors"
    >
      <Link
        href={`/admin/${card.id}`}
        className="block mb-2"
        draggable={false}
      >
        <p className="text-sm font-medium text-stone-900 line-clamp-2">{card.title}</p>
      </Link>
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${author.className}`}>
          {author.label}
        </span>
        {voice && (
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${voice.className}`}>
            {voice.label}
          </span>
        )}
      </div>
      <p className="text-xs text-stone-400">{formatDate(card.updated_at)}</p>
    </div>
  )
}

// ─── Column ──────────────────────────────────────────────────────────────────

function KanbanColumn({
  status,
  label,
  cards,
}: {
  status: ContentStatus
  label: string
  cards: KanbanRow[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex-none w-64 bg-white border rounded-lg shadow-sm flex flex-col transition-colors ${
        isOver ? 'border-stone-400 bg-stone-50' : 'border-stone-200'
      }`}
    >
      <div className="px-4 py-3 border-b border-stone-200 flex justify-between items-center">
        <span className="text-sm font-semibold text-stone-700">{label}</span>
        <span className="text-xs text-stone-400 font-medium">{cards.length}</span>
      </div>
      <div className="flex flex-col gap-2 p-3 flex-1 min-h-16">
        {cards.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-6">No items</p>
        ) : (
          cards.map((card) => <KanbanCard key={card.id} card={card} />)
        )}
      </div>
    </div>
  )
}

// ─── Board ───────────────────────────────────────────────────────────────────

export function KanbanBoard({ initialItems }: { initialItems: KanbanRow[] }) {
  const [items, setItems] = useState<KanbanRow[]>(initialItems)
  const [toast, setToast] = useState<Toast | null>(null)
  const [activeCard, setActiveCard] = useState<KanbanRow | null>(null)
  // When dragging to 'changes_requested', we pause and ask for review_notes
  const [pendingDrop, setPendingDrop] = useState<{ contentId: number } | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  async function doTransition(id: number, toStatus: ContentStatus, notes: string | null) {
    const snapshot = items
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: toStatus } : i)))

    const res = await fetch(`/api/content/${id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: toStatus, review_notes: notes }),
    })

    if (res.ok) {
      const updated = (await res.json()) as KanbanRow
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                id: updated.id,
                title: updated.title,
                author: updated.author,
                character: updated.character,
                status: updated.status,
                updated_at: updated.updated_at,
              }
            : i
        )
      )
      setToast({ message: 'Status updated', ok: true })
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setItems(snapshot)
      setToast({ message: data.error ?? 'Transition failed', ok: false })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const card = items.find((i) => String(i.id) === event.active.id)
    setActiveCard(card ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null)
    const { active, over } = event
    if (!over) return

    const toStatus = over.id as ContentStatus
    const card = items.find((i) => String(i.id) === active.id)
    if (!card || card.status === toStatus) return

    if (!canTransition(card.status, toStatus)) {
      setToast({ message: `Cannot move from ${card.status} to ${toStatus}`, ok: false })
      return
    }

    if (toStatus === 'changes_requested') {
      setPendingDrop({ contentId: card.id })
      setReviewNotes('')
      return
    }

    doTransition(card.id, toStatus, null)
  }

  async function submitModal() {
    if (!pendingDrop || !reviewNotes.trim()) return
    await doTransition(pendingDrop.contentId, 'changes_requested', reviewNotes)
    setPendingDrop(null)
    setReviewNotes('')
  }

  function cancelModal() {
    setPendingDrop(null)
    setReviewNotes('')
  }

  const byStatus = Object.fromEntries(
    COLUMNS.map(({ status }) => [status, items.filter((i) => i.status === status)])
  ) as Record<ContentStatus, KanbanRow[]>

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(({ status, label }) => (
            <KanbanColumn key={status} status={status} label={label} cards={byStatus[status]} />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className="bg-white border border-stone-400 rounded-md p-3 shadow-xl rotate-1 w-64 opacity-95">
              <p className="text-sm font-medium text-stone-900 line-clamp-2">{activeCard.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Changes-requested modal */}
      {pendingDrop && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-stone-900 mb-1">Request Changes</h2>
            <p className="text-sm text-stone-500 mb-4">
              Describe what needs to change before this can be approved.
            </p>
            <textarea
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-white text-stone-900 placeholder:text-stone-400 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-stone-500 mb-4"
              placeholder="What needs to change…"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelModal}
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={submitModal}
                disabled={!reviewNotes.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            toast.ok ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  )
}
