'use client'

/** Style: لوحة إدارة ITL — واجهة داكنة هادئة تجمع الحقول والبطاقات في مجموعات محتوى واضحة بلا منشئ صفحات حر. */
import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, GripVertical, Loader2, Plus, Save, Trash2, ArrowUp, ArrowDown, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { UI_DEFAULT_SECTIONS, UI_SECTION_KEYS, type UiSectionKey } from '@/lib/ui-content'

type UiSection = { id: string; sectionKey: UiSectionKey; content: Record<string, string>; sortOrder: number; isVisible: boolean }
type UiCard = { id: string; sectionKey: string; cardType: string; content: Record<string, unknown>; sortOrder: number; isVisible: boolean }

const SECTION_META: Record<UiSectionKey, { label: string; description: string }> = {
  header: { label: 'الرأس والتنقل', description: 'الروابط وتسميات الحساب والتنقل العلوي.' },
  hero: { label: 'الواجهة الرئيسية', description: 'الوعد الرئيسي، أزرار الدعوة، والإحصاءات.' },
  services: { label: 'بوابات الخدمات', description: 'العنوان وتسميات البوابات ونصوص المسار.' },
  about: { label: 'من نحن', description: 'النص التعريفي وبطاقات القيم المتكررة.' },
  articles: { label: 'المقالات', description: 'عنوان ووصف قسم المحتوى العملي.' },
  contact: { label: 'التواصل', description: 'عنوان نقطة البداية وبطاقات معلومات التواصل.' },
  footer: { label: 'التذييل', description: 'تعريف ITL وروابط ومعلومات التذييل.' },
}

const LONG_KEYS = new Set(['subtitle', 'description', 'intro1', 'intro2', 'intro3', 'closing'])
const FIELD_LABELS: Record<string, string> = {
  brandTagline: 'العبارة تحت الشعار', loginLabel: 'زر الدخول', accountLabel: 'رابط حسابي', adminLabel: 'رابط لوحة التحكم',
  eyebrow: 'الشارة الصغيرة', titlePrefix: 'بداية العنوان', titleAccent: 'الجزء المميز من العنوان', titleStart: 'بداية عنوان القسم',
  title: 'العنوان', subtitle: 'الوصف الفرعي', description: 'الوصف', primaryCtaLabel: 'زر الدعوة الأساسي', primaryCtaHref: 'رابط الزر الأساسي',
  secondaryCtaLabel: 'زر الدعوة الثانوي', secondaryCtaHref: 'رابط الزر الثانوي', overline: 'النص فوق العنوان', closing: 'النص الختامي',
  intro1: 'الفقرة التعريفية الأولى', intro2: 'الفقرة التعريفية الثانية', intro3: 'الفقرة التعريفية الثالثة',
  formTitle: 'عنوان النموذج', submitLabel: 'زر إرسال الطلب', linksTitle: 'عنوان الروابط', contactTitle: 'عنوان التواصل', copyright: 'نص الحقوق',
  routeStart: 'محطة المسار الأولى', routeMiddle: 'محطة المسار الوسطى', routeEnd: 'محطة المسار الأخيرة', allLabel: 'تسمية الكل',
  searchPlaceholder: 'نص البحث الإرشادي', emptyLabel: 'رسالة عدم وجود مقالات',
  nameLabel: 'تسمية حقل الاسم', namePlaceholder: 'نص حقل الاسم الإرشادي', emailLabel: 'تسمية حقل البريد', emailPlaceholder: 'نص حقل البريد الإرشادي',
  phoneLabel: 'تسمية حقل الهاتف', phonePlaceholder: 'نص حقل الهاتف الإرشادي', serviceLabel: 'تسمية حقل الخدمة', servicePlaceholder: 'نص اختيار الخدمة الإرشادي',
  subjectLabel: 'تسمية حقل الموضوع', subjectPlaceholder: 'نص حقل الموضوع الإرشادي', messageLabel: 'تسمية حقل الرسالة', messagePlaceholder: 'نص حقل الرسالة الإرشادي',
  paymentTitle: 'عنوان قسم الدفع', walletLabel: 'تسمية عنوان المحفظة', walletAddress: 'عنوان المحفظة', copyLabel: 'زر النسخ',
  amountLabel: 'تسمية حقل المبلغ', amountPlaceholder: 'نص حقل المبلغ الإرشادي', referenceLabel: 'تسمية رقم التحويل', referencePlaceholder: 'نص رقم التحويل الإرشادي',
  facebookUrl: 'رابط فيسبوك', instagramUrl: 'رابط إنستغرام', youtubeUrl: 'رابط يوتيوب', telegramUrl: 'رابط تيليغرام', whatsappUrl: 'رابط واتساب', madeWith: 'عبارة التصميم الختامية',
}

