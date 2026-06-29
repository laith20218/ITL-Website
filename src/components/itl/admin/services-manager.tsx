'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Loader2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ServiceIcon } from '@/components/itl/service-icon'
import { toast } from 'sonner'

interface Service {
  id: string
  slug: string
  title: string
  category: string
  description: string
  icon: string
  features: string
  order: number
}

const ICONS = [
  'GraduationCap', 'Languages', 'Palette', 'Clapperboard', 'Users',
  'Megaphone', 'Printer', 'Globe', 'Smartphone', 'Apple', 'Send', 'QrCode',
]

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(data.services || [])
    } catch {
      toast.error('فشل تحميل الخدمات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setEditOpen(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setEditOpen(true)
  }

  async function handleSave(data: Partial<Service>) {
    setSaving(true)
    try {
      const features = Array.isArray(data.features) ? JSON.stringify(data.features) : (data.features || '[]')
      const payload = { ...data, features }
      const res = await fetch(
        editing ? `/api/admin/services/${editing.id}` : '/api/admin/services',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'فشل الحفظ')
        return
      }
      toast.success(editing ? 'تم تحديث الخدمة' : 'تمت إضافة الخدمة')
      setEditOpen(false)
      load()
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/services/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('فشل الحذف')
        return
      }
      toast.success('تم حذف الخدمة')
      setDeleteId(null)
      load()
    } catch {
      toast.error('حدث خطأ')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold font-display">إدارة الخدمات</h1>
          <p className="text-sm text-muted-foreground">{services.length} خدمة</p>
        </div>
        <Button onClick={openNew} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          <Plus className="ml-1 h-4 w-4" />
          خدمة جديدة
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-muted/30 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((s) => {
            let features: string[] = []
            try { features = JSON.parse(s.features) } catch {}
            return (
              <Card key={s.id} className="luxury-card p-4 group">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <ServiceIcon name={s.icon} className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{s.title}</h3>
                      <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] flex-shrink-0">{s.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{s.description}</p>
                    <div className="text-[10px] text-muted-foreground">الترتيب: {s.order} • {features.length} ميزة</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-[#D4AF37]" onClick={() => openEdit(s)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={() => setDeleteId(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <ServiceEditDialog
        key={editing ? editing.id : 'new'}
        open={editOpen}
        onOpenChange={setEditOpen}
        service={editing}
        onSave={handleSave}
        saving={saving}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="luxury-card">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ServiceEditDialog({
  open, onOpenChange, service, onSave, saving,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  service: Service | null
  onSave: (data: Partial<Service>) => void
  saving: boolean
}) {
  const initialFeatures = (() => {
    if (!service) return ''
    try { return JSON.parse(service.features).join('\n') } catch { return '' }
  })()

  const [form, setForm] = useState({
    slug: service?.slug || '',
    title: service?.title || '',
    category: service?.category || '',
    description: service?.description || '',
    icon: service?.icon || 'GraduationCap',
    featuresText: initialFeatures,
    order: service?.order ?? 0,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const features = form.featuresText.split('\n').map((f) => f.trim()).filter(Boolean)
    onSave({
      slug: form.slug,
      title: form.title,
      category: form.category,
      description: form.description,
      icon: form.icon,
      features: JSON.stringify(features),
      order: form.order,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto luxury-card" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-gradient-gold">{service ? 'تعديل خدمة' : 'خدمة جديدة'}</DialogTitle>
          <DialogDescription>أدخل تفاصيل الخدمة</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>الرابط (slug) *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="research" required />
            </div>
            <div className="space-y-1.5">
              <Label>الترتيب</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>العنوان *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>التصنيف *</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label>الأيقونة</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="luxury-card max-h-60">
                  {ICONS.map((ic) => (
                    <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>الوصف *</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
          </div>
          <div className="space-y-1.5">
            <Label>الميزات (كل ميزة في سطر)</Label>
            <Textarea value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} rows={5} placeholder={'ميزة 1\nميزة 2\nميزة 3'} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
            <Button type="submit" disabled={saving} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
              {saving && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
