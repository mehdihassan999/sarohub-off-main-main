import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'adaptive';
  height?: number;
  imageUrl?: string;
  alt?: string;
}

export function LogoIcon({ className = "h-10", height = 40 }: { className?: string; height?: number }) {
  // Calculated responsive widths based on height aspect ratio (approx 2.8:1 for icon alone)
  const width = Math.round(height * 2.8);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Main Ribbon Gradients matching SaroHub corporate identity */}
        <linearGradient id="logo-ribbon-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" /> {/* Dark Royal Blue */}
          <stop offset="50%" stopColor="#2563EB" /> {/* Vivid Cobalt Blue */}
          <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan */}
        </linearGradient>

        <linearGradient id="logo-node-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <radialGradient id="logo-dot-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22D3EE" /> {/* Bright turquoise */}
          <stop offset="100%" stopColor="#0284C7" /> {/* Ocean Blue */}
        </radialGradient>
      </defs>

      {/* 1. THE SMOOTH WAVE / RIBBON PATH */}
      <path
        d="M 12 65 C 30 65, 55 10, 100 10 C 145 10, 165 62, 205 62 C 225 62, 238 48, 248 38 C 243 45, 230 68, 205 68 C 160 68, 140 18, 100 18 C 60 18, 35 65, 12 65 Z"
        fill="url(#logo-ribbon-grad)"
      />

      {/* 2. THE DIGITAL NODES / SLANTED COMPUTE ARRAY */}
      <line x1="172" y1="58" x2="188" y2="30" stroke="url(#logo-node-grad)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="191" cy="24" r="3.5" fill="url(#logo-dot-grad)" />

      <line x1="182" y1="58" x2="198" y2="30" stroke="url(#logo-node-grad)" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <circle cx="201" cy="24" r="3.5" fill="url(#logo-dot-grad)" />

      <line x1="192" y1="58" x2="212" y2="24" stroke="url(#logo-node-grad)" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="215" cy="18" r="4" fill="url(#logo-dot-grad)" />

      <line x1="202" y1="58" x2="224" y2="20" stroke="url(#logo-node-grad)" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="228" cy="13" r="4.5" fill="url(#logo-dot-grad)" />

      <line x1="212" y1="58" x2="236" y2="16" stroke="url(#logo-node-grad)" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="241" cy="9" r="4.5" fill="url(#logo-dot-grad)" />

      {/* Decorative float dots around the node tips */}
      <circle cx="180" cy="16" r="3" fill="#2563EB" opacity="0.9" />
      <circle cx="195" cy="10" r="3.5" fill="#06B6D4" opacity="0.95" />
      <circle cx="210" cy="5" r="3" fill="#0284C7" opacity="0.9" />

      <circle cx="225" cy="24" r="3" fill="#06B6D4" opacity="0.85" />
      <circle cx="232" cy="30" r="3.5" fill="#2563EB" opacity="0.9" />
      <circle cx="240" cy="21" r="3" fill="#0284C7" opacity="0.8" />
    </svg>
  );
}

export default function Logo({ className = "h-9", showText = false, variant = "adaptive", height = 36, imageUrl, alt = "SaroHub Technologies logo" }: LogoProps) {
  const resolvedImageUrl = imageUrl || '/assets/sarohub-logo.png';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} style={{ height: `${height}px` }}>
      <img
        src={resolvedImageUrl}
        alt={alt}
        className="h-full w-auto object-contain"
        style={{ maxHeight: `${height}px` }}
      />
    </div>
  );
}

