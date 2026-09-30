import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'adaptive';
  height?: number;
  imageUrl?: string;
  alt?: string;
}

export function LogoIcon({ className = "h-10", height = 40 }: { className?: string; height?: number }) {
  const width = Math.round(height * 3.125); // 1000:320 ratio

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1000 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 select-none ${className}`}
    >
      <defs>
        {/* Letter-specific refined gradients matching exact visual balance of official logo */}
        <linearGradient id="logo-grad-s" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="50%" stopColor="#FFA800" />
          <stop offset="100%" stopColor="#FF5500" />
        </linearGradient>

        <linearGradient id="logo-grad-a" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="45%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#FF3300" />
        </linearGradient>

        <linearGradient id="logo-grad-power" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="100%" stopColor="#FF5500" />
        </linearGradient>

        <linearGradient id="logo-grad-r" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF5A00" />
        </linearGradient>

        <linearGradient id="logo-grad-o" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="50%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#FF3300" />
        </linearGradient>

        <linearGradient id="logo-grad-monogram" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="35%" stopColor="#FF8A00" />
          <stop offset="70%" stopColor="#FF4000" />
          <stop offset="100%" stopColor="#D61800" />
        </linearGradient>
      </defs>

      {/* GLYPH 1: 's' (Thin Geometric Split-Arc with Center Divider) */}
      <g id="logo-glyph-s" stroke="url(#logo-grad-s)" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Top Arc ending downward */}
        <path d="M 45 165 C 45 100, 95 90, 130 90 C 175 90, 215 110, 215 155" />
        {/* Center Dividing Bar */}
        <line x1="45" y1="165" x2="195" y2="165" />
        {/* Bottom Arc starting with rounded end */}
        <path d="M 25 175 C 25 220, 65 240, 110 240 C 155 240, 195 215, 195 165" />
      </g>

      {/* GLYPH 2: 'a' (Power-Button Ring & Descending Stem) */}
      <g id="logo-glyph-a" stroke="url(#logo-grad-a)" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Power Button Outer Circular Ring with Top Open Gap */}
        <path d="M 295 98 A 75 75 0 1 0 355 98" />
        {/* Center Power Switch Bar / Rod */}
        <line x1="325" y1="35" x2="325" y2="125" stroke="url(#logo-grad-power)" strokeWidth="11.5" />
        {/* Right Descending Stem */}
        <line x1="400" y1="90" x2="400" y2="240" strokeWidth="10.5" />
      </g>

      {/* GLYPH 3: 'r' (Vertical Stem + Smooth Arch) */}
      <g id="logo-glyph-r" stroke="url(#logo-grad-r)" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Stem */}
        <line x1="455" y1="90" x2="455" y2="240" />
        {/* Arch Curve */}
        <path d="M 455 145 C 455 100, 495 90, 550 90 C 568 90, 580 96, 585 115" />
      </g>

      {/* GLYPH 4: 'o' (Pristine Geometric Ring) */}
      <g id="logo-glyph-o" stroke="url(#logo-grad-o)" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="680" cy="165" r="75" />
      </g>

      {/* GLYPH 5: 'b' / Monogram Emblem */}
      <g id="logo-glyph-monogram">
        {/* 1. Upper-left 45-deg angled yellow lightning diagonal */}
        <line x1="690" y1="25" x2="765" y2="100" stroke="#FFE600" strokeWidth="10.5" strokeLinecap="round" />
        
        {/* 2. Upper curved loop forming the top bowl of 'b' */}
        <path d="M 765 100 C 765 45, 815 15, 868 35 C 895 45, 908 72, 908 100" 
              stroke="#FF9500" strokeWidth="10.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              
        {/* 3. Interlocking solid facet triangle/polygon prism */}
        <polygon points="780,145 895,65 895,178" fill="url(#logo-grad-monogram)" />

        {/* 4. Lower-right diagonal kick leg */}
        <line x1="825" y1="185" x2="900" y2="260" stroke="#E62800" strokeWidth="10.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "h-9",
  showText = false,
  variant = "adaptive",
  height = 36,
  imageUrl,
  alt = "SaroHub Technologies logo"
}: LogoProps) {
  const getGlobalLogo = (): string => {
    if (typeof window !== 'undefined' && (window as any).__SAROHUB_LOGO__) {
      return (window as any).__SAROHUB_LOGO__;
    }
    return '';
  };

  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    return imageUrl || getGlobalLogo() || '/assets/sarohub-logo.png';
  });
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
    if (imageUrl) {
      setCurrentSrc(imageUrl);
      return;
    }
    const globalLogo = getGlobalLogo();
    if (globalLogo) {
      setCurrentSrc(globalLogo);
    }
    const handleUpdate = () => {
      const updated = getGlobalLogo();
      if (updated) {
        setCurrentSrc(updated);
        setLoadError(false);
      }
    };
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleUpdate);
  }, [imageUrl]);

  // Determine if this is a custom uploaded image (e.g. from /uploads/ or an external url)
  const isCustomUploadedImage = Boolean(
    currentSrc && 
    !currentSrc.includes('/assets/sarohub-logo') && 
    !currentSrc.endsWith('sarohub-logo.png') && 
    !currentSrc.endsWith('sarohub-logo.svg')
  );

  // If load error or default official logo is requested, render pristine vector SVG directly
  if (loadError || !isCustomUploadedImage) {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`} style={{ height: `${height}px` }}>
        <LogoIcon height={height} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} style={{ height: `${height}px` }}>
      <img
        src={currentSrc}
        alt={alt}
        className="h-full w-auto object-contain max-w-[240px]"
        style={{ maxHeight: `${height}px` }}
        onError={() => {
          setLoadError(true);
        }}
      />
    </div>
  );
}
