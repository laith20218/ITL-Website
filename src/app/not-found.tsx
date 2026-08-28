/** Style: مسار الإنجاز الذهبي — صفحة فقدان مسار عربية داكنة تعيد الزائر إلى نقطة بداية واضحة. */
import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/itl/header'
import { Footer } from '@/components/itl/footer'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0B0C0E] text-[#F3F0E8]">
      <Header />
      <main className="flex flex-1 items-center px-4 py-16 md:py-24">
        <section className="luxury-card mx-auto w-full max-w-2xl overflow-hidden p-7 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#E8C964]">
            <Compass className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-7 font-display text-6xl leading-none text-[#D4AF37] md:text-7xl">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-[#F3F0E8] md:text-4xl">لم نعثر على هذه الصفحة</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#D6D1C3] md:text-base">قد يكون الرابط قد تغيّر أو أن الصفحة لم تعد متاحة. يمكنك العودة إلى بوابة ITL واختيار مسارك من جديد.</p>
          <Button asChild size="lg" className="mt-7 bg-[#D4AF37] text-black hover:bg-[#E8C964]">
            <Link href="/">العودة إلى الرئيسية <ArrowLeft className="mr-2 h-4 w-4" /></Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  )
}
