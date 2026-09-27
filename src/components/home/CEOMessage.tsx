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
    <section id="ceo-message" className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
            Executive Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-3">
            Founder &amp; CEO <span className="italic">Statement</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
            A personal pledge of purpose, integrity, and global technological ambition from the founder of {companyName}.
          </p>
        </div>

        {/* Master Executive Card */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl border border-gray-200 bg-white shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: CEO Profile & Metrics */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="size-44 sm:size-48 rounded-3xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                <img
                  src={ceoPhoto}
                  alt={ceoName}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-1 tracking-tight">
                  {ceoName}
                </h3>
                <p className="font-mono text-xs uppercase text-gray-700 tracking-wider font-semibold">
                  {ceoTitle}
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-gray-600 mt-1 font-mono">
                  <MapPin className="size-3.5 text-black" />
                  <span>Skardu, Gilgit-Baltistan</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full pt-1">
                <div className="p-3 rounded-2xl border border-gray-200 bg-[#FBFBFB] shadow-xs">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5 font-semibold">Founded</span>
                  <span className="text-sm font-bold text-black">2022 (Reg. 2026)</span>
                </div>
                <div className="p-3 rounded-2xl border border-gray-200 bg-[#FBFBFB] shadow-xs">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5 font-semibold">Ventures</span>
                  <span className="text-sm font-bold text-black">5+ Built</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="group w-full px-6 py-3 inline-flex justify-center gap-2 items-center bg-black text-xs font-mono uppercase tracking-wider text-white rounded-full hover:bg-gray-800 transition-all cursor-pointer shadow-xs font-semibold"
              >
                <RollText>DIRECT INQUIRY</RollText>
                <DiagonalArrow size={16} />
              </Link>
            </div>

            {/* Right: Statement Text */}
            <div className="lg:col-span-8 space-y-5">
              <div className="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-[#FBFBFB] relative shadow-xs">
                <Quote className="size-7 text-gray-400 mb-2" />
                <p className="text-base sm:text-lg font-normal text-black italic leading-relaxed">
                  "Talent and ambition are not limited by geography—only by opportunity. SaroHub is our answer to that challenge."
                </p>
              </div>

              <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3 font-normal">
                {expanded ? (
                  ceoMessage.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      When I founded SaroHub Technologies, my vision was clear: to build a technology company that not only creates reliable software and digital solutions, but also uplifts our community in Gilgit-Baltistan and Pakistan at large.
                    </p>
                    <p>
                      SaroHub is our answer to that challenge. We build digital products, launch scalable ventures, and deliver modern technology solutions that serve clients worldwide, while staying deeply rooted in our values.
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-mono uppercase tracking-wider text-black underline hover:text-gray-600 transition-colors cursor-pointer font-bold"
              >
                {expanded ? 'Show Less' : 'Read Full Message \u2193'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
