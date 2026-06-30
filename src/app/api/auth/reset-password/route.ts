import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }

    const resetToken = await db.passwordResetToken.findUnique({ where: { token } })
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'الرابط منتهي الصلاحية' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email: resetToken.email } })
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

    await db.user.update({
      where: { id: user.id },
      data: { password: hashPassword(password) },
    })
    await db.passwordResetToken.delete({ where: { token } })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
