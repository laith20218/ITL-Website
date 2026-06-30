'use client'
import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'

interface Notification {
  id: string
  title: string
  message: string
  link?: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationsList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-20">
        <Bell className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground">لا توجد إشعارات</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-2xl">
      {notifications.map((n, i) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className={`luxury-card rounded-xl p-4 ${!n.isRead ? 'border-[#D4AF37]/40' : ''}`}
        >
          <div className="flex items-start gap-3">
            {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />}
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">{n.title}</h3>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <span className="text-[10px] text-muted-foreground/60 mt-2 block">
                {new Date(n.createdAt).toLocaleString('ar-EG')}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
