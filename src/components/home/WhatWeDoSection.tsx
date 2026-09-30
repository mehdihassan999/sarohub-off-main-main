import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Layers, Handshake, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface WhatWeDoSectionProps {
  settings?: { [key: string]: string };
}

export default function WhatWeDoSection({ settings = {} }: WhatWeDoSectionProps) {
  const sectionBadge = settings.what_we_do_badge || 'Software & Research Organization • Core Engines';
  const sectionHeading = settings.what_we_do_heading || 'Software. Research. Innovation.';
  const sectionSubtext = settings.what_we_do_subtext ||
    'We believe technology should not only be adopted — it should be understood, researched, improved, and created. SaroHub brings together software engineering, practical research, and venture development.';

  const parseHighlights = (raw: string | undefined, defaultList: string[]) => {
    if (!raw) return defaultList;
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean);
      } catch { /* ignore */ }
    }
    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.length > 0 ? lines : defaultList;
  };

  const defaultP1Highlights = [
    'Web Applications & Mobile Apps',
    'Custom Software & SaaS Platforms',
    'CRM & Enterprise Business Systems',
    'E-commerce & Workflow Platforms'
  ];

  const defaultP2Highlights = [
    'Artificial Intelligence & Automation',
    'Software Engineering & Cloud Systems',
    'Cybersecurity & Distributed Systems',
    'Emerging Technologies & Prototypes'
  ];

  const defaultP3Highlights = [
    'Alin316: School Management & EdTech',
    'SaroHub CRM: Sales & Business Management',
    'SaroHub Sentinel: Healthcare Technology',
    'SaroHub Real Estate: Property Platform'
  ];

  const pillars = [
    {
      id: 'businesses',
      title: settings.what_we_do_p1_title || 'Software Development',
      badge: settings.what_we_do_p1_badge || 'Custom Engineering',
      description: settings.what_we_do_p1_desc || 'We design, engineer, and deploy high-performance web applications, mobile apps, SaaS platforms, and enterprise business systems that solve real-world problems.',
      highlights: parseHighlights(settings.what_we_do_p1_highlights, defaultP1Highlights),
      ctaText: settings.what_we_do_p1_cta_text || 'Build With Us',
      ctaLink: settings.what_we_do_p1_cta_link || '/contact',
      icon: Layers,
      number: '01'
    },
    {
      id: 'research',
      title: settings.what_we_do_p2_title || 'Research & Innovation',
      badge: settings.what_we_do_p2_badge || 'Practical Solutions',
      description: settings.what_we_do_p2_desc || 'We believe the next generation of technology comes from people who research, experiment, and build. We explore emerging tech and transform research into practical tools.',
      highlights: parseHighlights(settings.what_we_do_p2_highlights, defaultP2Highlights),
      ctaText: settings.what_we_do_p2_cta_text || 'Explore Research Areas',
      ctaLink: settings.what_we_do_p2_cta_link || '/technology',
      icon: Handshake,
      number: '02'
    },
    {
      id: 'ventures',
      title: settings.what_we_do_p3_title || 'Our Ventures',
      badge: settings.what_we_do_p3_badge || 'Proprietary Tech',
      description: settings.what_we_do_p3_desc || "We don't just build technology for others. We build our own. From EdTech to PropTech and HealthTech, we incubate products built to compete globally.",
      highlights: parseHighlights(settings.what_we_do_p3_highlights, defaultP3Highlights),
      ctaText: settings.what_we_do_p3_cta_text || 'Explore Our Ventures',
      ctaLink: settings.what_we_do_p3_cta_link || '/ventures',
      icon: Rocket,
      number: '03'
    }
  ];

  return (
    <section 
      id="what-we-do" 
      className="bg-[#0A0D15] py-14 lg:py-20 text-white rounded-3xl sm:rounded-4xl mx-3 sm:mx-6 lg:mx-8 my-6 sm:my-8 overflow-hidden border border-white/[0.08] relative shadow-2xl"
    >
      {/* Ambient orange glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#FF5C00]/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 sm:mb-12 pb-6 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest block mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
              {sectionBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white leading-tight">
              Software. Research. <span className="italic text-[#FF5C00]">Innovation.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            {sectionSubtext}
          </p>
        </div>

        {/* 3 Major Pillars (Vaboulus Dark Bento Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                id={`card-${pillar.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(255,92,0,0.15)] transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="font-mono text-2xl font-bold italic text-slate-500 group-hover:text-[#FF5C00] transition-colors">
                      {pillar.number}
                    </span>
                    <span className="text-[11px] font-mono font-semibold uppercase px-3 py-1 rounded-full border border-[#FF5C00]/25 bg-[#FF5C00]/10 text-[#FF7A1A]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>

                  <ul className="space-y-2.5 mb-8 border-t border-white/[0.08] pt-5">
                    {pillar.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={pillar.ctaLink}
                  id={`cta-${pillar.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-gradient-to-r hover:from-[#FF5C00] hover:via-[#FF6C00] hover:to-[#FF8526] hover:border-[#FFA566]/30 hover:shadow-[0_0_24px_rgba(255,92,0,0.4)] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 group/btn shadow-xs"
                >
                  <RollText>{pillar.ctaText.toUpperCase()}</RollText>
                  <DiagonalArrow size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
