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
    <div className="relative min-h-screen bg-white">
      <SEOHead
        title="Industries We Serve | SaroHub Technologies"
        description="Tailored digital solutions and custom software for education, retail, hospitality, startups, real estate, and professional services."
      />

      {/* Header Banner - NexStudio Style */}
      <div className="py-20 lg:py-28 border-b border-gray-200 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[{ label: 'Industries', path: '/industries' }]} />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
            Vertical Architecture &amp; Solutions
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black mb-6 leading-tight">
            Built for Your <span className="italic">Industry Vertical</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Every sector faces distinct operational friction. We develop specialized software platforms engineered around industry workflows, compliance, and sustained market scale.
          </p>

          {/* Quick Filter Bar */}
          {industries.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedSlug('all')}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSlug === 'all'
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Industries
              </button>
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedSlug(ind.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    selectedSlug === ind.slug
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                className="h-80 rounded-3xl border border-gray-200 bg-[#FBFBFB] animate-pulse"
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
                className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-8 sm:p-14 hover:border-black transition-all duration-300 relative overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                  {/* Left Column: Problem & Positioning */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-black">
                        <Icon className="size-6 stroke-[1.8]" />
                      </div>
                      <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
                        Industry Vertical 0{index + 1}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-black">
                      {industry.name}
                    </h2>

                    <div className="p-5 rounded-2xl border border-gray-200 bg-white">
                      <p className="font-mono text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">
                        The Core Challenge
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed font-normal">
                        {industry.problemStatement}
                      </p>
                    </div>

                    {/* How SaroHub Solves It */}
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-black mb-3 flex items-center gap-2">
                        <Layers className="size-4 text-black" />
                        Solutions We Deliver
                      </h3>
                      <ul className="space-y-2.5">
                        {industry.solutions.map((sol, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 font-normal">
                            <CheckCircle2 className="size-4 text-black shrink-0 mt-0.5" />
                            <span>{sol}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4 items-center">
                      <Link
                        to={`/contact?industry=${encodeURIComponent(industry.name)}`}
                        id={`contact-${industry.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all"
                      >
                        <RollText>DISCUSS AN {industry.name.toUpperCase()} PROJECT</RollText>
                        <DiagonalArrow size={16} />
                      </Link>

                      <Link
                        to="/work"
                        className="text-xs font-mono text-gray-500 hover:text-black uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Related Case Studies</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Capabilities, Tech & Benefits */}
                  <div className="lg:col-span-6 space-y-6 lg:border-l lg:pl-12 border-gray-200">
                    {/* Key Features */}
                    {industry.features && industry.features.length > 0 && (
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-3">
                          Core Functional Modules
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {industry.features.map((feat, i) => (
                            <span
                              key={i}
                              className="text-xs px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 font-mono"
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
                        <h4 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-3">
                          Applicable Engineering Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {industry.services.map((srv, i) => (
                            <Link
                              key={i}
                              to="/services"
                              className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-white text-black hover:border-black transition-colors font-mono"
                            >
                              {srv}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Measurable Benefits */}
                    {industry.benefits && industry.benefits.length > 0 && (
                      <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-black mb-3">
                          Expected Outcomes &amp; Impact
                        </h4>
                        <ul className="space-y-2">
                          {industry.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-gray-600 font-normal">
                              <span className="size-1.5 rounded-full bg-black shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {industry.technologies && industry.technologies.length > 0 && (
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">
                          Technology Frameworks
                        </h4>
                        <p className="text-xs font-mono text-gray-500">
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
          <div className="text-center py-20 text-gray-500 font-mono text-xs uppercase">
            No industry verticals configured.
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="py-20 lg:py-24 border-t border-gray-200 text-center bg-[#FBFBFB]">
        <div className="max-w-3xl mx-auto px-6">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            Specialized Engineering
          </span>
          <h3 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-black mb-4">
            Operating in a Different Industry?
          </h3>
          <p className="text-base text-gray-600 mb-8 leading-relaxed font-normal">
            Our agile engineering pods adapt to specialized enterprise workflows, proprietary hardware integrations, and regulated sectors with zero friction.
          </p>
          <Link
            to="/contact"
            id="industry-custom-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black hover:bg-gray-800 text-white font-mono text-xs uppercase tracking-wider transition-all"
          >
            <RollText>REQUEST AN INDUSTRY CONSULTATION</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
