import React, { useEffect, useState } from 'react';
import { 
  Lightbulb, Cpu, Target, HeartHandshake, CheckCircle, TrendingUp, Grid, Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../api';

interface WhyChooseUsProps {
  settings?: { [key: string]: string };
}

const ICON_MAP: { [key: string]: any } = {
  Lightbulb,
  Cpu,
  Target,
  HeartHandshake,
  CheckCircle,
  TrendingUp,
  Grid,
  Award
};

export default function WhyChooseUs({ settings = {} }: WhyChooseUsProps) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.getWhySaroHub()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.filter(i => i.status === 'active'));
        } else {
          setItems(defaultFallbackPoints);
        }
      })
      .catch(() => setItems(defaultFallbackPoints));
  }, []);

  const defaultFallbackPoints = [
    {
      icon: 'Lightbulb',
      title: settings.why_1_title || 'Research Before We Build',
      shortDescription: settings.why_1_desc || 'We study the problem before choosing the technology.',
    },
    {
      icon: 'Cpu',
      title: settings.why_2_title || "Build, Don't Just Adopt",
      shortDescription: settings.why_2_desc || 'We aim to create solutions rather than simply reproduce existing technology.',
    },
    {
      icon: 'Target',
      title: settings.why_3_title || 'Product Thinking',
      shortDescription: settings.why_3_desc || 'We think beyond delivering code — considering users, scalability, usability, and long-term value.',
    },
    {
      icon: 'HeartHandshake',
      title: settings.why_4_title || 'Built From GB, Built for the World',
      shortDescription: settings.why_4_desc || 'Our location does not limit our ambition.',
    },
  ];

  const sectionHeading = settings.why_heading || 'Why SaroHub?';
  const sectionSubtitle = settings.why_subtitle || 'Where Ideas Become Technology — built on research-based engineering, product thinking, and global ambition.';

  const displayPoints = items.length > 0 ? items : defaultFallbackPoints;

  return (
    <section id="why-choose-us" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Our Philosophy &amp; Principles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-3">
            Why <span className="italic text-[#FF5C00]">SaroHub?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            {sectionSubtitle}
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPoints.map((point, idx) => {
            const IconComponent = ICON_MAP[point.icon] || Lightbulb;

            return (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="size-12 rounded-2xl bg-gradient-to-br from-[#FF5C00]/20 to-[#FF5C00]/5 border border-[#FF5C00]/30 text-[#FF6C00] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(255,92,0,0.2)]">
                    <IconComponent className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#FF5C00] transition-colors tracking-tight">
                    {point.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {point.shortDescription || point.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] font-mono text-xs font-semibold text-[#FF7A1A]">
                  {`0${idx + 1} / PILLAR`}
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
