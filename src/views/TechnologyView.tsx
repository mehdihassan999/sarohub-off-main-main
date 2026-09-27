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
    <div className="relative min-h-screen bg-white">
      <SEOHead
        title="Technology Stack & Architecture | SaroHub Technologies"
        description="Our modern engineering stack spans React, Next.js, Node.js, Python, PostgreSQL, Flutter, Docker, AWS, and enterprise AI models."
      />

      {/* Hero Header - NexStudio Style */}
      <div className="py-20 lg:py-28 border-b border-gray-200 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[{ label: 'Technology', path: '/technology' }]} />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
            Core Engineering Stack &amp; Standards
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black mb-6 leading-tight">
            Built on <span className="italic">Battle-Tested Technologies</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal mb-10">
            We build with modern, scalable, and secure technologies chosen for real-world reliability, type safety, performance, and long-term maintainability.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                className="h-40 rounded-3xl border border-gray-200 bg-[#FBFBFB] animate-pulse"
              />
            ))}
          </div>
        ) : Object.keys(groupedByCategory).length > 0 ? (
          Object.entries(groupedByCategory).map(([category, items]) => {
            const Icon = CATEGORY_ICONS[category] || Code;

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <div className="size-9 rounded-xl bg-[#FBFBFB] border border-gray-200 flex items-center justify-center text-black">
                    <Icon className="size-4 stroke-[1.8]" />
                  </div>
                  <h2 className="text-2xl font-normal -tracking-[0.5px] text-black">
                    {category}
                  </h2>
                  <span className="text-xs font-mono text-gray-400 ml-auto">
                    {items.length} {items.length === 1 ? 'framework' : 'frameworks'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-7 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-3">
                          {tech.category}
                        </span>
                        <h3 className="text-lg font-normal text-black mb-2">
                          {tech.name}
                        </h3>
                        {tech.description && (
                          <p className="text-xs text-gray-600 leading-relaxed font-normal">
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
          <div className="text-center py-20 text-gray-500 font-mono text-xs uppercase">
            No technologies found in this category.
          </div>
        )}
      </div>

      {/* Architectural Principles */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-t border-gray-200">
        <div className="rounded-3xl border border-gray-200 bg-[#FBFBFB] p-8 sm:p-14 lg:p-16">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Engineering Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1px] text-black mb-4">
              How We Choose and Maintain Our Stack
            </h2>
            <p className="text-base text-gray-600 leading-relaxed font-normal">
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
              <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-white">
                <CheckCircle2 className="size-5 text-black mb-3" />
                <h3 className="text-sm font-semibold text-black mb-2">
                  {principle.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              id="tech-cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black hover:bg-gray-800 text-white font-mono text-xs uppercase tracking-wider transition-all"
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
