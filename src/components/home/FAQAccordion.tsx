import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQProps {
  faqs: any[];
}

export default function FAQAccordion({ faqs }: FAQProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));

  const toggleIndex = (idx: number) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const allOpen = faqs.length > 0 && openIndices.size === faqs.length;

  const toggleAll = () => {
    if (allOpen) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(faqs.map((_, idx) => idx)));
    }
  };

  return (
    <section id="faqs" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
              Knowledge Hub
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white">
              Frequently Asked <span className="italic text-[#FF5C00]">Questions</span>
            </h2>
          </div>

          {faqs.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="px-4 py-2 rounded-full border border-white/15 bg-white/[0.04] text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-[#FF5C00]/40 transition-all cursor-pointer shrink-0 font-semibold"
            >
              {allOpen ? 'Collapse All' : 'Expand All'}
            </button>
          )}
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-[#0E121E] rounded-3xl border border-white/[0.08] font-mono text-xs text-slate-400 uppercase">
            No corporate FAQs are registered on the platform.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndices.has(idx);

              return (
                <div
                  key={faq.id || idx}
                  className={`rounded-3xl border transition-all overflow-hidden shadow-lg ${
                    isOpen 
                      ? 'border-[#FF5C00]/50 bg-[#0E121E] shadow-[0_0_25px_rgba(255,92,0,0.12)]' 
                      : 'border-white/[0.08] bg-[#0E121E]/90 hover:border-white/20 hover:bg-[#121624]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-6 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold text-white leading-snug tracking-tight">
                      {faq.question}
                    </span>
                    <span className={`size-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#FF5C00] text-white shadow-[0_0_12px_rgba(255,92,0,0.5)]' : 'bg-white/[0.06] text-slate-300'
                    }`}>
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed font-normal border-t border-white/[0.08]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
