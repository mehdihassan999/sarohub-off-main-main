import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Rocket, Landmark, X, CheckCircle2, Award, ShieldCheck 
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { api } from '../api';
import { Partner } from '../types';
import PartnerCard from '../components/partners/PartnerCard';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

export default function PartnershipsView() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPartnerImage, setSelectedPartnerImage] = useState<{ url: string; partnerName: string } | null>(null);

  useEffect(() => {
    api.getPartners()
      .then((data) => {
        setPartners(data || []);
      })
      .catch((err) => {
        console.error('Failed to load partners in PartnershipsView:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = ['all', ...Array.from(new Set(partners.map(p => p.category)))];

  const filteredPartners = activeCategory === 'all'
    ? partners
    : partners.filter(p => p.category === activeCategory);

  const partnershipModels = [
    {
      id: 'government-sector',
      title: 'Government & Public Sector Collaboration',
      subtitle: 'For Ministries, Civic Authorities & Public Agencies',
      icon: Landmark,
      description: 'Modernize public administration and citizen services with secure, cloud-native portals, open-standard compliance, and transparent data architectures.',
      whoItsFor: 'Government ministries, municipal corporations, public utility bodies, and civic technology initiatives.',
      collaboration: [
        'Citizen-facing e-governance web portals and mobile applications',
        'Internal administrative workflows and digitized records management',
        'Secure API integration with national identity and payment gateways',
        'Technical audits, accessibility compliance, and cloud migration'
      ],
      benefits: [
        'High-security software compliant with public data residency standards',
        'Transparent procurement, fixed milestones, and SLA guarantees',
        'Comprehensive handover, administrator training, and documentation',
        'Dedicated maintenance pods ensuring 99.9% uptime'
      ],
      ctaText: 'Discuss Public Sector Initiative',
      ctaLink: '/contact?type=government'
    },
    {
      id: 'technology-partner',
      title: 'Agency & Technology Partner',
      subtitle: 'For Agencies, Design Studios & Consultancies',
      icon: Building2,
      description: 'Expand your technical capacity without taking on full-time engineering overhead. We act as your dedicated white-label development arm.',
      whoItsFor: 'Digital agencies, creative studios, marketing firms, and IT consultancies needing reliable, senior-level engineering.',
      collaboration: [
        'White-label development under your agency brand',
        'Dedicated engineering pods assigned to your client accounts',
        'Fixed-price project delivery or monthly retainer models',
        'Transparent sprint tracking in Jira / Linear / Slack'
      ],
      benefits: [
        'Strict mutual NDA and client confidentiality',
        'Reliable, on-time delivery backed by code warranties',
        'Predictable profit margins on client technical projects',
        'Ongoing SLA maintenance retainers for recurring revenue'
      ],
      ctaText: 'Partner as an Agency',
      ctaLink: '/agency-partners'
    },
    {
      id: 'venture-partner',
      title: 'Venture & Co-Founder Partner',
      subtitle: 'For Startup Founders & Entrepreneurs',
      icon: Rocket,
      description: 'We partner with domain experts and ambitious founders who have deep market insight but lack the technical leadership to build and scale.',
      whoItsFor: 'Domain-expert founders, industry veterans, and early-stage entrepreneurs with validated market demand.',
      collaboration: [
        'Hybrid models: equity, milestone-based fees, or revenue-share',
        'End-to-end technical co-founder role from MVP to Series A',
        'Full product strategy, UI/UX, cloud infrastructure, and AI integration',
        'Technical due diligence representation for angel & VC funding'
      ],
      benefits: [
        'Zero agency markups—we invest our senior engineering skin in the game',
        'Rapid time-to-market with tested enterprise component libraries',
        'Complete source code and IP ownership transferred to the entity',
        'Long-term engineering scaling with dedicated hiring support'
      ],
      ctaText: 'Explore Venture Co-Founding',
      ctaLink: '/startups'
    }
  ];

  return (
    <div className="relative bg-[#08090E] text-white min-h-screen">
      <SEOHead
        title="Strategic Partnerships & Alliances | SaroHub Technologies"
        description="Collaborate with SaroHub Technologies: Government public sector initiatives, white-label agency partnerships, and venture co-founding."
        keywords="SaroHub partnerships, IT agency partner, technology joint venture, government IT solutions"
        canonicalUrl="https://sarohub.com/partnerships"
      />

      {/* Header */}
      <div className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Ecosystem Directory &amp; Alliances
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-white mb-6 font-display">
            Strategic <span className="italic text-[#FF5C00]">Partnerships</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            Government sectors, digital agencies, and strategic alliances actively collaborating with SaroHub to deliver mission-critical software.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact?type=partnership"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full transition-all duration-300 font-bold border border-[#FFA566]/30"
            >
              <RollText>PROPOSE COLLABORATION</RollText>
              <DiagonalArrow size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Collaborations Directory */}
      <section id="active-collaborations" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block">
              Active Network
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-white font-display">
              Verified <span className="italic text-[#FF5C00]">Collaborations</span>
            </h2>
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer font-bold ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-md'
                      : 'bg-[#141828] border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Partners' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="size-8 rounded-full border-2 border-[#FF5C00] border-t-transparent animate-spin" />
          </div>
        ) : filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onSelectImage={(url, name) => setSelectedPartnerImage({ url, partnerName: name })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0E121E] rounded-3xl border border-white/[0.08] font-mono text-xs text-slate-400 uppercase">
            No collaborations registered in this category.
          </div>
        )}
      </section>

      {/* Partnership Models */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 space-y-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block">
            Structured Frameworks
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-white font-display">
            How We Partner &amp; <span className="italic text-[#FF5C00]">Collaborate</span>
          </h2>
        </div>

        <div className="space-y-8">
          {partnershipModels.map((model, idx) => {
            return (
              <div
                key={model.id}
                className="p-8 sm:p-12 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_0_30px_rgba(255,92,0,0.08)] transition-all duration-300 shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="lg:col-span-6 space-y-5">
                    <span className="font-mono text-xs uppercase text-[#FF7A1A] tracking-wider block font-semibold">
                      MODEL 0{idx + 1} &bull; {model.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-normal text-white font-display">
                      {model.title}
                    </h3>
                    <p className="text-base text-slate-300 leading-relaxed font-normal">
                      {model.description}
                    </p>

                    <div className="p-5 rounded-2xl bg-[#141828] border border-white/[0.08]">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#FF5C00] block mb-1 font-semibold">
                        Who It Is For
                      </span>
                      <p className="text-sm text-slate-300 font-normal">
                        {model.whoItsFor}
                      </p>
                    </div>

                    <Link
                      to={model.ctaLink}
                      className="group px-6 py-3.5 inline-flex gap-2 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_20px_rgba(255,92,0,0.5)] text-xs font-mono uppercase tracking-wider text-white rounded-full transition-all cursor-pointer font-bold border border-[#FFA566]/30"
                    >
                      <RollText>{model.ctaText.toUpperCase()}</RollText>
                      <DiagonalArrow size={16} />
                    </Link>
                  </div>

                  <div className="lg:col-span-6 space-y-4">
                    <div className="p-6 rounded-2xl bg-[#141828] border border-white/[0.08]">
                      <h4 className="font-mono text-xs uppercase text-[#FF7A1A] tracking-wider mb-3 font-semibold">
                        How We Collaborate
                      </h4>
                      <ul className="space-y-2">
                        {model.collaboration.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 font-normal">
                            <CheckCircle2 className="size-4 text-[#FF5C00] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#141828] border border-white/[0.08]">
                      <h4 className="font-mono text-xs uppercase text-[#FF7A1A] tracking-wider mb-3 font-semibold">
                        Partner Benefits
                      </h4>
                      <ul className="space-y-2">
                        {model.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 font-normal">
                            <span className="size-1.5 rounded-full bg-[#FF5C00] shrink-0 mt-2" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 lg:py-28 bg-[#0A0D15] border-t border-white/[0.08] text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#FF5C00]/10 blur-[100px] pointer-events-none -z-10" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h3 className="text-3xl sm:text-4xl font-normal text-white mb-4 font-display">
            Have a Government, Agency, or Venture Proposal?
          </h3>
          <p className="text-base text-slate-400 mb-8 leading-relaxed font-normal">
            We are always ready to review project briefs, tenders, and strategic alliance proposals.
          </p>
          <Link
            to="/contact?type=partnership"
            className="group px-8 py-4 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full transition-all duration-300 font-bold border border-[#FFA566]/30"
          >
            <RollText>PROPOSE A COLLABORATION</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>
      </section>

      {/* Asset Modal Lightbox */}
      {selectedPartnerImage && (
        <div 
          onClick={() => setSelectedPartnerImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden bg-[#0E121E] border border-white/[0.12] shadow-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <span className="text-xs font-mono uppercase text-[#FF7A1A] font-bold">
                {selectedPartnerImage.partnerName} &bull; Showcase Asset
              </span>
              <button
                onClick={() => setSelectedPartnerImage(null)}
                className="p-1.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white hover:border-[#FF5C00] transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-center overflow-hidden max-h-[70vh]">
              <img
                src={selectedPartnerImage.url}
                alt={selectedPartnerImage.partnerName}
                className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
