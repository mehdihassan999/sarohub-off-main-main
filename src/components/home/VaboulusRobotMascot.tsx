import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VaboulusRobotMascotProps {
  className?: string;
}

type FlightMode = 'flying' | 'barrel_roll' | 'boost' | 'hover';

export default function VaboulusRobotMascot({ className = '' }: VaboulusRobotMascotProps) {
  const [flightMode, setFlightMode] = useState<FlightMode>('flying');
  const [clickCount, setClickCount] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, z: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showSonicRing, setShowSonicRing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const modeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth mouse tilt parallax in 3D perspective
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: x * 18,
      y: -y * 18,
      z: -x * 6,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, z: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Touch support for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: x * 16,
      y: -y * 16,
      z: -x * 5,
    });
  };

  const handleTouchEnd = () => {
    setTilt({ x: 0, y: 0, z: 0 });
  };

  // Interactive flight trick on click / tap
  const triggerFlightTrick = () => {
    if (modeTimeoutRef.current) {
      clearTimeout(modeTimeoutRef.current);
    }

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    const tricks: FlightMode[] = ['barrel_roll', 'boost'];
    const selectedTrick = tricks[(nextCount - 1) % tricks.length];
    setFlightMode(selectedTrick);
    setShowSonicRing(true);

    const durations: Record<FlightMode, number> = {
      flying: 0,
      hover: 0,
      barrel_roll: 1400,
      boost: 1200,
    };

    modeTimeoutRef.current = setTimeout(() => {
      setFlightMode('flying');
      setShowSonicRing(false);
    }, durations[selectedTrick]);
  };

  useEffect(() => {
    return () => {
      if (modeTimeoutRef.current) clearTimeout(modeTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={triggerFlightTrick}
      className={`relative w-full max-w-[480px] sm:max-w-[520px] aspect-[4/5] flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ perspective: 1200 }}
      title="Click robot to trigger flight tricks"
    >
      {/* 3D TILT STAGE (Follows mouse dynamically) */}
      <motion.div
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) rotateZ(${tilt.z}deg)`,
          transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Soft Rocket Exhaust Ambient Backglow */}
        <div className="absolute bottom-12 right-12 w-48 h-48 bg-gradient-to-t from-[#FF5C00]/25 via-[#FFA043]/15 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

        {/* Supersonic Shockwave Ring emitted on click */}
        <AnimatePresence>
          {showSonicRing && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0.85, rotateX: 65 }}
              animate={{ scale: 2.4, opacity: 0, rotateX: 65 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute bottom-16 w-56 h-56 rounded-full border-2 border-[#FFA043] shadow-[0_0_35px_#FF5C00] pointer-events-none z-0"
            />
          )}
        </AnimatePresence>

        {/* PRIMARY FLYING ROBOT WITH FLUID FLIGHT TRAJECTORY */}
        <motion.div
          animate={
            flightMode === 'barrel_roll'
              ? {
                  rotateY: [0, 360],
                  y: [-20, -55, -12, -20],
                  scale: [1, 1.12, 0.96, 1],
                  rotateZ: [0, 15, -10, 0],
                }
              : flightMode === 'boost'
              ? {
                  y: [-20, -60, -25, -20],
                  x: [0, -15, 10, 0],
                  scale: [1, 1.14, 1.02, 1],
                  rotateZ: [-2, 8, -4, -2],
                }
              : isHovered
              ? {
                  y: [-28, -12, -28],
                  x: [-6, 6, -6],
                  rotateZ: [-3, 5, -3],
                  scale: [1.03, 1.06, 1.03],
                }
              : {
                  y: [-18, 16, -18],
                  x: [-8, 10, -8],
                  rotateZ: [-2, 3.5, -2],
                  scale: [0.99, 1.02, 0.99],
                }
          }
          transition={
            flightMode === 'barrel_roll'
              ? { duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }
              : flightMode === 'boost'
              ? { duration: 1.2, ease: 'easeInOut' }
              : isHovered
              ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 4.6, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto"
        >
          {/* THE ROBOT IMAGE */}
          <img
            src="/assets/hero-robot.png"
            alt="Flying Superhero Robot"
            className="w-full h-full max-h-[520px] sm:max-h-[560px] object-contain transition-all duration-300 filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_20px_50px_rgba(255,92,0,0.45)]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/vaboulus-robot-transparent.png';
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
