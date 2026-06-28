'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { ItlLogo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from './auth-provider';
import { toast } from 'sonner';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AdminShellProps {
  user: AdminUser;
  stats: { newMessages: number; servicesCount: number; articlesCount: number };
  children: React.ReactNode;
}

const NAV = [
  { href: '/admin/dashboard', label: 'الرئيسية', icon: LayoutDashboard, badge: null },
  { href: '/admin/services', label: 'الخدمات', icon: Briefcase, badge: 'servicesCount' as const },
  { href: '/admin/articles', label: 'المقالات', icon: FileText, badge: 'articlesCount' as const },
  { href: '/admin/messages', label: 'الرسائل', icon: Mail, badge: 'newMessages' as const },
];

function NavLinks({
  stats,
  onNavigate,
}: {
  stats: AdminShellProps['stats'];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const badge = item.badge ? stats[item.badge] : null;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-gradient-to-l from-gold/20 to-gold/5 border border-gold/40 text-gold font-semibold'
                : 'text-foreground/70 hover:bg-gold/5 hover:text-gold border border-transparent'
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.label}
            </span>
            {badge !== null && badge !== undefined && badge > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold font-bold">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar({
  user,
  stats,
  onLogout,
  onNavigate,
}: {
  user: AdminUser;
  stats: AdminShellProps['stats'];
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gold/15">
        <Link href="/admin/dashboard" onClick={onNavigate}>
          <ItlLogo size={40} />
        </Link>
        <p className="text-xs text-muted-foreground mt-2 pr-1">لوحة تحكم المشرف</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <NavLinks stats={stats} onNavigate={onNavigate} />

        <div className="gold-divider my-5" />

        <div className="space-y-1">
          <Link
            href="/"
            target="_blank"
            onClick={onNavigate}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-gold/5 hover:text-gold transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            عرض الموقع
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gold/15">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gold/5 border border-gold/15">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-primary-foreground font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full mt-3 border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}

export function AdminShell({ user, stats, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('تم تسجيل الخروج');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 border-l border-gold/15 bg-secondary/20 sticky top-0 h-screen">
        <Sidebar user={user} stats={stats} onLogout={handleLogout} />
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 right-4 z-50"
            aria-label="القائمة"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 p-0 bg-background border-gold/20">
          <SheetTitle className="sr-only">القائمة الجانبية</SheetTitle>
          <div className="absolute top-4 left-4 z-10">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Sidebar
            user={user}
            stats={stats}
            onLogout={handleLogout}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 border-b border-gold/15 bg-background/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between">
          <div className="lg:hidden w-10" />
          <h1 className="font-display text-lg lg:text-xl font-bold text-gradient-gold">
            {NAV.find((n) => pathname.startsWith(n.href))?.label || 'لوحة التحكم'}
          </h1>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
