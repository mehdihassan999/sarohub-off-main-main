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
    <section id="why-choose-us" className="py-12 lg:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
            Our Philosophy &amp; Principles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-3">
            Why <span className="italic">SaroHub?</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto font-normal">
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
                className="p-6 sm:p-7 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="size-12 rounded-2xl bg-black text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-xs">
                    <IconComponent className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors tracking-tight">
                    {point.title}
                  </h3>

                  <p className="text-sm text-gray-700 leading-relaxed font-normal">
                    {point.shortDescription || point.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 font-mono text-xs font-semibold text-gray-700">
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
