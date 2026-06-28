import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const services = await db.service.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json({
    services: services.map((s) => ({
      ...s,
      features: JSON.parse(s.features),
    })),
  });
}
