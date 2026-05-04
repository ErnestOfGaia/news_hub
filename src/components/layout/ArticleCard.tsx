import React from 'react'
import Link from 'next/link'
import { ContentSummary } from '@/types'
import { formatDate } from '@/lib/utils'

export type ArticleCardProps = {
  article: ContentSummary
}

function getSeriesLabel(series: ContentSummary['series']): string | null {
  if (series === 'build-log') return 'The Build Log'
  if (series === 'new-news') return 'New News'
  if (series === 'jules-experience') return 'The Jules Experience'
  return null
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const seriesLabel = getSeriesLabel(article.series)

  return (
    <article className="border border-stone-200 p-5 bg-white flex flex-col gap-3">
      {seriesLabel && (
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          {seriesLabel}
        </span>
      )}
      <h2 className="text-2xl font-newsreader font-medium text-stone-900">{article.title}</h2>
      {article.excerpt && (
        <p className="text-stone-700 leading-relaxed">{article.excerpt}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <time className="text-sm text-stone-500">
          {formatDate(article.created_at)}
        </time>
        <Link
          href={`/articles/${article.slug}`}
          className="text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
        >
          Read article →
        </Link>
      </div>
    </article>
  )
}
