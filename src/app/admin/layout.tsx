import { requireAdmin } from '@/lib/auth'

// Admin layout — enforces password session check for all /admin/* routes
// Jules: implement session check in Issue #7

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}
