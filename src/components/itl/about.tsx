'use client'

/** Style: مسار الإنجاز الذهبي — تعريف تحريري غير متماثل، برموز ITL خطية ومسار مدمج في السرد. */

import { Logo } from './logo'
import { ArrowUpRight, BookOpen, Lightbulb, Ruler } from 'lucide-react'
import { useUiContent } from './ui-content-provider'

const CATEGORIES = [
  { icon: BookOpen, title: 'المعرفة', desc: 'بحث ومنهجية وتحرير لغوي واضح' },
  { icon: Ruler, title: 'الدقة', desc: 'مراجعة منظمة ومخرجات قابلة للاستخدام' },
  { icon: Lightbulb, title: 'الفكرة', desc: 'تصميم ومحتوى يمنحانها حضورًا' },
  { icon: ArrowUpRight, title: 'الإنجاز', desc: 'حلول رقمية تنقلها إلى الخطوة التالية' },
]

export function About() {
  const { getSection, getCards, isSectionVisible } = useUiContent()
  const ui = getSection('about')
  const categories = getCards('about').map((card) => ({
    id: card.id,
    icon: String(card.content.icon || 'idea'),
    title: String(card.content.title || ''),
    description: String(card.content.description || ''),
  }))
  const icons = { book: BookOpen, ruler: Ruler, idea: Lightbulb, arrow: ArrowUpRight }
  if (!isSectionVisible('about')) return null

  return (
    <section id="about" className="journey-route-section journey-about" aria-label="من نحن">
      <div className="container mx-auto px-4">
        <div className="journey-about-layout">
          {/* Right: Logo + intro */}
          <div className="journey-about-copy">
            <div className="journey-about-overline"><span>02</span><i />{ui.overline}</div>
            <div className="journey-about-logo">
              <Logo className="w-24 h-24 relative z-10" />
            </div>
            <h2>{ui.title}</h2>
            <div className="journey-about-body">
              <p>{ui.intro1}</p>
              <p>{ui.intro2}</p>
              <p>{ui.intro3}</p>
            </div>
            <p className="journey-about-closing">{ui.closing}</p>
          </div>

          {/* Left: Categories */}
          <div className="journey-category-rail">
            <div className="journey-category-grid">
              {categories.map((cat, i) => {
                const Icon = icons[String(cat.icon) as keyof typeof icons] || Lightbulb
                return <div key={String(cat.id)} className="journey-category-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="journey-category-icon"><Icon className="h-5 w-5" /></div>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{String(cat.title || '')}</h3>
                  <p>{String(cat.description || '')}</p>
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
