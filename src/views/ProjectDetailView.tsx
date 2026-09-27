import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, Globe, Calendar, Briefcase, Check,
  Quote, ChevronLeft, ChevronRight, X, ZoomIn, Cpu,
  Building2, Terminal, Server, Database, Code2, ShieldCheck, ExternalLink, CheckCircle2
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { api } from '../api';
import { 
  getClientProjectBySlug, getAllClientProjects, ClientProject 
} from '../data/clientProjectsData';
import { getCaseStudyBySlug } from '../data/seoContent';
import RollText from '../components/common/RollText';
import DiagonalArrow from '../components/common/DiagonalArrow';
import ClientProjectCard from '../components/home/ClientProjectCard';

export default function ProjectDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any | null>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [testimonial, setTestimonial] = useState<any | null>(null);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadProjectData() {
      if (!slug) return;
      
      const richStaticProject = getClientProjectBySlug(slug);
      let loadedProject: any = null;

      try {
        const [dbProject, projectsList] = await Promise.all([
          api.getProject(slug).catch(() => null),
          api.getProjects().catch(() => [])
        ]);

        if (isMounted && Array.isArray(projectsList) && projectsList.length > 0) {
          setAllProjects(projectsList);
        }

        if (dbProject) {
          const adminThumb = 
            (typeof dbProject.thumbnail_url === 'string' && dbProject.thumbnail_url.trim().length > 0 && dbProject.thumbnail_url.trim()) ||
            (Array.isArray(dbProject.screenshots) && dbProject.screenshots.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
            (Array.isArray(dbProject.gallery) && dbProject.gallery.find((s: any) => typeof s === 'string' && s.trim().length > 0)) ||
            (typeof dbProject.image === 'string' && dbProject.image.trim().length > 0 && dbProject.image.trim()) ||
            (typeof dbProject.image_url === 'string' && dbProject.image_url.trim().length > 0 && dbProject.image_url.trim());

          const resolvedThumb = adminThumb || richStaticProject?.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=675';

          const adminScreenshots = Array.isArray(dbProject.screenshots) && dbProject.screenshots.filter((s: any) => typeof s === 'string' && s.trim().length > 0).length > 0
            ? dbProject.screenshots.filter((s: any) => typeof s === 'string' && s.trim().length > 0)
            : (Array.isArray(dbProject.gallery) && dbProject.gallery.filter((s: any) => typeof s === 'string' && s.trim().length > 0).length > 0
                ? dbProject.gallery.filter((s: any) => typeof s === 'string' && s.trim().length > 0)
                : null);

          const resolvedScreenshots = adminScreenshots || richStaticProject?.screenshots || [resolvedThumb];

          loadedProject = richStaticProject 
            ? { 
                ...richStaticProject, 
                ...dbProject, 
                thumbnail_url: resolvedThumb, 
                image: resolvedThumb, 
                image_url: resolvedThumb, 
                screenshots: resolvedScreenshots, 
                gallery: resolvedScreenshots 
              } 
            : {
                ...dbProject,
                thumbnail_url: resolvedThumb,
                image: resolvedThumb,
                image_url: resolvedThumb,
                screenshots: resolvedScreenshots,
                gallery: resolvedScreenshots
              };
        }
      } catch (err) {
        console.warn('API getProject fallback to static client projects data:', err);
      }

      if (!loadedProject && richStaticProject) {
        loadedProject = richStaticProject;
      }

      if (!loadedProject) {
        const staticCaseStudy = getCaseStudyBySlug(slug || '');
        if (staticCaseStudy) {
          loadedProject = {
            title: staticCaseStudy.title,
            slug: staticCaseStudy.slug,
            client_name: staticCaseStudy.clientName,
            category: staticCaseStudy.industry,
            industry: staticCaseStudy.industry,
            project_type: 'Bespoke Enterprise Software',
            positioning_statement: staticCaseStudy.shortDescription,
            short_description: staticCaseStudy.shortDescription,
            what_we_solved: 'Engineered custom digital architecture solving operational bottlenecks.',
            description: staticCaseStudy.overview,
            overview: {
              client_background: staticCaseStudy.overview,
              industry_context: staticCaseStudy.industry,
              what_sarohub_built: staticCaseStudy.sarohubSolution,
              project_importance: staticCaseStudy.clientProblem
            },
            challenges: [
              { title: 'Operational Bottleneck', description: staticCaseStudy.clientProblem }
            ],
            solutions: [
              { title: 'Targeted Engineering', description: staticCaseStudy.sarohubSolution }
            ],
            features: staticCaseStudy.keyFeatures || [],
            sarohub_role: ['UI/UX Design', 'Full-Stack Development', 'Cloud Deployment'],
            technologies: {
              tags: staticCaseStudy.technologies || []
            },
            results_impact: {
              qualitative_outcomes: [
                { title: 'Accelerated Operations', description: 'Streamlined workflows and improved reliability.' }
              ]
            },
            thumbnail_url: staticCaseStudy.bannerImage,
            screenshots: [staticCaseStudy.bannerImage],
            status: 'Delivered',
            engagement: 'Client Project',
            completion_date: staticCaseStudy.completionDate,
            live_url: '',
            github_url: ''
          };
        }
      }

      if (isMounted) {
        if (loadedProject) {
          setProject(loadedProject);

          if (loadedProject.testimonial) {
            setTestimonial(loadedProject.testimonial);
          } else if (loadedProject.testimonial_id) {
            try {
              const testimonials = await api.getTestimonials();
              const matched = testimonials.find((t: any) => t.id === loadedProject.testimonial_id);
              if (matched && isMounted) setTestimonial(matched);
            } catch (err) {
              console.error('Failed to load project testimonial', err);
            }
          }
        }
        setLoading(false);
      }
    }

    loadProjectData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleDataUpdated = () => {
      loadProjectData();
    };
    window.addEventListener('sarohub-data-updated', handleDataUpdated);

    return () => { 
      isMounted = false; 
      window.removeEventListener('sarohub-data-updated', handleDataUpdated);
    };
  }, [slug]);

  const validGallery: string[] = useMemo(() => {
    if (!project) return [];
    const pool = [
      project.thumbnail_url,
      project.image,
      project.image_url,
      ...(Array.isArray(project.screenshots) ? project.screenshots : []),
      ...(Array.isArray(project.gallery) ? project.gallery : [])
    ].filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
    return Array.from(new Set(pool));
  }, [project]);

  const techList: string[] = useMemo(() => {
    if (!project) return [];
    if (project.technologies?.tags && Array.isArray(project.technologies.tags)) {
      return project.technologies.tags;
    }
    if (Array.isArray(project.technologies)) {
      return project.technologies;
    }
    if (typeof project.technologies === 'string') {
      return project.technologies.split(',').map((t: string) => t.trim());
    }
    return [];
  }, [project]);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const sourceList = allProjects && allProjects.length > 0 ? allProjects : getAllClientProjects();
    const others = sourceList.filter((p: any) => p.slug !== project.slug && String(p.id) !== String(project.id));
    
    const matching = others.filter((p: any) => p.category === project.category);
    const nonMatching = others.filter((p: any) => p.category !== project.category);
    return [...matching, ...nonMatching].slice(0, 3);
  }, [project, allProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center p-8 rounded-3xl bg-[#FBFBFB] border border-gray-200">
          <h2 className="text-2xl font-normal text-black mb-2">Case Study Not Found</h2>
          <p className="text-sm text-gray-600 mb-6 font-normal">
            The requested client work case study does not exist or has been relocated.
          </p>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition-all"
          >
            <span>Return to Portfolio</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  const openModalAt = (idx: number) => {
    setActiveImageIndex(idx);
    setActiveImageModal(validGallery[idx]);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeImageIndex + 1) % validGallery.length;
    setActiveImageIndex(nextIdx);
    setActiveImageModal(validGallery[nextIdx]);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (activeImageIndex - 1 + validGallery.length) % validGallery.length;
    setActiveImageIndex(prevIdx);
    setActiveImageModal(validGallery[prevIdx]);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${project.title} — Client Case Study`,
    "description": project.short_description || project.positioning_statement,
    "image": project.thumbnail_url,
    "author": {
      "@type": "Organization",
      "name": "SaroHub Technologies",
      "url": "https://sarohub.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SaroHub Technologies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sarohub.com/logo.png"
      }
    }
  };

  const challengesList: Array<{ title: string; description: string }> = 
    project.challenges && Array.isArray(project.challenges) && project.challenges.length > 0
      ? project.challenges
      : project.problem_challenge
      ? project.problem_challenge.split('\n').filter(Boolean).map((line: string) => {
          const parts = line.split(':');
          return {
            title: parts[0]?.trim() || 'Key Challenge',
            description: parts.slice(1).join(':').trim() || line
          };
        })
      : [
          { title: 'Digital Accessibility', description: 'The client required an intuitive, modern platform to connect with users seamlessly.' },
          { title: 'Operational Efficiency', description: 'Legacy workflows caused delays and required unified digital synchronization.' }
        ];

  const solutionsList: Array<{ title: string; description: string }> = 
    project.solutions && Array.isArray(project.solutions) && project.solutions.length > 0
      ? project.solutions
      : project.solution
      ? project.solution.split('\n').filter(Boolean).map((line: string) => {
          const parts = line.split(':');
          return {
            title: parts[0]?.trim() || 'Tailored Solution',
            description: parts.slice(1).join(':').trim() || line
          };
        })
      : [
          { title: 'Custom Digital Architecture', description: 'A purpose-built web platform engineered directly around the client\'s workflow.' },
          { title: 'High-Performance Foundation', description: 'Modular, scalable system ready for high concurrency and future expansions.' }
        ];

  const featuresList: string[] = 
    project.features && Array.isArray(project.features) && project.features.length > 0
      ? project.features
      : project.key_features && Array.isArray(project.key_features)
      ? project.key_features
      : typeof project.key_features === 'string'
      ? project.key_features.split('\n').filter(Boolean)
      : [
          'Responsive Multi-Device Interface',
          'High-Speed Architecture & Low Latency',
          'Role-Based Administrative Management',
          'Secure Data Ingestion & Storage'
        ];

  const roleList: string[] = 
    project.sarohub_role && Array.isArray(project.sarohub_role) && project.sarohub_role.length > 0
      ? project.sarohub_role
      : [
          'UI/UX Design',
          'Frontend Development',
          'Backend Development',
          'Database Development',
          'API Development',
          'System Architecture',
          'Deployment & Cloud Setup',
          'Quality Assurance Testing',
          'Technical Support'
        ];

  const metricResults = project.results_impact?.metrics || (Array.isArray(project.results_impact) ? project.results_impact : []);
  const qualitativeResults = project.results_impact?.qualitative_outcomes || [
    { title: 'Improved Visibility', description: 'Established a commanding digital presence enabling customers to access offerings anytime.' },
    { title: 'Streamlined Operations', description: 'Eliminated manual bottlenecks and provided centralized digital management.' },
    { title: 'Future-Proof Foundation', description: 'Engineered a scalable codebase ready to support upcoming business expansion.' }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <SEOHead
        title={`${project.title} — Case Study | SaroHub Technologies`}
        description={project.short_description || project.positioning_statement || `Discover how SaroHub Technologies built ${project.title} for ${project.client_name}.`}
        canonicalUrl={`https://sarohub.com/projects/${project.slug || project.id}`}
        ogType="article"
        ogImage={project.thumbnail_url}
        structuredData={structuredData}
      />

      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-gray-200 bg-[#FBFBFB]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Portfolio', url: '/work' },
              { name: project.title, url: `/projects/${project.slug || project.id}`, isCurrent: true }
            ]}
          />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-gray-500">
            Case Study #{project.id || '01'}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase bg-white border border-gray-200 text-gray-700">
                {project.industry || project.category || 'Client Solution'}
              </span>

              <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase bg-white border border-gray-200 text-black font-semibold">
                {project.status || 'Delivered'}
              </span>

              {project.completion_date && (
                <span className="px-3.5 py-1 rounded-full text-xs font-mono text-gray-500 bg-white border border-gray-200">
                  Delivered: {project.completion_date}
                </span>
              )}
            </div>

            {/* Project Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal -tracking-[2.5px] text-black leading-tight mb-4">
              {project.title}
            </h1>

            {/* Positioning Statement */}
            <p className="text-lg sm:text-2xl text-gray-600 font-normal leading-relaxed mb-8">
              {project.positioning_statement || project.short_description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-black text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300"
                >
                  <RollText>LAUNCH LIVE PROJECT</RollText>
                  <DiagonalArrow size={18} />
                </a>
              )}

              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-full border border-gray-300 text-xs font-mono uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all"
              >
                Start Similar Project
              </Link>
            </div>
          </div>

          {/* Large Showcase Banner */}
          {(project.thumbnail_url || validGallery[0]) && (
            <div 
              onClick={() => openModalAt(0)}
              className="mt-12 rounded-3xl overflow-hidden border border-gray-200 shadow-xs bg-white group cursor-pointer relative"
            >
              <img
                src={project.thumbnail_url || validGallery[0]}
                alt={`${project.title} interface showcase`}
                className="w-full h-80 sm:h-[480px] lg:h-[560px] object-cover transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                <span className="text-xs font-mono text-white font-semibold flex items-center gap-1.5 bg-black/80 px-4 py-2 rounded-full backdrop-blur-xs">
                  <ZoomIn className="size-4" /> Click to enlarge
                </span>
                <span className="text-xs font-mono text-white bg-black/80 px-4 py-2 rounded-full backdrop-blur-xs">
                  {validGallery.length} Image{validGallery.length > 1 ? 's' : ''} in Showcase
                </span>
              </div>
            </div>
          )}

          {/* Project Metadata Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-6 rounded-3xl bg-white border border-gray-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Client</span>
              <span className="text-xs sm:text-sm font-semibold text-black block truncate">{project.client_name || project.title}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Industry</span>
              <span className="text-xs sm:text-sm font-semibold text-black block truncate">{project.industry || project.category}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Project Type</span>
              <span className="text-xs sm:text-sm font-semibold text-black block truncate">{project.project_type || 'Custom Software'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Engagement</span>
              <span className="text-xs sm:text-sm font-semibold text-black block truncate">{project.engagement || 'Client Project'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Technology</span>
              <span className="text-xs sm:text-sm font-semibold text-black block truncate">
                {project.technologies?.architecture || (techList.length > 0 ? techList.slice(0, 2).join(', ') : 'Modern Web')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Status</span>
              <span className="text-xs sm:text-sm font-semibold text-black block">
                {project.status || 'Delivered'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 01 — Overview */}
      <section className="py-20 lg:py-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              01 — Context &amp; Mandate
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-black">
              Understanding the Client <span className="italic">Mandate</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <div className="size-10 rounded-2xl bg-white border border-gray-200 text-black flex items-center justify-center">
                <Building2 className="size-5" />
              </div>
              <h3 className="text-lg font-normal text-black">Who the Client Is</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {project.overview?.client_background || `${project.client_name} is an ambitious commercial business seeking to expand its operational capabilities and customer reach.`}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <div className="size-10 rounded-2xl bg-white border border-gray-200 text-black flex items-center justify-center">
                <Briefcase className="size-5" />
              </div>
              <h3 className="text-lg font-normal text-black">Industry Context</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {project.overview?.industry_context || `Operating in the ${project.industry || project.category} sector with a focus on speed, customer accessibility, and dependable service.`}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <div className="size-10 rounded-2xl bg-white border border-gray-200 text-black flex items-center justify-center">
                <Terminal className="size-5" />
              </div>
              <h3 className="text-lg font-normal text-black">What SaroHub Built</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {project.overview?.what_sarohub_built || project.what_we_solved || `Engineered a custom, production-ready digital platform tailored to ${project.client_name}'s daily operational requirements.`}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <div className="size-10 rounded-2xl bg-white border border-gray-200 text-black flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-normal text-black">Why It Was Important</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {project.overview?.project_importance || project.description || 'The project addressed critical operational bottlenecks, modernized client interactions, and laid the foundation for sustainable scale.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — The Challenge & 03 — Our Solution */}
      <section className="py-20 lg:py-24 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* The Challenge */}
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                  02 — The Challenge
                </span>
                <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1.92px] text-black">
                  Operational Problems Faced
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed font-normal">
                  Before SaroHub was engaged, the business contended with operational friction and systemic bottlenecks:
                </p>
              </div>

              <div className="space-y-4">
                {challengesList.map((ch, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white border border-gray-200 space-y-2">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-wider block">
                      Problem 0{i + 1}
                    </span>
                    <h4 className="text-lg font-normal text-black">
                      {ch.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {ch.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Solution */}
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                  03 — Our Solution
                </span>
                <h2 className="text-3xl sm:text-4xl font-normal -tracking-[1.92px] text-black">
                  How SaroHub Solved It
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed font-normal">
                  We engineered a targeted, resilient software system tailored directly to their operational realities:
                </p>
              </div>

              <div className="space-y-4">
                {solutionsList.map((sol, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white border border-gray-200 space-y-2">
                    <span className="font-mono text-xs text-black font-semibold uppercase tracking-wider block">
                      Solution 0{i + 1}
                    </span>
                    <h4 className="text-lg font-normal text-black">
                      {sol.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {sol.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 04 — Key Features */}
      <section className="py-20 lg:py-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              04 — Key Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-black">
              Delivered Capabilities &amp; <span className="italic">Modules</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresList.map((feature, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 p-6 rounded-3xl bg-[#FBFBFB] border border-gray-200 hover:border-black transition-all"
              >
                <div className="size-8 rounded-full bg-white border border-gray-200 text-black flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="size-4" />
                </div>
                <h4 className="text-sm sm:text-base font-normal text-black leading-snug">
                  {feature}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — SaroHub's Role */}
      <section className="py-20 lg:py-24 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              05 — SaroHub's Role
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-black">
              Full-Cycle Engineering <span className="italic">Execution</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {roleList.map((roleItem, i) => (
              <div 
                key={i} 
                className="p-5 rounded-3xl bg-white border border-gray-200 text-center space-y-2 hover:border-black transition-all"
              >
                <span className="font-mono text-xs uppercase text-gray-400 block">
                  0{i + 1}
                </span>
                <span className="block text-sm font-normal text-black">
                  {roleItem}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Architecture & Stack */}
      <section className="py-20 lg:py-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              06 — Technology
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-black">
              Architecture &amp; <span className="italic">Tech Stack</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Frontend</span>
              <h3 className="text-lg font-normal text-black">
                {project.technologies?.frontend || 'React.js, Tailwind CSS'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Responsive, component-driven client architecture designed for fast render speeds and smooth mobile interactions.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Backend</span>
              <h3 className="text-lg font-normal text-black">
                {project.technologies?.backend || 'Node.js, Express.js'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                High-throughput REST API with asynchronous request pipelines, tokenized security, and robust error validation.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Database</span>
              <h3 className="text-lg font-normal text-black">
                {project.technologies?.database || 'PostgreSQL / MySQL'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Optimized relational or document schemas with indexed query paths ensuring rapid data lookups and zero collisions.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBFBFB] border border-gray-200 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Architecture</span>
              <h3 className="text-lg font-normal text-black">
                {project.technologies?.architecture || 'Modular Cloud Platform'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Clean separation of concerns with containerized deployment scripts and continuous monitoring.
              </p>
            </div>
          </div>

          {techList.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-gray-500 mr-2">Key Stack Components:</span>
              {techList.map((t, i) => (
                <span 
                  key={i} 
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase bg-[#FBFBFB] border border-gray-200 text-black font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 07 — Results & Impact */}
      <section className="py-20 lg:py-24 bg-[#FBFBFB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              07 — Results &amp; Impact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-black">
              Verified Business <span className="italic">Outcomes</span>
            </h2>
          </div>

          {metricResults.length > 0 && (
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {metricResults.map((m: any, i: number) => (
                <div key={i} className="p-8 rounded-3xl bg-white border border-gray-200 space-y-2">
                  <span className="block text-4xl sm:text-5xl font-normal text-black">
                    {m.metric || '100%'}
                  </span>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    {m.label}
                  </h4>
                  {m.detail && (
                    <p className="text-sm text-gray-600 leading-relaxed font-normal pt-2">
                      {m.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualitativeResults.map((item: any, i: number) => (
              <div key={i} className="p-7 rounded-3xl bg-white border border-gray-200 space-y-2">
                <span className="font-mono text-xs text-gray-400 block">0{i + 1}</span>
                <h4 className="text-lg font-normal text-black">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Interface Gallery */}
      {validGallery.length > 0 && (
        <section className="py-20 lg:py-24 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                  08 — Project Showcase
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-black">
                  Interface Gallery &amp; <span className="italic">Screenshots</span>
                </h2>
              </div>

              <span className="font-mono text-xs uppercase text-gray-500">
                {validGallery.length} Image{validGallery.length > 1 ? 's' : ''} in Showcase
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {validGallery.map((img: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => openModalAt(idx)}
                  className="rounded-3xl overflow-hidden border border-gray-200 bg-[#FBFBFB] group aspect-video cursor-pointer relative transition-all"
                >
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white text-black text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <ZoomIn className="size-4" /> Enlarge
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 09 — Client Feedback */}
      {testimonial && (
        <section className="py-20 lg:py-24 bg-[#FBFBFB] border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-8 sm:p-14 rounded-3xl bg-white border border-gray-200 space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block">
                09 — Client Feedback
              </span>

              <p className="text-2xl sm:text-3xl font-normal text-black italic leading-relaxed">
                &ldquo;{testimonial.quote || testimonial.feedback}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                {testimonial.client_avatar || testimonial.avatar_url ? (
                  <img
                    src={testimonial.client_avatar || testimonial.avatar_url}
                    alt={testimonial.author || testimonial.client_name}
                    className="size-12 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-black text-white flex items-center justify-center font-mono font-bold text-base">
                    {(testimonial.author || testimonial.client_name || 'C').charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-normal text-black">
                    {testimonial.author || testimonial.client_name}
                  </h4>
                  <p className="text-xs font-mono uppercase text-gray-500">
                    {testimonial.role || testimonial.client_role}
                    {(testimonial.company || testimonial.client_company) ? ` &bull; ${testimonial.company || testimonial.client_company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call To Action */}
      <section className="py-20 lg:py-28 bg-white border-b border-gray-200 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block">
            Partner With SaroHub
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[1.92px] text-black">
            Have a similar challenge? Let&apos;s <span className="italic">build.</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            We partner with businesses to turn challenges into high-performance web applications, commercial platforms, and scalable digital solutions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="group px-8 py-4 inline-flex gap-2.5 items-center bg-black text-sm font-medium -tracking-[0.2px] leading-5 text-white rounded-full hover:bg-gray-800 transition-all duration-300"
            >
              <RollText>START A PROJECT</RollText>
              <DiagonalArrow size={18} />
            </Link>

            <Link
              to="/work"
              className="px-8 py-4 rounded-full border border-gray-200 text-xs font-mono uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all"
            >
              All Client Work
            </Link>
          </div>
        </div>
      </section>

      {/* More Client Work */}
      {relatedProjects.length > 0 && (
        <section className="py-20 lg:py-28 bg-[#FBFBFB]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-gray-200">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                  Portfolio
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.92px] text-black">
                  More Client <span className="italic">Work</span>
                </h2>
              </div>

              <Link
                to="/work"
                className="text-xs font-mono uppercase tracking-wider text-black hover:text-gray-600 font-semibold"
              >
                View All Projects &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relItem: ClientProject, idx: number) => (
                <ClientProjectCard key={relItem.id || idx} project={relItem} idx={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {activeImageModal && (
        <div 
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-2 right-2 z-10 size-10 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-lg"
            >
              <X className="size-5" />
            </button>

            {validGallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-lg"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-lg"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}

            <img
              src={activeImageModal}
              alt="Expanded Preview"
              className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain bg-white shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-xs font-mono text-white">
              Screenshot {activeImageIndex + 1} of {validGallery.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
