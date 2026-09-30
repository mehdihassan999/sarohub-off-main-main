import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, FileText, Share2, CheckCircle2, ShieldCheck, 
  Layers, Cpu, Printer, Award, Check
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';
import { downloadExecutiveDeck, DeckPdfData } from '../utils/executiveDeckPdf';

interface ExecutiveDeckViewProps {
  settings?: { [key: string]: string };
}

export default function ExecutiveDeckView({ settings = {} }: ExecutiveDeckViewProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const companyName = settings.company_name || 'SaroHub Technologies (Private) Limited';
  const companyEmail = 'mehdi.sarohub@gmail.com';
  const rawWhatsapp = settings.whatsapp || '+92 3430381473';
  const whatsappNumber = rawWhatsapp.includes('+94') ? '+92 3430381473' : rawWhatsapp;

  const [deckData, setDeckData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [activeTrack, setActiveTrack] = useState<'all' | 'ai' | 'saas' | 'mobile'>('all');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeCaseStudies, setIncludeCaseStudies] = useState(true);
  const [includeGuarantees, setIncludeGuarantees] = useState(true);

  useEffect(() => {
    fetch('/api/deck/data')
      .then(res => res.json())
      .then(data => {
        setDeckData(data);
      })
      .catch(err => {
        console.error('Failed to load live deck data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredPillars = React.useMemo(() => {
    if (!deckData?.core_pillars) return [];
    if (activeTrack === 'ai') {
      return deckData.core_pillars.filter((p: any) => p.title.toLowerCase().includes('ai') || p.title.toLowerCase().includes('automation'));
    }
    if (activeTrack === 'saas') {
      return deckData.core_pillars.filter((p: any) => p.title.toLowerCase().includes('saas') || p.title.toLowerCase().includes('web') || p.title.toLowerCase().includes('custom'));
    }
    if (activeTrack === 'mobile') {
      return deckData.core_pillars.filter((p: any) => p.title.toLowerCase().includes('mobile'));
    }
    return deckData.core_pillars;
  }, [deckData, activeTrack]);

  const preparePdfPayload = (): DeckPdfData => {
    return {
      companyName,
      tagline: 'Enterprise Software Architecture • Scaled SaaS Platforms • AI Systems',
      headquarters: deckData?.headquarters || 'Skardu, Gilgit-Baltistan, Pakistan',
      email: companyEmail,
      whatsapp: whatsappNumber,
      phone: deckData?.phone || '+92 355 5866875',
      website: 'https://sarohub.com',
      metrics: deckData?.verified_metrics || [
        { label: 'Projects Delivered', value: '45+', highlight: 'Global clients' },
        { label: 'Enterprise Uptime', value: '99.9%', highlight: 'Production SLA' },
        { label: 'Incubated Ventures', value: '5+', highlight: 'Active spinouts' },
        { label: 'Active Engineers', value: '18+', highlight: 'In-house talent' },
        { label: 'Client Retention', value: '94%', highlight: 'Long-term' },
        { label: 'IP Ownership', value: '100%', highlight: 'Client owns code' }
      ],
      pillars: (filteredPillars && filteredPillars.length > 0) ? filteredPillars : [
        {
          title: 'Custom Software & Enterprise Web Applications',
          description: 'Bespoke operational backbones, high-traffic portals, and cloud microservices engineered for zero single points of failure.'
        },
        {
          title: 'Multi-Tenant SaaS & Digital Products',
          description: 'Scalable subscription platforms with automated billing, tenant partitioning, and distributed cloud computing.'
        },
        {
          title: 'Mobile Applications (iOS & Android)',
          description: 'Fluid native and cross-platform mobile apps with offline synchronization, device hardware integration, and biometric security.'
        },
        {
          title: 'AI Engineering & Cognitive Automation',
          description: 'Generative AI workflows, tailored LLM agents, retrieval-augmented generation (RAG), and intelligent enterprise search.'
        }
      ],
      technologies: [
        { category: 'Frontend & Mobile', stack: 'React, Next.js, React Native, TypeScript, Tailwind, Vite' },
        { category: 'Backend & Cloud', stack: 'Node.js, Express, Python FastAPI, PostgreSQL, Redis, Supabase' },
        { category: 'AI & Cognitive', stack: 'Gemini 2.5, OpenAI GPT-4o, LangChain, Vector Embeddings, RAG' },
        { category: 'DevOps & SRE', stack: 'AWS, GCP Cloud Run, Docker, Cloudflare, CI/CD, Kubernetes' }
      ],
      caseStudies: (deckData?.selected_case_studies || []).map((cs: any) => ({
        title: cs?.title || '',
        client: cs?.client || '',
        category: cs?.category || '',
        solution: cs?.solution || ''
      })),
      guarantees: deckData?.enterprise_guarantees || [
        {
          name: '100% Client IP Ownership',
          detail: 'All git repos, assets, and documentation belong exclusively to the client upon settlement.'
        },
        {
          name: 'Strict Mutual NDA First',
          detail: 'Confidentiality protection executed before technical scoping or architectural disclosures.'
        },
        {
          name: 'OWASP Security Hardening',
          detail: 'End-to-end data encryption, role-based access control, and automated penetration checks.'
        },
        {
          name: 'Post-Launch Hypercare SLA',
          detail: 'Dedicated 30-day warranty, real-time monitoring, and rapid hotfix guarantees.'
        }
      ]
    };
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const payload = preparePdfPayload();
      const filename = `${companyName.replace(/[^a-zA-Z0-9]/g, '-')}-Executive-Capabilities-Deck.pdf`;
      const success = downloadExecutiveDeck(payload, filename);
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } else {
        throw new Error('PDF download direct method did not complete');
      }
    } catch (e) {
      console.warn('PDF download fallback to print:', e);
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    try {
      window.print();
    } catch (err) {
      console.error('Print trigger failed:', err);
    } finally {
      setTimeout(() => setIsPrinting(false), 1000);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-white">
      <SEOHead 
        title={`Executive Capabilities Deck (One-Pager PDF) | ${companyName}`}
        description="Download the official SaroHub Technologies Executive Capabilities Deck. One-page corporate overview, technical infrastructure, verified case studies, and enterprise guarantees."
        canonicalUrl="https://sarohub.com/capabilities"
      />

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #capabilities-deck-canvas, #capabilities-deck-canvas * {
            visibility: visible;
          }
          #capabilities-deck-canvas {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, footer, .no-print, header {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Breadcrumb */}
      <div className="border-b border-white/[0.08] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Executive Deck', url: '/capabilities', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-slate-400">
            Corporate Briefing
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                Executive Capabilities Deck
              </span>
              <h1 className="text-4xl sm:text-6xl font-normal -tracking-[2.5px] text-white leading-tight mb-6 font-display">
                Corporate Capabilities <span className="italic text-[#FF5C00]">One-Pager</span>
              </h1>
              <p className="text-lg text-slate-400 font-normal leading-relaxed">
                Engineered for C-suite executives, investment committees, and technical directors. Customize your focus track and export a high-resolution vector PDF immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                {copySuccess ? <Check className="size-4 text-[#FF5C00]" /> : <Share2 className="size-4 text-slate-400" />}
                <span>{copySuccess ? 'Link Copied' : 'Share Deck'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={isPrinting}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Printer className="size-4 text-slate-400" />
                <span>{isPrinting ? 'Printing...' : 'Print'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf || loading}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer font-bold border border-[#FFA566]/30"
              >
                {isGeneratingPdf ? (
                  <span>Generating Vector PDF...</span>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>PDF Downloaded</span>
                  </>
                ) : (
                  <>
                    <RollText>DOWNLOAD PDF ONE-PAGER</RollText>
                    <DiagonalArrow size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Canvas */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Customization Toolbar */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-5 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400">Focus Track:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Full Overview' },
                { id: 'ai', label: 'AI & Automation' },
                { id: 'saas', label: 'SaaS & Enterprise Web' },
                { id: 'mobile', label: 'Mobile Apps' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTrack(t.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeTrack === t.id
                      ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white font-bold shadow-md'
                      : 'bg-[#141828] border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMetrics}
                onChange={e => setIncludeMetrics(e.target.checked)}
                className="rounded border-white/20 text-[#FF5C00] focus:ring-0 cursor-pointer"
              />
              Metrics
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCaseStudies}
                onChange={e => setIncludeCaseStudies(e.target.checked)}
                className="rounded border-white/20 text-[#FF5C00] focus:ring-0 cursor-pointer"
              />
              Case Studies
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGuarantees}
                onChange={e => setIncludeGuarantees(e.target.checked)}
                className="rounded border-white/20 text-[#FF5C00] focus:ring-0 cursor-pointer"
              />
              Guarantees &amp; SLA
            </label>
          </div>
        </div>

        {/* Live Canvas */}
        <div className="overflow-x-auto pb-8">
          <div 
            id="capabilities-deck-canvas"
            ref={deckRef}
            className="w-full max-w-[960px] mx-auto rounded-3xl border border-white/[0.08] bg-[#0E121E] text-white p-8 sm:p-12 shadow-2xl font-sans"
            style={{ minHeight: '1000px' }}
          >
            {/* Header */}
            <div className="border-b border-white/[0.08] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF7A1A] mb-1 block font-bold">
                  SaroHub Technologies (Private) Limited
                </span>
                <h2 className="text-3xl font-normal -tracking-[1px] text-white font-display">
                  Executive Capabilities Statement
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Enterprise Software Architecture &bull; Scaled SaaS Platforms &bull; AI Systems &amp; Cognitive Automation
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] font-mono text-slate-400 space-y-1 bg-[#141828] p-4 rounded-2xl border border-white/[0.08] shrink-0">
                <p><strong className="text-white">Legal:</strong> Inc. Private Limited</p>
                <p><strong className="text-white">HQ:</strong> Skardu, Gilgit-Baltistan, Pakistan</p>
                <p><strong className="text-white">Email:</strong> {companyEmail}</p>
                <p><strong className="text-white">WhatsApp:</strong> {whatsappNumber}</p>
              </div>
            </div>

            {/* Metrics Ribbon */}
            {includeMetrics && deckData?.verified_metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
                {deckData.verified_metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl border border-white/[0.08] bg-[#141828] text-center">
                    <p className="text-2xl font-normal text-white -tracking-[1px] font-display">
                      {m.value}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-300 mt-0.5">{m.label}</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">{m.highlight}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pillars */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="size-4 text-[#FF5C00]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                  Core Engineering Competencies
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPillars.map((p: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl border border-white/[0.08] bg-[#141828]">
                    <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#FF5C00]"></span>
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-normal leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack Matrix */}
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#141828] mb-8">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2 font-semibold">
                <Cpu className="size-4 text-[#FF5C00]" />
                Battle-Tested Technology Ecosystem
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-white text-[11px] mb-1">Frontend &amp; Mobile</p>
                  <p className="text-slate-400 text-[11px] font-mono">React, Next.js, React Native, TypeScript, Tailwind, Vite</p>
                </div>
                <div>
                  <p className="font-semibold text-white text-[11px] mb-1">Backend &amp; Cloud</p>
                  <p className="text-slate-400 text-[11px] font-mono">Node.js, Express, Python FastAPI, PostgreSQL, Redis, Supabase</p>
                </div>
                <div>
                  <p className="font-semibold text-white text-[11px] mb-1">AI &amp; Cognitive</p>
                  <p className="text-slate-400 text-[11px] font-mono">Gemini 2.5, OpenAI GPT-4o, LangChain, Vector Embeddings, RAG</p>
                </div>
                <div>
                  <p className="font-semibold text-white text-[11px] mb-1">Infrastructure &amp; DevOps</p>
                  <p className="text-slate-400 text-[11px] font-mono">AWS, GCP, Docker, Cloudflare, CI/CD Actions, Kubernetes</p>
                </div>
              </div>
            </div>

            {/* Case Studies */}
            {includeCaseStudies && deckData?.selected_case_studies && (
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2 font-semibold">
                  <Award className="size-4 text-[#FF5C00]" />
                  Demonstrated Track Record &amp; Solved Challenges
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deckData.selected_case_studies.map((cs: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl border border-white/[0.08] bg-[#141828]">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="text-xs font-semibold text-white">{cs.title}</h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#FF7A1A]">
                          {cs.category}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <p className="text-slate-400 font-normal">
                          <strong className="text-slate-200">Challenge:</strong> {cs.problem ? cs.problem.substring(0, 100) : 'Modernized legacy system'}...
                        </p>
                        <p className="text-slate-300 font-normal">
                          <strong className="text-[#FF7A1A]">Solved:</strong> {cs.solution ? cs.solution.substring(0, 110) : 'Full stack delivery'}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enterprise Guarantees */}
            {includeGuarantees && deckData?.enterprise_guarantees && (
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white mb-4 flex items-center gap-2 font-semibold">
                  <ShieldCheck className="size-4 text-[#FF5C00]" />
                  Enterprise Guarantees &amp; Contractual Commitments
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {deckData.enterprise_guarantees.map((g: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl border border-white/[0.08] bg-[#141828] text-xs">
                      <p className="font-semibold text-white text-[11px] mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-[#FF5C00] shrink-0" />
                        {g.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-normal leading-relaxed">{g.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Footer */}
            <div className="border-t border-white/[0.08] pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div>
                <p className="font-semibold text-white">Ready to discuss your enterprise requirements?</p>
                <p className="text-slate-400 text-[11px]">
                  Book an engineering discovery call: <a href="https://sarohub.com/book" className="text-[#FF7A1A] underline">sarohub.com/book</a>
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>Direct: {whatsappNumber}</span>
                <span>&bull;</span>
                <span>Email: {companyEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
