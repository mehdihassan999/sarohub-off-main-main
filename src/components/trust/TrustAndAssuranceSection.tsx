import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, Star, CheckCircle2, Lock, Shield, 
  Play, Volume2, ExternalLink, Download, FileText, Globe, Clock,
  ArrowRight, Check, X, Sparkles, Video, Copy, FileCode, Printer,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { api } from '../../api';
import { TrustBadge, ClientEndorsement, IpGuarantee } from '../../types';
import { getVideoEmbedInfo } from '../../utils/videoEmbed';
import { 
  downloadNdaFile, 
  getFullNdaAgreementText, 
  getFullNdaAgreementMarkdown, 
  NDA_CLAUSES, 
  SAROHUB_LEGAL_INFO 
} from '../../utils/ndaContract';
import RollText from '../common/RollText';
import DiagonalArrow from '../common/DiagonalArrow';

interface TrustAndAssuranceSectionProps {
  onOpenAuditModal?: () => void;
  onOpenConsultation?: (type?: string) => void;
  className?: string;
  showAllSections?: boolean;
}

export const TrustAndAssuranceSection: React.FC<TrustAndAssuranceSectionProps> = ({
  onOpenAuditModal,
  onOpenConsultation,
  className = '',
  showAllSections = true
}) => {
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [endorsements, setEndorsements] = useState<ClientEndorsement[]>([]);
  const [ipGuarantee, setIpGuarantee] = useState<IpGuarantee | null>(null);
  const [loading, setLoading] = useState(true);

  // Video modal state
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  // Audio state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // NDA preview modal
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [ndaModalTab, setNdaModalTab] = useState<'clauses' | 'fulltext'>('clauses');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>('confidentiality');
  const [copiedNda, setCopiedNda] = useState(false);
  const [ndaToast, setNdaToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNdaAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setNdaToast({ text, type });
    setTimeout(() => setNdaToast(null), 3500);
  };

  const handleDownloadNda = (format: 'pdf' | 'doc' | 'txt' | 'md' = 'pdf') => {
    const success = downloadNdaFile(format);
    if (success) {
      const formatLabels: Record<string, string> = {
        pdf: 'Official Legal PDF (.pdf)',
        doc: 'Microsoft Word Document (.doc)',
        txt: 'Plain Text (.txt)',
        md: 'Markdown Document (.md)'
      };
      showNdaAlert(`${formatLabels[format] || format} downloaded successfully.`);
    } else {
      showNdaAlert('Failed to generate file. Please copy the agreement text directly.', 'error');
    }
  };

  const handleCopyNda = async () => {
    try {
      const fullText = getFullNdaAgreementText();
      await navigator.clipboard.writeText(fullText);
      setCopiedNda(true);
      showNdaAlert('Full legal agreement copied to clipboard.');
      setTimeout(() => setCopiedNda(false), 2500);
    } catch {
      showNdaAlert('Please select and copy the agreement text manually.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
    const handleUpdate = () => fetchData();
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => {
      window.removeEventListener('sarohub-data-updated', handleUpdate);
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const [badgesRes, endorsementsRes, ipRes] = await Promise.all([
        api.getTrustBadges().catch(() => []),
        api.getClientEndorsements().catch(() => []),
        api.getIpGuarantee().catch(() => null)
      ]);
      setBadges(badgesRes || []);
      setEndorsements(endorsementsRes || []);
      setIpGuarantee(ipRes);
    } catch (err) {
      console.error('Failed to load trust data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = (id: number, audioUrl: string) => {
    if (playingAudioId === id) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch(e => console.log('Audio playback prevented:', e));
      newAudio.onended = () => setPlayingAudioId(null);
      setAudioElement(newAudio);
      setPlayingAudioId(id);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="size-5 text-[#FF5C00]" />;
      case 'Star': return <Star className="size-5 text-[#FF5C00] fill-[#FF5C00]" />;
      case 'CheckCircle2': return <CheckCircle2 className="size-5 text-[#FF5C00]" />;
      case 'ShieldCheck': return <ShieldCheck className="size-5 text-[#FF5C00]" />;
      case 'Lock': return <Lock className="size-5 text-[#FF5C00]" />;
      default: return <Shield className="size-5 text-[#FF5C00]" />;
    }
  };

  return (
    <section id="trust-and-assurance" className={`py-12 lg:py-16 bg-[#08090E] border-b border-white/[0.08] text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block font-semibold">
            Client Partnership &amp; Technical Delivery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-white leading-tight">
            Built on Rigorous Confidentiality, <span className="italic text-[#FF5C00]">100% IP Ownership</span> &amp; Transparent Execution
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            We operate as a dedicated engineering and research partner. Clear governance, enforceable bilateral NDAs, 100% source code handover, and high-quality software craftsmanship.
          </p>
        </div>

        {/* 1. VERIFIED HIGHLIGHTS & REVIEWS */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-3 border-b border-white/[0.08] gap-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white flex items-center gap-2 font-bold">
              <Award className="size-4 text-[#FF5C00]" />
              Real Products. Real Projects. Growing Every Day.
            </h3>
            <span className="font-mono text-xs text-slate-400">Verified Deliveries &amp; Milestones</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.filter(b => b.is_active).map((badge) => (
              <a
                key={badge.id}
                id={`trust-badge-${badge.id}`}
                href={badge.external_url || '#'}
                target={badge.external_url.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="group p-5 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-lg transition-all flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="size-9 rounded-2xl bg-[#141A2E] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      {getBadgeIcon(badge.badge_icon)}
                    </span>
                    <ExternalLink className="size-3 text-slate-400 group-hover:text-[#FF5C00] transition-colors" />
                  </div>
                  <div className="font-mono text-[10px] text-[#FF7A1A] uppercase tracking-wider font-semibold">{badge.platform}</div>
                  <div className="text-sm font-bold text-white mt-1 line-clamp-2">
                    {badge.badge_title}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-white">{badge.rating_score}</span>
                  <span className="text-[10px] text-slate-400">{badge.review_count}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. NDA & 100% IP PROTECTION GUARANTEE HERO BANNER */}
        <div id="ip-protection-banner" className="mb-10 sm:mb-12 rounded-3xl border border-white/[0.08] bg-[#0E121E] p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block font-semibold">
                Legal Covenants &amp; Code Escrow
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal -tracking-[1px] text-white">
                {ipGuarantee?.guarantee_headline || '100% Intellectual Property Ownership & Strict NDA Commitment'}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-3xl">
                {ipGuarantee?.guarantee_subheading || 'Your proprietary concepts, business logic, algorithms, and source code belong exclusively to you. Guaranteed in writing from Day 1.'}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#FF5C00] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">Bilateral NDA executed before architecture review</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#FF5C00] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">100% Code &amp; IP assigned directly to your repos</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#FF5C00] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">Zero vendor lock-in or proprietary runtime taxes</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                id="btn-preview-nda"
                type="button"
                onClick={() => {
                  setShowNdaModal(true);
                  setNdaModalTab('clauses');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#FFA566]/30"
              >
                <RollText>PREVIEW BILATERAL NDA</RollText>
                <DiagonalArrow size={16} />
              </button>

              <div className="grid grid-cols-2 gap-2.5 w-full">
                <button
                  id="btn-download-nda-pdf"
                  type="button"
                  onClick={() => handleDownloadNda('pdf')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/[0.05] border border-white/15 hover:border-[#FF5C00]/50 hover:bg-white/[0.1] text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  title="Download verified official legal PDF (.pdf)"
                >
                  <Download className="size-3.5 text-[#FF5C00]" />
                  <span>PDF (.pdf)</span>
                </button>

                <button
                  id="btn-download-nda-word"
                  type="button"
                  onClick={() => handleDownloadNda('doc')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/[0.05] border border-white/15 hover:border-[#FF5C00]/50 hover:bg-white/[0.1] text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  title="Download editable Microsoft Word document (.doc)"
                >
                  <FileText className="size-3.5 text-[#FF5C00]" />
                  <span>Word (.doc)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. VERIFIED CLIENT ENDORSEMENTS (VIDEO, AUDIO & OUTCOMES) */}
        {showAllSections && (
          <div className="mb-10 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-1 block font-semibold">
                  Verifiable Track Record
                </span>
                <h3 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-white">
                  Client Endorsements &amp; Real-World Outcomes
                </h3>
              </div>
              {onOpenConsultation && (
                <button
                  id="btn-talk-to-team-endorsements"
                  onClick={() => onOpenConsultation('Executive Reference & Architecture Review')}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 hover:text-[#FF5C00] transition-colors cursor-pointer"
                >
                  <span>Speak with an Executive Reference</span>
                  <ArrowRight className="size-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {endorsements.map((item) => (
                <div
                  key={item.id}
                  id={`client-endorsement-${item.id}`}
                  className="p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Rating Stars & Media Pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="size-4 text-[#FF5C00] fill-[#FF5C00]" />
                        ))}
                      </div>
                      {(item.media_type === 'video' || item.video_url) && item.video_url && (
                        <button
                          onClick={() => setActiveVideoUrl(item.video_url || null)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase border border-white/10 bg-[#141A2E] text-slate-200 hover:border-[#FF5C00] transition-colors cursor-pointer shadow-xs"
                        >
                          <Play className="size-3 fill-current text-[#FF5C00]" />
                          <span>Watch Video</span>
                        </button>
                      )}
                      {item.media_type === 'audio' && item.audio_url && (
                        <button
                          onClick={() => toggleAudio(item.id, item.audio_url!)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase border transition-colors cursor-pointer shadow-xs ${
                            playingAudioId === item.id 
                              ? 'bg-[#FF5C00] text-white border-[#FF5C00] animate-pulse'
                              : 'bg-[#141A2E] border-white/10 hover:border-[#FF5C00] text-slate-200'
                          }`}
                        >
                          <Volume2 className="size-3 text-[#FF5C00]" />
                          <span>{playingAudioId === item.id ? 'Playing' : 'Listen'}</span>
                        </button>
                      )}
                    </div>

                    {/* Outcome Highlight Metric */}
                    {item.outcome_metric && (
                      <div className="mb-3 px-3 py-1.5 rounded-full bg-[#141A2E] border border-white/10 text-white text-xs font-mono inline-flex items-center gap-2 shadow-xs">
                        <Sparkles className="size-3.5 text-[#FF5C00] shrink-0" />
                        <span>{item.outcome_metric}</span>
                      </div>
                    )}

                    {/* Project Context */}
                    <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">
                      {item.project_title}
                    </div>

                    {/* Quote Body */}
                    <blockquote className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Author Details */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                    <img
                      src={item.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"}
                      alt={item.client_name}
                      className="size-11 rounded-full object-cover border border-white/10 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {item.client_name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono truncate">
                        {item.client_title} &bull; {item.company_name}
                      </div>
                      {item.country && (
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {item.country}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. GLOBAL DELIVERY & COLLABORATION MATRIX */}
        {showAllSections && (
          <div className="p-6 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#0E121E] shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 block flex items-center gap-2 font-semibold">
                  <Globe className="size-4 text-[#FF5C00]" />
                  Global Delivery Standards
                </span>
                <h4 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-white">
                  Collaborate in Real-Time Across Timezones
                </h4>
                <p className="mt-2.5 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  Headquartered in Pakistan with distributed pods designed for zero lag. We guarantee active 4-6 hour working overlaps with North America (EST/CST/PST), Europe (GMT/CET), and the Gulf (GST).
                </p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#141A2E] border border-white/[0.08] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-[#FF5C00]" />
                    <span className="text-sm font-bold text-white">US &amp; Americas</span>
                  </div>
                  <div className="text-xs text-slate-300 font-normal leading-relaxed">
                    Dedicated night/morning pods overlapping with New York, Austin &amp; San Francisco hours.
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#141A2E] border border-white/[0.08] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-[#FF5C00]" />
                    <span className="text-sm font-bold text-white">UK &amp; Europe</span>
                  </div>
                  <div className="text-xs text-slate-300 font-normal leading-relaxed">
                    Direct daytime alignment with London, Berlin &amp; Paris. Same-day sprint reviews and standups.
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#141A2E] border border-white/[0.08] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-[#FF5C00]" />
                    <span className="text-sm font-bold text-white">Gulf &amp; APAC</span>
                  </div>
                  <div className="text-xs text-slate-300 font-normal leading-relaxed">
                    Full 8-hour workday overlap with Dubai, Riyadh, Singapore &amp; Sydney teams.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* VIDEO PLAYER MODAL */}
      {activeVideoUrl && (() => {
        const videoInfo = getVideoEmbedInfo(activeVideoUrl);
        const embedSrc = videoInfo.embedUrl.includes('?') ? `${videoInfo.embedUrl}&autoplay=1` : `${videoInfo.embedUrl}?autoplay=1`;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-4xl bg-[#0E121E] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
                <span className="font-mono text-xs uppercase tracking-wider text-white">
                  Verified Client Video Testimonial
                </span>
                <button
                  onClick={() => setActiveVideoUrl(null)}
                  className="size-8 rounded-full bg-[#141A2E] hover:bg-[#FF5C00] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="relative aspect-video bg-black">
                <iframe
                  src={embedSrc}
                  title="Client Endorsement Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* BILATERAL NDA PREVIEW MODAL */}
      {showNdaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0E121E] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF5C00] block mb-0.5 font-bold">
                  Standard Master Mutual Non-Disclosure Agreement
                </span>
                <h3 className="text-xl font-normal -tracking-[0.5px] text-white">
                  SaroHub Bilateral Confidentiality Covenant
                </h3>
              </div>
              <button
                onClick={() => setShowNdaModal(false)}
                className="size-9 rounded-full bg-[#141A2E] hover:bg-[#FF5C00] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Sub-header / Tabs */}
            <div className="px-6 py-3 border-b border-white/[0.08] bg-[#0A0D15] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNdaModalTab('clauses')}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    ndaModalTab === 'clauses' ? 'bg-[#FF5C00] text-white font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Summary Clauses
                </button>
                <button
                  onClick={() => setNdaModalTab('fulltext')}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    ndaModalTab === 'fulltext' ? 'bg-[#FF5C00] text-white font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Full Legal Text
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNda}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 hover:border-[#FF5C00] text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedNda ? <Check className="size-3.5 text-[#FF5C00]" /> : <Copy className="size-3.5" />}
                  <span>{copiedNda ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleDownloadNda('pdf')}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-[#FF7A1A] text-white hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer font-bold border border-[#FFA566]/30"
                >
                  <Download className="size-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-300">
              {ndaModalTab === 'clauses' ? (
                <div className="space-y-4 font-sans">
                  {NDA_CLAUSES.map((clause) => {
                    const isExpanded = expandedClauseId === clause.id;
                    return (
                      <div key={clause.id} className="border border-white/[0.08] rounded-2xl overflow-hidden bg-[#101424]">
                        <button
                          onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                          className="w-full text-left p-4 bg-[#141A2E] flex items-center justify-between text-white font-semibold text-sm cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#FF5C00]"></span>
                            {clause.title}
                          </span>
                          {isExpanded ? <ChevronUp className="size-4 text-[#FF5C00]" /> : <ChevronDown className="size-4 text-slate-400" />}
                        </button>
                        {isExpanded && (
                          <div className="p-4 bg-[#0E121E] text-slate-300 text-xs font-normal leading-relaxed border-t border-white/[0.06]">
                            {clause.summary}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 bg-[#101424] p-6 rounded-2xl border border-white/[0.08]">
                  {getFullNdaAgreementText()}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NDA Alert Toast */}
      {ndaToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0E121E] text-white border border-[#FF5C00]/40 shadow-2xl text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="size-4 text-[#FF5C00]" />
          <span>{ndaToast.text}</span>
        </div>
      )}
    </section>
  );
};
