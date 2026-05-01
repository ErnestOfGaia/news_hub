// Individual article page — to be implemented in Issue #4

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <p>Article: {params.slug} — to be implemented in Issue #4</p>
    </main>
  )
}
