import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';
import VaboulusRobotMascot from './VaboulusRobotMascot';
import { ShieldCheck, Zap, Globe } from 'lucide-react';

const DEFAULT_TYPED_PHRASES = [
  "Where Ideas Become Technology.",
  "Software & Research Organization",
  "Research + Technology + Innovation",
  "Custom Software & SaaS Platforms",
  "AI & Intelligent Workflows",
  "From Gilgit-Baltistan to the World"
];

interface HeroSectionProps {
  settings?: { [key: string]: string };
}

export default function HeroSection({ settings = {} }: HeroSectionProps) {
  // Parse typed phrases from settings or fall back to defaults
  const typedPhrases: string[] = React.useMemo(() => {
    if (settings.hero_typed_phrases) {
      const raw = settings.hero_typed_phrases.trim();
      if (raw.startsWith('[') && raw.endsWith(']')) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean);
        } catch { /* ignore */ }
      }
      const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length > 0) return lines;
    }
    return DEFAULT_TYPED_PHRASES;
  }, [settings.hero_typed_phrases]);

  const heroBadge = settings.hero_badge || 'SAROHUB • Software & Research Organization';
  const heroHeading = settings.hero_heading || 'Where Ideas Become';
  const heroHeadingAccent = settings.hero_heading_accent || 'Technology.';
  const heroDescription = settings.hero_description ||
    'We research, design, build, and launch technology that solves real-world problems — from custom software and SaaS platforms to our own technology ventures.';

  const primaryCtaText = settings.hero_primary_cta_text || 'Build With Us';
  const primaryCtaLink = settings.hero_primary_cta_link || '/contact';
  const secondaryCtaText = settings.hero_secondary_cta_text || 'Explore Our Ventures';
  const secondaryCtaLink = settings.hero_secondary_cta_link || '/ventures';

  const pillar1Title = settings.hero_pillar1_title || 'Software Engineering';
  const pillar1Sub = settings.hero_pillar1_sub || 'Web, Mobile, SaaS & Custom Systems';
  const pillar2Title = settings.hero_pillar2_title || 'Proprietary Ventures';
  const pillar2Sub = settings.hero_pillar2_sub || 'EdTech, PropTech, HealthTech & CRM';
  const pillar3Title = settings.hero_pillar3_title || 'Research & Global Vision';
  const pillar3Sub = settings.hero_pillar3_sub || 'From Gilgit-Baltistan to the World';

  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(70);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullPhrase = typedPhrases[currentPhraseIdx];

    const handleType = () => {
      if (!isDeleting) {
        setCurrentText(fullPhrase.substring(0, currentText.length + 1));
        setTypingSpeed(60);

        if (currentText === fullPhrase) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 2400);
          return;
        }
      } else {
        setCurrentText(fullPhrase.substring(0, currentText.length - 1));
        setTypingSpeed(25);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentPhraseIdx((prev) => (prev + 1) % typedPhrases.length);
          setTypingSpeed(280);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIdx, typingSpeed, typedPhrases]);

  return (
    <section id="hero" className="lg:pt-14 lg:pb-16 pt-8 pb-10 bg-[#08090E] relative overflow-hidden">
      {/* Vaboulus Atmospheric Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-b from-[#FF5C00]/14 via-[#FF5C00]/5 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Two-Column Editorial Layout: Content on Left, Robot on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-12 lg:mb-16">
          
          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Kicker Label (Vaboulus Pill Eyebrow) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="vaboulus-badge">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]" />
                </span>
                {heroBadge}
              </span>
            </motion.div>

            {/* Official Slogan Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal -tracking-[2px] mb-4 text-white leading-[1.06]"
            >
              {heroHeading} <br className="hidden sm:inline" />
              <span className="italic font-normal bg-gradient-to-r from-[#FF5C00] via-[#FF7A1A] to-[#FFA043] bg-clip-text text-transparent">
                {heroHeadingAccent}
              </span>
            </motion.h1>

            {/* Typewriter Badge (Dark Glass Pill) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="min-h-[38px] flex items-center mb-5"
            >
              <span className="font-mono text-xs sm:text-sm text-slate-200 bg-[#0E121E] border border-white/[0.1] px-4 py-1.5 rounded-full inline-flex items-center shadow-lg backdrop-blur-md">
                <span className="text-[#FF5C00] font-bold mr-2">●</span>
                <span>{currentText}</span>
                <span className="inline-block w-1.5 h-3.5 bg-[#FF5C00] ml-1.5 animate-pulse" />
              </span>
            </motion.div>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mb-8 text-slate-300 text-base sm:text-lg leading-relaxed -tracking-[0.2px] max-w-xl font-normal"
            >
              {heroDescription}
            </motion.p>

            {/* CTA Buttons (Vaboulus Primary + Secondary) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-3.5 mb-8"
            >
              <Link
                to={primaryCtaLink}
                id="hero-primary-cta"
                className="group px-8 py-3.5 sm:py-4 flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold -tracking-[0.2px] leading-5 text-white rounded-full shadow-[0_0_28px_rgba(255,92,0,0.45)] hover:shadow-[0_0_40px_rgba(255,92,0,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-[#FFA566]/30"
              >
                <RollText>{primaryCtaText.toUpperCase()}</RollText>
                <DiagonalArrow size={18} />
              </Link>

              <Link
                to={secondaryCtaLink}
                id="hero-secondary-cta"
                className="group px-8 py-3.5 sm:py-4 flex gap-2.5 items-center bg-white/[0.05] border border-white/[0.12] text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-white/[0.1] hover:border-[#FF5C00]/50 hover:scale-[1.02] transition-all duration-300"
              >
                <RollText>{secondaryCtaText.toUpperCase()}</RollText>
              </Link>
            </motion.div>

            {/* Clean Statistics Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-2 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-6 sm:gap-8 text-xs w-full max-w-xl"
            >
              <div>
                <span className="block font-bold text-2xl text-white">4<span className="text-[#FF5C00]">+</span></span>
                <span className="text-slate-400 text-xs sm:text-[13px] font-bold tracking-wider uppercase font-mono">Ventures &amp; Products</span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.1]" />
              <div>
                <span className="block font-bold text-2xl text-white">10<span className="text-[#FF5C00]">+</span></span>
                <span className="text-slate-400 text-xs sm:text-[13px] font-bold tracking-wider uppercase font-mono">Client Projects</span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.1]" />
              <div>
                <span className="block font-bold text-2xl text-white">100<span className="text-[#FF5C00]">%</span></span>
                <span className="text-slate-400 text-xs sm:text-[13px] font-bold tracking-wider uppercase font-mono">Client Satisfaction</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: 3D Animated Superhero Robot Mascot */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center items-center"
            >
              <VaboulusRobotMascot />
            </motion.div>
          </div>

        </div>

        {/* 3 Pillars / Capabilities Preview Banner (Vaboulus Bento Style) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0E121E]/90 border border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] shadow-2xl backdrop-blur-xl hover:border-[#FF5C00]/30 transition-colors"
        >
          <div className="pt-4 md:pt-0 md:pr-6 text-left">
            <span className="font-mono text-xs text-[#FF5C00] font-semibold uppercase tracking-wider block mb-1">01 / Engineering</span>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1">{pillar1Title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">{pillar1Sub}</p>
          </div>

          <div className="pt-6 md:pt-0 md:px-6 text-left">
            <span className="font-mono text-xs text-[#FF5C00] font-semibold uppercase tracking-wider block mb-1">02 / Ventures</span>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1">{pillar2Title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">{pillar2Sub}</p>
          </div>

          <div className="pt-6 md:pt-0 md:pl-6 text-left">
            <span className="font-mono text-xs text-[#FF5C00] font-semibold uppercase tracking-wider block mb-1">03 / Innovation</span>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1">{pillar3Title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">{pillar3Sub}</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
