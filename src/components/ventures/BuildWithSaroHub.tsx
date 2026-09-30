import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Rocket, Cpu, Code, Lightbulb, Globe, Briefcase, Users } from 'lucide-react';

const collaborationTypes = [
  { icon: Rocket, label: 'Venture Collaboration' },
  { icon: Globe, label: 'Technology Partnerships' },
  { icon: Code, label: 'Product Development' },
  { icon: Cpu, label: 'Software Development' },
  { icon: Lightbulb, label: 'AI Solutions' },
  { icon: Briefcase, label: 'Agency Partnerships' },
  { icon: Users, label: 'Startup Partnerships' },
];

const targetAudiences = [
  'Entrepreneurs',
  'Startups',
  'Technology Companies',
  'Software Agencies',
  'Businesses',
  'Organizations',
];

export default function BuildWithSaroHub() {
  return (
    <section
      id="build-with-sarohub"
      className="py-20 lg:py-28 relative overflow-hidden border-b border-white/[0.08] bg-[#08090E] text-white"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF5C00]/6 blur-[130px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Heading + CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF7A1A] shadow-xs mb-4"
            >
              Partnership &amp; Collaboration
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.5px] leading-tight text-white"
            >
              Build With <span className="italic text-[#FF5C00]">SaroHub</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-4 text-base sm:text-lg font-normal leading-relaxed max-w-xl text-slate-400"
            >
              Have an idea, product, business challenge, or technology opportunity? Let's build it together.
            </motion.p>

            {/* Audience tags */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {targetAudiences.map((audience) => (
                <span
                  key={audience}
                  className="px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0E121E] text-xs sm:text-sm font-medium text-slate-300 shadow-xs"
                >
                  {audience}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 border border-[#FFA566]/30 cursor-pointer"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Collaboration type cards */}
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest mb-6 text-slate-400">
              How We Collaborate
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collaborationTypes.map((type, i) => (
                <motion.div
                  key={type.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/[0.08] bg-[#0E121E] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF5C00]/40 hover:shadow-[0_0_20px_rgba(255,92,0,0.12)] cursor-pointer group"
                >
                  <div className="flex h-10 w-10 shrink-0 rounded-xl bg-[#141828] border border-white/10 items-center justify-center text-[#FF5C00] group-hover:bg-[#FF5C00] group-hover:text-white transition-all duration-300">
                    <type.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                    {type.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
