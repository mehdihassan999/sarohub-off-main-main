import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Handshake, ShieldCheck, Users, Clock, Award, CheckCircle2, 
  ArrowRight, Lock, Server, Cpu, Smartphone, Globe, Layers, Sparkles 
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { api } from '../api';
import { Partner } from '../types';
import PartnerCard from '../components/partners/PartnerCard';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

export default function AgencyPartnersView() {
  const [agencyPartners, setAgencyPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getPartners()
      .then((data) => {
        const agencies = (data || []).filter(p => 
          p.category.toLowerCase().includes('agency') || 
          p.category === 'Partner' || 
          p.category === 'Technology Partner'
        );
        setAgencyPartners(agencies);
      })
      .catch((err) => {
        console.error('Failed to load agency partners:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const capabilities = [
    {
      title: 'White-Label Engineering',
      desc: 'We build directly under your brand name or as your silent technical production studio. Complete client-facing invisibility.',
      icon: ShieldCheck
    },
    {
      title: 'Dedicated Engineering Pods',
      desc: 'Plug senior full-stack developers, QA leads, and solution architects directly into your agency workflow.',
      icon: Users
    },
    {
      title: 'Web Application Development',
      desc: 'High-performance React/Next.js platforms, client portals, and bespoke content management solutions.',
      icon: Globe
    },
    {
      title: 'Mobile App Development',
      desc: 'Cross-platform iOS and Android apps built with React Native and Flutter with native device integration.',
      icon: Smartphone
    },
    {
      title: 'AI & Automation Solutions',
      desc: 'Custom LLM integrations, document intelligence, cognitive search, and workflow automation for your clients.',
      icon: Cpu
    },
    {
      title: 'SaaS Platform Development',
      desc: 'Multi-tenant architectures, subscription billing, usage metrics, and cloud infrastructure for client software.',
      icon: Server
    },
    {
      title: 'Complex API Integrations',
      desc: 'Seamless connections between CRMs, ERPs, payment gateways, legacy databases, and cloud services.',
      icon: Layers
    },
    {
      title: 'Ongoing SLA Maintenance',
      desc: 'Continuous uptime monitoring, security patching, and Tier-2/3 technical support so your clients stay protected.',
      icon: Clock
    }
  ];

  const agencyBenefits = [
    {
      title: 'Reliable, On-Time Delivery',
      desc: 'Never miss an agency delivery deadline. Our rigorous sprint cadence and automated testing ensure predictable releases.',
      icon: Award
    },
    {
      title: 'Instant Technical Scale',
      desc: 'Take on high-value, complex technical accounts without bloating your full-time payroll or turning down big RFP briefs.',
      icon: Users
    },
    {
      title: 'Strict Non-Disclosure & Confidentiality',
      desc: 'Comprehensive mutual NDAs signed upfront. We never contact your clients directly or solicit your accounts.',
      icon: Lock
    },
    {
      title: 'Long-Term Technical Support',
      desc: 'We back every line of code with ongoing maintenance agreements, allowing your agency to earn recurring monthly retainer revenue.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#08090E] text-white">
      <SEOHead
        title="Agency Partnerships | Your Client. Our Technology. | SaroHub Technologies"
        description="White-label technology partner for digital agencies, creative studios, and consultancies. Scale your development capacity under strict NDA."
      />

      {/* Hero Header */}
      <div className="py-20 lg:py-28 border-b border-white/[0.08] text-center bg-[#0A0D15] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[{ label: 'Agency Partners', path: '/agency-partners' }]} />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            White-Label &amp; Strategic Engineering
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-white mb-6 leading-tight font-display">
            Your Client. <span className="italic text-[#FF5C00]">Our Technology.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal mb-10">
            Expand your agency's technical capabilities without expanding your overhead. We act as your reliable white-label engineering department—building high-performance software under your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=agency"
              id="agency-hero-cta"
              className="px-8 py-4 bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 border border-[#FFA566]/30 font-bold"
            >
              <RollText>BECOME A TECHNOLOGY PARTNER</RollText>
              <DiagonalArrow size={16} />
            </Link>

            <Link
              to="/partnerships"
              className="px-8 py-4 border border-white/10 hover:border-[#FF5C00] text-white bg-white/[0.04] hover:bg-white/[0.08] font-mono text-xs uppercase tracking-wider rounded-full transition-all"
            >
              All Partnership Models
            </Link>
          </div>
        </div>
      </div>

      {/* Agency Benefits */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b border-white/[0.08]">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block">
            Agency Value Proposition
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] text-white mb-4 font-display">
            Why Leading Agencies <span className="italic text-[#FF5C00]">Partner with SaroHub</span>
          </h2>
          <p className="text-slate-400 text-base font-normal leading-relaxed">
            You bring the creative vision, strategy, and client relationship. We supply the senior engineering discipline to deliver flawless technical executions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agencyBenefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_0_30px_rgba(255,92,0,0.08)] transition-all duration-300 flex items-start gap-6 group"
              >
                <div className="size-12 rounded-2xl border border-white/10 bg-[#141828] flex items-center justify-center text-[#FF5C00] shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="size-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xl font-normal -tracking-[0.5px] text-white mb-2 font-display">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Capabilities */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b border-white/[0.08]">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block">
            Full-Stack Delivery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] text-white mb-4 font-display">
            Technical Capabilities for Your Client Accounts
          </h2>
          <p className="text-slate-400 text-base font-normal leading-relaxed">
            From complex web portals to native mobile applications and artificial intelligence integrations, we deliver end-to-end.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_0_24px_rgba(255,92,0,0.08)] transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="size-10 rounded-xl border border-white/10 bg-[#141828] flex items-center justify-center text-[#FF5C00] mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="size-5 stroke-[1.8]" />
                  </div>
                  <h3 className="text-lg font-normal text-white mb-2 font-display">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {cap.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Active Agency Collaborations */}
      {agencyPartners.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white/[0.08]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block mb-1">
                Ecosystem Network
              </span>
              <h3 className="text-3xl font-normal -tracking-[1px] text-white font-display">
                Featured Agency Collaborations
              </h3>
            </div>
            <Link
              to="/partnerships"
              className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-[#FF5C00] flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Directory</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencyPartners.map((partner) => (
              <div key={partner.id} className="h-full">
                <PartnerCard partner={partner} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partnership Engagement Callout */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0E121E] to-[#0A0D15] p-8 sm:p-14 lg:p-16 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#FF5C00]/10 blur-[90px] pointer-events-none -z-10" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block">
            Confidential Partnership
          </span>

          <h3 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-white mb-4 font-display">
            Let's Discuss Your Next Client Project
          </h3>

          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-normal mb-8">
            Tell us about your upcoming brief or technical requirements. We sign an NDA first, review your scope, and provide a fixed or dedicated team proposal.
          </p>

          <Link
            to="/contact?type=agency"
            id="agency-footer-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white font-mono text-xs uppercase tracking-wider transition-all border border-[#FFA566]/30 font-bold"
          >
            <RollText>BECOME A TECHNOLOGY PARTNER</RollText>
            <DiagonalArrow size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
