import React, { useState, useEffect } from 'react';
import { Venture } from '../../types';
import VentureGrid from './VentureGrid';
import { api } from '../../api';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function VentureSection() {
  const cached = api.getCachedVentures();
  const [ventures, setVentures] = useState<Venture[]>(() => {
    if (cached && cached.length > 0) {
      return (cached as Venture[]).filter((v) => v.published);
    }
    return [
      {
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
      }
    ];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .getVentures()
      .then((data) => {
        const published = (data as Venture[]).filter((v) => v.published);
        if (published.length > 0) {
          setVentures(published);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="ventures"
      className="pt-8 pb-14 sm:pt-10 sm:pb-16 relative overflow-hidden border-b grid-bg"
      style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)' }}
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-700 shadow-xs mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Our Ventures
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight text-slate-950"
          >
            Building What Comes Next.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 text-lg font-bold text-slate-800"
          >
            We don't just build technology for others. We build ventures of our own.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-3 text-sm sm:text-base font-normal leading-relaxed max-w-2xl text-slate-700"
          >
            From education and real estate to business and healthcare, our ventures are built around real-world
            problems and opportunities. We combine entrepreneurship, technology, AI, and product thinking to develop
            solutions with the potential to become scalable businesses.
          </motion.p>
        </div>

        {/* Ventures Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border h-96 animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
              />
            ))}
          </div>
        ) : ventures.length > 0 ? (
          <VentureGrid ventures={ventures} />
        ) : (
          <div
            className="text-center py-20 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              No ventures published yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
