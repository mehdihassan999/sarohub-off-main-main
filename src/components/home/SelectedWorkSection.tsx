import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, ArrowRight, 
  ExternalLink, Layers, Sparkles, CheckCircle2,
  Smartphone, Hotel, ShoppingBag, Compass, HeartHandshake, Building2, Monitor, TrendingUp
} from 'lucide-react';
import { getAllClientProjects } from '../../data/clientProjectsData';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

// Helper to determine the iconic Apple-style symbol for each project
const getProjectIcon = (p: any) => {
  const text = `${p.title || ''} ${p.category || ''} ${p.industry || ''} ${p.client_name || ''} ${p.slug || ''}`.toLowerCase();
  if (text.includes('mobile') || text.includes('phone') || text.includes('waziri') || text.includes('app')) return Smartphone;
  if (text.includes('crescent') || text.includes('hotel') || text.includes('resort') || text.includes('hospitality')) return Hotel;
  if (text.includes('vg4') || text.includes('store') || text.includes('retail') || text.includes('pos') || text.includes('shop') || text.includes('super')) return ShoppingBag;
  if (text.includes('askoli') || text.includes('adventure') || text.includes('tour') || text.includes('trek') || text.includes('expedition') || text.includes('mountain')) return Compass;
  if (text.includes('bsw') || text.includes('foundation') || text.includes('welfare') || text.includes('ngo') || text.includes('education') || text.includes('social')) return HeartHandshake;
  if (text.includes('diamond') || text.includes('architect') || text.includes('building') || text.includes('interior') || text.includes('structural')) return Building2;
  if (text.includes('marketing') || text.includes('growth') || text.includes('seo') || text.includes('analytics') || text.includes('apex')) return TrendingUp;
  return Monitor;
};

interface SelectedWorkSectionProps {
  projects?: any[];
}

