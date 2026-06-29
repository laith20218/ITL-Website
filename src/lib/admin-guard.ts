import { getCurrentUser } from './auth'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'غير مصرح' }, { status: 401 }),
    }
  }
  if (user.role !== 'admin') {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'ممنوع' }, { status: 403 }),
    }
  }
  return { ok: true as const, user }
}
