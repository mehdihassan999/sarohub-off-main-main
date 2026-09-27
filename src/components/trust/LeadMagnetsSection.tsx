import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle2, BookOpen, Sparkles, 
  ArrowRight, X, RefreshCw, Send, ShieldCheck, FileCheck
} from 'lucide-react';
import { api } from '../../api';
import { LeadMagnet } from '../../types';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface LeadMagnetsSectionProps {
  className?: string;
}

export const LeadMagnetsSection: React.FC<LeadMagnetsSectionProps> = ({
  className = ''
}) => {
  const [magnets, setMagnets] = useState<LeadMagnet[]>([]);
  const [activeMagnet, setActiveMagnet] = useState<LeadMagnet | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    fetchMagnets();
    const handleUpdate = () => fetchMagnets();
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleUpdate);
  }, []);

  const fetchMagnets = async () => {
    try {
      const data = await api.getLeadMagnets();
      setMagnets(data || []);
    } catch (err) {
      console.error('Failed to load lead magnets:', err);
    }
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMagnet || !email) return;

    setDownloading(true);
    try {
      const res = await api.trackLeadMagnetDownload(activeMagnet.id, {
        email,
        full_name: fullName,
        company
      });

      if (res.success) {
        setDownloadSuccess(true);
        // Refresh counter
        fetchMagnets();

        // Trigger automatic synthetic download of a formatted summary file
        const blobContent = `================================================================================
SAROHUB TECHNOLOGIES - EXECUTIVE PLAYBOOK & BLUEPRINT
Title: ${activeMagnet.title}
Category: ${activeMagnet.category}
Date of Delivery: ${new Date().toLocaleDateString()}
Licensed To: ${fullName || 'Client Partner'} (${company || 'Enterprise'})
================================================================================

OVERVIEW:
${activeMagnet.description}

CORE TECHNICAL TAKEAWAYS & ARCHITECTURE PRINCIPLES:
${activeMagnet.key_takeaways.map((t, idx) => `[0${idx + 1}] ${t}`).join('\n')}

SECURITY & COMPLIANCE STANDARD:
All code and architecture deliverables produced by SaroHub follow zero-trust principles,
OWASP Top-10 secure coding guidelines, containerized sandboxing, and 100% IP ownership
assigned to the client under bilateral NDA covenants.

NEED AN EXPERT ARCHITECTURE REVIEW?
Request our complimentary 48-Hour Technical Feasibility & Architecture Audit
Direct: info@sarohub.com | WhatsApp: +92 343 0381473 | Web: https://sarohub.com
================================================================================`;

        const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${activeMagnet.slug || 'sarohub-resource'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download gate error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="executive-resources" className={`py-20 lg:py-28 bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
            Executive Blueprints &amp; Playbooks
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black leading-tight">
            Battle-Tested Guides &amp; <span className="italic">Due Diligence Playbooks</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
            Free high-density technical whitepapers and actionable vendor checklists crafted by our senior systems architects to help founders and CTOs make de-risked engineering decisions.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {magnets.map((magnet) => (
            <div
              key={magnet.id}
              id={`lead-magnet-${magnet.id}`}
              className="rounded-3xl border border-gray-200 bg-[#FBFBFB] overflow-hidden hover:border-black transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Header */}
                <div className="relative h-48 overflow-hidden bg-gray-100 border-b border-gray-200">
                  <img
                    src={magnet.cover_image}
                    alt={magnet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black text-white text-[10px] font-mono uppercase tracking-wider">
                    {magnet.category}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full">
                    <span>{magnet.pages}</span>
                    <span>{magnet.download_count} Downloads</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="text-xl font-normal -tracking-[0.5px] text-black mb-3 line-clamp-2">
                    {magnet.title}
                  </h3>

                  <p className="text-xs text-gray-600 font-normal leading-relaxed mb-6">
                    {magnet.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Key Takeaways:
                    </div>
                    {magnet.key_takeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 font-normal">
                        <CheckCircle2 className="size-3.5 text-black shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-7 pt-0">
                <button
                  id={`btn-download-magnet-${magnet.id}`}
                  onClick={() => {
                    setActiveMagnet(magnet);
                    setDownloadSuccess(false);
                  }}
                  className="w-full py-3.5 px-5 rounded-full bg-white border border-gray-200 hover:border-black text-black font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Download Free Blueprint</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* DOWNLOAD MODAL */}
      {activeMagnet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-black" />
                <span className="font-mono text-xs uppercase tracking-wider text-black font-semibold">
                  Free Resource Download
                </span>
              </div>
              <button
                onClick={() => setActiveMagnet(null)}
                className="size-8 rounded-full bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-8">
              {!downloadSuccess ? (
                <div>
                  <h3 className="text-xl font-normal -tracking-[0.5px] text-black mb-2">
                    {activeMagnet.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed mb-6">
                    Enter your details below to instantly download this executive blueprint.
                  </p>

                  <form onSubmit={handleDownloadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Nexus Corp"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={downloading}
                      className="w-full mt-3 py-3.5 px-6 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {downloading ? (
                        <>
                          <RefreshCw className="size-3.5 animate-spin" />
                          <span>Preparing Document...</span>
                        </>
                      ) : (
                        <>
                          <Download className="size-3.5" />
                          <span>Instant Download</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="size-16 rounded-full bg-[#FBFBFB] border border-gray-200 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="size-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-normal -tracking-[0.5px] text-black mb-2">
                    Download Initiated!
                  </h3>
                  <p className="text-xs text-gray-600 font-normal leading-relaxed mb-6">
                    Your resource has been compiled and downloaded to your device. We have also sent a reference link to <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => setActiveMagnet(null)}
                    className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
