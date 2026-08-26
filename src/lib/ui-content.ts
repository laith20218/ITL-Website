import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

export const UI_SECTION_KEYS = ['header', 'hero', 'services', 'about', 'articles', 'contact', 'footer'] as const
export type UiSectionKey = (typeof UI_SECTION_KEYS)[number]
export type UiContent = Record<string, string>

export const UI_SECTION_RESET_LABELS: Record<UiSectionKey, string> = {
  header: 'الرأس والتنقل',
  hero: 'الواجهة الرئيسية',
  services: 'بوابات الخدمات',
  about: 'من نحن',
  articles: 'المقالات',
  contact: 'التواصل',
  footer: 'التذييل',
}

export function uiSectionResetConfirmation(sectionKey: UiSectionKey) {
  return `إعادة تعيين ${UI_SECTION_RESET_LABELS[sectionKey]}`
}

export const UI_DEFAULT_SECTIONS: Record<UiSectionKey, UiContent> = {
  header: {
    brandTagline: 'Idea To Life',
    nav1Label: 'البوابات', nav1Href: '/#services',
    nav2Label: 'من نحن', nav2Href: '/#about',
    nav3Label: 'المدونة', nav3Href: '/#articles',
    nav4Label: 'تواصل', nav4Href: '/#contact',
    nav5Label: 'أعمالنا', nav5Href: '/portfolio',
    nav6Label: 'المكتبة', nav6Href: '/library',
    loginLabel: 'دخول', accountLabel: 'حسابي', adminLabel: 'لوحة التحكم',
  },
  hero: {
    eyebrow: 'شريكك من السؤال إلى المخرج الجاهز',
    titlePrefix: 'من الفكرة إلى', titleAccent: 'الإنجاز',
    subtitle: 'نستمع إلى فكرتك، نرتب مسارها، ثم نساعدك على تحويلها إلى مخرج أكاديمي أو إبداعي أو رقمي واضح.',
    primaryCtaLabel: 'اختر بوابتك', primaryCtaHref: '/#services',
    secondaryCtaLabel: 'ابدأ طلبك', secondaryCtaHref: '/#contact',
    stat1Num: '+35', stat1Label: 'خدمة احترافية',
    stat2Num: '+74', stat2Label: 'عميل سعيد',
    stat3Num: '+3', stat3Label: 'سنوات خبرة',
  },
  services: {
    eyebrow: 'اختر مسارك', titleStart: 'ثلاث بوابات،', titleAccent: 'وطريق واحد إلى الإنجاز.',
    description: 'ابدأ من نوع احتياجك، ثم اختر الخدمة الدقيقة التي تساعدك على التقدم.',
    academicLabel: 'أكاديمي ولغوي', academicEyebrow: 'معرفة منظّمة', academicTitle: 'حين تستحق فكرتك منهجًا واضحًا.', academicDescription: 'من الترجمة والتحرير إلى الاستشارات والمنهجية والعروض؛ نمنح المعرفة شكلًا أوضح وأكثر جاهزية.',
    creativeLabel: 'إبداعي وإعلامي', creativeEyebrow: 'حضور يُرى', creativeTitle: 'حين تحتاج فكرتك إلى حضور يليق بها.', creativeDescription: 'هوية ومحتوى وإنتاج بصري وصوتي يشرحون قيمتك قبل أن تبدأ التفاصيل.',
    digitalLabel: 'رقمي وتطوير', digitalEyebrow: 'حلول تعمل', digitalTitle: 'حين تتحول الفكرة إلى تجربة تعمل وتنمو.', digitalDescription: 'مواقع وتطبيقات وبوتات وقوائم رقمية وتسويق مدروس، لبناء نقطة انطلاق عملية لعملك.',
    academicAction: 'استكشف المسار الأكاديمي', creativeAction: 'شاهد المسار الإبداعي', digitalAction: 'ابدأ مشروعك الرقمي',
    routeStart: 'احتياج', routeMiddle: 'مسار', routeEnd: 'نتيجة',
  },
  about: {
    overline: 'كيف نمضي معك', title: 'الفكرة لا تكفي وحدها؛ المسار هو ما يصنع الفرق.',
    intro1: 'فريق ITL هو فريق متخصص يقدّم حلولاً احترافية متكاملة في مجالات البحث العلمي والترجمة والتصميم والبرمجة والتسويق الرقمي، تحت سقف واحد وبجودة عالية.',
    intro2: 'نسعى لأن نكون شريكك الموثوق في رحلتك من الفكرة إلى الإنجاز، عبر فريق من المختصين يفهم احتياجاتك ويعمل بشغف لتحقيق رؤيتك بأعلى المعايير.',
    intro3: 'نؤمن أن كل مشروع يستحق الاهتمام بأدق التفاصيل، لذلك نحرص على تقديم خدمات مخصّصة تناسب كل عميل، مع التزام تام بمواعيد التسليم والميزانية المتفق عليها.',
    closing: 'مع ITL، أفكارك في أيدٍ أمينة.',
  },
  articles: {
    eyebrow: 'مكتبة المسار', title: 'أفكار تقرّبك من', titleAccent: 'المخرج الأفضل.',
    description: 'محتوى عملي يوضح ما قبل التنفيذ، ويجعل قرارك التالي أكثر وعيًا.', allLabel: 'الكل', searchPlaceholder: 'ابحث في المقالات...', emptyLabel: 'لا توجد مقالات حالياً',
  },
  contact: {
    overline: 'نقطة البداية', title: 'لديك سؤال؟ لنمنحه طريقًا واضحًا.',
    description: 'أخبرنا بما تريد الوصول إليه، وسنرتب معك الخطوة العملية التالية.',
    formTitle: 'أرسل طلبك', submitLabel: 'إرسال الطلب',
    nameLabel: 'الاسم الكامل *', namePlaceholder: 'اسمك الكامل', emailLabel: 'البريد الإلكتروني *', emailPlaceholder: 'example@email.com',
    phoneLabel: 'رقم الهاتف', phonePlaceholder: '+963 9xx xxx xxx', serviceLabel: 'الخدمة المطلوبة', servicePlaceholder: 'اختر الخدمة',
    subjectLabel: 'الموضوع *', subjectPlaceholder: 'موضوع رسالتك', messageLabel: 'رسالتك *', messagePlaceholder: 'اكتب تفاصيل طلبك هنا...',
    paymentTitle: 'الدفع عبر شام كاش (اختياري)', walletLabel: 'عنوان المحفظة للتحويل:', walletAddress: '815e5099c7147ea64668e1146619a101', copyLabel: 'نسخ',
    amountLabel: 'المبلغ (اختياري)', amountPlaceholder: 'مثال: 50000', referenceLabel: 'رقم عملية التحويل (اختياري)', referencePlaceholder: 'رقم عملية التحويل',
  },
  footer: {
    description: 'فريق ITL يحوّل أفكارك إلى واقع ملموس، بخدمات احترافية تجمع بين الإبداع والجودة والسرعة في التنفيذ.',
    linksTitle: 'روابط سريعة', contactTitle: 'معلومات التواصل', copyright: '© 2026 فريق ITL — جميع الحقوق محفوظة',
    facebookUrl: '', instagramUrl: '', youtubeUrl: '', telegramUrl: '', whatsappUrl: '', madeWith: 'صُمّم بحبّ لعملائنا',
  },
}

