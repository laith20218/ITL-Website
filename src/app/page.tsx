import { db } from '@/lib/db'
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
  // Fetch settings for hero only when the Vercel/Neon connection is available.
  // This keeps local and managed previews visible without a DATABASE_URL.
  let settings: Parameters<typeof Hero>[0]['data'] = null
  if (process.env.DATABASE_URL) {
    try {
      settings = await db.siteSettings.findUnique({ where: { id: 'singleton' } })
    } catch {
      // Keep the public journey available if a remote database is temporarily unavailable.
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero data={settings} />
        <Services />
        <About />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
