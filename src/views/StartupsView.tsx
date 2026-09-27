import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Lightbulb, Compass, Palette, Code2, Send, TrendingUp, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Layers, Sparkles 
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

export default function StartupsView() {
  const processSteps = [
    {
      phase: '01',
      title: 'Idea Validation & Discovery',
      description: 'We deconstruct your concept, analyze user demand, define minimum viable functionality, and eliminate scope creep before writing code.',
      icon: Lightbulb
    },
    {
      phase: '02',
      title: 'Product Strategy & Architecture',
      description: 'We architect database schemas, API boundaries, third-party integrations, and cloud hosting for cost-efficiency during early traction.',
      icon: Compass
    },
    {
      phase: '03',
      title: 'UI/UX Prototype & Flow',
      description: 'Clickable high-fidelity wireframes that look and feel real. Test user workflows with early customers and stakeholders before build.',
      icon: Palette
    },
    {
      phase: '04',
      title: 'Agile MVP Development',
      description: 'Sprint-based engineering focusing on the core value proposition. Clean, testable TypeScript code built to pass technical due diligence.',
      icon: Code2
    },
    {
      phase: '05',
      title: 'Production Launch',
      description: 'Zero-downtime deployment, SSL certificates, error tracking, analytics telemetry, and onboarding funnels set up for initial cohort release.',
      icon: Send
    },
    {
      phase: '06',
      title: 'Scale & Iteration',
      description: 'Post-launch feedback loops, performance optimizations, database indexing, and feature expansion as you acquire paying customers.',
      icon: TrendingUp
    }
  ];

  const startupServices = [
    {
      title: 'Product Discovery',
      desc: 'Market alignment, technical feasibility, and feature prioritization.'
    },
    {
      title: 'MVP Development',
      desc: 'Rapid 6 to 8-week production builds ready for initial customers.'
    },
    {
      title: 'UI/UX Design',
      desc: 'Intuitive modern interfaces designed for frictionless customer adoption.'
    },
    {
      title: 'SaaS Development',
      desc: 'Multi-tenant architecture, Stripe billing, and team workspaces.'
    },
    {
      title: 'AI Integration',
      desc: 'Practical LLMs, intelligent embeddings, and automated workflows.'
    },
    {
      title: 'Technical Architecture',
      desc: 'Clean scalable codebases that survive growth and diligence.'
    },
    {
      title: 'Cloud Deployment',
      desc: 'Dockerized Linux/AWS setups optimized for low monthly burn.'
    },
    {
      title: 'Product Scaling',
      desc: 'Database optimization, caching layers, and throughput upgrades.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-white">
      <SEOHead
        title="Startups & MVP Engineering | From Idea to MVP | SaroHub Technologies"
        description="We partner with startup founders to turn ideas into scalable MVPs. Full-stack development, UI/UX, SaaS architecture, and launch strategy."
      />

      {/* Hero Header - NexStudio Style */}
      <div className="py-20 lg:py-28 border-b border-gray-200 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[{ label: 'Startups', path: '/startups' }]} />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
            Startup Engineering &amp; MVP Sprints
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black mb-6 leading-tight">
            From Idea to <span className="italic">Production MVP</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal mb-10">
            We partner with visionary founders to build production-ready digital products. We bring product strategy, robust engineering, and venture-building experience to turn your vision into a scalable reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=startup"
              id="startups-hero-cta"
              className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2"
            >
              <RollText>BUILD YOUR MVP</RollText>
              <DiagonalArrow size={16} />
            </Link>

            <Link
              to="/ventures"
              className="px-8 py-4 border border-gray-200 hover:border-black text-black font-mono text-xs uppercase tracking-wider rounded-full transition-all"
            >
              Explore In-House Ventures
            </Link>
          </div>
        </div>
      </div>

      {/* The 6-Stage Process */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b border-gray-200">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            The Startup Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] text-black mb-4">
            How We Take You From <span className="italic">Concept to Market</span>
          </h2>
          <p className="text-gray-600 text-base font-normal leading-relaxed">
            Building an MVP is not about cutting corners—it is about rigorous prioritization. Our 6-stage framework gets you to market swiftly while preserving clean architecture for future scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.phase}
                className="p-8 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center text-black">
                      <Icon className="size-5 stroke-[1.8]" />
                    </div>
                    <span className="text-2xl font-mono font-normal text-gray-400">
                      {step.phase}
                    </span>
                  </div>

                  <h3 className="text-xl font-normal -tracking-[0.5px] text-black mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services for Startups */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b border-gray-200">
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            Startup Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] text-black mb-4">
            Services Built for High-Growth Founders
          </h2>
          <p className="text-gray-600 text-base font-normal leading-relaxed">
            Everything your early-stage company needs under one roof. No juggling separate freelancers, designers, and DevOps engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {startupServices.map((srv, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black transition-all duration-200"
            >
              <div className="size-2 rounded-full bg-black mb-5" />
              <h3 className="text-lg font-normal text-black mb-2">
                {srv.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Founders Choose SaroHub */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-8 sm:p-14 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                The Founder Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-black">
                We Build Ventures Ourselves
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                Unlike outsourced dev shops that only charge for hours, SaroHub is an active venture builder. We develop and scale our own commercial software products. That means we treat your unit economics, customer acquisition friction, and cloud burn with the same seriousness we apply to our own ventures.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '100% IP & source code ownership transferred to you',
                  'Modular architecture that scales cleanly post-funding',
                  'Pragmatic AI features that provide real market differentiation',
                  'Flexible sprint arrangements designed around your runway'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 font-normal">
                    <CheckCircle2 className="size-4 text-black shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl border border-gray-200 bg-white text-center space-y-6 shadow-sm">
              <Sparkles className="size-10 text-black mx-auto" />
              <h3 className="text-2xl font-normal -tracking-[0.5px] text-black">
                Ready to Turn Your Idea Into Reality?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
                Book a confidential 30-minute discovery session with our senior technical leadership.
              </p>
              <Link
                to="/contact?type=startup"
                id="startups-box-cta"
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-black text-white hover:bg-gray-800 font-mono text-xs uppercase tracking-wider transition-all"
              >
                <RollText>BUILD YOUR MVP</RollText>
                <DiagonalArrow size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
