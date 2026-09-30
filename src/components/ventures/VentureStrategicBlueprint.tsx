import React, { useState } from 'react';
import { Layers, Target, TrendingUp, CheckCircle2, Globe2, Sparkles, Building2, Coins, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface VentureStrategicBlueprintProps {
  industry?: string;
  targetMarket?: string;
  businessModel?: string;
  ventureName: string;
}

// Helper to parse key-value lines from text
function extractKeyValues(text: string): { key: string; value: string }[] {
  const results: { key: string; value: string }[] = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 2 && colonIdx < 30 && colonIdx < line.length - 1) {
      results.push({
        key: line.substring(0, colonIdx).trim(),
        value: line.substring(colonIdx + 1).trim()
      });
    }
  }
  return results;
}

export default function VentureStrategicBlueprint({
  industry,
  targetMarket,
  businessModel,
  ventureName
}: VentureStrategicBlueprintProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'focused'>('grid');
  const [focusedCard, setFocusedCard] = useState<'industry' | 'targetMarket' | 'businessModel'>('industry');

  if (!industry && !targetMarket && !businessModel) return null;

  // --- Parser for Industry Card ---
  const parseIndustry = (raw?: string) => {
    if (!raw) return null;
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    
    // Extract key classifications (Primary Industry, Business Category, etc.)
    const classifications: { label: string; value: string }[] = [];
    const subIndustries: string[] = [];
    let narrative = '';
    let readingSub = false;

    for (const line of lines) {
      if (/^Sub-Industries/i.test(line)) {
        readingSub = true;
        continue;
      }
      if (line.includes(':') && !readingSub) {
        const [k, ...rest] = line.split(':');
        const v = rest.join(':').trim();
        if (k && v) classifications.push({ label: k.trim(), value: v });
      } else if (readingSub) {
        // Can be separated by commas, bullets, or newlines
        if (line.includes(',') || line.includes('•')) {
          line.split(/[,•]/).forEach((s) => {
            const clean = s.trim();
            if (clean) subIndustries.push(clean);
          });
        } else if (line.length < 50 && !line.includes('.')) {
          subIndustries.push(line);
        } else {
          readingSub = false;
          narrative += (narrative ? ' ' : '') + line;
        }
      } else {
        narrative += (narrative ? ' ' : '') + line;
      }
    }

    return { classifications, subIndustries, narrative };
  };

  // --- Parser for Target Market Card ---
  const parseTargetMarket = (raw?: string) => {
    if (!raw) return null;
    const sections: { title: string; items: string[]; text?: string }[] = [];
    const paragraphs = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

    for (const para of paragraphs) {
      const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;
      const first = lines[0];

      if (/^(Primary Market|Secondary Market|Geographic Market|Ideal Customer)/i.test(first) || first.endsWith(':')) {
        const title = first.replace(/:$/, '').trim();
        const contentLines = lines.slice(1);
        if (contentLines.length > 0) {
          sections.push({ title, items: contentLines });
        } else {
          sections.push({ title, items: [], text: first });
        }
      } else {
        // Standard block
        sections.push({ title: '', items: [], text: para });
      }
    }

    return { sections };
  };

  // --- Parser for Business Model Card ---
  const parseBusinessModel = (raw?: string) => {
    if (!raw) return null;
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    const revenueStreams: { num: string; title: string; desc?: string }[] = [];
    const highlights: { title: string; desc: string }[] = [];
    let overview = '';
    let inStreams = false;
    let inAdvantage = false;
    let advantageTitle = '';
    let advantageText = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^Revenue Streams/i.test(line)) {
        inStreams = true;
        inAdvantage = false;
        continue;
      }
      if (/^(SaaS Advantage|Long-Term Business Direction|Monetization Model)/i.test(line)) {
        if (advantageTitle && advantageText) {
          highlights.push({ title: advantageTitle, desc: advantageText });
        }
        advantageTitle = line.replace(/:$/, '').trim();
        advantageText = '';
        inStreams = false;
        inAdvantage = true;
        continue;
      }

      if (inStreams) {
        const numMatch = line.match(/^(\d+)\.\s*(.*)$/);
        if (numMatch) {
          const next = lines[i + 1];
          if (next && !/^\d+\./.test(next) && !/^(SaaS|Long-Term)/i.test(next)) {
            revenueStreams.push({ num: numMatch[1], title: numMatch[2], desc: next });
            i++;
          } else {
            revenueStreams.push({ num: numMatch[1], title: numMatch[2] });
          }
        } else if (line.startsWith('-') || line.startsWith('•')) {
          revenueStreams.push({ num: String(revenueStreams.length + 1), title: line.replace(/^[-•]\s*/, '') });
        } else if (!inAdvantage) {
          if (!overview) overview = line;
        }
      } else if (inAdvantage) {
        advantageText += (advantageText ? ' ' : '') + line;
      } else {
        overview += (overview ? ' ' : '') + line;
      }
    }

    if (advantageTitle && advantageText) {
      highlights.push({ title: advantageTitle, desc: advantageText });
    }

    return { overview, revenueStreams, highlights };
  };

  const parsedIndustry = parseIndustry(industry);
  const parsedMarket = parseTargetMarket(targetMarket);
  const parsedModel = parseBusinessModel(businessModel);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#FF5C00]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF7A1A]">
              Venture Architecture
            </span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold -tracking-[0.8px] text-white mt-1">
            Strategic Blueprint
          </h2>
        </div>

        {/* View switcher */}
        <div className="inline-flex p-1 rounded-full border border-white/10 bg-[#0E121E] self-start sm:self-auto gap-1 shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3-Pillar View
          </button>
          <button
            onClick={() => setViewMode('focused')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
              viewMode === 'focused'
                ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tabbed Focus
          </button>
        </div>
      </div>

      {/* Mode 1: 3 Cards Side-by-Side with dynamic content height (items-start) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start font-sans">
          {/* CARD 1: INDUSTRY & SECTOR */}
          {industry && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 shadow-xl transition-all duration-300 hover:border-[#FF5C00]/40 flex flex-col justify-start">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div className="h-10 w-10 rounded-xl bg-[#141828] border border-white/10 text-[#FF5C00] flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF7A1A]">
                    Pillar 01
                  </span>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-white -tracking-[0.5px] leading-tight">
                    Industry &amp; Sector
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {/* Classification Badges */}
                {parsedIndustry?.classifications && parsedIndustry.classifications.length > 0 && (
                  <div className="space-y-2.5">
                    {parsedIndustry.classifications.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl border border-white/[0.08] bg-[#141828] flex flex-col"
                      >
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                          {item.label}
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-white mt-1">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub Industries Tag Cloud */}
                {parsedIndustry?.subIndustries && parsedIndustry.subIndustries.length > 0 && (
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Sub-Industries &amp; Ecosystem
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedIndustry.subIndustries.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 rounded-md text-xs font-mono border bg-white/[0.04] border-white/10 text-slate-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Narrative */}
                {parsedIndustry?.narrative && (
                  <div className="pt-3 border-t border-dashed border-white/[0.08]">
                    <p className="text-sm leading-relaxed text-slate-300 font-normal">
                      {parsedIndustry.narrative}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CARD 2: TARGET MARKET */}
          {targetMarket && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 shadow-xl transition-all duration-300 hover:border-emerald-500/40 flex flex-col justify-start">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div className="h-10 w-10 rounded-xl bg-[#141828] border border-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Pillar 02
                  </span>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-white -tracking-[0.5px] leading-tight">
                    Target Market
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {parsedMarket?.sections.map((sec, idx) => {
                  if (sec.title) {
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {sec.title}
                          </h4>
                        </div>
                        {sec.items.length > 0 && (
                          <div className="space-y-2 pl-3 border-l-2 border-emerald-500/30">
                            {sec.items.map((item, iIdx) => (
                              <div key={iIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-slate-300 leading-snug font-normal">{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {sec.text && (
                          <p className="text-sm text-slate-300 leading-relaxed pl-3 font-normal">{sec.text}</p>
                        )}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm text-slate-300 leading-relaxed font-normal">
                      {sec.text}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {/* CARD 3: BUSINESS MODEL */}
          {businessModel && (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 shadow-xl transition-all duration-300 hover:border-cyan-500/40 flex flex-col justify-start">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div className="h-10 w-10 rounded-xl bg-[#141828] border border-white/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Pillar 03
                  </span>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-white -tracking-[0.5px] leading-tight">
                    Business Model
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {/* Core Overview */}
                {parsedModel?.overview && (
                  <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-[#141828] text-sm text-slate-200 leading-relaxed font-normal">
                    {parsedModel.overview}
                  </div>
                )}

                {/* Numbered Revenue Streams */}
                {parsedModel?.revenueStreams && parsedModel.revenueStreams.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Revenue Streams &amp; Monetization
                    </span>
                    <div className="space-y-2">
                      {parsedModel.revenueStreams.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border border-white/[0.08] bg-[#141828] flex items-start gap-3 transition-all"
                        >
                          <span className="h-6 w-6 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {item.num}
                          </span>
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-white leading-tight">
                              {item.title}
                            </p>
                            {item.desc && (
                              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategic Highlights */}
                {parsedModel?.highlights && parsedModel.highlights.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-dashed border-white/[0.08]">
                    {parsedModel.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="space-y-1">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                          {hl.title}
                        </span>
                        <p className="text-sm text-slate-300 leading-relaxed font-normal">
                          {hl.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Focused Tabbed View */}
      {viewMode === 'focused' && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-8 space-y-6 shadow-xl font-sans">
          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2.5 pb-4 border-b border-white/[0.08]">
            {industry && (
              <button
                onClick={() => setFocusedCard('industry')}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  focusedCard === 'industry'
                    ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-[#141828] border border-white/10'
                }`}
              >
                <Layers className="h-4 w-4" />
                Industry &amp; Sector
              </button>
            )}
            {targetMarket && (
              <button
                onClick={() => setFocusedCard('targetMarket')}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  focusedCard === 'targetMarket'
                    ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-[#141828] border border-white/10'
                }`}
              >
                <Target className="h-4 w-4" />
                Target Market
              </button>
            )}
            {businessModel && (
              <button
                onClick={() => setFocusedCard('businessModel')}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  focusedCard === 'businessModel'
                    ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-[#141828] border border-white/10'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Business Model
              </button>
            )}
          </div>

          {/* Tab Content */}
          {focusedCard === 'industry' && industry && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 -tracking-[0.5px]">
                <Layers className="h-5 w-5 text-[#FF5C00]" />
                Industry &amp; Sector Framework
              </h3>
              {parsedIndustry?.classifications && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {parsedIndustry.classifications.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-white/[0.08] bg-[#141828]"
                    >
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        {item.label}
                      </span>
                      <span className="text-base font-semibold text-white mt-1 block">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {parsedIndustry?.subIndustries && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 block">Sub-Industries</span>
                  <div className="flex flex-wrap gap-2">
                    {parsedIndustry.subIndustries.map((s, idx) => (
                      <span key={idx} className="px-3.5 py-1.5 rounded-lg border bg-white/[0.04] border-white/10 text-slate-300 text-xs font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {parsedIndustry?.narrative && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">{parsedIndustry.narrative}</p>
              )}
            </div>
          )}

          {focusedCard === 'targetMarket' && targetMarket && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 -tracking-[0.5px]">
                <Target className="h-5 w-5 text-emerald-400" />
                Target Customer &amp; Market Segments
              </h3>
              <div className="space-y-4">
                {parsedMarket?.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    {sec.title && (
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {sec.title}
                      </h4>
                    )}
                    {sec.items.length > 0 && (
                      <div className="space-y-2 pl-3 border-l-2 border-emerald-500/30">
                        {sec.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span className="text-sm sm:text-base text-slate-300 font-normal">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {sec.text && <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">{sec.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {focusedCard === 'businessModel' && businessModel && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 -tracking-[0.5px]">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Commercialization &amp; Revenue Engine
              </h3>
              {parsedModel?.overview && (
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#141828] text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
                  {parsedModel.overview}
                </div>
              )}
              {parsedModel?.revenueStreams && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Revenue Streams
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {parsedModel.revenueStreams.map((rs, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-white/[0.08] bg-[#141828] flex items-start gap-3"
                      >
                        <span className="h-6 w-6 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {rs.num}
                        </span>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-white">{rs.title}</p>
                          {rs.desc && <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">{rs.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {parsedModel?.highlights && (
                <div className="space-y-3 pt-3 border-t border-dashed border-white/[0.08]">
                  {parsedModel.highlights.map((hl, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-xs font-mono font-bold uppercase text-cyan-400 block">{hl.title}</span>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">{hl.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
