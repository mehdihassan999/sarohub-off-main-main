import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, ShoppingBag, Utensils, Rocket, Briefcase, Building2, 
  ArrowRight, CheckCircle2, ChevronRight, Layers, ExternalLink 
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../api';
import { IndustrySolution } from '../types';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

const INDUSTRY_ICONS: { [key: string]: any } = {
  'education-edtech': GraduationCap,
  'retail-ecommerce': ShoppingBag,
  'hospitality-travel': Utensils,
  'startups': Rocket,
  'professional-services': Briefcase,
  'real-estate': Building2
};

export default function IndustriesView() {
  const [industries, setIndustries] = useState<IndustrySolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string>('all');

  useEffect(() => {
    api.getIndustries()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setIndustries(data.filter(i => i.published).sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredIndustries = selectedSlug === 'all' 
    ? industries 
    : industries.filter(i => i.slug === selectedSlug);

  return (
    <div className="relative min-h-screen bg-[#08090E] text-white">
      <SEOHead
        title="Industries We Serve | SaroHub Technologies"
        description="Tailored digital solutions and custom software for education, retail, hospitality, startups, real estate, and professional services."
      />

      {/* Header Banner */}
      <div className="py-20 lg:py-28 border-b border-white/[0.08] text-center bg-[#0A0D15] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[{ label: 'Industries', path: '/industries' }]} />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Vertical Architecture &amp; Solutions
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-white mb-6 leading-tight font-display">
            Built for Your <span className="italic text-[#FF5C00]">Industry Vertical</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Every sector faces distinct operational friction. We develop specialized software platforms engineered around industry workflows, compliance, and sustained market scale.
          </p>

          {/* Quick Filter Bar */}
          {industries.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedSlug('all')}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer font-bold ${
                  selectedSlug === 'all'
                    ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-md'
                    : 'bg-[#141828] border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                All Industries
              </button>
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedSlug(ind.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer font-bold ${
                    selectedSlug === ind.slug
                      ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-md'
                      : 'bg-[#141828] border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content List */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 space-y-16">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl border border-white/[0.08] bg-[#0E121E] animate-pulse"
              />
            ))}
          </div>
        ) : filteredIndustries.length > 0 ? (
          filteredIndustries.map((industry, index) => {
            const Icon = INDUSTRY_ICONS[industry.slug] || Briefcase;

            return (
              <div
                key={industry.id || index}
                id={`industry-${industry.slug}`}
                className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-8 sm:p-14 hover:border-[#FF5C00]/40 hover:shadow-[0_0_30px_rgba(255,92,0,0.08)] transition-all duration-300 relative overflow-hidden shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                  {/* Left Column: Problem & Positioning */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl border border-white/10 bg-[#141828] flex items-center justify-center text-[#FF5C00]">
                        <Icon className="size-6 stroke-[1.8]" />
                      </div>
                      <span className="font-mono text-xs uppercase tracking-wider text-[#FF7A1A] font-semibold">
                        Industry Vertical 0{index + 1}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-white font-display">
                      {industry.name}
                    </h2>

                    <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#141828]">
                      <p className="font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
                        The Core Challenge
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed font-normal">
                        {industry.problemStatement}
                      </p>
                    </div>

                    {/* How SaroHub Solves It */}
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-white mb-3 flex items-center gap-2 font-semibold">
                        <Layers className="size-4 text-[#FF5C00]" />
                        Solutions We Deliver
                      </h3>
                      <ul className="space-y-2.5">
                        {industry.solutions.map((sol, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-normal">
                            <CheckCircle2 className="size-4 text-[#FF5C00] shrink-0 mt-0.5" />
                            <span>{sol}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4 items-center">
                      <Link
                        to={`/contact?industry=${encodeURIComponent(industry.name)}`}
                        id={`contact-${industry.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white text-xs font-mono uppercase tracking-wider transition-all font-bold border border-[#FFA566]/30"
                      >
                        <RollText>DISCUSS AN {industry.name.toUpperCase()} PROJECT</RollText>
                        <DiagonalArrow size={16} />
                      </Link>

                      <Link
                        to="/work"
                        className="text-xs font-mono text-slate-400 hover:text-[#FF5C00] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Related Case Studies</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Capabilities, Tech & Benefits */}
                  <div className="lg:col-span-6 space-y-6 lg:border-l lg:pl-12 border-white/[0.08]">
                    {/* Key Features */}
                    {industry.features && industry.features.length > 0 && (
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                          Core Functional Modules
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {industry.features.map((feat, i) => (
                            <span
                              key={i}
                              className="text-xs px-3.5 py-1.5 rounded-full border border-white/10 bg-[#141828] text-slate-300 font-mono"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Relevant Services */}
                    {industry.services && industry.services.length > 0 && (
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                          Applicable Engineering Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {industry.services.map((srv, i) => (
                            <Link
                              key={i}
                              to="/services"
                              className="text-xs px-3 py-1 rounded-full border border-white/10 bg-[#141828] text-white hover:border-[#FF5C00] transition-colors font-mono"
                            >
                              {srv}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Measurable Benefits */}
                    {industry.benefits && industry.benefits.length > 0 && (
                      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#141828]">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-white mb-3 font-semibold">
                          Expected Outcomes &amp; Impact
                        </h4>
                        <ul className="space-y-2">
                          {industry.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-300 font-normal">
                              <span className="size-1.5 rounded-full bg-[#FF5C00] shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {industry.technologies && industry.technologies.length > 0 && (
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                          Technology Frameworks
                        </h4>
                        <p className="text-xs font-mono text-slate-400">
                          {industry.technologies.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400 font-mono text-xs uppercase">
            No industry verticals configured.
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="py-20 lg:py-28 border-t border-white/[0.08] text-center bg-[#0A0D15] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#FF5C00]/10 blur-[100px] pointer-events-none -z-10" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block">
            Specialized Engineering
          </span>
          <h3 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-white mb-4 font-display">
            Operating in a Different Industry?
          </h3>
          <p className="text-base text-slate-400 mb-8 leading-relaxed font-normal">
            Our agile engineering pods adapt to specialized enterprise workflows, proprietary hardware integrations, and regulated sectors with zero friction.
          </p>
          <Link
            to="/contact"
            id="industry-custom-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white font-mono text-xs uppercase tracking-wider transition-all font-bold border border-[#FFA566]/30"
          >
            <RollText>REQUEST AN INDUSTRY CONSULTATION</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
