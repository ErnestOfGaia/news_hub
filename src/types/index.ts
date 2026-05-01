export type ContentTier = 'free' | 'premium'
export type ContentType = 'post' | 'article'
export type ContentSeries = 'build-log' | 'new-news' | 'jules-experience' | null

export interface Content {
  id: number
  slug: string
  title: string
  body: string
  excerpt: string | null
  type: ContentType
  tier: ContentTier
  series: ContentSeries
  published: 0 | 1
  x_thread_url: string | null
  created_at: string
  updated_at: string
}

export type ContentRow = Content

// Subset used for list views (body excluded for performance)
export type ContentSummary = Omit<Content, 'body'>
