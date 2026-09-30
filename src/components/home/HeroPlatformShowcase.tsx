import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Layers, ShieldCheck, CheckCircle2, 
  Workflow, Zap, Code2, Database, Play, 
  RefreshCw, Globe, ArrowUpRight, Lock, Sparkles, Terminal
} from 'lucide-react';

interface HeroPlatformShowcaseProps {
  className?: string;
}

type ModeKey = 'saas' | 'ventures' | 'ai';

interface ModeData {
  id: ModeKey;
  label: string;
  badge: string;
  prompt: string;
  metrics: { label: string; value: string; accent?: boolean }[];
  steps: {
    icon: any;
    title: string;
    subtitle: string;
    tag: string;
    status: string;
  }[];
}

const MODES: ModeData[] = [
  {
    id: 'saas',
    label: 'Enterprise SaaS',
    badge: 'CORE ENGINEERING',
    prompt: 'Architect multi-tenant B2B enterprise platform with real-time sync & zero-lockin',
    metrics: [
      { label: 'Throughput', value: '18.4k req/s' },
      { label: 'Latency', value: '14ms', accent: true },
      { label: 'SLA Uptime', value: '99.98%' },
    ],
    steps: [
      {
        icon: Code2,
        title: 'Application Layer & Frontend',
        subtitle: 'React 19 + TypeScript + Tailored Micro-Interactions',
        tag: 'Clean Architecture',
        status: 'Compiled · 100%'
      },
      {
        icon: Database,
        title: 'Database & Relational Model',
        subtitle: 'Normalized PostgreSQL Schemas + Strict ACID Integrity',
        tag: 'Zero Data Silos',
        status: 'Synced'
      },
      {
        icon: ShieldCheck,
        title: 'Security & Enterprise Access',
        subtitle: 'Role-Based Access Control (RBAC) + Audit Trail Logs',
        tag: 'Enterprise Grade',
        status: 'Enforced'
      }
    ]
  },
  {
    id: 'ventures',
    label: 'Proprietary Ventures',
    badge: 'CO-BUILD & SCALE',
    prompt: 'Deploy high-velocity MVP: Alin316 EdTech Multi-Campus & SaroHub Suite',
    metrics: [
      { label: 'Active Users', value: '15,000+' },
      { label: 'Velocity', value: '4-8 Wks', accent: true },
      { label: 'IP Rights', value: '100% Client' },
    ],
    steps: [
      {
        icon: Layers,
        title: 'Alin316 EdTech Ecosystem',
        subtitle: 'Multi-campus administration, automated fees & portals',
        tag: 'Live in Production',
        status: 'Operational'
      },
      {
        icon: Workflow,
        title: 'Rapid MVP Acceleration Framework',
        subtitle: 'From specification to production-ready pilot in weeks',
        tag: 'Full Ownership',
        status: 'Active Sprint'
      },
      {
        icon: Globe,
        title: 'Global Market Scalability',
        subtitle: 'Built in Gilgit-Baltistan, architected for global markets',
        tag: 'Worldwide Edge',
        status: 'Global CDN'
      }
    ]
  },
  {
    id: 'ai',
    label: 'AI & Automation',
    badge: 'INTELLIGENT AGENTS',
    prompt: 'Synthesize complex workflows into autonomous, grounded AI processing pipelines',
    metrics: [
      { label: 'Token Efficiency', value: '+4.2x' },
      { label: 'Accuracy', value: '99.6%', accent: true },
      { label: 'Execution', value: 'Realtime' },
    ],
    steps: [
      {
        icon: Cpu,
        title: 'LLM Orchestration & Reasoning',
        subtitle: 'Multi-agent coordination with structured JSON tool validation',
        tag: 'Next-Gen Models',
        status: 'Active Agent'
      },
      {
        icon: Zap,
        title: 'Autonomous Data Processing',
        subtitle: 'Automated invoice, document, and pipeline classification',
        tag: 'Zero Manual Friction',
        status: 'Streaming'
      },
      {
        icon: Lock,
        title: 'Private & Secure Inference',
        subtitle: 'Enterprise data confidentiality with strict non-retention',
        tag: 'Bank-Grade NDA',
        status: 'Encrypted'
      }
    ]
  }
];

