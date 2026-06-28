'use client';

import * as React from 'react';
import { ItlLogo } from './logo';

const FOOTER_LINKS = [
  {
    title: 'خدماتنا',
    links: [
      { label: 'البحث العلمي', href: '#services' },
      { label: 'الترجمة الاحترافية', href: '#services' },
      { label: 'التصميم والهوية البصرية', href: '#services' },
      { label: 'الإنتاج السمعي والبصري', href: '#services' },
      { label: 'التدريب والتطوير', href: '#services' },
    ],
  },
  {
    title: 'روابط سريعة',
    links: [
      { label: 'الرئيسية', href: '#home' },
      { label: 'من نحن', href: '#about' },
      { label: 'المقالات', href: '#articles' },
      { label: 'تواصل معنا', href: '#contact' },
    ],
  },
  {
    title: 'تواصل',
    links: [
      { label: 'info@itl-team.com', href: 'mailto:info@itl-team.com' },
      { label: '+966 50 000 0000', href: 'tel:+966500000000' },
      { label: 'الرياض، السعودية', href: '#contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-gold/15 bg-background">
      {/* Top decorative line */}
      <div className="h-px bg-gradient-to-l from-transparent via-gold/60 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <ItlLogo size={56} />
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              فريق ITL — من الفكرة إلى الحياة. خدمات متكاملة بمعايير عالمية في البحث
              العلمي والترجمة والتصميم والإنتاج والتدريب والتسويق الرقمي.
            </p>
            <div className="flex gap-2 mt-5">
              {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 hover:bg-gold/10 hover:border-gold transition-all text-gold text-xs font-bold"
                >
                  {s.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold mb-4 text-gold font-display text-lg">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors block"
                      dir="auto"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ITL — Idea To Life. جميع الحقوق محفوظة.
          </p>
          <p className="flex items-center gap-2">
            <span>صُنع بشغف</span>
            <span className="text-gold">★</span>
            <span>لعملائنا الكرام</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
