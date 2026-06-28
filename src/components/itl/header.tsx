'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, UserCircle, Sparkles, LayoutDashboard } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItlLogo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { AuthModal } from './auth-modal';
import { useAuth } from './auth-provider';
import { toast } from 'sonner';

const NAV_LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#services', label: 'خدماتنا' },
  { href: '#about', label: 'من نحن' },
  { href: '#articles', label: 'المقالات' },
  { href: '#contact', label: 'تواصل معنا' },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');
  const { user, logout } = useAuth();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('تم تسجيل الخروج');
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-gold/15 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="#home" className="shrink-0" aria-label="ITL Home">
              <ItlLogo size={44} />
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-gold transition-colors group"
                >
                  {link.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-l from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden sm:flex items-center gap-2 px-3 hover:bg-gold/10"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-primary-foreground text-sm font-bold">
                        {user.name.charAt(0)}
                      </span>
                      <span className="text-sm font-medium max-w-[100px] truncate">
                        {user.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="luxury-card !bg-card !border-gold/30 min-w-56">
                    <DropdownMenuLabel className="text-center">
                      <div className="flex flex-col items-center gap-1 py-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-primary-foreground text-lg font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gold/20" />
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="h-4 w-4 ml-2" />
                          لوحة التحكم
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => openAuth('login')}
                    className="hidden sm:inline-flex text-foreground hover:text-gold hover:bg-gold/10"
                  >
                    دخول
                  </Button>
                  <Button
                    onClick={() => openAuth('register')}
                    className="hidden sm:inline-flex bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground hover:opacity-90"
                  >
                    <Sparkles className="h-4 w-4 ml-1.5" />
                    انضم إلينا
                  </Button>
                </>
              )}

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="القائمة"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-background/95 backdrop-blur-xl border-gold/20"
                >
                  <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
                  <div className="flex items-center justify-between mb-8 mt-2">
                    <ItlLogo size={40} />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 text-base font-medium text-foreground hover:text-gold hover:bg-gold/5 rounded-lg transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="gold-divider my-6" />
                  {!user ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => {
                          setMobileOpen(false);
                          openAuth('login');
                        }}
                        variant="outline"
                        className="border-gold/30 hover:bg-gold/10"
                      >
                        <UserCircle className="h-4 w-4 ml-2" />
                        تسجيل الدخول
                      </Button>
                      <Button
                        onClick={() => {
                          setMobileOpen(false);
                          openAuth('register');
                        }}
                        className="bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground"
                      >
                        <Sparkles className="h-4 w-4 ml-1.5" />
                        إنشاء حساب
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gold/5 border border-gold/20">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-primary-foreground font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <Button
                          asChild
                          variant="outline"
                          className="border-gold/40 hover:bg-gold/10 hover:text-gold"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Link href="/admin/dashboard">
                            <LayoutDashboard className="h-4 w-4 ml-2" />
                            لوحة التحكم
                          </Link>
                        </Button>
                      )}
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} />
    </>
  );
}
