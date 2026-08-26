'use client'

/** Style: مسار الإنجاز الذهبي — ختام هادئ يجمع التواصل وروابط الرحلة حول أثر ذهبي واحد. */

import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Send, MessageCircle } from 'lucide-react'
import { Logo } from './logo'
import { useUiContent } from './ui-content-provider'

export function Footer() {
  const { getSection, getCards, isSectionVisible } = useUiContent()
  const ui = getSection('footer')
  const header = getSection('header')
  const quickLinks = Array.from({ length: 5 }, (_, index) => ({ href: header[`nav${index + 1}Href`], label: header[`nav${index + 1}Label`] }))
  const contactCards = getCards('contact')
  const contactIcons = { mail: Mail, phone: Phone, map: MapPin, clock: Clock, whatsapp: MessageCircle }
  const socials = [
    { href: ui.facebookUrl, label: 'Facebook', icon: Facebook }, { href: ui.instagramUrl, label: 'Instagram', icon: Instagram },
    { href: ui.youtubeUrl, label: 'YouTube', icon: Youtube }, { href: ui.telegramUrl, label: 'Telegram', icon: Send },
    { href: ui.whatsappUrl, label: 'WhatsApp', icon: MessageCircle },
  ].filter((social) => social.href)
  if (!isSectionVisible('footer')) return null

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
                <span className="text-[10px] text-muted-foreground">{header.brandTagline}</span>
              </div>
            </Link>
            <p className="text-sm text-foreground/60 max-w-md leading-relaxed mb-4">
              {ui.description}
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {socials.map((social) => { const Icon = social.icon; return <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-[#D4AF37]/15 flex items-center justify-center transition-colors" aria-label={social.label}><Icon className="w-4 h-4 text-[#D4AF37]" /></a> })}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="روابط سريعة">
            <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">{ui.linksTitle}</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => <li key={link.href}><Link href={link.href} className="text-foreground/60 hover:text-[#D4AF37] transition-colors">{link.label}</Link></li>)}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">{ui.contactTitle}</h3>
            <ul className="space-y-3 text-sm">
              {contactCards.map((card) => { const Icon = contactIcons[String(card.content.icon) as keyof typeof contactIcons] || Mail; return <li key={card.id} className="flex items-start gap-2 text-foreground/60"><Icon className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" /><span>{String(card.content.value || '')}</span></li> })}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#D4AF37]/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {ui.copyright}
          </p>
          <p className="text-xs text-muted-foreground">
            {ui.madeWith} <span className="text-[#D4AF37]">♥</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
