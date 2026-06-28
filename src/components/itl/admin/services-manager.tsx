'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SERVICE_ICON_NAMES, ServiceDetailIcon } from '@/components/itl/service-icon';
import { toast } from 'sonner';

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function ServicesManager({ services: initial }: { services: ServiceItem[] }) {
  const [services, setServices] = React.useState<ServiceItem[]>(initial);
  const [editing, setEditing] = React.useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1">إدارة الخدمات</h2>
          <p className="text-sm text-muted-foreground">إضافة وتعديل وحذف الخدمات المعروضة في الموقع.</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground"
        >
          <Plus className="h-4 w-4 ml-2" />
          خدمة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s.id} className="luxury-card rounded-2xl p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                <ServiceDetailIcon name={s.icon} small />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base truncate">{s.title}</h3>
                  <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5 text-[10px]">
                    {s.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span className="font-mono" dir="ltr">/services/{s.slug}</span>
              <span className="flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                ترتيب: {s.order}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setEditing(s)}
                variant="outline"
                size="sm"
                className="flex-1 border-gold/30 hover:bg-gold/10"
              >
                <Pencil className="h-3.5 w-3.5 ml-1" />
                تعديل
              </Button>
              <Button
                onClick={() => setDeleteId(s.id)}
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor */}
      {(editing || isCreating) && (
        <ServiceEditor
          service={editing}
          onClose={() => {
            setEditing(null);
            setIsCreating(false);
          }}
          onSaved={(updated, isNew) => {
            if (isNew) {
              setServices([...services, updated]);
            } else {
              setServices(services.map((s) => (s.id === updated.id ? updated : s)));
            }
            setEditing(null);
            setIsCreating(false);
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Dialog open onOpenChange={(v) => !v && setDeleteId(null)}>
          <DialogContent className="luxury-card !bg-card !border-gold/30 max-w-md">
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                سيتم حذف هذه الخدمة نهائيًا. لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/admin/services/${deleteId}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('فشل الحذف');
                    setServices(services.filter((s) => s.id !== deleteId));
                    toast.success('تم حذف الخدمة');
                    setDeleteId(null);
                  } catch {
                    toast.error('تعذر الحذف');
                  }
                }}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                حذف نهائي
              </Button>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ServiceEditor({
  service,
  onClose,
  onSaved,
}: {
  service: ServiceItem | null;
  onClose: () => void;
  onSaved: (updated: ServiceItem, isNew: boolean) => void;
}) {
  const isNew = !service;
  const [form, setForm] = React.useState({
    title: service?.title || '',
    slug: service?.slug || '',
    category: service?.category || '',
    description: service?.description || '',
    icon: service?.icon || 'Megaphone',
    features: service?.features || [''],
    order: service?.order ?? 1,
  });
  const [saving, setSaving] = React.useState(false);

  const submit = async () => {
    if (!form.title || !form.slug || !form.category || !form.description) {
      toast.error('جميع الحقول الأساسية مطلوبة');
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        features: form.features.filter((f) => f.trim()),
      };
      const url = isNew
        ? '/api/admin/services'
        : `/api/admin/services/${service!.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الحفظ');
      toast.success(isNew ? 'تم إنشاء الخدمة' : 'تم تحديث الخدمة');
      onSaved(data.service, isNew);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="luxury-card !bg-card !border-gold/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'إضافة خدمة' : 'تعديل خدمة'}</DialogTitle>
          <DialogDescription>املأ تفاصيل الخدمة أدناه.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <Field label="عنوان الخدمة *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field
            label="المعرّف (slug) *"
            value={form.slug}
            onChange={(v) => setForm({ ...form, slug: v.replace(/\s+/g, '-') })}
            placeholder="research"
            ltr
          />
          <Field label="الفئة *" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <div className="space-y-1.5">
            <Label>الأيقونة</Label>
            <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
              <SelectTrigger className="bg-secondary/30 border-gold/20 focus:border-gold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold/30">
                {SERVICE_ICON_NAMES.map((name) => (
                  <SelectItem key={name} value={name}>
                    <div className="flex items-center gap-2">
                      <ServiceDetailIcon name={name} small />
                      <span>{name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label>الوصف *</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="bg-secondary/30 border-gold/20 focus:border-gold resize-none"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label>المميزات (سطر لكل ميزة)</Label>
            <Textarea
              value={form.features.join('\n')}
              onChange={(e) => setForm({ ...form, features: e.target.value.split('\n') })}
              rows={6}
              className="bg-secondary/30 border-gold/20 focus:border-gold resize-none font-mono text-sm"
              placeholder="إعداد الأبحاث العلمية&#10;الرسائل الجامعية&#10;..."
            />
          </div>
          <Field
            label="الترتيب"
            type="number"
            value={String(form.order)}
            onChange={(v) => setForm({ ...form, order: Number(v) || 0 })}
          />
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
  type = 'text',
  placeholder,
  ltr = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  ltr?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-secondary/30 border-gold/20 focus:border-gold ${ltr ? 'text-left' : ''}`}
        dir={ltr ? 'ltr' : 'rtl'}
      />
    </div>
  );
}
