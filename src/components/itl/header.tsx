'use client'

/** Style: مسار الإنجاز الذهبي — تنقل هادئ يربط الحساب العام بلوحة الإدارة بحسب الدور. */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LogOut, User as UserIcon, Shield, X, Sparkles, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from './theme-toggle'
import { NotificationBell } from './notification-bell'
import { AuthModal } from './auth-modal'
import { Logo } from './logo'
import { useAuth } from './auth-provider'
import { useUiContent } from './ui-content-provider'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/#services', label: 'البوابات' },
  { href: '/#about', label: 'من نحن' },
  { href: '/#articles', label: 'المدونة' },
  { href: '/#contact', label: 'تواصل' },
  { href: '/portfolio', label: 'أعمالنا' },
  { href: '/library', label: 'المكتبة' },
]

export function Header() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const { getSection } = useUiContent()
  const ui = getSection('header')
  const navLinks = Array.from({ length: 6 }, (_, index) => ({ href: ui[`nav${index + 1}Href`], label: ui[`nav${index + 1}Label`] }))
  const [authOpen, setAuthOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-[#D4AF37]/15 shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="ITL الرئيسية">
            <Logo className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-gradient-gold font-display">ITL</span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">{ui.brandTagline}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[#D4AF37] hover:bg-[#D4AF37]/5',
                  'text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <NotificationBell />

            {loading ? (
              <div className="h-9 w-9 rounded-md animate-pulse bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 px-2 gap-2 hover:bg-[#D4AF37]/10"
                    aria-label="قائمة المستخدم"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E8C964] to-[#A8842B] flex items-center justify-center text-black font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-sm max-w-[100px] truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 luxury-card">
                  <DropdownMenuLabel className="text-center">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground font-normal truncate">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <UserIcon className="ml-2 h-4 w-4 text-[#C9A24A]" />
                        {ui.accountLabel}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <Shield className="ml-2 h-4 w-4 text-[#D4AF37]" />
                        {ui.adminLabel}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/#services" className="cursor-pointer">
                      <LayoutGrid className="ml-2 h-4 w-4" />
                      اختر بوابة خدمة
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => logout()}
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setAuthOpen(true)}
                size="sm"
                className="bg-[#D4AF37] text-black hover:bg-[#E8C964] font-medium shimmer-hover"
              >
                <Sparkles className="ml-1 h-4 w-4" />
                {ui.loginLabel}
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                  aria-label="القائمة"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] luxury-card" dir="rtl">
                <SheetTitle className="text-right sr-only">القائمة الرئيسية</SheetTitle>
                <div className="flex items-center justify-between mb-6 pt-2">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <Logo className="w-10 h-10" />
                    <div className="flex flex-col leading-none">
                      <span className="font-display text-xl text-gradient-gold font-bold">ITL</span>
                      <span className="text-[9px] text-muted-foreground tracking-widest uppercase">{ui.brandTagline}</span>
                    </div>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-1" aria-label="التنقل المتنقل">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]',
                        pathname === link.href ? 'text-[#D4AF37] bg-[#D4AF37]/5' : 'text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}
