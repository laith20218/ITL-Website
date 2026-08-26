import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { ensureUiContent, isUiSectionKey } from '@/lib/ui-content'

export const dynamic = 'force-dynamic'

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  await ensureUiContent()
  const [sections, cards] = await Promise.all([
    db.uiSection.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.uiCard.findMany({ orderBy: [{ sectionKey: 'asc' }, { sortOrder: 'asc' }] }),
  ])
  return NextResponse.json({ sections, cards })
}

export async function PUT(request: Request) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  try {
    const { sections } = await request.json() as { sections?: Array<{ sectionKey: string; content: unknown; sortOrder?: number; isVisible?: boolean }> }
    if (!Array.isArray(sections)) return NextResponse.json({ error: 'صيغة الأقسام غير صالحة' }, { status: 400 })
    await Promise.all(sections.map((section, index) => {
      if (!isUiSectionKey(section.sectionKey) || !section.content || typeof section.content !== 'object' || Array.isArray(section.content)) throw new Error('محتوى قسم غير صالح')
      return db.uiSection.upsert({
        where: { sectionKey: section.sectionKey },
        update: { content: section.content as Prisma.InputJsonValue, sortOrder: section.sortOrder ?? index, isVisible: section.isVisible ?? true },
        create: { sectionKey: section.sectionKey, content: section.content as Prisma.InputJsonValue, sortOrder: section.sortOrder ?? index, isVisible: section.isVisible ?? true },
      })
    }))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'فشل الحفظ' }, { status: 400 })
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  try {
    const { sectionKey, cardType, content } = await request.json() as { sectionKey?: string; cardType?: string; content?: unknown }
    if (!sectionKey || !isUiSectionKey(sectionKey) || !cardType || !content || typeof content !== 'object' || Array.isArray(content)) return NextResponse.json({ error: 'بيانات البطاقة غير صالحة' }, { status: 400 })
    const last = await db.uiCard.findFirst({ where: { sectionKey }, orderBy: { sortOrder: 'desc' } })
    const card = await db.uiCard.create({ data: { sectionKey, cardType, content: content as Prisma.InputJsonValue, sortOrder: (last?.sortOrder ?? -1) + 1 } })
    return NextResponse.json({ card })
  } catch {
    return NextResponse.json({ error: 'فشل إنشاء البطاقة' }, { status: 400 })
  }
}
