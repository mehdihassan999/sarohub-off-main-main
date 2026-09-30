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
      className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#FF5C00]/5 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest block mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
              Portfolio &amp; Client Deployments
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-2">
              Selected <span className="italic text-[#FF5C00]">Work</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal">
              Real projects. Real problems. Technology built to solve them.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/work"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0 border border-[#FFA566]/30"
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
          
          {/* Main Showcase Slide with Smooth Vaboulus dark glass card */}
          <div className="relative min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] rounded-3xl border border-white/[0.08] bg-[#0E121E] overflow-hidden shadow-2xl flex flex-col justify-between">
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
                        <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF7A1A] font-semibold">
                          Client: {activeProject.client_name}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/10 text-white font-semibold border border-white/10">
                        {activeProject.industry || activeProject.category || activeProject.project_type || 'Software System'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/[0.04] border border-white/10 text-slate-300 font-semibold">
                        {activeProject.status || 'Delivered'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold -tracking-[1px] text-white mb-3 leading-tight">
                      <Link 
                        to={`/work/${activeProject.slug || activeProject.id}`}
                        className="hover:text-[#FF5C00] transition-colors"
                      >
                        {activeProject.title}
                      </Link>
                    </h3>

                    {/* Problem Solved / Project Summary */}
                    <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed mb-5">
                      {activeProject.short_description || activeProject.what_we_solved || (typeof activeProject.overview === 'string' ? activeProject.overview : activeProject.overview?.what_sarohub_built) || activeProject.description}
                    </p>

                    {/* Tech Stack Pills */}
                    {(() => {
                      const raw = activeProject.technologies || activeProject.technology || [];
                      const arr = Array.isArray(raw) ? raw : (raw?.tags || (typeof raw === 'string' ? raw.split(',') : []));
                      return arr.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {arr.slice(0, 5).map((tech: string, i: number) => (
                            <span key={i} className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {/* CTA Link */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <Link
                      to={`/work/${activeProject.slug || activeProject.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] text-xs font-mono uppercase tracking-wider transition-all font-semibold border border-[#FFA566]/30"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="size-3.5" />
                    </Link>

                    {activeProject.live_url && (
                      <a
                        href={activeProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-[#FF5C00] uppercase tracking-wider transition-colors"
                      >
                        <span>Live Preview</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Device / App Preview Canvas */}
                <div className="lg:col-span-7 bg-[#0A0D15] p-6 sm:p-10 lg:p-12 flex items-center justify-center relative overflow-hidden border-t lg:border-t-0 lg:border-l border-white/[0.08]">
                  <div className="w-full max-w-2xl relative group">
                    {/* iPhone / Display Bezel Frame */}
                    <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-[#121624] border border-white/[0.12] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                      {/* Browser / Device Header Bar */}
                      <div className="px-4 py-3 bg-[#181D2E] border-b border-white/[0.08] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-rose-500/80"></span>
                          <span className="size-2.5 rounded-full bg-amber-500/80"></span>
                          <span className="size-2.5 rounded-full bg-emerald-500/80"></span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]">
                          sarohub.com/work/{activeProject.slug || activeProject.id}
                        </span>
                        <div className="size-2.5"></div>
                      </div>

                      {/* Screen Image */}
                      <div className="relative aspect-[16/10] bg-[#0E121E] overflow-hidden">
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
            
            {/* Centered Floating Dock with Project Category Icons */}
            <div className="w-full max-w-4xl mx-auto p-2 sm:p-2.5 rounded-3xl sm:rounded-full bg-[#0E121E]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              
              {/* Previous Slide Button */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous project"
                className="size-9 rounded-full bg-white/[0.06] hover:bg-[#FF5C00] hover:text-white flex items-center justify-center text-slate-300 transition-all cursor-pointer shrink-0 border border-white/[0.08]"
              >
                <ChevronLeft className="size-4" />
              </button>

              {/* Project Icon Switcher Tabs */}
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
                          ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-[0_0_18px_rgba(255,92,0,0.4)] border border-[#FFA566]/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`size-6 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'text-slate-400 group-hover:text-white'
                      }`}>
                        <IconComp className="size-3.5" />
                      </div>

                      <span className={`text-xs whitespace-nowrap transition-colors hidden sm:inline-block ${
                        isActive ? 'font-bold text-white' : 'font-medium text-slate-300'
                      }`}>
                        {shortName}
                      </span>

                      {/* Active indicator dot on mobile */}
                      {isActive && (
                        <span className="size-1.5 rounded-full bg-white sm:hidden animate-pulse" />
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
                  className="size-9 rounded-full bg-white/[0.06] hover:bg-[#FF5C00] hover:text-white flex items-center justify-center text-slate-300 transition-all cursor-pointer border border-white/[0.08]"
                  title={isPlaying ? 'Pause slideshow' : 'Resume slideshow'}
                >
                  {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next project"
                  className="size-9 rounded-full bg-white/[0.06] hover:bg-[#FF5C00] hover:text-white flex items-center justify-center text-slate-300 transition-all cursor-pointer border border-white/[0.08]"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

            </div>

            {/* Apple-style Progress Counter & Positioning */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 font-mono text-xs text-slate-400">
              <span className="text-[#FF5C00] font-bold">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-white/20">/</span>
              <span>{String(total).padStart(2, '0')} Projects</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-300 font-sans font-medium text-xs sm:text-sm truncate max-w-[260px] sm:max-w-none">
                {activeProject.title} ({activeProject.industry || 'Deployment'})
              </span>
            </div>

          </div>

          {/* ======================================================== */}
          {/* HORIZONTAL MINI THUMBNAIL TRACK WITH ICONS */}
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
                      ? 'bg-[#141828] border-[#FF5C00]/60 shadow-[0_0_20px_rgba(255,92,0,0.2)]'
                      : 'bg-[#0E121E]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#121624]'
                  }`}
                >
                  <div className="size-14 rounded-xl overflow-hidden bg-[#181D2E] border border-white/10 shrink-0 relative">
                    <img 
                      src={p.thumbnail_url || p.image || '/assets/hero-platform-preview.svg'} 
                      alt={p.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 size-5 rounded-md bg-[#08090E]/90 backdrop-blur-xs text-white flex items-center justify-center border border-white/10 shadow-xs">
                      <IconComp className="size-3 text-[#FF5C00]" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#FF7A1A] uppercase tracking-wider truncate">
                      <span>{p.industry || 'Case Study'}</span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate mt-0.5">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
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
