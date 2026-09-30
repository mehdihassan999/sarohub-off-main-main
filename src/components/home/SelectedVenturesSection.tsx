import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '../../api';
import { Venture } from '../../types';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

export default function SelectedVenturesSection() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVentures()
      .then((data) => {
        const published = (data as Venture[]).filter((v) => v.published);
        const featured = published.filter(v => v.featured);
        setVentures(featured.length >= 3 ? featured.slice(0, 4) : published.slice(0, 4));
      })
      .catch((err) => {
        console.error('Error fetching ventures:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="selected-ventures" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest block mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
              Proprietary Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-2">
              Our <span className="italic text-[#FF5C00]">Ventures</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal">
              We don't just build technology for others. We build our own.
            </p>
          </div>

          <Link
            to="/ventures"
            id="view-all-ventures-top"
            className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0 border border-[#FFA566]/30"
          >
            <RollText>EXPLORE ALL VENTURES</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>

        {/* Ventures Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl border border-white/[0.08] bg-[#0E121E] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ventures.map((venture, idx) => (
              <motion.article
                key={venture.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="flex flex-col justify-between p-6 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.12)] transition-all duration-300 group"
              >
                <div>
                  {/* Media Banner with Hover Scale */}
                  <Link 
                    to={`/ventures/${venture.slug}`}
                    className="block overflow-hidden rounded-2xl relative aspect-[16/10] bg-[#141828] border border-white/[0.08] mb-5 shadow-xs"
                  >
                    {venture.coverImage ? (
                      <img 
                        src={venture.coverImage} 
                        alt={venture.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase text-slate-500">
                        {venture.name}
                      </div>
                    )}
                  </Link>

                  <div className="flex justify-between items-center text-xs font-mono uppercase mb-3">
                    <span className="font-semibold text-slate-400">{venture.category || 'Venture'}</span>
                    <span className="font-bold text-[#FF7A1A] px-2.5 py-0.5 rounded-full bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[10px]">{venture.status || 'Active'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF5C00] transition-colors tracking-tight">
                    <Link to={`/ventures/${venture.slug}`}>
                      {venture.name}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed font-normal">
                    {venture.description || venture.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08]">
                  <Link
                    to={`/ventures/${venture.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 group-hover:text-[#FF5C00] font-bold transition-colors"
                  >
                    <span>Read Venture Dossier</span>
                    <span className="transition-transform group-hover:translate-x-1 font-sans">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
