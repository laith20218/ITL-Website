import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHash, randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

const GENERIC_MESSAGE = 'إذا كان البريد مسجلاً، ستصل رسالة إعادة التعيين خلال دقائق.'
const RESET_COOLDOWN_MS = 60 * 1000

function normalizedEmail(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function tokenDigest(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const address = normalizedEmail(email)
    if (!address || !/^\S+@\S+\.\S+$/.test(address)) return NextResponse.json({ error: 'أدخل بريدًا إلكترونيًا صالحًا' }, { status: 400 })

    const user = await db.user.findUnique({ where: { email: address } })
    if (!user) return NextResponse.json({ ok: true, message: GENERIC_MESSAGE })

    const requestedRecently = await db.passwordResetToken.findFirst({ where: { email: address, createdAt: { gt: new Date(Date.now() - RESET_COOLDOWN_MS) } } })
    if (requestedRecently) return NextResponse.json({ ok: true, message: GENERIC_MESSAGE })

    const rawToken = randomBytes(32).toString('hex')
    await db.passwordResetToken.deleteMany({ where: { OR: [{ email: address }, { expiresAt: { lt: new Date() } }] } })
    await db.passwordResetToken.create({
      data: {
        email: address,
        token: tokenDigest(rawToken),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    try {
      await sendPasswordResetEmail(address, rawToken)
    } catch (error) {
      console.error('Password reset email delivery failed', error)
    }

    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE })
  } catch (error) {
    console.error('Password reset request failed', error)
    return NextResponse.json({ error: 'تعذر معالجة الطلب، حاول لاحقًا' }, { status: 500 })
  }
}
