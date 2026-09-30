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
      className="py-16 sm:py-24 relative overflow-hidden bg-[#08090E] text-white border-b border-white/[0.08]"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#FF5C00]/8 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF7A1A] shadow-xs mb-4"
          >
            <Sparkles className="h-4 w-4 text-[#FF5C00]" />
            Proprietary Ventures
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] leading-tight text-white"
          >
            Building What Comes <span className="italic text-[#FF5C00]">Next.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-4 text-lg sm:text-xl font-normal text-slate-200"
          >
            We don't just build technology for others. We build ventures of our own.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-3 text-sm sm:text-base font-normal leading-relaxed max-w-2xl text-slate-400"
          >
            From education and real estate to business and healthcare, our ventures are built around real-world
            problems and opportunities. We combine entrepreneurship, technology, AI, and product thinking to develop
            solutions with the potential to become scalable businesses.
          </motion.p>
        </div>

        {/* Ventures Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/[0.08] bg-[#0E121E] h-96 animate-pulse"
              />
            ))}
          </div>
        ) : ventures.length > 0 ? (
          <VentureGrid ventures={ventures} />
        ) : (
          <div
            className="text-center py-20 rounded-3xl border border-white/[0.08] bg-[#0E121E]"
          >
            <p className="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider">
              No ventures published yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
