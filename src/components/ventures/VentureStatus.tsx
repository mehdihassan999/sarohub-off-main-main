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
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold backdrop-blur-md';
    }
    if (s.includes('expanding')) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold backdrop-blur-md';
    }
    if (s.includes('development') || s.includes('dev')) {
      return 'bg-[#FF5C00]/15 text-[#FF7A1A] border-[#FF5C00]/35 font-bold backdrop-blur-md';
    }
    if (s.includes('beta')) {
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold backdrop-blur-md';
    }
    if (s.includes('prototype')) {
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30 font-bold backdrop-blur-md';
    }
    if (s.includes('research')) {
      return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 font-bold backdrop-blur-md';
    }
    if (s.includes('idea')) {
      return 'bg-white/10 text-slate-200 border-white/20 font-bold backdrop-blur-md';
    }
    return 'bg-[#FF5C00]/15 text-[#FF7A1A] border-[#FF5C00]/35 font-bold backdrop-blur-md';
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
