'use client'

/** Style: مسار الإنجاز الذهبي — تعريف تحريري غير متماثل، برموز ITL خطية ومسار مدمج في السرد. */

import { useEffect, useState } from 'react'
import { Logo } from './logo'
import { ArrowUpRight, BookOpen, Lightbulb, Ruler } from 'lucide-react'

interface AboutData {
  aboutTitle: string
  aboutIntro1: string
  aboutIntro2: string
  aboutIntro3: string
  aboutClosing: string
}

const CATEGORIES = [
  { icon: BookOpen, title: 'المعرفة', desc: 'بحث ومنهجية وتحرير لغوي واضح' },
  { icon: Ruler, title: 'الدقة', desc: 'مراجعة منظمة ومخرجات قابلة للاستخدام' },
  { icon: Lightbulb, title: 'الفكرة', desc: 'تصميم ومحتوى يمنحانها حضورًا' },
  { icon: ArrowUpRight, title: 'الإنجاز', desc: 'حلول رقمية تنقلها إلى الخطوة التالية' },
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
    <section id="about" className="journey-route-section journey-about" aria-label="من نحن">
      <div className="container mx-auto px-4">
        <div className="journey-about-layout">
          {/* Right: Logo + intro */}
          <div className="journey-about-copy">
            <div className="journey-about-overline"><span>02</span><i />كيف نمضي معك</div>
            <div className="journey-about-logo">
              <Logo className="w-24 h-24 relative z-10" />
            </div>
            <h2>{data?.aboutTitle || 'الفكرة لا تكفي وحدها؛ المسار هو ما يصنع الفرق.'}</h2>
            <div className="journey-about-body">
              <p>{data?.aboutIntro1}</p>
              <p>{data?.aboutIntro2}</p>
              <p>{data?.aboutIntro3}</p>
            </div>
            <p className="journey-about-closing">{data?.aboutClosing || 'مع ITL، أفكارك في أيدٍ أمينة.'}</p>
          </div>

          {/* Left: Categories */}
          <div className="journey-category-rail">
            <div className="journey-category-grid">
              {CATEGORIES.map((cat, i) => {
                const Icon = cat.icon
                return <div key={cat.title} className="journey-category-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="journey-category-icon"><Icon className="h-5 w-5" /></div>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                </div>
              })}
            </div>
            <div className="journey-category-path"><span>سؤال</span><i /><span>تعاون</span><i /><span>مخرج</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
