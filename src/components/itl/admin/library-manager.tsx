'use client'
import { useState } from 'react'
import { Plus, Trash2, Upload, Loader2, FileText, Image as ImageIcon, Video, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface LibraryFile {
  id: string
  title: string
  description: string | null
  fileUrl: string
  category: string | null
  mimeType: string | null
  downloadCount: number
  createdAt: string
}

const CATEGORIES = ['دليل', 'قالب', 'بحث', 'صورة', 'فيديو', 'عام']

export function LibraryManager({ files: initial }: { files: LibraryFile[] }) {
  const [files, setFiles] = useState<LibraryFile[]>(initial)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'عام', fileUrl: '' })
  const [file, setFile] = useState<File | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { toast.error('العنوان مطلوب'); return }
    if (!file && !form.fileUrl) { toast.error('ملف أو رابط مطلوب'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('fileUrl', form.fileUrl)
      if (file) fd.append('file', file)

      const res = await fetch('/api/admin/library', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFiles([data.item, ...files])
      setForm({ title: '', description: '', category: 'عام', fileUrl: '' })
      setFile(null)
      setShowForm(false)
      toast.success('تمت الإضافة')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const del = async (id: string) => {
    try {
      await fetch(`/api/admin/library/${id}`, { method: 'DELETE' })
      setFiles(files.filter(f => f.id !== id))
      toast.success('تم الحذف')
    } catch { toast.error('فشل الحذف') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">مكتبة الملفات</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#D4AF37] text-black">
          <Plus className="h-4 w-4 ml-1" /> ملف جديد
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="luxury-card rounded-xl p-4 space-y-3">
          <div><Label>العنوان *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label>الوصف</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <div><Label>الفئة</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="دليل/قالب/بحث..." /></div>
          <div><Label>رفع ملف</Label><Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <div><Label>أو رابط</Label><Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." dir="ltr" /></div>
          <Button type="submit" disabled={loading} className="bg-[#D4AF37] text-black">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ'}</Button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => {
          const isPdf = f.fileUrl.endsWith('.pdf')
          const isImg = /\.(jpg|jpeg|png|gif)$/i.test(f.fileUrl)
          const Icon = isPdf ? FileText : isImg ? ImageIcon : File
          return (
            <div key={f.id} className="luxury-card rounded-xl p-4">
              <div className="flex items-start gap-2 mb-2">
                <Icon className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{f.title}</h3>
                  <span className="text-[10px] text-muted-foreground">{f.downloadCount} تحميل</span>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 hover:text-destructive" onClick={() => del(f.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {f.description && <p className="text-xs text-muted-foreground line-clamp-2">{f.description}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
