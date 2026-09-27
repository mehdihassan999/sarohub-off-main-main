import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';

interface SaroRobotMascotProps {
  className?: string;
  showBubble?: boolean;
}

const ROBOT_PHRASES = [
  "Where Ideas Become Technology.",
  "Software & Research Organization",
  "From Gilgit-Baltistan to the World.",
  "Custom Software & Scalable Ventures",
  "Research + Technology + Innovation",
  "We don't just adopt tech. We create it."
];

export default function SaroRobotMascot({
  className = '',
  showBubble = true
}: SaroRobotMascotProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate speech bubble dialogue smoothly every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROBOT_PHRASES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Subtle interactive parallax / tilt following the cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);
      setMouseOffset({
        x: Math.max(-12, Math.min(12, dx * 12)),
        y: Math.max(-10, Math.min(10, dy * 10))
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNextPhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % ROBOT_PHRASES.length);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 1. ELEGANT CYBER BADGE ON TOP OF ROBOT */}
      {showBubble && (
        <div className="relative z-30 mb-3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIndex}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={handleNextPhrase}
              className="group cursor-pointer inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 border border-gray-200/90 shadow-sm backdrop-blur-md hover:border-cyan-400/60 hover:shadow-md transition-all duration-200"
              title="Click to cycle message"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-xs font-semibold text-gray-900 tracking-tight font-sans whitespace-nowrap">
                {ROBOT_PHRASES[phraseIndex]}
              </span>
              <RefreshCw className="size-3 text-gray-400 group-hover:text-cyan-600 transition-transform group-hover:rotate-180 duration-500" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* 2. THE 3D ROBOT CONTAINER WITH COSMIC LIGHTING & ORBITS */}
      <div className="relative flex items-center justify-center w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[450px]">
        
        {/* Ambient Radial Glowing Orbs behind the robot */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full pointer-events-none -z-10"
          style={{
            width: '75%',
            paddingBottom: '75%',
            top: '12%',
            left: '12.5%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(56, 189, 248, 0.18) 45%, transparent 75%)',
            filter: 'blur(50px)'
          }}
        />
        <motion.div
          animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute rounded-full pointer-events-none -z-10"
          style={{
            width: '55%',
            paddingBottom: '55%',
            top: '22%',
            left: '22.5%',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
            filter: 'blur(35px)'
          }}
        />

        {/* Clockwise Orbital Ring with glowing satellite orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute pointer-events-none -z-10"
          style={{ width: '88%', paddingBottom: '88%', top: '6%', left: '6%' }}
        >
          <div className="absolute rounded-full inset-0 border border-indigo-400/20" />
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/60"
            style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </motion.div>

        {/* Counter-Clockwise Dashed Orbital Ring with cyan orb */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute pointer-events-none -z-10"
          style={{ width: '102%', paddingBottom: '102%', top: '-1%', left: '-1%' }}
        >
          <div className="absolute rounded-full inset-0 border border-dashed border-cyan-400/15" />
          <div
            className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50"
            style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}
          />
        </motion.div>

        {/* Floating Robot Body using exact sarohub.com hero-robot asset */}
        <motion.div
          animate={{
            y: [0, -14, 0],
            rotateZ: [0, 1.2, 0, -1.2, 0]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`
          }}
          className="relative z-10 w-full flex flex-col items-center transition-transform duration-200 ease-out cursor-pointer"
          onClick={handleNextPhrase}
        >
          {/* Ground Contact Shadow that expands/contracts with vertical hover */}
          <motion.div
            animate={{ scaleX: [1, 0.85, 1], opacity: [0.35, 0.18, 0.35] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '58%',
              height: 18,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.35) 0%, transparent 70%)',
              filter: 'blur(8px)'
            }}
          />

          {/* High-Resolution SaroHub 3D Robot Image */}
          <img
            src="/assets/hero-robot.png"
            alt="SAROHUB — AI & Research Robot Mascot"
            className="w-full h-auto object-contain max-h-[360px] sm:max-h-[420px] lg:max-h-[460px] transition-transform duration-300 hover:scale-[1.02]"
            style={{
              filter: 'drop-shadow(0 15px 30px rgba(99, 102, 241, 0.28)) drop-shadow(0 0 50px rgba(56, 189, 248, 0.15))'
            }}
            loading="eager"
          />

          {/* Visor Glint Effect */}
          <motion.div
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute pointer-events-none"
            style={{
              top: '18%',
              left: '30%',
              width: '40%',
              height: '15%',
              background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
              filter: 'blur(10px)'
            }}
          />
        </motion.div>

        {/* 3. FLOATING GLASSMORPHIC STAT BADGE: Top Right */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-2 sm:-right-4 px-3.5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-xl hidden sm:flex items-center gap-2.5 z-20"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Venture
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-black">
              Building
            </p>
          </div>
        </motion.div>

        {/* 4. FLOATING GLASSMORPHIC STAT BADGE: Bottom Left */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-2 -left-2 sm:-left-4 px-3.5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-xl hidden sm:flex items-center gap-2.5 z-20"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Technology
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-black">
              Partnerships
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
