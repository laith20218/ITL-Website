'use client';

import * as React from 'react';
import { Mail, Phone, Trash2, Inbox, CheckCheck, Archive, Reply, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  service: string | null;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'جديد', color: 'border-gold/50 text-gold bg-gold/10' },
  read: { label: 'مقروء', color: 'border-muted-foreground/30 text-muted-foreground' },
  replied: { label: 'تم الرد', color: 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10' },
  archived: { label: 'مؤرشف', color: 'border-muted-foreground/20 text-muted-foreground/60' },
};

export function MessagesManager({ messages: initial }: { messages: MessageItem[] }) {
  const [messages, setMessages] = React.useState<MessageItem[]>(initial);
  const [selected, setSelected] = React.useState<MessageItem | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.status === filter);

  const updateStatus = async (id: string, status: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)));
    if (selected?.id === id) setSelected({ ...selected, status });
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('فشل تحديث الحالة');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setMessages(messages.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('تم الحذف');
    } catch {
      toast.error('تعذر الحذف');
    }
  };

  // Auto mark as read when opened
  React.useEffect(() => {
    if (selected && selected.status === 'new') {
      updateStatus(selected.id, 'read');
    }
  }, [selected]);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold mb-1">صندوق الرسائل</h2>
        <p className="text-sm text-muted-foreground">رسائل العملاء من نموذج التواصل.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map((f) => {
          const count = f === 'all' ? messages.length : messages.filter((m) => m.status === f).length;
          const label =
            f === 'all' ? 'الكل' :
            f === 'new' ? 'جديدة' :
            f === 'read' ? 'مقروءة' :
            f === 'replied' ? 'تم الرد' : 'مؤرشفة';
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                filter === f
                  ? 'bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground font-medium'
                  : 'border border-gold/20 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === f ? 'bg-primary-foreground/20' : 'bg-gold/10 text-gold'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="luxury-card rounded-2xl p-12 text-center">
          <Inbox className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">لا توجد رسائل في هذه الفئة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const statusInfo = STATUS_LABELS[m.status] || STATUS_LABELS.new;
            return (
              <div
                key={m.id}
                onClick={() => setSelected(m)}
                className={`luxury-card rounded-xl p-4 cursor-pointer transition-all hover:!border-gold/40 ${
                  m.status === 'new' ? '!border-gold/40 gold-glow' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft/30 to-gold-deep/30 border border-gold/30">
                    <span className="font-bold text-gold">{m.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm">{m.name}</h3>
                      <Badge variant="outline" className={`text-[10px] ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                      {m.service && (
                        <Badge variant="outline" className="text-[10px] border-gold/30 text-gold bg-gold/5">
                          {m.service}
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm mb-1 line-clamp-1">{m.subject}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.message}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {new Date(m.createdAt).toLocaleString('ar-EG')} · {m.email}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <Dialog open onOpenChange={(v) => !v && setSelected(null)}>
          <DialogContent className="luxury-card !bg-card !border-gold/30 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={STATUS_LABELS[selected.status]?.color}>
                  {STATUS_LABELS[selected.status]?.label}
                </Badge>
                {selected.service && (
                  <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5">
                    {selected.service}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl">{selected.subject}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-secondary/30 border border-gold/10">
                  <p className="text-xs text-muted-foreground mb-1">الاسم</p>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-gold/10">
                  <p className="text-xs text-muted-foreground mb-1">البريد</p>
                  <a href={`mailto:${selected.email}`} className="font-medium text-gold flex items-center gap-1" dir="ltr">
                    <Mail className="h-3 w-3" />
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div className="p-3 rounded-lg bg-secondary/30 border border-gold/10">
                    <p className="text-xs text-muted-foreground mb-1">الهاتف</p>
                    <a href={`tel:${selected.phone}`} className="font-medium text-gold flex items-center gap-1" dir="ltr">
                      <Phone className="h-3 w-3" />
                      {selected.phone}
                    </a>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-secondary/30 border border-gold/10">
                  <p className="text-xs text-muted-foreground mb-1">التاريخ</p>
                  <p className="font-medium text-sm">{new Date(selected.createdAt).toLocaleString('ar-EG')}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">الرسالة</p>
                <div className="p-4 rounded-lg bg-secondary/30 border border-gold/15 text-foreground/90 leading-relaxed whitespace-pre-line">
                  {selected.message}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-gold/15">
                <Button
                  asChild
                  className="bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground"
                >
                  <a href={`mailto:${selected.email}?subject=رد: ${encodeURIComponent(selected.subject)}`}>
                    <Reply className="h-4 w-4 ml-2" />
                    رد عبر البريد
                  </a>
                </Button>
                {selected.status !== 'replied' && (
                  <Button
                    onClick={() => updateStatus(selected.id, 'replied')}
                    variant="outline"
                    className="border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
                  >
                    <CheckCheck className="h-4 w-4 ml-2" />
                    وضع كـ "تم الرد"
                  </Button>
                )}
                <Button
                  onClick={() => updateStatus(selected.id, 'archived')}
                  variant="outline"
                  className="border-gold/30 hover:bg-gold/10"
                >
                  <Archive className="h-4 w-4 ml-2" />
                  أرشفة
                </Button>
                <Button
                  onClick={() => deleteMessage(selected.id)}
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 mr-auto"
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
