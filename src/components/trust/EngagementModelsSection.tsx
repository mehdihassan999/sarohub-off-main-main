import React, { useState, useEffect } from 'react';
import { 
  Briefcase, CheckCircle2, Zap, Users, Rocket, Shield, 
  ArrowRight, Award, Layers
} from 'lucide-react';
import { api } from '../../api';
import { EngagementModel } from '../../types';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface EngagementModelsSectionProps {
  onSelectModel?: (model: EngagementModel) => void;
  onOpenConsultation?: (modelTitle?: string) => void;
  className?: string;
}

export const EngagementModelsSection: React.FC<EngagementModelsSectionProps> = ({
  onSelectModel,
  onOpenConsultation,
  className = ''
}) => {
  const [models, setModels] = useState<EngagementModel[]>([]);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
    const handleUpdate = () => fetchModels();
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleUpdate);
  }, []);

  const fetchModels = async () => {
    try {
      const data = await api.getEngagementModels();
      if (data && data.length > 0) {
        setModels(data);
        const featured = data.find(m => m.is_featured) || data[0];
        setActiveModelId(featured.id);
      }
    } catch (err) {
      console.error('Failed to load engagement models:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModelIcon = (slug: string) => {
    if (slug.includes('mvp')) return <Rocket className="size-5 text-black" />;
    if (slug.includes('pod')) return <Users className="size-5 text-black" />;
    if (slug.includes('equity') || slug.includes('venture')) return <Zap className="size-5 text-black" />;
    return <Shield className="size-5 text-black" />;
  };

  return (
    <section id="engagement-models" className={`py-20 lg:py-28 bg-[#FBFBFB] border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4 block">
            Transparent Engagement Models
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal -tracking-[2px] text-black leading-tight">
            Structure That Fits Your Stage, <span className="italic">Runway &amp; Ambition</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
            No cookie-cutter packages. Whether you need a lightning-fast MVP sprint, a dedicated engineering pod integrated into your Git repo, or venture co-founding alignment, we deliver with 100% transparent terms.
          </p>
        </div>

        {/* 4 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {models.map((model) => {
            const isSelected = activeModelId === model.id;
            return (
              <div
                key={model.id}
                id={`engagement-card-${model.id}`}
                onClick={() => setActiveModelId(model.id)}
                className={`relative rounded-3xl p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-2 border-black shadow-lg'
                    : 'bg-white border border-gray-200 hover:border-black'
                }`}
              >
                {/* Badge if featured */}
                {model.badge && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-black text-white">
                    {model.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="size-11 rounded-2xl bg-[#FBFBFB] border border-gray-200 flex items-center justify-center">
                      {getModelIcon(model.slug)}
                    </div>
                    <span className="text-[11px] font-mono font-medium px-3 py-1 rounded-full bg-[#FBFBFB] border border-gray-200 text-gray-600">
                      {model.turnaround}
                    </span>
                  </div>

                  <h3 className="text-xl font-normal -tracking-[0.5px] text-black mb-2">
                    {model.title}
                  </h3>

                  <p className="text-xs text-gray-500 font-normal leading-relaxed min-h-[38px] mb-5">
                    {model.tagline}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FBFBFB] border border-gray-200 mb-6">
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Pricing Model</div>
                    <div className="text-sm font-semibold text-black mt-0.5">{model.pricing_type}</div>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Key Inclusions:
                    </div>
                    {model.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 font-normal">
                        <CheckCircle2 className="size-3.5 text-black shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-200">
                  <div className="text-[11px] font-mono text-gray-500 mb-4 flex items-center gap-1.5">
                    <Award className="size-3.5 text-black shrink-0" />
                    <span className="truncate">{model.sla_guarantee}</span>
                  </div>

                  <button
                    id={`btn-select-model-${model.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectModel) onSelectModel(model);
                      if (onOpenConsultation) onOpenConsultation(`${model.title} Engagement`);
                    }}
                    className={`w-full py-3 px-4 rounded-full font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-white border border-gray-200 hover:border-black text-black'
                    }`}
                  >
                    <span>{model.cta_label || 'Discuss This Model'}</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPARISON TOGGLE BUTTON */}
        <div className="text-center mb-8">
          <button
            id="btn-toggle-engagement-matrix"
            onClick={() => setShowComparisonTable(!showComparisonTable)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white hover:border-black text-black text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
          >
            <Layers className="size-3.5 text-black" />
            <span>{showComparisonTable ? 'Hide Comparison Matrix' : 'View Side-by-Side Comparison'}</span>
          </button>
        </div>

        {/* COMPARISON MATRIX TABLE */}
        {showComparisonTable && (
          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-[#FBFBFB] text-black uppercase font-mono text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-5 font-semibold">Delivery Dimension</th>
                  {models.map(m => (
                    <th key={m.id} className="p-5 min-w-[200px] font-semibold">{m.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-xs">
                <tr>
                  <td className="p-5 font-semibold text-black bg-[#FBFBFB]">Primary Objective</td>
                  {models.map(m => (
                    <td key={m.id} className="p-5">{m.best_for}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-black bg-[#FBFBFB]">Turnaround / Ramp-up</td>
                  {models.map(m => (
                    <td key={m.id} className="p-5 font-semibold text-black">{m.turnaround}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-black bg-[#FBFBFB]">IP &amp; Code Ownership</td>
                  {models.map(m => (
                    <td key={m.id} className="p-5 text-black font-semibold">100% Client Transferred</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-black bg-[#FBFBFB]">Engineering Pod Scale</td>
                  {models.map(m => (
                    <td key={m.id} className="p-5">2 to 8 Dedicated Engineers</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
};
