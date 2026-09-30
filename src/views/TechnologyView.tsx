import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Server, Smartphone, Database, Cpu, Cloud, 
  CheckCircle2, ArrowRight, ShieldCheck, Layers 
} from 'lucide-react';
import { api } from '../api';
import { TechStackItem } from '../types';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

const CATEGORY_ICONS: { [key: string]: any } = {
  Frontend: Code,
  Backend: Server,
  Mobile: Smartphone,
  Databases: Database,
  'AI / Automation': Cpu,
  'Cloud / DevOps': Cloud
};

const DEFAULT_CATEGORIES = [
  'Frontend',
  'Backend',
  'Mobile',
  'Databases',
  'AI / Automation',
  'Cloud / DevOps'
];

export default function TechnologyView() {
  const [techItems, setTechItems] = useState<TechStackItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTechStack()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTechItems(data.filter(t => t.active));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...DEFAULT_CATEGORIES];

  const filteredItems = selectedCategory === 'All'
    ? techItems
    : techItems.filter(t => t.category === selectedCategory);

  const groupedByCategory: { [cat: string]: TechStackItem[] } = {};
  filteredItems.forEach(item => {
    const cat = item.category || 'Other';
    if (!groupedByCategory[cat]) groupedByCategory[cat] = [];
    groupedByCategory[cat].push(item);
  });

  return (
    <div className="relative min-h-screen bg-[#08090E] text-white">
      <SEOHead
        title="Technology Stack & Architecture | SaroHub Technologies"
        description="Our modern engineering stack spans React, Next.js, Node.js, Python, PostgreSQL, Flutter, Docker, AWS, and enterprise AI models."
      />

      {/* Hero Header */}
      <div className="py-20 lg:py-28 border-b border-white/[0.08] text-center bg-[#0A0D15] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[{ label: 'Technology', path: '/technology' }]} />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-4 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Core Engineering Stack &amp; Standards
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-white mb-6 leading-tight font-display">
            Built on <span className="italic text-[#FF5C00]">Battle-Tested Technologies</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal mb-10">
            We build with modern, scalable, and secure technologies chosen for real-world reliability, type safety, performance, and long-term maintainability.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] border-[#FFA566]/30 text-white font-bold shadow-[0_0_15px_rgba(255,92,0,0.4)]'
                    : 'bg-[#141828] border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Grid grouped by Category */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 space-y-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-40 rounded-3xl border border-white/[0.08] bg-[#0E121E] animate-pulse"
              />
            ))}
          </div>
        ) : Object.keys(groupedByCategory).length > 0 ? (
          Object.entries(groupedByCategory).map(([category, items]) => {
            const Icon = CATEGORY_ICONS[category] || Code;

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                  <div className="size-9 rounded-xl bg-[#141A2E] border border-white/10 flex items-center justify-center text-[#FF5C00] shadow-xs">
                    <Icon className="size-4 stroke-[1.8]" />
                  </div>
                  <h2 className="text-2xl font-normal -tracking-[0.5px] text-white">
                    {category}
                  </h2>
                  <span className="text-xs font-mono text-slate-400 ml-auto">
                    {items.length} {items.length === 1 ? 'framework' : 'frameworks'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 transition-all duration-200 flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF7A1A] block mb-3 font-semibold">
                          {tech.category}
                        </span>
                        <h3 className="text-lg font-normal text-white mb-2">
                          {tech.name}
                        </h3>
                        {tech.description && (
                          <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            {tech.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400 font-mono text-xs uppercase">
            No technologies found in this category.
          </div>
        )}
      </div>

      {/* Architectural Principles */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-t border-white/[0.08]">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-8 sm:p-14 lg:p-16 shadow-2xl">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block font-semibold">
              Engineering Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-white mb-4">
              How We Choose and Maintain Our Stack
            </h2>
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              We do not chase transient tech fads. Every library, database, and cloud framework in our stack is vetted against four core engineering principles:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Strict Type Safety',
                desc: 'TypeScript across front-end and back-end ensures fewer runtime bugs and seamless refactoring.'
              },
              {
                title: 'Relational Integrity',
                desc: 'PostgreSQL-first architecture provides ACID compliance and structured relational schemas.'
              },
              {
                title: 'Practical AI Grounding',
                desc: 'Targeted integration of Gemini and OpenAI models for real automation rather than gimmicks.'
              },
              {
                title: 'Low Operational Burn',
                desc: 'Dockerized microservices and edge CDNs maximize throughput while minimizing cloud costs.'
              }
            ].map((principle, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/[0.08] bg-[#141A2E] shadow-sm">
                <CheckCircle2 className="size-5 text-[#FF5C00] mb-3" />
                <h3 className="text-sm font-semibold text-white mb-2">
                  {principle.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              id="tech-cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white font-mono text-xs uppercase tracking-wider transition-all font-bold border border-[#FFA566]/30 cursor-pointer"
            >
              <RollText>DISCUSS YOUR TECHNICAL REQUIREMENTS</RollText>
              <DiagonalArrow size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
