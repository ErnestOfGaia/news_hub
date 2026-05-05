'use client'
// Renders Markdown body using react-markdown + remark-gfm
// Jules: wire up Tailwind prose styles in Issue #4

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  content: string
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-stone max-w-none prose-pre:bg-stone-100 prose-pre:text-stone-800 prose-pre:border prose-pre:border-stone-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
