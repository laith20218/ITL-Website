import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'

const RESET_ANALYTICS_CONFIRMATION = 'تصفير الإحصاءات'

export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  let payload: { confirmation?: unknown }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات الطلب غير صالحة' }, { status: 400 })
  }

  if (payload.confirmation !== RESET_ANALYTICS_CONFIRMATION) {
    return NextResponse.json({ error: `اكتب العبارة التالية للتأكيد: ${RESET_ANALYTICS_CONFIRMATION}` }, { status: 400 })
  }

  try {
    const result = await db.visit.deleteMany()
    return NextResponse.json({ deletedCount: result.count })
  } catch (error) {
    console.error('Analytics reset error:', error)
    return NextResponse.json({ error: 'تعذر تصفير الإحصاءات' }, { status: 500 })
  }
}
