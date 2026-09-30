import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '../../api';

export default function DevelopmentProcess() {
  const [processSteps, setProcessSteps] = useState<any[]>([]);

  useEffect(() => {
    api.getProcessSteps()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProcessSteps(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
          setProcessSteps(defaultFallbackSteps);
        }
      })
      .catch(() => setProcessSteps(defaultFallbackSteps));
  }, []);

  const defaultFallbackSteps = [
    { id: 1, stepNumber: '01', title: 'Discovery & Audit', shortDescription: 'Understanding your business goals, target user personas, technical bottlenecks, and success criteria.' },
    { id: 2, stepNumber: '02', title: 'Architecture & Strategy', shortDescription: 'Comprehensive system planning, database schema design, technology selection, and milestone roadmaps.' },
    { id: 3, stepNumber: '03', title: 'UI/UX & Prototyping', shortDescription: 'Clickable Figma prototypes, ergonomic interface designs, responsive layouts, and stakeholder feedback reviews.' },
    { id: 4, stepNumber: '04', title: 'Agile Engineering', shortDescription: 'Sprint-based engineering with clean TypeScript code, test-driven validation, and bi-weekly milestone demonstrations.' },
    { id: 5, stepNumber: '05', title: 'Deployment & Launch', shortDescription: 'Automated CI/CD pipelines, containerized cloud infrastructure, SSL configuration, and zero-downtime release.' },
    { id: 6, stepNumber: '06', title: 'Optimization & Scale', shortDescription: 'Continuous telemetry monitoring, Core Web Vitals optimization, automated backups, and scalable feature expansion.' }
  ];

  const stepsList = processSteps.length > 0 ? processSteps : defaultFallbackSteps;

  return (
    <section id="dev-process" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Execution Framework
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-3">
            Development <span className="italic text-[#FF5C00]">Lifecycle</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            How SaroHub turns raw product visions into production software and sustainable technology ventures through structured, milestone-driven execution.
          </p>
        </div>

        {/* 6-Card Numbered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stepsList.map((step, idx) => (
            <motion.article
              key={step.id || idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="p-6 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <span className="font-mono text-2xl sm:text-3xl italic text-[#FF5C00]/40 group-hover:text-[#FF5C00] font-bold transition-colors block mb-3">
                  {step.stepNumber || `0${idx + 1}`}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#FF7A1A] transition-colors tracking-tight font-display">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {step.detailedDescription || step.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] font-mono text-xs text-slate-400 font-semibold uppercase tracking-wider">
                PHASE 0{idx + 1} / 0{stepsList.length}
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
