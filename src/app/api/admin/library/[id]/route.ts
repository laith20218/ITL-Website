import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    const body = await req.json() as Record<string, unknown>
    const data: Record<string, unknown> = {}
    for (const key of ['title', 'description', 'category', 'fileUrl', 'coverUrl', 'platform', 'kind', 'sortOrder', 'isVisible']) {
      if (key in body) data[key] = body[key]
    }
    if (typeof data.kind === 'string') data.kind = data.kind.toUpperCase()
    if (data.kind && !['FILE', 'APP', 'IMAGE', 'VIDEO'].includes(String(data.kind))) return NextResponse.json({ error: 'نوع غير صالح' }, { status: 400 })
    const item = await db.libraryFile.update({ where: { id }, data })
    return NextResponse.json({ item })
  } catch {
    return NextResponse.json({ error: 'فشل تحديث العنصر' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const { id } = await params
  await db.libraryFile.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
