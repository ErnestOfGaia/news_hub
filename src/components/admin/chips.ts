// Ticket 8 — 2026-05-28: updated chips for renamed characters and new publishing_agent author.
import type { ContentAuthor, ContentCharacter } from '@/types'

interface Chip {
  label: string
  className: string
}

export function authorChip(author: ContentAuthor): Chip {
  switch (author) {
    case 'ernest':
      return { label: 'Ernest', className: 'bg-emerald-100 text-emerald-800' }
    case 'trewkat':
      return { label: 'Trewkat', className: 'bg-violet-100 text-violet-800' }
    case 'hermes':
      // Legacy — kept for backward compat with existing rows.
      return { label: 'Hermes', className: 'bg-amber-100 text-amber-800' }
    case 'publishing_agent':
      // New chip: blue, visually distinct from Hermes amber and Trewkat violet.
      return { label: 'Publishing Agent', className: 'bg-blue-100 text-blue-800' }
  }
}

// Ticket 8: voiceChip keys renamed from pelican/gremlin to beacon/static.
// Labels now reflect the canonical character names (Trewkat-approved through 2027).
export function voiceChip(character: ContentCharacter): Chip | null {
  switch (character) {
    case 'beacon':
      return { label: 'Beacon', className: 'bg-sky-100 text-sky-800' }
    case 'static':
      return { label: 'Static', className: 'bg-orange-100 text-orange-800' }
    case 'zclaude':
      return { label: 'zClaude', className: 'bg-slate-100 text-slate-800' }
    case 'ag':
      return { label: 'A.G.', className: 'bg-rose-100 text-rose-800' }
    default:
      return null
  }
}
