import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    return NextResponse.json({ user })
  } catch (e) {
    console.error('Me error:', e)
    return NextResponse.json({ user: null })
  }
}
