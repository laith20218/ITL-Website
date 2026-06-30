import { db } from '@/lib/db'
import { LibraryManager } from '@/components/itl/admin/library-manager'

export const dynamic = 'force-dynamic'

export default async function AdminLibraryPage() {
  const files = await db.libraryFile.findMany({ orderBy: { createdAt: 'desc' } })
  return <LibraryManager files={JSON.parse(JSON.stringify(files))} />
}
