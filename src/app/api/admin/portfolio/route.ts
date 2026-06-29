import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

async function saveFile(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const ext = path.extname(file.name) || ''
  const name = `${randomUUID()}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, name), buffer)
  return `/uploads/${name}`
}

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const items = await db.portfolioItem.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ items })
  } catch (e) {
    console.error('Admin portfolio list error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const type = (formData.get('type') as string) || 'image'
    const clientName = (formData.get('clientName') as string) || null
    const projectDate = (formData.get('projectDate') as string) || null
    const featured = formData.get('featured') === 'true' || formData.get('featured') === 'on'
    const orderVal = formData.get('order')
    const order = orderVal ? parseInt(orderVal as string, 10) : 0
    const file = formData.get('file') as File | null
    const thumbnail = formData.get('thumbnail') as File | null

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'الرجاء تعبئة الحقول المطلوبة' }, { status: 400 })
    }

    let fileUrl = ''
    if (file && file.size > 0) {
      fileUrl = await saveFile(file)
    } else if (type === 'image' || type === 'video' || type === 'pdf') {
      fileUrl = (formData.get('fileUrl') as string) || ''
    }

    let thumbnailUrl: string | null = null
    if (thumbnail && thumbnail.size > 0) {
      thumbnailUrl = await saveFile(thumbnail)
    } else {
      thumbnailUrl = (formData.get('thumbnailUrl') as string) || null
    }

    const item = await db.portfolioItem.create({
      data: {
        title,
        description,
        category,
        type,
        fileUrl,
        thumbnailUrl,
        clientName,
        projectDate,
        featured,
        order,
      },
    })

    return NextResponse.json({ item })
  } catch (e) {
    console.error('Admin create portfolio error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
