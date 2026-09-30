import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '../api';
import SEOHead from '../components/seo/SEOHead';
import CompanyOverview from '../components/home/CompanyOverview';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CompanyStatistics from '../components/home/CompanyStatistics';
import CEOMessage from '../components/home/CEOMessage';
import LeadershipTeam from '../components/home/LeadershipTeam';
import ClientTestimonials from '../components/home/ClientTestimonials';
import FAQAccordion from '../components/home/FAQAccordion';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

export default function AboutView() {
  const [stats, setStats] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [aboutSettings, setAboutSettings] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
    api.getTeam().then(setTeam).catch(console.error);
    api.getTestimonials().then(setTestimonials).catch(console.error);
    api.getFAQs().then(setFaqs).catch(console.error);
    api.getSettings().then(setAboutSettings).catch(console.error);
  }, []);

  return (
    <div className="relative bg-[#08090E] text-white min-h-screen">
      <SEOHead
        title="About SAROHUB | Software & Research Organization"
        description="Where Ideas Become Technology. SaroHub is a technology and research organization founded in Gilgit-Baltistan, Pakistan, building software and ventures for the global stage."
        keywords="about SAROHUB, Software and Research Organization, technology company Gilgit Baltistan, software engineering Pakistan"
        canonicalUrl="https://sarohub.com/about"
      />

      {/* Page Header */}
      <div className="py-16 lg:py-24 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Software &amp; Research Organization
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-white mb-4">
            Software. Research. <span className="italic text-[#FF5C00]">Innovation.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            SaroHub stands for Software &amp; Research Organization. Founded in Gilgit-Baltistan, Pakistan, we bring together software engineering, research, entrepreneurship, and product development to build technology for a global market.
          </p>
        </div>
      </div>

      <CompanyOverview settings={aboutSettings} />
      <WhyChooseUs settings={aboutSettings} />
      <CompanyStatistics apiStats={stats} />
      <CEOMessage settings={aboutSettings} />
      <LeadershipTeam team={team} />
      <ClientTestimonials testimonials={testimonials} />

      {/* Company Gallery Teaser */}
      <section className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                Life &amp; Ecosystem Impact
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white mb-2">
                Explore Our <span className="italic text-[#FF5C00]">Company Gallery</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
                Take a visual journey through our technical keynotes, partnerships with regional innovation centers, and internal hackathons.
              </p>
            </div>

            <Link
              to="/gallery"
              className="group px-8 py-4 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-xs font-mono uppercase tracking-wider text-white rounded-full hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] transition-all duration-300 shrink-0 font-bold border border-[#FFA566]/30"
            >
              <RollText>VIEW FULL GALLERY</RollText>
              <DiagonalArrow size={16} />
            </Link>
          </div>
        </div>
      </section>
      
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
