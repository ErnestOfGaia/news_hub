// Admin edit content form — to be implemented in Issue #10

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main>
      <p>Edit content {id} — to be implemented in Issue #10</p>
    </main>
  )
}
