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
      return { label: 'Hermes', className: 'bg-amber-100 text-amber-800' }
  }
}

export function voiceChip(character: ContentCharacter): Chip | null {
  switch (character) {
    case 'pelican':
      return { label: 'Pelican', className: 'bg-sky-100 text-sky-800' }
    case 'gremlin':
      return { label: 'Gremlin', className: 'bg-orange-100 text-orange-800' }
    case 'zclaude':
      return { label: 'zClaude', className: 'bg-slate-100 text-slate-800' }
    case 'ag':
      return { label: 'AG', className: 'bg-rose-100 text-rose-800' }
    default:
      return null
  }
}
