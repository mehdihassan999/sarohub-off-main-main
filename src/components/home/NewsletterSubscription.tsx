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
    <section id="newsletter-segment" className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl p-6 sm:p-10 lg:p-12 border border-gray-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xs">
          <div className="space-y-2.5 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block">
              Technical Journal &bull; Bi-weekly
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal -tracking-[1.8px] text-black">
              Subscribe to SaroHub <span className="italic">Bulletin</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
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
                  className="w-full rounded-full border border-gray-200 px-5 py-3.5 text-sm placeholder:text-gray-400 bg-[#FBFBFB] text-black focus:border-black focus:outline-none transition-all shadow-xs"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="group px-6 py-3.5 inline-flex items-center gap-2 bg-black text-xs font-mono font-semibold uppercase tracking-wider text-white rounded-full hover:bg-gray-800 transition-all shrink-0 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <RollText>{loading ? '...' : 'JOIN'}</RollText>
                  <DiagonalArrow size={14} />
                </button>
              </div>

              {status && (
                <p className={`text-xs font-mono ${
                  status.type === 'success' ? 'text-emerald-700 font-semibold' : 'text-red-600'
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
