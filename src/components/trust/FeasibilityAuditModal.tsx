import React, { useState } from 'react';
import { 
  Clock, ShieldCheck, CheckCircle2, X, RefreshCw, Send, 
  FileCode, Layers, Lock, Sparkles, ArrowRight
} from 'lucide-react';
import { api } from '../../api';

interface FeasibilityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FeasibilityAuditModal: React.FC<FeasibilityAuditModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company: '',
    phone: '',
    project_name: '',
    tech_stack: '',
    project_stage: 'Concept / Spec Only',
    repo_or_spec_link: '',
    timeline: 'Immediate (< 4 Weeks)',
    budget_range: '$10,000 - $25,000',
    challenges: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.project_name) {
      setError('Please fill in your name, work email, and project name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.submitFeasibilityAudit(formData);
      if (res.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Submission failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit audit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#FBFBFB] border-b border-gray-200 p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 size-9 rounded-full bg-white border border-gray-200 hover:border-black flex items-center justify-center text-black transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>

          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
            Guaranteed 48-Hour Turnaround
          </span>
          <h3 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-black">
            48-Hour Architecture &amp; Feasibility Audit
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
            Submit your concept, Figma links, or Git repo. Our lead architects will deliver an executive feasibility dossier, risk breakdown, and fixed-price sprint plan under strict NDA.
          </p>
        </div>

        {/* Content Form */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Ventures"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                    WhatsApp / Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                  Project Title / Initiative Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="e.g. AI-Powered Logistics Dispatcher"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                    Current Maturity Stage
                  </label>
                  <select
                    value={formData.project_stage}
                    onChange={(e) => setFormData({ ...formData, project_stage: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black bg-white outline-none"
                  >
                    <option value="Concept / Spec Only">Concept / Specification Only</option>
                    <option value="Figma Designs Complete">Figma Designs Ready</option>
                    <option value="Existing Codebase (Legacy)">Existing Codebase / Needs Refactor</option>
                    <option value="Live SaaS Scaling">Live In Production (Scaling)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                    Budget Expectation
                  </label>
                  <select
                    value={formData.budget_range}
                    onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black bg-white outline-none"
                  >
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000 - $50,000+">$25,000 - $50,000+</option>
                    <option value="Sweat Equity / Co-Founding">Sweat Equity / Co-Founding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                  Link to Spec, PRD, Figma, or GitHub (Optional)
                </label>
                <input
                  type="text"
                  value={formData.repo_or_spec_link}
                  onChange={(e) => setFormData({ ...formData, repo_or_spec_link: e.target.value })}
                  placeholder="https://figma.com/file/... or https://github.com/..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                  Key Challenges or Architecture Questions
                </label>
                <textarea
                  rows={3}
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  placeholder="Describe performance bottlenecks, target user concurrency, cloud preferences..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black outline-none resize-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FBFBFB] border border-gray-200 flex items-start gap-3">
                <ShieldCheck className="size-4 text-black shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
                  Confidentiality Guaranteed: By submitting, SaroHub extends mutual bilateral NDA coverage over all submitted links, intellectual property, and documentation.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>Submitting For Audit Review...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>Request Complimentary Audit (48-Hr SLA)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="size-16 rounded-full bg-[#FBFBFB] border border-gray-200 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="size-8 text-black" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                Audit Request Registered
              </span>
              <h3 className="text-2xl font-normal -tracking-[0.5px] text-black mb-3">
                We Have Received Your Project Submission
              </h3>
              <p className="text-xs text-gray-600 font-normal leading-relaxed mb-6 max-w-md mx-auto">
                Our lead architecture committee has been notified. You will receive your executive feasibility analysis at <strong>{formData.email}</strong> within 48 business hours.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
