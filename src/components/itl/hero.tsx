/** Style: مسار الإنجاز الذهبي — Hero عربي مقروء وشعار مدمج في المشهد، مع زخرفة ذهبية هادئة لا تنافس المحتوى. */
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpLeft, BookOpen, Code2, Palette, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiContent } from './ui-content-provider'

interface HeroData {
  heroSubtitle: string
  heroStat1Num: string
  heroStat1Label: string
  heroStat2Num: string
  heroStat2Label: string
  heroStat3Num: string
  heroStat3Label: string
}

const GATEWAYS = [
  { label: 'أكاديمي ولغوي', icon: BookOpen, color: 'text-[#809CFF]' },
  { label: 'إبداعي وإعلامي', icon: Palette, color: 'text-[#EF8B72]' },
  { label: 'رقمي وتطوير', icon: Code2, color: 'text-[#56C8C1]' },
]

export function Hero() {
  const { getSection, isSectionVisible } = useUiContent()
  const hero = getSection('hero')
  const services = getSection('services')
  const stats = [
    { num: hero.stat1Num, label: hero.stat1Label },
    { num: hero.stat2Num, label: hero.stat2Label },
    { num: hero.stat3Num, label: hero.stat3Label },
  ]

  if (!isSectionVisible('hero')) return null

  return (
    <section id="home" className="journey-hero" aria-label="القسم الرئيسي">
      <div className="journey-grid-mark" aria-hidden="true" />
      <div className="journey-orb journey-orb-one" aria-hidden="true" />
      <div className="journey-orb journey-orb-two" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-4 py-28 md:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="max-w-3xl">
            <div className="journey-kicker fade-up">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{hero.eyebrow}</span>
            </div>
            <h1 className="journey-title fade-up" style={{ animationDelay: '80ms' }}>
              <span className="journey-title-prefix">{hero.titlePrefix}</span>
              <span className="journey-title-accent">{hero.titleAccent}</span>
            </h1>
            <p className="journey-copy fade-up" style={{ animationDelay: '150ms' }}>
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 fade-up" style={{ animationDelay: '220ms' }}>
              <Link href={hero.primaryCtaHref}>
                <Button size="lg" className="journey-primary-button group">
                  {hero.primaryCtaLabel}
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link href={hero.secondaryCtaHref}>
                <Button size="lg" variant="outline" className="journey-secondary-button">
                  {hero.secondaryCtaLabel}
                  <ArrowUpLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="journey-stats fade-up" style={{ animationDelay: '300ms' }}>
              {stats.map((stat, index) => <StatCounter key={stat.label} {...stat} delay={index * 0.08} />)}
            </div>
          </div>

          <div className="journey-emblem fade-up" style={{ animationDelay: '180ms' }}>
            <div className="journey-emblem-topline"><span>IDEA</span><i /><span>DELIVERY</span></div>
            <div className="journey-logo-wrap">
              <img src="/itl-mark.png" alt="شعار ITL" className="journey-logo" />
            </div>
            <div className="journey-route" aria-hidden="true"><span /><i /><b /></div>
            <div className="journey-steps">
              <span>فكرة</span><span>مسار</span><span>إنجاز</span>
            </div>
            <div className="journey-gateway-chips">
              {GATEWAYS.map(({ label, icon: Icon, color }, index) => (
                <div key={label} className="journey-gateway-chip"><Icon className={`h-3.5 w-3.5 ${color}`} />{services[["academicLabel", "creativeLabel", "digitalLabel"][index]] || label}</div>
              ))}
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); observer.disconnect() }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className="journey-stat">
      <strong className={shown ? 'counter-pop' : 'opacity-0'} style={{ animationDelay: `${delay}s` }}>{num}</strong>
      <span>{label}</span>
    </div>
  )
}
