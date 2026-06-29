import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'

const ALLOWED_FIELDS = [
  'heroTitle', 'heroSubtitle',
  'heroStat1Num', 'heroStat1Label',
  'heroStat2Num', 'heroStat2Label',
  'heroStat3Num', 'heroStat3Label',
  'heroQuote',
  'email', 'phone', 'whatsapp', 'address', 'workHours',
  'facebook', 'instagram', 'youtube', 'tiktok', 'telegram', 'whatsappCommunity',
  'aboutTitle', 'aboutIntro1', 'aboutIntro2', 'aboutIntro3', 'aboutClosing',
  'seoTitle', 'seoDescription',
] as const

export async function GET() {
  // Public read (also used by frontend components), but admin guard for safety on writes only.
  try {
    let settings = await db.siteSettings.findUnique({ where: { id: 'singleton' } })
    if (!settings) {
      settings = await db.siteSettings.create({ data: { id: 'singleton', heroTitle: 'من الفكرة إلى الحياة', heroSubtitle: '', heroStat1Num: '', heroStat1Label: '', heroStat2Num: '', heroStat2Label: '', heroStat3Num: '', heroStat3Label: '', heroQuote: '', email: '', phone: '', whatsapp: '', address: '', workHours: '', aboutTitle: '', aboutIntro1: '', aboutIntro2: '', aboutIntro3: '', aboutClosing: '', seoTitle: '', seoDescription: '' } })
    }
    return NextResponse.json({ settings })
  } catch (e) {
    console.error('Settings get error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  try {
    const body = await request.json()
    const data: Record<string, string | null> = {}
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) {
        data[key] = body[key] === null ? null : String(body[key])
      }
    }

    const settings = await db.siteSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        heroTitle: body.heroTitle || 'من الفكرة إلى الحياة',
        heroSubtitle: body.heroSubtitle || '',
        heroStat1Num: body.heroStat1Num || '',
        heroStat1Label: body.heroStat1Label || '',
        heroStat2Num: body.heroStat2Num || '',
        heroStat2Label: body.heroStat2Label || '',
        heroStat3Num: body.heroStat3Num || '',
        heroStat3Label: body.heroStat3Label || '',
        heroQuote: body.heroQuote || '',
        email: body.email || '',
        phone: body.phone || '',
        whatsapp: body.whatsapp || '',
        address: body.address || '',
        workHours: body.workHours || '',
        facebook: body.facebook || null,
        instagram: body.instagram || null,
        youtube: body.youtube || null,
        tiktok: body.tiktok || null,
        telegram: body.telegram || null,
        whatsappCommunity: body.whatsappCommunity || null,
        aboutTitle: body.aboutTitle || '',
        aboutIntro1: body.aboutIntro1 || '',
        aboutIntro2: body.aboutIntro2 || '',
        aboutIntro3: body.aboutIntro3 || '',
        aboutClosing: body.aboutClosing || '',
        seoTitle: body.seoTitle || '',
        seoDescription: body.seoDescription || '',
      },
    })

    return NextResponse.json({ settings })
  } catch (e) {
    console.error('Settings update error:', e)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
