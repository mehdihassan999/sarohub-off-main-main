import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../api';

interface StatsProps {
  apiStats?: any;
}

// Animated dynamic count-up component
function AnimatedNumber({ targetValue, duration = 1800 }: { targetValue: string; duration?: number }) {
  const [currentDisplay, setCurrentDisplay] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  const match = targetValue.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = match ? match[1] : '';
  const numericTarget = match ? parseFloat(match[2]) : null;
  const suffix = match ? match[3] : '';

  useEffect(() => {
    if (numericTarget === null || isNaN(numericTarget)) {
      setCurrentDisplay(targetValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * numericTarget);

            setCurrentDisplay(`${prefix}${currentVal.toLocaleString()}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCurrentDisplay(targetValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [targetValue, numericTarget, prefix, suffix, duration, hasAnimated]);

  return (
    <span ref={elementRef} className="tabular-nums font-mono">
      {hasAnimated ? currentDisplay : (numericTarget !== null ? `${prefix}0${suffix}` : targetValue)}
    </span>
  );
}

export default function CompanyStatistics({ apiStats }: StatsProps) {
  const [metrics, setMetrics] = useState<any[]>([]);

  const defaultFallbackMetrics = [
    { id: 1, number: '10+', label: 'Products & Ventures', description: 'Proprietary platforms & ventures engineered', order: 1, active: true },
    { id: 2, number: '560+', label: 'Platform Users', description: 'Active learners, administrators & businesses', order: 2, active: true },
    { id: 3, number: '64+', label: 'Tech Mentors & Staff', description: 'Engineers, instructors & core personnel', order: 3, active: true },
    { id: 4, number: '10+', label: 'Delivered Projects', description: 'Mission-critical systems delivered for partners', order: 4, active: true }
  ];

  const isInvalidPlaceholder = (val: string) => {
    if (!val) return true;
    const clean = val.trim().toLowerCase();
    return clean === '0' || clean === '0+' || clean === '00' || clean === '0 products' || clean === '0+ users';
  };

  const fetchDynamicMetrics = async () => {
    try {
      const data = await api.getStats();
      if (Array.isArray(data) && data.length > 0) {
        const sorted = data
          .filter((item: any) => item.active !== false && !isInvalidPlaceholder(item.number))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setMetrics(sorted.length > 0 ? sorted : defaultFallbackMetrics);
      } else {
        setMetrics(defaultFallbackMetrics);
      }
    } catch {
      setMetrics(defaultFallbackMetrics);
    }
  };

  useEffect(() => {
    if (apiStats && Array.isArray(apiStats) && apiStats.length > 0) {
      const valid = apiStats.filter((item: any) => item.active !== false && !isInvalidPlaceholder(item.number));
      setMetrics(valid.length > 0 ? valid : defaultFallbackMetrics);
    } else {
      fetchDynamicMetrics();
    }
  }, [apiStats]);

  const displayList = metrics.filter(item => !isInvalidPlaceholder(item.number));

  if (displayList.length === 0) {
    return null;
  }

  return (
    <section 
      id="company-statistics" 
      className="bg-[#0A0D15] py-14 lg:py-20 text-white rounded-3xl sm:rounded-4xl mx-3 sm:mx-6 lg:mx-8 my-6 sm:my-8 overflow-hidden border border-white/[0.08] relative shadow-2xl"
    >
      {/* Ambient orange glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5C00]/8 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-10 lg:mb-12">
          <span className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest block mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            Verified Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white">
            Real Products. Real Projects. <span className="italic text-[#FF5C00]">Growing Every Day.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 lg:divide-x divide-white/[0.08]">
          {displayList.map((item, idx) => (
            <div key={item.id || idx} className="pt-6 sm:pt-0 lg:px-8 first:pl-0">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-bold -tracking-[1.8px] text-white block mb-2 font-mono group">
                <AnimatedNumber targetValue={item.number} />
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-1.5">{item.label}</h4>
              <p className="text-sm text-slate-400 font-normal leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
