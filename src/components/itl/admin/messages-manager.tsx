'use client'

import { useEffect, useState, useMemo } from 'react'
import { Trash2, Mail, Phone, MessageSquare, Wallet, Search, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface Message {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  service?: string | null
  status: string
  shamcashAmount?: string | null
  shamcashRef?: string | null
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  read: 'مقروء',
  replied: 'تم الرد',
  archived: 'مؤرشف',
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Message | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {
      toast.error('فشل التحميل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [messages, search, statusFilter])

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        toast.error('فشل التحديث')
        return
      }
      toast.success('تم تحديث الحالة')
      load()
      if (selected && selected.id === id) {
        setSelected({ ...selected, status })
      }
    } catch {
      toast.error('حدث خطأ')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/messages/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('فشل الحذف')
        return
      }
      toast.success('تم الحذف')
      setDeleteId(null)
      if (selected && selected.id === deleteId) setSelected(null)
      load()
    } catch {
      toast.error('حدث خطأ')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold font-display">صندوق الرسائل</h1>
        <p className="text-sm text-muted-foreground">{messages.length} رسالة</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث..." className="pr-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent className="luxury-card">
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="new">جديد</SelectItem>
            <SelectItem value="read">مقروء</SelectItem>
            <SelectItem value="replied">تم الرد</SelectItem>
            <SelectItem value="archived">مؤرشف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">لا توجد رسائل</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <Card
              key={m.id}
              className="luxury-card p-4 cursor-pointer hover:border-[#D4AF37]/40 transition-colors"
              onClick={() => {
                setSelected(m)
                if (m.status === 'new') updateStatus(m.id, 'read')
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-[#D4AF37]">{m.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold">{m.name}</span>
                    {m.status === 'new' && <Badge className="bg-[#D4AF37] text-black">جديد</Badge>}
                    {m.service && <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]">{m.service}</Badge>}
                    {m.shamcashAmount && <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">ShamCash: {m.shamcashAmount}</Badge>}
                  </div>
                  <div className="text-sm font-medium text-foreground/80 mb-1 truncate">{m.subject}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{m.message}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.createdAt).toLocaleString('ar-EG')}</div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); setDeleteId(m.id) }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl luxury-card" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient-gold">{selected?.subject}</DialogTitle>
            <DialogDescription>تفاصيل الرسالة</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span className="truncate">{selected.email}</span>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span dir="ltr">{selected.phone}</span>
                  </div>
                )}
                {selected.service && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                    <span>{selected.service}</span>
                  </div>
                )}
                {selected.shamcashAmount && (
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>{selected.shamcashAmount} - {selected.shamcashRef}</span>
                  </div>
                )}
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-[#D4AF37]/10">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{new Date(selected.createdAt).toLocaleString('ar-EG')}</span>
                <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent className="luxury-card">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}?subject=رد: ${encodeURIComponent(selected.subject)}`} className="flex-1">
                  <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#E8C964]">
                    <Mail className="ml-1 h-4 w-4" />
                    الرد عبر البريد
                  </Button>
                </a>
                <Button variant="destructive" onClick={() => { setDeleteId(selected.id); setSelected(null) }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="luxury-card">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذه الرسالة؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
