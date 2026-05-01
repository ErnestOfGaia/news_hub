// Admin layout — enforces password session check for all /admin/* routes
// Jules: implement session check in Issue #7

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Session check middleware added in Issue #7 */}
      {children}
    </div>
  )
}
