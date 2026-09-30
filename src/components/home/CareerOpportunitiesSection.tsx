import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, GraduationCap, MapPin, Clock, ArrowRight, DollarSign,
  Calendar, Sparkles, CheckCircle2, ChevronRight, Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../api';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

export default function CareerOpportunitiesSection() {
  const [careers, setCareers] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [careersData, oppsData] = await Promise.all([
        api.getCareers().catch(() => []),
        api.getOpportunities().catch(() => [])
      ]);

      const activeCareers = Array.isArray(careersData)
        ? careersData.filter((c: any) => c.is_active !== false)
        : [];

      const activeOpps = Array.isArray(oppsData)
        ? oppsData.filter((o: any) => {
            const isPub = o.is_published === true || o.is_published === 1 || o.is_published === 'true' || o.is_published === '1' || o.is_published === undefined;
            const st = (o.status || 'open').toLowerCase();
            return isPub && (st === 'open' || st === 'active');
          })
        : [];

      setCareers(activeCareers);
      setOpportunities(activeOpps);
    } catch (err) {
      console.error('Failed to load career opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sarohub-data-updated', loadData);
    return () => window.removeEventListener('sarohub-data-updated', loadData);
  }, []);

  const totalCount = careers.length + opportunities.length;

  return (
    <section id="careers-preview" className="py-14 lg:py-20 bg-[#08090E] border-b border-white/[0.08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF5C00] bg-[#FF5C00]/10 border border-[#FF5C00]/25 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-2xs">
              <Briefcase className="size-3.5 text-[#FF5C00]" />
              <span>We Are Actively Hiring &amp; Incubating Talent</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white">
              Careers, Internships &amp; <span className="italic text-[#FF5C00]">Fellowships</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed mt-3">
              Join SaroHub Technologies to build next-generation distributed software, cognitive AI architectures, and proprietary ventures. Explore open positions and academic fellowships.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              to="/careers"
              className="group px-7 py-3.5 inline-flex gap-2.5 items-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-[#FFA566]/30"
            >
              <RollText>VIEW ALL POSITIONS</RollText>
              <DiagonalArrow size={16} />
            </Link>
            <Link
              to="/opportunities"
              className="group px-6 py-3.5 rounded-full bg-white/[0.04] border border-white/15 text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-[#FF5C00]/40 text-xs sm:text-sm font-semibold tracking-wide transition-all inline-flex items-center gap-2"
            >
              <span>FELLOWSHIPS</span>
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Content Showcase */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-[#0E121E] border border-white/[0.08] p-6 animate-pulse"></div>
            ))}
          </div>
        ) : totalCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Direct Careers / Job Openings */}
            {careers.map((job) => (
              <div 
                key={`career-${job.id}`} 
                className="rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group text-left shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#FF5C00]/10 text-[#FF7A1A] border border-[#FF5C00]/25 uppercase tracking-wider">
                      {job.job_type || 'Full-Time Job'}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                      {job.location || 'Hybrid / Onsite'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#FF7A1A] transition-colors line-clamp-1 mb-1.5">
                    {job.position}
                  </h3>

                  <p className="text-xs sm:text-sm font-bold text-[#FF5C00] font-mono uppercase tracking-wider mb-3">
                    {job.department} {job.experience ? `• ${job.experience}` : ''}
                  </p>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  {job.salary && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl w-fit mb-4">
                      <DollarSign className="size-4 text-emerald-400 shrink-0" />
                      <span>{job.salary}</span>
                    </div>
                  )}

                  {Array.isArray(job.skills) && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills.slice(0, 4).map((sk: string, i: number) => (
                        <span key={i} className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/10">
                          {sk}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-xs font-mono font-medium px-2 py-1 rounded-md bg-white/[0.02] text-slate-400">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-slate-400">
                    SaroHub HQ
                  </span>
                  <Link
                    to="/careers"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] text-xs font-bold tracking-wide transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Vacancy</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}

            {/* 2. Opportunities, Scholarships & Internships */}
            {opportunities.map((opp) => (
              <div 
                key={`opp-${opp.id}`} 
                className="rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group text-left shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#FF5C00]/10 text-[#FF7A1A] uppercase tracking-wider border border-[#FF5C00]/25">
                      {opp.type || 'Program'}
                    </span>
                    {opp.duration && (
                      <span className="text-xs font-mono font-semibold text-slate-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                        {opp.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#FF7A1A] transition-colors line-clamp-1 mb-1.5">
                    {opp.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-bold text-slate-400 font-mono uppercase tracking-wider mb-3">
                    {opp.location || 'SaroHub Academic & Research Wing'}
                  </p>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal line-clamp-2 mb-4">
                    {opp.short_description || opp.description}
                  </p>

                  {opp.benefits && (
                    <div className="text-sm text-slate-300 bg-white/[0.04] border border-white/10 p-3 rounded-xl line-clamp-2 mb-4 font-normal">
                      <span className="font-bold text-[#FF7A1A] block mb-1">Benefits:</span>
                      {opp.benefits}
                    </div>
                  )}

                  {opp.deadline && (
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30 px-3.5 py-1.5 rounded-xl w-fit mb-4">
                      <Calendar className="size-4 text-rose-400" />
                      <span>Deadline: {opp.deadline}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-slate-400">
                    {opp.positions_count ? `${opp.positions_count} Seats Available` : 'Open Program'}
                  </span>
                  <Link
                    to="/opportunities"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] text-xs font-bold tracking-wide transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read &amp; Apply</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-[#0E121E] rounded-3xl border border-white/[0.08] shadow-2xl max-w-2xl mx-auto">
            <Briefcase className="size-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">
              General Talent Pool Open
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal mb-6">
              We are constantly reviewing talented software engineers, AI researchers, and UI/UX architects. Submit your profile for priority consideration.
            </p>
            <Link
              to="/careers"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_0_24px_rgba(255,92,0,0.4)] inline-flex items-center gap-2 border border-[#FFA566]/30"
            >
              <span>SUBMIT RESUME</span>
              <DiagonalArrow size={16} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
