import React from 'react';
import { Link } from 'react-router-dom';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface CallToActionProps {
  settings?: { [key: string]: string };
}

export default function CallToAction({ settings = {} }: CallToActionProps) {
  const heading = settings.cta_heading || 'Have an Idea?';
  const subtext = settings.cta_subtext || "Let's turn it into technology.";
  const primaryBtn = settings.cta_primary_btn || 'Start a Project';
  const primaryLink = settings.cta_primary_link || '/contact';
  const secondaryBtn = settings.cta_secondary_btn || 'Explore Our Ventures';
  const secondaryLink = settings.cta_secondary_link || '/ventures';
  const tertiaryBtn = settings.cta_tertiary_btn || 'Scope & Cost Calculator';
  const tertiaryLink = settings.cta_tertiary_link || '/estimate';

  return (
    <section id="cta" className="py-16 lg:py-24 bg-[#0A0D15] border-t border-white/[0.08] relative overflow-hidden">
      {/* Ambient orange glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF5C00]/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-10">
          
          <div className="lg:w-8/12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Software &amp; Research Organization
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white leading-tight mb-3">
              {heading} <span className="italic font-normal bg-gradient-to-r from-[#FF5C00] via-[#FF7A1A] to-[#FFA043] bg-clip-text text-transparent">Turn Ideas into Technology.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
              {subtext}
            </p>
          </div>

          <div className="lg:w-4/12 flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full lg:items-end">
            <Link
              to={primaryLink}
              id="cta-book-consultation"
              className="group px-8 py-4 inline-flex gap-2.5 items-center justify-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold -tracking-[0.2px] leading-5 text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.4)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center border border-[#FFA566]/30"
            >
              <RollText>{primaryBtn.toUpperCase()}</RollText>
              <DiagonalArrow size={18} />
            </Link>

            <Link
              to={secondaryLink}
              id="cta-calculate-scope"
              className="group px-8 py-4 inline-flex gap-2.5 items-center justify-center bg-white/[0.05] border border-white/[0.12] text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-white/[0.1] hover:border-[#FF5C00]/50 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto text-center"
            >
              <RollText>{secondaryBtn.toUpperCase()}</RollText>
            </Link>

            <Link
              to={tertiaryLink}
              id="cta-download-deck"
              className="group px-6 py-2.5 inline-flex items-center justify-center text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-[#FF5C00] font-semibold transition-colors w-full sm:w-auto text-center"
            >
              <span>{tertiaryBtn} &rarr;</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