export default function SelectedWorkSection({ projects = [] }: SelectedWorkSectionProps) {
  // Merge incoming projects with rich client projects
  const allProjects = useMemo(() => {
    const fallbackList = getAllClientProjects();
    if (!projects || projects.length === 0) {
      return fallbackList.map(f => {
        const fallbackImg = f.thumbnail_url || (Array.isArray(f.screenshots) && f.screenshots[0]) || '/assets/hero-platform-preview.svg';
        return {
          ...f,
          image: fallbackImg,
          thumbnail_url: fallbackImg
        };
      });
    }
    
    const sorted = [...projects].sort((a, b) => {
      const orderA = Number(a.order) || 999;
      const orderB = Number(b.order) || 999;
      if (orderA !== orderB) return orderA - orderB;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    return sorted.map((p) => {
      const matched = fallbackList.find(
        (f) => (p.slug && f.slug === p.slug) || (p.title && f.title.toLowerCase() === (p.title || '').toLowerCase())
      );

      // Extract admin panel project images (highest priority)
      const adminImage = 
        (typeof p.thumbnail_url === 'string' && p.thumbnail_url.trim().length > 0 && p.thumbnail_url.trim()) ||
        (Array.isArray(p.screenshots) && p.screenshots.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
        (Array.isArray(p.gallery) && p.gallery.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
        (typeof p.image === 'string' && p.image.trim().length > 0 && p.image.trim()) ||
        (typeof p.image_url === 'string' && p.image_url.trim().length > 0 && p.image_url.trim());

      const fallbackImage = 
        matched?.thumbnail_url || 
        (Array.isArray(matched?.screenshots) && matched?.screenshots[0]) || 
        (matched as any)?.image;

      const resolvedImage = adminImage || fallbackImage || '/assets/hero-platform-preview.svg';

      if (matched) {
        return {
          ...matched,
          ...p,
          what_we_solved: p.what_we_solved || p.case_study || matched.what_we_solved,
          industry: p.industry || matched.industry,
          project_type: p.project_type || matched.project_type,
          status: p.status || matched.status || 'Delivered',
          image: resolvedImage,
          thumbnail_url: resolvedImage,
          image_url: resolvedImage,
          screenshots: (Array.isArray(p.screenshots) && p.screenshots.length > 0) ? p.screenshots : matched.screenshots
        };
      }
      return {
        ...p,
        status: p.status || 'Delivered',
        what_we_solved: p.what_we_solved || p.case_study || 'Custom engineering delivering measurable business impact.',
        image: resolvedImage,
        thumbnail_url: resolvedImage,
        image_url: resolvedImage,
        screenshots: (Array.isArray(p.screenshots) && p.screenshots.length > 0) ? p.screenshots : [resolvedImage]
      };
    });
  }, [projects]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = allProjects.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Apple-style auto-rotation timer
  useEffect(() => {
    if (!isPlaying || isHovered || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, currentIndex, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  const activeProject = allProjects[currentIndex] || allProjects[0];

  return (
    <section 
      id="selected-work" 
      className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 pb-6 border-b border-gray-200">
          <div>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block mb-2">
              Portfolio &amp; Client Deployments
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-2">
              Selected <span className="italic">Work</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-normal">
              Real projects. Real problems. Technology built to solve them.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/work"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-black text-sm font-semibold -tracking-[0.2px] text-white rounded-full hover:bg-gray-800 transition-all duration-300 shrink-0 shadow-xs"
            >
              <RollText>VIEW ALL WORK</RollText>
              <DiagonalArrow size={18} />
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* IPHONE-STYLE CAROUSEL MAIN STAGE */}
        {/* ======================================================== */}
        <div className="relative" ref={containerRef}>
          
          {/* Main Showcase Slide with Smooth Apple-style cross-transition */}
          <div className="relative min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject?.id || currentIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 h-full flex-1"
              >
                {/* Left Information Pane */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10">
                  <div>
                    {/* Category & Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {activeProject.client_name && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-800 font-semibold">
                          Client: {activeProject.client_name}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black text-white font-semibold">
                        {activeProject.industry || activeProject.category || activeProject.project_type || 'Software System'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#FBFBFB] border border-gray-200 text-gray-700 font-semibold">
                        {activeProject.status || 'Delivered'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold -tracking-[1px] text-black mb-3 leading-tight">
                      <Link 
                        to={`/work/${activeProject.slug || activeProject.id}`}
                        className="hover:text-gray-600 transition-colors"
                      >
                        {activeProject.title}
                      </Link>
                    </h3>

                    {/* Problem Solved / Project Summary */}
                    <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed mb-5">
                      {activeProject.short_description || activeProject.what_we_solved || (typeof activeProject.overview === 'string' ? activeProject.overview : activeProject.overview?.what_sarohub_built) || activeProject.description}
                    </p>

                    {/* Tech Stack Pills */}
                    {(() => {
                      const raw = activeProject.technologies || activeProject.technology || [];
                      const arr = Array.isArray(raw) ? raw : (raw?.tags || (typeof raw === 'string' ? raw.split(',') : []));
                      return arr.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {arr.slice(0, 5).map((tech: string, i: number) => (
                            <span key={i} className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-[#FBFBFB] border border-gray-200 text-gray-800">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* CTA Link */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/work/${activeProject.slug || activeProject.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all shadow-xs font-semibold"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="size-3.5" />
                    </Link>

                    {activeProject.live_url && (
                      <a
                        href={activeProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-black uppercase tracking-wider transition-colors"
                      >
                        <span>Live Preview</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Device / App Preview Canvas */}
                <div className="lg:col-span-7 bg-[#F5F5F7] p-6 sm:p-10 lg:p-12 flex items-center justify-center relative overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-200">
                  <div className="w-full max-w-2xl relative group">
                    {/* iPhone / Display Bezel Frame */}
                    <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-300 shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
                      {/* Browser / Device Header Bar */}
                      <div className="px-4 py-3 bg-[#EAEAEA] border-b border-gray-300 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-rose-400"></span>
                          <span className="size-2.5 rounded-full bg-amber-400"></span>
                          <span className="size-2.5 rounded-full bg-emerald-400"></span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500 truncate max-w-[200px]">
                          sarohub.com/work/{activeProject.slug || activeProject.id}
                        </span>
                        <div className="size-2.5"></div>
                      </div>

                      {/* Screen Image */}
                      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                        <img
                          src={activeProject.thumbnail_url || activeProject.image || '/assets/hero-platform-preview.svg'}
                          alt={activeProject.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ======================================================== */}
          {/* APPLE-STYLE FLOATING ICON CAROUSEL DOCK BAR */}
          {/* ======================================================== */}
          <div className="mt-8 flex flex-col items-center gap-4">
            
            {/* Centered Apple-style Floating Dock with Project Category Icons */}
            <div className="w-full max-w-4xl mx-auto p-2 sm:p-2.5 rounded-3xl sm:rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              
              {/* Previous Slide Button */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous project"
                className="size-9 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center text-gray-700 transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                <ChevronLeft className="size-4" />
              </button>

              {/* Apple-style Project Icon Switcher Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center overflow-x-auto py-1 scrollbar-none px-1">
                {allProjects.map((proj, idx) => {
                  const isActive = idx === currentIndex;
                  const IconComp = getProjectIcon(proj);
                  const shortName = proj.client_name || proj.title.split(' ')[0] || proj.title;

                  return (
                    <button
                      key={proj.id || idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`View ${proj.title}`}
                      title={`${proj.title} • ${proj.industry || 'Deployment'}`}
                      className={`group relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-black text-white shadow-md ring-2 ring-black/10'
                          : 'text-gray-600 hover:text-black hover:bg-gray-100/90'
                      }`}
                    >
                      <div className={`size-6 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'text-gray-600 group-hover:text-black'
                      }`}>
                        <IconComp className="size-3.5" />
                      </div>

                      <span className={`text-xs whitespace-nowrap transition-colors hidden sm:inline-block ${
                        isActive ? 'font-bold text-white' : 'font-medium text-gray-700'
                      }`}>
                        {shortName}
                      </span>

                      {/* Active indicator dot on mobile */}
                      {isActive && (
                        <span className="size-1.5 rounded-full bg-blue-400 sm:hidden animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Play/Pause & Next Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
                  className="size-9 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center text-gray-700 transition-all cursor-pointer shadow-2xs"
                  title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
                >
                  {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next project"
                  className="size-9 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center text-gray-700 transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

            </div>

            {/* Apple-style Progress Counter & Positioning */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 font-mono text-xs text-gray-500">
              <span className="text-black font-bold">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-gray-300">/</span>
              <span>{String(total).padStart(2, '0')} Projects</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-700 font-sans font-medium text-xs sm:text-sm truncate max-w-[260px] sm:max-w-none">
                {activeProject.title} ({activeProject.industry || 'Deployment'})
              </span>
            </div>

          </div>

          {/* ======================================================== */}
          {/* HORIZONTAL IPHONE MINI THUMBNAIL TRACK WITH ICONS */}
          {/* ======================================================== */}
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory">
            {allProjects.map((p, idx) => {
              const isSelected = idx === currentIndex;
              const IconComp = getProjectIcon(p);

              return (
                <button
                  key={p.id || idx}
                  onClick={() => goToSlide(idx)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-300 shrink-0 w-64 sm:w-72 snap-start cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-black shadow-lg ring-1 ring-black'
                      : 'bg-white/80 border-gray-200 hover:border-gray-400 hover:bg-white shadow-2xs'
                  }`}
                >
                  <div className="size-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                    <img 
                      src={p.thumbnail_url || p.image || '/assets/hero-platform-preview.svg'} 
                      alt={p.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 size-5 rounded-md bg-black/80 backdrop-blur-xs text-white flex items-center justify-center shadow-xs">
                      <IconComp className="size-3" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-500 uppercase tracking-wider truncate">
                      <span>{p.industry || 'Case Study'}</span>
                    </div>
                    <div className="text-xs font-semibold text-black truncate mt-0.5">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">
                      {p.status || 'Delivered'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
