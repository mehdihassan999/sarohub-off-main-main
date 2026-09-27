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
    <section id="upcoming-events" className="py-12 lg:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 pb-6 border-b border-gray-200">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Knowledge Sharing &amp; Keynotes
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black">
              Upcoming <span className="italic">Events &amp; Workshops</span>
            </h2>
          </div>

          <Link
            to="/events"
            className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-black text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shrink-0 shadow-xs"
          >
            <RollText>FULL CALENDAR</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-[#FBFBFB] rounded-3xl border border-gray-200 font-mono text-xs text-gray-600 uppercase">
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
                  className="rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black hover:shadow-md overflow-hidden flex flex-col lg:flex-row gap-6 lg:gap-8 p-6 lg:p-7 transition-all duration-300 group"
                >
                  {/* Visual Date Badge + Thumbnail */}
                  <div className="w-full lg:w-1/3 relative h-52 lg:h-auto min-h-[200px] rounded-2xl overflow-hidden shrink-0 border border-gray-200 bg-gray-100 shadow-xs">
                    <img
                      src={event.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Calendar Badge overlay */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl border border-gray-200 bg-white/95 backdrop-blur font-mono text-center shadow-xs">
                      <span className="text-black text-[10px] font-bold block">{dateMeta.month}</span>
                      <span className="text-base font-bold text-black leading-none">{dateMeta.day}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase text-gray-700">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-black" />
                          <span>{dateMeta.full}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-black" />
                          <span>{event.venue || 'Online / Hybrid'}</span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-black group-hover:text-gray-700 transition-colors tracking-tight">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed font-normal">
                        {event.description}
                      </p>
                    </div>

                    {/* Registration CTA */}
                    <div className="pt-4 border-t border-gray-200 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEventForRsvp(event);
                          setRsvpPayload({ applicant_name: '', applicant_email: '', form_data: {} });
                          setErrors({});
                          setSuccessMessage(null);
                        }}
                        className="group px-6 py-2.5 inline-flex gap-2 items-center bg-black text-xs font-mono uppercase tracking-wider text-white rounded-full hover:bg-gray-800 transition-all cursor-pointer shadow-xs font-semibold"
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
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="border border-gray-200 bg-white w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
            >
              {/* Modal Header */}
              <div className="p-6 flex items-start justify-between border-b border-gray-100">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
                    Event RSVP Registration
                  </span>
                  <h3 className="text-xl sm:text-2xl font-normal text-black">
                    {selectedEventForRsvp.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEventForRsvp(null)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {successMessage ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-normal text-xl text-black">RSVP Confirmed!</h4>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {successMessage}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEventForRsvp(null)}
                      className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      Please enter your contact details below to reserve your attendance. Seats are confirmed on a first-come, first-served basis.
                    </p>

                    {errors.global && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errors.global}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-black mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={rsvpPayload.applicant_name}
                        onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-black outline-none transition-colors"
                      />
                      {errors.applicant_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.applicant_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-black mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={rsvpPayload.applicant_email}
                        onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-black outline-none transition-colors"
                      />
                      {errors.applicant_email && (
                        <p className="text-red-500 text-xs mt-1">{errors.applicant_email}</p>
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

                    <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedEventForRsvp(null)}
                        className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-mono uppercase tracking-wider text-black hover:bg-gray-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
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
