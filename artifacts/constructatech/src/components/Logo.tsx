import React from 'react';

/**
 * The spectrum arrow, on a transparent background. Only the mark is an image —
 * the wordmark is text so it recolours for dark heroes, scales with the type
 * scale, stays selectable, and is read properly by screen readers.
 */
const LOGO_MARK = '/logo.png';

const SIZES = {
  sm: { mark: 'w-8 h-8', wordmark: 'text-base', sub: 'text-[8px]', bar: 'w-2' },
  md: { mark: 'w-10 h-10', wordmark: 'text-xl', sub: 'text-[10px]', bar: 'w-2.5' },
  lg: { mark: 'w-14 h-14', wordmark: 'text-3xl', sub: 'text-xs', bar: 'w-3.5' },
} as const;

interface LogoProps {
  /** `light`/`mono` are used on dark backgrounds. */
  variant?: 'full' | 'light' | 'mono';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'full', size = 'md' }: LogoProps) {
  const onDarkBackground = variant === 'light' || variant === 'mono';
  const s = SIZES[size];

  return (
    <div className="flex items-center gap-2.5">
      <img
        src={LOGO_MARK}
        alt=""
        width={661}
        height={671}
        className={`${s.mark} shrink-0 object-contain`}
      />

      {/* Set to match the brand lockup: light weight, wide tracking, and
          "VENTURES" beneath between two short bars. */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-display font-light leading-none tracking-[0.18em] ${s.wordmark} ${
            onDarkBackground ? 'text-white' : 'text-foreground'
          }`}
        >
          CONSTRUCTATECH
        </span>
        <span
          aria-hidden="true"
          className={`mt-1.5 flex items-center gap-1.5 leading-none ${
            onDarkBackground ? 'text-white/80' : 'text-foreground/70'
          }`}
        >
          <span className={`h-0.5 ${s.bar} shrink-0 bg-current`} />
          <span className={`font-display font-light tracking-[0.3em] ${s.sub}`}>VENTURES</span>
          <span className={`h-0.5 ${s.bar} shrink-0 bg-current`} />
        </span>
        <span className="sr-only">Constructatech Ventures</span>
      </div>
    </div>
  );
}
