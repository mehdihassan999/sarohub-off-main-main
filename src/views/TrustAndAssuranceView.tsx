import React, { useState } from 'react';
import { 
  ShieldCheck, Clock, 
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { TrustAndAssuranceSection } from '../components/trust/TrustAndAssuranceSection';
import { EngagementModelsSection } from '../components/trust/EngagementModelsSection';
import { InteractiveSolutionMatcher } from '../components/trust/InteractiveSolutionMatcher';
import { LeadMagnetsSection } from '../components/trust/LeadMagnetsSection';
import { FeasibilityAuditModal } from '../components/trust/FeasibilityAuditModal';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

interface TrustAndAssuranceViewProps {
  onOpenConsultation?: (title?: string) => void;
}

export const TrustAndAssuranceView: React.FC<TrustAndAssuranceViewProps> = ({
  onOpenConsultation
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      <SEOHead
        title="Enterprise Trust, 100% IP Guarantee & Delivery Models | SaroHub Technologies"
        description="Discover our rigorous confidentiality covenants, bilateral NDAs, 100% intellectual property ownership, verified review badges, and transparent engagement models."
        canonicalUrl="https://sarohub.com/trust"
      />

      {/* Top Breadcrumb */}
      <div className="border-b border-gray-200 bg-[#FBFBFB]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Trust & Assurance', url: '/trust', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-gray-500">
            Legal &amp; Delivery SLA
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-20 lg:py-28 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
              Verified Enterprise Standards
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-black leading-tight mb-6">
              Enterprise Trust, Zero Lock-In &amp; <span className="italic">Guaranteed IP</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-normal leading-relaxed mb-8">
              We eliminate traditional software outsourcing risks. Enforceable bilateral NDAs, continuous code handover, verified client reviews, and guaranteed on-time sprint deliveries.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="btn-hero-audit-cta"
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer"
              >
                <RollText>REQUEST 48-HOUR AUDIT</RollText>
                <DiagonalArrow size={16} />
              </button>

              <a
                href="#engagement-models"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border border-gray-200 hover:border-black text-black text-xs font-mono uppercase tracking-wider transition-all"
              >
                <span>Explore Engagement Models</span>
                <ArrowRight className="size-4" />
              </a>
            </div>

            {/* Micro Stats Strip */}
            <div className="mt-16 pt-10 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <div className="text-3xl font-normal -tracking-[1px] text-black">100%</div>
                <div className="text-xs font-mono uppercase text-gray-500 mt-1">IP Ownership Assigned</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <div className="text-3xl font-normal -tracking-[1px] text-black">4.9 / 5.0</div>
                <div className="text-xs font-mono uppercase text-gray-500 mt-1">Clutch &amp; GoodFirms</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <div className="text-3xl font-normal -tracking-[1px] text-black">48 Hours</div>
                <div className="text-xs font-mono uppercase text-gray-500 mt-1">Feasibility Turnaround</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <div className="text-3xl font-normal -tracking-[1px] text-black">Zero</div>
                <div className="text-xs font-mono uppercase text-gray-500 mt-1">Vendor Lock-In</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE TRUST, BADGES, NDA & ENDORSEMENTS SECTION */}
      <TrustAndAssuranceSection
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenConsultation={onOpenConsultation}
      />

      {/* ENGAGEMENT MODELS COMPARISON */}
      <div id="engagement-models">
        <EngagementModelsSection
          onOpenConsultation={onOpenConsultation}
        />
      </div>

      {/* INTERACTIVE SOLUTION MATCHER */}
      <section className="py-20 bg-[#FBFBFB] border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
              Interactive Diagnostic Wizard
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-black">
              Find Your Ideal Stack, Timeline &amp; Model
            </h2>
            <p className="text-base text-gray-600 font-normal mt-3">
              Answer 4 quick questions to generate an architectural recommendation, tech stack blueprint, and sprint timeline.
            </p>
          </div>

          <InteractiveSolutionMatcher
            onBookConsultationWithDiagnostic={(summary) => {
              if (onOpenConsultation) onOpenConsultation(summary);
            }}
          />
        </div>
      </section>

      {/* 48-HOUR AUDIT CALLOUT BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="rounded-3xl bg-black text-white p-10 sm:p-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3 block">
                Complimentary 48-Hour Technical Audit
              </span>
              <h3 className="text-3xl sm:text-5xl font-normal -tracking-[1.5px] text-white leading-tight">
                Have a Complex Spec, Wireframe, or Stalling Codebase?
              </h3>
              <p className="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl font-normal">
                Submit your architecture, Git repo, or product specification. Our Principal Systems Architects will analyze database schemas, cloud infrastructure, security vulnerabilities, and sprint feasibility &mdash; completely free within 48 hours.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                id="btn-open-audit-banner"
                onClick={() => setIsAuditModalOpen(true)}
                className="px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <RollText>REQUEST FREE AUDIT</RollText>
                <DiagonalArrow size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOADABLE WHITE PAPERS & LEAD MAGNETS */}
      <LeadMagnetsSection />

      {/* AUDIT MODAL */}
      <FeasibilityAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

    </div>
  );
};
