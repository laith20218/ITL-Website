'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Loader2, Bell } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  link?: string | null
  isRead: boolean
  createdAt: string
}

export function AdminNotifications({ notifications: initial }: { notifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initial)
  const [form, setForm] = useState({ title: '', message: '', link: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.message) { toast.error('العنوان والرسالة مطلوبان'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNotifications([data.item, ...notifications])
      setForm({ title: '', message: '', link: '' })
      toast.success('تم إرسال الإشعار')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة الإشعارات</h2>

      <form onSubmit={submit} className="luxury-card rounded-xl p-4 space-y-3 max-w-lg">
        <h3 className="font-bold text-sm flex items-center gap-2"><Plus className="h-4 w-4 text-[#D4AF37]" /> إشعار جديد</h3>
        <div><Label>العنوان *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div><Label>الرسالة *</Label><Input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div>
        <div><Label>رابط (اختياري)</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} dir="ltr" /></div>
        <Button type="submit" disabled={loading} className="bg-[#D4AF37] text-black">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'إرسال'}
        </Button>
      </form>

      <div className="space-y-2">
        {notifications.map(n => (
          <div key={n.id} className="luxury-card rounded-lg p-3 flex items-start gap-2">
            <Bell className="h-4 w-4 text-[#D4AF37] mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.message}</p>
              <span className="text-[10px] text-muted-foreground/60">{new Date(n.createdAt).toLocaleString('ar-EG')}</span>
            </div>
            {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
          </div>
        ))}
      </div>
    </div>
  )
}
