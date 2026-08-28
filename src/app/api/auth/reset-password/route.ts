import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (typeof token !== 'string' || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }

    const tokenHash = createHash('sha256').update(token).digest('hex')
    const resetToken = await db.passwordResetToken.findUnique({ where: { token: tokenHash } })
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'الرابط منتهي الصلاحية' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email: resetToken.email } })
    if (!user) return NextResponse.json({ error: 'الرابط غير صالح' }, { status: 400 })

    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { password: hashPassword(password) } }),
      db.passwordResetToken.delete({ where: { token: tokenHash } }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Password reset completion failed', error)
    return NextResponse.json({ error: 'تعذر تحديث كلمة المرور، حاول لاحقًا' }, { status: 500 })
  }
}