function fieldLabel(key: string) {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key]
  const nav = key.match(/^nav(\d)(Label|Href)$/)
  if (nav) return nav[2] === 'Label' ? `تسمية رابط التنقل ${nav[1]}` : `رابط التنقل ${nav[1]}`
  const stat = key.match(/^stat(\d)(Num|Label)$/)
  if (stat) return stat[2] === 'Num' ? `رقم الإحصائية ${stat[1]}` : `وصف الإحصائية ${stat[1]}`
  const portal = key.match(/^(academic|creative|digital)(Label|Action|Eyebrow|Title|Description)$/)
  if (portal) {
    const names = { academic: 'الأكاديمية واللغوية', creative: 'الإبداعية والإعلامية', digital: 'الرقمية والتطوير' }
    const fieldNames = { Label: 'تسمية', Action: 'نص الزر', Eyebrow: 'الشارة التعريفية', Title: 'عنوان البوابة', Description: 'وصف البوابة' }
    return `${fieldNames[portal[2] as keyof typeof fieldNames]} بوابة ${names[portal[1] as keyof typeof names]}`
  }
  return key
}

function cardFieldLabel(key: string) {
  const labels: Record<string, string> = { title: 'العنوان', description: 'الوصف', label: 'التسمية', value: 'القيمة الظاهرة', href: 'الرابط', icon: 'اسم الرمز', actionLabel: 'نص الزر', actionHref: 'رابط الزر' }
  return labels[key] || key
}

function isLongField(key: string) {
  return LONG_KEYS.has(key) || key.endsWith('Description') || key.endsWith('Placeholder')
}

function defaultCard(sectionKey: string): { cardType: string; content: Record<string, string> } {
  if (sectionKey === 'about') return { cardType: 'value', content: { icon: 'idea', title: 'قيمة جديدة', description: 'اكتب وصفًا قصيرًا للقيمة.' } }
  if (sectionKey === 'contact') return { cardType: 'contact', content: { icon: 'mail', label: 'وسيلة تواصل', value: 'القيمة الظاهرة', href: '' } }
  return { cardType: 'content', content: { title: 'بطاقة جديدة', description: 'اكتب وصف البطاقة هنا.', actionLabel: '', actionHref: '' } }
}

