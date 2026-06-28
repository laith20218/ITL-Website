import * as React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * ITL logo — combining lightbulb (Idea), open book (knowledge), and upward arrow (growth),
 * styled in luxury gold gradient.
 */
export function ItlLogo({ className, size = 48, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className || ''}`} dir="ltr">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ITL logo"
      >
        <defs>
          <linearGradient id="itlGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C964" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A8842B" />
          </linearGradient>
          <linearGradient id="itlGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A6F23" />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle cx="50" cy="50" r="46" stroke="url(#itlGold)" strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="50" cy="50" r="42" stroke="url(#itlGold)" strokeWidth="1" fill="none" />

        {/* Letter I — lightbulb */}
        <g>
          <path
            d="M 30 30 Q 30 22, 38 22 Q 46 22, 46 30 Q 46 35, 42 38 L 42 44 L 34 44 L 34 38 Q 30 35, 30 30 Z"
            fill="url(#itlGold)"
            stroke="url(#itlGoldDark)"
            strokeWidth="0.5"
          />
          <rect x="35" y="45" width="6" height="3" fill="url(#itlGold)" />
          <rect x="35.5" y="49" width="5" height="2" fill="url(#itlGold)" opacity="0.8" />
          {/* Light rays */}
          <line x1="38" y1="14" x2="38" y2="10" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="22" x2="21" y2="19" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="22" x2="55" y2="19" stroke="url(#itlGold)" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Letter T — open book */}
        <g>
          <path
            d="M 50 55 L 50 78 L 52 78 L 52 55 Z"
            fill="url(#itlGold)"
          />
          {/* Book pages */}
          <path
            d="M 30 58 L 50 62 L 50 78 L 30 74 Z"
            fill="url(#itlGold)"
            opacity="0.85"
            stroke="url(#itlGoldDark)"
            strokeWidth="0.4"
          />
          <path
            d="M 70 58 L 50 62 L 50 78 L 70 74 Z"
            fill="url(#itlGold)"
            opacity="0.7"
            stroke="url(#itlGoldDark)"
            strokeWidth="0.4"
          />
          {/* Lines on pages */}
          <line x1="35" y1="62" x2="46" y2="65" stroke="url(#itlGoldDark)" strokeWidth="0.4" opacity="0.5" />
          <line x1="35" y1="66" x2="46" y2="69" stroke="url(#itlGoldDark)" strokeWidth="0.4" opacity="0.5" />
          <line x1="54" y1="65" x2="65" y2="62" stroke="url(#itlGoldDark)" strokeWidth="0.4" opacity="0.5" />
          <line x1="54" y1="69" x2="65" y2="66" stroke="url(#itlGoldDark)" strokeWidth="0.4" opacity="0.5" />
        </g>

        {/* Letter L — upward arrow */}
        <g>
          <path
            d="M 68 35 L 68 70 L 82 70 L 82 73 L 65 73 L 65 35 Z"
            fill="url(#itlGold)"
          />
          {/* Arrow pointing up */}
          <path
            d="M 73 28 L 65 38 L 70 38 L 70 48 L 76 48 L 76 38 L 81 38 Z"
            fill="url(#itlGold)"
            stroke="url(#itlGoldDark)"
            strokeWidth="0.5"
          />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none" dir="ltr">
          <span className="font-display text-2xl font-bold text-gradient-gold tracking-wider">
            ITL
          </span>
          <span className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mt-1">
            Idea to Life
          </span>
        </div>
      )}
    </div>
  );
}
