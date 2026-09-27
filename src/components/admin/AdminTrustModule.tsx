import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, Star, Users, Briefcase, BookOpen, 
  Clock, Plus, Trash2, Edit, Check, X, RefreshCw, ExternalLink,
  Lock, CheckCircle2, MessageSquare, AlertCircle, FileText, ChevronRight,
  Play, Video, Eye, AlertTriangle, Sparkles, Volume2
} from 'lucide-react';
import { api } from '../../api';
import { 
  TrustBadge, ClientEndorsement, EngagementModel, LeadMagnet, 
  FeasibilityAudit, SolutionMatch, IpGuarantee 
} from '../../types';
import { getVideoEmbedInfo, normalizeVideoUrl } from '../../utils/videoEmbed';

export const AdminTrustModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'badges' | 'endorsements' | 'models' | 'magnets' | 'audits' | 'matches' | 'ip'>('badges');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [endorsements, setEndorsements] = useState<ClientEndorsement[]>([]);
  const [models, setModels] = useState<EngagementModel[]>([]);
  const [magnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [audits, setAudits] = useState<FeasibilityAudit[]>([]);
  const [matches, setSolutionMatches] = useState<SolutionMatch[]>([]);
  const [ipGuarantee, setIpGuarantee] = useState<IpGuarantee | null>(null);

  // Modal / Editing states
  const [editingBadge, setEditingBadge] = useState<Partial<TrustBadge> | null>(null);
  const [editingEndorsement, setEditingEndorsement] = useState<Partial<ClientEndorsement> | null>(null);
  const [editingModel, setEditingModel] = useState<Partial<EngagementModel> | null>(null);
  const [editingMagnet, setEditingMagnet] = useState<Partial<LeadMagnet> | null>(null);

  // In-app Delete Confirmation Target
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'badge' | 'endorsement' | 'model' | 'magnet' | 'audit' | 'match';
    id: number;
    title: string;
    subtitle?: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Video preview in admin
  const [adminActiveVideoUrl, setAdminActiveVideoUrl] = useState<string | null>(null);
  const [inModalVideoPreview, setInModalVideoPreview] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [b, e, m, l, a, s, ip] = await Promise.all([
        api.getTrustBadges().catch(() => []),
        api.getClientEndorsements().catch(() => []),
        api.getEngagementModels().catch(() => []),
        api.getLeadMagnets().catch(() => []),
        api.getFeasibilityAudits().catch(() => []),
        api.getSolutionMatches().catch(() => []),
        api.getIpGuarantee().catch(() => null)
      ]);
      setBadges(b || []);
      setEndorsements(e || []);
      setModels(m || []);
      setLeadMagnets(l || []);
      setAudits(a || []);
      setSolutionMatches(s || []);
      setIpGuarantee(ip);
    } catch (err) {
      console.error('Failed to load trust admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // --- SAFE IN-APP DELETE EXECUTION ---
  const executeDelete = async () => {
    if (!deleteConfirmTarget) return;
    const { type, id, title } = deleteConfirmTarget;
    setDeleting(true);
    try {
      if (type === 'badge') {
        await api.deleteTrustBadge(id);
        setBadges(prev => prev.filter(b => Number(b.id) !== id));
        if (editingBadge?.id === id) setEditingBadge(null);
        showNotification(`Trust badge "${title}" deleted successfully.`);
      } else if (type === 'endorsement') {
        await api.deleteClientEndorsement(id);
        setEndorsements(prev => prev.filter(e => Number(e.id) !== id));
        if (editingEndorsement?.id === id) setEditingEndorsement(null);
        showNotification(`Client endorsement "${title}" deleted successfully.`);
      } else if (type === 'model') {
        await api.deleteEngagementModel(id);
        setModels(prev => prev.filter(m => Number(m.id) !== id));
        if (editingModel?.id === id) setEditingModel(null);
        showNotification(`Engagement model "${title}" deleted successfully.`);
      } else if (type === 'magnet') {
        await api.deleteLeadMagnet(id);
        setLeadMagnets(prev => prev.filter(m => Number(m.id) !== id));
        if (editingMagnet?.id === id) setEditingMagnet(null);
        showNotification(`Resource guide "${title}" deleted.`);
      } else if (type === 'audit') {
        await api.deleteFeasibilityAudit(id);
        setAudits(prev => prev.filter(a => Number(a.id) !== id));
        showNotification(`Audit inquiry #${id} deleted.`);
      } else if (type === 'match') {
        await api.deleteSolutionMatch(id);
        setSolutionMatches(prev => prev.filter(s => Number(s.id) !== id));
        showNotification(`Diagnostic result #${id} deleted.`);
      }
      setDeleteConfirmTarget(null);
      loadAllData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete item', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Helper delete initiators (trigger in-app modal)
  const handleDeleteBadge = (id: number, title?: string) => {
    const b = badges.find(x => Number(x.id) === id);
    setDeleteConfirmTarget({
      type: 'badge',
      id,
      title: title || b?.badge_title || 'Trust Badge',
      subtitle: b?.platform
    });
  };

  const handleDeleteEndorsement = (id: number, title?: string) => {
    const e = endorsements.find(x => Number(x.id) === id);
    setDeleteConfirmTarget({
      type: 'endorsement',
      id,
      title: title || e?.client_name || 'Client Endorsement',
      subtitle: e?.company_name
    });
  };

  const handleDeleteModel = (id: number, title?: string) => {
    const m = models.find(x => Number(x.id) === id);
    setDeleteConfirmTarget({
      type: 'model',
      id,
      title: title || m?.title || 'Engagement Model',
      subtitle: m?.turnaround
    });
  };

  const handleDeleteMagnet = (id: number, title?: string) => {
    const mag = magnets.find(x => Number(x.id) === id);
    setDeleteConfirmTarget({
      type: 'magnet',
      id,
      title: title || mag?.title || 'Resource Guide',
      subtitle: mag?.category
    });
  };

  const handleDeleteAudit = (id: number) => {
    const a = audits.find(x => Number(x.id) === id);
    setDeleteConfirmTarget({
      type: 'audit',
      id,
      title: a?.project_name ? `Audit: ${a.project_name}` : `Audit #${id}`,
      subtitle: a ? `${a.full_name} (${a.email})` : undefined
    });
  };

  const handleDeleteMatch = (id: number) => {
    const s = matches.find(x => Number(x.id) === id);
    setDeleteConfirmTarget({
      type: 'match',
      id,
      title: s ? `Diagnostic: ${s.contact_name}` : `Diagnostic #${id}`,
      subtitle: s ? `${s.project_type} • ${s.email}` : undefined
    });
  };

  // --- BADGE SAVE ---
  const handleSaveBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBadge) return;
    try {
      if (editingBadge.id) {
        await api.updateTrustBadge(editingBadge.id, editingBadge);
        showNotification('Trust badge updated successfully.');
      } else {
        await api.createTrustBadge(editingBadge);
        showNotification('Trust badge created successfully.');
      }
      setEditingBadge(null);
      loadAllData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      showNotification(err.message || 'Failed to save badge', 'error');
    }
  };

  // --- ENDORSEMENT SAVE ---
  const handleSaveEndorsement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEndorsement) return;
    try {
      // Normalize video URL if provided
      const cleanedData = { ...editingEndorsement };
      if (cleanedData.video_url && cleanedData.video_url.trim()) {
        cleanedData.video_url = normalizeVideoUrl(cleanedData.video_url.trim());
        if (!cleanedData.media_type || cleanedData.media_type === 'quote') {
          cleanedData.media_type = 'video';
        }
      }

      if (cleanedData.id) {
        await api.updateClientEndorsement(cleanedData.id, cleanedData);
        showNotification('Client endorsement updated.');
      } else {
        await api.createClientEndorsement(cleanedData);
        showNotification('Client endorsement created.');
      }
      setEditingEndorsement(null);
      setInModalVideoPreview(false);
      loadAllData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      showNotification(err.message || 'Failed to save endorsement', 'error');
    }
  };

  // --- MODEL SAVE ---
  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;
    try {
      const dataToSave = { ...editingModel };
      if (typeof dataToSave.features === 'string') {
        dataToSave.features = (dataToSave.features as string)
          .split('\n')
          .map(f => f.trim())
          .filter(Boolean);
      }

      if (editingModel.id) {
        await api.updateEngagementModel(editingModel.id, dataToSave);
        showNotification('Engagement model updated.');
      } else {
        await api.createEngagementModel(dataToSave);
        showNotification('Engagement model created.');
      }
      setEditingModel(null);
      loadAllData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      showNotification(err.message || 'Failed to save model', 'error');
    }
  };

  // --- LEAD MAGNET SAVE ---
  const handleSaveMagnet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMagnet) return;
    try {
      const dataToSave = { ...editingMagnet };
      if (typeof dataToSave.key_takeaways === 'string') {
        dataToSave.key_takeaways = (dataToSave.key_takeaways as string)
          .split('\n')
          .map(k => k.trim())
          .filter(Boolean);
      }

      if (editingMagnet.id) {
        await api.updateLeadMagnet(editingMagnet.id, dataToSave);
        showNotification('Resource guide updated.');
      } else {
        await api.createLeadMagnet(dataToSave);
        showNotification('Resource guide created.');
      }
      setEditingMagnet(null);
      loadAllData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      showNotification(err.message || 'Failed to save resource guide', 'error');
    }
  };

  // --- AUDIT UPDATE ---
  const handleUpdateAudit = async (id: number, status: any, admin_notes?: string) => {
    try {
      await api.updateFeasibilityAudit(id, { status, admin_notes });
      showNotification('Audit status updated.');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update audit', 'error');
    }
  };

  // --- IP GUARANTEE SAVE ---
  const handleSaveIpGuarantee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipGuarantee) return;
    try {
      await api.updateIpGuarantee(ipGuarantee);
      showNotification('IP & Bilateral NDA settings saved.');
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      showNotification(err.message || 'Failed to save IP settings', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            Conversion & Enterprise Trust CMS
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Trust Badges, Endorsements, Engagement Models & Audits
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamically control all high-conversion trust elements, client video/audio testimonials, transparent models, and incoming 48-hour audit requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in ${
          message.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'badges', label: 'Trust Badges', count: badges.length, icon: <Award className="w-4 h-4" /> },
          { id: 'endorsements', label: 'Client Endorsements & Videos', count: endorsements.length, icon: <Star className="w-4 h-4" /> },
          { id: 'models', label: 'Engagement Models', count: models.length, icon: <Briefcase className="w-4 h-4" /> },
          { id: 'magnets', label: 'Executive Blueprints', count: magnets.length, icon: <BookOpen className="w-4 h-4" /> },
          { id: 'audits', label: '48h Audit Requests', count: audits.length, icon: <Clock className="w-4 h-4" /> },
          { id: 'matches', label: 'Diagnostic Leads', count: matches.length, icon: <Users className="w-4 h-4" /> },
          { id: 'ip', label: 'IP & NDA Guarantee', count: null, icon: <Lock className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-trust-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: TRUST BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Third-Party Accreditation & Review Badges
            </h3>
            <button
              onClick={() => setEditingBadge({ platform: '', badge_title: '', rating_score: '5.0', review_count: 'Verified Reviews', badge_icon: 'Award', external_url: '', is_active: true, sort_order: badges.length + 1 })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Review Badge
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400">{b.platform}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.is_active ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {b.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{b.badge_title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Rating: <strong className="text-slate-700 dark:text-slate-200">{b.rating_score}</strong> • {b.review_count}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Order: {b.sort_order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingBadge(b)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Badge"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBadge(b.id, b.badge_title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      title="Delete Badge"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT ENDORSEMENTS & VIDEOS */}
      {activeTab === 'endorsements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Client Endorsements (Video, Audio & Outcome Quotes)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports YouTube, Loom, Vimeo, and direct video testimonials with instant interactive playback.
              </p>
            </div>
            <button
              onClick={() => setEditingEndorsement({ client_name: '', client_title: '', company_name: '', project_title: '', quote: '', outcome_metric: '', media_type: 'quote', video_url: '', audio_url: '', rating: 5, is_featured: true, sort_order: endorsements.length + 1 })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Endorsement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endorsements.map((e) => {
              const videoInfo = e.video_url ? getVideoEmbedInfo(e.video_url) : null;
              return (
                <div key={e.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{e.client_name}</span>
                        <span className="text-xs text-slate-500">({e.company_name})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {videoInfo && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            videoInfo.provider === 'youtube'
                              ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                              : videoInfo.provider === 'loom'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          }`}>
                            {videoInfo.provider === 'youtube' ? 'YouTube' : videoInfo.provider === 'loom' ? 'Loom' : 'Video'}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase">
                          {e.media_type}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{e.project_title}</div>
                    {e.outcome_metric && (
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                        Outcome: {e.outcome_metric}
                      </div>
                    )}
                    <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3 mb-3">
                      "{e.quote}"
                    </blockquote>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        Rating: {e.rating || 5}★
                      </span>
                      {e.video_url && (
                        <button
                          onClick={() => setAdminActiveVideoUrl(e.video_url || null)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[11px] font-semibold hover:bg-red-100"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" /> Preview Video
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingEndorsement(e);
                          setInModalVideoPreview(false);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Endorsement"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEndorsement(e.id, e.client_name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                        title="Delete Endorsement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ENGAGEMENT MODELS */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Transparent Delivery & Engagement Models
            </h3>
            <button
              onClick={() => setEditingModel({ title: '', tagline: '', turnaround: '', pricing_type: '', ip_ownership: '100% IP Transfer upon completion', team_structure: '', best_for: '', features: [], sla_guarantee: '', cta_label: 'Get Started', cta_link: '/estimate' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Model
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((m) => (
              <div key={m.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">{m.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">{m.turnaround}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{m.tagline}</p>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mb-1">
                    <strong>Pricing:</strong> {m.pricing_type}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mb-1">
                    <strong>IP Terms:</strong> {m.ip_ownership}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <strong>SLA:</strong> {m.sla_guarantee}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">CTA: {m.cta_label} ({m.cta_link})</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingModel(m)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <Edit className="w-3 h-3" /> Edit Model
                    </button>
                    <button
                      onClick={() => handleDeleteModel(m.id, m.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      title="Delete Model"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LEAD MAGNETS */}
      {activeTab === 'magnets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Downloadable Whitepapers & Executive Blueprints
            </h3>
            <button
              onClick={() => setEditingMagnet({ title: '', category: 'Executive Whitepaper', pages: 'PDF Guide', description: '', cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600&h=400', key_takeaways: [], is_featured: true })}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Resource Guide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {magnets.map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{m.category}</span>
                    <span className="text-[11px] text-slate-400">{m.pages}</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">{m.title}</div>
                  <p className="text-xs text-slate-500 mb-2">{m.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Downloads: {m.downloads_count || 0}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingMagnet(m)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Guide"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMagnet(m.id, m.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      title="Delete Guide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 48-HOUR FEASIBILITY AUDITS CRM */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              48-Hour Technical Feasibility & Architecture Inquiries
            </h3>
            <span className="text-xs text-slate-400">Total: {audits.length} Requests</span>
          </div>

          {audits.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No audit requests received yet. Submissions from the website will appear here in real-time.
            </div>
          ) : (
            <div className="space-y-3">
              {audits.map((a) => (
                <div key={a.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">{a.full_name}</span>
                        <span className="text-xs text-slate-500">({a.email} {a.phone && `• ${a.phone}`})</span>
                      </div>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                        Project: {a.project_name} • Company: {a.company || 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={a.status}
                        onChange={(e) => handleUpdateAudit(a.id, e.target.value as any, a.admin_notes)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <button
                        onClick={() => handleDeleteAudit(a.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                        title="Delete Audit Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mb-3">
                    <div><strong>Stage:</strong> {a.project_stage}</div>
                    <div><strong>Timeline:</strong> {a.timeline}</div>
                    <div><strong>Budget:</strong> {a.budget_range}</div>
                  </div>

                  {a.repo_or_spec_link && (
                    <div className="text-xs mb-2">
                      <strong>Repo / Spec:</strong>{' '}
                      <a href={a.repo_or_spec_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                        {a.repo_or_spec_link} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {a.challenges && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                      <strong>Key Challenges:</strong> {a.challenges}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Received: {new Date(a.created_at).toLocaleString()}</span>
                    <a
                      href={`mailto:${a.email}?subject=Your%20SaroHub%2048-Hour%20Technical%20Feasibility%20Audit`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Email Client Directly
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: DIAGNOSTIC MATCHES */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Interactive Solution Diagnostic Submissions
            </h3>
            <span className="text-xs text-slate-400">Total: {matches.length} Leads</span>
          </div>

          {matches.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No diagnostic wizard submissions recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{s.contact_name} ({s.email})</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {s.project_type} • Stage: {s.stage} • Model: <strong className="text-blue-600">{s.recommended_model}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Stack: {(s.recommended_stack || []).join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{new Date(s.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDeleteMatch(s.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      title="Delete Submission"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: NDA & IP GUARANTEE SETTINGS */}
      {activeTab === 'ip' && ipGuarantee && (
        <form onSubmit={handleSaveIpGuarantee} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Bilateral NDA & Intellectual Property Ownership Guarantee Terms
            </h3>
            <p className="text-xs text-slate-500">
              Update the legal guarantees and covenants presented to enterprise prospects across the website.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Guarantee Headline
            </label>
            <input
              type="text"
              value={ipGuarantee.guarantee_headline}
              onChange={(e) => setIpGuarantee({ ...ipGuarantee, guarantee_headline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subheading / Promise
            </label>
            <textarea
              rows={2}
              value={ipGuarantee.guarantee_subheading}
              onChange={(e) => setIpGuarantee({ ...ipGuarantee, guarantee_subheading: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bilateral NDA Policy
            </label>
            <textarea
              rows={2}
              value={ipGuarantee.bilateral_nda_policy}
              onChange={(e) => setIpGuarantee({ ...ipGuarantee, bilateral_nda_policy: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              100% Code & IP Ownership Terms
            </label>
            <textarea
              rows={2}
              value={ipGuarantee.code_ownership_terms}
              onChange={(e) => setIpGuarantee({ ...ipGuarantee, code_ownership_terms: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Code Escrow & Git Repositories Handover
            </label>
            <textarea
              rows={2}
              value={ipGuarantee.escrow_and_repos}
              onChange={(e) => setIpGuarantee({ ...ipGuarantee, escrow_and_repos: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
            >
              Save IP & NDA Terms
            </button>
          </div>
        </form>
      )}

      {/* MODAL: EDIT/ADD BADGE */}
      {editingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingBadge.id ? 'Edit Trust Badge' : 'Add Trust Badge'}
              </h3>
              <button onClick={() => setEditingBadge(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveBadge} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Platform Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clutch, GoodFirms, Google"
                  value={editingBadge.platform || ''}
                  onChange={(e) => setEditingBadge({ ...editingBadge, platform: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Badge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Top Custom Software Developers 2025"
                  value={editingBadge.badge_title || ''}
                  onChange={(e) => setEditingBadge({ ...editingBadge, badge_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Rating Score</label>
                  <input
                    type="text"
                    placeholder="4.9 / 5.0"
                    value={editingBadge.rating_score || ''}
                    onChange={(e) => setEditingBadge({ ...editingBadge, rating_score: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Review Count</label>
                  <input
                    type="text"
                    placeholder="38+ Verified Reviews"
                    value={editingBadge.review_count || ''}
                    onChange={(e) => setEditingBadge({ ...editingBadge, review_count: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Verification Link</label>
                <input
                  type="text"
                  placeholder="https://clutch.co/profile/..."
                  value={editingBadge.external_url || ''}
                  onChange={(e) => setEditingBadge({ ...editingBadge, external_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="badge_active"
                  checked={editingBadge.is_active ?? true}
                  onChange={(e) => setEditingBadge({ ...editingBadge, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="badge_active" className="text-xs font-semibold">Active & Visible on Website</label>
              </div>
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {editingBadge.id ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteBadge(editingBadge.id!, editingBadge.badge_title)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Badge
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingBadge(null)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">Save Badge</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD ENDORSEMENT WITH ADVANCED VIDEO SUPPORT */}
      {editingEndorsement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingEndorsement.id ? 'Edit Client Endorsement' : 'Add Client Endorsement'}
              </h3>
              <button onClick={() => setEditingEndorsement(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveEndorsement} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alistair Vance"
                    value={editingEndorsement.client_name || ''}
                    onChange={(e) => setEditingEndorsement({ ...editingEndorsement, client_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Title / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. CEO & Founder"
                    value={editingEndorsement.client_title || ''}
                    onChange={(e) => setEditingEndorsement({ ...editingEndorsement, client_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OmniHealth Cloud"
                    value={editingEndorsement.company_name || ''}
                    onChange={(e) => setEditingEndorsement({ ...editingEndorsement, company_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Country / City</label>
                  <input
                    type="text"
                    placeholder="United Kingdom"
                    value={editingEndorsement.country || ''}
                    onChange={(e) => setEditingEndorsement({ ...editingEndorsement, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Telehealth & AI Triage Platform"
                  value={editingEndorsement.project_title || ''}
                  onChange={(e) => setEditingEndorsement({ ...editingEndorsement, project_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Outcome Metric Tag</label>
                <input
                  type="text"
                  placeholder="e.g. £1.4M Seed Closed • 7-Week Delivery"
                  value={editingEndorsement.outcome_metric || ''}
                  onChange={(e) => setEditingEndorsement({ ...editingEndorsement, outcome_metric: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Testimonial Quote *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write the verified testimonial quote..."
                  value={editingEndorsement.quote || ''}
                  onChange={(e) => setEditingEndorsement({ ...editingEndorsement, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Media Type</label>
                  <select
                    value={editingEndorsement.media_type || 'quote'}
                    onChange={(e) => setEditingEndorsement({ ...editingEndorsement, media_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="quote">Text Quote Only</option>
                    <option value="video">Video Testimonial</option>
                    <option value="audio">Audio Voice Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingEndorsement.rating || 5}
                    onChange={(e) => setEditingEndorsement({ ...editingEndorsement, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* VIDEO URL FIELD WITH YOUTUBE & LOOM PRESETS & PREVIEW */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    Video Link (YouTube, Loom, Vimeo, Direct MP4)
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        const sample = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                        setEditingEndorsement(prev => prev ? ({ ...prev, video_url: sample, media_type: 'video' }) : null);
                      }}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      + YouTube Sample
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sample = 'https://www.loom.com/share/e5d17961db474a5ea79c78d40733baee';
                        setEditingEndorsement(prev => prev ? ({ ...prev, video_url: sample, media_type: 'video' }) : null);
                      }}
                      className="text-purple-600 hover:underline font-semibold"
                    >
                      + Loom Sample
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Paste YouTube, Loom, or Vimeo URL..."
                  value={editingEndorsement.video_url || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingEndorsement(prev => prev ? ({ 
                      ...prev, 
                      video_url: val,
                      media_type: val.trim() ? 'video' : prev.media_type
                    }) : null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />

                {/* Video Info Status & Live Preview Toggle */}
                {editingEndorsement.video_url && (() => {
                  const info = getVideoEmbedInfo(editingEndorsement.video_url);
                  return (
                    <div className="mt-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-2 text-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {info.provider === 'youtube' && (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase">
                              YouTube Video Detected
                            </span>
                          )}
                          {info.provider === 'loom' && (
                            <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold uppercase">
                              Loom Video Detected
                            </span>
                          )}
                          {info.provider === 'vimeo' && (
                            <span className="px-2 py-0.5 rounded bg-sky-600 text-white text-[10px] font-bold uppercase">
                              Vimeo Video Detected
                            </span>
                          )}
                          {info.isDirectVideo && (
                            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase">
                              Direct Video File
                            </span>
                          )}
                          {info.videoId && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              ID: {info.videoId}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {info.embedUrl !== editingEndorsement.video_url && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEndorsement(prev => prev ? ({ ...prev, video_url: info.embedUrl, media_type: 'video' }) : null);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              <Sparkles className="w-3 h-3" /> Auto-Format Embed
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setInModalVideoPreview(!inModalVideoPreview)}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200"
                          >
                            <Play className="w-2.5 h-2.5" />
                            {inModalVideoPreview ? 'Hide Preview' : 'Test Preview'}
                          </button>
                        </div>
                      </div>

                      {/* In-Modal Player Preview */}
                      {inModalVideoPreview && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-black aspect-video w-full">
                          {info.isDirectVideo ? (
                            <video src={editingEndorsement.video_url} controls className="w-full h-full object-contain" />
                          ) : (
                            <iframe
                              src={info.embedUrl}
                              title="Test Video Preview"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Audio URL (Optional MP3/OGG snippet)</label>
                <input
                  type="text"
                  placeholder="https://.../audio.mp3"
                  value={editingEndorsement.audio_url || ''}
                  onChange={(e) => setEditingEndorsement({ ...editingEndorsement, audio_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {editingEndorsement.id ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteEndorsement(editingEndorsement.id!, editingEndorsement.client_name)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Endorsement
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingEndorsement(null)} className="px-4 py-2 rounded-xl border text-xs font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                    Save Endorsement
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD ENGAGEMENT MODEL */}
      {editingModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingModel.id ? 'Edit Engagement Model' : 'Add Engagement Model'}
              </h3>
              <button onClick={() => setEditingModel(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveModel} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Model Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Fixed-Scope MVP Sprint"
                  value={editingModel.title || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="Rapid, de-risked validation..."
                  value={editingModel.tagline || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    placeholder="4 - 8 Weeks"
                    value={editingModel.turnaround || ''}
                    onChange={(e) => setEditingModel({ ...editingModel, turnaround: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Pricing Type</label>
                  <input
                    type="text"
                    placeholder="Milestone-Based Fixed Budget"
                    value={editingModel.pricing_type || ''}
                    onChange={(e) => setEditingModel({ ...editingModel, pricing_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">IP Ownership Terms</label>
                <input
                  type="text"
                  placeholder="100% IP Transfer upon completion"
                  value={editingModel.ip_ownership || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, ip_ownership: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Team Structure</label>
                <input
                  type="text"
                  placeholder="Dedicated Tech Lead + UI/UX Designer + QA Lead"
                  value={editingModel.team_structure || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, team_structure: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Key Features (One per line)</label>
                <textarea
                  rows={4}
                  placeholder="Rigorous discovery document&#10;Click-through Figma prototype&#10;TypeScript & Node.js architecture"
                  value={Array.isArray(editingModel.features) ? editingModel.features.join('\n') : (editingModel.features || '')}
                  onChange={(e) => setEditingModel({ ...editingModel, features: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">SLA & Commitment</label>
                <input
                  type="text"
                  placeholder="Guaranteed on-time milestone delivery"
                  value={editingModel.sla_guarantee || ''}
                  onChange={(e) => setEditingModel({ ...editingModel, sla_guarantee: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">CTA Label</label>
                  <input
                    type="text"
                    placeholder="Calculate MVP Scope"
                    value={editingModel.cta_label || ''}
                    onChange={(e) => setEditingModel({ ...editingModel, cta_label: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">CTA Link</label>
                  <input
                    type="text"
                    placeholder="/estimate or /book"
                    value={editingModel.cta_link || ''}
                    onChange={(e) => setEditingModel({ ...editingModel, cta_link: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {editingModel.id ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteModel(editingModel.id!, editingModel.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Model
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingModel(null)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">Save Model</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD LEAD MAGNET */}
      {editingMagnet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingMagnet.id ? 'Edit Resource Guide' : 'Add Resource Guide'}
              </h3>
              <button onClick={() => setEditingMagnet(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveMagnet} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Guide Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025 Enterprise SaaS Architecture Blueprint"
                  value={editingMagnet.title || ''}
                  onChange={(e) => setEditingMagnet({ ...editingMagnet, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Executive Whitepaper"
                    value={editingMagnet.category || ''}
                    onChange={(e) => setEditingMagnet({ ...editingMagnet, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Pages / Format</label>
                  <input
                    type="text"
                    placeholder="24-Page PDF Guide"
                    value={editingMagnet.pages || ''}
                    onChange={(e) => setEditingMagnet({ ...editingMagnet, pages: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of what the guide covers..."
                  value={editingMagnet.description || ''}
                  onChange={(e) => setEditingMagnet({ ...editingMagnet, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingMagnet.cover_image || ''}
                  onChange={(e) => setEditingMagnet({ ...editingMagnet, cover_image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Key Takeaways (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="PostgreSQL partitioning strategies&#10;Stateless JWT authentication&#10;Container optimization"
                  value={Array.isArray(editingMagnet.key_takeaways) ? editingMagnet.key_takeaways.join('\n') : (editingMagnet.key_takeaways || '')}
                  onChange={(e) => setEditingMagnet({ ...editingMagnet, key_takeaways: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {editingMagnet.id ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteMagnet(editingMagnet.id!, editingMagnet.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Resource
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingMagnet(null)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">Save Guide</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL IN-APP DELETE CONFIRMATION MODAL */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                {deleteConfirmTarget.title}
                {deleteConfirmTarget.subtitle && (
                  <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                    {deleteConfirmTarget.subtitle}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-red-500 font-semibold pt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirmTarget(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={executeDelete}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN IN-APP VIDEO PREVIEW MODAL */}
      {adminActiveVideoUrl && (() => {
        const info = getVideoEmbedInfo(adminActiveVideoUrl);
        const embedSrc = info.embedUrl.includes('?') ? `${info.embedUrl}&autoplay=1` : `${info.embedUrl}?autoplay=1`;
        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
            <div className="relative w-full max-w-3xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-white text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-red-500 fill-current" />
                  <span>Client Video Testimonial Preview</span>
                  {info.provider === 'youtube' && (
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase">YouTube</span>
                  )}
                  {info.provider === 'loom' && (
                    <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold uppercase">Loom</span>
                  )}
                  {info.provider === 'vimeo' && (
                    <span className="px-2 py-0.5 rounded bg-sky-600 text-white text-[10px] font-bold uppercase">Vimeo</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={adminActiveVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs transition-colors"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setAdminActiveVideoUrl(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="aspect-video w-full bg-black">
                {info.isDirectVideo ? (
                  <video src={adminActiveVideoUrl} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                  <iframe
                    src={embedSrc}
                    title="Video Preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
