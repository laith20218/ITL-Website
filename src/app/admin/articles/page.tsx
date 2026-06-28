import { db } from '@/lib/db';
import { ArticlesManager } from '@/components/itl/admin/articles-manager';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const articles = await db.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ArticlesManager articles={JSON.parse(JSON.stringify(articles))} />;
}
