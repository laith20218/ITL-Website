'use client'

/** Style: مسار الإنجاز الذهبي — مخرج واضح من أخطاء التشغيل بدل شاشة فارغة أو نهاية مسدودة. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#0B0D10] text-[#F3F0E8] flex items-center justify-center px-5" dir="rtl">
      <section className="w-full max-w-xl border border-[#C9A24A]/25 bg-white/[.025] p-8 md:p-12 text-center shadow-[0_30px_90px_rgba(0,0,0,.35)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#C9A24A]/35 bg-[#C9A24A]/10 text-[#DCC06A]">ITL</div>
        <p className="mt-6 text-xs tracking-[.18em] text-[#DCC06A]">محطة مؤقتة في المسار</p>
        <h1 className="mt-3 font-[var(--font-amiri)] text-4xl leading-tight">تعذر تحميل هذه الصفحة الآن</h1>
        <p className="mt-4 text-sm leading-7 text-[#F3F0E8]/65">لم نفقد مسارك. أعد المحاولة لتحديث الصفحة والعودة إلى خدمات ITL.</p>
        <button onClick={reset} className="mt-7 border border-[#C9A24A]/45 bg-[#C9A24A] px-6 py-3 text-sm font-semibold text-[#15120a] transition-transform duration-150 active:scale-[.97] hover:bg-[#DCC06A]">إعادة المحاولة</button>
      </section>
    </main>
  )
}
