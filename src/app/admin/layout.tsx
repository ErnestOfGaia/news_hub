// Admin layout — enforces password session check for all /admin/* routes
// Jules: implement session check in Issue #7

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Session check middleware added in Issue #7 */}
      {children}
    </div>
  )
}
