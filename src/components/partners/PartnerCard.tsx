import React, { useState } from 'react';
import { 
  Landmark, Layers, Cpu, LineChart, GraduationCap, HeartHandshake, 
  Network, Star, Handshake, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { Partner } from '../../types';

interface PartnerCardProps {
  key?: React.Key;
  partner: Partner;
  onSelectImage?: (url: string, partnerName: string) => void;
  className?: string;
}

export function getCategoryMeta(category: string) {
  const normalized = (category || '').toLowerCase().trim();

  if (normalized.includes('government') || normalized.includes('public sector') || normalized.includes('ministry')) {
    return {
      icon: Landmark,
      label: category || 'Government Sector',
      subLabel: 'Public Sector Collaboration',
    };
  }

  if (normalized.includes('agency')) {
    return {
      icon: Layers,
      label: category || 'Agency Partner',
      subLabel: 'Strategic Agency Alliance',
    };
  }

  if (normalized.includes('tech') || normalized.includes('cloud') || normalized.includes('software')) {
    return {
      icon: Cpu,
      label: category || 'Technology Partner',
      subLabel: 'Cloud & Tech Infrastructure',
    };
  }

  if (normalized.includes('investor') || normalized.includes('venture') || normalized.includes('capital')) {
    return {
      icon: LineChart,
      label: category || 'Investor & Venture',
      subLabel: 'Venture Capital Partner',
    };
  }

  if (normalized.includes('academic') || normalized.includes('education') || normalized.includes('university')) {
    return {
      icon: GraduationCap,
      label: category || 'Academic & Research',
      subLabel: 'Education Collaboration',
    };
  }

  if (normalized.includes('ngo') || normalized.includes('non-profit') || normalized.includes('community')) {
    return {
      icon: HeartHandshake,
      label: category || 'NGO & Non-Profit',
      subLabel: 'Social Impact Initiative',
    };
  }

  if (normalized.includes('ecosystem') || normalized.includes('incubation') || normalized.includes('hub')) {
    return {
      icon: Network,
      label: category || 'Ecosystem Partner',
      subLabel: 'Innovation & Startup Hub',
    };
  }

  return {
    icon: Handshake,
    label: category || 'Strategic Partner',
    subLabel: 'Ecosystem Partner',
  };
}

export default function PartnerCard({ partner, onSelectImage, className = '' }: PartnerCardProps) {
  const [imageError, setImageError] = useState(false);
  const meta = getCategoryMeta(partner.category);

  const showcaseImages = (partner.images || partner.gallery || [])
    .map((img: any) => typeof img === 'string' ? img : img?.url)
    .filter(Boolean);

  const websiteHref = partner.website_url 
    ? (partner.website_url.startsWith('http') ? partner.website_url : `https://${partner.website_url}`)
    : null;

  return (
    <article
      className={`p-6 sm:p-7 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 flex flex-col justify-between group shadow-lg ${className}`}
    >
      <div className="space-y-4">
        {/* Header with Logo, Name and Category */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Logo Container */}
            <div className="size-14 rounded-2xl bg-[#141828] border border-white/10 p-2 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              {partner.logo_url && !imageError ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-full w-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-sm font-mono font-bold text-[#FF7A1A]">
                  {partner.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FF7A1A] transition-colors line-clamp-1">
                  {partner.name}
                </h4>
                {partner.featured && (
                  <span title="Featured Partner" className="shrink-0 text-[#FF5C00]">
                    <Star className="h-3.5 w-3.5 fill-[#FF5C00]" />
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400 font-medium block line-clamp-1">
                {meta.subLabel}
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-white/[0.04] border border-white/10 text-slate-300 font-semibold shrink-0 shadow-xs">
            {meta.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 font-normal leading-relaxed line-clamp-3">
          {partner.description || 'Active ecosystem collaborator advancing digital technologies and strategic development.'}
        </p>

        {showcaseImages.length > 0 && (
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
              Showcase ({showcaseImages.length})
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {showcaseImages.map((imgUrl: string, imgIdx: number) => (
                <div
                  key={imgIdx}
                  onClick={() => onSelectImage?.(imgUrl, partner.name)}
                  className="h-12 w-16 rounded-xl overflow-hidden border border-white/10 bg-[#141828] shrink-0 hover:border-[#FF5C00] transition-all cursor-pointer"
                >
                  <img
                    src={imgUrl}
                    alt={`${partner.name} asset ${imgIdx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono uppercase">
        {websiteHref ? (
          <a
            href={websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF5C00] font-semibold hover:text-[#FFA043] flex items-center gap-1 transition-colors"
          >
            <span>Visit Portal</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-slate-500">Active Partner</span>
        )}

        <span className="text-slate-400 flex items-center gap-1 text-[10px]">
          <ShieldCheck className="h-3 w-3 text-[#FF5C00]" />
          <span>Verified</span>
        </span>
      </div>
    </article>
  );
}
