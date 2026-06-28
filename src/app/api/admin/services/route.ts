import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const { title, slug, category, description, icon, features, order, published } = body;

    if (!title || !slug || !category || !description || !icon) {
      return NextResponse.json({ error: 'الحقول الأساسية مطلوبة' }, { status: 400 });
    }

    const existing = await db.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'المعرّف (slug) مستخدم بالفعل' }, { status: 409 });
    }

    const service = await db.service.create({
      data: {
        title,
        slug,
        category,
        description,
        icon,
        features: JSON.stringify(features || []),
        order: order ?? 0,
      },
    });

    return NextResponse.json({ ok: true, service });
  } catch (e) {
    console.error('admin services create', e);
    return NextResponse.json({ error: 'فشل الإنشاء' }, { status: 500 });
  }
}
