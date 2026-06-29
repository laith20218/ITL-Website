'use client'

import { useEffect, useState } from 'react'
import { Logo } from './logo'
import { Skeleton } from '@/components/ui/skeleton'

interface AboutData {
  aboutTitle: string
  aboutIntro1: string
  aboutIntro2: string
  aboutIntro3: string
  aboutClosing: string
}

const CATEGORIES = [
  { emoji: '📚', title: 'الأكاديمية', desc: 'بحوث علمية ورسائل جامعية وتأشيرات' },
  { emoji: '🌐', title: 'الترجمة', desc: 'ترجمة احترافية بكل اللغات' },
  { emoji: '🎨', title: 'التصميم', desc: 'هويات بصرية وجرافيك' },
  { emoji: '🎬', title: 'المونتاج', desc: 'إنتاج سمعي وبصري احترافي' },
]

export function About() {
  const [data, setData] = useState<AboutData | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setData(d.settings)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="about" className="py-20 md:py-28 relative bg-pattern" aria-label="من نحن">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right: Logo + intro */}
          <div className="text-center lg:text-right">
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#D4AF37]/20 blur-3xl rounded-full" />
                <Logo className="w-32 h-32 float relative z-10" />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
              <span className="glow-dot" />
              <span className="text-xs font-medium text-[#D4AF37]">من نحن</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-gradient-gold mb-6">
              {data?.aboutTitle || 'من الفكرة إلى الإنجاز'}
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed text-sm md:text-base">
              <p>{data?.aboutIntro1}</p>
              <p>{data?.aboutIntro2}</p>
              <p>{data?.aboutIntro3}</p>
            </div>
            <p className="mt-6 text-lg md:text-xl text-[#D4AF37] font-display font-bold">
              {data?.aboutClosing || 'مع ITL، أفكارك في أيدٍ أمينة.'}
            </p>
          </div>

          {/* Left: Categories */}
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.title}
                className="luxury-card p-6 stagger-item"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="text-lg font-bold mb-2 text-[#D4AF37]">{cat.title}</h3>
                <p className="text-sm text-foreground/60">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
