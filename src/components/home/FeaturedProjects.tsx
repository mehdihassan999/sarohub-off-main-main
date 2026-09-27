import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Layers, LayoutGrid
} from 'lucide-react';
import { STANDARD_CATEGORIES, getAllClientProjects } from '../../data/clientProjectsData';
import ClientProjectCard from './ClientProjectCard';

interface ProjectsProps {
  projects?: any[];
}

export default function FeaturedProjects({ projects: incomingProjects }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const allProjects = useMemo(() => {
    const fallbackList = getAllClientProjects();
    if (!incomingProjects || incomingProjects.length === 0) {
      return fallbackList.map(f => {
        const fallbackThumb = f.thumbnail_url || (Array.isArray(f.screenshots) && f.screenshots[0]) || '';
        return {
          ...f,
          thumbnail_url: fallbackThumb,
          image: fallbackThumb,
          image_url: fallbackThumb
        };
      });
    }
    
    const sorted = [...incomingProjects].sort((a, b) => {
      const orderA = Number(a.order) || 999;
      const orderB = Number(b.order) || 999;
      if (orderA !== orderB) return orderA - orderB;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    return sorted.map((p) => {
      const matched = fallbackList.find(
        (f) => (p.slug && f.slug === p.slug) || (p.title && f.title.toLowerCase() === (p.title || '').toLowerCase())
      );

      // Prioritize admin panel image / thumbnail
      const adminThumbnail = 
        (typeof p.thumbnail_url === 'string' && p.thumbnail_url.trim().length > 0 && p.thumbnail_url.trim()) ||
        (Array.isArray(p.screenshots) && p.screenshots.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
        (Array.isArray(p.gallery) && p.gallery.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
        (typeof p.image === 'string' && p.image.trim().length > 0 && p.image.trim()) ||
        (typeof p.image_url === 'string' && p.image_url.trim().length > 0 && p.image_url.trim());

      const fallbackThumbnail = 
        matched?.thumbnail_url || 
        (Array.isArray(matched?.screenshots) && matched?.screenshots[0]) || 
        (matched as any)?.image;

      const finalThumb = adminThumbnail || fallbackThumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450';

      if (matched) {
        return {
          ...matched,
          ...p,
          what_we_solved: p.what_we_solved || p.case_study || matched.what_we_solved,
          overview: p.overview || matched.overview,
          challenges: p.challenges || matched.challenges,
          solutions: p.solutions || matched.solutions,
          features: p.features || matched.features,
          sarohub_role: p.sarohub_role || matched.sarohub_role,
          positioning_statement: p.positioning_statement || matched.positioning_statement,
          project_type: p.project_type || matched.project_type,
          industry: p.industry || matched.industry,
          category: p.category || matched.category,
          secondary_categories: p.secondary_categories || matched.secondary_categories,
          status: p.status || matched.status || 'Delivered',
          featured: p.featured !== undefined ? p.featured : matched.featured,
          thumbnail_url: finalThumb,
          image: finalThumb,
          image_url: finalThumb,
          screenshots: (Array.isArray(p.screenshots) && p.screenshots.length > 0) ? p.screenshots : matched.screenshots
        };
      }
      return {
        ...p,
        status: p.status || 'Delivered',
        what_we_solved: p.what_we_solved || p.case_study || 'Engineered bespoke digital architecture solving core operational bottlenecks.',
        thumbnail_url: finalThumb,
        image: finalThumb,
        image_url: finalThumb,
        screenshots: (Array.isArray(p.screenshots) && p.screenshots.length > 0) ? p.screenshots : [finalThumb]
      };
    });
  }, [incomingProjects]);

  const availableCategories = useMemo(() => {
    const activeSet = new Set<string>();
    allProjects.forEach((p: any) => {
      if (p.category) activeSet.add(p.category);
      if (Array.isArray(p.secondary_categories)) {
        p.secondary_categories.forEach((c: string) => activeSet.add(c));
      }
    });

    const result: string[] = ['All'];
    STANDARD_CATEGORIES.forEach((cat) => {
      if (cat !== 'All' && activeSet.has(cat)) {
        result.push(cat);
      }
    });

    activeSet.forEach((cat) => {
      if (!result.includes(cat)) {
        result.push(cat);
      }
    });

    return result;
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter((p: any) => {
      if (!p) return false;
      const primary = p.category === activeCategory;
      const secondary = Array.isArray(p.secondary_categories) && p.secondary_categories.includes(activeCategory);
      return primary || secondary;
    });
  }, [allProjects, activeCategory]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const children = Array.from(scrollRef.current.children) as HTMLElement[];
    let currentIdx = 0;
    children.forEach((child, idx) => {
      if (child.offsetLeft - scrollRef.current!.offsetLeft <= scrollLeft + 50) {
        currentIdx = idx;
      }
    });
    setActiveIndex(currentIdx);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [filteredProjects, viewMode]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 420;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const totalCount = filteredProjects.length;

  return (
    <section id="selected-client-work" className="py-12 lg:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-gray-200">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Portfolio &amp; Case Studies
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black">
              Selected Client <span className="italic">Work</span>
            </h2>
          </div>

          {/* View Mode Toggle and Carousel Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center p-1 rounded-full bg-gray-100 text-xs font-mono uppercase">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <LayoutGrid className="size-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <Layers className="size-3.5" />
                <span>Carousel</span>
              </button>
            </div>

            {viewMode === 'carousel' && totalCount > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  className={`size-10 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
                    canScrollLeft ? 'bg-white hover:bg-black hover:text-white cursor-pointer shadow-xs' : 'opacity-30 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  className={`size-10 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
                    canScrollRight ? 'bg-white hover:bg-black hover:text-white cursor-pointer shadow-xs' : 'opacity-30 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        {availableCategories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer font-medium ${
                  activeCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Layout */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-[#FBFBFB] rounded-3xl border border-gray-200 font-mono text-xs text-gray-500 uppercase">
            No projects registered in this vertical yet.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <ClientProjectCard key={project.id || idx} project={project} idx={idx} />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          >
            {filteredProjects.map((project, idx) => (
              <div key={project.id || idx} className="min-w-[340px] sm:min-w-[400px] max-w-[420px] shrink-0 snap-start">
                <ClientProjectCard project={project} idx={idx} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
