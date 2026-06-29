import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearAuthCookie()
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Logout error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
