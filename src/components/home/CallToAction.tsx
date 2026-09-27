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
    <section id="cta" className="py-12 lg:py-16 bg-[#FBFBFB] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-10">
          
          <div className="lg:w-8/12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Software &amp; Research Organization
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black leading-tight mb-3">
              {heading}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal max-w-xl">
              {subtext}
            </p>
          </div>

          <div className="lg:w-4/12 flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full lg:items-end">
            <Link
              to={primaryLink}
              id="cta-book-consultation"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center justify-center bg-black text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto text-center shadow-xs"
            >
              <RollText>{primaryBtn.toUpperCase()}</RollText>
              <DiagonalArrow size={18} />
            </Link>

            <Link
              to={secondaryLink}
              id="cta-calculate-scope"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center justify-center bg-white border border-black text-sm font-medium -tracking-[0.2px] leading-5 text-black rounded-full hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto text-center shadow-xs"
            >
              <RollText>{secondaryBtn.toUpperCase()}</RollText>
            </Link>

            <Link
              to={tertiaryLink}
              id="cta-download-deck"
              className="group px-6 py-2.5 inline-flex items-center justify-center text-xs font-mono uppercase tracking-wider text-gray-700 hover:text-black font-semibold transition-colors w-full sm:w-auto text-center"
            >
              <span>{tertiaryBtn} &rarr;</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
