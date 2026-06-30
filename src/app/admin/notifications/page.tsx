import { db } from '@/lib/db'
import { AdminNotifications } from '@/components/itl/admin/admin-notifications'

export const dynamic = 'force-dynamic'

export default async function AdminNotificationsPage() {
  const notifications = await db.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  return <AdminNotifications notifications={JSON.parse(JSON.stringify(notifications))} />
}
