'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ServiceIcon } from './service-icon'

interface Service {
  id: string
  slug: string
  title: string
  category: string
  description: string
  icon: string
  features: string
  order: number
}

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        setServices(data.services || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="services" className="py-20 md:py-28 relative" aria-label="خدماتنا">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
            <span className="glow-dot" />
            <span className="text-xs font-medium text-[#D4AF37]">خدماتنا</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-gradient-gold mb-4">
            حلول متكاملة لنجاحك
          </h2>
          <p className="text-foreground/60">
            نقدم باقة متنوعة من الخدمات الاحترافية التي تغطي احتياجاتك الأكاديمية والإبداعية والرقمية
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl bg-muted/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              let features: string[] = []
              try {
                features = JSON.parse(service.features)
              } catch {
                features = []
              }
              return (
                <ServiceCard key={service.id} service={service} features={features} index={i} />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  features,
  index,
}: {
  service: Service
  features: string[]
  index: number
}) {
  return (
    <article
      className="luxury-card p-6 group flex flex-col stagger-item"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Icon + category */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
          <ServiceIcon name={service.icon} className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
          {service.category}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">
        {service.title}
      </h3>
      <p className="text-sm text-foreground/60 mb-4 line-clamp-2 leading-relaxed">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-6 flex-1">
        {features.slice(0, 4).map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mt-0.5">
              <Check className="w-2.5 h-2.5 text-[#D4AF37]" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-[#D4AF37]/10">
        <Link href={`/services/${service.slug}`} className="flex-1">
          <Button variant="outline" className="w-full border-[#D4AF37]/30 text-foreground hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37] text-sm">
            التفاصيل
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          </Button>
        </Link>
        <Link href={`/#contact?service=${service.slug}`} className="flex-1">
          <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#E8C964] text-sm">
            اطلب الآن
          </Button>
        </Link>
      </div>
    </article>
  )
}
