import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['new', 'read', 'archived', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
    }

    const msg = await db.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, message: msg });
  } catch (e) {
    console.error('admin message update', e);
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { id } = await params;
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('admin message delete', e);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
