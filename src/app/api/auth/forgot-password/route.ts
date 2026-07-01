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
    if (!user) return NextResponse.json({ ok: true })

    const token = randomBytes(32).toString('hex')
    await db.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    // محاولة إرسال البريد الإلكتروني
    try {
      await sendPasswordResetEmail(email, token)
    } catch (e) {
      console.error('Email send failed:', e)
      // في وضع التطوير، نعيد الرابط حتى لو فشل الإرسال
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          ok: true,
          devToken: token,
          resetLink: `${process.env.NEXTAUTH_URL}/reset-password/${token}`,
        })
      }
    }

    // ✅ في وضع التطوير، نعيد الرابط مباشرة (حتى لو نجح الإرسال)
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        ok: true,
        devToken: token,
        resetLink: `${process.env.NEXTAUTH_URL}/reset-password/${token}`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}