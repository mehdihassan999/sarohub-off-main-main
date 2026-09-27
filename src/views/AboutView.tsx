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
    <div className="relative bg-white text-black">
      <SEOHead
        title="About SAROHUB | Software & Research Organization"
        description="Where Ideas Become Technology. SaroHub is a technology and research organization founded in Gilgit-Baltistan, Pakistan, building software and ventures for the global stage."
        keywords="about SAROHUB, Software and Research Organization, technology company Gilgit Baltistan, software engineering Pakistan"
        canonicalUrl="https://sarohub.com/about"
      />

      {/* Page Header */}
      <div className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
            Software &amp; Research Organization
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black mb-4">
            Software. Research. <span className="italic">Innovation.</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-normal">
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
      <section className="py-12 lg:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xs">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                Life &amp; Ecosystem Impact
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-black mb-2">
                Explore Our <span className="italic">Company Gallery</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                Take a visual journey through our technical keynotes, partnerships with regional innovation centers, and internal hackathons.
              </p>
            </div>

            <Link
              to="/gallery"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-black text-sm font-semibold -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shrink-0 shadow-xs"
            >
              <RollText>VIEW FULL GALLERY</RollText>
              <DiagonalArrow size={18} />
            </Link>
          </div>
        </div>
      </section>
      
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
