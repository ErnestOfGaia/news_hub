import React from 'react'
import { Content } from '@/types'
import { formatDate } from '@/lib/utils'

export type PostCardProps = {
  post: Content
}

function getSeriesLabel(series: Content['series']): string | null {
  if (series === 'build-log') return 'The Build Log'
  if (series === 'new-news') return 'New News'
  if (series === 'jules-experience') return 'The Jules Experience'
  return null
}

export default function PostCard({ post }: PostCardProps) {
  const seriesLabel = getSeriesLabel(post.series)

  return (
    <article className="flex flex-col gap-3 py-6">
      {seriesLabel && (
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">
          {seriesLabel}
        </span>
      )}
      <h2 className="text-lg font-medium text-stone-900">{post.title}</h2>
      <div className="prose prose-stone max-w-none text-stone-700">
        <p className="whitespace-pre-wrap">{post.body}</p>
      </div>
      <time className="text-sm text-stone-500 mt-2 block">
        {formatDate(post.created_at)}
      </time>
    </article>
  )
}
