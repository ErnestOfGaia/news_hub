// Long-form article preview card (type: 'article') — Jules: implement in Issue #3
import type { ContentSummary } from '@/types'

type Props = {
  article: ContentSummary
}

export default function ArticleCard({ article }: Props) {
  return (
    <article>
      {/* Implemented in Issue #3 */}
      <p>{article.title}</p>
    </article>
  )
}
