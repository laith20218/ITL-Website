'use client'

/** Style: مسار الإنجاز الذهبي — ختام هادئ يجمع التواصل وروابط الرحلة حول أثر ذهبي واحد. */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Send, MessageCircle } from 'lucide-react'
import { Logo } from './logo'

interface Settings {
  email: string
  phone: string
  whatsapp: string
  address: string
  workHours: string
  facebook?: string | null
  instagram?: string | null
  youtube?: string | null
  telegram?: string | null
  tiktok?: string | null
}

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || null))
      .catch(() => {})
  }, [])

  const s = settings || {
    email: 'ITL.Team.2023@gmail.com',
    phone: '+963 981 581 384',
    whatsapp: '963981581384',
    address: 'حمص، سوريا',
    workHours: 'الأحد - الخميس، 9 صباحًا - 4 عصرًا',
  }

  return (
    <footer className="journey-footer">
      <div className="absolute top-0 left-0 right-0 h-px divider-glow" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + tagline */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="ITL">
              <Logo className="w-12 h-12" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold text-gradient-gold font-display">ITL</span>
                <span className="text-[10px] text-muted-foreground">Idea To Life</span>
              </div>
            </Link>
            <p className="text-sm text-foreground/60 max-w-md leading-relaxed mb-4">
              فريق ITL يحوّل أفكارك إلى واقع ملموس، بخدمات احترافية تجمع بين الإبداع والجودة والسرعة في التنفيذ.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-[#D4AF37]/15 flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4 text-[#D4AF37]" />
                </a>
              )}
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-[#D4AF37]/15 flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4 text-[#D4AF37]" />
                </a>
              )}
              {s.youtube && (
                <a href={s.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-[#D4AF37]/15 flex items-center justify-center transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4 text-[#D4AF37]" />
                </a>
              )}
              {s.telegram && (
                <a href={s.telegram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-[#D4AF37]/15 flex items-center justify-center transition-colors" aria-label="Telegram">
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                </a>
              )}
              <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-[#D4AF37]/15 flex items-center justify-center transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav aria-label="روابط سريعة">
            <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" className="text-foreground/60 hover:text-[#D4AF37] transition-colors">البوابات</Link></li>
              <li><Link href="/#about" className="text-foreground/60 hover:text-[#D4AF37] transition-colors">من نحن</Link></li>
              <li><Link href="/#articles" className="text-foreground/60 hover:text-[#D4AF37] transition-colors">المدونة</Link></li>
              <li><Link href="/portfolio" className="text-foreground/60 hover:text-[#D4AF37] transition-colors">أعمالنا</Link></li>
              <li><Link href="/#contact" className="text-foreground/60 hover:text-[#D4AF37] transition-colors">تواصل معنا</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">معلومات التواصل</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-foreground/60">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span className="break-all">{s.email}</span>
              </li>
              <li className="flex items-start gap-2 text-foreground/60">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span dir="ltr">{s.phone}</span>
              </li>
              <li className="flex items-start gap-2 text-foreground/60">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{s.address}</span>
              </li>
              <li className="flex items-start gap-2 text-foreground/60">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{s.workHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#D4AF37]/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} فريق ITL — جميع الحقوق محفوظة
          </p>
          <p className="text-xs text-muted-foreground">
            صُمّم بحبّ <span className="text-[#D4AF37]">♥</span> لعملائنا
          </p>
        </div>
      </div>
    </footer>
  )
}
