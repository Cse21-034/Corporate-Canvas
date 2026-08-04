import React from 'react';

interface LogoProps {
  variant?: 'full' | 'light' | 'mono';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'full', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: {
      svg: 'w-6 h-6',
      wordmark: 'text-lg',
      sub: 'text-[8px]',
    },
    md: {
      svg: 'w-8 h-8',
      wordmark: 'text-xl',
      sub: 'text-[10px]',
    },
    lg: {
      svg: 'w-12 h-12',
      wordmark: 'text-3xl',
      sub: 'text-xs',
    }
  };

  const isLightText = variant === 'light' || variant === 'mono';
  
  return (
    <div className="flex items-center gap-3">
      <svg
        className={`flex-shrink-0 ${sizeClasses[size].svg}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spectrumGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3DBB4E" />
            <stop offset="25%" stopColor="#9BCB3C" />
            <stop offset="50%" stopColor="#F5A623" />
            <stop offset="75%" stopColor="#C4267D" />
            <stop offset="100%" stopColor="#6A2C91" />
          </linearGradient>
        </defs>
        <path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          fill={variant === 'mono' ? 'currentColor' : 'url(#spectrumGradient)'}
          className={variant === 'mono' ? 'text-white' : ''}
        />
      </svg>
      <div className="flex flex-col justify-center">
        <span 
          className={`font-display font-bold tracking-widest leading-none ${sizeClasses[size].wordmark} ${isLightText ? 'text-white' : 'text-foreground'}`}
        >
          CONSTRUCTATECH
        </span>
        <span 
          className={`font-mono-label leading-none mt-1 ${sizeClasses[size].sub} ${isLightText ? 'text-white/70' : 'text-muted-foreground'}`}
        >
          VENTURES
        </span>
      </div>
    </div>
  );
}
