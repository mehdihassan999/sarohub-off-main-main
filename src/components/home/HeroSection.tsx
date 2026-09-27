import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';
import SaroRobotMascot from './SaroRobotMascot';
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
    <section id="hero" className="lg:pt-14 lg:pb-16 pt-8 pb-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Two-Column Editorial Layout: Content on Left, Robot on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-12 lg:mb-16">
          
          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Kicker Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gray-700 font-semibold mb-3.5 inline-flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 inline-block shadow-xs" />
              {heroBadge}
            </motion.div>

            {/* Official Slogan Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal -tracking-[2px] mb-4 text-black leading-[1.06]"
            >
              {heroHeading} <br className="hidden sm:inline" />
              <span className="italic font-normal">{heroHeadingAccent}</span>
            </motion.h1>

            {/* Typewriter Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="min-h-[38px] flex items-center mb-5"
            >
              <span className="font-mono text-xs sm:text-sm text-gray-800 bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full inline-flex items-center shadow-xs">
                <span className="text-black font-bold mr-2">●</span>
                <span>{currentText}</span>
                <span className="inline-block w-1.5 h-3.5 bg-black ml-1.5 animate-pulse" />
              </span>
            </motion.div>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mb-8 text-gray-700 text-base sm:text-lg leading-relaxed -tracking-[0.2px] max-w-xl font-normal"
            >
              {heroDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-3.5 mb-8"
            >
              <Link
                to={primaryCtaLink}
                id="hero-primary-cta"
                className="group px-7 py-3.5 sm:py-4 flex gap-2.5 items-center bg-black text-sm font-semibold -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-sm"
              >
                <RollText>{primaryCtaText.toUpperCase()}</RollText>
                <DiagonalArrow size={18} />
              </Link>

              <Link
                to={secondaryCtaLink}
                id="hero-secondary-cta"
                className="group px-7 py-3.5 sm:py-4 flex gap-2.5 items-center bg-white border border-gray-300 text-sm font-semibold -tracking-[0.2px] leading-5 text-black rounded-full hover:bg-gray-50 hover:border-black transition-all duration-300 shadow-xs"
              >
                <RollText>{secondaryCtaText.toUpperCase()}</RollText>
              </Link>
            </motion.div>

            {/* Clean Statistics Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-2 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-6 sm:gap-8 text-xs w-full max-w-xl"
            >
              <div>
                <span className="block font-bold text-2xl text-black">4+</span>
                <span className="text-gray-700 text-xs sm:text-[13px] font-bold tracking-wider uppercase font-mono">Ventures &amp; Products</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-200" />
              <div>
                <span className="block font-bold text-2xl text-black">10+</span>
                <span className="text-gray-700 text-xs sm:text-[13px] font-bold tracking-wider uppercase font-mono">Client Projects</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-200" />
              <div>
                <span className="block font-bold text-2xl text-black">100%</span>
                <span className="text-gray-700 text-xs sm:text-[13px] font-bold tracking-wider uppercase font-mono">Client Satisfaction</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: High-Tech Animated SaroHub Robot with Speech Bubble */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center"
            >
              <SaroRobotMascot showBubble={true} />
            </motion.div>
          </div>

        </div>

        {/* 3 Pillars / Capabilities Preview Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#FBFBFB] border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200 shadow-xs"
        >
          <div className="pt-4 md:pt-0 md:pr-6 text-left">
            <span className="font-mono text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">01 / Engineering</span>
            <h4 className="text-lg sm:text-xl font-bold text-black mb-1">{pillar1Title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed font-normal">{pillar1Sub}</p>
          </div>

          <div className="pt-6 md:pt-0 md:px-6 text-left">
            <span className="font-mono text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">02 / Ventures</span>
            <h4 className="text-lg sm:text-xl font-bold text-black mb-1">{pillar2Title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed font-normal">{pillar2Sub}</p>
          </div>

          <div className="pt-6 md:pt-0 md:pl-6 text-left">
            <span className="font-mono text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">03 / Innovation</span>
            <h4 className="text-lg sm:text-xl font-bold text-black mb-1">{pillar3Title}</h4>
            <p className="text-sm text-gray-700 leading-relaxed font-normal">{pillar3Sub}</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
