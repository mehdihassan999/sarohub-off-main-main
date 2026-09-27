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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative border-b border-slate-200 bg-slate-50/60 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-6 pb-6 sm:pt-8 sm:pb-8">
          <div className="mb-4">
            <Link
              to="/ventures"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Ventures
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-slate-200/80 text-slate-700 border border-slate-300">
              {ventureLabel}
            </span>
            <VentureStatus status={venture.status} size="md" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            {venture.name}
          </h1>

          {venture.tagline && (
            <p className="mt-2 text-base sm:text-lg font-medium text-slate-700 italic">
              "{venture.tagline}"
            </p>
          )}

          {venture.category && (
            <div className="mt-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-800 shadow-sm inline-block">
                {venture.category}
              </span>
            </div>
          )}

          {/* External links */}
          {(venture.websiteUrl || venture.demoUrl) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {venture.websiteUrl && (
                <a
                  href={venture.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md"
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 bg-white text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>
          )}

          {/* Featured Cover Banner */}
          {venture.coverImage && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-lg max-h-[460px]">
              <img
                src={venture.coverImage}
                alt={venture.name}
                className="w-full h-full object-cover max-h-[460px]"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6 sm:pt-8 pb-16 space-y-8 sm:space-y-10">

        {/* Description / About */}
        {venture.description && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">Venture Overview</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-slate-950">
              About {venture.name}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-slate-800 font-normal">
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
              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-950">The Problem</h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-normal">{venture.problem}</p>
              </div>
            )}
            {venture.solution && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-950">The Solution</h3>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-normal">{venture.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Key Capabilities */}
        {venture.keyCapabilities && venture.keyCapabilities.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-slate-950">
              Key Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {venture.keyCapabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 shadow-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-slate-900">{cap}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technologies */}
        {venture.technologies && venture.technologies.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5 text-slate-950">
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {venture.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">Platform Showcase</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950">Gallery & Screenshots</h2>
              </div>
              {gallery.length > 1 && (
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                  {galleryIdx + 1} / {gallery.length}
                </span>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950">
              <div className="relative aspect-video sm:h-[440px] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <img
                  src={gallery[galleryIdx].url}
                  alt={gallery[galleryIdx].caption || `${venture.name} screenshot ${galleryIdx + 1}`}
                  className="w-full h-full object-contain sm:object-cover"
                />

                {/* Description / Caption Overlay */}
                {(gallery[galleryIdx].caption || gallery[galleryIdx].description) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-5 pt-10">
                    <p className="text-sm sm:text-base font-semibold text-white">
                      {gallery[galleryIdx].caption || gallery[galleryIdx].description}
                    </p>
                    {gallery[galleryIdx].description && gallery[galleryIdx].caption && gallery[galleryIdx].description !== gallery[galleryIdx].caption && (
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/90 text-white hover:bg-blue-600 transition-all border border-slate-700 shadow-lg cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setGalleryIdx((prev) => (prev + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/90 text-white hover:bg-blue-600 transition-all border border-slate-700 shadow-lg cursor-pointer"
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
                    className={`relative rounded-xl overflow-hidden border text-left transition-all group cursor-pointer ${galleryIdx === idx ? 'ring-2 ring-blue-600 border-blue-600 shadow-md' : 'opacity-80 hover:opacity-100 border-slate-200'}`}
                  >
                    <div className="h-20 bg-slate-900 overflow-hidden">
                      <img src={item.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {item.caption && (
                      <p className="p-1.5 text-xs truncate font-medium text-slate-800 bg-white border-t border-slate-100">{item.caption}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Current Status */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold mb-4 text-slate-950">Current Status</h2>
          <div className="flex flex-wrap items-center gap-4">
            <VentureStatus status={venture.status} size="lg" />
            {venture.launchDate && (
              <span className="text-sm sm:text-base font-semibold text-slate-700">
                Launch planned: {venture.launchDate}
              </span>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 p-8 sm:p-12 text-center shadow-sm">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-950">
            Interested in {venture.name}?
          </h2>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-700 mb-8 max-w-xl mx-auto">
            Get in touch to learn more, explore collaboration, or stay updated on our progress.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-950 text-white hover:bg-slate-800 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Start a Conversation
            </Link>
            <Link
              to="/ventures"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-slate-300 bg-white text-slate-900 hover:border-slate-900 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer"
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
