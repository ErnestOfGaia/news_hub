'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Delete (trash) a content row from the edit page. Calls the admin-only
// DELETE /api/content/[id] endpoint, then returns to the dashboard.
export function DeleteContentButton({ id, title }: { id: number; title: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    const ok = window.confirm(
      `Delete "${title}"?\n\nThis permanently removes the draft and cannot be undone.`
    )
    if (!ok) return

    setBusy(true)
    const res = await fetch(`/api/content/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setBusy(false)
      window.alert('Delete failed. Please try again.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  )
}
