import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Cpu, Smartphone, 
  Globe, Bot, RefreshCw, Send, CheckCircle2, ShieldCheck, Download
} from 'lucide-react';
import { api } from '../../api';
import { SolutionMatch } from '../../types';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface InteractiveSolutionMatcherProps {
  onBookConsultationWithDiagnostic?: (summary: string) => void;
  className?: string;
}

export const InteractiveSolutionMatcher: React.FC<InteractiveSolutionMatcherProps> = ({
  onBookConsultationWithDiagnostic,
  className = ''
}) => {
  const [step, setStep] = useState(1);

  // Selections
  const [projectType, setProjectType] = useState('Enterprise SaaS Platform');
  const [stage, setStage] = useState('Product Specification / Idea');
  const [timeline, setTimeline] = useState('4 - 8 Weeks (Rapid MVP)');
  const [budget, setBudget] = useState('$10,000 - $25,000');

  // Contact for saving
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [company, setCompany] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedMatch, setSavedMatch] = useState<SolutionMatch | null>(null);

  // Recommendations logic based on choices
  const getRecommendations = () => {
    let stack = ['React / Next.js', 'TypeScript', 'Node.js Express', 'PostgreSQL / Prisma', 'Tailwind CSS', 'Docker Cloud Run'];
    let model = 'Fixed-Scope MVP Sprint';
    let weeks = '6 - 8 Weeks';

    if (projectType.includes('Mobile')) {
      stack = ['React Native (Expo)', 'TypeScript', 'Node.js Backend', 'PostgreSQL', 'Redis Cache', 'AWS S3'];
      weeks = '8 - 10 Weeks';
    } else if (projectType.includes('AI')) {
      stack = ['Next.js App Router', 'Python FastAPI / Node.js', 'Gemini 2.5 Flash / OpenAI', 'Pinecone / pgvector', 'PostgreSQL', 'Cloud Run'];
      model = 'Dedicated Engineering Pod';
      weeks = '5 - 7 Weeks';
    } else if (stage.includes('Scale') || stage.includes('Legacy')) {
      model = 'Enterprise Retainer & Modernization';
      weeks = 'Continuous 2-Week Sprints';
    } else if (budget.includes('Equity') || stage.includes('Venture')) {
      model = 'Venture Co-Founding & Sweat Equity';
      weeks = 'Strategic 12-Month Alignment';
    }

    return { stack, model, weeks };
  };

  const currentRecs = getRecommendations();

  const handleSaveAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;

    setSaving(true);
    try {
      const summaryPayload: Partial<SolutionMatch> = {
        contact_name: contactName,
        email: contactEmail,
        company,
        project_type: projectType,
        stage,
        timeline,
        budget,
        recommended_model: currentRecs.model,
        recommended_stack: currentRecs.stack,
        estimated_weeks: currentRecs.weeks,
        status: 'New'
      };

      const result = await api.submitSolutionMatch(summaryPayload);
      if (result && result.solutionMatch) {
        setSavedMatch(result.solutionMatch);
      } else {
        setSavedMatch({
          id: Date.now(),
          contact_name: contactName,
          email: contactEmail,
          company,
          project_type: projectType,
          stage,
          timeline,
          budget,
          recommended_model: currentRecs.model,
          recommended_stack: currentRecs.stack,
          estimated_weeks: currentRecs.weeks,
          status: 'New',
          created_at: new Date().toISOString()
        });
      }
      setStep(5);
    } catch (err) {
      console.error('Failed to submit architecture match:', err);
      setSavedMatch({
        id: Date.now(),
        contact_name: contactName,
        email: contactEmail,
        company,
        project_type: projectType,
        stage,
        timeline,
        budget,
        recommended_model: currentRecs.model,
        recommended_stack: currentRecs.stack,
        estimated_weeks: currentRecs.weeks,
        status: 'New',
        created_at: new Date().toISOString()
      });
      setStep(5);
    } finally {
      setSaving(false);
    }
  };

  const projectTypeOptions = [
    { label: 'Enterprise SaaS Platform', desc: 'B2B subscription software, multi-tenant database & analytics', icon: <Cpu className="size-5 text-black" /> },
    { label: 'Mobile App (iOS & Android)', desc: 'High-performance React Native with offline sync & push notifications', icon: <Smartphone className="size-5 text-black" /> },
    { label: 'AI Agent & LLM Workflow', desc: 'Custom RAG embeddings, Gemini 2.5 Flash, automated cognitive pipelines', icon: <Bot className="size-5 text-black" /> },
    { label: 'E-Commerce / Marketplace', desc: 'Escrow workflows, inventory sync, vendor commission engines', icon: <Globe className="size-5 text-black" /> }
  ];

  const stageOptions = [
    { label: 'Idea / Product Vision', desc: 'Need technical specification, wireframes, and architecture blueprint' },
    { label: 'Figma UI/UX Complete', desc: 'Designs are finalized; ready for clean, maintainable frontend & backend engineering' },
    { label: 'Live MVP in Production', desc: 'Active customers, need senior speed to scale features and infrastructure' },
    { label: 'Legacy Tech Overhaul', desc: 'Existing system has technical debt or scalability limits needing rewrite' }
  ];

  const timelineOptions = [
    { label: 'Immediate Sprint (< 4 Weeks)', desc: 'Fastest turnaround for critical launch date' },
    { label: '4 - 8 Weeks (Rapid MVP)', desc: 'Standard comprehensive agile production sprint' },
    { label: '2 - 4 Months (Complex Architecture)', desc: 'Multi-module platform with custom microservices' },
    { label: 'Ongoing Engineering Pod', desc: 'Dedicated team scaling product continuously' }
  ];

  const budgetOptions = [
    { label: '$5,000 - $10,000', desc: 'Early MVP prototype or isolated core module' },
    { label: '$10,000 - $25,000', desc: 'Production-ready commercial SaaS / Mobile app' },
    { label: '$25,000 - $60,000+', desc: 'High-scale enterprise platform with advanced microservices' },
    { label: 'Venture Sweat Equity / Subsidized Cash', desc: 'Co-founding partnership with equity alignment' }
  ];

  return (
    <div id="solution-matcher" className={`rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden ${className}`}>
      
      {/* Top Wizard Indicator */}
      <div className="bg-[#FBFBFB] px-6 sm:px-8 py-5 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-black" />
          <span className="text-xs font-mono uppercase tracking-wider text-black font-semibold">
            Interactive Solution Diagnostic &amp; Architecture Matcher
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i 
                  ? 'w-8 bg-black' 
                  : step > i 
                    ? 'w-3 bg-gray-400' 
                    : 'w-3 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-12">

        {/* STEP 1: WHAT ARE YOU BUILDING? */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block mb-2">Step 1 of 4</span>
              <h3 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-black">
                What type of product or solution are you building?
              </h3>
              <p className="text-sm text-gray-600 font-normal mt-2">
                Select your primary system archetype so we can calibrate the optimal cloud stack.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {projectTypeOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setProjectType(opt.label)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    projectType === opt.label
                      ? 'border-black bg-[#FBFBFB] shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="p-3 rounded-xl bg-white border border-gray-200 shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-black">{opt.label}</div>
                    <div className="text-xs text-gray-500 font-normal mt-1 leading-relaxed">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Continue to Stage</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STAGE & MATURITY */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block mb-2">Step 2 of 4</span>
              <h3 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-black">
                What is the current maturity of your product?
              </h3>
              <p className="text-sm text-gray-600 font-normal mt-2">
                Helps determine whether you need rapid discovery sprints, UX design, or immediate coding.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {stageOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setStage(opt.label)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    stage === opt.label
                      ? 'border-black bg-[#FBFBFB] shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="text-base font-semibold text-black">{opt.label}</div>
                  <div className="text-xs text-gray-500 font-normal mt-1.5 leading-relaxed">{opt.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 hover:border-black text-xs font-mono uppercase tracking-wider text-black transition-all cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Continue to Timeline</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TIMELINE & BUDGET */}
        {step === 3 && (
          <div>
            <div className="mb-8">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block mb-2">Step 3 of 4</span>
              <h3 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-black">
                Target Timeline &amp; Investment Bracket
              </h3>
              <p className="text-sm text-gray-600 font-normal mt-2">
                Transparent expectations ensure zero wasted time and accurate scoping.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black mb-3">
                  Target Launch Horizon:
                </label>
                <div className="space-y-3">
                  {timelineOptions.map((opt) => (
                    <div
                      key={opt.label}
                      onClick={() => setTimeline(opt.label)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        timeline === opt.label
                          ? 'border-black bg-[#FBFBFB]'
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className="text-sm font-semibold text-black">{opt.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black mb-3">
                  Estimated Capital Allocation:
                </label>
                <div className="space-y-3">
                  {budgetOptions.map((opt) => (
                    <div
                      key={opt.label}
                      onClick={() => setBudget(opt.label)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        budget === opt.label
                          ? 'border-black bg-[#FBFBFB]'
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className="text-sm font-semibold text-black">{opt.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 hover:border-black text-xs font-mono uppercase tracking-wider text-black transition-all cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>View Architecture Blueprint</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONTACT */}
        {step === 4 && (
          <div>
            <div className="mb-8">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block mb-2">Step 4 of 4</span>
              <h3 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-black">
                Your Calibrated Solution Architecture
              </h3>
              <p className="text-sm text-gray-600 font-normal mt-2">
                Based on your inputs, here is our recommended stack, turnaround sprint model, and engagement framework.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
              {/* Architecture Blueprint Card */}
              <div className="lg:col-span-7 p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-5">
                  <span className="font-mono text-xs uppercase tracking-wider text-gray-500">Recommended Model</span>
                  <span className="text-sm font-semibold text-black">{currentRecs.model}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Optimal Technology Ecosystem:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentRecs.stack.map((stk, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-mono text-black">
                          {stk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-gray-400">Estimated Duration</div>
                      <div className="text-base font-semibold text-black mt-1">{currentRecs.weeks}</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-gray-400">IP Ownership</div>
                      <div className="text-base font-semibold text-black mt-1">100% Client Transferred</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-xs text-gray-600 font-normal leading-relaxed">
                  <ShieldCheck className="size-4 text-black inline mr-1.5" />
                  Every deliverable includes automated continuous integration, cloud architecture diagrams, and full source code handover.
                </div>
              </div>

              {/* Email / Lead Capture Form */}
              <div className="lg:col-span-5 p-7 rounded-3xl bg-white border border-gray-200 flex flex-col justify-between">
                <form onSubmit={handleSaveAndSend} className="space-y-4">
                  <h4 className="text-lg font-normal text-black">
                    Receive Full PDF Architecture Blueprint
                  </h4>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    We will send the complete technical roadmap and sprint breakdown directly to your inbox.
                  </p>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black font-normal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black font-normal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-1">Company / Project Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Nexus Corp"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black text-xs text-black font-normal outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full mt-2 py-3.5 px-6 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="size-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        <span>Send Me The Blueprint</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 hover:border-black text-xs font-mono uppercase tracking-wider text-black transition-all cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Adjust Parameters</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS STATE */}
        {step === 5 && (
          <div className="py-8 text-center max-w-2xl mx-auto">
            <div className="size-16 rounded-full bg-[#FBFBFB] border border-gray-200 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="size-8 text-black" />
            </div>

            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Diagnostic Complete
            </span>
            <h3 className="text-3xl font-normal -tracking-[1px] text-black mb-4">
              Your Architecture Blueprint is Ready
            </h3>
            <p className="text-sm text-gray-600 font-normal leading-relaxed mb-8">
              We have generated your custom solution blueprint for <strong>{contactEmail}</strong>. A copy has been dispatched to our engineering leadership for direct review.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {onBookConsultationWithDiagnostic && (
                <button
                  type="button"
                  onClick={() => onBookConsultationWithDiagnostic(`Diagnostic: ${projectType} (${currentRecs.model}) for ${contactName}`)}
                  className="px-7 py-3.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                >
                  Book 30-Min Architecture Walkthrough
                </button>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3.5 rounded-full border border-gray-200 hover:border-black text-xs font-mono uppercase tracking-wider text-black transition-all cursor-pointer"
              >
                Start New Diagnostic
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
