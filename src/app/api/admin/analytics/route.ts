import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const now = new Date()
    const day24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const day7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalVisits, uniqueVisitors, visits24h, visits7d, recentVisitsRaw, topPagesRaw] = await Promise.all([
      db.visit.count(),
      db.visit.count({ where: { isUnique: true } }),
      db.visit.count({ where: { createdAt: { gte: day24h } } }),
      db.visit.count({ where: { createdAt: { gte: day7d } } }),
      db.visit.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      db.visit.findMany({
        select: { path: true },
      }),
    ])

    // Top pages
    const pageMap = new Map<string, number>()
    topPagesRaw.forEach((v) => {
      pageMap.set(v.path, (pageMap.get(v.path) || 0) + 1)
    })
    const topPages = Array.from(pageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // By day (7 days)
    const byDay: { date: string; visits: number; unique: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now)
      dayStart.setDate(dayStart.getDate() - i)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)
      const [visits, unique] = await Promise.all([
        db.visit.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
        db.visit.count({ where: { createdAt: { gte: dayStart, lt: dayEnd }, isUnique: true } }),
      ])
      byDay.push({
        date: dayStart.toISOString().slice(0, 10),
        visits,
        unique,
      })
    }

    // Devices breakdown
    const allVisits = recentVisitsRaw
    const devices = { mobile: 0, desktop: 0, tablet: 0, other: 0 }
    allVisits.forEach((v) => {
      const ua = v.userAgent || ''
      if (/Mobile|Android|iPhone/i.test(ua)) devices.mobile++
      else if (/iPad|Tablet/i.test(ua)) devices.tablet++
      else if (/Windows|Macintosh|Linux/i.test(ua)) devices.desktop++
      else devices.other++
    })

    // Referrers
    const refMap = new Map<string, number>()
    allVisits.forEach((v) => {
      const ref = v.referrer || 'مباشر'
      let host = ref
      try {
        if (ref !== 'مباشر' && ref) {
          host = new URL(ref).hostname
        }
      } catch {
        host = ref
      }
      refMap.set(host, (refMap.get(host) || 0) + 1)
    })
    const referrers = Array.from(refMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      visits24h,
      visits7d,
      topPages,
      recentVisits: recentVisitsRaw,
      byDay,
      devices,
      referrers,
    })
  } catch (e) {
    console.error('Admin analytics error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
