'use client'

import { useEffect, useState } from 'react'
import { Eye, Users, MousePointerClick, Globe, Smartphone, Monitor, Tablet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'

interface Analytics {
  totalVisits: number
  uniqueVisitors: number
  visits24h: number
  visits7d: number
  topPages: Array<{ path: string; count: number }>
  recentVisits: Array<{ id: string; path: string; referrer?: string | null; userAgent?: string | null; isUnique: boolean; createdAt: string }>
  byDay: Array<{ date: string; visits: number; unique: number }>
  devices: { mobile: number; desktop: number; tablet: number; other: number }
  referrers: Array<{ source: string; count: number }>
}

export function AnalyticsClient() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    )
  }

  const cards = [
    { label: 'إجمالي الزيارات', value: data.totalVisits, icon: Eye, color: 'text-[#D4AF37]' },
    { label: 'زوار فريدون', value: data.uniqueVisitors, icon: Users, color: 'text-emerald-400' },
    { label: 'زيارات 24 ساعة', value: data.visits24h, icon: MousePointerClick, color: 'text-orange-400' },
    { label: 'زيارات 7 أيام', value: data.visits7d, icon: Globe, color: 'text-sky-400' },
  ]

  const deviceData = [
    { name: 'موبايل', value: data.devices.mobile, color: '#D4AF37' },
    { name: 'سطح المكتب', value: data.devices.desktop, color: '#E8C964' },
    { name: 'تابلت', value: data.devices.tablet, color: '#A8842B' },
    { name: 'أخرى', value: data.devices.other, color: '#666' },
  ].filter((d) => d.value > 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold font-display">تحليلات الزيارات</h1>
        <p className="text-sm text-muted-foreground">نظرة عامة على أداء الموقع</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon
          return (
            <Card key={c.label} className="luxury-card p-4 stagger-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <Icon className={`w-5 h-5 ${c.color} mb-2`} />
              <div className="text-2xl md:text-3xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Chart by day */}
      <Card className="luxury-card p-5">
        <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">الزيارات خلال آخر 7 أيام</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.byDay}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4AF3720" />
              <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#888', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0A0A0A', border: '1px solid #D4AF3740', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="visits" stroke="#D4AF37" fill="url(#goldGrad)" strokeWidth={2} name="الزيارات" />
              <Area type="monotone" dataKey="unique" stroke="#E8C964" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="زوار فريدون" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top pages */}
        <Card className="luxury-card p-5">
          <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">أكثر الصفحات زيارة</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-gold">
            {data.topPages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">لا توجد بيانات</div>
            ) : (
              data.topPages.map((p, i) => (
                <div key={p.path} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-xs text-[#D4AF37] font-bold flex-shrink-0">{i + 1}</span>
                    <span className="text-sm truncate" dir="ltr">{p.path}</span>
                  </div>
                  <span className="text-sm font-bold text-[#D4AF37] flex-shrink-0">{p.count}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Devices */}
        <Card className="luxury-card p-5">
          <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">الأجهزة</h3>
          {deviceData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">لا توجد بيانات</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                    {deviceData.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0A0A0A', border: '1px solid #D4AF3740', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Referrers + recent visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="luxury-card p-5">
          <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">مصادر الزيارات</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-gold">
            {data.referrers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">لا توجد بيانات</div>
            ) : (
              data.referrers.map((r) => (
                <div key={r.source} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm truncate" dir="ltr">{r.source}</span>
                  <span className="text-sm font-bold text-[#D4AF37]">{r.count}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="luxury-card p-5">
          <h3 className="font-bold text-[#D4AF37] mb-4 text-sm">آخر الزيارات</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-gold">
            {data.recentVisits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">لا توجد بيانات</div>
            ) : (
              data.recentVisits.slice(0, 15).map((v) => {
                const isMobile = /Mobile|Android|iPhone/i.test(v.userAgent || '')
                return (
                  <div key={v.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    {isMobile ? <Smartphone className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" /> : <Monitor className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate" dir="ltr">{v.path}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(v.createdAt).toLocaleString('ar-EG')}</div>
                    </div>
                    {v.isUnique && <Tablet className="w-3 h-3 text-emerald-400" />}
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
