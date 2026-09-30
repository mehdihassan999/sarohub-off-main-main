import React, { useState } from 'react';
import { Quote, Mail, MapPin, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface CEOMessageProps {
  settings: { [key: string]: string };
}

const CEO_FULL_MESSAGE = `Bismillah ir-Rahman ir-Rahim.

In the Name of Allah, the Most Gracious, the Most Merciful.

When I founded SaroHub Technologies, my vision was clear: to build a technology company that not only creates reliable software and digital solutions, but also uplifts our community in Gilgit-Baltistan and Pakistan at large. Coming from Skardu, I know firsthand that talent and ambition are not limited by geography—only by opportunity.

SaroHub is our answer to that challenge. We build digital products, launch scalable ventures, and deliver modern technology solutions that serve clients worldwide, while staying deeply rooted in our values. We believe that innovation driven by purpose creates lasting impact.

To our clients and partners: thank you for trusting us with your ambitions. We do not take that trust lightly. Every project, every solution, and every line of code we write carries our commitment to excellence, integrity, and your success.

To the young talent of Gilgit-Baltistan: you belong in this industry. Technology is for everyone with the curiosity to learn and the courage to build. SaroHub's doors are open to you—as teammates, learners, and future founders.

We are just getting started. The best is yet to come.

— Mehdi Hassan
  CEO & Founder, SaroHub Technologies`;

export default function CEOMessage({ settings }: CEOMessageProps) {
  const [expanded, setExpanded] = useState(false);

  const ceoName = settings.ceo_name || 'Mehdi Hassan';
  const ceoTitle = settings.ceo_title || 'Founder & Chief Executive Officer';
  const ceoPhoto = settings.ceo_photo || '/uploads/img-1789638899546-msakxi.webp';
  const companyName = settings.company_name || 'SaroHub Technologies (Pvt) Ltd';
  const ceoMessage = settings.ceo_message || CEO_FULL_MESSAGE;

  return (
    <section id="ceo-message" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Executive Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-3">
            Founder &amp; CEO <span className="italic text-[#FF5C00]">Statement</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            A personal pledge of purpose, integrity, and global technological ambition from the founder of {companyName}.
          </p>
        </div>

        {/* Master Executive Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/[0.08] bg-[#0E121E] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: CEO Profile & Metrics */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="size-44 sm:size-48 rounded-3xl overflow-hidden border border-white/[0.1] bg-[#141828] shadow-md">
                <img
                  src={ceoPhoto}
                  alt={ceoName}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
                  {ceoName}
                </h3>
                <p className="font-mono text-xs uppercase text-slate-400 tracking-wider font-semibold">
                  {ceoTitle}
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-400 mt-1 font-mono">
                  <MapPin className="size-3.5 text-[#FF5C00]" />
                  <span>Skardu, Gilgit-Baltistan</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full pt-1">
                <div className="p-3 rounded-2xl border border-white/[0.08] bg-[#141828] shadow-xs">
                  <span className="text-[10px] font-mono text-[#FF7A1A] uppercase block mb-0.5 font-semibold">Founded</span>
                  <span className="text-sm font-bold text-white">2022 (Reg. 2026)</span>
                </div>
                <div className="p-3 rounded-2xl border border-white/[0.08] bg-[#141828] shadow-xs">
                  <span className="text-[10px] font-mono text-[#FF7A1A] uppercase block mb-0.5 font-semibold">Ventures</span>
                  <span className="text-sm font-bold text-white">5+ Built</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="group w-full px-6 py-3.5 inline-flex justify-center gap-2 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-xs font-mono uppercase tracking-wider text-white rounded-full hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] transition-all cursor-pointer font-semibold border border-[#FFA566]/30"
              >
                <RollText>DIRECT INQUIRY</RollText>
                <DiagonalArrow size={16} />
              </Link>
            </div>

            {/* Right: Statement Text */}
            <div className="lg:col-span-8 space-y-5">
              <div className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#141828] relative shadow-md">
                <Quote className="size-7 text-[#FF5C00] mb-2" />
                <p className="text-base sm:text-lg font-normal text-white italic leading-relaxed">
                  "Talent and ambition are not limited by geography—only by opportunity. SaroHub is our answer to that challenge."
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                <p>
                  When I founded SaroHub Technologies, my vision was clear: to build a technology company that not only creates reliable software and digital solutions, but also uplifts our community in Gilgit-Baltistan and Pakistan at large. Coming from Skardu, I know firsthand that talent and ambition are not limited by geography—only by opportunity.
                </p>
                <p>
                  SaroHub is our answer to that challenge. We build digital products, launch scalable ventures, and deliver modern technology solutions that serve clients worldwide, while staying deeply rooted in our values. We believe that innovation driven by purpose creates lasting impact.
                </p>
                {expanded && (
                  <>
                    <p>
                      To our clients and partners: thank you for trusting us with your ambitions. We do not take that trust lightly. Every project, every solution, and every line of code we write carries our commitment to excellence, integrity, and your success.
                    </p>
                    <p>
                      To the young talent of Gilgit-Baltistan: you belong in this industry. Technology is for everyone with the curiosity to learn and the courage to build. SaroHub's doors are open to you—as teammates, learners, and future founders.
                    </p>
                    <p className="font-semibold text-white">
                      We are just getting started. The best is yet to come.
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-mono uppercase tracking-wider text-[#FF5C00] hover:text-[#FFA043] font-bold cursor-pointer transition-colors"
              >
                {expanded ? 'Show Less ↑' : 'Read Full Statement ↓'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
