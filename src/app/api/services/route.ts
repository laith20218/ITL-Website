import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ services })
  } catch (e) {
    console.error('Services list error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
