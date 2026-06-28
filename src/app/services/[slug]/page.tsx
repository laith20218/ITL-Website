import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Sparkles, Phone, Mail } from 'lucide-react';
import { Header } from '@/components/itl/header';
import { Footer } from '@/components/itl/footer';
import { ItlLogo } from '@/components/itl/logo';
import { ServiceDetailIcon } from '@/components/itl/service-icon';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const services = await db.service.findMany({ select: { slug: true } });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) return { title: 'الخدمة غير موجودة | ITL' };
  return {
    title: `${service.title} | ITL — Idea To Life`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });

  if (!service) notFound();

  const features: string[] = JSON.parse(service.features);
  const related = await db.article.findMany({
    where: { category: service.category, published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  const others = await db.service.findMany({
    where: { slug: { not: slug } },
    orderBy: { order: 'asc' },
    take: 4,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/#home" className="hover:text-gold">الرئيسية</Link>
            <ArrowLeft className="h-3 w-3" />
            <Link href="/#services" className="hover:text-gold">خدماتنا</Link>
            <ArrowLeft className="h-3 w-3" />
            <span className="text-gold">{service.category}</span>
          </nav>
        </div>

        {/* Hero of service */}
        <section className="relative py-12 lg:py-16 bg-luxury-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl float" />
            <div className="absolute bottom-0 -right-32 w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-sm mb-6">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-medium tracking-wider text-gold uppercase">
                  {service.category}
                </span>
              </div>

              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-soft/20 to-gold-deep/20 border border-gold/30 gold-glow">
                  <ServiceDetailIcon name={service.icon} />
                </div>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
                <span className="text-gradient-gold">{service.title}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <div className="ornament-line mb-4 max-w-xs mx-auto">
                  <span className="text-xs tracking-[0.3em] text-gold uppercase font-medium">
                    ما يشمله هذا المنتج
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold">تفاصيل الخدمة</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-5 rounded-xl luxury-card luxury-card-hover"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 border border-gold/30">
                      <Check className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{f}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        نقدم هذه الخدمة بأعلى معايير الجودة ووفق احتياجك المخصص.
                      </p>
                    </div>
                    <span className="font-display text-2xl font-bold text-gold/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 lg:py-20 bg-secondary/20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="ornament-line mb-4 max-w-xs mx-auto">
                  <span className="text-xs tracking-[0.3em] text-gold uppercase font-medium">
                    كيف نعمل
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold">من الفكرة إلى التسليم</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'التواصل الأولي', desc: 'تطلب الخدمة وتشرح احتياجك عبر نموذج التواصل.' },
                  { step: '02', title: 'التخطيط والاتفاق', desc: 'نقدم عرضًا تفصيليًا بالمواصفات والتكلفة والمدة.' },
                  { step: '03', title: 'التنفيذ', desc: 'يعمل فريقنا المتخصص على تنفيذ المشروع بمراحل واضحة.' },
                  { step: '04', title: 'التسليم والمتابعة', desc: 'تسلّم العمل نهائيًا، مع متابعة لضمان رضاك التام.' },
                ].map((p) => (
                  <div key={p.step} className="luxury-card rounded-2xl p-6 text-center relative overflow-hidden">
                    <div className="absolute top-2 left-3 font-display text-4xl font-bold text-gold/10">
                      {p.step}
                    </div>
                    <h3 className="font-bold text-lg mb-2 mt-6">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto luxury-card rounded-3xl p-8 lg:p-12 text-center gold-glow">
              <div className="flex justify-center mb-5">
                <ItlLogo size={64} showText={false} />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-gradient-gold">جاهز لبدء مشروعك؟</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                تواصل معنا الآن واحصل على استشارة مجانية وعرض مخصص لاحتياجك في هذه الخدمة.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground hover:opacity-90 gold-glow h-12 px-8"
                >
                  <a href="/#contact">
                    اطلب هذه الخدمة
                    <ArrowLeft className="h-5 w-5 mr-2" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 hover:bg-gold/10 hover:text-gold hover:border-gold h-12 px-8"
                >
                  <a href="mailto:info@itl-team.com">
                    <Mail className="h-4 w-4 ml-2" />
                    info@itl-team.com
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="py-16 lg:py-20 bg-secondary/20">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-display text-3xl font-bold text-center mb-10">
                  مقالات ذات صلة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((a) => (
                    <article key={a.id} className="luxury-card rounded-2xl overflow-hidden">
                      <div className="h-24 bg-gradient-to-br from-gold/15 to-transparent flex items-center justify-center">
                        <span className="font-display text-3xl font-bold text-gold/20">
                          {a.category.charAt(0)}
                        </span>
                      </div>
                      <div className="p-5">
                        <Badge variant="outline" className="border-gold/40 text-gold mb-2">
                          {a.category}
                        </Badge>
                        <h3 className="font-bold text-base mb-2 line-clamp-2">{a.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">{a.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other services */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center mb-10">
                خدمات أخرى
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {others.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className="luxury-card luxury-card-hover rounded-2xl p-5 text-center"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                        <ServiceDetailIcon name={s.icon} small />
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                    <p className="text-xs text-gold flex items-center justify-center gap-1">
                      عرض التفاصيل
                      <ArrowLeft className="h-3 w-3" />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
