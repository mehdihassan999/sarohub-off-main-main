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
    <section id="gallery-slider-section" className="py-12 lg:py-16 border-b border-gray-200 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 pb-6 border-b border-gray-100">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Life &amp; Ecosystem Impact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black">
              Moments &amp; Life <span className="italic">at SaroHub</span>
            </h2>
          </div>

          {showViewAllLink && (
            <Link
              to="/gallery"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-black text-sm font-semibold -tracking-[0.2px] text-white rounded-full hover:bg-gray-800 transition-all duration-300 shrink-0 shadow-xs"
            >
              <RollText>{`EXPLORE GALLERY (${items.length})`}</RollText>
              <DiagonalArrow size={18} />
            </Link>
          )}
        </div>

        {/* NexStudio Clean Stage Container */}
        <div 
          className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] min-h-[360px] max-h-[540px] rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 select-none group shadow-xs"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Category Tag */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase bg-white/95 text-black font-semibold shadow-xs">
                  {currentItem.category}
                </span>
              </div>

              {/* Zoom Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-white/95 text-black hover:bg-black hover:text-white transition-all cursor-pointer shadow-xs"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              {/* Bottom Caption & Title */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 pointer-events-none">
                <div className="max-w-3xl space-y-1.5">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-200 uppercase font-semibold">
                    {currentItem.event_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {currentItem.event_date}
                      </span>
                    )}
                    {currentItem.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {currentItem.location}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    {currentItem.title}
                  </h3>
                  {(currentItem.description || currentItem.caption) && (
                    <p className="text-sm text-gray-200 line-clamp-2 font-normal">
                      {currentItem.description || currentItem.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* NexStudio Circular Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-white/90 text-black hover:bg-black hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-white/90 text-black hover:bg-black hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
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
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          <div 
            className="max-w-4xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.image_url}
              alt={currentItem.title}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain mx-auto"
            />
            <div className="pt-4 px-2 flex justify-between items-center text-xs font-mono text-gray-500 uppercase">
              <span>{currentItem.title}</span>
              <a
                href={currentItem.image_url}
                target="_blank"
                rel="noreferrer"
                className="text-black font-semibold hover:underline flex items-center gap-1"
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
