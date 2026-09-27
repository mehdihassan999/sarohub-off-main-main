import React from 'react';
import { VentureStatusType } from '../../types';

interface VentureStatusProps {
  status: VentureStatusType | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function VentureStatus({ status, size = 'sm' }: VentureStatusProps) {
  const getStatusStyles = (st: string) => {
    const s = st ? st.toLowerCase() : '';
    if (s.includes('active')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    }
    if (s.includes('expanding')) {
      return 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold';
    }
    if (s.includes('development') || s.includes('dev')) {
      return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
    }
    if (s.includes('beta')) {
      return 'bg-blue-50 text-blue-800 border-blue-300 font-bold';
    }
    if (s.includes('prototype')) {
      return 'bg-purple-50 text-purple-800 border-purple-300 font-bold';
    }
    if (s.includes('research')) {
      return 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold';
    }
    if (s.includes('idea')) {
      return 'bg-slate-100 text-slate-800 border-slate-300 font-bold';
    }
    return 'bg-blue-50 text-blue-800 border-blue-300 font-bold';
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-xs sm:text-sm',
    lg: 'px-4 py-2 text-sm sm:text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono font-bold uppercase tracking-wider rounded-full border shadow-sm ${sizeClasses[size]} ${getStatusStyles(
        status
      )}`}
    >
      <span className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
      {status}
    </span>
  );
}
