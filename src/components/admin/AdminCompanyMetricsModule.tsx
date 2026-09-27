import React, { useState, useEffect } from 'react';
import { 
  Hash, Award, Users, GraduationCap, Briefcase, Globe, Cpu, 
  Sparkles, RefreshCw, Plus, Edit2, Trash2, Check, X, Eye, 
  EyeOff, ArrowUp, ArrowDown, Activity, Info, Database, Layers
} from 'lucide-react';
import { api } from '../../api';
import { CompanyMetric } from '../../types';

const ICON_OPTIONS = [
  { name: 'Award', icon: Award, label: 'Award' },
  { name: 'Users', icon: Users, label: 'Users / Community' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Graduation Cap / Education' },
  { name: 'Briefcase', icon: Briefcase, label: 'Briefcase / Projects' },
  { name: 'Globe', icon: Globe, label: 'Globe / International' },
  { name: 'Cpu', icon: Cpu, label: 'CPU / Technology' },
  { name: 'Sparkles', icon: Sparkles, label: 'Sparkles / Innovation' },
  { name: 'Activity', icon: Activity, label: 'Activity / Telemetry' }
];

const SOURCE_OPTIONS = [
  { value: 'products_ventures', label: 'Dynamic: Products & Ventures (db.products + db.ventures)' },
  { value: 'platform_users', label: 'Dynamic: Platform Users (Events + Subscribers + Applicants)' },
  { value: 'staff_mentors', label: 'Dynamic: Staff & Mentors (db.team_members * factor)' },
  { value: 'projects_clients', label: 'Dynamic: Delivered Projects (db.projects + student/sale projects)' },
  { value: 'custom', label: 'Manual Value (User-defined number)' }
];

export const AdminCompanyMetricsModule: React.FC = () => {
  const [metrics, setMetrics] = useState<CompanyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingItem, setEditingItem] = useState<CompanyMetric | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [formNumber, setFormNumber] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcon, setFormIcon] = useState('Award');
  const [formActive, setFormActive] = useState(true);
  const [formAutoCalc, setFormAutoCalc] = useState(true);
  const [formSource, setFormSource] = useState('products_ventures');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getCompanyMetrics();
      if (Array.isArray(data)) {
        setMetrics(data);
      }
    } catch (err: any) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleSyncRecalculate = async () => {
    setSyncing(true);
    try {
      await loadMetrics();
      window.dispatchEvent(new CustomEvent('sarohub-data-updated'));
      showFeedback('Live platform statistics recalculated & synced with database entities!');
    } catch (err) {
      showFeedback('Sync failed. Please check network connection.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleStartEdit = (metric: CompanyMetric) => {
    setEditingItem(metric);
    setIsNew(false);
    setFormNumber(metric.number || '');
    setFormLabel(metric.label || '');
    setFormDesc(metric.description || '');
    setFormIcon(metric.icon || 'Award');
    setFormActive(metric.active !== false);
    setFormAutoCalc(metric.auto_calculate !== false);
    setFormSource(metric.calculation_source || 'custom');
  };

  const handleStartNew = () => {
    setEditingItem({
      id: 0,
      number: '10+',
      label: 'New Platform Metric',
      description: 'Metric description and highlights',
      icon: 'Award',
      order: metrics.length + 1,
      active: true,
      auto_calculate: true,
      calculation_source: 'custom'
    });
    setIsNew(true);
    setFormNumber('10+');
    setFormLabel('');
    setFormDesc('');
    setFormIcon('Award');
    setFormActive(true);
    setFormAutoCalc(false);
    setFormSource('custom');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) {
      showFeedback('Metric label is required.', 'error');
      return;
    }

    const payload: Partial<CompanyMetric> = {
      number: formNumber.trim() || '0',
      label: formLabel.trim(),
      description: formDesc.trim(),
      icon: formIcon,
      active: formActive,
      auto_calculate: formAutoCalc,
      calculation_source: formSource
    };

    try {
      if (isNew) {
        await api.createCompanyMetric(payload);
        showFeedback('New metric added to "SaroHub in Numbers"!');
      } else if (editingItem) {
        await api.updateCompanyMetric(editingItem.id, payload);
        showFeedback(`Metric "${formLabel}" updated successfully!`);
      }
      setEditingItem(null);
      await loadMetrics();
      window.dispatchEvent(new CustomEvent('sarohub-data-updated'));
    } catch (err: any) {
      showFeedback(err.message || 'Error saving metric', 'error');
    }
  };

  const handleDelete = async (id: number, label: string) => {
    if (!window.confirm(`Are you sure you want to delete the metric "${label}"?`)) return;
    try {
      await api.deleteCompanyMetric(id);
      showFeedback(`Metric "${label}" deleted.`);
      await loadMetrics();
      window.dispatchEvent(new CustomEvent('sarohub-data-updated'));
    } catch (err: any) {
      showFeedback('Failed to delete metric.', 'error');
    }
  };

  const handleToggleActive = async (metric: CompanyMetric) => {
    try {
      await api.updateCompanyMetric(metric.id, { active: !metric.active });
      await loadMetrics();
      window.dispatchEvent(new CustomEvent('sarohub-data-updated'));
      showFeedback(`"${metric.label}" is now ${!metric.active ? 'Visible' : 'Hidden'} on website.`);
    } catch (err) {
      showFeedback('Failed to update status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <Hash className="h-3.5 w-3.5" />
            <span>Public Homepage &amp; About Section Stats</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            SaroHub in Numbers — Live Dynamic Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize the key metrics displayed in the "SaroHub in Numbers" section. You can switch between dynamic live database auto-calculation or set custom manual numbers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleSyncRecalculate}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            title="Recalculate dynamic counts from real database tables"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Recalculate Live Stats'}</span>
          </button>

          <button
            onClick={handleStartNew}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Metric</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between animate-fadeIn ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Database Context Pill Summary */}
      {metrics.length > 0 && metrics[0].live_stats && (
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
            <Database className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-semibold text-white">Live Connected Database Entities</span>
            <span className="text-slate-500">(Auto-calculation dynamically feeds from these real records)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-bold text-white block">{metrics[0].live_stats.products || 0}</span>
              <span className="text-[10px] font-mono text-slate-400">Products</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-bold text-white block">{metrics[0].live_stats.ventures || 0}</span>
              <span className="text-[10px] font-mono text-slate-400">Ventures</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-bold text-white block">{metrics[0].live_stats.projects || 0}</span>
              <span className="text-[10px] font-mono text-slate-400">Client Projects</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-bold text-white block">{metrics[0].live_stats.student_projects || 0}</span>
              <span className="text-[10px] font-mono text-slate-400">Student Builds</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-bold text-white block">{metrics[0].live_stats.team || 0}</span>
              <span className="text-[10px] font-mono text-slate-400">Team Members</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-bold text-white block">{metrics[0].live_stats.events || 0}</span>
              <span className="text-[10px] font-mono text-slate-400">Seminars/Events</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs font-bold text-white block">{metrics[0].live_stats.subscribers || 0}</span>
              <span className="text-[10px] font-mono text-slate-400">Subscribers</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit or Create Modal / Card */}
      {editingItem && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/30 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit2 className="h-4 w-4 text-blue-400" />
              <span>{isNew ? 'Create New Company Metric' : `Edit Metric: "${editingItem.label}"`}</span>
            </h3>
            <button
              onClick={() => setEditingItem(null)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Metric Label */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Metric Title / Label <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Products & Ventures, Platform Users..."
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Number / Value */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-400">
                    Display Number / Value <span className="text-rose-400">*</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] font-mono text-blue-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAutoCalc}
                      onChange={(e) => setFormAutoCalc(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                    />
                    <span>Auto-calculate dynamically</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  disabled={formAutoCalc}
                  placeholder="e.g. 10+, 500+, 60+, 99.9%"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 ${
                    formAutoCalc ? 'opacity-60 cursor-not-allowed bg-slate-900' : ''
                  }`}
                />
                {formAutoCalc && (
                  <p className="text-[10px] text-blue-400/80 font-mono mt-1">
                    ⚡ Computed in real-time from active database records.
                  </p>
                )}
              </div>

              {/* Calculation Source (when dynamic) */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Calculation Source Data
                </label>
                <select
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Card Icon
                </label>
                <select
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtitle / Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Subtitle / Clarification Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Active learners, administrators & businesses"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <label htmlFor="active-toggle" className="text-xs font-mono text-slate-300 cursor-pointer">
                  Display this metric publicly on the homepage &amp; about page
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Metric</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Metrics List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const IconDef = ICON_OPTIONS.find(i => i.name === metric.icon)?.icon || Briefcase;
          const isDynamic = metric.auto_calculate !== false;

          return (
            <div
              key={metric.id}
              className={`p-5 rounded-2xl border transition-all duration-200 bg-slate-900/50 backdrop-blur-sm ${
                metric.active !== false 
                  ? 'border-slate-800 hover:border-slate-700' 
                  : 'border-slate-800/40 opacity-50 bg-slate-950/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <IconDef className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-white tracking-tight">
                        {metric.number}
                      </span>
                      {isDynamic ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Dynamic Live
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          Static Custom
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 mt-0.5">
                      {metric.label}
                    </h3>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(metric)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      metric.active !== false
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                        : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                    }`}
                    title={metric.active !== false ? 'Visible on site' : 'Hidden from site'}
                  >
                    {metric.active !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={() => handleStartEdit(metric)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="Edit Metric"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(metric.id, metric.label)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-700/50 transition-colors"
                    title="Delete Metric"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {metric.description && (
                <p className="mt-3 text-xs text-slate-400 line-clamp-2">
                  {metric.description}
                </p>
              )}

              {/* Dynamic Live Breakdown Drawer (if available) */}
              {metric.live_breakdown && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Database Calculation Breakdown:</span>
                    <span>{metric.live_breakdown.items.length} items logged</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {metric.live_breakdown.items.slice(0, 3).map((it, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                        {it.name} {it.detail ? `(${it.detail})` : ''}
                      </span>
                    ))}
                    {metric.live_breakdown.items.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                        +{metric.live_breakdown.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
