'use client'
import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useSounds } from './sound-provider'

interface Notification {
  id: string
  title: string
  message: string
  link?: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { play } = useSounds()

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || [])
        setUnreadCount(data.notifications?.filter((n: Notification) => !n.isRead).length || 0)
      })
      .catch(() => {})
  }, [])

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PUT' }).catch(() => {})
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(prev - 1, 0))
    play('click')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="الإشعارات">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto luxury-card" style={{ zIndex: 200 }}>
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">لا توجد إشعارات</div>
        ) : (
          <>
            {notifications.slice(0, 5).map((n, i) => (
              <DropdownMenuItem
                key={n.id}
                className="cursor-pointer p-3 border-b border-border/30 last:border-0"
                onClick={() => markAsRead(n.id)}
              >
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col gap-1 w-full"
                >
                  <div className="flex items-center gap-2">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />}
                    <p className="font-medium text-sm flex-1">{n.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                  <span className="text-[10px] text-muted-foreground/60">
                    {new Date(n.createdAt).toLocaleString('ar-EG')}
                  </span>
                </motion.div>
              </DropdownMenuItem>
            ))}
            <div className="p-2 text-center">
              <Link href="/notifications" className="text-xs text-[#D4AF37] hover:underline">
                عرض كل الإشعارات
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
