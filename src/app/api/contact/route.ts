import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, service, shamcashAmount, shamcashRef } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'الرجاء تعبئة الحقول المطلوبة' }, { status: 400 })
    }

    const msg = await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        service: service || null,
        shamcashAmount: shamcashAmount || null,
        shamcashRef: shamcashRef || null,
      },
    })

    return NextResponse.json({ ok: true, id: msg.id })
  } catch (e) {
    console.error('Contact error:', e)
    return NextResponse.json({ error: 'حدث خطأ أثناء الإرسال' }, { status: 500 })
  }
}
