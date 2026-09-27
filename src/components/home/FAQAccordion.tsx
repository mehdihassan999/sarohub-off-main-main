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
    <section id="faqs" className="py-12 lg:py-16 bg-[#FBFBFB] border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* NexStudio Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6 pb-6 border-b border-gray-200">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              Knowledge Hub
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black">
              Frequently Asked <span className="italic">Questions</span>
            </h2>
          </div>

          {faqs.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-xs font-mono uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all cursor-pointer shrink-0 font-semibold shadow-xs"
            >
              {allOpen ? 'Collapse All' : 'Expand All'}
            </button>
          )}
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 font-mono text-xs text-gray-600 uppercase">
            No corporate FAQs are registered on the platform.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndices.has(idx);

              return (
                <div
                  key={faq.id || idx}
                  className="rounded-3xl border border-gray-200 bg-white hover:border-black transition-all overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-6 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold text-black leading-snug tracking-tight">
                      {faq.question}
                    </span>
                    <span className="size-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 transition-colors">
                      {isOpen ? <Minus className="size-4 text-black" /> : <Plus className="size-4 text-black" />}
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
                        <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 text-sm sm:text-base text-gray-700 leading-relaxed font-normal border-t border-gray-100">
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
