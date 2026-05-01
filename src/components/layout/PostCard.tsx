// Short-form post card (type: 'post') — Jules: implement in Issue #3
import type { ContentSummary } from '@/types'

type Props = {
  post: ContentSummary
}

export default function PostCard({ post }: Props) {
  return (
    <article>
      {/* Implemented in Issue #3 */}
      <p>{post.title}</p>
    </article>
  )
}
