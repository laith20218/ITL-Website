import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const body = await request.json()
    const { slug, title, category, description, icon, features, order } = body

    if (!slug || !title || !category || !description || !icon) {
      return NextResponse.json({ error: 'الرجاء تعبئة الحقول المطلوبة' }, { status: 400 })
    }

    const existing = await db.service.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'الرابط مستخدم مسبقاً' }, { status: 409 })
    }

    const service = await db.service.create({
      data: {
        slug,
        title,
        category,
        description,
        icon,
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        order: typeof order === 'number' ? order : 0,
      },
    })

    return NextResponse.json({ service })
  } catch (e) {
    console.error('Admin create service error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const services = await db.service.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ services })
  } catch (e) {
    console.error('Admin services list error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
