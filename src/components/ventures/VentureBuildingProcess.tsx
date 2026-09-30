import React from 'react';
import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    label: 'IDENTIFY',
    title: 'Find Meaningful Problems',
    desc: 'Find meaningful problems and opportunities.',
  },
  {
    number: '02',
    label: 'VALIDATE',
    title: 'Test Assumptions',
    desc: 'Test assumptions and understand the market.',
  },
  {
    number: '03',
    label: 'BUILD',
    title: 'Develop the Product',
    desc: 'Develop the product, technology, and experience.',
  },
  {
    number: '04',
    label: 'LAUNCH',
    title: 'Into Real Hands',
    desc: 'Put the venture into the hands of real users.',
  },
  {
    number: '05',
    label: 'SCALE',
    title: 'Sustainable Growth',
    desc: 'Turn validated products into sustainable businesses.',
  },
];

export default function VentureBuildingProcess() {
  return (
    <section
      id="how-we-build-ventures"
      className="py-20 lg:py-28 relative overflow-hidden border-b border-white/[0.08] bg-[#0A0D15] text-white"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#FF5C00]/6 blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF7A1A] shadow-xs mb-4">
            Our Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] text-white">
            How We Build <span className="italic text-[#FF5C00]">Ventures</span>
          </h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-slate-400">
            We believe great ventures begin with meaningful problems — not technology for technology's sake.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-[2.5rem] left-0 right-0 h-px bg-white/10"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group"
              >
                {/* Step card */}
                <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 h-full flex flex-col gap-4 transition-all duration-300 shadow-lg hover:border-[#FF5C00]/40 hover:shadow-[0_0_25px_rgba(255,92,0,0.1)]">
                  {/* Number bubble */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm border border-[#FF5C00]/30 bg-[#141828] text-[#FF5C00] shadow-xs">
                      {step.number}
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF7A1A]">
                      {step.label}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-display text-base font-bold mb-1.5 text-white group-hover:text-[#FF7A1A] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm font-normal leading-relaxed text-slate-400">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
