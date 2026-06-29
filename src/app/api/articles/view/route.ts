import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug } = body
    if (!slug) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    await db.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
