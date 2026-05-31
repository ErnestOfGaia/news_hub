// Ticket 2 — 2026-05-28: renamed ContentCharacter literals (pelican→beacon, gremlin→static),
// added publishing_agent to ContentAuthor, added three new Content fields.
export type ContentTier = 'free' | 'premium'
export type ContentType = 'post' | 'article'
// 'pelican' and 'gremlin' removed; replaced by 'beacon' and 'static' (Trewkat-approved through 2027).
// Legacy rows with old values were renamed in the DB migration (Ticket 1 / initSchema).
export type ContentCharacter = 'beacon' | 'static' | 'zclaude' | 'ag' | null
export type ContentSeries = 'build-log' | 'new-news' | 'jules-experience' | 'pull-request' | null
export type ContentStatus =
  | 'draft'
  | 'pending_review'
  | 'changes_requested'
  | 'approved'
  | 'published'
// 'hermes' kept for backward compat with any rows already written; new submissions use 'publishing_agent'.
export type ContentAuthor = 'ernest' | 'trewkat' | 'hermes' | 'publishing_agent'

export interface Content {
  id: number
  slug: string
  title: string
  body: string
  excerpt: string | null
  type: ContentType
  tier: ContentTier
  series: ContentSeries
  character: ContentCharacter
  comic_panels: string | null
  status: ContentStatus
  author: ContentAuthor
  review_notes: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  // New fields (Ticket 1 schema, Ticket 2 types) — nullable, absent on legacy rows.
  subject: string | null
  audience_in_fiction: 'beacon' | null
  source_seed: string | null
}

export type ContentRow = Content

// Subset used for list views (body excluded for performance)
export type ContentSummary = Omit<Content, 'body'>
