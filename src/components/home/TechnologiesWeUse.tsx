import React from 'react';
import { 
  Atom, Database, Code2, Server, Layout, FileCode, Cloud, Terminal, Compass, Palette
} from 'lucide-react';
import { motion } from 'motion/react';

export default function TechnologiesWeUse() {
  const techs = [
    { name: 'React', icon: Atom, desc: 'Component architectures & interfaces' },
    { name: 'Node.js', icon: Server, desc: 'High-throughput runtime backend' },
    { name: 'Express.js', icon: Code2, desc: 'Enterprise REST & microservices' },
    { name: 'MySQL', icon: Database, desc: 'Relational ACID persistence' },
    { name: 'Tailwind CSS', icon: Layout, desc: 'Precision utility-first design' },
    { name: 'JavaScript', icon: FileCode, desc: 'Modern ECMAScript standard' },
    { name: 'TypeScript', icon: Terminal, desc: 'Strict types & reliable builds' },
    { name: 'Docker', icon: Cloud, desc: 'Isolated container deployment' },
    { name: 'Git', icon: Compass, desc: 'Distributed version control' },
    { name: 'Figma', icon: Palette, desc: 'Design systems & prototyping' },
    { name: 'Cloud Tech', icon: Cloud, desc: 'Scalable distributed infrastructure' },
  ];

  return (
    <section id="technologies" className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
            Engineering Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-3">
            Technologies We <span className="italic">Build With</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
            We engineer software solutions using proven, high-performance open-source platforms and enterprise frameworks.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {techs.map((tech, idx) => {
            const Icon = tech.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="p-6 rounded-3xl border border-gray-200 bg-white hover:border-black hover:shadow-md transition-all duration-300 flex flex-col items-center text-center justify-between group shadow-xs"
              >
                <div className="size-12 rounded-2xl bg-[#FBFBFB] border border-gray-200 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                  <Icon className="size-5 stroke-[1.8]" />
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-600 font-medium leading-normal">
                    {tech.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
