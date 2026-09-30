import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Globe, Cpu, Code, ArrowRight, X, CheckCircle2, 
  Layers, MessageSquare, ChevronRight, HelpCircle,
  Palette, PenTool, TrendingUp, Smartphone, ShoppingBag, Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface ServicesProps {
  services: any[];
}

const fallbackServices = [
  {
    id: 1,
    title: 'Custom Software Development',
    slug: 'custom-software',
    category: 'Enterprise Engineering',
    banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Enterprise architecture, bespoke software systems, and high-performance workflow platforms tailored to your business operations.',
    description: 'We build custom software systems designed around your unique operational needs. From internal management portals to automated workflow engines, our applications are reliable, secure, and built to scale with your business.',
    benefits: [
      'Tailored to your exact business logic and workflows',
      'Scalable architecture built for reliable performance',
      'Seamless integration with third-party APIs and services',
      'Clean code standards with full documentation and support'
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Google Cloud'],
    faqs: [
      {
        question: 'How do you ensure the software meets our requirements?',
        answer: 'We begin with structured scoping and prototyping, followed by regular milestone reviews and transparent communication throughout development.'
      }
    ]
  },
  {
    id: 2,
    title: 'Web Application Development',
    slug: 'web-development',
    category: 'Web Engineering',
    banner_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Fast, secure, responsive web applications engineered with modern frontend frameworks, server-side APIs, and microservices.',
    description: 'We engineer high-performance web applications that combine snappy user interfaces with resilient backend architectures. Built with React, TypeScript, and modern API protocols.',
    benefits: [
      'Sub-second page rendering and high Lighthouse performance scores',
      'Responsive, ergonomic user interfaces optimized across all viewports',
      'Role-based access control and encrypted session management',
      'SEO-friendly semantic markup and Core Web Vitals optimization'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
    faqs: [
      {
        question: 'Can you modernize our existing web portal or rewrite legacy code?',
        answer: 'Yes. We perform architectural audits, modernize legacy codebases, and migrate monolithic applications to high-velocity modern tech stacks.'
      }
    ]
  },
  {
    id: 3,
    title: 'Mobile App Development',
    slug: 'mobile-development',
    category: 'Mobile Solutions',
    banner_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Native & cross-platform iOS and Android mobile apps crafted with fluid animations, offline synchronization, and push notifications.',
    description: 'We design and develop high-performance mobile applications that users love. Leveraging modern frameworks like React Native and Flutter, we deliver synchronized multi-platform applications.',
    benefits: [
      'Native-grade 60fps performance on both iOS and Android',
      'Offline caching and resilient local data synchronization',
      'Deep device API integration: Biometrics, GPS, Camera, Push Alerts',
      'App Store and Google Play compliance and deployment handling'
    ],
    technologies: ['React Native', 'Flutter', 'TypeScript', 'iOS', 'Android', 'Firebase'],
    faqs: [
      {
        question: 'Do you build for both iOS and Android simultaneously?',
        answer: 'Yes. Our cross-platform engineering approach allows up to 90% shared business logic between iOS and Android, dramatically reducing cost and time-to-market.'
      }
    ]
  },
  {
    id: 4,
    title: 'SaaS Product Development',
    slug: 'saas-development',
    category: 'Cloud Products',
    banner_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Multi-tenant cloud subscription products with automated billing, tenant isolation, scalable database clusters, and admin portals.',
    description: 'We architect and build end-to-end Software-as-a-Service (SaaS) products, including multi-tenant databases, Stripe billing integrations, organization management, and cloud infrastructure.',
    benefits: [
      'Secure multi-tenant data architecture and role permissions',
      'Automated subscription billing, invoicing, and customer onboarding',
      'High-availability cloud hosting with automated database backups',
      'Modular code structure ready for rapid feature releases'
    ],
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Stripe', 'Google Cloud', 'Docker', 'Redis'],
    faqs: [
      {
        question: 'Can you help turn our product concept into a launchable SaaS MVP?',
        answer: 'Yes. We handle everything from tenant schema design and UI/UX flows to automated subscription billing and production deployment.'
      }
    ]
  },
  {
    id: 5,
    title: 'AI & Workflow Automation',
    slug: 'ai-automation',
    category: 'Applied AI',
    banner_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Generative AI integrations, intelligent document extraction, LLM agents, and custom workflow automations that eliminate manual tasks.',
    description: 'We help businesses harness practical artificial intelligence. From automated invoice processing and customer support copilot systems to custom LLM agents and data extraction pipelines.',
    benefits: [
      'Save hundreds of manual staff hours with intelligent data extraction',
      'Integrate state-of-the-art LLMs securely into your business data pipeline',
      'Custom fine-tuned workflows for CRM, ERP, and support triage',
      'Enterprise security controls with strict data confidentiality'
    ],
    technologies: ['Python', 'OpenAI', 'Gemini API', 'LangChain', 'FastAPI', 'PostgreSQL'],
    faqs: [
      {
        question: 'Is our sensitive company data safe with AI integrations?',
        answer: 'Yes. We prioritize strict enterprise data isolation, zero-retention API policies, and local vector embeddings to ensure your private data is never used for model training.'
      }
    ]
  },
  {
    id: 6,
    title: 'UI/UX Design & Product Strategy',
    slug: 'ui-ux-design',
    category: 'Design Systems',
    banner_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'User-centered design systems, interactive Figma prototypes, wireframing, and conversion-optimized software interfaces.',
    description: 'Exceptional software begins with intuitive design. We craft cohesive design systems, click-through wireframes, and ergonomic component libraries that elevate user adoption and retention.',
    benefits: [
      'Comprehensive Figma component libraries and production tokens',
      'User journey mapping, low/high-fidelity wireframes, and user testing',
      'Responsive design guidelines for desktop, tablet, and mobile',
      'Seamless handoff with pixel-perfect developer documentation'
    ],
    technologies: ['Figma', 'Design Systems', 'Prototyping', 'Tailwind CSS', 'Storybook'],
    faqs: [
      {
        question: 'Do you provide clickable prototypes before development starts?',
        answer: 'Always. We build interactive Figma prototypes so your stakeholders can test and validate all key user flows before a single line of production code is written.'
      }
    ]
  },
  {
    id: 7,
    title: 'Digital Growth & Marketing',
    slug: 'digital-marketing',
    category: 'Digital Growth',
    banner_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Strategic digital marketing, technical search engine optimization (SEO), paid acquisition, and B2B lead generation.',
    description: 'We help technology products and businesses scale their market presence. From technical search optimization and conversion architecture to targeted paid acquisition and systematic lead generation.',
    benefits: [
      'Technical SEO audits and search visibility architecture',
      'Targeted B2B and consumer lead generation funnels',
      'Data-driven paid campaign management and conversion tracking',
      'Continuous conversion rate optimization (CRO) and analytics'
    ],
    technologies: ['Technical SEO', 'Google Analytics 4', 'Paid Ads', 'CRO', 'Search Console'],
    faqs: [
      {
        question: 'How does SaroHub approach digital growth?',
        answer: 'We treat growth as engineering: measurable data pipelines, clean conversion funnels, and performance marketing backed by real technical execution.'
      }
    ]
  }
];

const parseArrayField = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field.filter(Boolean);
  if (typeof field === 'string') {
    const trimmed = field.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch { /* ignore */ }
    }
    return trimmed.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
  }
  return [];
};

