'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'
import { Header } from '@/components/itl/header'
import { Footer } from '@/components/itl/footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSent(true)
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
              <Mail className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <h1 className="text-2xl font-bold text-gradient-gold font-display">نسيت كلمة المرور</h1>
            <p className="text-sm text-muted-foreground mt-2">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</p>
          </div>

          {sent ? (
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 font-medium">تحقق من بريدك الإلكتروني</p>
              <p className="text-xs text-muted-foreground mt-1">إذا كان البريد مسجلاً، ستصل رسالة إعادة التعيين خلال دقائق.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" dir="ltr" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-black">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'إرسال الرابط'}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
