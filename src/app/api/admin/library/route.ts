import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { canonicalYouTubeUrl } from '@/lib/google-drive'

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  const files = await db.libraryFile.findMany({ orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }] })
  return NextResponse.json({ files })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = (formData.get('description') as string) || ''
    const category = (formData.get('category') as string) || 'عام'
    const kind = ((formData.get('kind') as string) || 'FILE').toUpperCase()
    const coverUrl = (formData.get('coverUrl') as string) || null
    const platform = (formData.get('platform') as string) || null
    const isVisible = formData.get('isVisible') !== 'false'
    const sortOrder = Number(formData.get('sortOrder') || 0)
    const fileUrl = (formData.get('fileUrl') as string) || ''
    const file = formData.get('file') as File | null

    if (!title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 })
    if (!['FILE', 'APP', 'IMAGE', 'VIDEO'].includes(kind)) return NextResponse.json({ error: 'نوع المكتبة غير صالح' }, { status: 400 })

    if (file && file.size > 0) return NextResponse.json({ error: 'استخدم زر الرفع إلى Google Drive للملفات والصور' }, { status: 400 })
    const finalUrl = kind === 'VIDEO' && fileUrl ? canonicalYouTubeUrl(fileUrl) : fileUrl

    if (!finalUrl) return NextResponse.json({ error: kind === 'FILE' || kind === 'IMAGE' ? 'ملف أو رابط مطلوب' : 'الرابط الخارجي مطلوب' }, { status: 400 })

    const item = await db.libraryFile.create({
      data: { title, description, category, fileUrl: finalUrl, mimeType: null, kind, coverUrl, platform, isVisible, sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0 },
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Library item creation failed', error)
    if (error instanceof Error && error.message === 'أدخل رابط فيديو YouTube صالحًا') return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ error: 'تعذر حفظ عنصر المكتبة، حاول مجددًا' }, { status: 500 })
  }
}
