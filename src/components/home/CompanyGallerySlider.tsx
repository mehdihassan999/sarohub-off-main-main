import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, MapPin, Calendar, ExternalLink, ZoomIn, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { CompanyGalleryItem } from '../../types';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface CompanyGallerySliderProps {
  title?: string;
  subtitle?: string;
  showViewAllLink?: boolean;
}

export const CompanyGallerySlider: React.FC<CompanyGallerySliderProps> = ({
  title = "Moments & Life at SaroHub",
  subtitle = "Keynote seminars, regional IT collaborations, engineering hackathons, and academy masterclasses.",
  showViewAllLink = true
}) => {
  const [items, setItems] = useState<CompanyGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayDuration = 5500;

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      const data = await api.getCompanyGallery();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data.filter(i => i.published !== false));
      }
    } catch (err) {
      console.error('Failed to load gallery items for slider:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (items.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    if (items.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (!isPlaying || items.length <= 1 || lightboxOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayDuration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, items.length, lightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, lightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStart(null);
  };

  if (loading || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section id="gallery-slider-section" className="py-14 lg:py-20 border-b border-white/[0.08] bg-[#08090E] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Life &amp; Ecosystem Impact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white">
              Moments &amp; Life <span className="italic text-[#FF5C00]">at SaroHub</span>
            </h2>
          </div>

          {showViewAllLink && (
            <Link
              to="/gallery"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-xs font-mono uppercase tracking-wider text-white rounded-full hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] transition-all duration-300 shrink-0 border border-[#FFA566]/30 font-semibold"
            >
              <RollText>{`EXPLORE GALLERY (${items.length})`}</RollText>
              <DiagonalArrow size={16} />
            </Link>
          )}
        </div>

        {/* Clean Stage Container */}
        <div 
          className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] min-h-[360px] max-h-[540px] rounded-3xl overflow-hidden bg-[#0E121E] border border-white/[0.08] select-none group shadow-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={currentItem.image_url}
                alt={currentItem.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Minimal Bottom Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Category Tag */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase bg-black/80 text-[#FF7A1A] border border-[#FF5C00]/30 font-bold backdrop-blur-md shadow-xs">
                  {currentItem.category}
                </span>
              </div>

              {/* Zoom Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-black/80 text-white hover:bg-[#FF5C00] hover:text-white transition-all cursor-pointer border border-white/10 backdrop-blur-md shadow-xs"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              {/* Bottom Caption & Title */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 pointer-events-none">
                <div className="max-w-3xl space-y-1.5">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 uppercase font-semibold">
                    {currentItem.event_date && (
                      <span className="flex items-center gap-1.5 text-[#FF7A1A]">
                        <Calendar className="h-3.5 w-3.5 text-[#FF5C00]" />
                        {currentItem.event_date}
                      </span>
                    )}
                    {currentItem.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#FF5C00]" />
                        {currentItem.location}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    {currentItem.title}
                  </h3>
                  {(currentItem.description || currentItem.caption) && (
                    <p className="text-sm text-slate-300 line-clamp-2 font-normal">
                      {currentItem.description || currentItem.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Circular Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-black/80 text-white hover:bg-[#FF5C00] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-white/15 backdrop-blur-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-black/80 text-white hover:bg-[#FF5C00] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-white/15 backdrop-blur-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-[#FF5C00] hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="h-6 w-6" />
          </button>

          <div 
            className="max-w-4xl max-h-[85vh] bg-[#0E121E] border border-white/[0.12] rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.image_url}
              alt={currentItem.title}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain mx-auto"
            />
            <div className="pt-4 px-2 flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
              <span className="text-white font-medium">{currentItem.title}</span>
              <a
                href={currentItem.image_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#FF7A1A] hover:text-[#FFA566] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Full Resolution</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
