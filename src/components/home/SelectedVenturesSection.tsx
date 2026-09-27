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
    <section id="selected-ventures" className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 pb-6 border-b border-gray-200">
          <div>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block mb-2">
              Proprietary Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-2">
              Our <span className="italic">Ventures</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-normal">
              We don't just build technology for others. We build our own.
            </p>
          </div>

          <Link
            to="/ventures"
            id="view-all-ventures-top"
            className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-black text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shrink-0 shadow-xs"
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
                className="h-80 rounded-3xl border border-gray-200 bg-white animate-pulse"
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
                className="flex flex-col justify-between p-6 rounded-3xl border border-gray-200 bg-white hover:border-black hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* Media Banner with Hover Scale */}
                  <Link 
                    to={`/ventures/${venture.slug}`}
                    className="block overflow-hidden rounded-2xl relative aspect-[16/10] bg-gray-100 border border-gray-200 mb-5 shadow-xs"
                  >
                    {venture.coverImage ? (
                      <img 
                        src={venture.coverImage} 
                        alt={venture.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase text-gray-400">
                        {venture.name}
                      </div>
                    )}
                  </Link>

                  <div className="flex justify-between items-center text-xs font-mono uppercase mb-3 text-gray-700">
                    <span className="font-semibold text-gray-700">{venture.category || 'Venture'}</span>
                    <span className="font-bold text-black px-2 py-0.5 rounded-sm bg-gray-100 border border-gray-200 text-[10px]">{venture.status || 'Active'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors tracking-tight">
                    <Link to={`/ventures/${venture.slug}`}>
                      {venture.name}
                    </Link>
                  </h3>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed font-normal">
                    {venture.description || venture.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to={`/ventures/${venture.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-black group-hover:text-gray-700 font-bold transition-colors"
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
