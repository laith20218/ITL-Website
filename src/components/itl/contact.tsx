'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Loader2, MessageCircle, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Service {
  id: string
  slug: string
  title: string
}

interface Settings {
  email: string
  phone: string
  whatsapp: string
  address: string
  workHours: string
}

export function Contact() {
  const [services, setServices] = useState<Service[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    subject: '',
    message: '',
    shamcashAmount: '',
    shamcashRef: '',
  })

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(() => {})
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || null))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('الرجاء تعبئة الحقول المطلوبة')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          shamcashAmount: form.shamcashAmount || undefined,
          shamcashRef: form.shamcashRef || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'فشل الإرسال')
        return
      }
      toast.success('تم استلام رسالتك بنجاح، سنتواصل معك قريباً')
      setForm({
        name: '',
        email: '',
        phone: '',
        service: '',
        subject: '',
        message: '',
        shamcashAmount: '',
        shamcashRef: '',
      })
    } catch {
      toast.error('حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: Mail, label: 'البريد الإلكتروني', value: settings?.email || 'ITL.Team.2023@gmail.com', href: `mailto:${settings?.email || 'ITL.Team.2023@gmail.com'}` },
    { icon: Phone, label: 'الهاتف', value: settings?.phone || '+963 981 581 384', href: `tel:${settings?.phone || '+963981581384'}` },
    { icon: MessageCircle, label: 'واتساب', value: 'تواصل عبر واتساب', href: `https://wa.me/${settings?.whatsapp || '963981581384'}` },
    { icon: MapPin, label: 'العنوان', value: settings?.address || 'حمص، سوريا' },
    { icon: Clock, label: 'ساعات العمل', value: settings?.workHours || 'الأحد - الخميس، 9 صباحًا - 4 عصرًا' },
  ]

  return (
    <section id="contact" className="py-20 md:py-28 relative bg-pattern" aria-label="تواصل معنا">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
            <span className="glow-dot" />
            <span className="text-xs font-medium text-[#D4AF37]">تواصل معنا</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-gradient-gold mb-4">
            ابدأ مشروعك معنا
          </h2>
          <p className="text-foreground/60">
            املأ النموذج وسيتواصل معك فريقنا في أقرب وقت ممكن
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {/* Contact info */}
          <aside className="lg:col-span-2 space-y-3">
            {contactInfo.map((info, i) => {
              const Icon = info.icon
              const content = (
                <div className="luxury-card p-5 flex items-center gap-4 group lift-neon">
                  <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">{info.label}</div>
                    <div className="text-sm font-medium truncate">{info.value}</div>
                  </div>
                </div>
              )
              if (info.href) {
                return (
                  <a key={i} href={info.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                )
              }
              return <div key={i}>{content}</div>
            })}
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="luxury-card p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="اسمك الكامل"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+963 9xx xxx xxx"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="service">الخدمة المطلوبة</Label>
                  <Select
                    value={form.service}
                    onValueChange={(v) => setForm({ ...form, service: v })}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="اختر الخدمة" />
                    </SelectTrigger>
                    <SelectContent className="luxury-card">
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.title}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">الموضوع *</Label>
                <Input
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="موضوع رسالتك"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">رسالتك *</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="اكتب تفاصيل طلبك هنا..."
                  rows={5}
                  required
                />
              </div>

              {/* ShamCash */}
              <div className="p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#D4AF37]">معلومات ShamCash (اختياري)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-xs">المبلغ</Label>
                    <Input
                      id="amount"
                      value={form.shamcashAmount}
                      onChange={(e) => setForm({ ...form, shamcashAmount: e.target.value })}
                      placeholder="مثال: 50000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ref" className="text-xs">رقم المرجع</Label>
                    <Input
                      id="ref"
                      value={form.shamcashRef}
                      onChange={(e) => setForm({ ...form, shamcashRef: e.target.value })}
                      placeholder="رقم عملية التحويل"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-black hover:bg-[#E8C964] shimmer-hover font-medium"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="ml-2 h-4 w-4" />
                )}
                إرسال الطلب
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
