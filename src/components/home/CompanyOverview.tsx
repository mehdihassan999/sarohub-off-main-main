import React from 'react';
import { Target, Eye, Lightbulb, Cpu, Compass, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface CompanyOverviewProps {
  settings?: { [key: string]: string };
}

export default function CompanyOverview({ settings = {} }: CompanyOverviewProps) {
  const overviewTitle = settings.overview_title || 'Software. Research. Innovation.';
  const overviewDescription = settings.overview_description ||
    'SaroHub stands for Software & Research Organization. We believe technology should not only be adopted — it should be understood, researched, improved, and created.';
  const overviewSecondary = settings.overview_secondary ||
    'Founded in Gilgit-Baltistan, Pakistan, SaroHub brings together software engineering, research, entrepreneurship, and product development to build technology for a global market.';

  const missionHeading = settings.mission_heading || 'Our Mission';
  const missionText = settings.mission_text ||
    'To research, build, and innovate — turning ideas and real-world problems into meaningful technology. We focus on research-based skills, practical experimentation, and building solutions that create real value.';

  const visionHeading = settings.vision_heading || 'Our Vision';
  const visionText = settings.vision_text ||
    'To build a globally recognized technology and research organization from Gilgit-Baltistan, creating products and innovations that compete on the global stage.';
  const visionSupporting = 'From Gilgit-Baltistan to the World. We are building from here with a global ambition.';

  const storyHeading = settings.story_heading || 'Built From the Mountains. Designed for the World.';
  const storyText1 = 'SaroHub was founded in Gilgit-Baltistan with a simple belief: great technology can be created anywhere.';
  const storyText2 = 'We started by building solutions for real-world problems. With every project, we learned that technology is not only about writing code — it is about understanding problems, researching possibilities, building solutions, and continuously improving them.';
  const storyText3 = 'Today, SaroHub is building toward a larger vision: a technology and research organization capable of creating products and innovations for a global market.';

  const principles = [
    {
      icon: Lightbulb,
      title: 'Research Before We Build',
      desc: 'We study the problem before choosing the technology.',
    },
    {
      icon: Cpu,
      title: "Build, Don't Just Adopt",
      desc: 'We aim to create solutions rather than simply reproduce existing technology.',
    },
    {
      icon: Compass,
      title: 'Product Thinking',
      desc: 'We think beyond delivering code — considering users, scalability, usability, and long-term value.',
    },
    {
      icon: Globe,
      title: 'Built From GB, Built for the World',
      desc: 'Our location does not limit our ambition.',
    },
  ];

  return (
    <section id="overview" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Top: Who We Are & Mission / Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Who We Are */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                Who We Are • Software &amp; Research Organization
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-4 leading-tight">
                Software. Research. <span className="italic text-[#FF5C00]">Innovation.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-3">
                {overviewDescription}
              </p>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal mb-4">
                {overviewSecondary}
              </p>
              <div className="p-4 rounded-2xl bg-[#0E121E] border border-white/[0.08] font-mono text-xs text-white font-semibold flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#FF5C00] shrink-0" />
                SAROHUB — Where Ideas Become Technology.
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="p-6 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.12)] transition-all duration-300 shadow-lg">
                <div className="size-11 rounded-2xl bg-gradient-to-br from-[#FF5C00]/20 to-[#FF5C00]/5 border border-[#FF5C00]/30 text-[#FF6C00] flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(255,92,0,0.2)]">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{missionHeading}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {missionText}
                </p>
              </div>

              <div className="p-6 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.12)] transition-all duration-300 shadow-lg">
                <div className="size-11 rounded-2xl bg-gradient-to-br from-[#FF5C00]/20 to-[#FF5C00]/5 border border-[#FF5C00]/30 text-[#FF6C00] flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(255,92,0,0.2)]">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{visionHeading}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-normal mb-2">
                  {visionText}
                </p>
                <p className="font-mono text-xs text-[#FF7A1A] font-semibold">
                  {visionSupporting}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Guiding Principles */}
          <div className="lg:col-span-6 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block">
              Core Principles
            </span>
            <div className="space-y-3.5">
              {principles.map((item, idx) => {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="p-5 sm:p-6 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.12)] transition-all duration-300 flex items-start gap-4 sm:gap-5 group shadow-lg"
                  >
                    <span className="font-mono text-2xl font-bold italic text-slate-500 group-hover:text-[#FF5C00] transition-colors shrink-0 pt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-[#FF7A1A] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Section 12: Company Story */}
        <div className="p-8 sm:p-10 lg:p-12 rounded-3xl sm:rounded-4xl border border-white/[0.08] bg-[#0E121E] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5C00]/5 blur-[120px] pointer-events-none -z-10" />
          <div className="max-w-4xl relative z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block">
              Our Journey &amp; Ambition
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal -tracking-[1.4px] text-white mb-4">
              {storyHeading}
            </h3>
            <div className="space-y-4 text-base text-slate-300 leading-relaxed font-normal">
              <p>{storyText1}</p>
              <p>{storyText2}</p>
              <p className="font-medium text-white">{storyText3}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
