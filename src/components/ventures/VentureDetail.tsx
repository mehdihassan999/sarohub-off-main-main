import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Venture } from '../../types';
import { api } from '../../api';
import VentureStatus from './VentureStatus';
import VentureStrategicBlueprint from './VentureStrategicBlueprint';
import { motion } from 'motion/react';
import {
  ArrowLeft, ExternalLink, Globe, Cpu, Users, Target, Layers,
  Lightbulb, TrendingUp, ChevronLeft, ChevronRight, CheckCircle2, Tag
} from 'lucide-react';

export default function VentureDetail() {
  const { slug } = useParams<{ slug: string }>();
  const cached = api.getCachedVentures();
  const initialVenture = (() => {
    if (cached) {
      const match = cached.find((v: any) => v.slug === slug || String(v.id) === slug);
      if (match) return match as Venture;
    }
    // Instant fallback if slug is default venture
    if (slug === 'alin316-school-management-system' || slug === '1') {
      return {
        id: 1,
        name: 'Alin316 (School Management System)',
        slug: 'alin316-school-management-system',
        tagline: 'Comprehensive school and institute management ecosystem',
        description: 'An enterprise-grade, cloud-based education management system engineered to automate admissions, academics, fee operations, exams, attendance, and multi-campus reporting.',
        category: 'EdTech • Enterprise SaaS',
        status: 'In Development',
        keyCapabilities: ['Multi-Campus Administration', 'Automated Fee Management', 'Student & Parent Portals'],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        featured: true,
        order: 1,
        published: true,
        coverImage: '/uploads/venture-cover-0-17886',
        websiteUrl: '',
        demoUrl: '',
        industry: 'Education Technology (EdTech)',
        targetMarket: 'Private Schools, Academies & Multi-Campus Institutions',
        businessModel: 'B2B SaaS Subscription Model',
      } as Venture;
    }
    return null;
  })();

  const [venture, setVenture] = useState<Venture | null>(initialVenture);
  const [loading, setLoading] = useState<boolean>(() => !initialVenture);
  const [error, setError] = useState<string | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    if (!slug) return;
    api
      .getVentureBySlug(slug)
      .then((data) => {
        if (data) setVenture(data as Venture);
      })
      .catch(() => {
        if (!initialVenture) setError('Venture not found.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Update document meta
  useEffect(() => {
    if (venture) {
      document.title = `${venture.name} | SaroHub Technologies`;
    }
    return () => {
      document.title = 'SaroHub Technologies';
    };
  }, [venture]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !venture) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ backgroundColor: 'var(--bg-app)' }}>
        <p className="text-lg font-bold text-red-400">{error || 'Venture not found.'}</p>
        <Link to="/ventures" className="text-blue-400 hover:text-blue-300 text-sm font-bold underline">
          ← Back to Ventures
        </Link>
      </div>
    );
  }

  const ventureLabel = `VENTURE ${String(venture.order || 1).padStart(2, '0')}`;
  const rawGallery = (venture.gallery || venture.galleryImages || []) as any[];
  const gallery = rawGallery.map((item) => {
    if (typeof item === 'string') return { url: item, caption: '', description: '' };
    return {
      url: item?.url || '',
      caption: item?.caption || '',
      description: item?.description || item?.caption || '',
    };
  }).filter((item) => Boolean(item.url));

  return (
    <div className="min-h-screen bg-[#08090E] text-white">
      {/* Hero */}
      <div className="relative border-b border-white/[0.08] bg-[#0A0D15] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8 pb-8 sm:pt-12 sm:pb-12">
          <div className="mb-6">
            <Link
              to="/ventures"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF7A1A] hover:text-[#FFA566] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Ventures
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/[0.06] text-slate-300 border border-white/10">
              {ventureLabel}
            </span>
            <VentureStatus status={venture.status} size="md" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-white leading-tight">
            {venture.name}
          </h1>

          {venture.tagline && (
            <p className="mt-3 text-base sm:text-xl font-normal text-slate-300 italic">
              "{venture.tagline}"
            </p>
          )}

          {venture.category && (
            <div className="mt-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#FF5C00]/30 bg-[#FF5C00]/10 text-[#FF7A1A] shadow-sm inline-block">
                {venture.category}
              </span>
            </div>
          )}

          {/* External links */}
          {(venture.websiteUrl || venture.demoUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {venture.websiteUrl && (
                <a
                  href={venture.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border border-[#FFA566]/30"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </a>
              )}
              {venture.demoUrl && (
                <a
                  href={venture.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.04] text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:border-[#FF5C00] hover:bg-white/[0.08] transition-all shadow-sm"
                >
                  <ExternalLink className="h-4 w-4 text-[#FF5C00]" />
                  Live Demo
                </a>
              )}
            </div>
          )}

          {/* Featured Cover Banner */}
          {venture.coverImage && (
            <div className="mt-10 rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0E121E] shadow-2xl max-h-[480px]">
              <img
                src={venture.coverImage}
                alt={venture.name}
                className="w-full h-full object-cover max-h-[480px]"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 sm:pt-12 pb-20 space-y-10 sm:space-y-12">

        {/* Description / About */}
        {venture.description && (
          <section className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-10 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF7A1A]">Venture Overview</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 text-white">
              About {venture.name}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-slate-300 font-normal">
              {venture.description}
            </p>
          </section>
        )}

        {/* Strategic Blueprint: Industry & Sector, Target Market & Business Model */}
        {(venture.industry || venture.targetMarket || venture.businessModel) && (
          <VentureStrategicBlueprint
            industry={venture.industry}
            targetMarket={venture.targetMarket}
            businessModel={venture.businessModel}
            ventureName={venture.name}
          />
        )}

        {/* Problem & Solution */}
        {(venture.problem || venture.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {venture.problem && (
              <div className="rounded-3xl border border-rose-500/20 bg-rose-950/20 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">The Problem</h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-300 font-normal">{venture.problem}</p>
              </div>
            )}
            {venture.solution && (
              <div className="rounded-3xl border border-[#FF5C00]/25 bg-[#FF5C00]/5 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 flex items-center justify-center text-[#FF7A1A]">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">The Solution</h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-300 font-normal">{venture.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Key Capabilities */}
        {venture.keyCapabilities && venture.keyCapabilities.length > 0 && (
          <section className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-10 shadow-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-white">
              Key Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {venture.keyCapabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.08] bg-[#141828]">
                  <CheckCircle2 className="h-5 w-5 text-[#FF5C00] mt-0.5 shrink-0" />
                  <span className="text-sm sm:text-base font-normal text-slate-200">{cap}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technologies */}
        {venture.technologies && venture.technologies.length > 0 && (
          <section className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-10 shadow-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-white">
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {venture.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-[#141828] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-10 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF7A1A]">Platform Showcase</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Gallery &amp; Screenshots</h2>
              </div>
              {gallery.length > 1 && (
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-white/10 bg-[#141828] text-slate-300">
                  {galleryIdx + 1} / {gallery.length}
                </span>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#08090E]">
              <div className="relative aspect-video sm:h-[460px] w-full overflow-hidden flex items-center justify-center bg-[#08090E]">
                <img
                  src={gallery[galleryIdx].url}
                  alt={gallery[galleryIdx].caption || `${venture.name} screenshot ${galleryIdx + 1}`}
                  className="w-full h-full object-contain sm:object-cover"
                />

                {/* Description / Caption Overlay */}
                {(gallery[galleryIdx].caption || gallery[galleryIdx].description) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-5 pt-10">
                    <p className="text-sm sm:text-base font-semibold text-white">
                      {gallery[galleryIdx].caption || gallery[galleryIdx].description}
                    </p>
                    {gallery[galleryIdx].description && gallery[galleryIdx].caption && gallery[galleryIdx].description !== gallery[galleryIdx].caption && (
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
                        {gallery[galleryIdx].description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIdx((prev) => (prev - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/80 text-white hover:bg-[#FF5C00] transition-all border border-white/20 shadow-lg cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setGalleryIdx((prev) => (prev + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/80 text-white hover:bg-[#FF5C00] transition-all border border-white/20 shadow-lg cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Preview Strip */}
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {gallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIdx(idx)}
                    className={`relative rounded-xl overflow-hidden border text-left transition-all group cursor-pointer ${galleryIdx === idx ? 'ring-2 ring-[#FF5C00] border-[#FF5C00] shadow-md' : 'opacity-80 hover:opacity-100 border-white/10'}`}
                  >
                    <div className="h-20 bg-[#141828] overflow-hidden">
                      <img src={item.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {item.caption && (
                      <p className="p-1.5 text-xs truncate font-medium text-slate-300 bg-[#0E121E] border-t border-white/[0.08]">{item.caption}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Current Status */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-10 shadow-xl">
          <h2 className="font-display text-xl font-bold mb-4 text-white">Current Status</h2>
          <div className="flex flex-wrap items-center gap-4">
            <VentureStatus status={venture.status} size="lg" />
            {venture.launchDate && (
              <span className="text-sm sm:text-base font-semibold text-slate-300">
                Launch planned: {venture.launchDate}
              </span>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#FF5C00]/8 blur-[100px] pointer-events-none -z-10" />

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-white">
            Interested in {venture.name}?
          </h2>
          <p className="mt-3 text-sm sm:text-base font-normal text-slate-400 mb-8 max-w-xl mx-auto">
            Get in touch to learn more, explore collaboration, or stay updated on our progress.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border border-[#FFA566]/30 cursor-pointer"
            >
              Start a Conversation
            </Link>
            <Link
              to="/ventures"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/10 bg-white/[0.04] text-white hover:border-[#FF5C00] hover:bg-white/[0.08] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              All Ventures
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
