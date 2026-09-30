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
    <div className="min-h-screen bg-[#08090E] text-white">
      <SEOHead
        title="Enterprise Trust, 100% IP Guarantee & Delivery Models | SaroHub Technologies"
        description="Discover our rigorous confidentiality covenants, bilateral NDAs, 100% intellectual property ownership, verified review badges, and transparent engagement models."
        canonicalUrl="https://sarohub.com/trust"
      />

      {/* Top Breadcrumb */}
      <div className="border-b border-white/[0.08] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Trust & Assurance', url: '/trust', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-slate-300">
            Legal &amp; Delivery SLA
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Verified Enterprise Standards
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-white leading-tight mb-6 font-display">
              Enterprise Trust, Zero Lock-In &amp; <span className="italic text-[#FF5C00]">Guaranteed IP</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8">
              We eliminate traditional software outsourcing risks. Enforceable bilateral NDAs, continuous code handover, verified client reviews, and guaranteed on-time sprint deliveries.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="btn-hero-audit-cta"
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white text-xs font-mono uppercase tracking-wider transition-all cursor-pointer font-bold border border-[#FFA566]/30"
              >
                <RollText>REQUEST 48-HOUR AUDIT</RollText>
                <DiagonalArrow size={16} />
              </button>

              <a
                href="#engagement-models"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/[0.05] border border-white/15 hover:border-[#FF5C00]/50 hover:bg-white/[0.1] text-white text-xs font-mono uppercase tracking-wider transition-all font-semibold"
              >
                <span>Explore Engagement Models</span>
                <ArrowRight className="size-4" />
              </a>
            </div>

            {/* Micro Stats Strip */}
            <div className="mt-16 pt-10 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-[#0E121E] border border-white/[0.08] shadow-md">
                <div className="text-3xl font-normal -tracking-[1px] text-white">100%</div>
                <div className="text-xs font-mono uppercase text-[#FF7A1A] mt-1 font-bold">IP Ownership Assigned</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E121E] border border-white/[0.08] shadow-md">
                <div className="text-3xl font-normal -tracking-[1px] text-white">4.9 / 5.0</div>
                <div className="text-xs font-mono uppercase text-[#FF7A1A] mt-1 font-bold">Clutch &amp; GoodFirms</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E121E] border border-white/[0.08] shadow-md">
                <div className="text-3xl font-normal -tracking-[1px] text-white">48 Hours</div>
                <div className="text-xs font-mono uppercase text-[#FF7A1A] mt-1 font-bold">Feasibility Turnaround</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E121E] border border-white/[0.08] shadow-md">
                <div className="text-3xl font-normal -tracking-[1px] text-white">Zero</div>
                <div className="text-xs font-mono uppercase text-[#FF7A1A] mt-1 font-bold">Vendor Lock-In</div>
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
      <section className="py-20 bg-[#08090E] border-t border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block font-semibold">
              Interactive Diagnostic Wizard
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-white">
              Find Your Ideal Stack, Timeline &amp; Model
            </h2>
            <p className="text-base text-slate-300 font-normal mt-3">
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
        <div className="rounded-3xl bg-[#0E121E] border border-white/[0.08] text-white p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#FF5C00]/10 blur-[120px] pointer-events-none -z-10" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF5C00] mb-3 block font-bold">
                Complimentary 48-Hour Technical Audit
              </span>
              <h3 className="text-3xl sm:text-5xl font-normal -tracking-[1.5px] text-white leading-tight font-display">
                Have a Complex Spec, Wireframe, or Stalling Codebase?
              </h3>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Submit your architecture, Git repo, or product specification. Our Principal Systems Architects will analyze database schemas, cloud infrastructure, security vulnerabilities, and sprint feasibility &mdash; completely free within 48 hours.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                id="btn-open-audit-banner"
                onClick={() => setIsAuditModalOpen(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer font-bold border border-[#FFA566]/30"
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
