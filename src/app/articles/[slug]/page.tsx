// Individual article page — to be implemented in Issue #4

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <p>Article: {slug} — to be implemented in Issue #4</p>
    </main>
  )
}
