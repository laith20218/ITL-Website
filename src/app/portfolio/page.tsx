/** Style: مسار الإنجاز الذهبي — رأس الأعمال ذو تباين واضح ونص موجز فوق خلفية سوداء متدرجة. */
import { Header } from '@/components/itl/header'
import { Footer } from '@/components/itl/footer'
import { PortfolioGallery } from '@/components/itl/portfolio-gallery'

export const metadata = {
  title: 'أعمالنا | ITL',
  description: 'معرض أعمال فريق ITL - مشاريع تصميم، برمجة، مونتاج وأكثر',
}

export default function PortfolioPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 hero-radial bg-pattern">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
              <span className="glow-dot" />
              <span className="text-xs font-medium text-[#D4AF37]">معرض الأعمال</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-gradient-gold neon-text mb-3">
              أعمالنا
            </h1>
            <p className="max-w-xl mx-auto text-foreground/80">
              مجموعة مختارة من مشاريعنا التي أنجزناها بشغف وإتقان
            </p>
          </div>
        </section>
        <PortfolioGallery />
      </main>
      <Footer />
    </div>
  )
}
