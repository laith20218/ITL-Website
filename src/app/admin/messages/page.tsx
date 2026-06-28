import { db } from '@/lib/db';
import { MessagesManager } from '@/components/itl/admin/messages-manager';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return <MessagesManager messages={JSON.parse(JSON.stringify(messages))} />;
}
