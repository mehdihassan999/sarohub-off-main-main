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
    <div className="relative min-h-screen bg-white">
      <SEOHead
        title="Agency Partnerships | Your Client. Our Technology. | SaroHub Technologies"
        description="White-label technology partner for digital agencies, creative studios, and consultancies. Scale your development capacity under strict NDA."
      />

      {/* Hero Header - NexStudio Style */}
      <div className="py-20 lg:py-28 border-b border-gray-200 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[{ label: 'Agency Partners', path: '/agency-partners' }]} />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
            White-Label &amp; Strategic Engineering
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black mb-6 leading-tight">
            Your Client. <span className="italic">Our Technology.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal mb-10">
            Expand your agency's technical capabilities without expanding your overhead. We act as your reliable white-label engineering department—building high-performance software under your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=agency"
              id="agency-hero-cta"
              className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2"
            >
              <RollText>BECOME A TECHNOLOGY PARTNER</RollText>
              <DiagonalArrow size={16} />
            </Link>

            <Link
              to="/partnerships"
              className="px-8 py-4 border border-gray-200 hover:border-black text-black font-mono text-xs uppercase tracking-wider rounded-full transition-all"
            >
              All Partnership Models
            </Link>
          </div>
        </div>
      </div>

      {/* Agency Benefits */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b border-gray-200">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            Agency Value Proposition
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] text-black mb-4">
            Why Leading Agencies <span className="italic">Partner with SaroHub</span>
          </h2>
          <p className="text-gray-600 text-base font-normal leading-relaxed">
            You bring the creative vision, strategy, and client relationship. We supply the senior engineering discipline to deliver flawless technical executions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agencyBenefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black transition-all duration-300 flex items-start gap-6 group"
              >
                <div className="size-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-black shrink-0">
                  <Icon className="size-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xl font-normal -tracking-[0.5px] text-black mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Capabilities */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b border-gray-200">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            Full-Stack Delivery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] text-black mb-4">
            Technical Capabilities for Your Client Accounts
          </h2>
          <p className="text-gray-600 text-base font-normal leading-relaxed">
            From complex web portals to native mobile applications and artificial intelligence integrations, we deliver end-to-end.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="size-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-black mb-4">
                    <Icon className="size-5 stroke-[1.8]" />
                  </div>
                  <h3 className="text-lg font-normal text-black mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
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
        <div className="max-w-7xl mx-auto px-6 py-16 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
                Ecosystem Network
              </span>
              <h3 className="text-3xl font-normal -tracking-[1px] text-black">
                Featured Agency Collaborations
              </h3>
            </div>
            <Link
              to="/partnerships"
              className="text-xs font-mono uppercase tracking-wider text-black hover:text-gray-600 flex items-center gap-1.5 transition-colors"
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
        <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-8 sm:p-14 lg:p-16 text-center max-w-4xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            Confidential Partnership
          </span>

          <h3 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-black mb-4">
            Let's Discuss Your Next Client Project
          </h3>

          <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-normal mb-8">
            Tell us about your upcoming brief or technical requirements. We sign an NDA first, review your scope, and provide a fixed or dedicated team proposal.
          </p>

          <Link
            to="/contact?type=agency"
            id="agency-footer-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black hover:bg-gray-800 text-white font-mono text-xs uppercase tracking-wider transition-all"
          >
            <RollText>BECOME A TECHNOLOGY PARTNER</RollText>
            <DiagonalArrow size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
