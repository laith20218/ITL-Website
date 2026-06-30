import { db } from '@/lib/db'
import { Header } from '@/components/itl/header'
import { Footer } from '@/components/itl/footer'
import { NotificationsList } from '@/components/itl/notifications-list'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  let notifications: any[] = []
  try {
    notifications = await db.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  } catch {}

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gradient-gold font-display mb-6">الإشعارات</h1>
        <NotificationsList notifications={JSON.parse(JSON.stringify(notifications))} />
      </main>
      <Footer />
    </div>
  )
}
