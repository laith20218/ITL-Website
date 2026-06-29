'use client'

import {
  GraduationCap, Languages, Palette, Clapperboard, Users,
  Megaphone, Printer, Globe, Smartphone, Apple, Send, QrCode,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Languages,
  Palette,
  Clapperboard,
  Users,
  Megaphone,
  Printer,
  Globe,
  Smartphone,
  Apple,
  Send,
  QrCode,
}

export function ServiceIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = iconMap[name] || GraduationCap
  return <Icon className={className} />
}
