import { DashboardClient } from '@/components/itl/admin/dashboard-client'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold font-display">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">نظرة عامة على أداء الموقع</p>
      </div>
      <DashboardClient />
    </div>
  )
}
