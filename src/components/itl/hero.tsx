'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Sparkles, ArrowLeft, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from './logo'

interface HeroData {
  heroTitle: string
  heroSubtitle: string
  heroStat1Num: string
  heroStat1Label: string
  heroStat2Num: string
  heroStat2Label: string
  heroStat3Num: string
  heroStat3Label: string
  heroQuote: string
}

export function Hero({ data }: { data: HeroData | null }) {
  const hero = data || {
    heroTitle: 'من الفكرة إلى الحياة',
    heroSubtitle: 'فريق ITL يحوّل أفكارك إلى واقع ملموس، بخدمات احترافية تجمع بين الإبداع والجودة والسرعة في التنفيذ',
    heroStat1Num: '+35',
    heroStat1Label: 'خدمة احترافية',
    heroStat2Num: '+74',
    heroStat2Label: 'عميل سعيد',
    heroStat3Num: '+3',
    heroStat3Label: 'سنوات خبرة',
    heroQuote: 'كل فكرة عظيمة بدأت بخطوة صغيرة، ونحن هنا لنساعدك على اتخاذ تلك الخطوة',
  }

  const stats = [
    { num: hero.heroStat1Num, label: hero.heroStat1Label },
    { num: hero.heroStat2Num, label: hero.heroStat2Label },
    { num: hero.heroStat3Num, label: hero.heroStat3Label },
  ]

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden hero-radial bg-pattern"
      aria-label="القسم الرئيسي"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30 float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating ring decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20" aria-hidden="true">
        <div className="w-full h-full rounded-full border border-[#D4AF37]/30 rotating-ring" />
        <div className="absolute inset-8 rounded-full border border-[#D4AF37]/20 rotating-ring" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8 fade-up">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-3xl rounded-full" />
              <Logo className="w-28 h-28 md:w-36 md:h-36 float relative z-10" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6 fade-up" style={{ animationDelay: '0.1s' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs font-medium text-[#D4AF37]">فريق ITL الإبداعي</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 font-display fade-up text-gradient-gold neon-text" style={{ animationDelay: '0.2s' }}>
            {hero.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed fade-up" style={{ animationDelay: '0.3s' }}>
            {hero.heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center mb-16 fade-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/#services">
              <Button size="lg" className="bg-[#D4AF37] text-black hover:bg-[#E8C964] font-medium shimmer-hover group">
                اكتشف خدماتنا
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/#contact">
              <Button size="lg" variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]">
                اطلب خدمتك الآن
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-2xl mx-auto fade-up" style={{ animationDelay: '0.5s' }}>
            {stats.map((stat, i) => (
              <StatCounter key={i} num={stat.num} label={stat.label} delay={i * 0.1} />
            ))}
          </div>

          {/* Quote */}
          <div className="mt-16 fade-up" style={{ animationDelay: '0.7s' }}>
            <div className="relative inline-block max-w-2xl">
              <Quote className="absolute -top-3 -right-3 w-8 h-8 text-[#D4AF37]/30" />
              <p className="text-base md:text-lg text-foreground/60 italic px-6 leading-relaxed">
                {hero.heroQuote}
              </p>
              <Quote className="absolute -bottom-3 -left-3 w-8 h-8 text-[#D4AF37]/30 rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCounter({ num, label, delay }: { num: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          ob.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  return (
    <div ref={ref} className="text-center">
      <div
        className={`text-3xl md:text-5xl font-bold text-gradient-gold font-display ${shown ? 'counter-pop' : 'opacity-0'}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {num}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}
