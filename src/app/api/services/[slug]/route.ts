import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) {
    return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
  }
  // Get related articles by matching category
  const related = await db.article.findMany({
    where: { category: service.category, published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      createdAt: true,
    },
  });
  // Get other services (siblings)
  const others = await db.service.findMany({
    where: { slug: { not: slug } },
    orderBy: { order: 'asc' },
    take: 4,
    select: {
      slug: true,
      title: true,
      category: true,
      icon: true,
    },
  });
  return NextResponse.json({
    service: {
      ...service,
      features: JSON.parse(service.features),
    },
    related,
    others,
  });
}
