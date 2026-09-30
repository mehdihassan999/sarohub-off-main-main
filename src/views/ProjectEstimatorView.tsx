import React, { useState, useMemo } from 'react';
import { 
  Calculator, Check, ShieldCheck, Clock, 
  Layers, Cpu, Smartphone, Globe, ShoppingCart, 
  Cloud, Send, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

interface ProjectEstimatorViewProps {
  settings?: { [key: string]: string };
}

interface ProjectTypeOption {
  id: string;
  name: string;
  icon: any;
  desc: string;
  baseMinUSD: number;
  baseMaxUSD: number;
  baseWeeks: number;
}

interface ModuleOption {
  id: string;
  name: string;
  category: string;
  costUSD: number;
  weeks: number;
  desc: string;
}

export default function ProjectEstimatorView({ settings = {} }: ProjectEstimatorViewProps) {
  const navigate = useNavigate();
  const companyName = settings.company_name || 'SaroHub Technologies (Private) Limited';
  const companyEmail = settings.email || 'info@sarohub.com';
  const rawWhatsapp = settings.whatsapp || '+92 3430381473';
  const whatsappNumber = rawWhatsapp.includes('+94') ? '+92 3430381473' : rawWhatsapp;

  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('Enterprise SaaS Platform');
  const [selectedScale, setSelectedScale] = useState<string>('Production Standard');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'AI / LLM Integration & Workflow Automation',
    'Payment Processing & Subscriptions (Stripe/Card)',
    'Enterprise RBAC, Multi-Tenancy & Audit Logs'
  ]);
  const [timelineSpeed, setTimelineSpeed] = useState<string>('Standard Production Sprint');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const USD_TO_PKR = 280;

  const projectTypes: ProjectTypeOption[] = [
    {
      id: 'Enterprise SaaS Platform',
      name: 'Enterprise SaaS Platform',
      icon: Layers,
      desc: 'Multi-tenant cloud platform with subscription billing, role permissions, and scalable database architecture.',
      baseMinUSD: 4500,
      baseMaxUSD: 8500,
      baseWeeks: 8
    },
    {
      id: 'Custom Web Application',
      name: 'Custom Web Application',
      icon: Globe,
      desc: 'Bespoke high-performance web platform, interactive dashboards, or internal operational software.',
      baseMinUSD: 2500,
      baseMaxUSD: 4500,
      baseWeeks: 4
    },
    {
      id: 'Mobile App (iOS & Android)',
      name: 'Mobile App (iOS & Android)',
      icon: Smartphone,
      desc: 'Native or cross-platform React Native / Flutter apps with offline sync, push alerts, and device hardware integration.',
      baseMinUSD: 3500,
      baseMaxUSD: 6500,
      baseWeeks: 6
    },
    {
      id: 'AI Agent & Cognitive Automation',
      name: 'AI Agent & Cognitive Automation',
      icon: Cpu,
      desc: 'Generative AI workflows, customized LLM agents, RAG enterprise search, and automated decision engines.',
      baseMinUSD: 3000,
      baseMaxUSD: 6000,
      baseWeeks: 5
    },
    {
      id: 'E-Commerce Ecosystem',
      name: 'E-Commerce Ecosystem',
      icon: ShoppingCart,
      desc: 'Custom headless or full-stack digital store with inventory synchronization, payment gateways, and order dispatch.',
      baseMinUSD: 2200,
      baseMaxUSD: 4200,
      baseWeeks: 4
    },
    {
      id: 'Cloud Architecture & DevOps',
      name: 'Cloud Architecture & DevOps',
      icon: Cloud,
      desc: 'Kubernetes orchestration, serverless microservices, CI/CD deployment pipelines, and zero-downtime infrastructure.',
      baseMinUSD: 2000,
      baseMaxUSD: 4000,
      baseWeeks: 3
    }
  ];

  const scaleTiers = [
    {
      id: 'MVP / Startup Prototype',
      multiplier: 0.85,
      desc: 'Optimized for rapid speed-to-market and investor validation with core essential features.',
      badge: 'Speed Focused'
    },
    {
      id: 'Production Standard',
      multiplier: 1.15,
      desc: 'Built for active customer traffic, comprehensive unit/integration testing, and solid documentation.',
      badge: 'Recommended'
    },
    {
      id: 'Enterprise Scaled & High-Security',
      multiplier: 1.6,
      desc: 'Hardened for high concurrency, strict compliance (SOC2/GDPR), automated auditing, and 99.9% uptime SLA.',
      badge: 'Maximum Reliability'
    }
  ];

  const availableModules: ModuleOption[] = [
    {
      id: 'AI / LLM Integration & Workflow Automation',
      name: 'AI & Cognitive LLM Workflows',
      category: 'Intelligence',
      costUSD: 1200,
      weeks: 1.5,
      desc: 'Smart agent pipelines, contextual AI copilots, OpenAI/Gemini APIs, and automated summarization.'
    },
    {
      id: 'Payment Processing & Subscriptions (Stripe/Card)',
      name: 'Global & Local Payments (Stripe/Card)',
      category: 'Monetization',
      costUSD: 700,
      weeks: 1,
      desc: 'Secure checkout, recurring subscriptions, invoice generation, and multi-currency billing.'
    },
    {
      id: 'Enterprise RBAC, Multi-Tenancy & Audit Logs',
      name: 'Multi-Tenancy & Enterprise RBAC',
      category: 'Security',
      costUSD: 1100,
      weeks: 1.5,
      desc: 'Granular permissions, organization partitioning, session tracking, and audit logging.'
    },
    {
      id: 'Real-time Chat, WebSockets & Notifications',
      name: 'Real-Time WebSockets & Push Alerts',
      category: 'Engagement',
      costUSD: 900,
      weeks: 1,
      desc: 'Live bidirectional messaging, in-app activity feeds, email dispatches, and SMS webhooks.'
    },
    {
      id: 'Advanced BI Analytics & Visual Dashboards',
      name: 'Interactive Analytics & Reports',
      category: 'Data',
      costUSD: 850,
      weeks: 1,
      desc: 'Data visualization (charts, heatmaps, exportable CSV/PDF reports), filtering, and KPIs.'
    },
    {
      id: 'Third-Party API & ERP/CRM Synchronizers',
      name: 'Third-Party ERP, CRM & API Sync',
      category: 'Integrations',
      costUSD: 800,
      weeks: 1,
      desc: 'Seamless two-way integration with Salesforce, HubSpot, SAP, Google Workspace, or custom REST/GraphQL APIs.'
    },
    {
      id: 'High Availability Cloud, CI/CD & Auto-Scaling',
      name: 'High Availability Cloud & CI/CD',
      category: 'DevOps',
      costUSD: 950,
      weeks: 1,
      desc: 'Automated GitHub Actions pipelines, Docker containerization, CDN caching, and automated cloud backups.'
    }
  ];

  const calculation = useMemo(() => {
    const pType = projectTypes.find(p => p.id === selectedProjectType) || projectTypes[0];
    const sTier = scaleTiers.find(s => s.id === selectedScale) || scaleTiers[1];

    let min = pType.baseMinUSD * sTier.multiplier;
    let max = pType.baseMaxUSD * sTier.multiplier;
    let weeks = pType.baseWeeks * sTier.multiplier;

    selectedModules.forEach(modId => {
      const mod = availableModules.find(m => m.id === modId);
      if (mod) {
        min += mod.costUSD;
        max += mod.costUSD * 1.25;
        weeks += mod.weeks;
      }
    });

    if (timelineSpeed === 'Accelerated / High-Priority') {
      min *= 1.2;
      max *= 1.2;
      weeks = Math.max(3, weeks * 0.7);
    }

    const isPkr = currency === 'PKR';
    const finalMin = isPkr ? Math.round(min * USD_TO_PKR / 1000) * 1000 : Math.round(min / 50) * 50;
    const finalMax = isPkr ? Math.round(max * USD_TO_PKR / 1000) * 1000 : Math.round(max / 50) * 50;
    const weeksMin = Math.max(2, Math.floor(weeks));
    const weeksMax = Math.ceil(weeks * 1.3);

    const phases = [
      {
        name: 'Phase 1: Architecture, Scoping & Interactive UX',
        weeks: Math.max(1, Math.round(weeks * 0.2)),
        desc: 'Technical specification document, database schema modeling, user journeys, and high-fidelity Figma prototypes.'
      },
      {
        name: 'Phase 2: Core Engineering & Backend Services',
        weeks: Math.max(2, Math.round(weeks * 0.4)),
        desc: 'API microservices, cloud databases, business logic algorithms, and authentication infrastructure.'
      },
      {
        name: 'Phase 3: Module Integration & Client Application',
        weeks: Math.max(1, Math.round(weeks * 0.25)),
        desc: `Implementation of selected modules (${selectedModules.length > 0 ? selectedModules.slice(0, 2).join(', ') : 'core features'}), state handling, and responsive frontend.`
      },
      {
        name: 'Phase 4: QA Audits, Security Hardening & Launch',
        weeks: Math.max(1, Math.round(weeks * 0.15)),
        desc: 'Penetration testing, cross-browser validation, CI/CD setup, production rollout, and SLA warranty initiation.'
      }
    ];

    return {
      finalMin,
      finalMax,
      weeksMin,
      weeksMax,
      phases
    };
  }, [selectedProjectType, selectedScale, selectedModules, timelineSpeed, currency]);

  const toggleModule = (modId: string) => {
    setSelectedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const handleSaveAndEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim()) {
      setSubmitError('Please provide your email address to receive your formal estimate breakdown.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.createEstimate({
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        client_phone: clientPhone.trim(),
        company_name: company.trim(),
        project_type: selectedProjectType,
        scale_tier: selectedScale,
        selected_modules: selectedModules,
        timeline_speed: timelineSpeed,
        currency,
        project_notes: notes.trim()
      });

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit estimate. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currSymbol = currency === 'PKR' ? '₨ ' : '$';

  return (
    <div className="min-h-screen bg-[#08090E] text-white">
      <SEOHead 
        title={`Project Cost & Scope Calculator | ${companyName}`}
        description="Estimate your software project cost, delivery timeline, and phased architectural roadmap in real time. Transparent engineering pricing from SaroHub Technologies."
        canonicalUrl="https://sarohub.com/estimate"
      />

      {/* Top Breadcrumb */}
      <div className="border-b border-white/[0.08] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Scope & Cost Estimator', url: '/estimate', isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-slate-300">
            Interactive Cost Model
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center max-w-3xl relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Scope &amp; Investment Calculator
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-white leading-tight mb-6 font-display">
            Calculate Your <span className="italic text-[#FF5C00]">Project Scope</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Configure technical requirements, scale, and feature modules. Get instant, transparent projections for development budget, delivery milestones, and sprint timelines.
          </p>

          {/* Currency Toggle */}
          <div className="inline-flex items-center gap-1 p-1 mt-8 rounded-full border border-white/10 bg-[#0E121E] shadow-lg">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                currency === 'USD' 
                  ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white font-bold shadow-[0_0_15px_rgba(255,92,0,0.4)]' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              USD ($) Global
            </button>
            <button
              type="button"
              onClick={() => setCurrency('PKR')}
              className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                currency === 'PKR' 
                  ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white font-bold shadow-[0_0_15px_rgba(255,92,0,0.4)]' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              PKR (₨) Domestic
            </button>
          </div>
        </div>
      </section>

      {/* Main Form & Calculation Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Configurator Left Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Project Type */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-7 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-7 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                  1
                </span>
                <h2 className="text-xl font-normal text-white">Select Project Archetype</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectTypes.map((type) => {
                  const isSelected = selectedProjectType === type.id;
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedProjectType(type.id)}
                      className={`p-6 rounded-3xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FF5C00] bg-[#141A2E] shadow-[0_0_20px_rgba(255,92,0,0.18)] ring-1 ring-[#FF5C00]'
                          : 'border-white/[0.08] bg-[#101424] hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className={`size-10 rounded-2xl flex items-center justify-center ${
                            isSelected ? 'bg-[#FF5C00] text-white shadow-xs' : 'bg-[#141828] border border-white/10 text-slate-300'
                          }`}>
                            <Icon className="size-5" />
                          </div>
                          {isSelected && <Check className="size-4 text-[#FF7A1A]" />}
                        </div>
                        <h3 className="text-base font-medium text-white mb-1">
                          {type.name}
                        </h3>
                        <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-2">{type.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
                        Base: ~{type.baseWeeks} weeks delivery
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Architecture & Scalability Tier */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-7 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-7 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                  2
                </span>
                <h2 className="text-xl font-normal text-white">Architecture &amp; Scalability Tier</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {scaleTiers.map((tier) => {
                  const isSelected = selectedScale === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedScale(tier.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF5C00] bg-[#141A2E] shadow-[0_0_20px_rgba(255,92,0,0.18)] ring-1 ring-[#FF5C00]'
                          : 'border-white/[0.08] bg-[#101424] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-white">
                          {tier.id}
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#141828] border border-white/10 text-slate-300">
                          {tier.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-normal">{tier.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Feature Modules / Add-ons */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-7 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="size-7 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                    3
                  </span>
                  <h2 className="text-xl font-normal text-white">Feature Modules &amp; Integrations</h2>
                </div>
                <span className="text-xs font-mono text-slate-300">{selectedModules.length} selected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableModules.map((mod) => {
                  const isSelected = selectedModules.includes(mod.id);
                  const displayCost = currency === 'PKR' 
                    ? `+₨ ${(mod.costUSD * USD_TO_PKR).toLocaleString()}` 
                    : `+$${mod.costUSD}`;

                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF5C00] bg-[#141A2E] shadow-[0_0_15px_rgba(255,92,0,0.15)] ring-1 ring-[#FF5C00]'
                          : 'border-white/[0.08] bg-[#101424] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-semibold text-white">
                          {mod.name}
                        </h4>
                        <div className={`size-4 rounded flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-[#FF5C00] border-[#FF5C00] text-white' : 'border-white/20 bg-[#141828]'
                        }`}>
                          {isSelected && <Check className="size-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mb-2 font-normal">{mod.desc}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 uppercase">{mod.category}</span>
                        <span className="font-semibold text-[#FF7A1A]">{displayCost}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Delivery Cadence */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-7 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="size-7 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                  4
                </span>
                <h2 className="text-xl font-normal text-white">Delivery Cadence &amp; Priority</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'Standard Production Sprint',
                    name: 'Standard Production Sprint',
                    desc: 'Regular continuous delivery cycles with weekly milestone demonstrations.',
                    tag: 'Standard Rates'
                  },
                  {
                    id: 'Accelerated / High-Priority',
                    name: 'Accelerated / High-Priority Sprint',
                    desc: 'Dedicated parallel engineering squads, daily releases, delivers ~30% faster.',
                    tag: 'Dedicated Squad (+20%)'
                  }
                ].map((speed) => {
                  const isSelected = timelineSpeed === speed.id;
                  return (
                    <div
                      key={speed.id}
                      onClick={() => setTimelineSpeed(speed.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF5C00] bg-[#141A2E] shadow-[0_0_20px_rgba(255,92,0,0.18)] ring-1 ring-[#FF5C00]'
                          : 'border-white/[0.08] bg-[#101424] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-semibold text-white">
                          {speed.name}
                        </h4>
                        {isSelected && <Check className="size-3.5 text-[#FF7A1A]" />}
                      </div>
                      <p className="text-xs text-slate-300 mb-2 font-normal">{speed.desc}</p>
                      <span className="text-[10px] font-mono uppercase text-[#FF7A1A] bg-[#141828] border border-[#FF5C00]/20 px-2 py-0.5 rounded-full font-semibold">
                        {speed.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Scope & Investment Summary */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-7 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5C00] block font-bold">
                    Live Calculation
                  </span>
                  <h3 className="text-xl font-normal text-white">Preliminary Estimate</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectType('Enterprise SaaS Platform');
                    setSelectedScale('Production Standard');
                    setSelectedModules(['AI / LLM Integration & Workflow Automation']);
                    setTimelineSpeed('Standard Production Sprint');
                  }}
                  title="Reset to defaults"
                  className="size-8 rounded-full border border-white/10 bg-[#141828] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>

              {/* Price & Timeline Display */}
              <div className="space-y-4">
                <div className="p-6 rounded-3xl border border-white/[0.08] bg-[#101424]">
                  <p className="text-xs font-mono uppercase text-slate-300 mb-1">Estimated Investment Range</p>
                  <div className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-white">
                    {currSymbol}{calculation.finalMin.toLocaleString()} &ndash; {currSymbol}{calculation.finalMax.toLocaleString()}
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-2">
                    Currency: {currency} &bull; Milestone-based disbursements under strict SLA
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#101424] text-center">
                    <Clock className="size-4 text-[#FF5C00] mx-auto mb-1" />
                    <p className="text-[10px] font-mono uppercase text-slate-400">Delivery</p>
                    <p className="text-sm font-semibold text-white">{calculation.weeksMin} to {calculation.weeksMax} Weeks</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#101424] text-center">
                    <ShieldCheck className="size-4 text-[#FF5C00] mx-auto mb-1" />
                    <p className="text-[10px] font-mono uppercase text-slate-400">IP Rights</p>
                    <p className="text-sm font-semibold text-white">100% Client Owned</p>
                  </div>
                </div>
              </div>

              {/* Phased Roadmap */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
                  Architectural Delivery Roadmap
                </h4>
                <div className="space-y-2">
                  {calculation.phases.map((phase, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-white/[0.08] bg-[#101424] text-xs">
                      <div className="flex justify-between font-semibold text-white mb-1">
                        <span>{phase.name}</span>
                        <span className="font-mono text-[#FF7A1A] shrink-0 font-bold">~{phase.weeks} wks</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{phase.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-2">
                <button
                  type="button"
                  id="cta-estimate-book"
                  onClick={() => {
                    navigate('/book', {
                      state: {
                        projectType: selectedProjectType,
                        budgetRange: `${currSymbol}${calculation.finalMin.toLocaleString()} - ${currSymbol}${calculation.finalMax.toLocaleString()}`,
                        scopeSummary: `${selectedProjectType} (${selectedScale}) with ${selectedModules.length} modules (${selectedModules.join(', ')}). Estimated delivery: ${calculation.weeksMin}-${calculation.weeksMax} weeks.`
                      }
                    });
                  }}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-white font-mono text-xs uppercase tracking-wider hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold border border-[#FFA566]/30"
                >
                  <RollText>BOOK DISCOVERY CALL TO LOCK SCOPE</RollText>
                  <DiagonalArrow size={16} />
                </button>

                {submitSuccess ? (
                  <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#141A2E] text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-[#FF5C00]" />
                    <span>Estimate dispatched to your email! We will follow up within 24 hours.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSaveAndEmail} className="pt-4 border-t border-white/[0.08] space-y-3">
                    <p className="text-xs font-mono uppercase text-slate-300">
                      Receive this official estimate breakdown in your inbox:
                    </p>
                    
                    {submitError && (
                      <p className="text-xs text-red-400 font-mono">{submitError}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#141828] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#FF5C00]"
                      />
                      <input
                        type="email"
                        required
                        placeholder="you@company.com *"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#141828] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#FF5C00]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-full border border-white/15 bg-[#141828] hover:border-[#FF5C00] text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer font-semibold"
                    >
                      {isSubmitting ? (
                        <span>Dispatching...</span>
                      ) : (
                        <>
                          <Send className="size-3.5 text-[#FF5C00]" />
                          <span>Email Me Formal Scope Summary</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.08] text-xs font-mono text-slate-300 text-center space-y-1">
                <div>
                  WhatsApp Desk:{' '}
                  <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} className="text-[#FF7A1A] hover:text-[#FFA566] underline font-semibold">
                    {whatsappNumber}
                  </a>
                </div>
                <div>
                  Direct Email:{' '}
                  <a href={`mailto:${companyEmail}`} className="text-[#FF7A1A] hover:text-[#FFA566] underline font-semibold">
                    {companyEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
