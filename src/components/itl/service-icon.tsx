import {
  GraduationCap,
  Languages,
  Palette,
  Clapperboard,
  Users,
  Megaphone,
  Printer,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Languages,
  Palette,
  Clapperboard,
  Users,
  Megaphone,
  Printer,
};

export function ServiceDetailIcon({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  const Icon = ICONS[name] || Megaphone;
  const size = small ? 'h-5 w-5' : 'h-10 w-10';
  return <Icon className={`${size} text-gold`} />;
}

export const SERVICE_ICON_NAMES = Object.keys(ICONS);
