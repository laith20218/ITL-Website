'use client'

/** Style: هوية ITL الداكنة والذهبية — نافذة اتصال عائمة هادئة عند أسفل اليسار، فوق المحتوى لا فوق الحوارات. */
import { ArrowUpLeft, ChevronDown, Mail, MessageCircle, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useUiContent } from './ui-content-provider'

const WHATSAPP_NUMBER = '963981581384'
const DEFAULT_EMAIL = 'ITL.support.email@gmail.com'

export function FloatingContact() {
  const [open, setOpen] = useState(false)
  const { getCards } = useUiContent()
  const email = useMemo(() => {
    const mailCard = getCards('contact').find((card) => String(card.content.icon) === 'mail')
    const configured = String(mailCard?.content.value || '').trim()
    return configured.includes('@') ? configured : DEFAULT_EMAIL
  }, [getCards])
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`

  return (
    <aside className="fixed bottom-5 left-5 z-40 flex max-w-[calc(100vw-2.5rem)] flex-col items-start gap-3 pb-[env(safe-area-inset-bottom)]" aria-label="خيارات التواصل">
      <div id="itl-floating-contact-panel" className={`w-72 origin-bottom-left overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-[#0B0B0B]/95 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200 ease-out ${open ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-95 opacity-0'}`} aria-hidden={!open}>
        <div className="border-b border-[#D4AF37]/15 px-4 py-3">
          <h2 className="text-base font-bold text-[#E8C964]">تواصل معنا</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">اختر القناة الأنسب لبدء الحديث.</p>
        </div>
        <div className="space-y-1 p-2">
          <a href="/#contact" onClick={() => setOpen(false)} className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-[#D4AF37]/10">
            <span>عبر الموقع</span><ArrowUpLeft className="h-4 w-4 text-[#D4AF37] transition-transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-[#D4AF37]/10">
            <span>عبر الواتساب</span><MessageCircle className="h-4 w-4 text-[#D4AF37] transition-transform group-hover:scale-110" />
          </a>
          <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-[#D4AF37]/10">
            <span>عبر البريد الإلكتروني</span><Mail className="h-4 w-4 text-[#D4AF37] transition-transform group-hover:-translate-y-0.5" />
          </a>
          <a href={`mailto:${encodeURIComponent(email)}`} className="mx-3 mb-2 block text-[11px] text-muted-foreground underline-offset-4 hover:text-[#E8C964] hover:underline">فتح تطبيق البريد الافتراضي بدل Gmail</a>
        </div>
      </div>
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="itl-floating-contact-panel" className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E8C964]/70 bg-[#D4AF37] text-[#0A0A0A] shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#E8C964] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C964] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
        {open ? <ChevronDown className="h-6 w-6" aria-hidden="true" /> : <Send className="h-6 w-6 -rotate-45" aria-hidden="true" />}
        <span className="sr-only">{open ? 'إغلاق خيارات التواصل' : 'فتح خيارات التواصل'}</span>
      </button>
    </aside>
  )
}
