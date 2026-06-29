import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const body = await request.json()
    const { slug, title, excerpt, content, category, author, imageUrl, tags, published } = body

    if (!slug || !title || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'الرجاء تعبئة الحقول المطلوبة' }, { status: 400 })
    }

    const existing = await db.article.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'الرابط مستخدم مسبقاً' }, { status: 409 })
    }

    const article = await db.article.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        category,
        author: author || 'فريق ITL',
        imageUrl: imageUrl || null,
        tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
        published: published !== undefined ? published : true,
      },
    })

    return NextResponse.json({ article })
  } catch (e) {
    console.error('Admin create article error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const articles = await db.article.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ articles })
  } catch (e) {
    console.error('Admin articles list error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