export function UiManager() {
  const [sections, setSections] = useState<UiSection[]>([])
  const [cards, setCards] = useState<UiCard[]>([])
  const [active, setActive] = useState<UiSectionKey>('header')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)

  const activeSection = useMemo(() => sections.find((section) => section.sectionKey === active) ?? {
    id: '', sectionKey: active, content: UI_DEFAULT_SECTIONS[active], sortOrder: UI_SECTION_KEYS.indexOf(active), isVisible: true,
  }, [sections, active])
  const activeCards = useMemo(() => cards.filter((card) => card.sectionKey === active).sort((a, b) => a.sortOrder - b.sortOrder), [cards, active])

  useEffect(() => {
    fetch('/api/admin/ui')
      .then((response) => response.json())
      .then((data) => {
        setSections((data.sections || []).map((section: UiSection) => ({ ...section, content: section.content || UI_DEFAULT_SECTIONS[section.sectionKey] })))
        setCards(data.cards || [])
      })
      .catch(() => toast.error('تعذر تحميل محتوى الواجهة'))
      .finally(() => setLoading(false))
  }, [])

  function updateField(key: string, value: string) {
    setSections((current) => current.map((section) => section.sectionKey === active ? { ...section, content: { ...section.content, [key]: value } } : section))
  }

  async function saveSections() {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/ui', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sections }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      toast.success('تم حفظ محتوى الواجهة')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل حفظ المحتوى')
    } finally {
      setSaving(false)
    }
  }

  async function toggleSection(checked: boolean) {
    setSections((current) => current.map((section) => section.sectionKey === active ? { ...section, isVisible: checked } : section))
  }

  async function addCard() {
    setCreating(true)
    try {
      const draft = defaultCard(active)
      const response = await fetch('/api/admin/ui', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sectionKey: active, ...draft }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setCards((current) => [...current, data.card])
      toast.success('تمت إضافة البطاقة')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل إضافة البطاقة')
    } finally {
      setCreating(false)
    }
  }

  async function updateCard(card: UiCard, changes: Partial<UiCard>) {
    const response = await fetch(`/api/admin/ui/cards/${card.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'فشل تحديث البطاقة')
    setCards((current) => current.map((item) => item.id === card.id ? data.card : item))
  }

  async function deleteCard(card: UiCard) {
    if (!window.confirm('هل تريد حذف هذه البطاقة؟')) return
    try {
      const response = await fetch(`/api/admin/ui/cards/${card.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error()
      setCards((current) => current.filter((item) => item.id !== card.id))
      toast.success('تم حذف البطاقة')
    } catch { toast.error('فشل حذف البطاقة') }
  }

  async function moveCard(card: UiCard, direction: -1 | 1) {
    const index = activeCards.findIndex((item) => item.id === card.id)
    const target = activeCards[index + direction]
    if (!target) return
    try {
      await Promise.all([
        updateCard(card, { sortOrder: target.sortOrder }),
        updateCard(target, { sortOrder: card.sortOrder }),
      ])
    } catch { toast.error('فشل تغيير ترتيب البطاقة') }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" /></div>

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-[#D4AF37]" /><h1 className="text-2xl font-bold text-gradient-gold font-display">واجهة المستخدم</h1></div>
          <p className="mt-1 text-sm text-muted-foreground">حرّر النصوص والعناصر العامة الظاهرة للزائر ضمن أقسام منظمة.</p>
        </div>
        <Button onClick={saveSections} disabled={saving} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          {saving ? <Loader2 className="ml-1 h-4 w-4 animate-spin" /> : <Save className="ml-1 h-4 w-4" />} حفظ كل التغييرات
        </Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[240px_1fr]">
        <aside className="luxury-card h-fit rounded-xl p-2">
          {UI_SECTION_KEYS.map((key) => <button key={key} onClick={() => setActive(key)} className={`w-full rounded-lg px-3 py-3 text-right text-sm transition-colors ${active === key ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
            {SECTION_META[key].label}
          </button>)}
        </aside>

        <div className="space-y-5">
          <Card className="luxury-card p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><h2 className="text-lg font-bold">{SECTION_META[active].label}</h2><p className="mt-1 text-sm text-muted-foreground">{SECTION_META[active].description}</p></div>
              <div className="flex items-center gap-2 text-sm"><span>{activeSection.isVisible ? 'ظاهر للزائر' : 'مخفي عن الزائر'}</span><Switch checked={activeSection.isVisible} onCheckedChange={toggleSection} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(activeSection.content).map(([key, value]) => <div key={key} className={isLongField(key) ? 'space-y-1.5 md:col-span-2' : 'space-y-1.5'}>
                <Label className="text-xs">{fieldLabel(key)}</Label>
                {isLongField(key) ? <Textarea rows={3} value={value || ''} onChange={(event) => updateField(key, event.target.value)} /> : <Input dir={key.toLowerCase().includes('href') ? 'ltr' : 'rtl'} value={value || ''} onChange={(event) => updateField(key, event.target.value)} />}
              </div>)}
            </div>
          </Card>

          <Card className="luxury-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-bold">بطاقات القسم</h2><p className="mt-1 text-xs text-muted-foreground">أضف أو احذف أو أعد ترتيب البطاقات التي يدعمها هذا القسم.</p></div><Button size="sm" onClick={addCard} disabled={creating} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="ml-1 h-4 w-4" />} بطاقة جديدة</Button></div>
            {activeCards.length === 0 ? <div className="rounded-lg border border-dashed border-[#D4AF37]/20 p-6 text-center text-sm text-muted-foreground">لا توجد بطاقات في هذا القسم بعد.</div> : <div className="space-y-3">
              {activeCards.map((card, index) => <UiCardEditor key={card.id} card={card} index={index} total={activeCards.length} onUpdate={updateCard} onDelete={deleteCard} onMove={moveCard} />)}
            </div>}
          </Card>
        </div>
      </div>
    </div>
  )
}

function UiCardEditor({ card, index, total, onUpdate, onDelete, onMove }: { card: UiCard; index: number; total: number; onUpdate: (card: UiCard, changes: Partial<UiCard>) => Promise<void>; onDelete: (card: UiCard) => Promise<void>; onMove: (card: UiCard, direction: -1 | 1) => Promise<void> }) {
  const [content, setContent] = useState<Record<string, unknown>>(card.content)
  const [saving, setSaving] = useState(false)

  useEffect(() => setContent(card.content), [card.content])

  async function saveCard() {
    setSaving(true)
    try { await onUpdate(card, { content }) ; toast.success('تم حفظ البطاقة') } catch (error) { toast.error(error instanceof Error ? error.message : 'فشل حفظ البطاقة') } finally { setSaving(false) }
  }

  return <div className="rounded-xl border border-[#D4AF37]/15 bg-black/10 p-4">
    <div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{card.cardType === 'value' ? 'بطاقة قيمة' : card.cardType === 'contact' ? 'بطاقة تواصل' : 'بطاقة محتوى'}</span></div><div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" disabled={index === 0} onClick={() => onMove(card, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7" disabled={index === total - 1} onClick={() => onMove(card, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdate(card, { isVisible: !card.isVisible })}>{card.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</Button><Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => onDelete(card)}><Trash2 className="h-3.5 w-3.5" /></Button></div></div>
    <div className="grid gap-3 md:grid-cols-2">{Object.entries(content).map(([key, value]) => <div key={key} className={key === 'description' ? 'space-y-1.5 md:col-span-2' : 'space-y-1.5'}><Label className="text-xs">{cardFieldLabel(key)}</Label>{key === 'description' ? <Textarea rows={2} value={String(value ?? '')} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} /> : <Input dir={key.toLowerCase().includes('href') ? 'ltr' : 'rtl'} value={String(value ?? '')} onChange={(event) => setContent((current) => ({ ...current, [key]: event.target.value }))} />}</div>)}</div>
    <div className="mt-3 flex justify-end"><Button size="sm" variant="outline" disabled={saving} onClick={saveCard}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="ml-1 h-3.5 w-3.5" />} حفظ البطاقة</Button></div>
  </div>
}
