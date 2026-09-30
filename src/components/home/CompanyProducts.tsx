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
      className="py-14 lg:py-20 relative border-b border-white/[0.08] overflow-hidden bg-[#08090E]"
    >
      {/* Ambient glowing effects */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[350px] bg-[#FF5C00]/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF7A1A] mb-4"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FF5C00]" />
            Our Ventures
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-4"
          >
            Building <span className="italic text-[#FF5C00]">What Comes Next.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base font-normal leading-relaxed text-slate-400 max-w-2xl mx-auto"
          >
            Alongside our client work, we develop and scale our own digital products and ventures. We combine design, engineering, and entrepreneurial execution to create sustainable digital businesses.
          </motion.p>
          <p className="mt-2 text-xs font-mono text-slate-500">Showing <strong className="text-white">{displayProducts.length}</strong> ventures</p>
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
              className="group relative rounded-3xl overflow-hidden bg-[#0E121E] border border-white/[0.08] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-500 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-48 sm:h-56 overflow-hidden bg-[#141828]">
                <img
                  src={item.thumbnail_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=450'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-[#FF7A1A] text-[10px] font-mono font-bold tracking-wider uppercase">
                    <Clock className="h-3 w-3 text-[#FF5C00]" />
                    {item.status || 'IN DEVELOPMENT'}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 group-hover:text-[#FF7A1A] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-3 font-normal">
                    {item.description || item.short_description}
                  </p>

                  {/* Bullet Features */}
                  {Array.isArray(item.features) && (
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {item.features.slice(0, 3).map((feat: string, i: number) => (
                          <li key={i} className="flex gap-2.5 items-start text-xs font-medium text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-[#FF5C00] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between">
                  <Link
                    to="/products"
                    className="text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-[#FF5C00] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Explore Project</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {item.demo_url && (
                    <a
                      href={item.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#FF5C00] hover:text-white hover:border-[#FF5C00] transition-all"
                      title="View Live Demo"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/10 bg-white/[0.04] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/[0.08] hover:border-[#FF5C00]/40 transition-all hover:scale-102"
          >
            View All Ventures
          </Link>
        </div>
      </div>
    </section>
  );
}
