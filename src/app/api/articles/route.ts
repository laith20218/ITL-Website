import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const where: Record<string, unknown> = { published: true }

    if (category && category !== 'all') {
      where.category = category
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
      ]
    }

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ articles })
  } catch (e) {
    console.error('Articles list error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
