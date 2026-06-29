'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  imageUrl?: string | null
  tags?: string | null
  published: boolean
  viewCount: number
  createdAt: string
}

export function ArticlesManager() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Article | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/articles')
      const data = await res.json()
      setArticles(data.articles || [])
    } catch {
      toast.error('فشل التحميل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSave(data: Partial<Article>) {
    setSaving(true)
    try {
      const tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags || null
      const payload = { ...data, tags }
      const res = await fetch(
        editing ? `/api/admin/articles/${editing.id}` : '/api/admin/articles',
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
      toast.success(editing ? 'تم التحديث' : 'تمت الإضافة')
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
      const res = await fetch(`/api/admin/articles/${deleteId}`, { method: 'DELETE' })
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
          <h1 className="text-2xl font-bold text-gradient-gold font-display">إدارة المقالات</h1>
          <p className="text-sm text-muted-foreground">{articles.length} مقال</p>
        </div>
        <Button onClick={() => { setEditing(null); setEditOpen(true) }} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          <Plus className="ml-1 h-4 w-4" />
          مقال جديد
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((a) => (
            <Card key={a.id} className="luxury-card p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold truncate">{a.title}</h3>
                  <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]">{a.category}</Badge>
                  {a.published ? (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Eye className="ml-1 h-3 w-3" />
                      منشور
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <EyeOff className="ml-1 h-3 w-3" />
                      مسودة
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{a.excerpt}</p>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {a.author} • {a.viewCount} مشاهدة • {new Date(a.createdAt).toLocaleDateString('ar-EG')}
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-[#D4AF37]" onClick={() => { setEditing(a); setEditOpen(true) }}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={() => setDeleteId(a.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ArticleEditDialog
        key={editing ? editing.id : 'new'}
        open={editOpen}
        onOpenChange={setEditOpen}
        article={editing}
        onSave={handleSave}
        saving={saving}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="luxury-card">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا المقال؟</AlertDialogDescription>
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

function ArticleEditDialog({
  open, onOpenChange, article, onSave, saving,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  article: Article | null
  onSave: (data: Partial<Article>) => void
  saving: boolean
}) {
  const initialTags = (() => {
    if (!article) return ''
    try { return JSON.parse(article.tags || '[]').join(', ') } catch { return '' }
  })()

  const [form, setForm] = useState({
    slug: article?.slug || '',
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || '',
    author: article?.author || 'فريق ITL',
    imageUrl: article?.imageUrl || '',
    tagsText: initialTags,
    published: article?.published ?? true,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const tags = form.tagsText.split(',').map((t) => t.trim()).filter(Boolean)
    onSave({
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      author: form.author,
      imageUrl: form.imageUrl || null,
      tags: JSON.stringify(tags),
      published: form.published,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto luxury-card scrollbar-gold" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-gradient-gold">{article ? 'تعديل مقال' : 'مقال جديد'}</DialogTitle>
          <DialogDescription>أدخل تفاصيل المقال</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>الرابط (slug) *</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
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
              <Label>الكاتب</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>المقتطف *</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} required />
          </div>
          <div className="space-y-1.5">
            <Label>المحتوى (Markdown) *</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} required className="font-mono text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label>رابط الصورة</Label>
            <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label>الوسوم (افصل بفاصلة)</Label>
            <Input value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} placeholder="وسم1, وسم2" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} id="published" />
            <Label htmlFor="published">منشور</Label>
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
