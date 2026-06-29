import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, role } = body

    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    if (email && email !== existing.email) {
      const conflict = await db.user.findUnique({ where: { email: email.toLowerCase() } })
      if (conflict) {
        return NextResponse.json({ error: 'البريد مستخدم مسبقاً' }, { status: 409 })
      }
    }

    const user = await db.user.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        email: email ? email.toLowerCase() : existing.email,
        phone: phone !== undefined ? phone : existing.phone,
        role: role ?? existing.role,
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    })

    return NextResponse.json({ user })
  } catch (e) {
    console.error('Admin update user error:', e)
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
    // Prevent self-deletion
    const current = await getCurrentUser()
    if (current && current.id === id) {
      return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 })
    }

    await db.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin delete user error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
