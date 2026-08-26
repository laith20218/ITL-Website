import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  try {
    const { id } = await params
    const body = await request.json() as { content?: unknown; sortOrder?: number; isVisible?: boolean; cardType?: string }
    const card = await db.uiCard.update({
      where: { id },
      data: {
        ...(body.content && typeof body.content === 'object' && !Array.isArray(body.content) ? { content: body.content as Prisma.InputJsonValue } : {}),
        ...(typeof body.sortOrder === 'number' ? { sortOrder: body.sortOrder } : {}),
        ...(typeof body.isVisible === 'boolean' ? { isVisible: body.isVisible } : {}),
        ...(typeof body.cardType === 'string' ? { cardType: body.cardType } : {}),
      },
    })
    return NextResponse.json({ card })
  } catch {
    return NextResponse.json({ error: 'فشل تحديث البطاقة' }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  const { id } = await params
  await db.uiCard.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
