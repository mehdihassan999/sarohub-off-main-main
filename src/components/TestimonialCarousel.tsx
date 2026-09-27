import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialCarouselProps {
  items: Testimonial[];
}

export default function TestimonialCarousel({ items }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, items.length]);

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const currentItem = items[currentIndex];

  if (!items || items.length === 0) return null;

  // Variants for sliding animation
  const slideVariants = {
    initial: (dir: 'left' | 'right') => ({
      opacity: 0,
      x: dir === 'right' ? 80 : -80,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.3 },
      }
    },
    exit: (dir: 'left' | 'right') => ({
      opacity: 0,
      x: dir === 'right' ? -80 : 80,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.2 },
      }
    })
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden min-h-[300px] flex items-center justify-center py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full border rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm premium-card-hover"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-app)' 
            }}
          >
            {/* Soft decorative blur orbs inside Card */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none"></div>

            {/* Quote Icon Background */}
            <div className="absolute top-8 right-8 text-blue-500/10">
              <Quote className="h-16 w-16 stroke-[1.5]" />
            </div>

            <div className="relative z-10 flex flex-col gap-6 md:gap-8">
              {/* Rating Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < currentItem.rating 
                        ? 'fill-amber-400 text-amber-400 animate-pulse-slow' 
                        : 'text-slate-600'
                    }`} 
                  />
                ))}
              </div>

              {/* Feedback Text */}
              <blockquote 
                className="text-base sm:text-lg md:text-xl font-normal leading-relaxed tracking-wide italic"
                style={{ color: 'var(--text-main)' }}
              >
                "{currentItem.feedback}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-2">
                <div className="relative shrink-0">
                  <img 
                    src={currentItem.client_avatar} 
                    alt={currentItem.client_name} 
                    className="relative h-14 w-14 rounded-full object-cover border-2 shadow-sm"
                    style={{ borderColor: 'var(--border-app)' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <cite className="not-italic font-display text-base font-bold block" style={{ color: 'var(--text-main)' }}>
                    {currentItem.client_name}
                  </cite>
                  <span className="text-xs font-mono tracking-wider uppercase block mt-1.5 font-bold" style={{ color: 'var(--text-muted)' }}>
                    {currentItem.client_role} &bull; <span className="font-normal" style={{ color: 'var(--text-body)' }}>{currentItem.client_company}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {items.length > 1 && (
        <div className="flex justify-between items-center mt-6">
          {/* Bullets Pagination */}
          <div className="flex gap-2.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 'right' : 'left');
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-8 bg-blue-600' 
                    : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Arrows */}
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:border-blue-500/40 hover:bg-white/[0.04]"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-app)',
                color: 'var(--text-body)'
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:border-blue-500/40 hover:bg-white/[0.04]"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-app)',
                color: 'var(--text-body)'
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
