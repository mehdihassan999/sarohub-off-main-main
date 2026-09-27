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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative max-w-md w-full rounded-3xl p-8 text-center shadow-2xl border border-gray-200 bg-white">
            <div className="mx-auto mb-4 size-16 rounded-full bg-black text-white flex items-center justify-center">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-2xl font-normal mb-2 text-black">Project Inquiry Received!</h3>
            <p className="text-sm leading-relaxed mb-6 text-gray-600 font-normal">
              Thank you for reaching out! Your inquiry has been routed to our technical leads. We will review your project scope and contact you promptly.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-3 bg-black hover:bg-gray-800 text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section id="contact-preview" className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* NexStudio Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Direct Consultation
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-3">
              Start a <span className="italic">Project Inquiry</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              Have an enterprise project, software platform, or partnership proposal? Send us your requirements to schedule a scoping discussion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-gray-200 bg-white shadow-xs">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-1 tracking-tight">
                  Project Scoping Form
                </h3>
                <p className="text-xs font-mono uppercase text-gray-600 font-medium">
                  Architectural Consultation Request
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-700 block mb-1.5 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm bg-[#FBFBFB] text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-700 block mb-1.5 font-semibold">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm bg-[#FBFBFB] text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-700 block mb-1.5 font-semibold">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm bg-[#FBFBFB] text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-gray-700 block mb-1.5 font-semibold">
                      Target Service
                    </label>
                    <select
                      value={formData.serviceRequired}
                      onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                      className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm bg-[#FBFBFB] text-black focus:border-black focus:outline-none transition-all shadow-xs"
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
                  <label className="text-xs font-mono uppercase text-gray-700 block mb-1.5 font-semibold">
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
                            ? 'bg-black border-black text-white'
                            : 'bg-[#FBFBFB] border-gray-200 text-gray-700 hover:border-black hover:text-black'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-gray-700 block mb-1.5 font-semibold">
                    Project Scope &amp; Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe what you're looking to build, technical stack preferences, or target delivery date..."
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm bg-[#FBFBFB] text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition-all resize-none shadow-xs"
                  />
                </div>

                {status && (
                  <div className={`p-4 rounded-2xl text-xs font-mono ${
                    status.type === 'success' ? 'bg-gray-100 text-black border border-gray-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-3.5 inline-flex justify-center gap-2.5 items-center bg-black text-sm font-semibold -tracking-[0.2px] text-white rounded-full hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <RollText>{loading ? 'SUBMITTING INQUIRY...' : 'SEND PROJECT INQUIRY'}</RollText>
                  <DiagonalArrow size={18} />
                </button>
              </form>
            </div>

            {/* Direct Contact Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl border border-gray-200 bg-white">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
                  Office Location
                </span>
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-2xl bg-[#FBFBFB] border border-gray-200 flex items-center justify-center shrink-0">
                    <MapPin className="size-5 text-black" />
                  </div>
                  <div>
                    <h4 className="text-lg font-normal text-black mb-1">Skardu Headquarters</h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl border border-gray-200 bg-white">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
                  Direct Inquiries
                </span>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl bg-[#FBFBFB] border border-gray-200 flex items-center justify-center shrink-0">
                      <Mail className="size-5 text-black" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-gray-400 block">Email Us</span>
                      <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="text-sm font-semibold text-black hover:underline">
                        {settings.email || 'info@sarohub.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl bg-[#FBFBFB] border border-gray-200 flex items-center justify-center shrink-0">
                      <Phone className="size-5 text-black" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-gray-400 block">Phone &amp; WhatsApp</span>
                      <a href={`tel:${settings.phone || '+923555866875'}`} className="text-sm font-semibold text-black hover:underline">
                        {settings.phone || '+92 355 58668 75'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl bg-[#FBFBFB] border border-gray-200 flex items-center justify-center shrink-0">
                      <Clock className="size-5 text-black" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-gray-400 block">Operating Hours</span>
                      <p className="text-sm text-gray-600 font-normal">
                        {settings.business_hours || 'Mon - Sat: 9:00 AM - 6:00 PM (PKT)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Response Guarantee */}
              <div className="p-6 rounded-3xl border border-gray-200 bg-[#FBFBFB]">
                <h5 className="font-mono text-xs uppercase tracking-wider text-black font-semibold mb-1">
                  Guaranteed 24-Hour Turnaround
                </h5>
                <p className="text-xs text-gray-600 font-normal leading-relaxed">
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
