import React, { useState, useEffect } from 'react';
import { 
  Globe, Smartphone, Layers, Cpu, Code2, Server, Layout, HeartHandshake, 
  ArrowRight, Users2, LineChart, Rocket, X, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../api';
import { Partner } from '../../types';
import PartnerCard from '../partners/PartnerCard';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartnerImage, setSelectedPartnerImage] = useState<{ url: string; partnerName: string } | null>(null);

  useEffect(() => {
    api.getPartners()
      .then((data) => {
        setPartners(data || []);
      })
      .catch((err) => {
        console.error('Failed to load dynamic partners:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const partnerServices = [
    { name: 'Web Development', icon: Globe },
    { name: 'Mobile Development', icon: Smartphone },
    { name: 'SaaS Development', icon: Layers },
    { name: 'AI Integration', icon: Cpu },
    { name: 'Custom Software', icon: Code2 },
    { name: 'Backend & API Dev', icon: Server },
    { name: 'UI/UX Implementation', icon: Layout },
    { name: 'Maintenance & Support', icon: HeartHandshake },
  ];

  const marqueeList = [...partnerServices, ...partnerServices, ...partnerServices];

  const categories = ['all', ...Array.from(new Set(partners.map(p => p.category)))];

  const filteredPartners = activeCategory === 'all' 
    ? partners 
    : partners.filter(p => p.category === activeCategory);

  const handlePartnerClick = () => {
    const contactSection = document.getElementById('contact-preview');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const msgInput = document.getElementById('contact-message') as HTMLTextAreaElement;
      if (msgInput) {
        msgInput.value = `Hello SaroHub Team, I am interested in exploring a partnership...`;
      }
    }
  };

  return (
    <section id="partnerships" className="relative bg-white border-b border-gray-200">
      
      {/* 1. Signature NexStudio Marquee Bar */}
      <div className="py-8 border-b border-gray-200 bg-white overflow-hidden relative">
        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex w-max items-center animate-infinite-scroll gap-6">
            {marqueeList.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-gray-200 bg-[#FBFBFB] text-xs font-mono font-medium text-black select-none shrink-0"
                >
                  <Icon className="h-3.5 w-3.5 text-gray-500" />
                  <span>{service.name.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Partnership Section */}
      <div className="py-12 lg:py-16 max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2"
          >
            Partnerships &amp; Collaboration
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-3"
          >
            Partner With <span className="italic">SaroHub</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base leading-relaxed text-gray-700 max-w-2xl mx-auto font-normal"
          >
            We collaborate with government sectors, public institutions, agencies, enterprises, and tech founders to deliver resilient digital infrastructure, mission-critical software, and scalable ventures.
          </motion.p>
        </div>

        {/* Dynamic Corporate Partners Grid */}
        <div className="mb-10 sm:mb-12">
          {/* Filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-black text-white shadow-xs font-semibold'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All Collaborations' : cat}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : filteredPartners.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredPartners.map((p) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={p.id}
                    className="h-full"
                  >
                    <PartnerCard
                      partner={p}
                      onSelectImage={(url, name) => setSelectedPartnerImage({ url, partnerName: name })}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-[#FBFBFB] rounded-3xl border border-gray-200">
              <Users2 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-black">Partnership Network Growing</h3>
              <p className="text-sm text-gray-700 mt-2 max-w-md mx-auto font-normal">
                We are currently updating our partner and government collaboration profiles. Check back soon for the latest deployments.
              </p>
            </div>
          )}
        </div>

        {/* 3 Step Partnership Flow (NexStudio Numbered Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#FBFBFB] border border-gray-200 hover:border-black hover:shadow-md transition-all duration-300 shadow-xs"
          >
            <span className="text-2xl sm:text-3xl font-mono font-bold italic text-black block mb-3">01</span>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
              Share Your Vision
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              Tell us about your product idea, client project, or business challenge so we can align on objectives, timelines, and milestones.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#FBFBFB] border border-gray-200 hover:border-black hover:shadow-md transition-all duration-300 shadow-xs"
          >
            <span className="text-2xl sm:text-3xl font-mono font-bold italic text-black block mb-3">02</span>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
              We Build the Tech
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              Our engineering team handles full architecture, design systems, robust APIs, automated tests, and continuous delivery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#FBFBFB] border border-gray-200 hover:border-black hover:shadow-md transition-all duration-300 shadow-xs"
          >
            <span className="text-2xl sm:text-3xl font-mono font-bold italic text-black block mb-3">03</span>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
              Deliver &amp; Scale
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              Launch reliable software that solves real problems, satisfies users, and scales seamlessly with your business expansion.
            </p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handlePartnerClick}
            className="group px-8 py-4 inline-flex items-center justify-center gap-2.5 bg-black text-white rounded-full text-sm font-semibold -tracking-[0.2px] hover:bg-gray-800 transition-all cursor-pointer shadow-xs"
          >
            <RollText>BECOME A PARTNER</RollText>
            <DiagonalArrow size={18} />
          </button>
        </div>

      </div>

      {/* High-Resolution Partner Showcase Lightbox Modal */}
      <AnimatePresence>
        {selectedPartnerImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPartnerImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-2xl p-4 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-xs font-mono uppercase text-black font-semibold">
                  {selectedPartnerImage.partnerName} — Showcase Asset
                </span>
                <button
                  onClick={() => setSelectedPartnerImage(null)}
                  className="p-1.5 rounded-full bg-gray-100 text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 flex items-center justify-center overflow-hidden max-h-[75vh]">
                <img
                  src={selectedPartnerImage.url}
                  alt={selectedPartnerImage.partnerName}
                  className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-md"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
