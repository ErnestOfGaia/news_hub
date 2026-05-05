import React from 'react'
import Link from 'next/link'
import { ContentSummary } from '@/types'
import { formatDate, getSeriesLabel } from '@/lib/utils'

export type ArticleCardProps = {
  article: ContentSummary
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const seriesLabel = getSeriesLabel(article.series)

  return (
    <article className="border border-stone-200 p-6 rounded-lg bg-white shadow-sm flex flex-col gap-3">
      {seriesLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {seriesLabel}
        </span>
      )}
      <h2 className="text-xl font-bold text-stone-900">{article.title}</h2>
      {article.excerpt && (
        <p className="text-stone-700 leading-relaxed">{article.excerpt}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <time className="text-sm text-stone-500">
          {formatDate(article.created_at)}
        </time>
        <Link
          href={`/articles/${article.slug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Read article →
        </Link>
      </div>
    </article>
  )
}
