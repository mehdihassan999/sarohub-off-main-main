import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, MapPin, Clock, Search, 
  CheckCircle2, AlertCircle, X,
  ExternalLink, Loader2, FileText,
  User, Mail, ShieldCheck, Ticket, Phone, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../api';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import DynamicFormField from '../components/opportunities/DynamicFormField';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

export default function EventsView() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  // RSVP Modal State
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<any | null>(null);
  const [rsvpPayload, setRsvpPayload] = useState({
    applicant_name: '',
    applicant_email: '',
    form_data: {} as { [key: string]: any }
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileUpload = async (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFieldId(fieldId);
    try {
      const formData = new FormData();
      formData.append('document', file);
      const token = localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
      const res = await fetch('/api/upload-document', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setRsvpPayload(prev => ({
          ...prev,
          form_data: { ...prev.form_data, [fieldId]: data.url }
        }));
      } else {
        alert(data.error || 'Failed to upload document.');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading file.');
    } finally {
      setUploadingFieldId(null);
    }
  };

  const fetchEvents = () => {
    setIsLoading(true);
    api.getEvents()
      .then((data) => {
        setEvents(data || []);
      })
      .catch((err) => {
        console.error('Failed to load corporate events:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();

    const onDataUpdated = () => {
      fetchEvents();
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  const parseEventDate = (isoString: string) => {
    try {
      if (!isoString) return { day: 'TBA', month: 'EVENT', year: '', full: 'Schedule Pending', timestamp: 0, isPast: false };
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return { day: 'TBA', month: 'EVENT', year: '', full: isoString, timestamp: 0, isPast: false };
      }
      const now = new Date();
      return {
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        year: date.getFullYear().toString(),
        full: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        timestamp: date.getTime(),
        isPast: date.getTime() < now.getTime()
      };
    } catch {
      return { day: 'TBA', month: 'EVENT', year: '', full: isoString || 'Schedule Pending', timestamp: 0, isPast: false };
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const dateMeta = parseEventDate(event.event_date);
      
      if (timeFilter === 'upcoming' && dateMeta.isPast) return false;
      if (timeFilter === 'past' && !dateMeta.isPast) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title?.toLowerCase().includes(q);
        const matchesDesc = event.description?.toLowerCase().includes(q);
        const matchesVenue = event.venue?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesVenue) return false;
      }

      return true;
    });
  }, [events, searchQuery, timeFilter]);

  const getGoogleCalendarUrl = (event: any) => {
    const title = encodeURIComponent(event.title || 'SaroHub Corporate Event');
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.venue || 'SaroHub Hybrid Portal');
    
    let dates = '';
    try {
      const d = new Date(event.event_date);
      if (!isNaN(d.getTime())) {
        const start = d.toISOString().replace(/-|:|\.\d+/g, '');
        const endD = new Date(d.getTime() + 2 * 60 * 60 * 1000);
        const end = endD.toISOString().replace(/-|:|\.\d+/g, '');
        dates = `&dates=${start}/${end}`;
      }
    } catch {
      // ignore
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dates}`;
  };

  const validateRsvpForm = () => {
    const errs: { [key: string]: string } = {};
    if (!rsvpPayload.applicant_name.trim()) {
      errs.applicant_name = 'Full Name is required.';
    }
    if (!rsvpPayload.applicant_email.trim()) {
      errs.applicant_email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(rsvpPayload.applicant_email)) {
      errs.applicant_email = 'Please enter a valid email address.';
    }

    if (selectedEventForRsvp && selectedEventForRsvp.form_fields) {
      selectedEventForRsvp.form_fields.forEach((field: any) => {
        if (field.disabled) return;
        const val = rsvpPayload.form_data[field.id];
        if (field.required) {
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            errs[field.id] = field.validation?.customErrorMessage || `${field.label} is required.`;
            return;
          }
        }
      });
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRsvp) return;
    if (!validateRsvpForm()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitEventRegistration(selectedEventForRsvp.id, {
        applicant_name: rsvpPayload.applicant_name,
        applicant_email: rsvpPayload.applicant_email,
        form_data: rsvpPayload.form_data
      });
      setSuccessMessage(res.message || 'Seat reservation registered successfully! You will receive confirmation via email.');
    } catch (err: any) {
      setFormErrors({ global: err.message || 'Failed to submit registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <SEOHead
        title="Corporate Events & Tech Summits | SaroHub Technologies"
        description="Join SaroHub founders, software engineers, and enterprise leaders in keynote summits, technical masterclasses, and developer hackathons."
      />

      {/* Top Breadcrumbs */}
      <div className="border-b border-gray-200 bg-[#FBFBFB]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Events & Webinars', url: '/events', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-gray-500">
            Tech Summits &amp; Forums
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Corporate Engagements &amp; Tech Summits
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black leading-tight mb-4">
              Events, Summits &amp; <span className="italic">Masterclasses</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-normal leading-relaxed">
              Connect directly with SaroHub venture architects, core system engineers, and technology partners. We host technical deep-dives, developer hackathons, and corporate conferences on scalable digital architecture.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="text-2xl sm:text-3xl font-bold text-black block">{events.length}</span>
              <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-wider font-medium">Total Scheduled</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="text-2xl sm:text-3xl font-bold text-black block">
                {events.filter(e => !parseEventDate(e.event_date).isPast).length}
              </span>
              <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-wider font-medium">Upcoming Sessions</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="text-2xl sm:text-3xl font-bold text-black block">Hybrid</span>
              <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-wider font-medium">Global Access</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xs">
              <span className="text-2xl sm:text-3xl font-bold text-black block">Instant</span>
              <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-wider font-medium">Seat Reservation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Directory */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#FBFBFB] border border-gray-200 rounded-3xl p-4 mb-8 shadow-xs">
            {/* Time Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-gray-200 overflow-x-auto shadow-xs">
              <button
                type="button"
                onClick={() => setTimeFilter('all')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap font-medium ${
                  timeFilter === 'all'
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                All Events ({events.length})
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('upcoming')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap font-medium ${
                  timeFilter === 'upcoming'
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Upcoming ({events.filter(e => !parseEventDate(e.event_date).isPast).length})
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('past')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap font-medium ${
                  timeFilter === 'past'
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Past Archives ({events.filter(e => parseEventDate(e.event_date).isPast).length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by topic, keyword, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-white border border-gray-200 pl-11 pr-4 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-mono"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 text-center">
              <div className="inline-block size-8 animate-spin rounded-full border-2 border-black border-t-transparent mb-4" />
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-12 text-center max-w-md mx-auto shadow-xs">
              <Calendar className="size-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-black">No Matching Events Found</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed font-normal">
                {searchQuery
                  ? `No events match "${searchQuery}". Try a different keyword or reset filters.`
                  : 'There are currently no events matching this filter category.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-6 px-5 py-2.5 rounded-full bg-black text-white text-xs font-mono font-semibold uppercase tracking-wider hover:bg-gray-800 cursor-pointer shadow-xs"
                >
                  Reset Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const dateMeta = parseEventDate(event.event_date);
                const isPast = dateMeta.isPast;

                return (
                  <div
                    key={event.id}
                    className="rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-xs"
                  >
                    {/* Banner Media */}
                    <div className="relative h-48 w-full overflow-hidden bg-white border-b border-gray-200">
                      <img
                        src={event.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />

                      {/* Date Badge */}
                      <div className="absolute top-3 left-3 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xs px-3 py-2 flex flex-col items-center min-w-[50px] shadow-xs">
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">{dateMeta.month}</span>
                        <span className="text-lg font-bold text-black leading-none mt-0.5">{dateMeta.day}</span>
                      </div>

                      {/* Status Pill */}
                      <div className="absolute top-3 right-3">
                        {isPast ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-white/95 text-gray-600 border border-gray-200 font-semibold shadow-xs">
                            Past Event
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-white/95 text-black border border-gray-200 shadow-xs">
                            RSVP Open
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-600 font-medium">
                          <span className="flex items-center gap-1 text-black font-semibold">
                            <Clock className="size-3 text-gray-500 shrink-0" />
                            <span className="truncate max-w-[130px]">{dateMeta.full}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3 text-gray-500 shrink-0" />
                            <span className="truncate max-w-[130px]">{event.venue || 'Hybrid Portal'}</span>
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-gray-700 transition-colors line-clamp-1 tracking-tight">
                          {event.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal line-clamp-2">
                          {event.description}
                        </p>

                        {event.form_fields && event.form_fields.length > 0 && (
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-[10px] font-mono uppercase text-gray-700 font-medium shadow-xs">
                              <FileText className="size-3 text-gray-400 shrink-0" />
                              <span>{event.form_fields.length} Custom Field{event.form_fields.length === 1 ? '' : 's'}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Action Bar */}
                      <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-2">
                        <a
                          href={getGoogleCalendarUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-mono text-gray-700 font-medium hover:text-black hover:border-black transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Calendar className="size-3 text-gray-400" />
                          <span>Google Cal</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEventForRsvp(event);
                            setRsvpPayload({ applicant_name: '', applicant_email: '', form_data: {} });
                            setFormErrors({});
                            setSuccessMessage(null);
                          }}
                          className={`px-5 py-2 rounded-full font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-semibold shadow-xs ${
                            isPast
                              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          <Ticket className="size-3.5" />
                          <span>{isPast ? 'Archive / RSVP' : 'Reserve Seat'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* RSVP Registration Modal */}
      <AnimatePresence>
        {selectedEventForRsvp && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative border border-gray-200 bg-white w-full max-w-lg sm:max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-[#FBFBFB] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 block">
                    Seat Reservation Pass
                  </span>
                  <h3 className="text-xl font-normal text-black leading-snug">
                    {selectedEventForRsvp.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500 pt-1">
                    <span>{parseEventDate(selectedEventForRsvp.event_date).full}</span>
                    <span>&bull;</span>
                    <span>{selectedEventForRsvp.venue}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEventForRsvp(null)}
                  className="size-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-black flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {successMessage ? (
                  <div className="py-6 space-y-6 text-center">
                    <div className="mx-auto size-14 rounded-full bg-[#FBFBFB] border border-gray-200 flex items-center justify-center text-black">
                      <CheckCircle2 className="size-7" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-2xl font-normal text-black">
                        Seat Reserved Successfully
                      </h4>
                      <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed font-normal">
                        {successMessage}
                      </p>
                    </div>

                    {/* Pass Details */}
                    <div className="bg-[#FBFBFB] border border-gray-200 rounded-3xl p-6 text-left space-y-3 max-w-md mx-auto">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Digital Pass</span>
                        <span className="text-xs font-mono px-3 py-1 bg-black text-white rounded-full font-semibold">
                          CONFIRMED
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Event</p>
                        <p className="text-sm font-semibold text-black">{selectedEventForRsvp.title}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-mono">Attendee</p>
                          <p className="text-xs font-semibold text-black truncate">{rsvpPayload.applicant_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-mono">Date</p>
                          <p className="text-xs font-semibold text-black truncate">{parseEventDate(selectedEventForRsvp.event_date).full}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 text-xs font-mono text-gray-600 flex items-center gap-1.5">
                        <Mail className="size-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">Sent to: {rsvpPayload.applicant_email}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={getGoogleCalendarUrl(selectedEventForRsvp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-mono uppercase tracking-wider text-black hover:border-black transition-all"
                      >
                        Add to Calendar
                      </a>
                      <button
                        onClick={() => setSelectedEventForRsvp(null)}
                        className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer"
                      >
                        Done / Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    {formErrors.global && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="size-4 text-red-500 shrink-0" />
                        <span>{formErrors.global}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">
                          Attendee Full Name *
                        </label>
                        <div className="relative">
                          <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={rsvpPayload.applicant_name}
                            onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_name: e.target.value })}
                            placeholder="Your Full Name"
                            className="w-full text-xs bg-[#FBFBFB] border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                          />
                        </div>
                        {formErrors.applicant_name && (
                          <span className="text-[10px] text-red-500 mt-1 block font-mono">{formErrors.applicant_name}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">
                          Work / Primary Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={rsvpPayload.applicant_email}
                            onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_email: e.target.value })}
                            placeholder="you@company.com"
                            className="w-full text-xs bg-[#FBFBFB] border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                          />
                        </div>
                        {formErrors.applicant_email && (
                          <span className="text-[10px] text-red-500 mt-1 block font-mono">{formErrors.applicant_email}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">
                            Phone (Optional)
                          </label>
                          <div className="relative">
                            <Phone className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              value={rsvpPayload.form_data['phone'] || ''}
                              onChange={(e) => setRsvpPayload(prev => ({
                                ...prev,
                                form_data: { ...prev.form_data, phone: e.target.value }
                              }))}
                              placeholder="+1 (555) 019-2834"
                              className="w-full text-xs bg-[#FBFBFB] border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-1.5 font-semibold">
                            Company (Optional)
                          </label>
                          <div className="relative">
                            <Building2 className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={rsvpPayload.form_data['organization'] || ''}
                              onChange={(e) => setRsvpPayload(prev => ({
                                ...prev,
                                form_data: { ...prev.form_data, organization: e.target.value }
                              }))}
                              placeholder="Acme Corp"
                              className="w-full text-xs bg-[#FBFBFB] border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Fields */}
                    {selectedEventForRsvp.form_fields && selectedEventForRsvp.form_fields.length > 0 && (
                      <div className="pt-4 border-t border-gray-200 space-y-3">
                        <span className="font-mono text-xs uppercase tracking-wider text-gray-500 block">
                          Event Requirements ({selectedEventForRsvp.form_fields.length})
                        </span>

                        <div className="space-y-3 bg-[#FBFBFB] p-4 rounded-3xl border border-gray-200">
                          {selectedEventForRsvp.form_fields.map((field: any) => (
                            <div key={field.id} className="space-y-1">
                              <DynamicFormField
                                field={field}
                                value={rsvpPayload.form_data[field.id]}
                                onChange={(val) => {
                                  setRsvpPayload(prev => ({
                                    ...prev,
                                    form_data: { ...prev.form_data, [field.id]: val }
                                  }));
                                }}
                                error={formErrors[field.id]}
                                uploading={uploadingFieldId === field.id}
                                onFileUpload={(e) => handleFileUpload(field.id, e)}
                                onRemoveFile={() => {
                                  setRsvpPayload(prev => {
                                    const nextFormData = { ...prev.form_data };
                                    delete nextFormData[field.id];
                                    return { ...prev, form_data: nextFormData };
                                  });
                                }}
                                darkTheme={false}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <ShieldCheck className="size-4 text-black shrink-0" />
                      <span>Instant confirmation pass delivered directly to your inbox.</span>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedEventForRsvp(null)}
                        className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-black hover:border-black transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !!uploadingFieldId}
                        className="px-7 py-3 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider disabled:opacity-50 flex items-center gap-2 cursor-pointer hover:bg-gray-800 transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Confirming...</span>
                          </>
                        ) : (
                          <>
                            <span>Reserve Seat</span>
                            <DiagonalArrow size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
