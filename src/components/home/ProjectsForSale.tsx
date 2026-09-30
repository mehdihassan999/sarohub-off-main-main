import React from 'react';
import { ShoppingCart, Check, Globe, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface SaleProjectsProps {
  saleProjects: any[];
}

export default function ProjectsForSale({ saleProjects }: SaleProjectsProps) {
  if (!saleProjects || saleProjects.length === 0) {
    return null;
  }

  const handleInquiry = (title: string) => {
    // Scroll to contact and populate name/subject if possible
    const contactSection = document.getElementById('contact-preview');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const subjectInput = document.getElementById('contact-subject') as HTMLInputElement;
      if (subjectInput) {
        subjectInput.value = `Inquiry regarding "${title}"`;
      }
    }
  };

  return (
    <section 
      id="sale-projects" 
      className="py-14 lg:py-20 relative overflow-hidden border-b border-white/[0.08] bg-[#08090E]"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Available Software
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white mb-3">
            Ready-to-Deploy <span className="italic text-[#FF5C00]">Software</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            Pre-built software and scalable templates available for immediate deployment and custom adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {saleProjects.map((item, idx) => (
              <motion.article
                key={item.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative bg-[#141828] border-b border-white/[0.08]">
                    <img
                      src={item.thumbnail_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Price tag */}
                    <div 
                      className="absolute top-4 right-4 rounded-xl border px-3 py-1.5 shadow-md flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-[#FF7A1A] border-[#FF5C00]/30"
                    >
                      <span className="text-[10px] font-mono uppercase text-slate-400">USD</span>
                      <span className="text-xs sm:text-sm font-bold text-white font-mono">
                        ${item.price || 'Contact'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FF7A1A] transition-colors tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm font-normal leading-relaxed line-clamp-3 text-slate-400">
                        {item.short_description}
                      </p>
                    </div>

                    {/* Features checklist */}
                    {Array.isArray(item.features) && (
                      <ul className="space-y-1.5">
                        {item.features.slice(0, 3).map((feat: string, i: number) => (
                          <li key={i} className="flex gap-2 items-start text-xs sm:text-sm font-medium text-slate-300">
                            <Check className="h-4 w-4 text-[#FF5C00] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Foot Action Buttons */}
                <div className="p-6 pt-0">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {Array.isArray(item.technology) ? item.technology.map((tech: string, i: number) => (
                      <span 
                        key={i} 
                        className="text-[11px] font-mono font-medium rounded-lg px-2.5 py-1 uppercase tracking-wider border border-white/10 bg-white/[0.04] text-slate-300"
                      >
                        {tech}
                      </span>
                    )) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.08]">
                    {item.demo_url ? (
                      <a
                        href={item.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-white flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>Live Demo</span>
                      </a>
                    ) : (
                      <div />
                    )}
                    <button
                      type="button"
                      onClick={() => handleInquiry(item.title)}
                      className="px-3 py-2.5 bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_20px_rgba(255,92,0,0.5)] text-white border border-[#FFA566]/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Inquire Now</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    );
  }
