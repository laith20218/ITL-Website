import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    const body = await request.json()
    const { slug, title, category, description, icon, features, order } = body

    const existing = await db.service.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 })
    }

    if (slug && slug !== existing.slug) {
      const conflict = await db.service.findUnique({ where: { slug } })
      if (conflict) {
        return NextResponse.json({ error: 'الرابط مستخدم مسبقاً' }, { status: 409 })
      }
    }

    const service = await db.service.update({
      where: { id },
      data: {
        slug: slug ?? existing.slug,
        title: title ?? existing.title,
        category: category ?? existing.category,
        description: description ?? existing.description,
        icon: icon ?? existing.icon,
        features: features ? (typeof features === 'string' ? features : JSON.stringify(features)) : existing.features,
        order: typeof order === 'number' ? order : existing.order,
      },
    })

    return NextResponse.json({ service })
  } catch (e) {
    console.error('Admin update service error:', e)
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
    await db.service.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin delete service error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
