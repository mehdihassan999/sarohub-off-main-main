import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../api';
import DynamicFormField from '../opportunities/DynamicFormField';
import { OpportunityField } from '../../types';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface EventsProps {
  events: any[];
}

const nameField: OpportunityField = {
  id: 'applicant_name',
  type: 'full_name',
  label: 'Full Name',
  required: true,
  placeholder: 'Enter your full name'
};

const emailField: OpportunityField = {
  id: 'applicant_email',
  type: 'email',
  label: 'Email Address',
  required: true,
  placeholder: 'e.g., mail@domain.com'
};

export default function UpcomingEvents({ events }: EventsProps) {
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<any | null>(null);
  const [rsvpPayload, setRsvpPayload] = useState({
    applicant_name: '',
    applicant_email: '',
    form_data: {} as { [key: string]: any }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatEventDate = (isoString: string) => {
    try {
      if (!isoString) return { day: 'TBA', month: 'EVENT', full: 'Schedule Pending' };
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return { day: 'TBA', month: 'EVENT', full: isoString };
      }
      return {
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        full: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
      };
    } catch {
      return { day: 'TBA', month: 'EVENT', full: isoString || 'Schedule Pending' };
    }
  };

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!rsvpPayload.applicant_name.trim()) {
      tempErrors.applicant_name = 'Full Name is required.';
    }
    if (!rsvpPayload.applicant_email.trim()) {
      tempErrors.applicant_email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(rsvpPayload.applicant_email)) {
      tempErrors.applicant_email = 'Invalid Email format.';
    }

    if (selectedEventForRsvp && selectedEventForRsvp.form_fields) {
      selectedEventForRsvp.form_fields.forEach((field: any) => {
        if (field.disabled) return;
        const val = rsvpPayload.form_data[field.id];
        
        if (field.required) {
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            tempErrors[field.id] = field.validation?.customErrorMessage || `${field.label} is required.`;
            return;
          }
        }

        if (typeof val === 'string' && val.trim() !== '') {
          if (field.validation?.minLength && val.length < field.validation.minLength) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must be at least ${field.validation.minLength} characters.`;
          }
          if (field.validation?.maxLength && val.length > field.validation.maxLength) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must not exceed ${field.validation.maxLength} characters.`;
          }
        }

        if (field.type === 'number' && val !== undefined && val !== '') {
          const numVal = parseFloat(val);
          if (field.validation?.minValue !== undefined && numVal < field.validation.minValue) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must be at least ${field.validation.minValue}.`;
          }
          if (field.validation?.maxValue !== undefined && numVal > field.validation.maxValue) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must be maximum ${field.validation.maxValue}.`;
          }
        }
      });
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRsvp) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await api.submitEventRegistration(selectedEventForRsvp.id, {
        applicant_name: rsvpPayload.applicant_name,
        applicant_email: rsvpPayload.applicant_email,
        form_data: rsvpPayload.form_data
      });
      setSuccessMessage(response.message || 'Successfully registered for the event!');
    } catch (err: any) {
      setErrors({ global: err.message || 'Something went wrong during registration.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="upcoming-events" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Knowledge Sharing &amp; Keynotes
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white">
              Upcoming <span className="italic text-[#FF5C00]">Events &amp; Workshops</span>
            </h2>
          </div>

          <Link
            to="/events"
            className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0 border border-[#FFA566]/30"
          >
            <RollText>FULL CALENDAR</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-[#0E121E] rounded-3xl border border-white/[0.08] font-mono text-xs text-slate-400 uppercase">
            No upcoming events are registered on the schedule.
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event, idx) => {
              const dateMeta = formatEventDate(event.event_date);

              return (
                <motion.article
                  key={event.id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] overflow-hidden flex flex-col lg:flex-row gap-6 lg:gap-8 p-6 lg:p-7 transition-all duration-300 group shadow-lg"
                >
                  {/* Visual Date Badge + Thumbnail */}
                  <div className="w-full lg:w-1/3 relative h-52 lg:h-auto min-h-[200px] rounded-2xl overflow-hidden shrink-0 border border-white/[0.08] bg-[#141828] shadow-xs">
                    <img
                      src={event.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Calendar Badge overlay */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl border border-white/20 bg-[#08090E]/90 backdrop-blur-md font-mono text-center shadow-md">
                      <span className="text-[#FF7A1A] text-[10px] font-bold block">{dateMeta.month}</span>
                      <span className="text-base font-bold text-white leading-none">{dateMeta.day}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-[#FF5C00]" />
                          <span>{dateMeta.full}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-[#FF5C00]" />
                          <span>{event.venue || 'Online / Hybrid'}</span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#FF7A1A] transition-colors tracking-tight">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-normal">
                        {event.description}
                      </p>
                    </div>

                    {/* Registration CTA */}
                    <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEventForRsvp(event);
                          setRsvpPayload({ applicant_name: '', applicant_email: '', form_data: {} });
                          setErrors({});
                          setSuccessMessage(null);
                        }}
                        className="group px-6 py-2.5 inline-flex gap-2 items-center bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-xs font-mono uppercase tracking-wider text-white rounded-full hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all cursor-pointer font-semibold border border-[#FFA566]/30"
                      >
                        <RollText>RESERVE SEATS</RollText>
                        <DiagonalArrow size={16} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

      </div>

      {/* Dynamic RSVP Registration Modal */}
      <AnimatePresence>
        {selectedEventForRsvp && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="border border-white/[0.12] bg-[#0E121E] text-white w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
            >
              {/* Modal Header */}
              <div className="p-6 flex items-start justify-between border-b border-white/[0.08]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block mb-1">
                    Event RSVP Registration
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedEventForRsvp.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEventForRsvp(null)}
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/[0.08]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {successMessage ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/40">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-white">RSVP Confirmed!</h4>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {successMessage}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEventForRsvp(null)}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all cursor-pointer font-semibold"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <p className="text-xs text-slate-300 bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
                      Please enter your contact details below to reserve your attendance. Seats are confirmed on a first-come, first-served basis.
                    </p>

                    {errors.global && (
                      <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errors.global}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={rsvpPayload.applicant_name}
                        onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-white/[0.1] bg-[#141828] text-white text-sm focus:border-[#FF5C00] outline-none transition-colors"
                      />
                      {errors.applicant_name && (
                        <p className="text-red-400 text-xs mt-1">{errors.applicant_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={rsvpPayload.applicant_email}
                        onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl border border-white/[0.1] bg-[#141828] text-white text-sm focus:border-[#FF5C00] outline-none transition-colors"
                      />
                      {errors.applicant_email && (
                        <p className="text-red-400 text-xs mt-1">{errors.applicant_email}</p>
                      )}
                    </div>

                    {selectedEventForRsvp.form_fields && selectedEventForRsvp.form_fields.map((field: any) => (
                      <div key={field.id}>
                        <DynamicFormField
                          field={field}
                          value={rsvpPayload.form_data[field.id]}
                          onChange={(val) => setRsvpPayload({
                            ...rsvpPayload,
                            form_data: { ...rsvpPayload.form_data, [field.id]: val }
                          })}
                          error={errors[field.id]}
                        />
                      </div>
                    ))}

                    <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedEventForRsvp(null)}
                        className="px-6 py-2.5 rounded-full border border-white/[0.1] text-xs font-mono uppercase tracking-wider text-slate-300 hover:bg-white/[0.06] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all disabled:opacity-50 cursor-pointer font-semibold"
                      >
                        {isSubmitting ? 'Registering...' : 'Confirm RSVP'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
