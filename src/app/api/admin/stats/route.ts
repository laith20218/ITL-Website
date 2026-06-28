import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const [services, articles, messages, users, newMessages] = await Promise.all([
    db.service.count(),
    db.article.count(),
    db.contactMessage.count(),
    db.user.count(),
    db.contactMessage.count({ where: { status: 'new' } }),
  ]);

  const recentMessages = await db.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      service: true,
      status: true,
      createdAt: true,
    },
  });

  // Messages by service
  const messagesByServiceRaw = await db.contactMessage.groupBy({
    by: ['service'],
    _count: { _all: true },
  });
  const messagesByService = messagesByServiceRaw
    .filter((m) => m.service)
    .map((m) => ({ service: m.service || 'غير محدد', count: m._count._all }));

  return NextResponse.json({
    stats: {
      services,
      articles,
      messages,
      users,
      newMessages,
    },
    recentMessages,
    messagesByService,
  });
}
