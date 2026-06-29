'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, Star, Sparkles, FileText, Phone, Share2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface Settings {
  id?: string
  heroTitle: string
  heroSubtitle: string
  heroStat1Num: string
  heroStat1Label: string
  heroStat2Num: string
  heroStat2Label: string
  heroStat3Num: string
  heroStat3Label: string
  heroQuote: string
  email: string
  phone: string
  whatsapp: string
  address: string
  workHours: string
  facebook?: string | null
  instagram?: string | null
  youtube?: string | null
  tiktok?: string | null
  telegram?: string | null
  whatsappCommunity?: string | null
  aboutTitle: string
  aboutIntro1: string
  aboutIntro2: string
  aboutIntro3: string
  aboutClosing: string
  seoTitle: string
  seoDescription: string
}

const EMPTY: Settings = {
  heroTitle: '', heroSubtitle: '',
  heroStat1Num: '', heroStat1Label: '', heroStat2Num: '', heroStat2Label: '', heroStat3Num: '', heroStat3Label: '',
  heroQuote: '',
  email: '', phone: '', whatsapp: '', address: '', workHours: '',
  facebook: '', instagram: '', youtube: '', tiktok: '', telegram: '', whatsappCommunity: '',
  aboutTitle: '', aboutIntro1: '', aboutIntro2: '', aboutIntro3: '', aboutClosing: '',
  seoTitle: '', seoDescription: '',
}

export function SettingsManager() {
  const [settings, setSettings] = useState<Settings>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => { if (d.settings) setSettings(d.settings) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'فشل الحفظ')
        return
      }
      toast.success('تم حفظ الإعدادات بنجاح')
      if (result.settings) setSettings(result.settings)
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold font-display">إعدادات الموقع</h1>
          <p className="text-sm text-muted-foreground">إدارة محتوى وإعدادات الموقع</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          {saving ? <Loader2 className="ml-1 h-4 w-4 animate-spin" /> : <Save className="ml-1 h-4 w-4" />}
          حفظ التغييرات
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-muted/50 h-auto">
          <TabsTrigger value="hero" className="text-xs md:text-sm"><Sparkles className="ml-1 h-3 w-3" />الهيرو</TabsTrigger>
          <TabsTrigger value="about" className="text-xs md:text-sm"><FileText className="ml-1 h-3 w-3" />من نحن</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs md:text-sm"><Phone className="ml-1 h-3 w-3" />التواصل</TabsTrigger>
          <TabsTrigger value="social" className="text-xs md:text-sm"><Share2 className="ml-1 h-3 w-3" />التواصل الاجتماعي</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs md:text-sm"><Search className="ml-1 h-3 w-3" />SEO</TabsTrigger>
        </TabsList>

        {/* Hero tab */}
        <TabsContent value="hero" className="mt-4">
          <Card className="luxury-card p-5 space-y-4">
            <div className="space-y-1.5">
              <Label>عنوان الهيرو</Label>
              <Input value={settings.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>الوصف الفرعي</Label>
              <Textarea value={settings.heroSubtitle} onChange={(e) => update('heroSubtitle', e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-2 p-3 rounded-lg bg-muted/20 border border-[#D4AF37]/10">
                  <Label className="text-xs">إحصائية {n}</Label>
                  <Input value={settings[`heroStat${n}Num` as keyof Settings] as string} onChange={(e) => update(`heroStat${n}Num` as 'heroStat1Num', e.target.value)} placeholder="الرقم" />
                  <Input value={settings[`heroStat${n}Label` as keyof Settings] as string} onChange={(e) => update(`heroStat${n}Label` as 'heroStat1Label', e.target.value)} placeholder="الوصف" />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label>الاقتباس</Label>
              <Textarea value={settings.heroQuote} onChange={(e) => update('heroQuote', e.target.value)} rows={2} />
            </div>
          </Card>
        </TabsContent>

        {/* About tab */}
        <TabsContent value="about" className="mt-4">
          <Card className="luxury-card p-5 space-y-4">
            <div className="space-y-1.5">
              <Label>عنوان القسم</Label>
              <Input value={settings.aboutTitle} onChange={(e) => update('aboutTitle', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>المقدمة الأولى</Label>
              <Textarea value={settings.aboutIntro1} onChange={(e) => update('aboutIntro1', e.target.value)} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>المقدمة الثانية</Label>
              <Textarea value={settings.aboutIntro2} onChange={(e) => update('aboutIntro2', e.target.value)} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>المقدمة الثالثة</Label>
              <Textarea value={settings.aboutIntro3} onChange={(e) => update('aboutIntro3', e.target.value)} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>الخاتمة</Label>
              <Input value={settings.aboutClosing} onChange={(e) => update('aboutClosing', e.target.value)} />
            </div>
          </Card>
        </TabsContent>

        {/* Contact tab */}
        <TabsContent value="contact" className="mt-4">
          <Card className="luxury-card p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={settings.email} onChange={(e) => update('email', e.target.value)} dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>الهاتف</Label>
                <Input value={settings.phone} onChange={(e) => update('phone', e.target.value)} dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>واتساب (بدون +)</Label>
                <Input value={settings.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} dir="ltr" placeholder="963981581384" />
              </div>
              <div className="space-y-1.5">
                <Label>ساعات العمل</Label>
                <Input value={settings.workHours} onChange={(e) => update('workHours', e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>العنوان</Label>
                <Input value={settings.address} onChange={(e) => update('address', e.target.value)} />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Social tab */}
        <TabsContent value="social" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {([
              { key: 'facebook', label: 'فيسبوك', emoji: '📘', color: '#1877F2' },
              { key: 'instagram', label: 'إنستغرام', emoji: '📷', color: '#E4405F' },
              { key: 'youtube', label: 'يوتيوب', emoji: '▶️', color: '#FF0000' },
              { key: 'tiktok', label: 'تيك توك', emoji: '🎵', color: '#000000' },
              { key: 'telegram', label: 'تلغرام', emoji: '✈️', color: '#0088CC' },
              { key: 'whatsappCommunity', label: 'مجتمع واتساب', emoji: '💬', color: '#25D366' },
            ] as const).map((s) => {
              const value = settings[s.key] as string
              return (
                <Card key={s.key} className="luxury-card p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{s.emoji}</span>
                    <Label className="text-sm font-medium">{s.label}</Label>
                  </div>
                  <Input
                    value={value || ''}
                    onChange={(e) => update(s.key, e.target.value)}
                    placeholder="https://..."
                    dir="ltr"
                  />
                  {/* QR Code */}
                  {value && (
                    <div className="flex justify-center p-2 bg-white rounded-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(value)}`}
                        alt={`QR ${s.label}`}
                        className="w-24 h-24"
                        loading="lazy"
                      />
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* SEO tab */}
        <TabsContent value="seo" className="mt-4">
          <Card className="luxury-card p-5 space-y-4">
            <div className="space-y-1.5">
              <Label>عنوان SEO</Label>
              <Input value={settings.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} />
              <p className="text-xs text-muted-foreground">{settings.seoTitle.length}/60 حرف</p>
            </div>
            <div className="space-y-1.5">
              <Label>وصف SEO</Label>
              <Textarea value={settings.seoDescription} onChange={(e) => update('seoDescription', e.target.value)} rows={3} />
              <p className="text-xs text-muted-foreground">{settings.seoDescription.length}/160 حرف</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          {saving ? <Loader2 className="ml-1 h-4 w-4 animate-spin" /> : <Save className="ml-1 h-4 w-4" />}
          حفظ التغييرات
        </Button>
      </div>
    </div>
  )
}
