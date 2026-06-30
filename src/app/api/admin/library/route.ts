import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'library')

export async function GET() {
  const files = await db.libraryFile.findMany({ orderBy: { createdAt: 'desc' } })
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
    const fileUrl = (formData.get('fileUrl') as string) || ''
    const file = formData.get('file') as File | null

    if (!title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 })

    let finalUrl = fileUrl
    let mimeType: string | null = null

    if (file && file.size > 0) {
      try {
        await mkdir(UPLOAD_DIR, { recursive: true })
        const ext = path.extname(file.name) || ''
        const name = `${randomUUID()}${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(path.join(UPLOAD_DIR, name), buffer)
        finalUrl = `/uploads/library/${name}`
        mimeType = file.type
      } catch (e) {
        console.error('Upload failed:', e)
        if (!finalUrl) return NextResponse.json({ error: 'فشل الرفع، استخدم رابطًا' }, { status: 500 })
      }
    }

    if (!finalUrl) return NextResponse.json({ error: 'ملف أو رابط مطلوب' }, { status: 400 })

    const item = await db.libraryFile.create({
      data: { title, description, category, fileUrl: finalUrl, mimeType },
    })

    return NextResponse.json({ item })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
