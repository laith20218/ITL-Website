'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, User, Lock, Mail, Phone, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from './auth-provider';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ open, onOpenChange, defaultMode = 'login' }: AuthModalProps) {
  const { refresh } = useAuth();
  const [mode, setMode] = React.useState<'login' | 'register'>(defaultMode);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  React.useEffect(() => {
    if (open) setMode(defaultMode);
  }, [open, defaultMode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
        toast.success(`مرحبًا بعودتك، ${data.user.name}`);
        await refresh();
        onOpenChange(false);
        setForm({ name: '', email: '', password: '', phone: '' });
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'فشل التسجيل');
        // Auto-login after register
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        if (loginRes.ok) {
          await refresh();
          toast.success(`أهلًا بك في ITL، ${form.name}`);
          onOpenChange(false);
          setForm({ name: '', email: '', password: '', phone: '' });
        }
      }
    } catch (e) {
      const err = e as Error;
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] luxury-card !bg-card !border-gold/30">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/5 gold-glow">
            <User className="h-7 w-7 text-gold" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gradient-gold">
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'login'
              ? 'ادخل بياناتك للوصول إلى حسابك في ITL'
              : 'انضم إلى عائلة ITL واستفد من خدماتنا المتكاملة'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <LogIn className="h-4 w-4 ml-2" /> دخول
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-gold data-[state=active]:text-primary-foreground">
              <UserPlus className="h-4 w-4 ml-2" /> تسجيل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={submit} className="space-y-4 pt-4">
              <Field
                id="email"
                label="البريد الإلكتروني"
                icon={<Mail className="h-4 w-4" />}
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                type="email"
                placeholder="you@example.com"
              />
              <Field
                id="password"
                label="كلمة المرور"
                icon={<Lock className="h-4 w-4" />}
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                type="password"
                placeholder="••••••••"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground hover:opacity-90 font-semibold h-11"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'دخول'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                جرّب: <span className="text-gold" dir="ltr">demo@itl.com / demo1234</span>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={submit} className="space-y-4 pt-4">
              <Field
                id="name"
                label="الاسم الكامل"
                icon={<User className="h-4 w-4" />}
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="محمد عبد الله"
              />
              <Field
                id="email"
                label="البريد الإلكتروني"
                icon={<Mail className="h-4 w-4" />}
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                type="email"
                placeholder="you@example.com"
              />
              <Field
                id="phone"
                label="رقم الجوال (اختياري)"
                icon={<Phone className="h-4 w-4" />}
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+9665xxxxxxxx"
              />
              <Field
                id="password"
                label="كلمة المرور"
                icon={<Lock className="h-4 w-4" />}
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                type="password"
                placeholder="6 أحرف على الأقل"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground hover:opacity-90 font-semibold h-11"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'إنشاء الحساب'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm text-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="pr-10 bg-secondary/30 border-gold/20 focus:border-gold focus-visible:border-gold"
        />
      </div>
    </div>
  );
}
