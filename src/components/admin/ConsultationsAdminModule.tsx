import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Video, Phone, Mail, Building2, 
  DollarSign, CheckCircle2, AlertCircle, Trash2, Search,
  RefreshCw, MessageCircle, ExternalLink, Filter, Edit3,
  CalendarCheck, User, ArrowUpRight
} from 'lucide-react';
import { api } from '../../api';

export default function ConsultationsAdminModule() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [deletingConsultation, setDeletingConsultation] = useState<any | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const companyWhatsappClean = '923430381473';

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  };

  const loadConsultations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getConsultations();
      setConsultations(data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch booked consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.updateConsultationStatus(id, newStatus);
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      showToast('success', `Consultation status changed to "${newStatus}".`);
    } catch (err: any) {
      showToast('error', `Failed to update status: ${err?.message || 'Unknown error'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: number) => {
    setUpdatingId(id);
    try {
      const existing = consultations.find(c => c.id === id);
      await api.updateConsultationStatus(id, existing?.status || 'Confirmed', noteDraft);
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, notes: noteDraft } : c));
      setEditingNotesId(null);
      showToast('success', 'Consultation notes updated successfully.');
    } catch (err: any) {
      showToast('error', `Failed to save notes: ${err?.message || 'Unknown error'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async (id: number) => {
    setUpdatingId(id);
    try {
      await api.deleteConsultation(id);
      setConsultations(prev => prev.filter(c => c.id !== id));
      setDeletingConsultation(null);
      showToast('success', 'Consultation record deleted successfully.');
    } catch (err: any) {
      showToast('error', `Failed to delete consultation: ${err?.message || 'Server error'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const stats = useMemo(() => {
    const total = consultations.length;
    const confirmed = consultations.filter(c => c.status === 'Confirmed').length;
    const completed = consultations.filter(c => c.status === 'Completed').length;
    const today = consultations.filter(c => c.scheduled_date === todayStr).length;
    return { total, confirmed, completed, today };
  }, [consultations, todayStr]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => {
      // Status filter
      if (statusFilter !== 'ALL' && c.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (c.client_name || '').toLowerCase().includes(q);
        const matchesEmail = (c.client_email || '').toLowerCase().includes(q);
        const matchesCompany = (c.company_name || '').toLowerCase().includes(q);
        const matchesDate = (c.scheduled_date || '').toLowerCase().includes(q);
        const matchesTrack = (c.consultation_type || '').toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesCompany || matchesDate || matchesTrack;
      }
      return true;
    });
  }, [consultations, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Client Consultations & Discovery Sessions
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
              {consultations.length} Booked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time client booking ledger. Auto-synced with company WhatsApp (+92 3430381473) & leadership email (mehdi.sarohub@gmail.com).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadConsultations}
            disabled={loading}
            className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Action Toast Banner */}
      {toast && (
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
          toast.type === 'success' 
            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{toast.text}</span>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-xs font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Bookings</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">All time consultations</div>
        </div>

        <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
          <div className="text-[11px] font-mono uppercase text-emerald-400">Confirmed / Upcoming</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.confirmed}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Active client calendar pipeline</div>
        </div>

        <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4">
          <div className="text-[11px] font-mono uppercase text-blue-400">Scheduled Today</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">{stats.today}</div>
          <div className="text-[10px] text-blue-400 mt-0.5">Calls on {todayStr}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-[11px] font-mono uppercase text-slate-400">Completed Sessions</div>
          <div className="text-2xl font-bold text-slate-300 mt-1">{stats.completed}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Converted discovery meetings</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, email, track, date..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Consultations List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          Loading client consultation ledger...
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8">
          <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No Consultations Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL' 
              ? 'No consultation records match the active search and filter criteria.' 
              : 'No clients have booked technical consultations yet. When bookings arrive via /book, they will appear here instantly.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((item) => {
            const isToday = item.scheduled_date === todayStr;
            const clientPhoneClean = (item.client_phone || '').replace(/\D/g, '');

            return (
              <div 
                key={item.id}
                className={`rounded-2xl border transition-all p-5 backdrop-blur-sm ${
                  isToday 
                    ? 'border-cyan-500/50 bg-slate-900/90 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-950/30' 
                    : item.status === 'Completed'
                    ? 'border-slate-800/80 bg-slate-900/40 opacity-80'
                    : item.status === 'Cancelled'
                    ? 'border-rose-900/30 bg-slate-950/50 opacity-60'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/80 pb-4 mb-4">
                  {/* Client identity */}
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-base text-white">{item.client_name}</span>
                      {item.company_name && (
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {item.company_name}
                        </span>
                      )}
                      {isToday && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                          Meeting Today
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`mailto:${item.client_email}`} className="text-blue-400 hover:underline">
                          {item.client_email}
                        </a>
                      </span>
                      {item.client_phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-300 font-mono">{item.client_phone}</span>
                        </span>
                      )}
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-mono">Booked: {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Date, Time & Status Pill */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        {item.scheduled_date}
                      </div>
                      <div className="text-xs font-semibold text-slate-300 flex items-center gap-1 justify-end mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {item.scheduled_time}
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-7 cursor-pointer focus:outline-none ${
                          item.status === 'Confirmed'
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : item.status === 'Completed'
                            ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                            : item.status === 'Rescheduled'
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                            : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <Filter className="w-3 h-3 absolute right-2 top-2.5 pointer-events-none text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-500 font-semibold block mb-1">Consultation Track:</span>
                    <span className="font-bold text-slate-200">{item.consultation_type}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-500 font-semibold block mb-1">Platform & Meeting Access:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{item.meeting_platform}</span>
                      {item.meeting_link && (
                        <a
                          href={item.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono font-bold"
                        >
                          Join Call
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-500 font-semibold block mb-1">Budget Expectation:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {item.estimated_budget || 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* Project Summary */}
                {item.project_summary && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs mb-4">
                    <span className="text-slate-400 font-bold block mb-1">Client Project Brief / Technical Requirements:</span>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{item.project_summary}"
                    </p>
                  </div>
                )}

                {/* Admin Internal Notes */}
                <div className="mb-4">
                  {editingNotesId === item.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Add private meeting notes, client requirements, or action items..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveNotes(item.id)}
                          disabled={updatingId === item.id}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                        >
                          Save Notes
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/30 px-3 py-2 rounded-lg border border-slate-800/50">
                      <div>
                        <strong className="text-slate-300 mr-1.5">Internal Notes:</strong>
                        <span>{item.notes || 'No notes added yet.'}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNotesId(item.id);
                          setNoteDraft(item.notes || '');
                        }}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* WhatsApp Client Direct */}
                    {clientPhoneClean && (
                      <a
                        href={`https://wa.me/${clientPhoneClean}?text=${encodeURIComponent(
                          `Hello ${item.client_name},\n\nThis is SaroHub Technologies regarding your upcoming consultation on ${item.scheduled_date} at ${item.scheduled_time} (${item.consultation_type}). Looking forward to connecting!\n\nMeeting link: ${item.meeting_link}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        WhatsApp Client
                      </a>
                    )}

                    {/* Forward/Alert to Company Leadership WhatsApp */}
                    <a
                      href={`https://wa.me/${companyWhatsappClean}?text=${encodeURIComponent(
                        `🚨 CONSULTATION RECORD (ID #${item.id})\n` +
                        `👤 Client: ${item.client_name}\n` +
                        `🏢 Company: ${item.company_name || 'N/A'}\n` +
                        `📧 Email: ${item.client_email}\n` +
                        `📱 Phone: ${item.client_phone || 'N/A'}\n` +
                        `📅 Date: ${item.scheduled_date}\n` +
                        `⏰ Time: ${item.scheduled_time}\n` +
                        `💻 Platform: ${item.meeting_platform}\n` +
                        `🔗 Link: ${item.meeting_link}\n` +
                        `💰 Budget: ${item.estimated_budget}\n` +
                        `📝 Status: ${item.status}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                      Company Desk WhatsApp (+92 3430381473)
                    </a>

                    {/* Email Client Direct */}
                    <a
                      href={`mailto:${item.client_email}?subject=${encodeURIComponent(`SaroHub Technical Consultation Confirmation - ${item.scheduled_date}`)}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Client
                    </a>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeletingConsultation(item)}
                    disabled={updatingId === item.id}
                    className="px-2.5 py-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/60 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Delete Consultation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-UI Confirmation Modal for Delete */}
      {deletingConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white">Delete Consultation Record?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete the booking for{' '}
                  <span className="text-white font-semibold">{deletingConsultation.client_name}</span>?
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div><strong>Date & Time:</strong> {deletingConsultation.scheduled_date} at {deletingConsultation.scheduled_time}</div>
                  <div><strong>Track:</strong> {deletingConsultation.consultation_type}</div>
                  <div><strong>Email:</strong> {deletingConsultation.client_email}</div>
                </div>
                <p className="text-[11px] text-rose-400/90 mt-2 font-medium">
                  This action cannot be undone and will permanently release this calendar slot.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={updatingId === deletingConsultation.id}
                onClick={() => setDeletingConsultation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingId === deletingConsultation.id}
                onClick={() => confirmDelete(deletingConsultation.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer"
              >
                {updatingId === deletingConsultation.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
