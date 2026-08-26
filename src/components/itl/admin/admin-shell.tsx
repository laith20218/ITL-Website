'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare, Users,
  BarChart3, Settings as SettingsIcon, Home, LogOut, Menu, X, Server, LayoutTemplate,
  Bell, BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Logo } from '@/components/itl/logo'
import { useAuth } from '@/components/itl/auth-provider'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/admin/services', label: 'الخدمات', icon: Briefcase },
  { href: '/admin/portfolio', label: 'الأعمال', icon: FileText },
  { href: '/admin/articles', label: 'المقالات', icon: FileText },
  { href: '/admin/messages', label: 'الرسائل', icon: MessageSquare },
  { href: '/admin/library', label: 'المكتبة', icon: BookOpen },
  { href: '/admin/notifications', label: 'الإشعارات', icon: Bell },
  { href: '/admin/ui', label: 'واجهة المستخدم', icon: LayoutTemplate },
  { href: '/admin/users', label: 'المستخدمون', icon: Users },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/admin/settings', label: 'الإعدادات', icon: SettingsIcon },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin-login')
    } else if (!loading && user && user.role !== 'admin') {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#D4AF37]/15 bg-background/80 backdrop-blur-xl">
        <div className="h-full px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" aria-label="القائمة">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 luxury-card" dir="rtl">
                <SheetTitle className="sr-only">القائمة</SheetTitle>
                <AdminNav pathname={pathname} onItemClick={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Logo className="w-9 h-9" />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-gradient-gold font-display text-lg">ITL</span>
                <span className="text-[10px] text-muted-foreground">لوحة التحكم</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Home className="ml-1 h-4 w-4" />
                الموقع
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E8C964] to-[#A8842B] flex items-center justify-center text-black font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9 hover:text-destructive" aria-label="خروج">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-60 flex-col border-l border-[#D4AF37]/15 bg-background/50">
          <AdminNav pathname={pathname} />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6 scrollbar-gold">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-[#D4AF37]/15">
        <div className="grid grid-cols-5 gap-0.5 p-1">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1.5 rounded-md text-[10px] transition-colors',
                  active ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function AdminNav({ pathname, onItemClick }: { pathname: string; onItemClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-gradient-gold font-display">ITL</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onItemClick}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 mb-2 text-xs text-muted-foreground">
        <Server className="w-3 h-3" />
        القائمة الرئيسية
      </div>

      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              active
                ? 'bg-[#D4AF37]/15 text-[#D4AF37] neon-border'
                : 'text-foreground/70 hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]'
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
