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
    <section id="careers-preview" className="py-16 lg:py-24 bg-[#FBFBFB] border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-700 bg-cyan-50 border border-cyan-200/80 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-2xs">
              <Briefcase className="size-3.5 text-cyan-600" />
              <span>We Are Actively Hiring &amp; Incubating Talent</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black">
              Careers, Internships &amp; <span className="italic">Fellowships</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed mt-3">
              Join SaroHub Technologies to build next-generation distributed software, cognitive AI architectures, and proprietary ventures. Explore open positions and academic fellowships.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              to="/careers"
              className="group px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs inline-flex items-center gap-2"
            >
              <RollText>VIEW ALL POSITIONS</RollText>
              <DiagonalArrow size={16} />
            </Link>
            <Link
              to="/opportunities"
              className="group px-6 py-3 rounded-full bg-white border border-gray-300 text-black hover:bg-gray-50 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-2xs inline-flex items-center gap-2"
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
              <div key={n} className="h-64 rounded-2xl bg-white border border-gray-200 p-6 animate-pulse"></div>
            ))}
          </div>
        ) : totalCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Direct Careers / Job Openings */}
            {careers.map((job) => (
              <div 
                key={`career-${job.id}`} 
                className="rounded-2xl border border-gray-200 bg-white hover:border-black hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-mono font-bold bg-slate-950 text-white uppercase tracking-wider">
                      {job.job_type || 'Full-Time Job'}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                      {job.location || 'Hybrid / Onsite'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-black group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                    {job.position}
                  </h3>

                  <p className="text-sm sm:text-base font-bold text-blue-700 font-mono uppercase tracking-wider mb-3">
                    {job.department} {job.experience ? `• ${job.experience}` : ''}
                  </p>

                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  {job.salary && (
                    <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl w-fit mb-4">
                      <DollarSign className="size-4.5 text-emerald-600 shrink-0" />
                      <span>{job.salary}</span>
                    </div>
                  )}

                  {Array.isArray(job.skills) && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills.slice(0, 4).map((sk: string, i: number) => (
                        <span key={i} className="text-xs sm:text-[13px] font-mono font-bold px-2.5 py-1 rounded bg-gray-100 text-gray-900 border border-gray-200">
                          {sk}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-xs sm:text-[13px] font-mono font-bold px-2 py-1 rounded bg-gray-50 text-gray-700">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono font-medium text-gray-600">
                    SaroHub HQ
                  </span>
                  <Link
                    to="/careers"
                    className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-blue-600 text-xs sm:text-sm font-bold tracking-wide transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                className="rounded-2xl border border-gray-200 bg-white hover:border-black hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-mono font-bold bg-cyan-950 text-cyan-200 uppercase tracking-wider border border-cyan-800">
                      {opp.type || 'Program'}
                    </span>
                    {opp.duration && (
                      <span className="text-xs sm:text-sm font-mono font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                        {opp.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-black group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                    {opp.title}
                  </h3>

                  <p className="text-sm sm:text-base font-bold text-gray-700 font-mono uppercase tracking-wider mb-3">
                    {opp.location || 'SaroHub Academic & Research Wing'}
                  </p>

                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal line-clamp-2 mb-4">
                    {opp.short_description || opp.description}
                  </p>

                  {opp.benefits && (
                    <div className="text-sm text-slate-800 bg-slate-50 border border-slate-200 p-3 rounded-xl line-clamp-2 mb-4 font-normal">
                      <span className="font-bold text-slate-900 block mb-1">Benefits:</span>
                      {opp.benefits}
                    </div>
                  )}

                  {opp.deadline && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-xl w-fit mb-4">
                      <Calendar className="size-4 text-rose-500" />
                      <span>Deadline: {opp.deadline}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono font-medium text-gray-600">
                    {opp.positions_count ? `${opp.positions_count} Seats Available` : 'Open Program'}
                  </span>
                  <Link
                    to="/opportunities"
                    className="px-5 py-2.5 rounded-xl bg-cyan-700 text-white hover:bg-cyan-800 text-xs sm:text-sm font-bold tracking-wide transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Read &amp; Apply</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-gray-200 shadow-xs max-w-2xl mx-auto">
            <Briefcase className="size-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-black mb-1">
              General Talent Pool Open
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal mb-6">
              We are constantly reviewing talented software engineers, AI researchers, and UI/UX architects. Submit your profile for priority consideration.
            </p>
            <Link
              to="/careers"
              className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs inline-flex items-center gap-2"
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
