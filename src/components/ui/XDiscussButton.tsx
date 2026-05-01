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
    >
      Discuss on X
    </a>
  )
}
