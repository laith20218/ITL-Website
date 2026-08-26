'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Logo } from '@/components/itl/logo'
import { useAuth } from '@/components/itl/auth-provider'

export default function AdminLoginPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('الرجاء تعبئة جميع الحقول')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'فشل تسجيل الدخول')
        return
      }
      if (data.user.role !== 'admin') {
        toast.error('هذا الحساب لا يملك صلاحيات المدير')
        return
      }
      toast.success('مرحباً بك في لوحة التحكم')
      await refresh()
      router.push('/admin/dashboard')
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-radial bg-pattern p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Logo className="w-14 h-14 float" />
          </Link>
          <h1 className="text-2xl font-bold font-display text-gradient-gold neon-text">لوحة تحكم ITL</h1>
          <p className="text-sm text-muted-foreground mt-1">سجّل دخولك للوصول إلى لوحة الإدارة</p>
        </div>

        <form onSubmit={handleSubmit} className="luxury-card p-6 space-y-4 gold-glow">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/15">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <p className="text-xs text-foreground/70">
              هذه الصفحة مخصصة للمدراء الذين لديهم حساب مصرح به.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@your-email.com"
                className="pr-9"
                required
                dir="ltr"
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
                className="pr-9"
                required
                dir="ltr"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black hover:bg-[#E8C964] shimmer-hover">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="ml-2 h-4 w-4" />}
            دخول لوحة التحكم
          </Button>

          <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors">
            <ArrowLeft className="inline h-3 w-3 ml-1" />
            العودة للموقع
          </Link>
        </form>
      </div>
    </div>
  )
}
