import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, Globe, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductsProps {
  products: any[];
}


export default function CompanyProducts({ products }: ProductsProps) {
  // Use API products only — if none, show an empty state
  const displayProducts = Array.isArray(products) ? products : [];

  return (
    <section
      id="company-products"
      className="py-12 lg:py-16 relative border-t border-b overflow-hidden bg-slate-950"
      style={{ borderColor: 'var(--border-app)' }}
    >
      {/* Ambient glowing effects */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay -z-10"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 border border-slate-800 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-md mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Our Ventures
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white mb-6"
          >
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">What Comes Next.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base font-medium leading-relaxed text-slate-400 max-w-2xl mx-auto"
          >
            Alongside our client work, we develop and scale our own digital products and ventures. We combine design, engineering, and entrepreneurial execution to create sustainable digital businesses.
          </motion.p>
          <p className="mt-2 text-xs text-slate-500">Showing <strong>{displayProducts.length}</strong> ventures</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 hover:from-purple-500/50 hover:to-blue-600/50 transition-all duration-500"
            >
              <div className="relative h-full bg-slate-950/90 backdrop-blur-xl rounded-[31px] flex flex-col overflow-hidden">

                {/* Image Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                  <img
                    src={item.thumbnail_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=450'}
                    alt={item.title}
                    className="w-full h-full object-cover filter group-hover:scale-105 group-hover:brightness-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md text-amber-400 text-[9px] font-black tracking-[0.15em] uppercase shadow-xl">
                      <Clock className="h-3 w-3" />
                      {item.status || 'IN DEVELOPMENT'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col relative z-20 -mt-6">

                  {/* Decorative Number */}
                  <div className="absolute -top-10 -right-4 text-8xl font-black text-slate-800/30 group-hover:text-purple-500/10 transition-colors duration-500 pointer-events-none font-display">
                    0{idx + 1}
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {item.description || item.short_description}
                  </p>

                  {/* Bullet Features */}
                  {Array.isArray(item.features) && (
                    <div className="mb-8 flex-1">
                      <div className="h-[1px] w-12 bg-slate-800 mb-4 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-transparent transition-all duration-500" />
                      <ul className="space-y-2.5">
                        {item.features.slice(0, 3).map((feat: string, i: number) => (
                          <li key={i} className="flex gap-3 items-start text-[11px] font-bold text-slate-300 tracking-wide">
                            <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 opacity-80" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-5 border-t border-slate-800/50 flex items-center justify-between">
                    <Link
                      to="/products"
                      className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 hover:text-purple-400 transition-colors"
                    >
                      Explore Project
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {item.demo_url && (
                      <a
                        href={item.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-500 hover:text-white hover:border-purple-400 transition-all group/demo"
                        title="View Live Demo"
                      >
                        <Globe className="h-3.5 w-3.5 group-hover/demo:animate-pulse" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-slate-800 bg-slate-900/50 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 hover:border-slate-700 transition-all hover:scale-105"
          >
            View All Ventures
          </Link>
        </div>
      </div>
    </section>
  );
}
