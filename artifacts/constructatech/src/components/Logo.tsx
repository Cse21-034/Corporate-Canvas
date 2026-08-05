import React from 'react';

/**
 * The supplied artwork is a full lockup — wordmark on the left, spectrum mark
 * on the right — on a transparent background.
 *
 * Its wordmark is dark grey, which disappears against the navy heroes and
 * sidebars, so `logo-light.png` is a generated variant with the neutral
 * (wordmark) pixels turned white and the coloured mark left alone.
 */
const LOGO_DARK_TEXT = '/logo.png';
const LOGO_LIGHT_TEXT = '/logo-light.png';

// Source artwork is 1080x435, so height drives the size and width follows.
const SIZE_CLASSES = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14',
} as const;

interface LogoProps {
  /** `light`/`mono` are used on dark backgrounds. */
  variant?: 'full' | 'light' | 'mono';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'full', size = 'md' }: LogoProps) {
  const onDarkBackground = variant === 'light' || variant === 'mono';

  return (
    <img
      src={onDarkBackground ? LOGO_LIGHT_TEXT : LOGO_DARK_TEXT}
      alt="Constructatech Ventures"
      width={1080}
      height={435}
      className={`${SIZE_CLASSES[size]} w-auto object-contain`}
    />
  );
}
