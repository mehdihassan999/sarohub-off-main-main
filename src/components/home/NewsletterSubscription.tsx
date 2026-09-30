import React, { useState } from 'react';
import { api } from '../../api';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid electronic email address.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus({ type: 'success', message: res.message || 'Subscribed successfully to our corporate bulletin!' });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Newsletter registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter-segment" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/[0.08] bg-[#0E121E] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2.5 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Technical Journal &bull; Bi-weekly
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal -tracking-[1.8px] text-white">
              Subscribe to SaroHub <span className="italic text-[#FF5C00]">Bulletin</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              Receive engineering reports, architecture analyses, and direct technology updates from our headquarters. Zero spam.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 min-w-[300px] sm:min-w-[360px]">
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-white/10 px-5 py-3.5 text-sm placeholder:text-slate-500 bg-[#141828] text-white focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] focus:outline-none transition-all shadow-xs"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="group px-7 py-3.5 inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_20px_rgba(255,92,0,0.5)] text-xs font-mono font-bold uppercase tracking-wider text-white rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-50 border border-[#FFA566]/30"
                >
                  <RollText>{loading ? '...' : 'JOIN'}</RollText>
                  <DiagonalArrow size={14} />
                </button>
              </div>

              {status && (
                <p className={`text-xs font-mono ${
                  status.type === 'success' ? 'text-emerald-400 font-semibold' : 'text-rose-400'
                }`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