export const UI_DEFAULT_CARDS = [
  { sectionKey: 'about', cardType: 'value', sortOrder: 0, content: { icon: 'book', title: 'المعرفة', description: 'بحث ومنهجية وتحرير لغوي واضح' } },
  { sectionKey: 'about', cardType: 'value', sortOrder: 1, content: { icon: 'ruler', title: 'الدقة', description: 'مراجعة منظمة ومخرجات قابلة للاستخدام' } },
  { sectionKey: 'about', cardType: 'value', sortOrder: 2, content: { icon: 'idea', title: 'الفكرة', description: 'تصميم ومحتوى يمنحانها حضورًا' } },
  { sectionKey: 'about', cardType: 'value', sortOrder: 3, content: { icon: 'arrow', title: 'الإنجاز', description: 'حلول رقمية تنقلها إلى الخطوة التالية' } },
  { sectionKey: 'contact', cardType: 'contact', sortOrder: 0, content: { label: 'البريد الإلكتروني', value: 'ITL.support.email@gmail.com', href: 'mailto:ITL.support.email@gmail.com', icon: 'mail' } },
  { sectionKey: 'contact', cardType: 'contact', sortOrder: 1, content: { label: 'الهاتف', value: '+963 981 581 384', href: 'tel:+963981581384', icon: 'phone' } },
  { sectionKey: 'contact', cardType: 'contact', sortOrder: 2, content: { label: 'العنوان', value: 'حمص، سوريا', href: '', icon: 'map' } },
]

export function isUiSectionKey(value: string): value is UiSectionKey {
  return (UI_SECTION_KEYS as readonly string[]).includes(value)
}

export function asUiContent(value: unknown, fallback: UiContent): UiContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback
  const input = value as Record<string, unknown>
  return Object.fromEntries(Object.entries(fallback).map(([key, fallbackValue]) => [key, typeof input[key] === 'string' ? input[key] : fallbackValue]))
}

export async function ensureUiContent() {
  await Promise.all(
    Object.entries(UI_DEFAULT_SECTIONS).map(([sectionKey, content], sortOrder) =>
      db.uiSection.upsert({
        where: { sectionKey },
        update: {},
        create: { sectionKey, content: content as Prisma.InputJsonValue, sortOrder, isVisible: true },
      })
    )
  )

  const cardCount = await db.uiCard.count()
  if (cardCount === 0) {
    await db.uiCard.createMany({
      data: UI_DEFAULT_CARDS.map((card) => ({ ...card, content: card.content as Prisma.InputJsonValue, isVisible: true })),
    })
  }
}
