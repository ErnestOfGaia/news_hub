import type { ContentStatus } from '@/types'

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
