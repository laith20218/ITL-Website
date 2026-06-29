import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    const body = await request.json()
    const { slug, title, excerpt, content, category, author, imageUrl, tags, published } = body

    const existing = await db.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 })
    }

    if (slug && slug !== existing.slug) {
      const conflict = await db.article.findUnique({ where: { slug } })
      if (conflict) {
        return NextResponse.json({ error: 'الرابط مستخدم مسبقاً' }, { status: 409 })
      }
    }

    const article = await db.article.update({
      where: { id },
      data: {
        slug: slug ?? existing.slug,
        title: title ?? existing.title,
        excerpt: excerpt ?? existing.excerpt,
        content: content ?? existing.content,
        category: category ?? existing.category,
        author: author ?? existing.author,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        tags: tags !== undefined ? (typeof tags === 'string' ? tags : tags ? JSON.stringify(tags) : null) : existing.tags,
        published: published !== undefined ? published : existing.published,
      },
    })

    return NextResponse.json({ article })
  } catch (e) {
    console.error('Admin update article error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const { id } = await params
    await db.article.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin delete article error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
