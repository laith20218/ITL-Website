import { db } from '@/lib/db';
import { ServicesManager } from '@/components/itl/admin/services-manager';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await db.service.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <ServicesManager
      services={services.map((s) => ({
        ...s,
        features: JSON.parse(s.features),
      }))}
    />
  );
}
