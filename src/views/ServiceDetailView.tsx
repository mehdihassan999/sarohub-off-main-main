import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, Zap, Check, HelpCircle, 
  Send, Mail, Plus, Minus, Star, TrendingUp
} from 'lucide-react';
import { getServiceBySlug, ServiceData } from '../data/seoContent';
import { getAllClientProjects } from '../data/clientProjectsData';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { api } from '../api';
import ClientProjectCard from '../components/home/ClientProjectCard';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';

export default function ServiceDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const [dbService, setDbService] = useState<any | null>(null);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndices, setOpenFaqIndices] = useState<Set<number>>(new Set([0]));

  const cleanSlug = (slug || '').toLowerCase().trim().replace(/^\/|\/$/g, '');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [services, projects] = await Promise.all([
          api.getServices().catch(() => []),
          api.getProjects().catch(() => [])
        ]);
        if (!isMounted) return;

        if (Array.isArray(projects) && projects.length > 0) {
          setDbProjects(projects);
        }

        const found = services.find((s: any) => {
          if (!s) return false;
          if (String(s.id) === cleanSlug) return true;
          if (s.slug && s.slug.toLowerCase() === cleanSlug) return true;

          const normDb = (s.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const normTarget = cleanSlug.replace(/[^a-z0-9]/g, '');
          if (normDb && normTarget && normDb === normTarget) return true;

          const aliasPairs = [
            ['custom-software', 'custom-software-development'],
            ['mobile-development', 'mobile-app-development'],
            ['ecommerce-platforms', 'ecommerce-development'],
            ['crm', 'crm-development'],
            ['digital-solutions', 'digital-solutions-cloud-systems'],
            ['business-automation', 'business-process-automation']
          ];

          for (const [a, b] of aliasPairs) {
            if ((s.slug === a && cleanSlug === b) || (s.slug === b && cleanSlug === a)) {
              return true;
            }
          }

          if (s.slug && (cleanSlug.includes(s.slug) || s.slug.includes(cleanSlug))) {
            return true;
          }

          return false;
        });

        if (found) {
          setDbService(found);
        }
      } catch (err) {
        console.error('Failed to load dynamic service from API', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    const handleDataUpdated = () => {
      loadData();
    };

    window.addEventListener('sarohub-data-updated', handleDataUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener('sarohub-data-updated', handleDataUpdated);
    };
  }, [cleanSlug]);

  const baseBlueprint = getServiceBySlug(cleanSlug) || (dbService?.slug ? getServiceBySlug(dbService.slug) : undefined);

  if (!loading && !baseBlueprint && !dbService) {
    return <Navigate to="/services" replace />;
  }

  if (loading && !baseBlueprint && !dbService) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  const computedShortTitle = dbService?.short_title || dbService?.title?.split(' ')[0] || baseBlueprint?.shortTitle || 'Engineering';
  const activeHeroHeadline = dbService?.hero_headline || baseBlueprint?.heroHeadline || `Enterprise ${dbService?.title || 'Software Engineering'}`;

  const activeProblemsSolved: string[] = (Array.isArray(dbService?.problems_solved) && dbService.problems_solved.length > 0)
    ? dbService.problems_solved
    : (Array.isArray(dbService?.problemsSolved) && dbService.problemsSolved.length > 0
      ? dbService.problemsSolved
      : (baseBlueprint?.problemsSolved && baseBlueprint.problemsSolved.length > 0
        ? baseBlueprint.problemsSolved
        : [
            'Legacy architectural bottlenecks restricting feature deployment velocity.',
            'Fragmented data silos preventing automated business intelligence.',
            'Lack of scalable cloud infrastructure during peak transactional spikes.',
            'Security vulnerabilities and absence of enterprise access control.'
          ]));

  const activeTargetAudience: string[] = (Array.isArray(dbService?.target_audience) && dbService.target_audience.length > 0)
    ? dbService.target_audience
    : (Array.isArray(dbService?.targetAudience) && dbService.targetAudience.length > 0
      ? dbService.targetAudience
      : (baseBlueprint?.targetAudience && baseBlueprint.targetAudience.length > 0
        ? baseBlueprint.targetAudience
        : [
            'High-growth venture-backed startups scaling their engineering teams.',
            'Mid-market enterprises modernizing on-premise legacy platforms.',
            'Government ministries and civic organizations needing secure portals.',
            'Digital agencies requiring dedicated white-label engineering squads.'
          ]));

  const activeCapabilities: Array<{ title: string; description: string }> = (Array.isArray(dbService?.capabilities) && dbService.capabilities.length > 0)
    ? dbService.capabilities
    : (baseBlueprint?.capabilities && baseBlueprint.capabilities.length > 0
      ? baseBlueprint.capabilities
      : [
          { title: 'Cloud-Native Architecture', description: 'Fault-tolerant microservices deployed across AWS, GCP, or Azure with auto-scaling.' },
          { title: 'Security & Access Control', description: 'Role-based authorization (RBAC), end-to-end data encryption, and audit logs.' },
          { title: 'API & Systems Integration', description: 'Custom RESTful, GraphQL, and webhook pipelines connecting payment, CRM, and ERPs.' }
        ]);

  const activeTechnologies: string[] = (Array.isArray(dbService?.technologies) && dbService.technologies.length > 0)
    ? dbService.technologies
    : (baseBlueprint?.technologies && baseBlueprint.technologies.length > 0
      ? baseBlueprint.technologies
      : ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS']);

  const activeBusinessBenefits: Array<{ metric: string; label: string; description: string }> = (Array.isArray(dbService?.business_benefits) && dbService.business_benefits.length > 0)
    ? dbService.business_benefits
    : ((Array.isArray(dbService?.businessBenefits) && dbService.businessBenefits.length > 0)
      ? dbService.businessBenefits
      : (baseBlueprint?.businessBenefits && baseBlueprint.businessBenefits.length > 0
        ? baseBlueprint.businessBenefits
        : [
            { metric: '99.99%', label: 'Infrastructure Availability', description: 'Fault-tolerant deployment ensures reliable continuous uptime.' },
            { metric: '3x', label: 'Velocity Multiplier', description: 'Accelerate feature deployment and customer onboarding cycles.' },
            { metric: '100%', label: 'Source Code Ownership', description: 'Full commercial IP transfer and complete technical documentation.' }
          ]));

  const activeProcessSteps: Array<{ step: string; title: string; description: string }> = (Array.isArray(dbService?.process_steps) && dbService.process_steps.length > 0)
    ? dbService.process_steps
    : ((Array.isArray(dbService?.processSteps) && dbService.processSteps.length > 0)
      ? dbService.processSteps
      : (baseBlueprint?.processSteps && baseBlueprint.processSteps.length > 0
        ? baseBlueprint.processSteps
        : [
            { step: '01', title: 'Technical Discovery & Scoping', description: 'Map workflows, user personas, database schemas, and integration dependencies.' },
            { step: '02', title: 'System Architecture & UI/UX', description: 'Produce clickable wireframes, component design systems, and API contracts.' },
            { step: '03', title: 'Sprint Engineering & CI/CD', description: 'Build in rapid 2-week milestones with automated regression testing.' },
            { step: '04', title: 'Security Auditing & Hardening', description: 'Perform penetration scans, stress testing, and staging environment verification.' },
            { step: '05', title: 'Production Cutover & SLA Support', description: 'Zero-downtime deployment, DNS provisioning, and continuous maintenance.' }
          ]));

  const activeFaqs: Array<{ question: string; answer: string }> = (Array.isArray(dbService?.faqs) && dbService.faqs.length > 0)
    ? dbService.faqs
    : (baseBlueprint?.faqs && baseBlueprint.faqs.length > 0
      ? baseBlueprint.faqs
      : [
          {
            question: `How quickly can SaroHub begin discovery on a ${computedShortTitle} project?`,
            answer: 'We initiate scoping sessions within 48 hours of initial consultation and typically deliver an architectural roadmap and milestone timeline within 3 to 5 business days.'
          },
          {
            question: 'Do we retain full ownership of the source code and IP?',
            answer: 'Yes. All intellectual property, source repositories, deployment keys, and database schemas are 100% owned by your organization upon project completion.'
          },
          {
            question: 'What post-launch SLA and maintenance support is provided?',
            answer: 'We provide structured post-deployment warranty support, 24/7 server monitoring, proactive security updates, and dedicated engineering retainers for continuous feature iterations.'
          }
        ]);

  const activeService: ServiceData = {
    slug: dbService?.slug || baseBlueprint?.slug || cleanSlug,
    title: dbService?.title || baseBlueprint?.title || 'Software Engineering Service',
    shortTitle: computedShortTitle,
    metaTitle: dbService?.meta_title || baseBlueprint?.metaTitle || `${dbService?.title || 'Engineering Service'} | SaroHub Technologies`,
    metaDescription: dbService?.meta_description || dbService?.short_description || baseBlueprint?.metaDescription || dbService?.description || 'Custom engineering solutions built by SaroHub Technologies.',
    category: dbService?.category || baseBlueprint?.category || 'Software Engineering',
    heroHeadline: activeHeroHeadline,
    heroSubheadline: dbService?.short_description || baseBlueprint?.heroSubheadline || dbService?.description || 'Scalable architecture, reliable development, and seamless integrations.',
    iconName: baseBlueprint?.iconName || 'Code',
    bannerImage: dbService?.banner_url || baseBlueprint?.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200&h=600',
    overview: dbService?.description || baseBlueprint?.overview || dbService?.short_description || 'We engineer high-reliability digital solutions tailored to modern organizational demands.',
    problemsSolved: activeProblemsSolved,
    targetAudience: activeTargetAudience,
    capabilities: activeCapabilities,
    businessBenefits: activeBusinessBenefits,
    technologies: activeTechnologies,
    processSteps: activeProcessSteps,
    relevantProjectSlugs: baseBlueprint?.relevantProjectSlugs || ['waziri-mobile', 'vanguard-erp-systems', 'the-crescent-resorts'],
    relatedServiceSlugs: baseBlueprint?.relatedServiceSlugs || ['web-development', 'custom-software-development', 'saas-development', 'digital-solutions'],
    faqs: activeFaqs
  };

  const relatedProjects = useMemo(() => {
    const fallbackList = getAllClientProjects();
    const mergedList = fallbackList.map((f) => {
      const match = dbProjects.find(
        (p) => (p.slug && f.slug === p.slug) || (p.title && f.title.toLowerCase() === (p.title || '').toLowerCase())
      );
      if (match) {
        const adminThumb = 
          (typeof match.thumbnail_url === 'string' && match.thumbnail_url.trim().length > 0 && match.thumbnail_url.trim()) ||
          (Array.isArray(match.screenshots) && match.screenshots.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
          (Array.isArray(match.gallery) && match.gallery.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
          (typeof match.image === 'string' && match.image.trim().length > 0 && match.image.trim()) ||
          (typeof match.image_url === 'string' && match.image_url.trim().length > 0 && match.image_url.trim());
        const finalThumb = adminThumb || f.thumbnail_url;
        return {
          ...f,
          ...match,
          thumbnail_url: finalThumb,
          image: finalThumb,
          image_url: finalThumb
        };
      }
      return f;
    });

    const target = cleanSlug.toLowerCase();

    const filtered = mergedList.filter((p: any) => {
      const cat = (p.category || '').toLowerCase();
      const type = (p.project_type || '').toLowerCase();
      const secs = Array.isArray(p.secondary_categories) ? p.secondary_categories.map((s: string) => s.toLowerCase()) : [];

      if (target.includes('market') || target.includes('growth') || target.includes('seo')) {
        return cat.includes('market') || secs.some(s => s.includes('market'));
      }
      if (target.includes('ecommerce') || target.includes('commerce')) {
        return cat.includes('commerce') || cat.includes('retail') || secs.some(s => s.includes('commerce'));
      }
      if (target.includes('mobile')) {
        return type.includes('mobile') || type.includes('app') || secs.some(s => s.includes('app'));
      }
      if (target.includes('custom') || target.includes('software')) {
        return cat.includes('software') || cat.includes('saas');
      }
      return cat.includes(target) || type.includes(target);
    });

    if (filtered.length > 0) return filtered;
    return mergedList.slice(0, 2);
  }, [cleanSlug]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const structuredData = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: activeService.title,
      description: activeService.overview,
      provider: {
        '@type': 'Organization',
        name: 'SaroHub Technologies (Private) Limited',
        url: 'https://sarohub.com'
      },
      areaServed: 'Worldwide',
      serviceType: activeService.category,
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        price: 'Contact for Architecture & Scoping'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: activeService.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  ], [activeService.title, activeService.overview, activeService.category, activeService.faqs]);

  return (
    <div className="min-h-screen bg-[#08090E] text-white">
      <SEOHead
        title={activeService.metaTitle}
        description={activeService.metaDescription}
        canonicalUrl={`https://sarohub.com/services/${activeService.slug}`}
        ogType="website"
        ogImage={activeService.bannerImage}
        structuredData={structuredData}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-white/[0.08] bg-[#0A0D15]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Services', url: '/services' },
              { name: activeService.shortTitle, url: `/services/${activeService.slug}`, isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-slate-300">
            Active Enterprise Blueprint
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                {activeService.category}
              </span>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-white leading-tight font-display">
                {activeService.heroHeadline}
              </h1>
              
              <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
                {activeService.heroSubheadline}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={`/contact?service=${encodeURIComponent(activeService.title)}`}
                  className="group px-8 py-4 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold -tracking-[0.2px] leading-5 text-white rounded-full hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] transition-all duration-300 border border-[#FFA566]/30 font-bold"
                >
                  <RollText>REQUEST TECHNICAL SCOPING</RollText>
                  <DiagonalArrow size={18} />
                </Link>
                
                <a
                  href="#capabilities"
                  className="px-6 py-4 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] hover:border-[#FF5C00]/50 text-xs font-mono uppercase tracking-wider text-white transition-all font-semibold"
                >
                  Explore Capabilities
                </a>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.08]">
                {activeService.businessBenefits.map((b, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#0E121E] border border-white/[0.08] shadow-md">
                    <span className="block text-2xl sm:text-3xl font-normal text-white mb-1">
                      {b.metric}
                    </span>
                    <span className="block text-xs font-mono uppercase text-[#FF7A1A] line-clamp-1 font-bold">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Image */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0E121E] shadow-2xl">
                <img
                  src={activeService.bannerImage}
                  alt={`${activeService.title} architectural blueprint`}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="p-6 border-t border-white/[0.08]">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block mb-1 font-bold">
                    Enterprise Engineering SLA
                  </span>
                  <p className="text-sm text-slate-300 font-normal">
                    Production-grade software engineering, secure tenant data isolation, and verified operational benchmarks.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Service Overview & Problem Solving */}
      <section className="py-20 lg:py-28 bg-[#08090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block font-semibold">
                Overview &amp; Context
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1.92px] text-white">
                What is <span className="italic text-[#FF5C00]">{activeService.title}?</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                {activeService.overview}
              </p>

              <div className="pt-4">
                <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-4">
                  Target Organizations &amp; Use Cases
                </h3>
                <ul className="space-y-3">
                  {activeService.targetAudience.map((audience, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-normal">
                      <Check className="size-4 text-[#FF5C00] shrink-0 mt-0.5" />
                      <span>{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#0E121E] shadow-xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] block mb-2 font-semibold">
                Operational Friction
              </span>
              <h3 className="text-2xl font-normal text-white mb-6">
                Bottlenecks We Eliminate
              </h3>
              
              <div className="space-y-4">
                {activeService.problemsSolved.map((problem, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#141A2E] border border-white/[0.08]">
                    <span className="font-mono text-sm font-bold text-[#FF5C00] shrink-0">
                      0{i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {problem}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block font-semibold">
              Engineering Matrix
            </span>
            <h2 className="text-4xl sm:text-5xl font-normal -tracking-[1.92px] text-white mb-4">
              Technical Capabilities &amp; <span className="italic text-[#FF5C00]">Architecture</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-normal">
              Modular, scalable components engineered to integrate into your existing tech stack with zero disruption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeService.capabilities.map((cap, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-[#0E121E] border border-white/[0.08] hover:border-[#FF5C00]/40 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="size-12 rounded-2xl bg-[#141A2E] border border-white/10 flex items-center justify-center text-[#FF5C00] mb-6 group-hover:scale-105 transition-transform shadow-xs">
                    <Zap className="size-5" />
                  </div>
                  <h3 className="text-xl font-normal text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies We Use */}
      <section className="py-16 bg-[#08090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-normal text-white">
                Technologies &amp; Frameworks Deployed
              </h3>
              <p className="text-xs font-mono uppercase text-slate-400 mt-1">
                Modern, reliable software engineering stacks prioritizing security &amp; speed
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {activeService.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-xs font-mono uppercase bg-[#0E121E] border border-white/10 text-slate-200 font-semibold shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Previous Work / Delivered Projects */}
      <section id="delivered-case-studies" className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-white/[0.08]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block font-semibold">
                Track Record &bull; Delivered Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-white">
                Previous {activeService.shortTitle} <span className="italic text-[#FF5C00]">Case Studies</span>
              </h2>
            </div>
            
            <Link
              to="/work"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-[#FF5C00] font-semibold transition-colors"
            >
              <span>View All Work &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProjects.map((proj: any, idx: number) => (
              <ClientProjectCard key={proj.id || idx} project={proj} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="py-20 lg:py-28 bg-[#08090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block font-semibold">
              Delivery Methodology
            </span>
            <h2 className="text-4xl sm:text-5xl font-normal -tracking-[1.92px] text-white">
              Our 5-Stage Engineering <span className="italic text-[#FF5C00]">Lifecycle</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {activeService.processSteps.map((step, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#0E121E] border border-white/[0.08] hover:border-[#FF5C00]/40 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <span className="font-mono text-3xl italic text-[#FF5C00] block mb-4 font-bold">
                    {step.step}
                  </span>
                  <h3 className="text-base font-normal text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 lg:py-28 bg-[#0A0D15] border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-3 block font-semibold">
              Technical FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-normal -tracking-[1.92px] text-white mb-4">
              Frequently Asked <span className="italic text-[#FF5C00]">Questions</span>
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Transparent answers covering architecture, device hardware, data privacy, and production SLAs.
            </p>
          </div>

          <div className="space-y-4">
            {activeService.faqs.map((faq, i) => {
              const isOpen = openFaqIndices.has(i);
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 transition-all overflow-hidden shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-6 cursor-pointer"
                  >
                    <span className="text-lg sm:text-xl font-normal text-white leading-snug">
                      {faq.question}
                    </span>
                    <span className="size-9 rounded-full bg-[#141A2E] border border-white/10 flex items-center justify-center shrink-0 transition-colors">
                      {isOpen ? <Minus className="size-4 text-[#FF5C00]" /> : <Plus className="size-4 text-white" />}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed font-normal border-t border-white/[0.08]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conversion CTA Footer */}
      <section className="py-20 lg:py-28 bg-[#08090E] text-center border-t border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[1.92px] text-white mb-4">
            Ready to Architect Your <span className="italic text-[#FF5C00]">{activeService.shortTitle}</span> Solution?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            Schedule an architectural scoping consultation with our engineering directors. We analyze your requirements and deliver a comprehensive technical roadmap.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/contact?service=${encodeURIComponent(activeService.title)}`}
              className="group px-8 py-4 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold -tracking-[0.2px] leading-5 text-white rounded-full hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] transition-all duration-300 border border-[#FFA566]/30 font-bold"
            >
              <RollText>SCHEDULE SCOPING SESSION</RollText>
              <DiagonalArrow size={18} />
            </Link>
            
            <a
              href="mailto:info@sarohub.com"
              className="px-8 py-4 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] hover:border-[#FF5C00]/50 text-xs font-mono uppercase tracking-wider text-white transition-all font-semibold"
            >
              info@sarohub.com
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
