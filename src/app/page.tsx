import { Header } from '@/components/itl/header'
import { Hero } from '@/components/itl/hero'
import { Services } from '@/components/itl/services'
import { About } from '@/components/itl/about'
import { Articles } from '@/components/itl/articles'
import { Contact } from '@/components/itl/contact'
import { Footer } from '@/components/itl/footer'

/** Style: مسار الإنجاز الذهبي — الصفحة العامة تبدأ بوعد واضح ثم تقود إلى بوابات الخدمات الثلاث. */

export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <About />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
