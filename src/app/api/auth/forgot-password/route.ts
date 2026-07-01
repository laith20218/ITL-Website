import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'البريد مطلوب' }, { status: 400 })

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    // For security, always return success even if email not found
    if (!user) {
      // نعيد رسالة نجاح وهمية (لأسباب أمنية)
      return NextResponse.json({ ok: true, message: 'إذا كان البريد مسجلاً، ستصل رسالة' })
    }

    const token = randomBytes(32).toString('hex')
    await db.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    // نحاول إرسال البريد الإلكتروني
    let emailSent = false
    try {
      await sendPasswordResetEmail(email, token)
      emailSent = true
    } catch (e) {
      console.error('Email send failed:', e)
    }

    // ✅ نعيد الرابط مباشرة في كل الأحوال (للتجربة)
    // يمكنك تعطيل هذا السطر في الإنتاج لاحقاً
    return NextResponse.json({
      ok: true,
      devToken: token,
      resetLink: `${process.env.NEXTAUTH_URL}/reset-password/${token}`,
      emailSent: emailSent,
      message: emailSent
        ? 'تم إرسال الرابط إلى بريدك الإلكتروني (تحقق من Spam)'
        : '⚠️ لم يتم إرسال البريد (وضع التطوير). استخدم الرابط أدناه مباشرةً:',
    })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}