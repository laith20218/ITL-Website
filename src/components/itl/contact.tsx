'use client';

import * as React from 'react';
import { Send, MapPin, Mail, Phone, Clock, Loader2, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SectionHeading } from './services';
import { useToast } from '@/hooks/use-toast';

const SERVICE_OPTIONS = [
  'البحث العلمي والرسائل الجامعية',
  'الترجمة الاحترافية',
  'التصميم الجرافيكي والهويات البصرية',
  'الإنتاج السمعي والبصري',
  'التدريب والتطوير المهني',
  'التسويق الرقمي والمواقع',
  'الطباعة والمنتجات الورقية',
  'أخرى',
];

const CONTACT_INFO = [
  { icon: Mail, label: 'البريد الإلكتروني', value: 'info@itl-team.com', href: 'mailto:info@itl-team.com' },
  { icon: Phone, label: 'الهاتف / واتساب', value: '+966 50 000 0000', href: 'tel:+966500000000' },
  { icon: MapPin, label: 'العنوان', value: 'الرياض، المملكة العربية السعودية', href: '#' },
  { icon: Clock, label: 'ساعات العمل', value: 'السبت - الخميس، 9 صباحًا - 9 مساءً', href: '#' },
];

export function Contact() {
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الإرسال');
      toast({
        title: 'تم إرسال رسالتك بنجاح',
        description: 'سنتواصل معك في أقرب وقت ممكن. شكرًا لتواصلك مع ITL.',
      });
      setForm({ name: '', email: '', phone: '', service: '', subject: '', message: '' });
    } catch (e) {
      const err = e as Error;
      toast({ variant: 'destructive', title: 'تعذر الإرسال', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          eyebrow="تواصل معنا"
          title="جاهزون لتحويل فكرتك إلى واقع"
          subtitle="أخبرنا عن مشروعك أو احتياجك، وسيتواصل معك فريقنا خلال 24 ساعة لعرض الحلول المناسبة."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-14">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="luxury-card rounded-2xl p-6 mb-4 gold-glow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 border border-gold/30">
                  <MessageCircle className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">لنبدأ الحديث</h3>
                  <p className="text-xs text-muted-foreground">فريقنا في خدمتك دائمًا</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                سواء كنت طالب باحث، أو صاحب عمل يحتاج إلى هوية بصرية، أو شركة تبحث عن
                تدريب لموظفيها — نحن نقدم لك حلولًا متكاملة بمعايير عالمية.
              </p>
            </div>

            <div className="space-y-3">
              {CONTACT_INFO.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-center gap-4 p-4 rounded-xl luxury-card luxury-card-hover group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-colors">
                    <c.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{c.label}</p>
                    <p className="text-sm font-medium text-foreground truncate" dir="auto">
                      {c.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="luxury-card rounded-2xl p-5">
              <p className="text-sm text-muted-foreground mb-3 text-center">تابعنا على</p>
              <div className="flex justify-center gap-3">
                {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    aria-label={s}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 hover:bg-gold/10 hover:border-gold transition-all text-gold text-xs font-bold"
                  >
                    {s.charAt(0)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-3 luxury-card rounded-2xl p-6 lg:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="name"
                label="الاسم الكامل"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="مثال: محمد عبد الله"
              />
              <FormField
                id="email"
                label="البريد الإلكتروني"
                type="email"
                required
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@example.com"
              />
              <FormField
                id="phone"
                label="رقم الجوال"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+9665xxxxxxxx"
              />
              <div className="space-y-1.5">
                <Label htmlFor="service" className="text-sm">
                  الخدمة المطلوبة
                </Label>
                <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                  <SelectTrigger className="bg-secondary/30 border-gold/20 focus:border-gold h-11">
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold/30">
                    {SERVICE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormField
              id="subject"
              label="الموضوع"
              required
              value={form.subject}
              onChange={(v) => setForm({ ...form, subject: v })}
              placeholder="عنوان رسالتك"
            />

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-sm">
                تفاصيل الطلب <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="اكتب تفاصيل مشروعك أو احتياجك هنا..."
                required
                rows={5}
                className="bg-secondary/30 border-gold/20 focus:border-gold resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground hover:opacity-90 font-semibold text-base gold-glow"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 ml-2" />
                  إرسال الطلب
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              بياناتك آمنة معنا ولن تُستخدم إلا للتواصل معك بخصوص طلبك.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="bg-secondary/30 border-gold/20 focus:border-gold focus-visible:border-gold h-11"
      />
    </div>
  );
}
