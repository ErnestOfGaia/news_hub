export type ContentTier = 'free' | 'premium'
export type ContentType = 'post' | 'article'
export type ContentCharacter = 'pelican' | 'gremlin' | 'zclaude' | 'ag' | null
export type ContentSeries = 'build-log' | 'new-news' | 'jules-experience' | 'pull-request' | null
export type ContentStatus =
  | 'draft'
  | 'pending_review'
  | 'changes_requested'
  | 'approved'
  | 'published'
export type ContentAuthor = 'ernest' | 'trewkat' | 'hermes'

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
  published: 0 | 1
  status: ContentStatus
  author: ContentAuthor
  review_notes: string | null
  published_at: string | null
  x_thread_url: string | null
  created_at: string
  updated_at: string
}

export type ContentRow = Content

// Subset used for list views (body excluded for performance)
export type ContentSummary = Omit<Content, 'body'>
