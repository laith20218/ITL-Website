import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('inline-block', className)}
      role="img"
      aria-label="ITL Logo"
    >
      <defs>
        <linearGradient id="itlGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C964" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A8842B" />
        </linearGradient>
        <linearGradient id="itlGoldSoft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C964" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <filter id="itlGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="url(#itlGold)" strokeWidth="2" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="url(#itlGoldSoft)" strokeWidth="0.5" opacity="0.5" />

      {/* Inner circle background */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#itlGold)" strokeWidth="1" opacity="0.3" />

      {/* Lightbulb (idea) */}
      <g filter="url(#itlGlow)">
        {/* Bulb top */}
        <path
          d="M 50 18 C 41 18 34 25 34 34 C 34 40 37 43 40 46 L 40 52 L 60 52 L 60 46 C 63 43 66 40 66 34 C 66 25 59 18 50 18 Z"
          fill="url(#itlGold)"
          opacity="0.95"
        />
        {/* Bulb base */}
        <rect x="42" y="52" width="16" height="3" fill="url(#itlGold)" />
        <rect x="43" y="55" width="14" height="2" fill="#A8842B" />
        <rect x="44" y="57" width="12" height="2" fill="#A8842B" />
        {/* Filament */}
        <path d="M 46 30 Q 50 36 54 30" fill="none" stroke="#0A0A0A" strokeWidth="1" opacity="0.6" />
        {/* Light rays */}
        <line x1="50" y1="10" x2="50" y2="14" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="22" x2="25" y2="25" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="78" y1="22" x2="75" y2="25" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="34" x2="18" y2="34" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="82" y1="34" x2="86" y2="34" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Open book (knowledge) */}
      <g filter="url(#itlGlow)">
        <path
          d="M 30 64 Q 50 58 70 64 L 70 76 Q 50 70 30 76 Z"
          fill="url(#itlGoldSoft)"
          stroke="#A8842B"
          strokeWidth="0.5"
        />
        <line x1="50" y1="61" x2="50" y2="73" stroke="#A8842B" strokeWidth="0.6" />
        {/* Book lines */}
        <line x1="35" y1="66" x2="46" y2="63" stroke="#A8842B" strokeWidth="0.4" opacity="0.6" />
        <line x1="35" y1="69" x2="46" y2="66" stroke="#A8842B" strokeWidth="0.4" opacity="0.6" />
        <line x1="35" y1="72" x2="46" y2="69" stroke="#A8842B" strokeWidth="0.4" opacity="0.6" />
        <line x1="54" y1="63" x2="65" y2="66" stroke="#A8842B" strokeWidth="0.4" opacity="0.6" />
        <line x1="54" y1="66" x2="65" y2="69" stroke="#A8842B" strokeWidth="0.4" opacity="0.6" />
        <line x1="54" y1="69" x2="65" y2="72" stroke="#A8842B" strokeWidth="0.4" opacity="0.6" />
      </g>

      {/* Arrow (life/forward motion) */}
      <g filter="url(#itlGlow)">
        <path
          d="M 36 84 L 64 84"
          stroke="url(#itlGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 58 80 L 64 84 L 58 88"
          fill="none"
          stroke="url(#itlGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
