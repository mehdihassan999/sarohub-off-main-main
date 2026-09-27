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
      className="py-12 lg:py-16 relative overflow-hidden border-b border-gray-200 bg-[#FBFBFB]"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
            Available Software
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-3">
            Ready-to-Deploy <span className="italic">Software</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
            Pre-built software and scalable templates available for immediate deployment and custom adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {saleProjects.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-3xl border border-gray-200 bg-white hover:border-black hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative bg-gray-100 border-b border-gray-200">
                    <img
                      src={item.thumbnail_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Price tag */}
                    <div 
                      className="absolute top-4 right-4 rounded-xl border px-3 py-1.5 shadow-md flex items-center gap-1.5 bg-black text-white border-black/40"
                    >
                      <span className="text-[10px] font-mono uppercase text-gray-400">USD</span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        ${item.price || 'Contact'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-gray-700 transition-colors tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm font-normal leading-relaxed line-clamp-3 text-gray-700">
                        {item.short_description}
                      </p>
                    </div>

                    {/* Features checklist */}
                    {Array.isArray(item.features) && (
                      <ul className="space-y-1.5">
                        {item.features.slice(0, 3).map((feat: string, i: number) => (
                          <li key={i} className="flex gap-2 items-start text-xs sm:text-sm font-medium text-gray-700">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
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
                        className="text-[11px] font-mono font-medium rounded-md px-2.5 py-1 uppercase tracking-wider border border-gray-200 bg-gray-50 text-gray-800"
                      >
                        {tech}
                      </span>
                    )) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    {item.demo_url ? (
                      <a
                        href={item.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 bg-white hover:bg-black hover:text-white hover:border-black text-black flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs"
                      >
                        <Globe className="h-4 w-4 stroke-[1.8]" />
                        <span>Live Demo</span>
                      </a>
                    ) : (
                      <div />
                    )}
                    <button
                      type="button"
                      onClick={() => handleInquiry(item.title)}
                      className="px-3 py-2.5 bg-black hover:bg-gray-800 text-white border border-black rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="h-4 w-4 stroke-[1.8]" />
                      <span>Inquire Now</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
