import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ messages });
}