export default function OurServices({ services }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null);
    };

    if (selectedService) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService]);

  const displayServices = services && services.length > 0 ? services : fallbackServices;

  const categoryFilters = [
    { id: 'all', label: 'All Services' },
    { id: 'software', label: 'Software Development' },
    { id: 'ai', label: 'AI & Automation' },
    { id: 'design', label: 'Product & Design' },
    { id: 'growth', label: 'Digital Growth' }
  ];

  const matchesCategory = (item: any, catId: string) => {
    if (catId === 'all') return true;
    const text = `${item.title || ''} ${item.category || ''} ${item.slug || ''}`.toLowerCase();
    if (catId === 'software') {
      return text.includes('software') || text.includes('web') || text.includes('mobile') || text.includes('saas') || text.includes('crm') || text.includes('commerce') || text.includes('engineering');
    }
    if (catId === 'ai') {
      return text.includes('ai') || text.includes('automation') || text.includes('workflow') || text.includes('agent');
    }
    if (catId === 'design') {
      return text.includes('ui') || text.includes('ux') || text.includes('design') || text.includes('product') || text.includes('prototyp') || text.includes('brand');
    }
    if (catId === 'growth') {
      return text.includes('growth') || text.includes('marketing') || text.includes('seo') || text.includes('ads') || text.includes('lead');
    }
    return true;
  };

  const filteredServices = displayServices.filter(item => matchesCategory(item, activeCategory));

  return (
    <section id="services" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white">
              Our <span className="italic text-[#FF5C00]">Services</span>
            </h2>
          </div>

          <Link
            to="/contact"
            className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0 border border-[#FFA566]/30"
          >
            <RollText>BOOK CONSULTATION</RollText>
            <DiagonalArrow size={18} />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categoryFilters.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer font-medium border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white border-[#FFA566]/30 shadow-[0_0_15px_rgba(255,92,0,0.4)]'
                    : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 3-Column Vaboulus Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((item, idx) => {
            const techList = parseArrayField(item.technologies);
            return (
              <motion.article
                key={item.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-6 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3 uppercase">
                    <span className="text-[#FF7A1A] font-bold">0{idx + 1} / SERVICE</span>
                    <span className="font-semibold text-slate-400">{item.category || 'Engineering'}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5 group-hover:text-[#FF7A1A] transition-colors tracking-tight">
                    <Link to={`/services/${item.slug || item.id}`}>
                      {item.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-400 mb-5 leading-relaxed line-clamp-3 font-normal">
                    {item.short_description || item.description}
                  </p>

                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {techList.slice(0, 4).map((tech, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 bg-white/[0.04] border border-white/10 text-slate-300 text-[11px] font-mono font-medium rounded-md shadow-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedService(item)}
                    className="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    Quick View
                  </button>

                  <Link
                    to={`/services/${item.slug || item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#FF5C00] group-hover:text-[#FFA043] font-bold"
                  >
                    <span>Full Details</span>
                    <span className="transition-transform group-hover:translate-x-1 font-sans">&rarr;</span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#0E121E] border border-white/[0.12] text-white shadow-2xl z-10 p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block mb-1">
                    {selectedService.category || 'Service'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/[0.08]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-base text-slate-300 leading-relaxed mb-6 font-normal">
                {selectedService.description || selectedService.short_description}
              </p>

              {selectedService.benefits && selectedService.benefits.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-mono text-xs uppercase text-[#FF5C00] tracking-wider mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {selectedService.benefits.map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-6 border-t border-white/[0.08] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-6 py-2.5 rounded-full border border-white/[0.1] text-xs font-mono uppercase tracking-wider text-slate-300 hover:bg-white/[0.06] cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to={`/services/${selectedService.slug || selectedService.id}`}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white text-xs font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all font-semibold"
                >
                  Full Service Page &rarr;
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
