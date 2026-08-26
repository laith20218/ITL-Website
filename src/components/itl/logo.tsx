/** Style: مسار الإنجاز الذهبي — استعمال الرمز المعتمد ككتلة مرئية واضحة في الشريط العلوي والقسم الافتتاحي. */
const ITL_LOGO_URL = '/itl-logo.webp'

export function Logo({ className }: { className?: string }) {
  return <img src={ITL_LOGO_URL} alt="شعار ITL" className={className} />
}

export function ItlLogo({ size = 40 }: { size?: number }) {
  return <Logo className="object-contain" />
}
