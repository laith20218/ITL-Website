import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { AdminShell } from '@/components/itl/admin/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin-login')
  if (user.role !== 'admin') redirect('/')

  return <AdminShell>{children}</AdminShell>
}
