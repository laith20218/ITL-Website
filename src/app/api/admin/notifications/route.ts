import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  const notifications = await db.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  return NextResponse.json({ notifications })
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { title, message, link, userId } = await req.json()
    if (!title || !message) return NextResponse.json({ error: 'العنوان والرسالة مطلوبان' }, { status: 400 })

    const notif = await db.notification.create({
      data: { title, message, link: link || null, userId: userId || null },
    })

    return NextResponse.json({ item: notif })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
