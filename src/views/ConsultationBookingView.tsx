import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Video, Phone, CheckCircle2, ShieldCheck, 
  Sparkles, User, Mail, Building2, 
  Download, ExternalLink, MessageCircle, AlertCircle,
  AlertTriangle, RefreshCw, Cpu, Layers, Check, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../api';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

interface ConsultationBookingViewProps {
  settings?: { [key: string]: string };
}

export default function ConsultationBookingView({ settings = {} }: ConsultationBookingViewProps) {
  const companyName = settings.company_name || 'SaroHub Technologies (Private) Limited';
  const whatsappNumber = '+92 3430381473';
  const whatsappClean = '923430381473';

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const maxDateISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  }, []);

  const initialDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedType, setSelectedType] = useState('Discovery & Technical Feasibility (30 Min)');
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM PKT');
  const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
  const [customHour, setCustomHour] = useState<string>('11');
  const [customMinute, setCustomMinute] = useState<string>('00');
  const [customPeriod, setCustomPeriod] = useState<string>('AM');
  const [platform, setPlatform] = useState<string>('Google Meet');
  const [userTimezone, setUserTimezone] = useState<string>('PKT (UTC+5)');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState('$5,000 - $15,000');
  const [timeline, setTimeline] = useState('Immediate (< 2 Weeks)');
  const [projectSummary, setProjectSummary] = useState('');
  const [ndaAgreed, setNdaAgreed] = useState(true);

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [allSlots, setAllSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [googleCalUrl, setGoogleCalUrl] = useState<string>('');
  const [icsData, setIcsData] = useState<string>('');

  const [weekOffset, setWeekOffset] = useState<number>(0);

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        setUserTimezone(detected);
      }
    } catch {
      setUserTimezone('PKT (UTC+5)');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoadingSlots(true);
    setSubmitError(null);

    api.getConsultationAvailability(selectedDate)
      .then(data => {
        if (!isMounted) return;
        const slots = data?.allSlots || [
          '09:00 AM PKT', '10:00 AM PKT', '11:00 AM PKT', '12:00 PM PKT',
          '01:00 PM PKT', '02:00 PM PKT', '03:00 PM PKT', '04:00 PM PKT',
          '05:00 PM PKT', '06:00 PM PKT', '07:00 PM PKT', '08:00 PM PKT',
          '09:00 PM PKT', '10:00 PM PKT', '11:00 PM PKT', '11:30 PM PKT'
        ];
        const booked = data?.bookedSlots || [];
        const avail = data?.availableSlots || slots.filter((s: string) => !booked.includes(s));

        setAllSlots(slots);
        setBookedSlots(booked);

        if (!isCustomTime && booked.includes(selectedTime)) {
          if (avail.length > 0) {
            setSelectedTime(avail[0]);
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const defaults = [
          '09:00 AM PKT', '10:00 AM PKT', '11:00 AM PKT', '12:00 PM PKT',
          '01:00 PM PKT', '02:00 PM PKT', '03:00 PM PKT', '04:00 PM PKT',
          '05:00 PM PKT', '06:00 PM PKT', '07:00 PM PKT', '08:00 PM PKT',
          '09:00 PM PKT', '10:00 PM PKT', '11:00 PM PKT', '11:30 PM PKT'
        ];
        setAllSlots(defaults);
        setBookedSlots([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, isCustomTime]);

  useEffect(() => {
    if (isCustomTime) {
      const formattedCustomTime = `${customHour.padStart(2, '0')}:${customMinute} ${customPeriod} PKT`;
      setSelectedTime(formattedCustomTime);
    }
  }, [isCustomTime, customHour, customMinute, customPeriod]);

  const isNightHour = useMemo(() => {
    const timeUpper = selectedTime.toUpperCase().trim();
    return /^(12:[0-5][0-9]\s*AM|0?[1-8]:[0-5][0-9]\s*AM)/i.test(timeUpper);
  }, [selectedTime]);

  const isSlotBooked = useMemo(() => {
    return bookedSlots.includes(selectedTime);
  }, [bookedSlots, selectedTime]);

  const upcomingCalendarDays = useMemo(() => {
    const days: { 
      dateStr: string; 
      dayName: string; 
      fullDayName: string; 
      dayNum: number; 
      monthName: string; 
      year: number;
      isSunday: boolean;
      formattedFull: string;
      isToday: boolean;
      isTomorrow: boolean;
    }[] = [];

    const curr = new Date();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    for (let i = 0; i < 35; i++) {
      const isSunday = curr.getDay() === 0;
      if (!isSunday) {
        const dateStr = curr.toISOString().split('T')[0];
        const dayName = curr.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDayName = curr.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = curr.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = curr.getDate();
        const year = curr.getFullYear();
        const formattedFull = curr.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });

        const isToday = curr.toDateString() === today.toDateString();
        const isTomorrow = curr.toDateString() === tomorrow.toDateString();

        days.push({
          dateStr,
          dayName,
          fullDayName,
          dayNum,
          monthName,
          year,
          isSunday: false,
          formattedFull,
          isToday,
          isTomorrow
        });
      }
      curr.setDate(curr.getDate() + 1);
    }
    return days;
  }, []);

  const displayedDays = useMemo(() => {
    const start = weekOffset * 6;
    return upcomingCalendarDays.slice(start, start + 6);
  }, [upcomingCalendarDays, weekOffset]);

  const selectedDateFormatted = useMemo(() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
      return selectedDate;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  const consultationTracks = useMemo(() => [
    {
      id: 'discovery',
      title: 'Discovery & Technical Feasibility (30 Min)',
      icon: Sparkles,
      duration: '30 Min Session',
      badge: 'Startups & New Products',
      deliverables: ['MVP Scoping & Roadmap', 'Tech Stack Feasibility', 'Preliminary Budget & Timeline']
    },
    {
      id: 'architecture',
      title: 'Architecture & Cloud Scoping (45 Min)',
      icon: Layers,
      duration: '45 Min Session',
      badge: 'Enterprise Architecture',
      deliverables: ['Multi-Tenant SaaS Topology', 'AWS/GCP Microservices Blueprint', 'High-Traffic Database Sharding']
    },
    {
      id: 'ai-agents',
      title: 'AI Agent & LLM Automation Strategy (45 Min)',
      icon: Cpu,
      duration: '45 Min Session',
      badge: 'Cognitive AI Systems',
      deliverables: ['Custom LLM Agent Pipelines', 'Vector Embeddings & Enterprise RAG', 'Automated Workflow ROI Review']
    },
    {
      id: 'audit',
      title: 'Codebase Audit & Modernization (45 Min)',
      icon: ShieldCheck,
      duration: '45 Min Session',
      badge: 'Technical Due Diligence',
      deliverables: ['OWASP Security Review', 'Refactoring & Legacy Migration', 'Performance Bottleneck Remediation']
    }
  ], []);

  const currentTrackData = useMemo(() => {
    return consultationTracks.find(t => t.title === selectedType) || consultationTracks[0];
  }, [selectedType, consultationTracks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setSubmitError('Please provide your full name and work email address.');
      return;
    }

    if (isNightHour) {
      setSubmitError('Consultations cannot be scheduled between 12:00 Midnight and 09:00 AM (PKT). Please select an operational daytime or evening slot.');
      return;
    }

    if (isSlotBooked) {
      setSubmitError(`The selected time slot (${selectedTime} on ${selectedDateFormatted}) has already been reserved. Please select another slot or day.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const data = await api.createConsultation({
        client_name: name.trim(),
        client_email: email.trim(),
        client_phone: phone.trim(),
        company_name: company.trim(),
        consultation_type: selectedType,
        meeting_platform: platform,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        timezone: userTimezone,
        project_summary: `[Timeline: ${timeline}] ${projectSummary.trim()}`,
        estimated_budget: budget
      });

      setConfirmedBooking(data.booking);
      setGoogleCalUrl(data.googleCalUrl || '');
      setIcsData(data.icsData || '');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please try an alternate slot or message on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!icsData) return;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `SaroHub-Consultation-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const morningSlots = allSlots.filter(s => s.includes('AM') && !s.startsWith('12:'));
  const afternoonSlots = allSlots.filter(s => (s.includes('PM') && (s.startsWith('12:') || s.startsWith('01:') || s.startsWith('02:') || s.startsWith('03:') || s.startsWith('04:'))));
  const eveningSlots = allSlots.filter(s => (s.includes('PM') && !afternoonSlots.includes(s)));

  const budgetTiers = [
    '<$5,000',
    '$5,000 - $15,000',
    '$15,000 - $35,000',
    '$35,000 - $75,000',
    '$75,000+'
  ];

  const timelineTiers = [
    'Immediate (< 2 Weeks)',
    '1 - 2 Months',
    '3 - 6 Months',
    'Exploratory / Feasibility'
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <SEOHead 
        title={`Direct Consultation Booking | ${companyName}`}
        description="Schedule a high-impact technical discovery consultation with SaroHub engineering leadership. Confidential discussion under mutual NDA."
        canonicalUrl="https://sarohub.com/book"
      />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-gray-200 bg-[#FBFBFB]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Book Consultation', url: '/book', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-gray-500">
            Engineering Desk
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
            Direct Access to Senior Solutions Architects
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-black leading-tight mb-6">
            Schedule a Technical <span className="italic">Discovery</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-normal leading-relaxed">
            Directly connect with engineering leadership. We analyze your technical requirements, cloud topology, deliverable milestones, and budget estimates under mutual NDA.
          </p>
        </div>
      </section>

      {/* Main Booking Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <AnimatePresence mode="wait">
          {confirmedBooking ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-w-2xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-2xl text-center space-y-6"
            >
              <div className="size-16 rounded-full bg-[#FBFBFB] border border-gray-200 flex items-center justify-center mx-auto text-black">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-500 block">
                  Discovery Session Reserved
                </span>
                <h2 className="text-3xl sm:text-4xl font-normal text-black">Technical Consultation Confirmed</h2>
                <p className="text-sm text-gray-600 font-normal">
                  Confirmation and calendar invites have been dispatched to <strong className="text-black">{confirmedBooking.client_email}</strong>.
                </p>
              </div>

              {/* Boarding Pass */}
              <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-6 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Client</span>
                    <span className="font-semibold text-sm text-black">{confirmedBooking.client_name} {confirmedBooking.company_name ? `(${confirmedBooking.company_name})` : ''}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-mono uppercase font-semibold">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Date & Time</span>
                    <span className="font-semibold text-black">{confirmedBooking.scheduled_date}</span>
                    <p className="text-xs text-gray-600 font-mono">{confirmedBooking.scheduled_time}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Platform</span>
                    <span className="font-semibold text-black">{confirmedBooking.meeting_platform}</span>
                    <p className="text-xs text-gray-600 font-mono">{confirmedBooking.timezone || 'PKT'}</p>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Direct Meeting Link</span>
                  <a 
                    href={confirmedBooking.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-black underline font-mono text-xs break-all"
                  >
                    {confirmedBooking.meeting_link}
                  </a>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                    `NEW CONSULTATION BOOKED ON SAROHUB.COM\n\nClient: ${confirmedBooking.client_name}\nEmail: ${confirmedBooking.client_email}\nDate: ${confirmedBooking.scheduled_date}\nTime: ${confirmedBooking.scheduled_time}\nTrack: ${confirmedBooking.consultation_type}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-black text-white font-mono text-xs uppercase tracking-wider hover:bg-gray-800 transition-all"
                >
                  <MessageCircle className="size-4" />
                  <span>Direct WhatsApp Desk: {whatsappNumber}</span>
                </a>

                {googleCalUrl && (
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-gray-200 text-black font-mono text-xs uppercase tracking-wider hover:border-black transition-all"
                  >
                    <Calendar className="size-4" />
                    <span>Add to Google Calendar</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                )}

                {icsData && (
                  <button
                    onClick={handleDownloadIcs}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-gray-200 text-gray-700 font-mono text-xs uppercase tracking-wider hover:border-black transition-all cursor-pointer"
                  >
                    <Download className="size-4" />
                    <span>Download iCal (.ics)</span>
                  </button>
                )}

                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="w-full text-center text-xs font-mono uppercase text-gray-500 hover:text-black pt-2 cursor-pointer"
                >
                  &larr; Book another session
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Form Steps */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Step 1: Select Track */}
                <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-7">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="size-7 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-xl font-normal text-black">Select Consultation Track</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {consultationTracks.map((track) => {
                      const isSelected = selectedType === track.title;
                      const Icon = track.icon;

                      return (
                        <div
                          key={track.id}
                          onClick={() => setSelectedType(track.title)}
                          className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-black bg-white shadow-xs ring-1 ring-black'
                              : 'border-gray-200 bg-white hover:border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`size-10 rounded-2xl flex items-center justify-center ${
                                isSelected ? 'bg-black text-white' : 'bg-[#FBFBFB] border border-gray-200 text-black'
                              }`}>
                                <Icon className="size-5" />
                              </div>
                              <div>
                                <h3 className="text-base font-normal text-black">
                                  {track.title}
                                </h3>
                                <span className="text-xs font-mono text-gray-500">{track.duration}</span>
                              </div>
                            </div>

                            <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#FBFBFB] border border-gray-200 text-gray-600">
                              {track.badge}
                            </span>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                            {track.deliverables.map((item, idx) => (
                              <span key={idx} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#FBFBFB] border border-gray-200 text-gray-600 flex items-center gap-1">
                                <Check className="size-3 text-black" />
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Date Selector */}
                <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="size-7 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                        2
                      </span>
                      <h2 className="text-xl font-normal text-black">Select Date</h2>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={weekOffset === 0}
                        onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                        className="size-8 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <span className="text-xs font-mono text-gray-500">
                        Week {weekOffset + 1}
                      </span>
                      <button
                        type="button"
                        disabled={weekOffset >= 3}
                        onClick={() => setWeekOffset(prev => Math.min(3, prev + 1))}
                        className="size-8 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-4">
                    {displayedDays.map((day) => {
                      const isSelected = selectedDate === day.dateStr;
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(day.dateStr)}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 bg-white hover:border-black text-black'
                          }`}
                        >
                          <span className="text-[10px] font-mono uppercase block">{day.dayName}</span>
                          <span className="text-xl font-semibold my-0.5 block">{day.dayNum}</span>
                          <span className="text-[10px] font-mono uppercase block">{day.monthName}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs font-mono text-gray-500">Picked: {selectedDateFormatted}</span>
                    <input
                      type="date"
                      min={todayISO}
                      max={maxDateISO}
                      value={selectedDate}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedDate(e.target.value);
                        }
                      }}
                      className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-mono text-black focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Step 3: Time Slot */}
                <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="size-7 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                        3
                      </span>
                      <h2 className="text-xl font-normal text-black">Select Time Slot</h2>
                    </div>

                    <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsCustomTime(false)}
                        className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          !isCustomTime ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        Slots
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomTime(true)}
                        className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          isCustomTime ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>

                  {isCustomTime ? (
                    <div className="p-6 rounded-3xl border border-gray-200 bg-white space-y-4">
                      <span className="text-xs font-mono uppercase text-gray-500 block">Set Consultation Time (PKT):</span>
                      <div className="grid grid-cols-3 gap-3">
                        <select
                          value={customHour}
                          onChange={(e) => setCustomHour(e.target.value)}
                          className="px-3 py-2 rounded-2xl border border-gray-200 bg-[#FBFBFB] text-xs font-mono text-black focus:outline-none"
                        >
                          {['09', '10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        <select
                          value={customMinute}
                          onChange={(e) => setCustomMinute(e.target.value)}
                          className="px-3 py-2 rounded-2xl border border-gray-200 bg-[#FBFBFB] text-xs font-mono text-black focus:outline-none"
                        >
                          {['00', '15', '30', '45'].map(m => (
                            <option key={m} value={m}>:{m}</option>
                          ))}
                        </select>
                        <select
                          value={customPeriod}
                          onChange={(e) => setCustomPeriod(e.target.value)}
                          className="px-3 py-2 rounded-2xl border border-gray-200 bg-[#FBFBFB] text-xs font-mono text-black focus:outline-none"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {loadingSlots ? (
                        <div className="py-8 text-center text-xs font-mono text-gray-500 flex items-center justify-center gap-2">
                          <RefreshCw className="size-4 animate-spin text-black" />
                          <span>Checking slot availability...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs font-mono uppercase text-gray-400 block mb-2">Morning (09:00 AM – 12:00 PM)</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {morningSlots.map((slotTime) => {
                                const isBooked = bookedSlots.includes(slotTime);
                                const isSelected = selectedTime === slotTime;
                                return (
                                  <button
                                    key={slotTime}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(slotTime)}
                                    className={`py-2 px-3 rounded-2xl border text-xs font-mono transition-all cursor-pointer ${
                                      isBooked
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                                        : isSelected
                                        ? 'border-black bg-black text-white font-semibold'
                                        : 'border-gray-200 bg-white hover:border-black text-black'
                                    }`}
                                  >
                                    {slotTime.replace(' PKT', '')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-mono uppercase text-gray-400 block mb-2">Afternoon (12:00 PM – 05:00 PM)</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {afternoonSlots.map((slotTime) => {
                                const isBooked = bookedSlots.includes(slotTime);
                                const isSelected = selectedTime === slotTime;
                                return (
                                  <button
                                    key={slotTime}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(slotTime)}
                                    className={`py-2 px-3 rounded-2xl border text-xs font-mono transition-all cursor-pointer ${
                                      isBooked
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                                        : isSelected
                                        ? 'border-black bg-black text-white font-semibold'
                                        : 'border-gray-200 bg-white hover:border-black text-black'
                                    }`}
                                  >
                                    {slotTime.replace(' PKT', '')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-mono uppercase text-gray-400 block mb-2">Evening (05:00 PM – 12:00 Midnight)</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {eveningSlots.map((slotTime) => {
                                const isBooked = bookedSlots.includes(slotTime);
                                const isSelected = selectedTime === slotTime;
                                return (
                                  <button
                                    key={slotTime}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(slotTime)}
                                    className={`py-2 px-3 rounded-2xl border text-xs font-mono transition-all cursor-pointer ${
                                      isBooked
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                                        : isSelected
                                        ? 'border-black bg-black text-white font-semibold'
                                        : 'border-gray-200 bg-white hover:border-black text-black'
                                    }`}
                                  >
                                    {slotTime.replace(' PKT', '')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isNightHour && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0 text-red-500" />
                      <span>Consultations cannot be scheduled between 12:00 Midnight and 09:00 AM PKT.</span>
                    </div>
                  )}

                  {isSlotBooked && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0 text-amber-500" />
                      <span>The slot {selectedTime} has already been reserved. Please pick another.</span>
                    </div>
                  )}
                </div>

                {/* Step 4: Meeting Platform */}
                <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-7">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="size-7 rounded-full bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                      4
                    </span>
                    <h2 className="text-xl font-normal text-black">Choose Platform</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'Google Meet', icon: Video, label: 'Google Meet' },
                      { id: 'Zoom', icon: Video, label: 'Zoom' },
                      { id: 'WhatsApp Call', icon: MessageCircle, label: 'WhatsApp' },
                      { id: 'Direct Phone', icon: Phone, label: 'Phone' },
                    ].map((p) => {
                      const isSelected = platform === p.id;
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPlatform(p.id)}
                          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-black bg-white ring-1 ring-black'
                              : 'border-gray-200 bg-white hover:border-gray-400'
                          }`}
                        >
                          <Icon className="size-5 mx-auto mb-2 text-black" />
                          <p className="text-xs font-mono uppercase">{p.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Ticket Summary & Details */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-7 sticky top-24 space-y-6">
                  
                  {/* Ticket Header */}
                  <div className="p-6 rounded-3xl border border-gray-200 bg-white space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                        Consultation Pass
                      </span>
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-black text-white">
                        {currentTrackData.duration}
                      </span>
                    </div>

                    <h3 className="text-base font-normal text-black leading-snug">
                      {selectedType}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-700">
                      <span>{selectedDate}</span>
                      <span>&bull;</span>
                      <span>{selectedTime}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between text-[11px] font-mono text-gray-500">
                      <span>Host: Solutions Lead</span>
                      <span>{platform}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {submitError && (
                      <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0 text-red-500" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-600 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-600 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 343 0381473"
                          className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-600 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Your Venture"
                          className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-600 mb-1.5">
                        Budget Range
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {budgetTiers.map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setBudget(tier)}
                            className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-all cursor-pointer ${
                              budget === tier
                                ? 'bg-black text-white font-semibold'
                                : 'bg-white border border-gray-200 text-gray-600 hover:text-black'
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-600 mb-1.5">
                        Timeline
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {timelineTiers.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTimeline(t)}
                            className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-all cursor-pointer ${
                              timeline === t
                                ? 'bg-black text-white font-semibold'
                                : 'bg-white border border-gray-200 text-gray-600 hover:text-black'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-600 mb-1">
                        Brief &amp; Objectives
                      </label>
                      <textarea
                        rows={3}
                        value={projectSummary}
                        onChange={(e) => setProjectSummary(e.target.value)}
                        placeholder="Brief overview of project scope..."
                        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl border border-gray-200 bg-white flex items-start gap-2.5 cursor-pointer" onClick={() => setNdaAgreed(!ndaAgreed)}>
                      <input
                        type="checkbox"
                        checked={ndaAgreed}
                        onChange={(e) => setNdaAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 text-black focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-gray-600 font-normal">
                        Execute Mutual NDA: Protect all disclosures under standard non-disclosure terms.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || isNightHour || isSlotBooked}
                      className="w-full py-4 rounded-full bg-black text-white font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="size-4 animate-spin" />
                          <span>Reserving Session...</span>
                        </>
                      ) : (
                        <>
                          <RollText>CONFIRM &amp; RESERVE CONSULTATION</RollText>
                          <DiagonalArrow size={16} />
                        </>
                      )}
                    </button>

                    <div className="text-center text-[10px] text-gray-400 font-mono">
                      Direct invite dispatched instantly to your email.
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
