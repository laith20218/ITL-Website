import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { writeFile, mkdir, unlink } from 'fs/promises'
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

async function deleteFileIfLocal(url: string | null | undefined) {
  if (!url || !url.startsWith('/uploads/')) return
  try {
    await unlink(path.join(process.cwd(), 'public', url))
  } catch {
    // ignore
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    const formData = await request.formData()

    const existing = await db.portfolioItem.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 })
    }

    const title = (formData.get('title') as string) || existing.title
    const description = (formData.get('description') as string) || existing.description
    const category = (formData.get('category') as string) || existing.category
    const type = (formData.get('type') as string) || existing.type
    const clientName = (formData.get('clientName') as string) || existing.clientName
    const projectDate = (formData.get('projectDate') as string) || existing.projectDate
    const featured = formData.get('featured') === 'true' || formData.get('featured') === 'on'
    const orderVal = formData.get('order')
    const order = orderVal ? parseInt(orderVal as string, 10) : existing.order

    let fileUrl = (formData.get('fileUrl') as string) || existing.fileUrl
    const file = formData.get('file') as File | null
    if (file && file.size > 0) {
      try {
        await deleteFileIfLocal(existing.fileUrl)
        fileUrl = await saveFile(file)
      } catch (uploadErr) {
        console.error('File upload failed:', uploadErr)
      }
    }

    let thumbnailUrl = existing.thumbnailUrl
    const thumbnail = formData.get('thumbnail') as File | null
    if (thumbnail && thumbnail.size > 0) {
      try {
        await deleteFileIfLocal(existing.thumbnailUrl)
        thumbnailUrl = await saveFile(thumbnail)
      } catch (uploadErr) {
        console.error('Thumbnail upload failed:', uploadErr)
      }
    }
    const thumbnailUrlField = (formData.get('thumbnailUrl') as string) || null
    if (thumbnailUrlField) thumbnailUrl = thumbnailUrlField

    const item = await db.portfolioItem.update({
      where: { id },
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
    console.error('Admin update portfolio error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    const existing = await db.portfolioItem.findUnique({ where: { id } })
    if (existing) {
      await deleteFileIfLocal(existing.fileUrl)
      await deleteFileIfLocal(existing.thumbnailUrl)
    }
    await db.portfolioItem.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin delete portfolio error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
