// Optional "Discuss on X" button — shown on articles that have x_thread_url set
// Jules: implement in Issue #4

type Props = {
  xThreadUrl: string
  articleTitle: string
}

export default function XDiscussButton({ xThreadUrl, articleTitle }: Props) {
  return (
    <a
      href={xThreadUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Discuss "${articleTitle}" on X`}
      className="inline-flex items-center gap-1.5 border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
    >
      Discuss on X
    </a>
  )
}
