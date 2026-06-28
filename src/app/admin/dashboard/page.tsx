import { db } from '@/lib/db';
import { DashboardClient } from '@/components/itl/admin/dashboard-client';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
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
  });

  const messagesByServiceRaw = await db.contactMessage.groupBy({
    by: ['service'],
    _count: { _all: true },
  });
  const messagesByService = messagesByServiceRaw
    .filter((m) => m.service)
    .map((m) => ({ service: m.service || 'غير محدد', count: m._count._all }));

  const recentArticles = await db.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      category: true,
      createdAt: true,
      published: true,
      viewCount: true,
    },
  });

  return (
    <DashboardClient
      stats={{
        services,
        articles,
        messages,
        users,
        newMessages,
      }}
      recentMessages={JSON.parse(JSON.stringify(recentMessages))}
      messagesByService={messagesByService}
      recentArticles={recentArticles}
    />
  );
}
