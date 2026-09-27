import React, { useState, useMemo } from 'react';
import {
  Globe,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Eye,
  Share2,
  Sliders,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../../api';
import { SEOSettings } from '../../types';
import { MAJOR_PAGE_PRESETS, PageSEOPreset, getPresetByRoute } from '../../data/seoPagePresets';

interface AdminSEOModuleProps {
  adminSEO: SEOSettings[];
  onRefresh: () => void;
  setAdminAlert: (alert: { title: string; message: string } | null) => void;
  setDeleteConfirm: (confirm: { message: string; onConfirm: () => void } | null) => void;
}

export default function AdminSEOModule({
  adminSEO,
  onRefresh,
  setAdminAlert,
  setDeleteConfirm
}: AdminSEOModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Core' | 'Services & Growth' | 'Insights & Community' | 'Legal'>('All');
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [previewSerpRoute, setPreviewSerpRoute] = useState<string | null>(null);
  const [showAdvancedSocial, setShowAdvancedSocial] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedRoute, setCopiedRoute] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: number;
    page_route: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_title: string;
    og_description: string;
    og_image: string;
    canonical_url: string;
    no_index: boolean;
  }>({
    page_route: 'home',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    no_index: false
  });

  // Map of existing saved SEO items keyed by page_route
  const savedSEOMap = useMemo(() => {
    const map = new Map<string, SEOSettings>();
    (adminSEO || []).forEach((item) => {
      map.set(item.page_route, item);
    });
    return map;
  }, [adminSEO]);

  // Combined list of all known pages (presets + any extra custom routes in adminSEO)
  const allPagesList = useMemo(() => {
    const presetRoutes = new Set(MAJOR_PAGE_PRESETS.map((p) => p.route));
    const list: Array<{
      route: string;
      name: string;
      category: 'Core' | 'Services & Growth' | 'Insights & Community' | 'Legal';
      preset?: PageSEOPreset;
      saved?: SEOSettings;
    }> = MAJOR_PAGE_PRESETS.map((preset) => ({
      route: preset.route,
      name: preset.name,
      category: preset.category,
      preset,
      saved: savedSEOMap.get(preset.route)
    }));

    // Check for any custom routes saved in DB not in preset list
    (adminSEO || []).forEach((item) => {
      if (!presetRoutes.has(item.page_route)) {
        list.push({
          route: item.page_route,
          name: `Custom Route (/${item.page_route})`,
          category: 'Core',
          saved: item
        });
      }
    });

    return list;
  }, [MAJOR_PAGE_PRESETS, savedSEOMap, adminSEO]);

  // Filtered list based on search and category
  const filteredPages = useMemo(() => {
    return allPagesList.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const routeMatches = item.route.toLowerCase().includes(q);
      const nameMatches = item.name.toLowerCase().includes(q);
      const titleMatches = (item.saved?.meta_title || item.preset?.recommendedTitle || '').toLowerCase().includes(q);
      const descMatches = (item.saved?.meta_description || item.preset?.recommendedDescription || '').toLowerCase().includes(q);
      const kwMatches = (item.saved?.meta_keywords || item.preset?.recommendedKeywords || '').toLowerCase().includes(q);

      return routeMatches || nameMatches || titleMatches || descMatches || kwMatches;
    });
  }, [allPagesList, categoryFilter, searchQuery]);

  // Telemetry Calculations
  const stats = useMemo(() => {
    const totalPages = allPagesList.length;
    let configuredCount = 0;
    let titleOptimalCount = 0;
    let descOptimalCount = 0;
    let noIndexCount = 0;

    allPagesList.forEach((p) => {
      const activeTitle = p.saved?.meta_title || p.preset?.recommendedTitle || '';
      const activeDesc = p.saved?.meta_description || p.preset?.recommendedDescription || '';
      if (p.saved) configuredCount++;
      if (activeTitle.length >= 30 && activeTitle.length <= 60) titleOptimalCount++;
      if (activeDesc.length >= 120 && activeDesc.length <= 160) descOptimalCount++;
      if (p.saved?.no_index) noIndexCount++;
    });

    return { totalPages, configuredCount, titleOptimalCount, descOptimalCount, noIndexCount };
  }, [allPagesList]);

  // Open Edit Form for a specific route
  const handleEdit = (routeKey: string) => {
    const saved = savedSEOMap.get(routeKey);
    const preset = getPresetByRoute(routeKey);

    setFormData({
      id: saved?.id,
      page_route: routeKey,
      meta_title: saved?.meta_title ?? preset?.recommendedTitle ?? '',
      meta_description: saved?.meta_description ?? preset?.recommendedDescription ?? '',
      meta_keywords: saved?.meta_keywords ?? preset?.recommendedKeywords ?? '',
      og_title: saved?.og_title ?? '',
      og_description: saved?.og_description ?? '',
      og_image: saved?.og_image ?? '',
      canonical_url: saved?.canonical_url ?? preset?.canonicalUrl ?? `https://sarohub.com/${routeKey === 'home' ? '' : routeKey}`,
      no_index: Boolean(saved?.no_index)
    });

    setShowAdvancedSocial(Boolean(saved?.og_title || saved?.og_image || saved?.no_index));
    setShowEditorModal(true);
  };

  // Open Add New Page Modal
  const handleAddNew = () => {
    setFormData({
      page_route: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      canonical_url: '',
      no_index: false
    });
    setShowAdvancedSocial(false);
    setShowEditorModal(true);
  };

  // Auto-fill Recommended Preset
  const handleApplyPreset = (routeKey: string) => {
    const preset = getPresetByRoute(routeKey);
    if (!preset) return;

    setFormData((prev) => ({
      ...prev,
      meta_title: preset.recommendedTitle,
      meta_description: preset.recommendedDescription,
      meta_keywords: preset.recommendedKeywords,
      canonical_url: preset.canonicalUrl
    }));
  };

  // Save Form Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.page_route.trim()) {
      setAdminAlert({ title: 'Validation Error', message: 'Page Route identifier is required.' });
      return;
    }

    const cleanRoute = formData.page_route.trim().toLowerCase().replace(/^\/+|\/+$/g, '') || 'home';

    setIsSaving(true);
    try {
      await api.saveSEO({
        page_route: cleanRoute,
        meta_title: formData.meta_title.trim(),
        meta_description: formData.meta_description.trim(),
        meta_keywords: formData.meta_keywords.trim(),
        og_title: formData.og_title.trim() || undefined,
        og_description: formData.og_description.trim() || undefined,
        og_image: formData.og_image.trim() || undefined,
        canonical_url: formData.canonical_url.trim() || undefined,
        no_index: formData.no_index
      });

      // Dispatch event to inform public views and SEOHead to reload
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('sarohub-data-updated'));
      }

      setShowEditorModal(false);
      onRefresh();
      setAdminAlert({
        title: 'SEO Blueprint Synced',
        message: `Successfully synchronized metadata for route: /${cleanRoute === 'home' ? '' : cleanRoute}`
      });
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving SEO Settings', message: err.message || 'Failed to update SEO profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete SEO record
  const handleDelete = (id: number, routeKey: string) => {
    setDeleteConfirm({
      message: `Are you sure you want to delete the custom SEO profile for "/${routeKey}"? The page will revert to its default template tags.`,
      onConfirm: async () => {
        try {
          await api.deleteSEO(id);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('sarohub-data-updated'));
          }
          onRefresh();
          setAdminAlert({ title: 'SEO Profile Removed', message: `Route /${routeKey} reset to default tags.` });
        } catch (err: any) {
          setAdminAlert({ title: 'Delete Failed', message: err.message || 'Failed to delete SEO profile.' });
        }
      }
    });
  };

  // Bulk Seed/Sync All Major Page Presets
  const handleSyncAllPresets = () => {
    setDeleteConfirm({
      message: `Synchronize and initialize recommended SEO blueprints for all ${MAJOR_PAGE_PRESETS.length} major pages? This ensures search engines receive high-converting keywords and optimal snippet lengths.`,
      onConfirm: async () => {
        try {
          setIsSaving(true);
          for (const preset of MAJOR_PAGE_PRESETS) {
            await api.saveSEO({
              page_route: preset.route,
              meta_title: preset.recommendedTitle,
              meta_description: preset.recommendedDescription,
              meta_keywords: preset.recommendedKeywords,
              canonical_url: preset.canonicalUrl
            });
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('sarohub-data-updated'));
          }
          onRefresh();
          setAdminAlert({
            title: 'All Presets Synchronized',
            message: `Successfully initialized ${MAJOR_PAGE_PRESETS.length} pages with high-ranking metadata blueprints.`
          });
        } catch (err: any) {
          setAdminAlert({ title: 'Batch Sync Error', message: err.message });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const copyToClipboard = (text: string, route: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRoute(route);
    setTimeout(() => setCopiedRoute(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner & Main Heading */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/70 rounded-2xl border border-slate-900 p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight">
                SEO &amp; Search Indexing Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamically manage meta titles, search descriptions, canonical URLs, and indexing keywords across all major company pages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncAllPresets}
            disabled={isSaving}
            className="rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3.5 py-2 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Auto-populate recommended SEO across all major pages"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Sync All Recommended Presets</span>
          </button>

          <button
            onClick={handleAddNew}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Configure New Route</span>
          </button>
        </div>
      </div>

      {/* SEO Health & Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Configured Routes</span>
            <Globe className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats.configuredCount} <span className="text-xs font-normal text-slate-500">/ {stats.totalPages}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {stats.configuredCount === stats.totalPages ? '100% major pages active' : `${stats.totalPages - stats.configuredCount} pages using defaults`}
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Title Length Health</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {Math.round((stats.titleOptimalCount / Math.max(stats.totalPages, 1)) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {stats.titleOptimalCount} within 30-60 char snippet limit
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Snippet Health</span>
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {Math.round((stats.descOptimalCount / Math.max(stats.totalPages, 1)) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {stats.descOptimalCount} within 120-160 char limit
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider">Crawling Directive</span>
            <Sliders className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {stats.totalPages - stats.noIndexCount} <span className="text-xs font-normal text-slate-500">Index</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {stats.noIndexCount > 0 ? `${stats.noIndexCount} noindexed pages` : 'All pages allowed for Googlebot'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/40 border border-slate-900 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by route, title, keywords, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Core', 'Services & Growth', 'Insights & Community', 'Legal'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pages List / Directory */}
      <div className="space-y-3.5">
        {filteredPages.map((item) => {
          const isSaved = Boolean(item.saved);
          const activeTitle = item.saved?.meta_title || item.preset?.recommendedTitle || '';
          const activeDesc = item.saved?.meta_description || item.preset?.recommendedDescription || '';
          const activeKeywords = item.saved?.meta_keywords || item.preset?.recommendedKeywords || '';
          const canonical = item.saved?.canonical_url || item.preset?.canonicalUrl || `https://sarohub.com/${item.route === 'home' ? '' : item.route}`;
          const isNoIndex = Boolean(item.saved?.no_index);

          const titleLen = activeTitle.length;
          const descLen = activeDesc.length;
          const isTitleOptimal = titleLen >= 30 && titleLen <= 60;
          const isDescOptimal = descLen >= 120 && descLen <= 160;

          const isPreviewingSERP = previewSerpRoute === item.route;

          return (
            <div
              key={item.route}
              className="bg-slate-950/60 rounded-2xl border border-slate-900/90 hover:border-slate-800 p-5 transition-all space-y-4"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900/80 pb-3.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300">
                    /{item.route === 'home' ? '' : item.route}
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {item.name}
                  </span>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {item.category}
                  </span>

                  {isSaved ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Customized
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800 flex items-center gap-1">
                      Recommended Default
                    </span>
                  )}

                  {isNoIndex && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-500/30 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> noindex
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewSerpRoute(isPreviewingSERP ? null : item.route)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title={isPreviewingSERP ? 'Hide SERP Preview' : 'Preview Google Search snippet'}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <a
                    href={`/${item.route === 'home' ? '' : item.route}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title="Open live public page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={() => handleEdit(item.route)}
                    className="rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 px-3 py-1.5 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Profile
                  </button>

                  {isSaved && (
                    <button
                      onClick={() => item.saved && handleDelete(item.saved.id, item.route)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-900/60 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                      title="Revert to defaults"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Description Details */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Page Title Tag</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isTitleOptimal ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'}`}>
                      {titleLen} / 60 chars ({isTitleOptimal ? 'Optimal' : titleLen < 30 ? 'Short' : 'Long'})
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {activeTitle || <span className="text-slate-600 italic">No title set</span>}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Meta Description</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isDescOptimal ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'}`}>
                      {descLen} / 160 chars ({isDescOptimal ? 'Optimal' : descLen < 120 ? 'Short' : 'Long'})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {activeDesc || <span className="text-slate-600 italic">No description set</span>}
                  </p>
                </div>

                {/* Keywords Chips */}
                {activeKeywords && (
                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">
                      Indexing Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeKeywords.split(',').slice(0, 8).map((kw, i) => (
                        <span key={i} className="text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md">
                          {kw.trim()}
                        </span>
                      ))}
                      {activeKeywords.split(',').length > 8 && (
                        <span className="text-[10px] font-mono bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded">
                          +{activeKeywords.split(',').length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Google SERP Simulated Preview */}
              {isPreviewingSERP && (
                <div className="pt-2 border-t border-slate-900">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-cyan-400" /> Google Search SERP Snippet Preview
                  </div>
                  <div className="bg-white dark:bg-[#202124] rounded-xl p-4 border border-slate-300 dark:border-[#3c4043] font-sans shadow-md max-w-2xl">
                    <div className="flex items-center gap-2 mb-1 text-[13px] text-[#202124] dark:text-[#dadce0]">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                        S
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium leading-tight">SaroHub Technologies</span>
                        <span className="text-[11px] text-[#5f6368] dark:text-[#bdc1c6] leading-tight">
                          https://sarohub.com &rsaquo; {item.route === 'home' ? '' : item.route}
                        </span>
                      </div>
                    </div>
                    <div className="text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-normal leading-normal">
                      {activeTitle.includes('SaroHub Technologies') ? activeTitle : `${activeTitle} | SaroHub Technologies`}
                    </div>
                    <div className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] mt-1 leading-relaxed">
                      {activeDesc}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredPages.length === 0 && (
          <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-900">
            <Globe className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-semibold">No pages match your filter query</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search terms or filter categories.</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  {formData.id ? 'Edit Page SEO Blueprint' : 'Configure Page SEO Blueprint'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update search ranking metadata, snippet preview, and canonical tags
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditorModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Route Selector & Preset Apply */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Route Identifier <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={MAJOR_PAGE_PRESETS.some((p) => p.route === formData.page_route) ? formData.page_route : '__custom__'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== '__custom__') {
                          setFormData({
                            ...formData,
                            page_route: val
                          });
                        }
                      }}
                      className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <optgroup label="Core Major Pages">
                        {MAJOR_PAGE_PRESETS.filter((p) => p.category === 'Core').map((p) => (
                          <option key={p.route} value={p.route}>
                            /{p.route === 'home' ? '' : p.route} — {p.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Services & Growth">
                        {MAJOR_PAGE_PRESETS.filter((p) => p.category === 'Services & Growth').map((p) => (
                          <option key={p.route} value={p.route}>
                            /{p.route} — {p.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Insights & Community">
                        {MAJOR_PAGE_PRESETS.filter((p) => p.category === 'Insights & Community').map((p) => (
                          <option key={p.route} value={p.route}>
                            /{p.route} — {p.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Legal & Policies">
                        {MAJOR_PAGE_PRESETS.filter((p) => p.category === 'Legal').map((p) => (
                          <option key={p.route} value={p.route}>
                            /{p.route} — {p.name}
                          </option>
                        ))}
                      </optgroup>
                      <option value="__custom__">Custom Route Slug...</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleApplyPreset(formData.page_route)}
                      className="rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-2 text-xs font-mono flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
                      title="Load recommended SEO settings for this page"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Preset
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Route Slug Path
                  </label>
                  <input
                    type="text"
                    value={formData.page_route}
                    onChange={(e) => setFormData({ ...formData, page_route: e.target.value })}
                    placeholder="e.g. home, services, custom-page"
                    required
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Meta Title with Character Monitor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Meta Title Tag (`&lt;title&gt;`) <span className="text-red-400">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      formData.meta_title.length >= 30 && formData.meta_title.length <= 60
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {formData.meta_title.length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="e.g. Software Engineering &amp; Technology Solutions | SaroHub Technologies"
                  required
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Optimal length: 30 to 60 characters. Avoid truncation in Google Search mobile and desktop snippets.
                </p>
              </div>

              {/* Meta Description with Character Monitor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Meta Description (`&lt;meta name="description"&gt;`) <span className="text-red-400">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      formData.meta_description.length >= 120 && formData.meta_description.length <= 160
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {formData.meta_description.length} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Write a compelling, search-indexable summary (120 - 160 characters)..."
                  required
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Optimal length: 120 to 160 characters. Clearly explain the value proposition and include a soft call to action.
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Target Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  placeholder="custom software development, AI solutions, mobile apps, SaaS development"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
                {formData.meta_keywords && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.meta_keywords.split(',').filter(Boolean).map((kw, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Google Search Preview in Modal */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="h-3 w-3 text-blue-400" /> Live Google SERP Snippet Preview
                </span>
                <div className="bg-white dark:bg-[#202124] rounded-xl p-4 border border-slate-300 dark:border-[#3c4043] font-sans">
                  <div className="flex items-center gap-2 mb-1 text-[13px] text-[#202124] dark:text-[#dadce0]">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                      S
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium leading-tight">SaroHub Technologies</span>
                      <span className="text-[11px] text-[#5f6368] dark:text-[#bdc1c6] leading-tight">
                        https://sarohub.com &rsaquo; {formData.page_route === 'home' ? '' : formData.page_route}
                      </span>
                    </div>
                  </div>
                  <div className="text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-normal leading-normal">
                    {formData.meta_title ? (formData.meta_title.includes('SaroHub Technologies') ? formData.meta_title : `${formData.meta_title} | SaroHub Technologies`) : 'Enter Page Title...'}
                  </div>
                  <div className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] mt-1 leading-relaxed">
                    {formData.meta_description || 'Enter meta description to preview how your page snippet appears in Google Search results.'}
                  </div>
                </div>
              </div>

              {/* Collapsible Advanced Social & Indexing Settings */}
              <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSocial(!showAdvancedSocial)}
                  className="w-full flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-cyan-400" /> Advanced Social Cards &amp; Indexing Directives
                  </span>
                  {showAdvancedSocial ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showAdvancedSocial && (
                  <div className="mt-4 space-y-4 pt-3 border-t border-slate-800/80">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                          Canonical URL
                        </label>
                        <input
                          type="url"
                          value={formData.canonical_url}
                          onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                          placeholder={`https://sarohub.com/${formData.page_route === 'home' ? '' : formData.page_route}`}
                          className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                          OpenGraph / Social Card Image URL
                        </label>
                        <input
                          type="text"
                          value={formData.og_image}
                          onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                          placeholder="https://sarohub.com/assets/og-image.png"
                          className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        OpenGraph Share Title (Optional override for social networks)
                      </label>
                      <input
                        type="text"
                        value={formData.og_title}
                        onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                        placeholder="Leave blank to use Meta Title Tag"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        OpenGraph Share Description (Optional override for social networks)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.og_description}
                        onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                        placeholder="Leave blank to use Meta Description"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="noIndexCheckbox"
                        checked={formData.no_index}
                        onChange={(e) => setFormData({ ...formData, no_index: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer h-4 w-4"
                      />
                      <label htmlFor="noIndexCheckbox" className="text-xs text-slate-300 cursor-pointer">
                        <strong className="text-white">Block from Search Engines (`noindex, nofollow`)</strong>
                        <span className="block text-[10px] text-slate-500">
                          Enable this only for staging, internal portals, or private administration links.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-xs font-bold font-mono tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>{isSaving ? 'Synchronizing...' : 'Save & Synchronize SEO'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
