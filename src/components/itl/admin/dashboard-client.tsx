'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  Mail,
  Users,
  TrendingUp,
  ArrowLeft,
  Eye,
  ExternalLink,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardClientProps {
  stats: {
    services: number;
    articles: number;
    messages: number;
    users: number;
    newMessages: number;
  };
  recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    service: string | null;
    status: string;
    createdAt: string;
  }>;
  messagesByService: Array<{ service: string; count: number }>;
  recentArticles: Array<{
    id: string;
    title: string;
    category: string;
    createdAt: string;
    published: boolean;
    viewCount: number;
  }>;
}

export function DashboardClient({
  stats,
  recentMessages,
  messagesByService,
  recentArticles,
}: DashboardClientProps) {
  const maxServiceCount = Math.max(...messagesByService.map((m) => m.count), 1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome card */}
      <div className="luxury-card rounded-2xl p-6 lg:p-8 gold-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold mb-2">
              مرحبًا بك في <span className="text-gradient-gold">لوحة تحكم ITL</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              من هنا يمكنك إدارة خدماتك ومقالاتك ورسائل العملاء بكل سهولة.
            </p>
          </div>
          <Button asChild variant="outline" className="border-gold/40 hover:bg-gold/10">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4 ml-2" />
              عرض الموقع
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Briefcase}
          label="الخدمات"
          value={stats.services}
          color="gold"
          href="/admin/services"
        />
        <StatCard
          icon={FileText}
          label="المقالات"
          value={stats.articles}
          color="gold"
          href="/admin/articles"
        />
        <StatCard
          icon={Mail}
          label="إجمالي الرسائل"
          value={stats.messages}
          color="gold"
          href="/admin/messages"
        />
        <StatCard
          icon={Inbox}
          label="رسائل جديدة"
          value={stats.newMessages}
          color="highlight"
          href="/admin/messages"
        />
        <StatCard
          icon={Users}
          label="المستخدمون"
          value={stats.users}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent messages */}
        <div className="lg:col-span-2 luxury-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-gold" />
              آخر الرسائل
            </h3>
            <Button asChild variant="ghost" size="sm" className="text-gold hover:bg-gold/10">
              <Link href="/admin/messages">
                عرض الكل
                <ArrowLeft className="h-4 w-4 mr-1" />
              </Link>
            </Button>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">لا توجد رسائل بعد</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-gold/10 hover:border-gold/30 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/30">
                    <span className="font-bold text-gold">{m.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{m.name}</p>
                      {m.status === 'new' && (
                        <Badge variant="outline" className="border-gold/50 text-gold bg-gold/10 text-[10px]">
                          جديد
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.subject}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(m.createdAt).toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages by service */}
        <div className="luxury-card rounded-2xl p-6">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-gold" />
            الطلبات حسب الخدمة
          </h3>
          {messagesByService.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {messagesByService.map((m) => (
                <div key={m.service}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-foreground/80 truncate">{m.service}</span>
                    <span className="font-bold text-gold">{m.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964]"
                      style={{ width: `${(m.count / maxServiceCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent articles */}
      <div className="luxury-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold" />
            آخر المقالات
          </h3>
          <Button asChild variant="ghost" size="sm" className="text-gold hover:bg-gold/10">
            <Link href="/admin/articles">
              عرض الكل
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-xs text-muted-foreground">
                <th className="text-right py-3 px-2 font-medium">العنوان</th>
                <th className="text-right py-3 px-2 font-medium">الفئة</th>
                <th className="text-right py-3 px-2 font-medium">الحالة</th>
                <th className="text-right py-3 px-2 font-medium">المشاهدات</th>
                <th className="text-right py-3 px-2 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((a) => (
                <tr key={a.id} className="border-b border-gold/10 hover:bg-gold/5">
                  <td className="py-3 px-2 font-medium">{a.title}</td>
                  <td className="py-3 px-2 text-muted-foreground">{a.category}</td>
                  <td className="py-3 px-2">
                    {a.published ? (
                      <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5">
                        منشور
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                        مسودة
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {a.viewCount}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'gold' | 'highlight';
  href?: string;
}) {
  const content = (
    <div
      className={`luxury-card luxury-card-hover rounded-2xl p-5 relative overflow-hidden ${
        href ? 'cursor-pointer' : ''
      } ${color === 'highlight' ? '!border-gold/50 gold-glow' : ''}`}
    >
      {color === 'highlight' && value > 0 && (
        <span className="absolute top-3 left-3 h-2 w-2 rounded-full bg-gold animate-pulse" />
      )}
      <div className="flex items-center justify-between mb-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            color === 'highlight' ? 'bg-gold/25 border-gold/50' : 'bg-gold/10 border-gold/20'
          } border`}
        >
          <Icon className="h-5 w-5 text-gold" />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-gradient-gold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
