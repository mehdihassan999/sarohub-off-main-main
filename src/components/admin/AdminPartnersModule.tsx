import React, { useState, useEffect } from 'react';
import {
  Handshake, Plus, Search, Edit, Trash2, Globe, ExternalLink,
  Sparkles, Check, Building, ShieldCheck, Star, Layers, Filter, Eye, RefreshCw, X,
  Image as ImageIcon, Upload, Loader2, Landmark
} from 'lucide-react';
import { api } from '../../api';
import { Partner, PartnerCategory } from '../../types';
import ImageUploadField from '../ImageUploadField';
import { getCategoryMeta } from '../partners/PartnerCard';

export const PRESET_PARTNER_CATEGORIES: string[] = [
  'Government Sector',
  'Agency Partner',
  'Technology Partner',
  'Strategic Partner',
  'NGO & Non-Profit',
  'Academic & Research',
  'Investor & Venture',
  'Ecosystem & Incubation',
  'Corporate Partner',
  'Collaborator',
  'Sponsor'
];

interface AdminPartnersModuleProps {
  onNotify?: (title: string, message: string) => void;
}

export const AdminPartnersModule: React.FC<AdminPartnersModuleProps> = ({ onNotify }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Government Sector');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featured, setFeatured] = useState(true);
  const [order, setOrder] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPartners();
      setPartners(data || []);
    } catch (err: any) {
      console.error('Failed to load partners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setCategory('Government Sector');
    setCustomCategory('');
    setIsCustomCategory(false);
    setLogoUrl('');
    setWebsiteUrl('');
    setDescription('');
    setImages([]);
    setNewImageUrl('');
    setFeatured(true);
    setOrder(partners.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner: Partner) => {
    setEditingItem(partner);
    setName(partner.name);
    if (PRESET_PARTNER_CATEGORIES.includes(partner.category)) {
      setCategory(partner.category);
      setCustomCategory('');
      setIsCustomCategory(false);
    } else {
      setCategory('Custom');
      setCustomCategory(partner.category || '');
      setIsCustomCategory(true);
    }
    setLogoUrl(partner.logo_url);
    setWebsiteUrl(partner.website_url || '');
    setDescription(partner.description || '');
    setImages(partner.images || partner.gallery || []);
    setNewImageUrl('');
    setFeatured(partner.featured);
    setOrder(partner.order || 1);
    setIsModalOpen(true);
  };

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    setImages((prev) => [...prev, url.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const res = await api.uploadImage(file);
          if (res?.url) {
            setImages((prev) => [...prev, res.url]);
          }
        } catch {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImages((prev) => [...prev, String(event.target.result)]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !logoUrl.trim()) return;

    const resolvedCategory = isCustomCategory 
      ? (customCategory.trim() || 'Partner')
      : category;

    setIsSaving(true);
    try {
      const payload: Partial<Partner> = {
        name,
        category: resolvedCategory as PartnerCategory,
        logo_url: logoUrl,
        website_url: websiteUrl,
        description,
        images,
        gallery: images,
        featured,
        order: Number(order)
      };

      if (editingItem) {
        await api.updatePartner(editingItem.id, payload);
        if (onNotify) onNotify('Partner Updated', `Successfully updated "${name}".`);
      } else {
        await api.createPartner(payload);
        if (onNotify) onNotify('Partner Added', `Successfully added new partner/investor "${name}".`);
      }

      setIsModalOpen(false);
      loadPartners();
    } catch (err: any) {
      alert(err.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deletePartner(id);
      if (onNotify) onNotify('Deleted', 'Partner removed successfully.');
      setDeleteId(null);
      loadPartners();
    } catch (err: any) {
      alert(err.message || 'Failed to delete partner.');
    }
  };

  const filteredPartners = partners.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-900">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2.5">
            <Handshake className="h-6 w-6 text-cyan-400" />
            Partners, Agencies & Investors
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamically add, edit, or remove technology collaborators, agency partners, and venture investors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPartners}
            className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Partner / Investor
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search partners, agencies, investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-900 w-full sm:w-auto overflow-x-auto">
          {['all', 'Government Sector', 'Agency Partner', 'Technology Partner', 'Investor & Venture', ...(Array.from(new Set(partners.map(p => p.category))) as string[]).filter(c => !['Government Sector', 'Agency Partner', 'Technology Partner', 'Investor & Venture', 'all'].includes(c))].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* List Grid */}
      {isLoading ? (
        <div className="text-center py-12 bg-slate-950/30 rounded-2xl border border-slate-900">
          <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-mono">Loading partners database...</p>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="text-center py-16 bg-slate-950/30 rounded-2xl border border-slate-900">
          <Building className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No partners found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || categoryFilter !== 'all'
              ? 'No record matches your search query or filter.'
              : 'Add corporate partners, agencies, or investors to highlight on the homepage and partnership portal.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            + Add First Partner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-slate-950/50 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between hover:border-slate-800 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="h-full w-full object-contain rounded-full"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs font-black text-cyan-400 font-display">
                          {partner.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {partner.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        Order #{partner.order || 1}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {(() => {
                      const meta = getCategoryMeta(partner.category) as any;
                      const CategoryIcon = meta.icon;
                      return (
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.badgeStyle || 'border-slate-700 bg-slate-800 text-slate-300'}`}>
                          <CategoryIcon className="h-3 w-3 shrink-0" />
                          <span>{partner.category}</span>
                        </span>
                      );
                    })()}

                    {partner.featured && (
                      <span className="p-1 rounded bg-amber-500/10 text-amber-400" title="Featured Partner">
                        <Star className="h-3 w-3 fill-amber-400" />
                      </span>
                    )}
                  </div>
                </div>

                {partner.description && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {partner.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between">
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono"
                  >
                    <Globe className="h-3 w-3" /> Visit Site
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono">No URL</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(partner)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit Partner"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(partner.id)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete Partner"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Handshake className="h-5 w-5 text-cyan-400" />
                {editingItem ? 'Edit Partner / Investor' : 'Add New Partner / Investor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-1">
              
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., TechCorp Global, Apex Ventures"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category / Sector Type *</label>
                  <select
                    value={isCustomCategory ? 'Custom' : category}
                    onChange={(e) => {
                      if (e.target.value === 'Custom') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                  >
                    {PRESET_PARTNER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Custom">+ Other / Custom Sector...</option>
                  </select>

                  {isCustomCategory && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Type custom sector (e.g. Health Ministry, Transit Board)"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                        required={isCustomCategory}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Order Priority</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-400">Partner / Investor Logo *</label>
                  {logoUrl && (
                    <span className="text-[10px] font-mono text-cyan-400">Circular Avatar Preview</span>
                  )}
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <ImageUploadField
                      label=""
                      value={logoUrl}
                      onChange={(url) => setLogoUrl(url)}
                      placeholder="Upload company logo or paste image URL"
                    />
                  </div>
                  {logoUrl && (
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                      <div className="h-14 w-14 rounded-full bg-slate-900 border-2 border-cyan-500/40 p-2 overflow-hidden flex items-center justify-center shadow-lg">
                        <img
                          src={logoUrl}
                          alt="Circular Preview"
                          className="h-full w-full object-contain rounded-full"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">Live Circle</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of partnership or collaboration..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Additional Showcase / Portfolio Images */}
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
                      Partner Showcase & Collaboration Images (Optional)
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Add project screenshots, office photos, or collaboration banners
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {images.length} Images
                  </span>
                </div>

                {/* Image input & multi-file upload button */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImage(newImageUrl);
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage(newImageUrl)}
                    disabled={!newImageUrl.trim()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Add URL
                  </button>
                  <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono cursor-pointer shrink-0 transition-colors">
                    {uploadingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMultipleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Thumbnails preview grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-20">
                        <img
                          src={imgUrl}
                          alt={`Showcase ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-950/80 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-md cursor-pointer"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-slate-950/80 px-1 py-0.2 rounded text-[8px] font-mono text-slate-400">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-300 font-mono select-none cursor-pointer">
                  Feature prominently in partnership showcase
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <Trash2 className="h-10 w-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Delete Partner?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this partner/investor from the database?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPartnersModule;
