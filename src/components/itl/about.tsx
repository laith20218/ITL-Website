'use client';

import * as React from 'react';
import { Award, Target, Eye, Heart, Sparkles, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { SectionHeading } from './services';
import { ItlLogo } from './logo';

const VALUES = [
  {
    icon: Target,
    title: 'رسالتنا',
    text: 'تحويل أفكار عملائنا إلى واقع ملموس، عبر حلول احترافية تجمع بين الإبداع والجودة والأصالة.',
  },
  {
    icon: Eye,
    title: 'رؤيتنا',
    text: 'أن نكون الخيار الأول لكل من يبحث عن التميز في الخدمات الأكاديمية والإبداعية على المستوى الإقليمي.',
  },
  {
    icon: Heart,
    title: 'قيمنا',
    text: 'الالتزام، الإتقان، السرية، والاهتمام بأدق التفاصيل — لأن عملاءنا يستحقون الأفضل دائمًا.',
  },
];

const FEATURES = [
  { icon: Award, title: 'جودة معتمدة', desc: 'معايير أكاديمية عالمية' },
  { icon: ShieldCheck, title: 'سرية تامة', desc: 'حماية بياناتك وأعمالك' },
  { icon: Clock, title: 'التزام بالوقت', desc: 'تسليم في الموعد المحدد' },
  { icon: TrendingUp, title: 'تطوير مستمر', desc: 'مواكبة أحدث الممارسات' },
];

export function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          eyebrow="من نحن"
          title="فريق ITL — حيث تلتقي الفكرة بالخبرة"
          subtitle="فريق متعدد التخصصات يجمع بين الأكاديميين والمبدعين والمصممين، نعمل بشغف لتحقيق رؤية عملائنا بأعلى المعايير."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-center">
          {/* Logo & tagline */}
          <div className="relative">
            <div className="luxury-card rounded-3xl p-12 text-center gold-glow">
              <div className="flex justify-center mb-6">
                <ItlLogo size={140} showText={false} />
              </div>
              <h3 className="font-display text-3xl font-bold mb-3 text-gradient-gold">
                ITL
              </h3>
              <p className="text-sm tracking-[0.4em] text-muted-foreground uppercase mb-4">
                Idea To Life
              </p>
              <div className="gold-divider mb-4" />
              <p className="font-display text-xl text-foreground/90 italic">
                «من الفكرة إلى الحياة... كل ما تريد في مكان واحد»
              </p>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gold/10 blur-2xl" />
          </div>

          {/* Values */}
          <div className="space-y-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="flex gap-4 p-5 rounded-2xl luxury-card luxury-card-hover"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft/20 to-gold-deep/20 border border-gold/30">
                  <v.icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-foreground">{v.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="text-center p-6 rounded-2xl luxury-card luxury-card-hover"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/30 mb-3">
                <f.icon className="h-6 w-6 text-gold" />
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-1">{f.title}</h4>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