export default function HeroPlatformShowcase({ className = '' }: HeroPlatformShowcaseProps) {
  const [activeMode, setActiveMode] = useState<ModeKey>('saas');
  const [isSimulating, setIsSimulating] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle interactive 3D mouse parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Run quick simulation sweep
  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  const current = MODES.find((m) => m.id === activeMode) || MODES[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full select-none perspective-1000 ${className}`}
    >
      {/* Vaboulus Ambient Atmosphere Lighting */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-[#FF5C00]/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute -bottom-16 -right-12 w-80 h-80 bg-indigo-600/12 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* Floating Pill Card 1: Top-Right Velocity Metric (Vaboulus Signature) */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 -right-2 sm:-right-5 z-30 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0E121E]/95 border border-white/[0.14] shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,92,0,0.18)] backdrop-blur-xl"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5C00] to-[#FF8526] flex items-center justify-center text-white shadow-md">
          <Zap className="w-4 h-4 fill-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-white tracking-tight">+340% Output</span>
            <span className="text-[10px] font-mono text-[#FF7A1A] font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Lift
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">High-Velocity Sprints</div>
        </div>
      </motion.div>

      {/* Floating Pill Card 2: Bottom-Left Security & IP Ownership (Vaboulus Signature) */}
      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-6 -left-2 sm:-left-5 z-30 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0E121E]/95 border border-white/[0.14] shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,92,0,0.15)] backdrop-blur-xl"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-white tracking-tight flex items-center gap-1">
            <span>100% IP Guarantee</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Zero Vendor Lock-in</div>
        </div>
      </motion.div>

      {/* MAIN CONSOLE WINDOW (Vaboulus Dark Frosted Surface) */}
      <motion.div
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        className="relative rounded-3xl bg-[#0A0D15]/95 border border-white/[0.12] hover:border-[#FF5C00]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,92,0,0.12)] backdrop-blur-2xl overflow-hidden transition-all duration-300"
      >
        {/* Top Control Room Bar (Mac Glass Style) */}
        <div className="px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between gap-3">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/40" />
            <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#FF5C00]" />
              sarohub.engine.sh
            </span>
          </div>

          {/* Interactive Mode Switcher Tabs */}
          <div className="flex items-center bg-[#07090F] border border-white/[0.08] rounded-xl p-1 gap-1">
            {MODES.map((mode) => {
              const isActive = mode.id === activeMode;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>

          {/* Simulate Refresh Button */}
          <button
            type="button"
            onClick={triggerSimulation}
            title="Simulate architecture compilation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-[#FF5C00]' : ''}`} />
          </button>
        </div>

        {/* Live Simulation Banner Strip */}
        <div className="px-5 py-2.5 bg-[#080B13] border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]" />
            </span>
            <span className="text-[#FF7A1A] font-bold tracking-wider uppercase text-[10px]">
              {current.badge}
            </span>
          </div>
          <div className="text-slate-400 flex items-center gap-3">
            <span className="hidden sm:inline text-slate-500">Node: GB-HQ-01</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> High Availability
            </span>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Active Prompt Directive Simulation */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-3.5 flex items-start gap-3 relative overflow-hidden group">
            <div className="w-7 h-7 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/30 flex items-center justify-center text-[#FF5C00] shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono uppercase text-[#FF5C00] tracking-wider mb-0.5 flex items-center justify-between">
                <span>Direct Client &amp; Venture Objective</span>
                <span className="text-slate-500 text-[9px]">Execution: Instant</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-sans font-medium leading-relaxed">
                "{current.prompt}"
              </p>
            </div>
            {/* Subtle glow ray across card */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          {/* 3 Live Architecture Flow Nodes */}
          <div className="space-y-2.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5"
              >
                {current.steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-[#0E121E]/80 border border-white/[0.06] hover:border-[#FF5C00]/40 hover:bg-[#121626] transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-[#FF5C00]/40 group-hover:bg-[#FF5C00]/10 flex items-center justify-center text-slate-300 group-hover:text-[#FF5C00] transition-colors shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white tracking-tight group-hover:text-[#FF7A1A] transition-colors truncate">
                            {step.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {step.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-3">
                        <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-300 font-medium">
                          {step.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Live Telemetry Metrics Strip */}
          <div className="pt-3 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center">
            {current.metrics.map((metric, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className={`text-sm sm:text-base font-bold font-mono ${metric.accent ? 'text-[#FF5C00]' : 'text-white'}`}>
                  {metric.value}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Subtle Bottom Glow Line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FF5C00]/60 to-transparent" />
      </motion.div>
    </div>
  );
}
