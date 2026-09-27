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
      className="group flex flex-col justify-between rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black hover:shadow-md overflow-hidden transition-all duration-300 h-full"
    >
      {/* Media Header */}
      <div className="relative h-48 bg-gray-900 overflow-hidden border-b border-gray-200">
        {venture.coverImage ? (
          <img
            src={venture.coverImage}
            alt={venture.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <Rocket className="w-12 h-12 text-gray-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors tracking-tight leading-snug">
              {venture.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed mb-5 font-normal">
            {venture.tagline || venture.description}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 flex items-center justify-between mt-auto">
          <Link
            to={detailUrl}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-black group-hover:text-gray-700 font-bold transition-colors"
          >
            <span>View Venture</span>
            <span className="transition-transform group-hover:translate-x-1 font-sans">&rarr;</span>
          </Link>

          {(venture.websiteUrl || venture.demoUrl) && (
            <a
              href={venture.websiteUrl || venture.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider text-gray-700 hover:text-black font-semibold flex items-center gap-1 transition-colors"
              title="Live Link"
            >
              <span>Live Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VentureCard;
