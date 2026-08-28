'use client'

/** Style: مسار الإنجاز الذهبي — الإشعارات تبقى قصيرة وواضحة؛ قائمة سطح المكتب ودرج الهاتف يحترمان التباين والمساحة. */
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
import { useIsMobile } from '@/hooks/use-mobile'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

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
  const [open, setOpen] = useState(false)
  const { play } = useSounds()
  const isMobile = useIsMobile()

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

  const trigger = (
    <Button variant="ghost" size="icon" className="relative h-9 w-9 text-foreground hover:bg-[#D4AF37]/10 hover:text-[#E8C964]" aria-label="الإشعارات">
      <Bell className="h-5 w-5" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1 text-xs font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )

  const notificationItems = (closeOnRead = false) => notifications.length === 0 ? (
    <div className="px-5 py-8 text-center text-sm text-muted-foreground">لا توجد إشعارات جديدة</div>
  ) : (
    <>
      <div className="max-h-[55vh] overflow-y-auto scrollbar-gold">
        {notifications.slice(0, 5).map((n, i) => (
          <button
            key={n.id}
            type="button"
            className="flex w-full cursor-pointer flex-col gap-1 border-b border-border/40 px-4 py-3 text-right transition-colors last:border-0 hover:bg-[#D4AF37]/10 focus-visible:bg-[#D4AF37]/10"
            onClick={() => {
              markAsRead(n.id)
              if (closeOnRead) setOpen(false)
            }}
          >
            <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-2 text-sm font-medium text-foreground">
              {!n.isRead && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#D4AF37]" />}
              <span className="min-w-0 flex-1 truncate">{n.title}</span>
            </motion.span>
            <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">{n.message}</span>
            <span className="text-[10px] text-muted-foreground/80">{new Date(n.createdAt).toLocaleString('ar-EG')}</span>
          </button>
        ))}
      </div>
      <Link href="/notifications" onClick={() => setOpen(false)} className="block border-t border-[#D4AF37]/15 px-4 py-3 text-center text-xs font-medium text-[#E8C964] transition-colors hover:bg-[#D4AF37]/10">
        عرض كل الإشعارات
      </Link>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent dir="rtl" className="border-[#D4AF37]/30 bg-[#0B0B0B] text-foreground">
          <DrawerHeader className="border-b border-[#D4AF37]/15 text-right">
            <DrawerTitle className="font-display text-xl text-[#E8C964]">الإشعارات</DrawerTitle>
            <DrawerDescription>آخر تحديثات حسابك وطلباتك في ITL.</DrawerDescription>
          </DrawerHeader>
          {notificationItems(true)}
          <DrawerClose asChild>
            <Button variant="ghost" className="m-3 min-h-11 border border-[#D4AF37]/25 text-foreground hover:bg-[#D4AF37]/10">إغلاق</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 overflow-hidden border border-[#D4AF37]/30 bg-[#0B0B0B] p-0 text-popover-foreground shadow-[0_18px_60px_rgba(0,0,0,0.45)]" style={{ zIndex: 200 }}>
        {notificationItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
