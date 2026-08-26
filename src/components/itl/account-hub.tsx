/** Style: مسار الإنجاز الذهبي — لوحة حساب هادئة ومندمجة، تظهر الإدارة كقدرة إضافية لا كمنصة منفصلة. */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Bell, CircleUserRound, ClipboardList, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthModal } from './auth-modal'
import { useAuth } from './auth-provider'

export function AccountHub() {
  const { user, loading } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  if (loading) return <main className="account-shell"><div className="account-loading" /></main>

  if (!user) {
    return <main className="account-shell"><section className="account-guest"><span className="account-orbit" /><div className="account-route-key"><span>حساب ITL</span><i /><span>بوابتك الشخصية</span></div><div className="journey-kicker"><Sparkles className="h-3.5 w-3.5" />مساحتك في ITL</div><h1>حساب واحد، <em>ومسار أوضح لمشروعك.</em></h1><p>أنشئ حسابًا لحفظ تواصلك، متابعة تنبيهاتك، والانتقال سريعًا بين خدمات ITL.</p><div className="account-guest-path"><span>فكرة</span><i /><span>طلب</span><i /><span>إنجاز</span></div><Button className="journey-primary-button" onClick={() => setAuthOpen(true)}>دخول أو إنشاء حساب <ArrowLeft className="mr-2 h-4 w-4" /></Button><AuthModal open={authOpen} onOpenChange={setAuthOpen} /></section></main>
  }

  const isAdmin = user.role === 'admin'
  return (
    <main className="account-shell">
      <section className="account-hero">
        <div><div className="account-route-key"><span>حساب ITL</span><i /><span>مسارك مستمر</span></div><div className="journey-kicker"><Sparkles className="h-3.5 w-3.5" />حساب ITL</div><h1>أهلًا، <em>{user.name.split(' ')[0]}.</em></h1><p>مساحتك الهادئة لمتابعة تواصلك والوصول إلى الخطوة التالية.</p></div>
        <div className="account-avatar">{user.name.charAt(0)}</div>
      </section>
      <div className="account-journey-rail"><span>استكشف</span><i /><span>تابع</span><i /><span>أنجز</span></div>
      <section className="account-grid">
        <article className="account-card account-profile"><CircleUserRound className="h-5 w-5" /><div><span>معلومات الحساب</span><strong>{user.name}</strong><small>{user.email}</small>{user.phone && <small>{user.phone}</small>}</div></article>
        <Link href="/#contact" className="account-card account-action"><ClipboardList className="h-5 w-5" /><div><span>طلب جديد</span><strong>ابدأ من بوابتك المناسبة</strong></div><ArrowLeft className="h-4 w-4" /></Link>
        <article className="account-card account-notification"><Bell className="h-5 w-5" /><div><span>التنبيهات</span><strong>تابع آخر تحديثات حسابك من الجرس العلوي</strong></div></article>
        {isAdmin && <Link href="/admin/dashboard" className="account-card account-admin"><ShieldCheck className="h-5 w-5" /><div><span>صلاحية إدارية</span><strong>إدارة الموقع والمحتوى والطلبات</strong></div><ArrowLeft className="h-4 w-4" /></Link>}
      </section>
    </main>
  )
}
