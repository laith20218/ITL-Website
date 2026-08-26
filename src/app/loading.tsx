/** Style: مسار الإنجاز الذهبي — حالة تحميل هادئة تحافظ على حضور العلامة بدل مساحة سوداء فارغة. */
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0B0D10] text-[#F3F0E8] flex items-center justify-center overflow-hidden">
      <div className="relative text-center px-6">
        <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9A24A]/20" />
        <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#C9A24A]/40 bg-[#C9A24A]/10 text-2xl font-semibold text-[#DCC06A] shadow-[0_0_45px_rgba(201,162,74,.14)]">ITL</div>
        <p className="relative mt-6 text-sm text-[#F3F0E8]/65">نرتّب تفاصيل رحلتك إلى الإنجاز</p>
        <div className="relative mx-auto mt-5 h-px w-40 overflow-hidden bg-white/10">
          <span className="block h-full w-1/2 bg-gradient-to-r from-transparent via-[#C9A24A] to-transparent animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </main>
  )
}
