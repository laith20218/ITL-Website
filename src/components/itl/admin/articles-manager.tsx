'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  tags: string | null;
  imageUrl: string | null;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export function ArticlesManager({ articles: initial }: { articles: ArticleItem[] }) {
  const [articles, setArticles] = React.useState<ArticleItem[]>(initial);
  const [editing, setEditing] = React.useState<ArticleItem | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1">إدارة المقالات</h2>
          <p className="text-sm text-muted-foreground">إضافة وتعديل وحذف مقالات المدونة.</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground"
        >
          <Plus className="h-4 w-4 ml-2" />
          مقال جديد
        </Button>
      </div>

      <div className="luxury-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-xs text-muted-foreground bg-secondary/30">
                <th className="text-right py-3 px-4 font-medium">العنوان</th>
                <th className="text-right py-3 px-3 font-medium">الفئة</th>
                <th className="text-right py-3 px-3 font-medium">الحالة</th>
                <th className="text-right py-3 px-3 font-medium">المشاهدات</th>
                <th className="text-right py-3 px-3 font-medium">التاريخ</th>
                <th className="text-right py-3 px-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-gold/10 hover:bg-gold/5">
                  <td className="py-3 px-4 font-medium max-w-xs truncate">{a.title}</td>
                  <td className="py-3 px-3 text-muted-foreground">{a.category}</td>
                  <td className="py-3 px-3">
                    {a.published ? (
                      <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5">
                        منشور
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        مسودة
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{a.viewCount}</td>
                  <td className="py-3 px-3 text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <Button
                        onClick={() => setEditing(a)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gold/10 text-gold h-8 w-8 p-0"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={() => setDeleteId(a.id)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-destructive/10 text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || isCreating) && (
        <ArticleEditor
          article={editing}
          onClose={() => {
            setEditing(null);
            setIsCreating(false);
          }}
          onSaved={(updated, isNew) => {
            if (isNew) {
              setArticles([updated, ...articles]);
            } else {
              setArticles(articles.map((a) => (a.id === updated.id ? updated : a)));
            }
            setEditing(null);
            setIsCreating(false);
          }}
        />
      )}

      {deleteId && (
        <Dialog open onOpenChange={(v) => !v && setDeleteId(null)}>
          <DialogContent className="luxury-card !bg-card !border-gold/30 max-w-md">
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>سيتم حذف المقال نهائيًا.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/admin/articles/${deleteId}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('فشل');
                    setArticles(articles.filter((a) => a.id !== deleteId));
                    toast.success('تم حذف المقال');
                    setDeleteId(null);
                  } catch {
                    toast.error('تعذر الحذف');
                  }
                }}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                حذف
              </Button>
              <Button variant="outline" onClick={() => setDeleteId(null)}>إلغاء</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ArticleEditor({
  article,
  onClose,
  onSaved,
}: {
  article: ArticleItem | null;
  onClose: () => void;
  onSaved: (updated: ArticleItem, isNew: boolean) => void;
}) {
  const isNew = !article;
  const [form, setForm] = React.useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || '',
    tags: article?.tags || '',
    author: article?.author || 'فريق ITL',
    imageUrl: article?.imageUrl || '',
    published: article?.published ?? true,
  });
  const [saving, setSaving] = React.useState(false);

  const submit = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content || !form.category) {
      toast.error('جميع الحقول الأساسية مطلوبة');
      return;
    }
    setSaving(true);
    try {
      const url = isNew ? '/api/admin/articles' : `/api/admin/articles/${article!.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
      toast.success(isNew ? 'تم إنشاء المقال' : 'تم تحديث المقال');
      onSaved(data.article, isNew);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="luxury-card !bg-card !border-gold/30 max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'مقال جديد' : 'تعديل مقال'}</DialogTitle>
          <DialogDescription>املأ تفاصيل المقال.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="md:col-span-2">
            <Field label="العنوان *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          </div>
          <Field
            label="المعرّف (slug) *"
            value={form.slug}
            onChange={(v) => setForm({ ...form, slug: v.replace(/\s+/g, '-') })}
            placeholder="my-article"
            ltr
          />
          <Field label="الفئة *" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Field label="الكاتب" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
          <Field label="الوسوم (مفصولة بفواصل)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
          <div className="md:col-span-2 space-y-1.5">
            <Label>الملخص *</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="bg-secondary/30 border-gold/20 focus:border-gold resize-none"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label>المحتوى *</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              className="bg-secondary/30 border-gold/20 focus:border-gold resize-none font-mono text-sm"
              placeholder="اكتب محتوى المقال هنا. استخدم سطرًا فارغًا للفصل بين الفقرات."
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-gold/15">
            <Button
              type="button"
              variant={form.published ? 'default' : 'outline'}
              size="sm"
              onClick={() => setForm({ ...form, published: !form.published })}
              className={
                form.published
                  ? 'bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground'
                  : 'border-gold/30'
              }
            >
              {form.published ? <Eye className="h-4 w-4 ml-1" /> : <EyeOff className="h-4 w-4 ml-1" />}
              {form.published ? 'منشور' : 'مسودة'}
            </Button>
            <span className="text-xs text-muted-foreground">
              {form.published ? 'مرئي للزوار' : 'محفوظ كمسودة غير منشورة'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 sticky bottom-0 bg-card pb-2">
          <Button
            onClick={submit}
            disabled={saving}
            className="flex-1 bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
            حفظ
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  ltr = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ltr?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-secondary/30 border-gold/20 focus:border-gold ${ltr ? 'text-left' : ''}`}
        dir={ltr ? 'ltr' : 'rtl'}
      />
    </div>
  );
}
