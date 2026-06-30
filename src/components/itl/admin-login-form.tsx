'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';
import { toast } from 'sonner';

export function AdminLoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ تم تغيير المسار إلى custom-login
      const res = await fetch('/api/auth/custom-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
      if (data.user.role !== 'admin') {
        toast.error('هذا الحساب ليس له صلاحية مشرف');
        await fetch('/api/auth/logout', { method: 'POST' });
        return;
      }
      await refresh();
      toast.success(`مرحبًا، ${data.user.name}`);
      router.push('/admin/dashboard');
    } catch (e) {
      const err = e as Error;
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@itl.com"
            required
            className="pr-10 bg-secondary/30 border-gold/20 focus:border-gold"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">كلمة المرور</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="pr-10 bg-secondary/30 border-gold/20 focus:border-gold"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground hover:opacity-90 font-semibold"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'دخول لوحة التحكم'}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        تجربة: <span className="text-gold" dir="ltr">demo@itl.com / demo1234</span>
      </p>
    </form>
  );
}