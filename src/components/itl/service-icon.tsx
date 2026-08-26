'use client'

/** Style: مسار الإنجاز الذهبي — رموز خطية مقتصدة مستلهمة من المصباح والكتاب/المسطرة والسهم، لا أيقونات عامة متباينة. */

import {
  ArrowUpRight, BookOpen, Lightbulb, Ruler,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  GraduationCap: BookOpen,
  Languages: Ruler,
  Palette: Lightbulb,
  Clapperboard: Lightbulb,
  Users: BookOpen,
  Megaphone: ArrowUpRight,
  Printer: Ruler,
  Globe: ArrowUpRight,
  Smartphone: ArrowUpRight,
  Apple: ArrowUpRight,
  Send: ArrowUpRight,
  QrCode: ArrowUpRight,
}

export function ServiceIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = iconMap[name] || BookOpen
  return <Icon className={className} />
}
