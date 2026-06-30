'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, KeyRound } from 'lucide-react'
import { Header } from '@/components/itl/header'
import { Footer } from '@/components/itl/footer'

export default function ResetPasswordPage() {
  const params = useParams()
  const token = params.token as string
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { toast.error('كلمة المرور 6 أحرف على الأقل'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
      toast.success('تم تغيير كلمة المرور')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md luxury-card rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-4">
              <KeyRound className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-bold text-gradient-gold font-display">كلمة مرور جديدة</h1>
          </div>

          {done ? (
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 font-medium">تم التغيير بنجاح!</p>
              <a href="/admin-login" className="text-[#D4AF37] text-sm hover:underline mt-2 inline-block">تسجيل الدخول</a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>كلمة المرور الجديدة (6 أحرف على الأقل)</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-black">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تغيير كلمة المرور'}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
