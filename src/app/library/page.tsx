import { db } from '@/lib/db'
import { Header } from '@/components/itl/header'
import { Footer } from '@/components/itl/footer'
import { LibraryGrid } from '@/components/itl/library-grid'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const files = await db.libraryFile.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gradient-gold font-display mb-2">مكتبة الملفات</h1>
          <p className="text-muted-foreground">تصفح وحمل ملفات مفيدة من فريق ITL</p>
        </div>
        <LibraryGrid files={JSON.parse(JSON.stringify(files))} />
      </main>
      <Footer />
    </div>
  )
}
