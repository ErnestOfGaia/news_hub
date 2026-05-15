import { getDb } from './db'
import type { Content, ContentStatus } from '@/types'

export const ALLOWED_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  draft: ['pending_review', 'published'],
  pending_review: ['changes_requested', 'approved'],
  changes_requested: ['pending_review'],
  approved: ['published'],
  published: ['draft'],
}

export function canTransition(from: ContentStatus, to: ContentStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false
}

export class TransitionError extends Error {
  code: 'not_found' | 'illegal_transition' | 'missing_review_notes'
  constructor(code: TransitionError['code'], message: string) {
    super(message)
    this.code = code
  }
}

export interface ApplyTransitionOptions {
  reviewNotes?: string | null
}

export function applyTransition(
  id: number,
  to: ContentStatus,
  { reviewNotes }: ApplyTransitionOptions = {}
): Content {
  const db = getDb()
  const current = db.prepare('SELECT status FROM content WHERE id=?').get(id) as
    | { status: ContentStatus }
    | undefined

  if (!current) {
    throw new TransitionError('not_found', `Content ${id} not found`)
  }
  if (!canTransition(current.status, to)) {
    throw new TransitionError(
      'illegal_transition',
      `Cannot transition from ${current.status} to ${to}`
    )
  }
  if (to === 'changes_requested' && !reviewNotes?.trim()) {
    throw new TransitionError(
      'missing_review_notes',
      'review_notes required when transitioning to changes_requested'
    )
  }

  const publishedAtParam = to === 'published' ? new Date().toISOString() : null
  const notesParam = reviewNotes?.trim() || null

  db.prepare(
    `UPDATE content
       SET status = ?,
           review_notes = COALESCE(?, review_notes),
           published_at = COALESCE(?, published_at),
           updated_at = datetime('now')
     WHERE id = ?`
  ).run(to, notesParam, publishedAtParam, id)

  return db.prepare('SELECT * FROM content WHERE id=?').get(id) as Content
}
