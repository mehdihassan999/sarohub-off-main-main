import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../../types';
import { api } from '../../api';

interface TestimonialsProps {
  testimonials?: any[];
}

export default function ClientTestimonials({ testimonials }: TestimonialsProps) {
  const [items, setItems] = useState<Testimonial[]>(
    Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchTestimonials = async () => {
    try {
      const data = await api.getTestimonials();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    }
  };

  useEffect(() => {
    if (Array.isArray(testimonials) && testimonials.length > 0) {
      setItems(testimonials);
    } else {
      fetchTestimonials();
    }
  }, [testimonials]);

  useEffect(() => {
    const handleDataUpdated = () => {
      fetchTestimonials();
    };
    window.addEventListener('sarohub-data-updated', handleDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', handleDataUpdated);
  }, []);

  const displayList: Testimonial[] = items.length > 0 ? items : [
    {
      id: '1',
      client_name: 'Dr. Zulfiqar Ali',
      client_role: 'Founder & CEO',
      client_company: 'Alin316 EdTech',
      feedback: 'SaroHub delivered our multi-campus academic management system with exceptional architecture. Their product-first thinking saved us months of rework.',
      rating: 5,
    },
    {
      id: '2',
      client_name: 'Sarah Jenkins',
      client_role: 'VP of Product',
      client_company: 'Vanguard Logistics',
      feedback: 'The team at SaroHub transformed our legacy tracking infrastructure into a real-time reactive web application. Delivery was prompt and communication impeccable.',
      rating: 5,
    },
    {
      id: '3',
      client_name: 'Ahmad Hassan',
      client_role: 'Managing Partner',
      client_company: 'North Agency Group',
      feedback: 'Working with SaroHub on white-label client engagements has been seamless. They provide enterprise-grade code under strict NDAs.',
      rating: 5,
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
  };

  const currentItem = displayList[currentIndex] || displayList[0];

  return (
    <section id="testimonials" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Column: Title & Controls */}
          <div className="w-full lg:w-5/12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-3 leading-tight">
              Our Client <span className="italic text-[#FF5C00]">Reviews</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6 font-normal">
              Read verbatim accounts from founders, enterprise directors, and technical leaders who partnered with SaroHub to bring their vision to market.
            </p>

            {/* Circular Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="size-11 border border-white/20 rounded-full inline-flex items-center justify-center text-slate-300 hover:text-white hover:border-[#FF5C00] hover:bg-[#FF5C00]/10 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="size-11 border border-white/20 rounded-full inline-flex items-center justify-center text-slate-300 hover:text-white hover:border-[#FF5C00] hover:bg-[#FF5C00]/10 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="font-mono text-xs text-slate-400 font-semibold ml-2">
                {`${currentIndex + 1} / ${displayList.length}`}
              </span>
            </div>
          </div>

          {/* Right Column: Active Card */}
          <div className="w-full lg:w-7/12">
            <div className="relative min-h-[300px] p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0E121E] shadow-2xl flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id || currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-col justify-between h-full"
                >
                  <div>
                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-1 mb-5 text-[#FF5C00]">
                      {[...Array(currentItem.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FF5C00] text-[#FF5C00]" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <blockquote className="text-lg sm:text-xl font-normal text-white leading-relaxed italic mb-6">
                      &ldquo;{currentItem.feedback}&rdquo;
                    </blockquote>
                  </div>

                  {/* Author Meta */}
                  <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {currentItem.client_name}
                      </h4>
                      <p className="text-xs font-mono text-[#FF7A1A] uppercase tracking-wider mt-0.5 font-medium">
                        {currentItem.client_role} &bull; {currentItem.client_company}
                      </p>
                    </div>
                    {(currentItem as any).verified && (
                      <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                        Verified Review
                      </span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
