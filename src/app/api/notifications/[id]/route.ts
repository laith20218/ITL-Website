import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { id } = await params
  await db.notification.updateMany({
    where: { id, OR: [{ userId: user.id }, { userId: null }] },
    data: { isRead: true },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { id } = await params
  await db.notification.deleteMany({
    where: { id, OR: [{ userId: user.id }, { userId: null }] },
  })

  return NextResponse.json({ ok: true })
}
