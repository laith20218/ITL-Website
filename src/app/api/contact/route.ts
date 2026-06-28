import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, service } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'الحقول الأساسية مطلوبة' }, { status: 400 });
    }

    const msg = await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        service: service || null,
      },
    });

    return NextResponse.json({ ok: true, id: msg.id });
  } catch (e) {
    console.error('contact error', e);
    return NextResponse.json({ error: 'تعذر إرسال الرسالة، حاول لاحقًا' }, { status: 500 });
  }
}
