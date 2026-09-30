import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Zap, RotateCcw } from 'lucide-react';

interface AnimatedCompanyLogoProps {
  className?: string;
}

export default function AnimatedCompanyLogo({ className = '' }: AnimatedCompanyLogoProps) {
  const [animKey, setAnimKey] = useState(0);
  const [activeGlyph, setActiveGlyph] = useState<string | null>(null);
  const [isGlinting, setIsGlinting] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tilt parallax in 3D perspective
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: x * 16,
      y: -y * 16,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setActiveGlyph(null);
  };

  const replayAnimation = () => {
    setAnimKey((prev) => prev + 1);
    setIsGlinting(true);
    setTimeout(() => setIsGlinting(false), 2400);
  };

  const triggerPowerSurge = () => {
    setIsGlinting(true);
    setTimeout(() => setIsGlinting(false), 1800);
  };

  // Periodic automatic subtle shimmer sweep
  useEffect(() => {
    const timer = setInterval(() => {
      setIsGlinting(true);
      setTimeout(() => setIsGlinting(false), 1600);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[580px] lg:max-w-[620px] flex flex-col items-center justify-center select-none py-4 sm:py-6 ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* 3D TILT CONTAINER */}
      <motion.div
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="w-full flex flex-col items-center justify-center relative"
      >
        {/* Soft Radial Ambient Backglow Behind Logo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFE600]/10 via-[#FF5C00]/18 to-[#FF2A00]/12 blur-3xl rounded-full scale-125 pointer-events-none -z-10" />

        {/* PRIMARY ANIMATED LOGO CANVAS (Dribbble Stroke & Kinetic Assembly Style) */}
        <div 
          key={animKey}
          onClick={replayAnimation}
          className="relative w-full aspect-[1000/340] max-h-[260px] flex items-center justify-center cursor-pointer group"
          title="Click to replay logo drawing & assembly animation"
        >
          <svg
            viewBox="0 0 1000 320"
            className="w-full h-full filter drop-shadow-[0_12px_36px_rgba(255,92,0,0.32)] transition-all duration-300 group-hover:drop-shadow-[0_16px_48px_rgba(255,92,0,0.52)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Official Gradients */}
              <linearGradient id="hero-grad-s" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE600" />
                <stop offset="50%" stopColor="#FFA800" />
                <stop offset="100%" stopColor="#FF5500" />
              </linearGradient>

              <linearGradient id="hero-grad-a" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE600" />
                <stop offset="45%" stopColor="#FF8A00" />
                <stop offset="100%" stopColor="#FF3300" />
              </linearGradient>

              <linearGradient id="hero-grad-r" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE600" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF5A00" />
              </linearGradient>

              <linearGradient id="hero-grad-o" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE600" />
                <stop offset="50%" stopColor="#FF8C00" />
                <stop offset="100%" stopColor="#FF3300" />
              </linearGradient>

              <linearGradient id="hero-grad-monogram" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE600" />
                <stop offset="35%" stopColor="#FF8A00" />
                <stop offset="70%" stopColor="#FF4000" />
                <stop offset="100%" stopColor="#D61800" />
              </linearGradient>
            </defs>

            {/* ========================================================
                GLYPH 1: 's' (Calligraphic Split-Arc Draw-in & Glide)
               ======================================================== */}
            <motion.g
              id="glyph-s"
              onMouseEnter={() => setActiveGlyph('s')}
              onMouseLeave={() => setActiveGlyph(null)}
              animate={{
                y: activeGlyph === 's' ? -8 : [0, -4, 0],
                scale: activeGlyph === 's' ? 1.04 : 1,
              }}
              transition={{
                duration: 3.8,
                repeat: activeGlyph === 's' ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              stroke="url(#hero-grad-s)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Top Arc */}
              <motion.path
                d="M 45 160 C 45 105, 95 90, 135 90 C 175 90, 195 115, 195 155"
                initial={{ pathLength: 0, opacity: 0, x: -20 }}
                animate={{ pathLength: 1, opacity: 1, x: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Center Divider Bar */}
              <motion.line
                x1="45"
                y1="160"
                x2="185"
                y2="160"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
              />
              {/* Bottom Arc */}
              <motion.path
                d="M 25 185 C 25 215, 65 230, 115 230 C 165 230, 185 200, 185 160"
                initial={{ pathLength: 0, opacity: 0, x: -15, y: 15 }}
                animate={{ pathLength: 1, opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.g>

            {/* ========================================================
                GLYPH 2: 'a' (Power-Button Ring & Descending Ignition Rod)
               ======================================================== */}
            <motion.g
              id="glyph-a"
              onMouseEnter={() => setActiveGlyph('a')}
              onMouseLeave={() => setActiveGlyph(null)}
              animate={{
                y: activeGlyph === 'a' ? -8 : [0, 4, 0],
                scale: activeGlyph === 'a' ? 1.04 : 1,
              }}
              transition={{
                duration: 4.2,
                repeat: activeGlyph === 'a' ? 0 : Infinity,
                delay: 0.4,
                ease: 'easeInOut',
              }}
              stroke="url(#hero-grad-a)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Open Circular Ring */}
              <motion.path
                d="M 288 105 A 68 68 0 1 0 342 105"
                initial={{ pathLength: 0, rotate: -45, opacity: 0 }}
                animate={{ pathLength: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.3, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '315px 160px' }}
              />
              {/* Center Power Switch Bar / Key */}
              <motion.line
                x1="315"
                y1="58"
                x2="315"
                y2="132"
                strokeWidth="15"
                initial={{ y1: 20, y2: 94, opacity: 0 }}
                animate={{ y1: 58, y2: 132, opacity: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.85,
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                }}
              />
              {/* Right Vertical Stem */}
              <motion.line
                x1="383"
                y1="92"
                x2="383"
                y2="230"
                strokeWidth="14"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              />

              {/* Glowing Pulse Node on the power switch tip */}
              <motion.circle
                cx="315"
                cy="130"
                r="4.5"
                fill="#FF5C00"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.g>

            {/* ========================================================
                GLYPH 3: 'r' (Smooth Stem & Arched Branch Unfolding)
               ======================================================== */}
            <motion.g
              id="glyph-r"
              onMouseEnter={() => setActiveGlyph('r')}
              onMouseLeave={() => setActiveGlyph(null)}
              animate={{
                y: activeGlyph === 'r' ? -8 : [0, -5, 0],
                scale: activeGlyph === 'r' ? 1.04 : 1,
              }}
              transition={{
                duration: 4.6,
                repeat: activeGlyph === 'r' ? 0 : Infinity,
                delay: 0.7,
                ease: 'easeInOut',
              }}
              stroke="url(#hero-grad-r)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Vertical Stem */}
              <motion.line
                x1="445"
                y1="92"
                x2="445"
                y2="230"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
              />
              {/* Arch Branch */}
              <motion.path
                d="M 445 140 C 445 92, 490 88, 555 92 C 570 93, 580 97, 585 108"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.g>

            {/* ========================================================
                GLYPH 4: 'o' (Continuous 360-Degree Geometric Loop)
               ======================================================== */}
            <motion.g
              id="glyph-o"
              onMouseEnter={() => setActiveGlyph('o')}
              onMouseLeave={() => setActiveGlyph(null)}
              animate={{
                y: activeGlyph === 'o' ? -8 : [0, 5, 0],
                scale: activeGlyph === 'o' ? 1.04 : 1,
              }}
              transition={{
                duration: 4.1,
                repeat: activeGlyph === 'o' ? 0 : Infinity,
                delay: 0.9,
                ease: 'easeInOut',
              }}
              stroke="url(#hero-grad-o)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.circle
                cx="680"
                cy="160"
                r="68"
                initial={{ pathLength: 0, rotate: -90, opacity: 0 }}
                animate={{ pathLength: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.3, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '680px 160px' }}
              />
            </motion.g>

            {/* ========================================================
                GLYPH 5: 'b' / Monogram (Angular Origami Prism Assembly)
               ======================================================== */}
            <motion.g
              id="glyph-monogram"
              onMouseEnter={() => setActiveGlyph('monogram')}
              onMouseLeave={() => setActiveGlyph(null)}
              animate={{
                y: activeGlyph === 'monogram' ? -8 : [0, -4, 0],
                scale: activeGlyph === 'monogram' ? 1.04 : 1,
              }}
              transition={{
                duration: 4.8,
                repeat: activeGlyph === 'monogram' ? 0 : Infinity,
                delay: 1.1,
                ease: 'easeInOut',
              }}
            >
              {/* 1. Yellow Lightning Ray */}
              <motion.line
                x1="685"
                y1="28"
                x2="755"
                y2="98"
                stroke="#FFE600"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, x: -20, y: -20 }}
                animate={{ pathLength: 1, opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 1.1, ease: 'easeOut' }}
              />

              {/* 2. Upper Bowl Curve */}
              <motion.path
                d="M 755 98 C 755 40, 810 18, 860 38 C 885 48, 895 72, 895 98"
                stroke="#FF8A00"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* 3. Solid Prism Triangle Facet */}
              <motion.polygon
                points="768,145 885,65 885,178"
                fill="url(#hero-grad-monogram)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.95,
                  delay: 1.4,
                  type: 'spring',
                  stiffness: 280,
                  damping: 18,
                }}
                style={{ transformOrigin: '820px 130px' }}
              />

              {/* 4. Lower-right Diagonal Kick Leg */}
              <motion.line
                x1="812"
                y1="188"
                x2="890"
                y2="265"
                stroke="#E62800"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0, x: -15, y: -15 }}
                animate={{ pathLength: 1, opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.9, delay: 1.55, ease: 'easeOut' }}
              />
            </motion.g>
          </svg>

          {/* Liquid Light Sweep Overlay */}
          <AnimatePresence>
            {isGlinting && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '200%', opacity: [0, 0.85, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none rounded-2xl"
              />
            )}
          </AnimatePresence>
        </div>

        {/* SUBTITLE: TECHNOLOGIES & VENTURE LAB */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
          className="mt-4 flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#FF5C00]/70" />
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-[0.38em] uppercase text-slate-300">
              T E C H N O L O G I E S
            </span>
            <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#FF5C00]/70" />
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Autonomous Venture & AI Engineering Studio</span>
          </div>
        </motion.div>

        {/* INTERACTIVE CONTROLS BAR (Law firm & Creative Studio Dribbble aesthetic) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-5 flex items-center gap-2 bg-[#0E121E]/80 border border-white/[0.1] rounded-full p-1.5 shadow-xl backdrop-blur-md"
        >
          <button
            type="button"
            onClick={replayAnimation}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
            title="Replay full drawing sequence"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Replay Assembly</span>
          </button>

          <span className="w-[1px] h-3.5 bg-white/[0.12]" />

          <button
            type="button"
            onClick={triggerPowerSurge}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-[#FFA043] hover:text-white hover:bg-[#FF5C00]/20 transition-all cursor-pointer"
            title="Trigger light beam pulse"
          >
            <Zap className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Power Pulse</span>
          </button>
        </motion.div>

        {/* PILLARS MINI-TAGS */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {['Venture Studio', 'AI Ecosystem', 'Enterprise Cloud'].map((pillar, i) => (
            <span
              key={i}
              className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400"
            >
              {pillar}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
