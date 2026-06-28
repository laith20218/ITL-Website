import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, category, tags, author, imageUrl, published } = body;

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'الحقول الأساسية مطلوبة' }, { status: 400 });
    }

    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'المعرّف مستخدم بالفعل' }, { status: 409 });
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags || null,
        author: author || 'فريق ITL',
        imageUrl: imageUrl || null,
        published: published !== false,
      },
    });

    return NextResponse.json({ ok: true, article });
  } catch (e) {
    console.error('admin articles create', e);
    return NextResponse.json({ error: 'فشل الإنشاء' }, { status: 500 });
  }
}
