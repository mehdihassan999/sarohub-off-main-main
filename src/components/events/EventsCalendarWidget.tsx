import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, ExternalLink, CalendarPlus, Download, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventItem {
  id: number;
  title: string;
  banner_url?: string;
  event_date: string;
  venue: string;
  description: string;
  registration_link?: string;
  form_fields?: any[];
}

interface EventsCalendarWidgetProps {
  events: EventItem[];
  onSelectEventForRsvp: (event: EventItem) => void;
  getGoogleCalendarUrl: (event: EventItem) => string;
  downloadIcal: (event: EventItem) => void;
}

export default function EventsCalendarWidget({
  events,
  onSelectEventForRsvp,
  getGoogleCalendarUrl,
  downloadIcal
}: EventsCalendarWidgetProps) {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState(() => {
    // If events exist in the future, start on the month of the first upcoming event, else today
    const now = new Date();
    const upcoming = events
      .map(e => new Date(e.event_date))
      .filter(d => !isNaN(d.getTime()) && d.getTime() >= now.getTime())
      .sort((a, b) => a.getTime() - b.getTime())[0];
    return upcoming || now;
  });

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Format YYYY-MM-DD
  const formatDayKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayKey = formatDayKey(new Date());

  // Map events to date keys
  const eventsByDate = useMemo(() => {
    const map: { [key: string]: EventItem[] } = {};
    events.forEach(event => {
      if (!event.event_date) return;
      const d = new Date(event.event_date);
      if (isNaN(d.getTime())) return;
      const key = formatDayKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  // Calendar Grid generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      key: string;
      events: EventItem[];
      isToday: boolean;
    }> = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = totalDaysInPrevMonth - i;
      const d = new Date(year, month - 1, dayNum);
      const key = formatDayKey(d);
      days.push({
        date: d,
        dayNumber: dayNum,
        isCurrentMonth: false,
        key,
        events: eventsByDate[key] || [],
        isToday: key === todayKey
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      const key = formatDayKey(d);
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        key,
        events: eventsByDate[key] || [],
        isToday: key === todayKey
      });
    }

    // Next month padding to fill complete weeks (35 or 42 cells)
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i);
      const key = formatDayKey(d);
      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: false,
        key,
        events: eventsByDate[key] || [],
        isToday: key === todayKey
      });
    }

    return days;
  }, [year, month, eventsByDate, todayKey]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
    setSelectedDayKey(todayKey);
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Selected Day's events
  const activeDayKey = selectedDayKey || (calendarDays.find(d => d.events.length > 0 && d.isCurrentMonth)?.key || todayKey);
  const selectedDayEvents = eventsByDate[activeDayKey] || [];

  return (
    <div className="space-y-6">
      {/* Calendar Top Navigation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white tracking-tight flex items-center gap-2.5">
              <span>{monthName}</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full font-bold">
                {calendarDays.reduce((acc, d) => acc + (d.isCurrentMonth ? d.events.length : 0), 0)} Events
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Interactive Corporate Calendar &amp; Hackathon Schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToToday}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            title="Jump to today"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-950/80 rounded-xl border border-slate-800 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 overflow-hidden shadow-2xl backdrop-blur">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/70 text-center text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 py-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
            <div key={day} className={idx === 0 || idx === 6 ? 'text-cyan-500/80' : ''}>
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/50 bg-slate-950/40">
          {calendarDays.map((cell) => {
            const hasEvents = cell.events.length > 0;
            const isSelected = cell.key === activeDayKey;

            return (
              <div
                key={cell.key}
                onClick={() => setSelectedDayKey(cell.key)}
                className={`min-h-[90px] sm:min-h-[120px] p-2 sm:p-2.5 transition-all cursor-pointer flex flex-col justify-between relative group ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-950/20 text-slate-600 opacity-40 hover:opacity-80'
                    : hasEvents
                    ? 'bg-cyan-950/15 hover:bg-cyan-950/30'
                    : 'hover:bg-slate-900/40'
                } ${
                  isSelected ? 'ring-2 ring-cyan-400/80 z-10 bg-slate-900/80' : ''
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-mono font-bold rounded-lg w-6 h-6 ${
                      cell.isToday
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                        : isSelected
                        ? 'bg-slate-800 text-cyan-400'
                        : cell.isCurrentMonth
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {hasEvents && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  )}
                </div>

                {/* Event Pill Preview in Cell */}
                <div className="mt-1.5 space-y-1 overflow-hidden">
                  {cell.events.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="truncate text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-medium group-hover:border-cyan-400 transition-colors"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {cell.events.length > 2 && (
                    <span className="text-[9px] font-mono text-cyan-400 font-bold block">
                      +{cell.events.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer / Spotlight */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-cyan-400" />
            <h3 className="font-display font-bold text-white text-base sm:text-lg">
              Scheduled Agenda for{' '}
              {new Date(activeDayKey + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event scheduled' : 'events scheduled'}
          </span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">
            <CalendarIcon className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p>No corporate events or webinars scheduled on this selected date.</p>
            <p className="text-[11px] text-slate-600 mt-1">Select another day with a glowing badge above to view event details &amp; reserve seats.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {selectedDayEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
              >
                <div>
                  {ev.banner_url && (
                    <div className="h-36 rounded-xl overflow-hidden mb-4 relative">
                      <img
                        src={ev.banner_url}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-cyan-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(ev.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                      {ev.venue || 'Hybrid / Online'}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={getGoogleCalendarUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono transition-colors flex items-center gap-1.5"
                      title="Add to Google Calendar"
                    >
                      <CalendarPlus className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Google Cal</span>
                    </a>

                    <button
                      onClick={() => downloadIcal(ev)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Download iCal (.ics) file"
                    >
                      <Download className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">.ICS</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectEventForRsvp(ev)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.25)]"
                  >
                    <span>Reserve Seat / RSVP</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
