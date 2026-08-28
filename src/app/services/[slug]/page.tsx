import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Header } from '@/components/itl/header'
import { Footer } from '@/components/itl/footer'
import { ServiceIcon } from '@/components/itl/service-icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowLeft, Sparkles, PenTool, Rocket, Handshake } from 'lucide-react'

/** Style: مسار الإنجاز الذهبي — صفحة خدمة توضح المخرج والمنهجية وتبقي دعوة الإجراء مرئية. */

interface PageProps {
  params: Promise<{ slug: string }>
}

// SSG: generate static pages for all services
export async function generateStaticParams() {
  const services = await db.service.findMany({ select: { slug: true } })
  return services.map((s) => ({ slug: s.slug }))
}

export const dynamicParams = true

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  if (slug === 'academic-research') redirect('/services/research')
  const service = await db.service.findUnique({ where: { slug } })
  if (!service) notFound()

  let features: string[] = []
  try {
    features = JSON.parse(service.features)
  } catch {
    features = []
  }

  let relatedArticles: Array<{ id: string; slug: string; title: string; excerpt: string; createdAt: Date }> = []
  try {
    relatedArticles = await db.article.findMany({
      where: { published: true, category: service.category },
      take: 3,
      orderBy: { createdAt: 'desc' },
    })
  } catch {}

  const otherServices = await db.service.findMany({
    where: { slug: { not: slug } },
    orderBy: { order: 'asc' },
    take: 6,
  })

  const steps = [
    { icon: PenTool, title: 'التواصل والتفاهم', desc: 'تواصل معنا واشرح لنا فكرتك ومتطلباتك بالتفصيل' },
    { icon: Sparkles, title: 'التصميم والتنفيذ', desc: 'فريقنا المختص يبدأ بتنفيذ مشروعك بأعلى المعايير' },
    { icon: Rocket, title: 'المراجعة والتسليم', desc: 'نراجع العمل معك ونعدّل حتى يصبح جاهزاً للتسليم' },
    { icon: Handshake, title: 'الدعم بعد التسليم', desc: 'نبقى معك بعد التسليم لأي تعديلات أو دعم فني' },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 md:py-24 hero-radial bg-pattern overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center pulse-glow">
                  <ServiceIcon name={service.icon} className="w-10 h-10 text-[#D4AF37]" />
                </div>
              </div>
              <Badge className="mb-4 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                {service.category}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 font-display text-gradient-gold neon-text">
                {service.title}
              </h1>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gradient-gold mb-2">
                ماذا نقدم؟
              </h2>
              <p className="text-foreground/60">تفاصيل الخدمة ومميزاتها</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="luxury-card p-5 flex items-start gap-3 stagger-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-sm text-foreground/80 pt-1">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 md:py-20 bg-pattern">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gradient-gold mb-2">
                كيف نعمل؟
              </h2>
              <p className="text-foreground/60">أربع خطوات بسيطة لإنجاز مشروعك</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="relative luxury-card p-6 text-center stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="absolute top-3 left-3 text-4xl font-bold text-[#D4AF37]/10">{i + 1}</div>
                    <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    <h3 className="font-bold mb-2 text-[#D4AF37]">{step.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="luxury-card p-8 md:p-12 max-w-3xl mx-auto text-center gold-glow">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gradient-gold mb-3">
                جاهز لبدء مشروعك؟
              </h2>
              <p className="text-foreground/70 mb-6">
                تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر خاص بمشروعك
              </p>
              <Button asChild size="lg" className="bg-[#D4AF37] text-black hover:bg-[#E8C964] shimmer-hover">
                <Link href="/#contact">
                  اطلب الخدمة الآن
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 md:py-20 bg-pattern">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gradient-gold mb-8 text-center">
                مقالات ذات صلة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {relatedArticles.map((a) => (
                  <article key={a.id} className="luxury-card p-5">
                    <h3 className="font-bold mb-2 line-clamp-2 text-[#D4AF37]">{a.title}</h3>
                    <p className="text-sm text-foreground/60 line-clamp-2 mb-3">{a.excerpt}</p>
                    <div className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString('ar-EG')}</div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other services */}
        {otherServices.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gradient-gold mb-8 text-center">
                خدمات أخرى
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {otherServices.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`}>
                    <div className="luxury-card p-5 flex items-center gap-3 group">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                        <ServiceIcon name={s.icon} className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm group-hover:text-[#D4AF37] transition-colors truncate">{s.title}</h3>
                        <span className="text-xs text-muted-foreground">{s.category}</span>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
