import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/itl/admin-shell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin-login');
  }
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background" dir="rtl">
        <div className="luxury-card rounded-2xl p-8 max-w-md text-center">
          <h1 className="font-display text-2xl font-bold text-destructive mb-3">وصول مرفوض</h1>
          <p className="text-muted-foreground">
            حسابك لا يملك صلاحية الوصول إلى لوحة التحكم. يرجى التواصل مع المسؤول.
          </p>
        </div>
      </div>
    );
  }

  // Fetch counts for sidebar badges
  const [newMessages, servicesCount, articlesCount] = await Promise.all([
    db.contactMessage.count({ where: { status: 'new' } }),
    db.service.count(),
    db.article.count(),
  ]);

  return (
    <AdminShell
      user={user}
      stats={{ newMessages, servicesCount, articlesCount }}
    >
      {children}
    </AdminShell>
  );
}
