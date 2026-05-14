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
    <div className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:text-nhw-cyan prose-headings:font-semibold prose-a:text-nhw-amber hover:prose-a:text-nhw-amber/80 prose-strong:text-nhw-cyan prose-em:text-white/60 prose-code:text-nhw-amber prose-pre:bg-nhw-surface prose-pre:border prose-pre:border-nhw-cyan/30 prose-hr:border-nhw-cyan/30">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
