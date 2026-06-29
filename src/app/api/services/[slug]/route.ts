import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const service = await db.service.findUnique({ where: { slug } })

    if (!service) {
      return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 })
    }

    // Related articles
    let relatedArticles: Awaited<ReturnType<typeof db.article.findMany>> = []
    try {
      relatedArticles = await db.article.findMany({
        where: {
          published: true,
          category: service.category,
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
      })
    } catch {
      // ignore
    }

    // Other services
    const otherServices = await db.service.findMany({
      where: {
        slug: { not: slug },
      },
      orderBy: { order: 'asc' },
      take: 6,
    })

    return NextResponse.json({ service, relatedArticles, otherServices })
  } catch (e) {
    console.error('Service detail error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
