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

    try {
      await sendPasswordResetEmail(email, token)
    } catch (e) {
      console.error('Email send failed:', e)
      // Return the token in dev mode for testing
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ ok: true, devToken: token })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
