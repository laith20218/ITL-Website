import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, sessionId, userAgent, referrer } = body

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: false })
    }

    // Skip non-trackable paths
    if (
      path.startsWith('/api/') ||
      path.startsWith('/admin') ||
      path.startsWith('/_next')
    ) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    // Check uniqueness: same sessionId + path + today
    let isUnique = false
    if (sessionId) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const existing = await db.visit.findFirst({
        where: {
          sessionId,
          path,
          createdAt: { gte: today, lt: tomorrow },
        },
        select: { id: true },
      })
      if (!existing) {
        isUnique = true
      }
    } else {
      isUnique = true
    }

    await db.visit.create({
      data: {
        path,
        sessionId: sessionId || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
        isUnique,
      },
    })

    return NextResponse.json({ ok: true, isUnique })
  } catch (e) {
    console.error('Track error:', e)
    return NextResponse.json({ ok: false })
  }
}
