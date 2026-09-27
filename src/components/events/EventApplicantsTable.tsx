import React, { useState } from 'react';
import { api } from '../../api';
import { 
  CheckCircle, Trash2, Search, Mail, Calendar, User, Clock, 
  AlertCircle, RefreshCw, Download, ExternalLink, Eye, X, Send, 
  ShieldCheck, Check, Copy, FileText
} from 'lucide-react';

interface Applicant {
  id: number;
  event_id: number;
  event_title: string;
  applicant_name: string;
  applicant_email: string;
  applied_at: string;
  form_data: Record<string, any>;
  status?: string;
}

interface Props {
  applicants: Applicant[];
  refresh: () => void;
}

const EventApplicantsTable: React.FC<Props> = ({ applicants, refresh }) => {
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: 'confirm_seat' | 'delete';
    applicant: Applicant;
  } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 6000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      showNotification('info', 'Event registration list updated.');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const executeConfirmSeat = async (id: number, name: string, email: string) => {
    setProcessingId(id);
    try {
      const res: any = await api.confirmEventReservation(id);
      const feedback = res?.message || `Seat confirmed for ${name}! Automated confirmation email dispatched to ${email}.`;
      showNotification('success', feedback);
      setConfirmModal(null);
      if (selectedApplicant && selectedApplicant.id === id) {
        setSelectedApplicant({ ...selectedApplicant, status: 'Confirmed' });
      }
      await refresh();
    } catch (err: any) {
      console.error('Error confirming seat:', err);
      showNotification('error', 'Failed to confirm seat: ' + (err.message || err));
    } finally {
      setProcessingId(null);
    }
  };

  const executeDeleteApplicant = async (id: number, name: string) => {
    setDeletingId(id);
    try {
      await api.deleteEventRegistration(id);
      showNotification('success', `Reservation record for "${name}" removed successfully.`);
      setConfirmModal(null);
      if (selectedApplicant && selectedApplicant.id === id) {
        setSelectedApplicant(null);
      }
      await refresh();
    } catch (err: any) {
      console.error('Error deleting registration:', err);
      showNotification('error', 'Failed to delete applicant: ' + (err.message || err));
    } finally {
      setDeletingId(null);
    }
  };

  const confirmSeat = (applicant: Applicant) => {
    setConfirmModal({ type: 'confirm_seat', applicant });
  };

  const deleteApplicant = (applicant: Applicant) => {
    setConfirmModal({ type: 'delete', applicant });
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const exportCSV = () => {
    if (applicants.length === 0) {
      showNotification('error', 'No attendee data to export.');
      return;
    }

    const headers = ['ID', 'Event Title', 'Event ID', 'Applicant Name', 'Applicant Email', 'Status', 'Applied At', 'Form Data JSON'];
    const rows = applicants.map(app => [
      app.id,
      `"${(app.event_title || '').replace(/"/g, '""')}"`,
      app.event_id,
      `"${(app.applicant_name || '').replace(/"/g, '""')}"`,
      `"${(app.applicant_email || '').replace(/"/g, '""')}"`,
      app.status || 'Pending',
      `"${app.applied_at || ''}"`,
      `"${JSON.stringify(app.form_data || {}).replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `event_registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'Attendee roster exported as CSV.');
  };

  const filteredApplicants = applicants.filter(app => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (app.applicant_name || '').toLowerCase().includes(query) ||
      (app.applicant_email || '').toLowerCase().includes(query) ||
      (app.event_title || '').toLowerCase().includes(query) ||
      JSON.stringify(app.form_data || {}).toLowerCase().includes(query);

    if (statusFilter === 'confirmed') return matchesSearch && app.status === 'Confirmed';
    if (statusFilter === 'pending') return matchesSearch && app.status !== 'Confirmed';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-white">Event Seat Registrations</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              {applicants.length} Total Attendees
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review seat reservations, verify custom attendee fields, and dispatch automated confirmation email passes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            title="Refresh Registration List"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export full list to CSV"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-60"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${statusFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              All ({applicants.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${statusFilter === 'pending' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Pending ({applicants.filter(a => a.status !== 'Confirmed').length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${statusFilter === 'confirmed' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Confirmed ({applicants.filter(a => a.status === 'Confirmed').length})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 border transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
            : notification.type === 'info'
            ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
            : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Table */}
      {filteredApplicants.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-slate-800/80 bg-slate-950/40">
          <Calendar className="h-10 w-10 text-slate-600 mx-auto mb-3 opacity-50" />
          <p className="text-slate-300 text-sm font-semibold">No event reservations found</p>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            When attendees reserve seats on public event pages, their registration records and custom dynamic details will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/60 shadow-xl">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 text-left">Applicant</th>
                <th className="px-4 py-3.5 text-left">Contact Info</th>
                <th className="px-4 py-3.5 text-left">Target Event</th>
                <th className="px-4 py-3.5 text-left">Applied At</th>
                <th className="px-4 py-3.5 text-left">Dynamic Form Fields</th>
                <th className="px-4 py-3.5 text-left">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApplicants.map(app => (
                <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                        {(app.applicant_name || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="font-semibold text-white hover:text-cyan-400 transition-colors text-left block cursor-pointer"
                        >
                          {app.applicant_name || 'Unnamed Applicant'}
                        </button>
                        <span className="text-[10px] text-slate-500 font-mono">ID: #{app.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <a 
                        href={`mailto:${app.applicant_email}`}
                        className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                      >
                        <Mail className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400" />
                        <span className="truncate max-w-[160px]">{app.applicant_email || '-'}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => copyEmailToClipboard(app.applicant_email)}
                        className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                        title="Copy email to clipboard"
                      >
                        {copiedEmail === app.applicant_email ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Event */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium text-[11px]">
                      <Calendar className="h-3 w-3 text-blue-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{app.event_title || `Event #${app.event_id}`}</span>
                    </span>
                  </td>

                  {/* Applied At */}
                  <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                    {app.applied_at ? new Date(app.applied_at).toLocaleString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </td>

                  {/* Form Data */}
                  <td className="px-4 py-3.5">
                    {app.form_data && Object.keys(app.form_data).length > 0 ? (
                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 text-[11px] font-mono transition-all cursor-pointer"
                        title="View custom form field responses"
                      >
                        <FileText className="h-3 w-3" />
                        <span>{Object.keys(app.form_data).length} Custom Value{Object.keys(app.form_data).length === 1 ? '' : 's'}</span>
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[11px] font-mono">Standard RSVP</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    {app.status === 'Confirmed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wide">
                        <CheckCircle className="h-3 w-3" /> CONFIRMED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold tracking-wide">
                        <Clock className="h-3 w-3" /> PENDING
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Confirm / Resend Email Button */}
                      {app.status !== 'Confirmed' ? (
                        <button
                          disabled={processingId === app.id || deletingId === app.id}
                          onClick={() => confirmSeat(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                          title="Confirm seat and send reservation email"
                        >
                          {processingId === app.id ? (
                            <span>Confirming...</span>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Confirm Seat</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          disabled={processingId === app.id || deletingId === app.id}
                          onClick={() => confirmSeat(app)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 text-[11px] font-mono transition-all cursor-pointer"
                          title="Resend official confirmation email"
                        >
                          <Send className="h-3 w-3" />
                          <span>Resend Email</span>
                        </button>
                      )}

                      {/* View Dossier Button */}
                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                        title="View Full Application Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete button */}
                      <button
                        disabled={deletingId === app.id || processingId === app.id}
                        onClick={() => deleteApplicant(app)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete this reservation record"
                      >
                        {deletingId === app.id ? (
                          <span className="text-[10px] text-rose-400">...</span>
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Applicant Dossier Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative border border-slate-800 bg-slate-900 w-full max-w-lg shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Top Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shrink-0" />

            {/* Header */}
            <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Attendee Reservation Dossier
                </span>
                <h3 className="font-display font-bold text-white text-lg mt-1">
                  {selectedApplicant.applicant_name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  ID: #{selectedApplicant.id} &bull; Registered for: {selectedApplicant.event_title}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="h-8 w-8 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Status and Timestamp Banner */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Seat Status</span>
                  <div className="mt-1">
                    {selectedApplicant.status === 'Confirmed' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                        <CheckCircle className="h-3.5 w-3.5" /> CONFIRMED &amp; PASS DELIVERED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                        <Clock className="h-3.5 w-3.5" /> PENDING CONFIRMATION
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Registered On</span>
                  <span className="text-xs font-mono text-white mt-1 block">
                    {selectedApplicant.applied_at ? new Date(selectedApplicant.applied_at).toLocaleString() : '-'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Contact Coordinates
                </label>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Email Address:</span>
                    <a 
                      href={`mailto:${selectedApplicant.applicant_email}`}
                      className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1.5"
                    >
                      <Mail className="h-3 w-3" />
                      <span>{selectedApplicant.applicant_email}</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                    <span className="text-xs text-slate-400">Event ID:</span>
                    <span className="text-xs font-mono text-white">Event #{selectedApplicant.event_id}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Form Responses */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Custom Registration Answers
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {Object.keys(selectedApplicant.form_data || {}).length} Fields
                  </span>
                </div>

                {selectedApplicant.form_data && Object.keys(selectedApplicant.form_data).length > 0 ? (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    {Object.entries(selectedApplicant.form_data).map(([key, val]) => {
                      const isUrlOrFile = typeof val === 'string' && (val.startsWith('http') || val.startsWith('/uploads/') || val.startsWith('/storage/'));
                      return (
                        <div key={key} className="border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0">
                          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                            {key.replace(/_/g, ' ')}
                          </span>
                          {isUrlOrFile ? (
                            <a
                              href={val}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-900/50 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View / Download Attachment</span>
                            </a>
                          ) : (
                            <span className="text-xs font-medium text-slate-200 mt-0.5 block break-words">
                              {String(val || '-')}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 text-center text-xs text-slate-500 font-mono">
                    No additional dynamic fields configured for this event.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between gap-3">
              <button
                onClick={() => deleteApplicant(selectedApplicant)}
                disabled={deletingId === selectedApplicant.id}
                className="px-4 py-2 rounded-xl border border-rose-900/50 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Record</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => confirmSeat(selectedApplicant)}
                  disabled={processingId === selectedApplicant.id}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {processingId === selectedApplicant.id ? (
                    <span>Dispatching...</span>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>{selectedApplicant.status === 'Confirmed' ? 'Resend Pass Email' : 'Confirm & Email Pass'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation & Deletion Action Modal (Sandboxed Iframe Safe) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative border border-slate-800 bg-slate-900 w-full max-w-md shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-fade-in">
            <div className={`h-1.5 w-full ${confirmModal.type === 'confirm_seat' ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500' : 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500'}`} />
            
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${confirmModal.type === 'confirm_seat' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                    {confirmModal.type === 'confirm_seat' ? <CheckCircle className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-display">
                      {confirmModal.type === 'confirm_seat' ? 'Confirm Seat Reservation' : 'Delete Registration'}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: #{confirmModal.applicant.id}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmModal(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono text-[10px] uppercase">Attendee</span>
                  <span className="font-semibold text-slate-200">{confirmModal.applicant.applicant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono text-[10px] uppercase">Email</span>
                  <span className="text-cyan-400 font-mono text-[11px]">{confirmModal.applicant.applicant_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-mono text-[10px] uppercase">Event</span>
                  <span className="text-slate-300 line-clamp-1 max-w-[200px] text-right">{confirmModal.applicant.event_title}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {confirmModal.type === 'confirm_seat'
                  ? 'Confirming will mark this attendee as Confirmed and automatically dispatch the official electronic reservation pass to their inbox.'
                  : 'Are you sure you want to permanently remove this attendee reservation? This action cannot be undone.'}
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  disabled={processingId !== null || deletingId !== null}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                {confirmModal.type === 'confirm_seat' ? (
                  <button
                    type="button"
                    disabled={processingId === confirmModal.applicant.id}
                    onClick={() => executeConfirmSeat(confirmModal.applicant.id, confirmModal.applicant.applicant_name, confirmModal.applicant.applicant_email)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {processingId === confirmModal.applicant.id ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Confirm & Send Pass</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={deletingId === confirmModal.applicant.id}
                    onClick={() => executeDeleteApplicant(confirmModal.applicant.id, confirmModal.applicant.applicant_name)}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-rose-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === confirmModal.applicant.id ? (
                      <span>Deleting...</span>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Permanently Delete</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventApplicantsTable;
