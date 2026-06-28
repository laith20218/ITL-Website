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
    const { title, slug, category, description, icon, features, order } = body;

    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const conflict = await db.service.findUnique({ where: { slug } });
      if (conflict) {
        return NextResponse.json({ error: 'المعرّف مستخدم بالفعل' }, { status: 409 });
      }
    }

    const service = await db.service.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        category: category ?? existing.category,
        description: description ?? existing.description,
        icon: icon ?? existing.icon,
        features: features ? JSON.stringify(features) : existing.features,
        order: order ?? existing.order,
      },
    });

    return NextResponse.json({ ok: true, service });
  } catch (e) {
    console.error('admin services update', e);
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
    await db.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('admin services delete', e);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
