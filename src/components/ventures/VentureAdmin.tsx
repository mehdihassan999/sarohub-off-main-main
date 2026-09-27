import React, { useState, useEffect } from 'react';
import { Venture, VentureStatusType, VentureGalleryItem } from '../../types';
import { api } from '../../api';
import ImageUploadField from '../ImageUploadField';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, MoveUp, MoveDown,
  Save, X, CheckCircle, AlertCircle, Loader2, ExternalLink, Image as ImageIcon, Upload
} from 'lucide-react';

const STATUSES: VentureStatusType[] = [
  'Idea', 'Research', 'Prototype', 'In Development', 'Beta', 'Active', 'Expanding', 'Archived'
];

const EMPTY_FORM: Partial<Venture> = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
  category: '',
  status: 'In Development',
  keyCapabilities: [],
  technologies: [],
  gallery: [],
  galleryImages: [],
  websiteUrl: '',
  demoUrl: '',
  learnMoreUrl: '',
  featured: true,
  order: 1,
  published: true,
  industry: '',
  problem: '',
  solution: '',
  targetMarket: '',
  businessModel: '',
};

interface Toast {
  type: 'success' | 'error';
  message: string;
}

// Client-side quick compression to ensure lightning-fast gallery uploads
async function compressVentureImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const cleanName = file.name.replace(/\.[^.]+$/, '.webp');
            resolve(new File([blob], cleanName, { type: 'image/webp', lastModified: Date.now() }));
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export default function VentureAdmin() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVenture, setEditingVenture] = useState<Partial<Venture> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [deletingVenture, setDeletingVenture] = useState<Venture | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [capInput, setCapInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [galleryCaptionInput, setGalleryCaptionInput] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const normalizeGallery = (raw: any): VentureGalleryItem[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((item) => {
        if (typeof item === 'string') return { url: item, caption: '', description: '' };
        return {
          url: item?.url || '',
          caption: item?.caption || item?.description || '',
          description: item?.description || item?.caption || '',
        };
      }).filter((i) => Boolean(i.url));
    }
    return [];
  };

  const fetchVentures = async () => {
    setLoading(true);
    try {
      const data = await api.getVentures();
      setVentures(Array.isArray(data) ? (data as Venture[]) : []);
    } catch {
      showToast('error', 'Failed to load ventures.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentures();
    const handleUpdate = () => { fetchVentures(); };
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleUpdate);
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setEditingVenture({ ...EMPTY_FORM, order: ventures.length + 1, gallery: [] });
    setCapInput('');
    setTechInput('');
    setGalleryUrlInput('');
    setGalleryCaptionInput('');
    setModalOpen(true);
  };

  const openEdit = (v: Venture) => {
    const norm = normalizeGallery(v.gallery || v.galleryImages);
    setEditingVenture({ ...v, gallery: norm });
    setCapInput('');
    setTechInput('');
    setGalleryUrlInput('');
    setGalleryCaptionInput('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingVenture(null);
  };

  const handleChange = (field: keyof Venture, value: any) => {
    setEditingVenture((prev) => prev ? { ...prev, [field]: value } : prev);
    // Auto-slug from name
    if (field === 'name') {
      const slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setEditingVenture((prev) => prev ? { ...prev, name: value, slug, learnMoreUrl: `/ventures/${slug}` } : prev);
    }
  };

  const addCap = () => {
    if (!capInput.trim()) return;
    setEditingVenture((prev) => prev ? {
      ...prev,
      keyCapabilities: [...(prev.keyCapabilities || []), capInput.trim()]
    } : prev);
    setCapInput('');
  };

  const removeCap = (idx: number) => {
    setEditingVenture((prev) => prev ? {
      ...prev,
      keyCapabilities: (prev.keyCapabilities || []).filter((_, i) => i !== idx)
    } : prev);
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setEditingVenture((prev) => prev ? {
      ...prev,
      technologies: [...(prev.technologies || []), techInput.trim()]
    } : prev);
    setTechInput('');
  };

  const removeTech = (idx: number) => {
    setEditingVenture((prev) => prev ? {
      ...prev,
      technologies: (prev.technologies || []).filter((_, i) => i !== idx)
    } : prev);
  };

  // Gallery handlers
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    setUploadingGallery(true);
    try {
      const file = await compressVentureImage(rawFile);
      const res = await api.uploadImage(file);
      if (res?.url) {
        setGalleryUrlInput(res.url);
      }
    } catch (err) {
      console.warn('Backend upload failed, converting to local fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setGalleryUrlInput(String(event.target.result));
        }
      };
      reader.readAsDataURL(rawFile);
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const addGalleryItem = () => {
    if (!galleryUrlInput.trim()) return;
    const newItem: VentureGalleryItem = {
      url: galleryUrlInput.trim(),
      caption: galleryCaptionInput.trim(),
      description: galleryCaptionInput.trim(),
    };
    setEditingVenture((prev) => {
      if (!prev) return prev;
      const currentGallery = normalizeGallery(prev.gallery || prev.galleryImages);
      return {
        ...prev,
        gallery: [...currentGallery, newItem],
      };
    });
    setGalleryUrlInput('');
    setGalleryCaptionInput('');
  };

  const updateGalleryCaption = (idx: number, caption: string) => {
    setEditingVenture((prev) => {
      if (!prev) return prev;
      const currentGallery = [...normalizeGallery(prev.gallery || prev.galleryImages)];
      if (currentGallery[idx]) {
        currentGallery[idx] = { ...currentGallery[idx], caption, description: caption };
      }
      return { ...prev, gallery: currentGallery };
    });
  };

  const removeGalleryItem = (idx: number) => {
    setEditingVenture((prev) => {
      if (!prev) return prev;
      const currentGallery = normalizeGallery(prev.gallery || prev.galleryImages).filter((_, i) => i !== idx);
      return { ...prev, gallery: currentGallery };
    });
  };

  const moveGalleryItem = (idx: number, dir: 'up' | 'down') => {
    setEditingVenture((prev) => {
      if (!prev) return prev;
      const list = [...normalizeGallery(prev.gallery || prev.galleryImages)];
      const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, gallery: list };
    });
  };

  const handleSave = async () => {
    if (!editingVenture?.name) {
      showToast('error', 'Venture name is required.');
      return;
    }
    setSaving(true);
    try {
      const normGallery = normalizeGallery(editingVenture.gallery || editingVenture.galleryImages);
      const payload = {
        ...editingVenture,
        gallery: normGallery,
        galleryImages: normGallery.map((g) => g.url),
      };

      if (editingVenture.id) {
        await api.updateVenture(editingVenture.id, payload);
        showToast('success', `${editingVenture.name} updated successfully.`);
      } else {
        await api.createVenture(payload);
        showToast('success', `${editingVenture.name} created and published!`);
      }
      window.dispatchEvent(new Event('sarohub-data-updated'));
      await fetchVentures();
      closeModal();
    } catch (err: any) {
      console.error('Failed to save venture:', err);
      showToast('error', err?.message || 'Failed to save venture. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (v: Venture) => {
    try {
      await api.updateVenture(v.id, { ...v, published: !v.published });
      showToast('success', `${v.name} ${!v.published ? 'published' : 'unpublished'}.`);
      window.dispatchEvent(new Event('sarohub-data-updated'));
      fetchVentures();
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to update venture.');
    }
  };

  const handleToggleFeatured = async (v: Venture) => {
    try {
      await api.updateVenture(v.id, { ...v, featured: !v.featured });
      showToast('success', `${v.name} ${!v.featured ? 'marked as featured' : 'unmarked'}.`);
      window.dispatchEvent(new Event('sarohub-data-updated'));
      fetchVentures();
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to update venture.');
    }
  };

  const handleDeleteClick = (v: Venture) => {
    setDeletingVenture(v);
  };

  const confirmDelete = async () => {
    if (!deletingVenture) return;
    const v = deletingVenture;
    setIsDeleting(true);
    try {
      // Optimistically update list
      setVentures((prev) => prev.filter((item) => String(item.id) !== String(v.id) && item.slug !== v.slug));
      const targetIdentifier = v.id !== undefined && v.id !== null ? v.id : v.slug;
      await api.deleteVenture(targetIdentifier);
      showToast('success', `"${v.name}" deleted successfully.`);
      setDeletingVenture(null);
      window.dispatchEvent(new Event('sarohub-data-updated'));
      await fetchVentures();
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || err?.message || 'Failed to delete venture.');
      await fetchVentures();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (v: Venture, direction: 'up' | 'down') => {
    const sorted = [...ventures].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex((x) => x.id === v.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    try {
      await Promise.all([
        api.updateVenture(a.id, { ...a, order: b.order }),
        api.updateVenture(b.id, { ...b, order: a.order }),
      ]);
      fetchVentures();
    } catch {
      showToast('error', 'Failed to reorder.');
    }
  };

  const inputClass = 'w-full rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 transition-colors';
  const inputStyle = { backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)', color: 'var(--text-main)' };

  return (
    <div className="p-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg text-sm font-bold ${
          toast.type === 'success'
            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
            : 'bg-red-950 border-red-700 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-black" style={{ color: 'var(--text-main)' }}>Venture Manager</h2>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
            {ventures.filter(v => v.published).length} published · {ventures.length} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Venture
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        </div>
      ) : ventures.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ borderColor: 'var(--border-app)', color: 'var(--text-muted)' }}>
          <p className="text-sm font-medium">No ventures yet. Click "Add Venture" to create the first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...ventures].sort((a, b) => (a.order || 0) - (b.order || 0)).map((v, idx, arr) => (
            <div
              key={v.id}
              className="flex flex-wrap items-center gap-4 p-5 rounded-xl border transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
            >
              {/* Order */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleReorder(v, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-blue-500/10 disabled:opacity-30 cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <MoveUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleReorder(v, 'down')}
                  disabled={idx === arr.length - 1}
                  className="p-1 rounded hover:bg-blue-500/10 disabled:opacity-30 cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <MoveDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Number + Name */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    VENTURE {String(v.order || idx + 1).padStart(2, '0')}
                  </span>
                  {!v.published && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
                      Draft
                    </span>
                  )}
                  {v.featured && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--text-main)' }}>{v.name}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{v.category} · {v.status}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Preview */}
                <a
                  href={`/ventures/${v.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                  title="Preview"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                {/* Featured toggle */}
                <button
                  onClick={() => handleToggleFeatured(v)}
                  className="p-2 rounded-lg hover:bg-amber-500/10 transition-colors cursor-pointer"
                  title={v.featured ? 'Unmark featured' : 'Mark featured'}
                  style={{ color: v.featured ? '#f59e0b' : 'var(--text-muted)' }}
                >
                  {v.featured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                </button>
                {/* Publish toggle */}
                <button
                  onClick={() => handleTogglePublish(v)}
                  className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                  title={v.published ? 'Unpublish' : 'Publish'}
                  style={{ color: v.published ? '#22d3ee' : 'var(--text-muted)' }}
                >
                  {v.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                {/* Edit */}
                <button
                  onClick={() => openEdit(v)}
                  className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                  title="Edit"
                  style={{ color: 'var(--text-body)' }}
                >
                  <Edit className="h-4 w-4" />
                </button>
                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(v);
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer text-red-400"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && editingVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b z-10" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
              <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                {editingVenture.id ? `Edit: ${editingVenture.name}` : 'Add New Venture'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-white/5 cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  Venture Name *
                </label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  value={editingVenture.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. SaroHub Logistics"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                  URL Slug (auto-generated)
                </label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  value={editingVenture.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="e.g. sarohub-logistics"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Tagline</label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  value={editingVenture.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="e.g. Intelligent logistics for modern businesses."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Category</label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  value={editingVenture.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="e.g. Logistics • AI • SaaS"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Status</label>
                <select
                  className={inputClass}
                  style={inputStyle}
                  value={editingVenture.status || 'In Development'}
                  onChange={(e) => handleChange('status', e.target.value as VentureStatusType)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  className={inputClass}
                  style={inputStyle}
                  rows={4}
                  value={editingVenture.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="What does this venture do?"
                />
              </div>

              {/* Problem */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Problem</label>
                <textarea
                  className={inputClass}
                  style={inputStyle}
                  rows={3}
                  value={editingVenture.problem || ''}
                  onChange={(e) => handleChange('problem', e.target.value)}
                  placeholder="What problem does it solve?"
                />
              </div>

              {/* Solution */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Solution</label>
                <textarea
                  className={inputClass}
                  style={inputStyle}
                  rows={3}
                  value={editingVenture.solution || ''}
                  onChange={(e) => handleChange('solution', e.target.value)}
                  placeholder="How does it solve the problem?"
                />
              </div>

              {/* Industry / Target Market / Business Model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Industry</label>
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={editingVenture.industry || ''}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    placeholder="e.g. HealthTech"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Target Market</label>
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={editingVenture.targetMarket || ''}
                    onChange={(e) => handleChange('targetMarket', e.target.value)}
                    placeholder="Who is this for?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Business Model</label>
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={editingVenture.businessModel || ''}
                    onChange={(e) => handleChange('businessModel', e.target.value)}
                    placeholder="e.g. SaaS Subscription"
                  />
                </div>
              </div>

              {/* Key Capabilities */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Key Capabilities</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className={`flex-1 ${inputClass}`}
                    style={inputStyle}
                    value={capInput}
                    onChange={(e) => setCapInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCap())}
                    placeholder="Type capability and press Enter"
                  />
                  <button onClick={addCap} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingVenture.keyCapabilities || []).map((cap, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)', color: 'var(--text-body)' }}>
                      {cap}
                      <button onClick={() => removeCap(i)} className="ml-1 hover:text-red-400 cursor-pointer"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className={`flex-1 ${inputClass}`}
                    style={inputStyle}
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="e.g. React"
                  />
                  <button onClick={addTech} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingVenture.technologies || []).map((tech, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)', color: 'var(--text-body)' }}>
                      {tech}
                      <button onClick={() => removeTech(i)} className="ml-1 hover:text-red-400 cursor-pointer"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Website URL</label>
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={editingVenture.websiteUrl || ''}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Demo URL</label>
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={editingVenture.demoUrl || ''}
                    onChange={(e) => handleChange('demoUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Cover Image (URL or System Upload)"
                  value={editingVenture.coverImage || ''}
                  onChange={(url) => handleChange('coverImage', url)}
                  placeholder="https://... or upload from system"
                />
                <ImageUploadField
                  label="Logo (URL or System Upload)"
                  value={editingVenture.logo || ''}
                  onChange={(url) => handleChange('logo', url)}
                  placeholder="https://... or upload from system"
                />
              </div>

              {/* Venture Gallery & Screenshots with Caption / Description */}
              <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                      <ImageIcon className="h-4 w-4 text-cyan-400" />
                      Venture Gallery & Product Screenshots
                    </h4>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Upload images with custom descriptions/captions for the detail page gallery.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {(editingVenture.gallery || []).length} Images
                  </span>
                </div>

                {/* Input bar to add a new gallery item */}
                <div className="space-y-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Image URL or File Upload */}
                    <div className="sm:col-span-7">
                      <label className="block text-[10px] font-mono uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                        Image Source (URL or File Upload)
                      </label>
                      <div className="flex gap-2">
                        <input
                          className={inputClass}
                          style={inputStyle}
                          value={galleryUrlInput}
                          onChange={(e) => setGalleryUrlInput(e.target.value)}
                          placeholder="Paste image URL (https://...)"
                        />
                        <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors hover:border-cyan-500" style={{ borderColor: 'var(--border-app)', color: 'var(--text-main)' }}>
                          {uploadingGallery ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-cyan-400" />}
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleGalleryFileUpload}
                            disabled={uploadingGallery}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Caption / Description */}
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-mono uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                        Image Description / Caption
                      </label>
                      <input
                        className={inputClass}
                        style={inputStyle}
                        value={galleryCaptionInput}
                        onChange={(e) => setGalleryCaptionInput(e.target.value)}
                        placeholder="e.g. Dashboard Overview"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryItem())}
                      />
                    </div>
                  </div>

                  {/* Preview & Add Button */}
                  <div className="flex items-center justify-between pt-1">
                    {galleryUrlInput ? (
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                          <img src={galleryUrlInput} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-[11px] text-emerald-400 font-mono">Image selected</span>
                      </div>
                    ) : (
                      <span className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>Select an image or paste URL to add</span>
                    )}
                    <button
                      type="button"
                      onClick={addGalleryItem}
                      disabled={!galleryUrlInput.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add to Gallery
                    </button>
                  </div>
                </div>

                {/* Existing Gallery Images Grid */}
                {(editingVenture.gallery || []).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(editingVenture.gallery || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-3 rounded-xl border items-start group relative transition-all"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
                      >
                        {/* Thumbnail */}
                        <div className="h-16 w-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shrink-0 relative">
                          <img src={item.url} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                          <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Caption editing & actions */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <input
                            type="text"
                            value={item.caption || ''}
                            onChange={(e) => updateGalleryCaption(idx, e.target.value)}
                            placeholder="Add image description..."
                            className="w-full text-xs rounded-lg px-2.5 py-1 transition-colors border"
                            style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)', color: 'var(--text-main)' }}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] truncate max-w-[120px] font-mono" style={{ color: 'var(--text-muted)' }}>
                              {item.url}
                            </span>
                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => moveGalleryItem(idx, 'up')}
                                  className="p-1 rounded text-xs hover:text-cyan-400"
                                  style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-body)' }}
                                  title="Move up"
                                >
                                  <MoveUp className="h-3 w-3" />
                                </button>
                              )}
                              {idx < (editingVenture.gallery || []).length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveGalleryItem(idx, 'down')}
                                  className="p-1 rounded text-xs hover:text-cyan-400"
                                  style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-body)' }}
                                  title="Move down"
                                >
                                  <MoveDown className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeGalleryItem(idx)}
                                className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs ml-1"
                                title="Remove image"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed rounded-xl text-xs" style={{ borderColor: 'var(--border-app)', color: 'var(--text-muted)' }}>
                    No gallery images added yet. Upload screenshots above to showcase this venture on its detail page.
                  </div>
                )}
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVenture.published ?? true}
                    onChange={(e) => handleChange('published', e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-500"
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVenture.featured ?? true}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>Featured</span>
                </label>
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Display Order</label>
                <input
                  type="number"
                  className={inputClass}
                  style={inputStyle}
                  value={editingVenture.order ?? 1}
                  onChange={(e) => handleChange('order', parseInt(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:border-blue-400"
                style={{ borderColor: 'var(--border-app)', color: 'var(--text-body)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-60 cursor-pointer"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {editingVenture.id ? 'Update Venture' : 'Publish Venture'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
          <div className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-main)' }}>Delete Venture?</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-body)' }}>
              Are you sure you want to delete <span className="font-bold text-red-400">"{deletingVenture.name}"</span>? It will be permanently removed from your active venture portfolio.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingVenture(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all hover:bg-slate-800 disabled:opacity-50"
                style={{ borderColor: 'var(--border-app)', color: 'var(--text-body)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-red-600/20 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {isDeleting ? 'Deleting...' : 'Delete Venture'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
