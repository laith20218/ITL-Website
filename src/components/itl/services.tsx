'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Languages,
  Palette,
  Clapperboard,
  Users,
  Megaphone,
  Printer,
  Check,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
}

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Languages,
  Palette,
  Clapperboard,
  Users,
  Megaphone,
  Printer,
};

export function Services() {
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        setServices(data.services || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          eyebrow="خدماتنا"
          title="حلول متكاملة لاحتياجاتك"
          subtitle="نقدم باقة متنوعة من الخدمات الاحترافية التي تجمع بين الخبرة والإبداع، مصممة لتحقيق رؤيتك بأعلى المعايير."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl bg-secondary/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {services.map((s, idx) => {
              const Icon = ICONS[s.icon] || SparkleIcon;
              const isActive = active === s.id;
              return (
                <article
                  key={s.id}
                  onMouseEnter={() => setActive(s.id)}
                  onMouseLeave={() => setActive(null)}
                  className="luxury-card luxury-card-hover rounded-2xl p-6 lg:p-7 group relative overflow-hidden"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Number badge */}
                  <div className="absolute top-4 left-4 font-display text-5xl font-bold text-gold/[0.07] group-hover:text-gold/15 transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft/20 to-gold-deep/20 border border-gold/30 group-hover:from-gold-soft/30 group-hover:to-gold-deep/30 transition-colors">
                        <Icon className="h-7 w-7 text-gold" />
                      </div>
                      <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5">
                        {s.category}
                      </Badge>
                    </div>

                    <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-gold transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                      {s.description}
                    </p>

                    <ul className="space-y-2 mb-5">
                      {s.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="flex-1 justify-center border border-gold/20 hover:bg-gold/10 hover:text-gold transition-all"
                      >
                        <Link href={`/services/${s.slug}`}>
                          التفاصيل
                          <ArrowLeft className="h-4 w-4 mr-1" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className={`flex-1 justify-center border border-gold/40 bg-gold/5 hover:bg-gold/15 hover:text-gold transition-all ${
                          isActive ? 'bg-gold/10 text-gold' : ''
                        }`}
                      >
                        <a href="#contact">اطلب الآن</a>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function SparkleIcon() {
  return <Megaphone />;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'right';
}) {
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <div className="ornament-line mb-4 max-w-xs mx-auto">
        <span className="text-xs tracking-[0.3em] text-gold uppercase font-medium">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
