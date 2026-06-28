import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import { ItlLogo } from '@/components/itl/logo';
import { AdminLoginForm } from '@/components/itl/admin-login-form';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-luxury-gradient" dir="rtl">
      <div className="w-full max-w-md">
        <div className="luxury-card rounded-3xl p-8 lg:p-10 gold-glow">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ItlLogo size={64} showText={false} />
            </div>
            <h1 className="font-display text-3xl font-bold text-gradient-gold mb-2">
              لوحة تحكم المشرف
            </h1>
            <p className="text-sm text-muted-foreground">
              سجّل الدخول لإدارة محتوى موقع ITL
            </p>
          </div>

          <AdminLoginForm />

          <div className="mt-6 pt-6 border-t border-gold/15">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              العودة إلى الموقع
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          منطقة محمية — للمشرفين فقط
        </p>
      </div>
    </div>
  );
}
