export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {children}
    </div>
  )
}
