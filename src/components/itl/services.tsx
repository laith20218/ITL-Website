'use client'

/** Style: مسار الإنجاز الذهبي — ثلاث بوابات واضحة بدل شبكة خدمات متشابهة، مع لون وظيفي محدود لكل عائلة. */
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpenCheck, Check, Code2, Palette, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ServiceIcon } from './service-icon'
import { useUiContent } from './ui-content-provider'

interface Service { id: string; slug: string; title: string; category: string; description: string; icon: string; features: string }

const PORTALS = [
  { id: 'academic', label: 'أكاديمي ولغوي', eyebrow: 'معرفة منظّمة', icon: BookOpenCheck, title: 'حين تستحق فكرتك منهجًا واضحًا.', description: 'من الترجمة والتحرير إلى الاستشارات والمنهجية والعروض؛ نمنح المعرفة شكلًا أوضح وأكثر جاهزية.', action: 'استكشف المسار الأكاديمي', matches: (service: Service) => /أكاديم|ترجم|بحث|لغو/.test(`${service.category} ${service.title}`) },
  { id: 'creative', label: 'إبداعي وإعلامي', eyebrow: 'حضور يُرى', icon: Palette, title: 'حين تحتاج فكرتك إلى حضور يليق بها.', description: 'هوية ومحتوى وإنتاج بصري وصوتي يشرحون قيمتك قبل أن تبدأ التفاصيل.', action: 'شاهد المسار الإبداعي', matches: (service: Service) => /تصميم|مونتاج|صوت|طباعة|إعلام|هوية/.test(`${service.category} ${service.title}`) },
  { id: 'digital', label: 'رقمي وتطوير', eyebrow: 'حلول تعمل', icon: Code2, title: 'حين تتحول الفكرة إلى تجربة تعمل وتنمو.', description: 'مواقع وتطبيقات وبوتات وقوائم رقمية وتسويق مدروس، لبناء نقطة انطلاق عملية لعملك.', action: 'ابدأ مشروعك الرقمي', matches: (service: Service) => /برمج|تسويق|موقع|تطبيق|بوت|رقمي/.test(`${service.category} ${service.title}`) },
] as const

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<(typeof PORTALS)[number]['id']>('academic')
  const { getSection, isSectionVisible } = useUiContent()
  const ui = getSection('services')
  if (!isSectionVisible('services')) return null
  const portals = PORTALS.map((portal) => ({ ...portal, label: ui[`${portal.id}Label`] || portal.label, eyebrow: ui[`${portal.id}Eyebrow`] || portal.eyebrow, title: ui[`${portal.id}Title`] || portal.title, description: ui[`${portal.id}Description`] || portal.description, action: ui[`${portal.id}Action`] || portal.action }))
  const active = portals.find((portal) => portal.id === selected) || portals[0]
  const ActiveIcon = active.icon
  const selectedServices = useMemo(() => {
    const matched = services.filter(active.matches)
    return matched.length ? matched : services.slice(0, 4)
  }, [active, services])

  useEffect(() => {
    fetch('/api/services').then((response) => response.json()).then((data) => setServices(data.services || [])).catch(() => setServices([])).finally(() => setLoading(false))
  }, [])

  return (
    <section id="services" className="gateway-section" aria-label="بوابات خدمات ITL">
      <div className="container mx-auto px-4">
        <div className="gateway-heading"><div className="journey-kicker"><Sparkles className="h-3.5 w-3.5" /><span>{ui.eyebrow}</span></div><h2>{ui.titleStart} <em>{ui.titleAccent}</em></h2><p>{ui.description}</p></div>
        <div className="gateway-tabs" role="tablist" aria-label="بوابات خدمات ITL">
          {portals.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={selected === id} onClick={() => setSelected(id)} className={`gateway-tab ${selected === id ? 'is-active' : ''}`}><Icon className="h-4 w-4" /><span>{label}</span><i /></button>)}
        </div>
        <div className={`gateway-stage ${active.id}`} role="tabpanel">
          <div className="gateway-stage-copy"><div className="gateway-route-key"><span>01</span><i />سؤال يحدد المسار</div><div className="gateway-eyebrow"><ActiveIcon className="h-4 w-4" />{active.eyebrow}</div><h3>{active.title}</h3><p>{active.description}</p><Link href="/#contact"><Button className="journey-primary-button group">{active.action}<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /></Button></Link></div>
          <div className="gateway-service-grid">{loading ? [...Array(3)].map((_, index) => <Skeleton key={index} className="h-52 rounded-2xl bg-white/5" />) : selectedServices.slice(0, 3).map((service, index) => <GatewayServiceCard key={service.id} service={service} index={index} />)}</div>
          <div className="gateway-stage-route" aria-hidden="true"><span>{ui.routeStart}</span><i /><span>{ui.routeMiddle}</span><i /><span>{ui.routeEnd}</span></div>
        </div>
      </div>
    </section>
  )
}

function GatewayServiceCard({ service, index }: { service: Service; index: number }) {
  let features: string[] = []
  try { features = JSON.parse(service.features) } catch { features = [] }
  return <article className="gateway-service-card" style={{ animationDelay: `${index * 65}ms` }}><div className="gateway-service-top"><div className="gateway-service-icon"><ServiceIcon name={service.icon} className="h-5 w-5" /></div><span>{service.category}</span></div><h4>{service.title}</h4><p>{service.description}</p><ul>{features.slice(0, 2).map((feature) => <li key={feature}><Check className="h-3 w-3" />{feature}</li>)}</ul><Link href={`/services/${service.slug}`} className="gateway-service-link">التفاصيل <ArrowLeft className="h-3.5 w-3.5" /></Link></article>
}
