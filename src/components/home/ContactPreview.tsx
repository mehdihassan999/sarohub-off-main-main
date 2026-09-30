import React, { useState } from 'react';
import {
  MapPin, Mail, Phone, Clock, MessageSquare, CheckCircle2
} from 'lucide-react';
import { api } from '../../api';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface ContactPreviewProps {
  settings: { [key: string]: string };
}

export default function ContactPreview({ settings }: ContactPreviewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceRequired: 'Custom Software Development',
    estimatedBudget: '$1K - $5K',
    projectDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.projectDescription.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      await api.submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceRequired: formData.serviceRequired,
        estimatedBudget: formData.estimatedBudget,
        projectDescription: formData.projectDescription
      });
      setStatus({
        type: 'success',
        message: 'Your project inquiry has been received! Our engineering team will review it and get back to you shortly.'
      });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 6000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceRequired: 'Custom Software Development',
        estimatedBudget: '$1K - $5K',
        projectDescription: ''
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Inquiry submission failed. Please try again or reach out directly.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full rounded-3xl p-8 text-center shadow-2xl border border-white/[0.12] bg-[#0E121E]">
            <div className="mx-auto mb-4 size-16 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,92,0,0.5)]">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Project Inquiry Received!</h3>
            <p className="text-sm leading-relaxed mb-6 text-slate-300 font-normal">
              Thank you for reaching out! Your inquiry has been routed to our technical leads. We will review your project scope and contact you promptly.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-3 bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer font-bold border border-[#FFA566]/30 shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section id="contact-preview" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Direct Consultation
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-3">
              Start a <span className="italic text-[#FF5C00]">Project Inquiry</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              Have an enterprise project, software platform, or partnership proposal? Send us your requirements to schedule a scoping discussion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0E121E] shadow-2xl">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight font-display">
                  Project Scoping Form
                </h3>
                <p className="text-xs font-mono uppercase text-[#FF7A1A] font-medium">
                  Architectural Consultation Request
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 p-3.5 text-sm bg-[#141828] text-white placeholder:text-slate-500 focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 p-3.5 text-sm bg-[#141828] text-white placeholder:text-slate-500 focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 p-3.5 text-sm bg-[#141828] text-white placeholder:text-slate-500 focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] focus:outline-none transition-all shadow-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                      Target Service
                    </label>
                    <select
                      value={formData.serviceRequired}
                      onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 p-3.5 text-sm bg-[#141828] text-white focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] focus:outline-none transition-all shadow-xs"
                    >
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Cognitive AI & Neural Systems">Cognitive AI & Neural Systems</option>
                      <option value="SaaS Architecture & Cloud">SaaS Architecture & Cloud</option>
                      <option value="Mobile Application Engineering">Mobile Application Engineering</option>
                      <option value="Dedicated Engineering Squad">Dedicated Engineering Squad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                    Estimated Budget Range
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Under $1K', '$1K - $5K', '$5K - $10K', '$10K+'].map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setFormData({ ...formData, estimatedBudget: budget })}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs ${
                          formData.estimatedBudget === budget
                            ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] border-[#FFA566]/30 text-white shadow-[0_0_15px_rgba(255,92,0,0.4)]'
                            : 'bg-[#141828] border-white/10 text-slate-300 hover:border-[#FF5C00]/40 hover:text-white'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5 font-semibold">
                    Project Scope &amp; Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe what you're looking to build, technical stack preferences, or target delivery date..."
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 p-3.5 text-sm bg-[#141828] text-white placeholder:text-slate-500 focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] focus:outline-none transition-all resize-none shadow-xs"
                  />
                </div>

                {status && (
                  <div className={`p-4 rounded-2xl text-xs font-mono ${
                    status.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                  }`}>
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-4 inline-flex justify-center gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-sm font-semibold -tracking-[0.2px] text-white rounded-full transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md border border-[#FFA566]/30"
                >
                  <RollText>{loading ? 'SUBMITTING INQUIRY...' : 'SEND PROJECT INQUIRY'}</RollText>
                  <DiagonalArrow size={18} />
                </button>
              </form>
            </div>

            {/* Direct Contact Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl border border-white/[0.08] bg-[#0E121E]">
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                  Office Location
                </span>
                <div className="flex items-start gap-4">
                  <div className="size-11 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center shrink-0">
                    <MapPin className="size-5 text-[#FF5C00]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Skardu Headquarters</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-normal">
                      {settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl border border-white/[0.08] bg-[#0E121E]">
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                  Direct Inquiries
                </span>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center shrink-0">
                      <Mail className="size-5 text-[#FF5C00]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Email Us</span>
                      <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="text-sm font-semibold text-[#FF7A1A] hover:text-[#FFA566] transition-colors hover:underline">
                        {settings.email || 'info@sarohub.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center shrink-0">
                      <Phone className="size-5 text-[#FF5C00]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Phone &amp; WhatsApp</span>
                      <a href={`tel:${settings.phone || '+923555866875'}`} className="text-sm font-semibold text-slate-200 hover:text-white transition-colors hover:underline font-mono">
                        {settings.phone || '+92 355 58668 75'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center shrink-0">
                      <Clock className="size-5 text-[#FF5C00]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Operating Hours</span>
                      <p className="text-sm text-slate-300 font-normal">
                        {settings.business_hours || 'Mon - Sat: 9:00 AM - 6:00 PM (PKT)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Response Guarantee */}
              <div className="p-6 rounded-3xl border border-white/[0.08] bg-[#0E121E]">
                <h5 className="font-mono text-xs uppercase tracking-wider text-[#FF7A1A] font-bold mb-1">
                  Guaranteed 24-Hour Turnaround
                </h5>
                <p className="text-xs text-slate-400 font-normal leading-relaxed">
                  Every technical proposal receives an initial evaluation from a senior software architect within one business day.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
