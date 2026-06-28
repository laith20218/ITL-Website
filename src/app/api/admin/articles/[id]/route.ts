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
    const { title, slug, excerpt, content, category, tags, author, imageUrl, published } = body;

    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const conflict = await db.article.findUnique({ where: { slug } });
      if (conflict) {
        return NextResponse.json({ error: 'المعرّف مستخدم بالفعل' }, { status: 409 });
      }
    }

    const article = await db.article.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        excerpt: excerpt ?? existing.excerpt,
        content: content ?? existing.content,
        category: category ?? existing.category,
        tags: tags !== undefined ? tags : existing.tags,
        author: author ?? existing.author,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        published: published !== undefined ? published : existing.published,
      },
    });

    return NextResponse.json({ ok: true, article });
  } catch (e) {
    console.error('admin articles update', e);
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
    await db.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('admin articles delete', e);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
