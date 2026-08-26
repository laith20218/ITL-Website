import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [sections, cards] = await Promise.all([
      db.uiSection.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
      db.uiCard.findMany({ where: { isVisible: true }, orderBy: [{ sectionKey: 'asc' }, { sortOrder: 'asc' }] }),
    ])
    return NextResponse.json({ sections, cards })
  } catch {
    return NextResponse.json({ sections: [], cards: [] })
  }
}
