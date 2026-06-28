import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('q')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const limit = Number(searchParams.get('limit') || 50);

  const where: Record<string, unknown> = { published: true };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
      { tags: { contains: search } },
    ];
  }
  if (category) {
    where.category = category;
  }

  const articles = await db.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      author: true,
      tags: true,
      createdAt: true,
      viewCount: true,
    },
  });

  return NextResponse.json({ articles });
}
