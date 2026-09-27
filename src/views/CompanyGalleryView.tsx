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
    <div className="min-h-screen bg-white text-black">
      <SEOHead 
        title="Company Gallery & Regional Impact | SaroHub Technologies"
        description="An inside look at SaroHub in action — keynote engineering seminars, regional IT collaborations, hackathons, and developer masterclasses."
      />

      {/* Top Breadcrumb */}
      <div className="border-b border-gray-200 bg-[#FBFBFB]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Company Gallery', url: '/gallery', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-gray-500">
            Life &amp; Milestones
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Life, Milestones &amp; Regional Impact
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black leading-tight mb-4">
              Company Gallery &amp; <span className="italic">Ecosystem</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-normal leading-relaxed">
              An inside look at SaroHub in action &mdash; keynote engineering seminars, technical SEO collaborations with regional IT centers, sprint hackathons, and developer masterclasses.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-gray-700 font-medium">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-xs">
                <GraduationCap className="size-4 text-black" />
                <span>Technical Seminars</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-xs">
                <Building2 className="size-4 text-black" />
                <span>IT Collaborations</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-xs">
                <Users className="size-4 text-black" />
                <span>Hackathons &amp; Culture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Moments Slider */}
      <div className="border-b border-gray-200 bg-[#FBFBFB] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-6">
          <CompanyGallerySlider 
            title="Moments &amp; Seminars" 
            subtitle="Explore our seminars, SEO collaborations, and team hackathons through photography."
            showViewAllLink={false}
          />
        </div>
      </div>

      {/* Main Photo Directory */}
      <main className="max-w-7xl mx-auto px-6 py-10 sm:py-12 space-y-6">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FBFBFB] p-4 rounded-3xl border border-gray-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map(cat => {
              const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-black text-white font-semibold'
                      : 'text-gray-500 hover:text-black bg-white border border-gray-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search seminars, topics, locations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-gray-200 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Gallery Visual Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <RefreshCw className="size-8 animate-spin text-black mb-3" />
            <p className="text-xs font-mono uppercase tracking-wider">Loading gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border border-gray-200 bg-[#FBFBFB] max-w-md mx-auto">
            <Camera className="size-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-normal text-black">No photos found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4 font-normal">
              No gallery images match the selected filter or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-b border-gray-200 pb-3">
              <span>Showing {filteredItems.length} {filteredItems.length === 1 ? 'photo' : 'photos'}</span>
              <span>Filter: {selectedCategory}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  id={`gallery-photo-${item.id}`}
                  onClick={() => setActivePhotoIndex(index)}
                  className="group relative aspect-[16/11] rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-black transition-all duration-300 cursor-pointer shadow-xs"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/95 text-black border border-gray-200 backdrop-blur-xs font-semibold">
                      {item.category}
                    </span>
                    <div className="size-8 rounded-full bg-white/95 text-black flex items-center justify-center border border-gray-200 opacity-0 group-hover:opacity-100 transition-all">
                      <ZoomIn className="size-4" />
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-white">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-gray-300">
                      {item.event_date && (
                        <span className="flex items-center gap-1 text-white font-semibold">
                          <Calendar className="size-3" />
                          {item.event_date}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1 truncate text-gray-300">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-normal text-base text-white group-hover:underline line-clamp-1">
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-xs text-gray-300 line-clamp-1 font-normal">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6"
          onClick={() => setActivePhotoIndex(null)}
        >
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 z-50 size-10 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="size-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPhoto();
            }}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextPhoto();
            }}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Modal Container */}
          <div 
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lg:w-3/5 bg-black flex items-center justify-center min-h-[320px] lg:min-h-[480px]">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="lg:w-2/5 p-8 flex flex-col justify-between space-y-6 bg-[#FBFBFB]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-white border border-gray-200 text-black font-semibold">
                    {activePhoto.category}
                  </span>
                  {activePhoto.event_date && (
                    <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
                      <Calendar className="size-3.5 text-gray-400" />
                      {activePhoto.event_date}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-normal text-black leading-snug">
                  {activePhoto.title}
                </h2>

                {activePhoto.caption && (
                  <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed border-l-2 border-black pl-3">
                    {activePhoto.caption}
                  </p>
                )}

                {activePhoto.description && (
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {activePhoto.description}
                  </p>
                )}

                {activePhoto.location && (
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 pt-3 border-t border-gray-200">
                    <MapPin className="size-4 text-gray-400 shrink-0" />
                    <span>{activePhoto.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs font-mono text-gray-500">
                <span>
                  Photo {activePhotoIndex !== null ? activePhotoIndex + 1 : 0} of {filteredItems.length}
                </span>
                <a
                  href={activePhoto.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-black hover:underline"
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
