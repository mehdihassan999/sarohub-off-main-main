import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { Venture } from '../../types';
import VentureStatus from './VentureStatus';

interface VentureCardProps {
  venture: Venture;
  index: number;
}

const VentureCard: React.FC<VentureCardProps> = ({ venture, index }) => {
  const detailUrl = venture.learnMoreUrl || `/ventures/${venture.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      className="group flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] overflow-hidden transition-all duration-300 h-full shadow-lg"
    >
      {/* Media Header */}
      <div className="relative h-48 bg-[#141828] overflow-hidden border-b border-white/[0.08]">
        {venture.coverImage ? (
          <img
            src={venture.coverImage}
            alt={venture.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#141828]">
            <Rocket className="w-12 h-12 text-[#FF5C00]/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3.5 right-3.5">
          <VentureStatus status={venture.status} size="sm" />
        </div>

        {/* Category Tag */}
        {venture.category && (
          <div className="absolute bottom-3 left-3.5">
            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-xs">
              {venture.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <Link to={detailUrl}>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#FF7A1A] transition-colors tracking-tight leading-snug font-display">
              {venture.name}
            </h3>
          </Link>
          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-5 font-normal">
            {venture.tagline || venture.description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between mt-auto">
          <Link
            to={detailUrl}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white hover:text-[#FF5C00] font-bold transition-colors"
          >
            <span>View Venture</span>
            <span className="transition-transform group-hover:translate-x-1 font-sans text-[#FF5C00]">&rarr;</span>
          </Link>

          {(venture.websiteUrl || venture.demoUrl) && (
            <a
              href={venture.websiteUrl || venture.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-[#FF5C00] font-semibold flex items-center gap-1 transition-colors"
              title="Live Link"
            >
              <span>Live Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF5C00]" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VentureCard;
