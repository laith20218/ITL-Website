'use client';

import * as React from 'react';
import { Sparkles, ArrowLeft, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItlLogo } from './logo';

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-luxury-gradient"
    >
      {/* Decorative golden orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl float" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-3xl" />
      </div>

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-sm mb-8 fade-up">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-medium tracking-wider text-gold uppercase">
              IDEA TO LIFE
            </span>
          </div>

          {/* Big logo */}
          <div className="flex justify-center mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="float">
              <ItlLogo size={120} showText={false} />
            </div>
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-gradient-gold">من الفكرة</span>
            <br />
            <span className="text-foreground">إلى الحياة</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            فريق متكامل من المبدعين والمختصين، نقدم خدمات احترافية في البحث العلمي،
            الترجمة، التصميم، الإنتاج السمعي والبصري، التدريب، التسويق الرقمي، والطباعة الفاخرة —
            كل ما تحتاجه في مكان واحد.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-l from-[#A8842B] via-[#D4AF37] to-[#E8C964] text-primary-foreground hover:opacity-90 h-13 px-8 text-base font-semibold gold-glow"
            >
              <a href="#services">
                اكتشف خدماتنا
                <ArrowLeft className="h-5 w-5 mr-2" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-foreground hover:bg-gold/10 hover:text-gold hover:border-gold h-13 px-8 text-base"
            >
              <a href="#contact">اطلب خدمتك الآن</a>
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-gold/15 fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            <Stat number="+500" label="عميل سعيد" />
            <Stat number="+1200" label="مشروع منجز" />
            <Stat number="+7" label="سنوات خبرة" />
          </div>

          {/* Quote */}
          <div
            className="mt-16 max-w-2xl mx-auto fade-up"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="luxury-card rounded-2xl p-6 relative">
              <Quote className="absolute -top-3 right-6 h-6 w-6 text-gold fill-gold/20" />
              <p className="font-display text-lg text-foreground/90 italic leading-relaxed">
                «نحن ننقل المعنى... وليس فقط الكلمات»
              </p>
              <p className="mt-3 text-sm text-gold font-medium">— شعار فريق ITL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-gradient-gold font-display">
        {number}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
