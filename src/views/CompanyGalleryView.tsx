import React, { useState, useEffect } from 'react';
import { 
  Camera, Calendar, MapPin, Search, 
  ExternalLink, ChevronLeft, ChevronRight, X, 
  Building2, GraduationCap, Users, RefreshCw, ZoomIn
} from 'lucide-react';
import { api } from '../api';
import { CompanyGalleryItem } from '../types';
import { CompanyGallerySlider } from '../components/home/CompanyGallerySlider';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

export const CompanyGalleryView: React.FC = () => {
  const [items, setItems] = useState<CompanyGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getCompanyGallery();
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load company gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, items]);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.title.toLowerCase().includes(q) ||
      (item.caption && item.caption.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
    return matchesCat && matchesSearch;
  });

  const handleNextPhoto = () => {
    if (activePhotoIndex === null || filteredItems.length === 0) return;
    setActivePhotoIndex((activePhotoIndex + 1) % filteredItems.length);
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex === null || filteredItems.length === 0) return;
    setActivePhotoIndex((activePhotoIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const activePhoto = activePhotoIndex !== null ? filteredItems[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-[#08090E] text-white">
      <SEOHead 
        title="Company Gallery & Regional Impact | SaroHub Technologies"
        description="An inside look at SaroHub in action — keynote engineering seminars, regional IT collaborations, hackathons, and developer masterclasses."
      />

      {/* Top Breadcrumb */}
      <div className="border-b border-white/[0.08] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Company Gallery', url: '/gallery', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-slate-400">
            Life &amp; Milestones
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-16 lg:py-24 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Life, Milestones &amp; Regional Impact
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-white leading-tight mb-4">
              Company Gallery &amp; <span className="italic text-[#FF5C00]">Ecosystem</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
              An inside look at SaroHub in action &mdash; keynote engineering seminars, technical SEO collaborations with regional IT centers, sprint hackathons, and developer masterclasses.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300 font-medium">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E121E] border border-white/[0.08] shadow-xs">
                <GraduationCap className="size-4 text-[#FF5C00]" />
                <span>Technical Seminars</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E121E] border border-white/[0.08] shadow-xs">
                <Building2 className="size-4 text-[#FF5C00]" />
                <span>IT Collaborations</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E121E] border border-white/[0.08] shadow-xs">
                <Users className="size-4 text-[#FF5C00]" />
                <span>Hackathons &amp; Culture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Moments Slider */}
      <div className="border-b border-white/[0.08] bg-[#08090E] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-6">
          <CompanyGallerySlider 
            title="Moments &amp; Seminars" 
            subtitle="Explore our seminars, SEO collaborations, and team hackathons through photography."
            showViewAllLink={false}
          />
        </div>
      </div>

      {/* Main Photo Directory */}
      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-8">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0E121E] p-4 sm:p-5 rounded-3xl border border-white/[0.08]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map(cat => {
              const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] border-[#FFA566]/30 text-white font-bold shadow-[0_0_15px_rgba(255,92,0,0.4)]'
                      : 'text-slate-300 hover:text-white bg-[#141828] border-white/10'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-black/30 text-white' : 'text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search seminars, topics, locations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#141828] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5C00] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF5C00] text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Gallery Visual Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <RefreshCw className="size-8 animate-spin text-[#FF5C00] mb-3" />
            <p className="text-xs font-mono uppercase tracking-wider">Loading gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border border-white/[0.08] bg-[#0E121E] max-w-md mx-auto">
            <Camera className="size-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No photos found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4 font-normal">
              No gallery images match the selected filter or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all cursor-pointer font-bold border border-[#FFA566]/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/[0.08] pb-3">
              <span>Showing {filteredItems.length} {filteredItems.length === 1 ? 'photo' : 'photos'}</span>
              <span>Filter: <strong className="text-white">{selectedCategory}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  id={`gallery-photo-${item.id}`}
                  onClick={() => setActivePhotoIndex(index)}
                  className="group relative aspect-[16/11] rounded-3xl overflow-hidden bg-[#0E121E] border border-white/[0.08] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=500');
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/80 text-[#FF7A1A] border border-[#FF5C00]/30 backdrop-blur-md font-bold">
                      {item.category}
                    </span>
                    <div className="size-8 rounded-full bg-black/80 text-white flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF5C00]">
                      <ZoomIn className="size-4" />
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-white">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
                      {item.event_date && (
                        <span className="flex items-center gap-1 text-[#FF7A1A] font-semibold">
                          <Calendar className="size-3 text-[#FF5C00]" />
                          {item.event_date}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1 truncate text-slate-300">
                          <MapPin className="size-3 shrink-0 text-[#FF5C00]" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#FF7A1A] transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-xs text-slate-400 line-clamp-1 font-normal">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setActivePhotoIndex(null)}
        >
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 z-50 size-10 rounded-full bg-white/10 text-white hover:bg-[#FF5C00] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            title="Close Lightbox (Esc)"
          >
            <X className="size-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPhoto();
            }}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full bg-black/80 text-white hover:bg-[#FF5C00] flex items-center justify-center transition-colors cursor-pointer border border-white/15 shadow-xl"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextPhoto();
            }}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full bg-black/80 text-white hover:bg-[#FF5C00] flex items-center justify-center transition-colors cursor-pointer border border-white/15 shadow-xl"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Modal Container */}
          <div 
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0E121E] border border-white/[0.12] rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lg:w-3/5 bg-black flex items-center justify-center min-h-[320px] lg:min-h-[480px]">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="lg:w-2/5 p-8 flex flex-col justify-between space-y-6 bg-[#0E121E]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF7A1A] font-bold">
                    {activePhoto.category}
                  </span>
                  {activePhoto.event_date && (
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="size-3.5 text-[#FF5C00]" />
                      {activePhoto.event_date}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold font-display text-white leading-snug">
                  {activePhoto.title}
                </h2>

                {activePhoto.caption && (
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed border-l-2 border-[#FF5C00] pl-3">
                    {activePhoto.caption}
                  </p>
                )}

                {activePhoto.description && (
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {activePhoto.description}
                  </p>
                )}

                {activePhoto.location && (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-3 border-t border-white/[0.08]">
                    <MapPin className="size-4 text-[#FF5C00] shrink-0" />
                    <span>{activePhoto.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Photo {activePhotoIndex !== null ? activePhotoIndex + 1 : 0} of {filteredItems.length}
                </span>
                <a
                  href={activePhoto.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#FF7A1A] hover:text-[#FFA566] hover:underline font-semibold"
                >
                  <span>Open Full Resolution</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
