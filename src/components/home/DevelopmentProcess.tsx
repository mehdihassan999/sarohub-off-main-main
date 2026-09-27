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
    <section id="dev-process" className="py-12 lg:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
            Execution Framework
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-3">
            Development <span className="italic">Lifecycle</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto font-normal">
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
              className="p-6 sm:p-7 rounded-3xl border border-gray-200 bg-[#FBFBFB] hover:border-black hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-2xl sm:text-3xl italic text-gray-400 group-hover:text-black font-semibold transition-colors block mb-3">
                  {step.stepNumber || `0${idx + 1}`}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors tracking-tight">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  {step.detailedDescription || step.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 font-mono text-xs text-gray-700 font-semibold uppercase tracking-wider">
                PHASE 0{idx + 1} / 0{stepsList.length}
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
