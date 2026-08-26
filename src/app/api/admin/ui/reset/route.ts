import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db'
import {
  isUiSectionKey,
  uiSectionResetConfirmation,
  UI_DEFAULT_CARDS,
  UI_DEFAULT_SECTIONS,
  UI_SECTION_KEYS,
  type UiSectionKey,
} from '@/lib/ui-content'

type ResetMode = 'content' | 'contentAndCards'

export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  let payload: { sectionKey?: unknown; mode?: unknown; confirmation?: unknown }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'بيانات الطلب غير صالحة' }, { status: 400 })
  }

  if (typeof payload.sectionKey !== 'string' || !isUiSectionKey(payload.sectionKey)) {
    return NextResponse.json({ error: 'مجموعة واجهة المستخدم غير صالحة' }, { status: 400 })
  }

  if (payload.mode !== 'content' && payload.mode !== 'contentAndCards') {
    return NextResponse.json({ error: 'نوع إعادة التعيين غير صالح' }, { status: 400 })
  }

  const sectionKey = payload.sectionKey as UiSectionKey
  const mode = payload.mode as ResetMode
  const requiredConfirmation = uiSectionResetConfirmation(sectionKey)
  if (payload.confirmation !== requiredConfirmation) {
    return NextResponse.json({ error: `اكتب العبارة التالية للتأكيد: ${requiredConfirmation}` }, { status: 400 })
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const section = await tx.uiSection.upsert({
        where: { sectionKey },
        update: {
          content: UI_DEFAULT_SECTIONS[sectionKey] as Prisma.InputJsonValue,
          sortOrder: UI_SECTION_KEYS.indexOf(sectionKey),
          isVisible: true,
        },
        create: {
          sectionKey,
          content: UI_DEFAULT_SECTIONS[sectionKey] as Prisma.InputJsonValue,
          sortOrder: UI_SECTION_KEYS.indexOf(sectionKey),
          isVisible: true,
        },
      })

      if (mode === 'contentAndCards') {
        await tx.uiCard.deleteMany({ where: { sectionKey } })
        const defaultCards = UI_DEFAULT_CARDS.filter((card) => card.sectionKey === sectionKey)
        if (defaultCards.length > 0) {
          await tx.uiCard.createMany({
            data: defaultCards.map((card) => ({
              ...card,
              content: card.content as Prisma.InputJsonValue,
              isVisible: true,
            })),
          })
        }
      }

      const cards = await tx.uiCard.findMany({
        where: { sectionKey },
        orderBy: { sortOrder: 'asc' },
      })
      return { section, cards }
    })

    return NextResponse.json({ ...result, mode })
  } catch (error) {
    console.error('UI section reset error:', error)
    return NextResponse.json({ error: 'تعذر إعادة تعيين المجموعة' }, { status: 500 })
  }
}
