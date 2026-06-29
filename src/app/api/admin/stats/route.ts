import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const [services, articles, messages, users, newMessages, visits24h, totalVisits] = await Promise.all([
      db.service.count(),
      db.article.count(),
      db.contactMessage.count(),
      db.user.count(),
      db.contactMessage.count({ where: { status: 'new' } }),
      db.visit.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      db.visit.count(),
    ])

    const recentMessages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Messages by service
    const allMessages = await db.contactMessage.findMany({
      select: { service: true, id: true },
    })
    const byServiceMap = new Map<string, number>()
    allMessages.forEach((m) => {
      const key = m.service || 'عام'
      byServiceMap.set(key, (byServiceMap.get(key) || 0) + 1)
    })
    const messagesByService = Array.from(byServiceMap.entries()).map(([name, count]) => ({ name, count }))

    return NextResponse.json({
      counts: {
        services,
        articles,
        messages,
        users,
        newMessages,
        visits24h,
        totalVisits,
      },
      recentMessages,
      messagesByService,
    })
  } catch (e) {
    console.error('Admin stats error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
