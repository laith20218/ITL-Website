'use client'

/** Style: مسار الإنجاز الذهبي — إدارة أعمال متسقة مع لوحة ITL، مع اكتمال بيانات المرفقات في النموذج. */

import { useEffect, useState, useRef } from 'react'
import { Plus, Edit2, Trash2, Loader2, Star, Upload, Image as ImageIcon, Video, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  type: string
  fileUrl: string
  thumbnailUrl?: string | null
  clientName?: string | null
  projectDate?: string | null
  featured: boolean
  order: number
  createdAt: string
}

export function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/portfolio')
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      toast.error('فشل التحميل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/portfolio/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('فشل الحذف')
        return
      }
      toast.success('تم الحذف')
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
          <h1 className="text-2xl font-bold text-gradient-gold font-display">إدارة الأعمال</h1>
          <p className="text-sm text-muted-foreground">{items.length} عنصر</p>
        </div>
        <Button onClick={() => { setEditing(null); setEditOpen(true) }} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          <Plus className="ml-1 h-4 w-4" />
          عمل جديد
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-xl bg-muted/30 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <Card key={item.id} className="luxury-card overflow-hidden">
              <div className="aspect-video relative bg-gradient-to-br from-[#D4AF37]/10 to-[#A8842B]/5">
                {item.thumbnailUrl || item.type === 'image' ? (
                  <img src={item.thumbnailUrl || item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {item.type === 'video' ? <Video className="w-12 h-12 text-[#D4AF37]/40" /> : <FileText className="w-12 h-12 text-[#D4AF37]/40" />}
                  </div>
                )}
                {item.featured && (
                  <Badge className="absolute top-2 right-2 bg-[#D4AF37] text-black">
                    <Star className="ml-1 h-3 w-3 fill-current" />
                    مميز
                  </Badge>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]">{item.category}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
                </div>
                <h3 className="font-bold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]" onClick={() => { setEditing(item); setEditOpen(true) }}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PortfolioEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        item={editing}
        saving={saving}
        setSaving={setSaving}
        onSaved={() => { setEditOpen(false); load() }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="luxury-card">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>سيتم حذف العنصر والملفات المرتبطة به.</AlertDialogDescription>
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

function PortfolioEditDialog({
  open, onOpenChange, item, saving, setSaving, onSaved,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  item: PortfolioItem | null
  saving: boolean
  setSaving: (s: boolean) => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    title: '', description: '', category: '', type: 'image',
    clientName: '', projectDate: '', featured: false, order: 0,
    fileUrl: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title, description: item.description, category: item.category, type: item.type,
        clientName: item.clientName || '', projectDate: item.projectDate || '',
        featured: item.featured, order: item.order, fileUrl: item.fileUrl,
      })
    } else {
      setForm({ title: '', description: '', category: '', type: 'image', clientName: '', projectDate: '', featured: false, order: 0, fileUrl: '' })
    }
    setFile(null)
    setThumbnail(null)
  }, [item, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.description || !form.category) {
      toast.error('الرجاء تعبئة الحقول المطلوبة')
      return
    }
    if (!item && !file && !form.fileUrl) {
      toast.error('الرجاء رفع ملف أو إدخال رابط')
      return
    }
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('type', form.type)
      formData.append('clientName', form.clientName)
      formData.append('projectDate', form.projectDate)
      formData.append('featured', String(form.featured))
      formData.append('order', String(form.order))
      if (form.fileUrl) formData.append('fileUrl', form.fileUrl)
      if (file) formData.append('file', file)
      if (thumbnail) formData.append('thumbnail', thumbnail)

      const res = await fetch(
        item ? `/api/admin/portfolio/${item.id}` : '/api/admin/portfolio',
        { method: item ? 'PUT' : 'POST', body: formData }
      )
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'فشل الحفظ')
        return
      }
      toast.success(item ? 'تم التحديث' : 'تمت الإضافة')
      onSaved()
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto luxury-card scrollbar-gold" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-gradient-gold">{item ? 'تعديل عمل' : 'عمل جديد'}</DialogTitle>
          <DialogDescription>أدخل تفاصيل العمل وارفع الملف</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label>النوع</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="luxury-card">
                  <SelectItem value="image">صورة</SelectItem>
                  <SelectItem value="video">فيديو</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>الوصف *</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>اسم العميل</Label>
              <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>تاريخ المشروع</Label>
              <Input value={form.projectDate} onChange={(e) => setForm({ ...form, projectDate: e.target.value })} placeholder="2024" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>الترتيب</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} id="featured" />
              <Label htmlFor="featured">مميز</Label>
            </div>
          </div>
          {/* File upload */}
          <div className="space-y-1.5">
            <Label>الملف {item ? '(اتركه فارغاً للإبقاء على الحالي)' : ''}</Label>
            <input
              ref={fileRef}
              type="file"
              accept={form.type === 'image' ? 'image/*' : form.type === 'video' ? 'video/*' : '.pdf'}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <Button type="button" variant="outline" className="w-full border-dashed border-[#D4AF37]/30" onClick={() => fileRef.current?.click()}>
              <Upload className="ml-1 h-4 w-4" />
              {file ? file.name : (item ? `الحالي: ${item.fileUrl}` : 'اختر ملفاً')}
            </Button>
            <div className="text-center text-xs text-muted-foreground py-1">— أو —</div>
            <Input
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              placeholder="أدخل رابط الملف https://..."
              dir="ltr"
            />
          </div>
          {form.type === 'video' && (
            <div className="space-y-1.5">
              <Label>صورة مصغّرة (اختياري)</Label>
              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Button type="button" variant="outline" className="w-full border-dashed border-[#D4AF37]/30" onClick={() => thumbRef.current?.click()}>
                <ImageIcon className="ml-1 h-4 w-4" />
                {thumbnail ? thumbnail.name : 'اختر صورة مصغّرة'}
              </Button>
            </div>
          )}
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
