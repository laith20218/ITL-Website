import { db } from '@/lib/db'
import { Header } from '@/components/itl/header'
import { Hero } from '@/components/itl/hero'
import { Services } from '@/components/itl/services'
import { About } from '@/components/itl/about'
import { Articles } from '@/components/itl/articles'
import { Contact } from '@/components/itl/contact'
import { Footer } from '@/components/itl/footer'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch settings for hero
  let settings = null
  try {
    settings = await db.siteSettings.findUnique({ where: { id: 'singleton' } })
  } catch {
    // ignore
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
