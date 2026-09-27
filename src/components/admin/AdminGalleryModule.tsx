import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Plus, Trash2, Edit, Check, X, RefreshCw, 
  ExternalLink, Calendar, MapPin, Users, Tag, Eye, EyeOff, 
  Star, Search, Filter, Image as ImageIcon, AlertCircle, Sparkles,
  ArrowUpDown, FolderOpen, CheckCircle2
} from 'lucide-react';
import { api } from '../../api';
import { CompanyGalleryItem, GalleryCategory } from '../../types';

const PRESET_CATEGORIES: GalleryCategory[] = [
  'Seminars',
  'SEO Collaborations',
  'Office Culture',
  'Tech Masterclasses',
  'Partner Summits'
];

export const AdminGalleryModule: React.FC = () => {
  const [items, setItems] = useState<CompanyGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Partial<CompanyGalleryItem> | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // File upload state
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In-app Delete Confirmation Target
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<CompanyGalleryItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Image preview modal
  const [previewItem, setPreviewItem] = useState<CompanyGalleryItem | null>(null);

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    setLoading(true);
    try {
      const data = await api.getCompanyGallery({ admin: true });
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
      showNotification('Failed to load company gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingItem({
      title: '',
      category: 'Seminars',
      image_url: '',
      caption: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      location: 'Skardu IT Center & Innovation Hub',
      attendees_count: '',
      tags: [],
      featured: false,
      published: true,
      order: items.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CompanyGalleryItem) => {
    setEditingItem({
      ...item,
      tags: item.tags || []
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      showNotification('Image size exceeds 8MB limit', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      if (res && res.url) {
        setEditingItem(prev => prev ? { ...prev, image_url: res.url } : null);
        showNotification('Image uploaded successfully');
      } else {
        throw new Error('Upload returned no URL');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      showNotification('Failed to upload image from system', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title?.trim()) {
      showNotification('Please enter a photo title', 'error');
      return;
    }

    if (!editingItem.image_url?.trim()) {
      showNotification('Please upload an image from your system', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingItem.id) {
        // Update
        const updated = await api.updateCompanyGalleryItem(editingItem.id, editingItem);
        setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
        showNotification('Gallery item updated successfully');
      } else {
        // Create
        const created = await api.createCompanyGalleryItem(editingItem);
        setItems(prev => [created, ...prev]);
        showNotification('New gallery item published successfully');
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to save gallery item:', err);
      showNotification('Error saving gallery item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (item: CompanyGalleryItem) => {
    try {
      const nextPublished = !item.published;
      const updated = await api.updateCompanyGalleryItem(item.id, { published: nextPublished });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, published: nextPublished } : i));
      showNotification(nextPublished ? 'Item published to public gallery' : 'Item hidden from public gallery');
    } catch (err) {
      showNotification('Failed to update publication status', 'error');
    }
  };

  const handleToggleFeatured = async (item: CompanyGalleryItem) => {
    try {
      const nextFeatured = !item.featured;
      const updated = await api.updateCompanyGalleryItem(item.id, { featured: nextFeatured });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, featured: nextFeatured } : i));
      showNotification(nextFeatured ? 'Marked as featured highlight' : 'Removed from featured highlight');
    } catch (err) {
      showNotification('Failed to update featured flag', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmTarget) return;
    setDeleting(true);
    try {
      await api.deleteCompanyGalleryItem(deleteConfirmTarget.id);
      setItems(prev => prev.filter(i => i.id !== deleteConfirmTarget.id));
      showNotification(`Deleted "${deleteConfirmTarget.title}" from gallery`);
      setDeleteConfirmTarget(null);
    } catch (err) {
      showNotification('Failed to delete gallery item', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Derive all unique categories present in items plus presets
  const allCategories = Array.from(
    new Set([...PRESET_CATEGORIES, ...items.map(i => i.category).filter(Boolean)])
  );

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'published' ? item.published !== false :
      item.published === false;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.title.toLowerCase().includes(q) ||
      (item.caption && item.caption.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const stats = {
    total: items.length,
    seminars: items.filter(i => i.category === 'Seminars').length,
    seo: items.filter(i => i.category === 'SEO Collaborations').length,
    culture: items.filter(i => i.category === 'Office Culture').length,
    featured: items.filter(i => i.featured).length,
    published: items.filter(i => i.published !== false).length,
  };

  return (
    <div id="admin-gallery-module" className="space-y-6">
      {/* Module Notification */}
      {notification && (
        <div 
          id="gallery-admin-toast"
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-mono font-medium transition-all ${
            notification.type === 'success' 
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300' 
              : 'bg-rose-950/80 border border-rose-800 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Camera className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Company Gallery CMS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage seminars, SEO collaborations with regional IT centers, office culture moments, and technical milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-gallery"
            onClick={loadGalleryItems}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button
            id="btn-add-gallery-item"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload &amp; Add Photo</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
          <span className="text-xs font-mono text-slate-500 block">Total Photos</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.total}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
          <span className="text-xs font-mono text-blue-400 block">Seminars</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.seminars}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
          <span className="text-xs font-mono text-emerald-400 block">SEO Collabs</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.seo}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
          <span className="text-xs font-mono text-purple-400 block">Office Culture</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.culture}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
          <span className="text-xs font-mono text-amber-400 block">Featured</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.featured}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
          <span className="text-xs font-mono text-cyan-400 block">Published</span>
          <span className="text-xl font-bold text-white mt-1 block">{stats.published}</span>
        </div>
      </div>

      {/* Filtering & Category Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-900">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            All ({items.length})
          </button>
          {allCategories.map(cat => {
            const count = items.filter(i => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-400 mb-3" />
          <p className="text-xs font-mono">Synchronizing gallery items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
            <Camera className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No gallery items found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || selectedCategory !== 'All' 
              ? 'Try changing your search query or category filter.' 
              : 'Upload your first seminar or office collaboration photo to begin populating the gallery.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              className={`group relative bg-slate-950/70 border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                item.featured 
                  ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' 
                  : 'border-slate-900 hover:border-slate-800'
              }`}
            >
              {/* Image Container with Badge Overlays */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=450');
                  }}
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Category Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide uppercase shadow-sm ${
                    item.category === 'Seminars' ? 'bg-blue-500/90 text-white' :
                    item.category === 'SEO Collaborations' ? 'bg-emerald-500/90 text-white' :
                    item.category === 'Office Culture' ? 'bg-purple-500/90 text-white' :
                    'bg-slate-800/90 text-slate-200'
                  }`}>
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Star className="h-2.5 w-2.5 fill-current" /> Featured
                    </span>
                  )}
                </div>

                {/* Status indicator */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    item.published !== false 
                      ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800' 
                      : 'bg-rose-950/90 text-rose-400 border border-rose-800'
                  }`}>
                    {item.published !== false ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Quick inspect button */}
                <button
                  type="button"
                  onClick={() => setPreviewItem(item)}
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs transition-all cursor-pointer"
                  title="View full preview"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>

                {/* Metadata details */}
                <div className="space-y-1.5 pt-2 border-t border-slate-900/60 text-[11px] font-mono text-slate-500">
                  {item.event_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-blue-400" />
                      <span>{item.event_date}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3 w-3 text-rose-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                  {item.attendees_count && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Users className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{item.attendees_count}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-mono self-center">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-900 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(item)}
                    className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                      item.published !== false 
                        ? 'border-emerald-800 text-emerald-400 hover:bg-emerald-950/60' 
                        : 'border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title={item.published !== false ? 'Hide from public view' : 'Publish to website'}
                  >
                    {item.published !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(item)}
                    className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                      item.featured 
                        ? 'border-amber-700 bg-amber-950/40 text-amber-400' 
                        : 'border-slate-800 text-slate-500 hover:text-amber-400'
                    }`}
                    title={item.featured ? 'Remove featured flag' : 'Mark as featured hero'}
                  >
                    <Star className={`h-3.5 w-3.5 ${item.featured ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmTarget(item)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900 text-xs transition-all cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  {editingItem.id ? 'Edit Gallery Photo' : 'Upload & Publish New Gallery Photo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Image Source & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">
                  Image Attachment <span className="text-rose-400">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  {/* Image Preview Box */}
                  <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                    {editingItem.image_url ? (
                      <img
                        src={editingItem.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600');
                        }}
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-600">
                        <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px] font-mono">No Image Attached</span>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-blue-400 text-xs font-mono">
                        <RefreshCw className="h-5 w-5 animate-spin mb-1" />
                        <span>Uploading file...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-2.5 flex flex-col justify-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 border border-blue-500/30 transition-all cursor-pointer shadow-sm"
                    >
                      <Upload className="h-4 w-4 text-blue-400" />
                      <span>{uploading ? 'Processing Upload...' : 'Upload Image from System'}</span>
                    </button>
                    {editingItem.image_url && (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>Image uploaded successfully</span>
                      </div>
                    )}
                    <p className="text-[10px] font-mono text-slate-500">
                      Supports JPG, PNG, WEBP. Max size 8MB. Recommended resolution: 1200x800px.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Event / Photo Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., SEO Technical Summit with IT Center"
                    value={editingItem.title || ''}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Category Tag <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={PRESET_CATEGORIES.includes(editingItem.category as any) ? editingItem.category : 'custom'}
                      onChange={e => {
                        const val = e.target.value;
                        if (val !== 'custom') {
                          setEditingItem({ ...editingItem, category: val });
                        } else {
                          setEditingItem({ ...editingItem, category: '' });
                        }
                      }}
                      className="w-1/2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {PRESET_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="custom">+ Custom Category</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Category name"
                      value={editingItem.category || ''}
                      onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-1/2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Short Caption / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="Key highlight or one-sentence summary"
                  value={editingItem.caption || ''}
                  onChange={e => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Full Story &amp; Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide context about what was presented, key outcomes, collaborating institutions, or tech discussions..."
                  value={editingItem.description || ''}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Event Date, Location, Attendees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={editingItem.event_date || ''}
                    onChange={e => setEditingItem({ ...editingItem, event_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Regional IT Center, Skardu"
                    value={editingItem.location || ''}
                    onChange={e => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Attendees / Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 120+ Engineers"
                    value={editingItem.attendees_count || ''}
                    onChange={e => setEditingItem({ ...editingItem, attendees_count: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tags & Sorting Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Seminars, SEO, IT Center, Innovation"
                    value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : (editingItem.tags || '')}
                    onChange={e => {
                      const tagsArray = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                      setEditingItem({ ...editingItem, tags: tagsArray });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Display Order Priority
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.order ?? 1}
                    onChange={e => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Switches: Featured and Published */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.featured || false}
                    onChange={e => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs font-mono text-slate-300">Feature on Gallery Hero</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.published !== false}
                    onChange={e => setEditingItem({ ...editingItem, published: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-0"
                  />
                  <span className="text-xs font-mono text-slate-300">Publish to Live Website</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/20"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{editingItem.id ? 'Save Changes' : 'Publish to Gallery'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-white">Delete Gallery Photo</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Are you sure you want to permanently remove <strong className="text-white">"{deleteConfirmTarget.title}"</strong> from the company gallery? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW LIGHTBOX MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="relative aspect-video w-full bg-black">
              <img
                src={previewItem.image_url}
                alt={previewItem.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {previewItem.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {previewItem.event_date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{previewItem.title}</h3>
              {previewItem.caption && (
                <p className="text-xs font-medium text-slate-300">{previewItem.caption}</p>
              )}
              {previewItem.description && (
                <p className="text-xs text-slate-400 leading-relaxed">{previewItem.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                {previewItem.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    {previewItem.location}
                  </span>
                )}
                {previewItem.attendees_count && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    {previewItem.attendees_count}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
