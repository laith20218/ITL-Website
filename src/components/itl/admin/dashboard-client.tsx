'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Briefcase, FileText, MessageSquare, Users, Mail, Eye, ArrowLeft, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface Stats {
  counts: {
    services: number
    articles: number
    messages: number
    users: number
    newMessages: number
    visits24h: number
    totalVisits: number
  }
  recentMessages: Array<{
    id: string
    name: string
    email: string
    subject: string
    service?: string | null
    status: string
    createdAt: string
  }>
  messagesByService: Array<{ name: string; count: number }>
}

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    )
  }

  const cards = [
    { label: 'الخدمات', value: stats.counts.services, icon: Briefcase, color: 'from-amber-500/20 to-amber-700/10' },
    { label: 'المقالات', value: stats.counts.articles, icon: FileText, color: 'from-emerald-500/20 to-emerald-700/10' },
    { label: 'الرسائل', value: stats.counts.messages, icon: MessageSquare, color: 'from-rose-500/20 to-rose-700/10' },
    { label: 'المستخدمون', value: stats.counts.users, icon: Users, color: 'from-sky-500/20 to-sky-700/10' },
    { label: 'رسائل جديدة', value: stats.counts.newMessages, icon: Mail, color: 'from-purple-500/20 to-purple-700/10' },
    { label: 'زيارات 24 ساعة', value: stats.counts.visits24h, icon: Eye, color: 'from-orange-500/20 to-orange-700/10' },
    { label: 'إجمالي الزيارات', value: stats.counts.totalVisits, icon: TrendingUp, color: 'from-yellow-500/20 to-yellow-700/10' },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon
          return (
            <Card key={c.label} className={`relative overflow-hidden luxury-card p-4 stagger-item bg-gradient-to-br ${c.color}`} style={{ animationDelay: `${i * 0.04}s` }}>
              <Icon className="w-5 h-5 text-[#D4AF37] mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Charts + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <Card className="luxury-card p-5 lg:col-span-2">
          <h3 className="font-bold text-[#D4AF37] mb-4 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            الرسائل حسب الخدمة
          </h3>
          {stats.messagesByService.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              لا توجد بيانات بعد
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.messagesByService}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4AF3720" />
                  <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#0A0A0A', border: '1px solid #D4AF3740', borderRadius: '8px' }}
                    labelStyle={{ color: '#D4AF37' }}
                  />
                  <Bar dataKey="count" fill="#D4AF37" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Recent messages */}
        <Card className="luxury-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#D4AF37] text-sm">أحدث الرسائل</h3>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:bg-[#D4AF37]/10">
                الكل
                <ArrowLeft className="mr-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-gold">
            {stats.recentMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">لا توجد رسائل</div>
            ) : (
              stats.recentMessages.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-muted/30 border border-[#D4AF37]/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{m.name}</span>
                    <Badge variant={m.status === 'new' ? 'default' : 'secondary'} className={m.status === 'new' ? 'bg-[#D4AF37] text-black' : ''}>
                      {m.status === 'new' ? 'جديد' : m.status === 'read' ? 'مقروء' : m.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{m.subject}</div>
                  {m.service && <div className="text-[10px] text-[#D4AF37]/70 mt-1">{m.service}</div>}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
