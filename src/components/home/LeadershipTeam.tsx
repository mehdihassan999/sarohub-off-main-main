import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Code, Palette, TrendingUp, Sparkles, ChevronDown, ChevronUp, 
  Video, Share2, Users, Layers, Shield, MonitorPlay, Cpu,
  Crown, Star, Award, Zap, Terminal, Rocket, CheckCircle2,
  Clock, Briefcase
} from 'lucide-react';
import SocialIcon from '../SocialIcon';
import { api } from '../../api';

interface TeamProps {
  team: any[];
  sections?: any[];
}

export const OFFICIAL_FOUNDERS = [
  {
    id: 1,
    name: 'Mehdi Hassan',
    position: 'Founder & Chief Executive Officer (CEO)',
    is_founder: true,
    department: 'founders',
    photo_url: '/uploads/img-1789637457038-s7ksr1.webp',
    bio: "Leads corporate strategy, venture scaling, and global technology partnerships. Directs SaroHub's vision across proprietary products and client engineering engagements, turning high-conviction ideas into sustainable digital ventures.",
    skills: ['Entrepreneurship', 'Business Strategy', 'Team Leadership', 'Digital Transformation', 'Venture Scaling'],
    experience_years: '8+ Years',
    social_links: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/mehdi-hassan-936494419' },
      { platform: 'GitHub', url: 'https://github.com/mehdihassan999' },
      { platform: 'Twitter / X', url: 'https://x.com/MehdiVentures' }
    ]
  },
  {
    id: 2,
    name: 'Muhammad Nawaz',
    position: 'Co-Founder & Chief Technology Officer (CTO)',
    is_founder: true,
    department: 'development',
    photo_url: '/uploads/img-1789637942120-1ob4uw.webp',
    bio: 'Technology leader specializing in modern software development, enterprise architecture, and scalable digital solutions. Directs core technical architectures, cloud microservices, high-throughput distributed systems, and real-time APIs.',
    skills: ['Cloud Architecture', 'Software Engineering', 'Distributed Systems', 'Database Sharding', 'REST APIs', 'Technical Leadership'],
    experience_years: '5+ Years',
    social_links: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ali-nawaz-naji' },
      { platform: 'GitHub', url: 'https://github.com/naji316' }
    ]
  },
  {
    id: 3,
    name: 'Muhammad Kazim',
    position: 'Co-Founder & Head of Operations & AI',
    is_founder: true,
    department: 'operations',
    photo_url: '/uploads/img-1789638412385-8co2s7.webp',
    bio: 'Leads SaroHub’s overall operations, strategic research, and cross-functional project delivery while managing the growth team and driving brand development, cognitive AI workflows, customer acquisition, and business expansion.',
    skills: ['Operations Management', 'AI Systems & Workflows', 'Marketing Strategy', 'Customer Acquisition', 'Delivery Excellence'],
    experience_years: '6+ Years',
    social_links: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/sarohub' },
      { platform: 'GitHub', url: 'https://github.com/sarohub' },
      { platform: 'Twitter / X', url: 'https://twitter.com/sarohub' }
    ]
  }
];

export const OFFICIAL_SPECIALISTS = [
  {
    id: 4,
    name: 'Muzammil Abbas',
    position: 'Digital Marketing Specialist',
    is_founder: false,
    department: 'marketing',
    photo_url: '/uploads/img-1789637705416-93xrmi.webp',
    bio: 'Digital marketing specialist focused on paid advertising, lead generation, social media growth, and conversion rate optimization across global digital campaigns.',
    skills: ['Social Media Marketing', 'Meta Ads', 'Google Ads', 'Lead Generation', 'ROI Optimization', 'Digital Marketing Strategy', 'Content Analytics'],
    experience_years: '2+ Years',
    social_links: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/saro-hub-255988431' }
    ]
  }
];

// Helper to determine Department Meta information dynamically
export function getDepartmentMetadata(
  deptRaw: string,
  customMeta?: { title?: string; description?: string; badge?: string }
) {
  const k = (deptRaw || '').toLowerCase().trim();

  if (k === 'founders' || k.includes('executive') || k.includes('founder')) {
    return {
      key: 'founders',
      title: customMeta?.title || 'Executive Founders & Leadership',
      badge: customMeta?.badge || 'EXECUTIVE GOVERNANCE',
      badgeClass: 'bg-black text-white',
      icon: Sparkles,
      iconColor: 'text-cyan-400',
      description: customMeta?.description || 'Founding partners directing corporate governance, technology research, cloud engineering, and operations from Gilgit-Baltistan.'
    };
  }
  if (k === 'technical' || k === 'technical_team' || k.includes('technical')) {
    return {
      key: 'technical',
      title: customMeta?.title || 'Technical Team',
      badge: customMeta?.badge || 'TECHNICAL EXCELLENCE',
      badgeClass: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      icon: Cpu,
      iconColor: 'text-cyan-600',
      description: customMeta?.description || 'Core technical specialists driving infrastructure, full-stack systems engineering, and modern scalable platforms.'
    };
  }
  if (k.includes('video') || k.includes('film') || k.includes('motion') || k.includes('editor') || k.includes('editing')) {
    return {
      key: 'video',
      title: customMeta?.title || 'Video Editing & Media Production',
      badge: customMeta?.badge || 'CREATIVE & CINEMATIC',
      badgeClass: 'bg-rose-50 border-rose-200 text-rose-700',
      icon: Video,
      iconColor: 'text-rose-600',
      description: customMeta?.description || 'Crafting high-impact product video demonstrations, cinematic narratives, and high-conversion social video reels.'
    };
  }
  if (k.includes('social') || k.includes('community') || k.includes('smm')) {
    return {
      key: 'social_media',
      title: customMeta?.title || 'Social Media & Community Management',
      badge: customMeta?.badge || 'COMMUNITY & ENGAGEMENT',
      badgeClass: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: Share2,
      iconColor: 'text-amber-600',
      description: customMeta?.description || 'Cultivating digital community presence, viral social distribution, brand engagement, and real-time audience dialogue.'
    };
  }
  if (k.includes('market') || k.includes('growth') || k.includes('ad') || k.includes('seo')) {
    return {
      key: 'marketing',
      title: customMeta?.title || 'Growth & Digital Marketing',
      badge: customMeta?.badge || 'GROWTH & ACQUISITION',
      badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      description: customMeta?.description || 'Specialized in multi-channel paid acquisition, search visibility, high-converting funnel design, and international branding.'
    };
  }
  if (k.includes('design') || k.includes('ui') || k.includes('ux') || k.includes('graphic') || k.includes('brand')) {
    return {
      key: 'design',
      title: customMeta?.title || 'UI/UX & Product Design',
      badge: customMeta?.badge || 'DESIGN & USER EXPERIENCE',
      badgeClass: 'bg-purple-50 border-purple-200 text-purple-700',
      icon: Palette,
      iconColor: 'text-purple-600',
      description: customMeta?.description || 'Transforming complex engineering paradigms into intuitive, ergonomic interfaces, design systems, and brand identities.'
    };
  }
  if (k.includes('dev') || k.includes('software') || k.includes('engineer') || k.includes('code') || k.includes('cloud')) {
    return {
      key: 'development',
      title: customMeta?.title || 'Software & Systems Development',
      badge: customMeta?.badge || 'ENGINEERING & ARCHITECTURE',
      badgeClass: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: Code,
      iconColor: 'text-blue-600',
      description: customMeta?.description || 'Engineering high-throughput cloud backends, modern web applications, distributed databases, and secure APIs.'
    };
  }
  if (k.includes('operation') || k.includes('ai') || k.includes('research')) {
    return {
      key: 'operations',
      title: customMeta?.title || 'Operations & AI Systems',
      badge: customMeta?.badge || 'OPERATIONS & RESEARCH',
      badgeClass: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      icon: Sparkles,
      iconColor: 'text-cyan-600',
      description: customMeta?.description || 'Optimizing corporate workflows, cognitive AI integration, research ventures, and operational excellence.'
    };
  }

  // Dynamic Custom Department
  const cleanedTitle = customMeta?.title || (deptRaw ? deptRaw.charAt(0).toUpperCase() + deptRaw.slice(1) : 'Specialized Team');
  return {
    key: k.replace(/\s+/g, '_') || 'custom',
    title: cleanedTitle,
    badge: customMeta?.badge || 'SPECIALIZED TEAM',
    badgeClass: 'bg-gray-100 border-gray-200 text-gray-800',
    icon: Users,
    iconColor: 'text-gray-700',
    description: customMeta?.description || `Specialized professionals driving innovation and domain excellence in ${cleanedTitle}.`
  };
}

// Reusable Expandable Bio with animated "Read more" / "Show less"
function ExpandableBio({ text, maxLength = 120 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanText = (text || '').trim();
  const isLong = cleanText.length > maxLength;

  if (!cleanText) return null;

  return (
    <div className="text-sm sm:text-[15px] text-gray-700 leading-relaxed font-normal mb-4 text-center">
      <p className="inline transition-all duration-300">
        {isLong && !isExpanded ? `${cleanText.slice(0, maxLength).trim()}...` : cleanText}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1.5 inline-flex items-center gap-0.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="size-3.5 inline" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="size-3.5 inline" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// Executive role identification helper with clean theme-aligned badges
export function getExecutiveRoleBadge(member: any) {
  const pos = (member.position || '').toLowerCase();
  const name = (member.name || '').toLowerCase();
  const dept = (member.department || '').toLowerCase();
  const isFounder = member.is_founder === true || member.is_founder === 1 || member.is_founder === 'true' || pos.includes('founder');

  // 1. CEO / Chief Executive Officer
  if (pos.includes('ceo') || pos.includes('chief executive') || name.includes('mehdi hassan')) {
    return {
      role: 'CEO',
      title: isFounder ? 'Founder & CEO' : 'Chief Executive Officer',
      icon: Crown,
    };
  }

  // 2. CTO / Chief Technology Officer
  if (pos.includes('cto') || pos.includes('chief technology') || (pos.includes('technology officer') && isFounder) || name.includes('ali nawaz') || name.includes('muhammad nawaz')) {
    return {
      role: 'CTO',
      title: isFounder ? 'Co-Founder & CTO' : 'Chief Technology Officer',
      icon: Cpu,
    };
  }

  // 3. CMO / Chief Marketing Officer
  if (pos.includes('cmo') || pos.includes('chief marketing') || pos.includes('marketing officer')) {
    return {
      role: 'CMO',
      title: isFounder ? 'Co-Founder & CMO' : 'Chief Marketing Officer',
      icon: Rocket,
    };
  }

  // 4. COO / Head of Operations & AI (e.g. Muhammad Kazim)
  if (pos.includes('coo') || pos.includes('chief operating') || pos.includes('operations & ai') || (name.includes('kazim') && isFounder)) {
    return {
      role: 'COO / AI OPS',
      title: isFounder ? 'Co-Founder & Head of AI Ops' : 'Chief Operating Officer',
      icon: Sparkles,
    };
  }

  // 5. Co-Founder Generic
  if (isFounder) {
    return {
      role: 'FOUNDER',
      title: 'Co-Founder',
      icon: Star,
    };
  }

  // 6. Technical Team & Software Engineering
  if (dept === 'technical' || dept.includes('dev') || pos.includes('architect') || pos.includes('engineer') || pos.includes('developer') || pos.includes('tech')) {
    return {
      role: 'TECHNICAL',
      title: 'Technical Specialist',
      icon: Terminal,
    };
  }

  // 7. UI/UX & Product Design
  if (dept.includes('design') || pos.includes('design') || pos.includes('ui') || pos.includes('ux')) {
    return {
      role: 'DESIGN',
      title: 'UI/UX Specialist',
      icon: Palette,
    };
  }

  // 8. Marketing & Growth
  if (dept.includes('market') || pos.includes('market') || pos.includes('growth')) {
    return {
      role: 'GROWTH',
      title: 'Growth Specialist',
      icon: TrendingUp,
    };
  }

  // 9. Media & Video Production
  if (dept.includes('video') || pos.includes('video') || pos.includes('editor') || pos.includes('media')) {
    return {
      role: 'MEDIA',
      title: 'Media Producer',
      icon: Video,
    };
  }

  // Default Standard Executive Specialist
  return {
    role: 'SPECIALIST',
    title: member.department ? member.department.replace('_', ' ').toUpperCase() : 'Specialist',
    icon: Award,
  };
}

// Professional Team Member Card Component
interface TeamMemberCardProps {
  member: any;
  badgeColor?: string;
  cardIndex?: number;
  key?: React.Key;
}

function TeamMemberCard({ member, cardIndex = 0 }: TeamMemberCardProps) {
  const getMemberSocialLinks = (m: any) => {
    const links: { platform: string; url: string }[] = [];
    if (Array.isArray(m.social_links) && m.social_links.length > 0) {
      m.social_links.forEach((sl: any) => {
        if (sl && sl.url) {
          links.push({
            platform: (sl.platform || 'link').toLowerCase(),
            url: sl.url.startsWith('http') ? sl.url : `https://${sl.url}`
          });
        }
      });
      if (links.length > 0) return links;
    }
    if (m.social_linkedin) links.push({ platform: 'linkedin', url: m.social_linkedin.startsWith('http') ? m.social_linkedin : `https://${m.social_linkedin}` });
    if (m.social_twitter) links.push({ platform: 'twitter', url: m.social_twitter.startsWith('http') ? m.social_twitter : `https://${m.social_twitter}` });
    if (m.social_github) links.push({ platform: 'github', url: m.social_github.startsWith('http') ? m.social_github : `https://${m.social_github}` });
    if (m.portfolio_url) links.push({ platform: 'website', url: m.portfolio_url.startsWith('http') ? m.portfolio_url : `https://${m.portfolio_url}` });
    return links;
  };

  const socialLinks = getMemberSocialLinks(member);
  const skillsList = Array.isArray(member.skills) 
    ? member.skills 
    : (typeof member.skills === 'string' ? member.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []);

  const roleMeta = getExecutiveRoleBadge(member);
  const IconComponent = roleMeta.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className="p-5 sm:p-6 rounded-3xl border border-white/[0.08] bg-[#0E121E] hover:border-[#FF5C00]/40 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.15)] transition-all duration-300 flex flex-col justify-between group text-center shadow-lg"
    >
      <div>
        {/* Compact Circular Portrait in Clean Theme Frame */}
        <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-3.5 border border-white/[0.1] ring-2 ring-white/[0.05] group-hover:border-[#FF5C00] group-hover:ring-[#FF5C00]/20 transition-all duration-300 bg-[#141828] shadow-md">
          <img
            src={member.photo_url || '/assets/team/placeholder.png'}
            alt={member.name}
            className="w-full h-full object-cover object-center rounded-full group-hover:scale-106 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </div>

        {/* Executive Role & Experience Badges */}
        {(() => {
          const expRaw = member.experience_years || member.experience || member.years_experience || member.years;
          const expDisplay = expRaw
            ? (expRaw.toLowerCase().includes('year') || expRaw.toLowerCase().includes('yr') ? expRaw : `${expRaw} Years Exp`)
            : null;

          return (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3.5">
              <span 
                className="px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 bg-[#FF5C00]/10 text-[#FF7A1A] border border-[#FF5C00]/25 shadow-xs"
              >
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.8, 1, 0.8] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.4, 
                    ease: 'easeInOut' 
                  }}
                  className="text-[#FF5C00] inline-flex items-center shrink-0"
                >
                  <IconComponent className="size-4" />
                </motion.span>
                <span>{roleMeta.title}</span>
              </span>

              {expDisplay && (
                <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-mono font-bold border border-white/[0.08] bg-[#141828] text-slate-300 inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-[#FF5C00] shrink-0 stroke-[2.5]" />
                  <span>{expDisplay}</span>
                </span>
              )}
            </div>
          );
        })()}

        {/* Member Name */}
        <h4 className="text-2xl sm:text-[26px] font-bold text-white mb-1 group-hover:text-[#FF5C00] transition-colors tracking-tight">
          {member.name}
        </h4>

        {/* Position / Title */}
        <p className="font-mono text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 line-clamp-1">
          {member.position}
        </p>

        {/* Expandable Bio with Read More / Show Less */}
        <ExpandableBio text={member.bio} maxLength={120} />

        {/* Core Competencies & Skills Pills */}
        {skillsList.length > 0 && (
          <div className="w-full my-3.5 pt-3 border-t border-white/[0.08]">
            <div className="flex flex-wrap justify-center gap-1.5">
              {skillsList.slice(0, 5).map((skill: string, idx: number) => (
                <span 
                  key={idx} 
                  className="text-xs sm:text-[13px] font-mono font-medium px-3 py-1 bg-[#141828] text-slate-300 rounded-md border border-white/[0.08]"
                >
                  {skill}
                </span>
              ))}
              {skillsList.length > 5 && (
                <span className="text-xs sm:text-[13px] font-mono font-medium px-2.5 py-1 bg-[#141828] text-slate-400 rounded-md border border-white/[0.08]">
                  +{skillsList.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Social Links Footer */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-center gap-2">
        {socialLinks.length > 0 ? (
          socialLinks.map((sLink, sIdx) => (
            <a
              key={sIdx}
              href={sLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="size-8 rounded-full bg-[#141828] border border-white/[0.1] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#FF5C00] hover:bg-[#FF5C00]/20 transition-all duration-200 cursor-pointer"
              title={`${member.name} on ${sLink.platform}`}
            >
              <SocialIcon platform={sLink.platform} className="size-4" />
            </a>
          ))
        ) : (
          <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-[#FF5C00]" />
            <span>SaroHub Verified</span>
          </span>
        )}
      </div>
    </motion.article>
  );
}

export default function LeadershipTeam({ team, sections }: TeamProps) {
  const [localTeam, setLocalTeam] = useState<any[]>(Array.isArray(team) && team.length > 0 ? team : []);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loadedSections, setLoadedSections] = useState<any[]>(sections || []);

  // Sync team prop and load directly if empty
  useEffect(() => {
    if (Array.isArray(team) && team.length > 0) {
      setLocalTeam(team);
    } else {
      api.getTeam().then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLocalTeam(data);
        }
      }).catch(console.error);
    }
  }, [team]);

  // Load team sections
  useEffect(() => {
    if (sections && sections.length > 0) {
      setLoadedSections(sections);
    } else {
      api.getTeamSections().then(setLoadedSections).catch(console.error);
    }
  }, [sections]);

  // Live real-time update listener across all components & tabs
  useEffect(() => {
    const handleDataUpdated = () => {
      api.getTeam(true).then((data) => {
        if (Array.isArray(data)) setLocalTeam(data);
      }).catch(console.error);
      api.getTeamSections(true).then((secs) => {
        if (Array.isArray(secs)) setLoadedSections(secs);
      }).catch(console.error);
    };

    window.addEventListener('sarohub-data-updated', handleDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', handleDataUpdated);
  }, []);

  // Completely dynamic department grouping based on all team members in the database
  const { founders, departmentsMap, departmentTabs } = useMemo(() => {
    const effectiveTeam = localTeam.length > 0 ? localTeam : (Array.isArray(team) && team.length > 0 ? team : []);
    const list = effectiveTeam.length > 0 ? effectiveTeam : [...OFFICIAL_FOUNDERS, ...OFFICIAL_SPECIALISTS];

    const foundersList: any[] = [];
    const deptMap: { [deptKey: string]: { meta: any; members: any[] } } = {};

    list.forEach((m) => {
      const isFounder = m.is_founder === true || m.is_founder === 1 || m.is_founder === 'true';
      const pos = (m.position || '').toLowerCase();
      const rawDept = (m.department && m.department.trim()) || m.position || (isFounder ? 'founders' : 'development');
      const deptKey = rawDept.toLowerCase().trim();

      // Check if this member belongs to Executive Founders & Leadership
      const isExecutive = isFounder || 
                          deptKey === 'founders' || 
                          deptKey.includes('executive') ||
                          pos.includes('founder') || 
                          pos.includes('ceo') || 
                          (pos.includes('cto') && m.name.toLowerCase().includes('nawaz')) || 
                          m.name.toLowerCase().includes('kazim');

      if (isExecutive) {
        foundersList.push(m);
      } else {
        const matchingSection = loadedSections.find((s: any) => 
          s.id === deptKey || 
          s.title.toLowerCase() === (m.section_title || m.department || '').toLowerCase()
        );

        const customMeta = {
          title: m.section_title || matchingSection?.title,
          description: m.section_description || matchingSection?.description,
          badge: matchingSection?.badge
        };

        const meta = getDepartmentMetadata(rawDept, customMeta);
        const secKey = meta.key === 'founders' ? 'executive' : meta.key;

        if (!deptMap[secKey]) {
          deptMap[secKey] = {
            meta: { ...meta, key: secKey },
            members: []
          };
        } else {
          if (customMeta.title) deptMap[secKey].meta.title = customMeta.title;
          if (customMeta.description) deptMap[secKey].meta.description = customMeta.description;
          if (customMeta.badge) deptMap[secKey].meta.badge = customMeta.badge;
        }
        deptMap[secKey].members.push(m);
      }
    });

    // Guarantee official founders exist without duplicates
    const finalFounders = [...foundersList];
    OFFICIAL_FOUNDERS.forEach(of => {
      const exists = finalFounders.some(f => f.id === of.id || f.name.toLowerCase() === of.name.toLowerCase());
      if (!exists) {
        finalFounders.push(of);
      }
    });

    // Build unique filter navigation tabs
    const tabs: Array<{ id: string; label: string }> = [
      { id: 'all', label: 'All Departments' },
      { id: 'founders', label: `Executive Founders (${finalFounders.length})` }
    ];

    Object.keys(deptMap).forEach((deptKey) => {
      const entry = deptMap[deptKey];
      if (entry.members && entry.members.length > 0) {
        tabs.push({
          id: deptKey,
          label: `${entry.meta.title} (${entry.members.length})`
        });
      }
    });

    return {
      founders: finalFounders,
      departmentsMap: deptMap,
      departmentTabs: tabs
    };
  }, [localTeam, team, loadedSections]);

  return (
    <section id="leadership" className="py-16 lg:py-24 bg-white border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading with subtle entrance motion */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto mb-10 lg:mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            The Minds Behind SaroHub
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal -tracking-[1.8px] text-black mb-4">
            Meet Our <span className="italic">Founders &amp; Team</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-normal leading-relaxed max-w-2xl mx-auto">
            The executive founders, engineers, product designers, media creators, and growth specialists driving research innovation and venture scaling at SaroHub.
          </p>

          {/* Dynamic Department Filter Navigation with Sliding Pill Animation */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {departmentTabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 rounded-full text-xs sm:text-sm font-mono font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'text-white'
                      : 'text-gray-700 hover:text-black hover:bg-gray-100 bg-[#FBFBFB] border border-gray-200'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeTeamTab"
                      className="absolute inset-0 rounded-full bg-black shadow-xs"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 1: THE 3 FOUNDERS & EXECUTIVE LEADERSHIP */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'founders') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mb-16 lg:mb-20"
          >
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="font-mono text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-black text-white inline-flex items-center gap-1.5 mb-3 shadow-xs">
                <Sparkles className="size-3.5 text-cyan-400" />
                <span>Executive Leadership</span>
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal -tracking-[1px] text-black">
                {founders.length === 3 ? (
                  <>The <span className="italic">3 Founders</span> of SaroHub</>
                ) : (
                  <>Executive <span className="italic">Founders & Leadership</span></>
                )}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 font-normal mt-2.5 leading-relaxed">
                Founding partners directing corporate governance, technology research, cloud engineering, and operations from Gilgit-Baltistan.
              </p>
            </div>

            {/* Responsive Founders & Leadership Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-6">
              {founders.map((founder, idx) => (
                <TeamMemberCard key={founder.id || idx} member={founder} cardIndex={idx} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* DYNAMIC SECTIONS: Any Department Added via Admin (Dev, Design, Marketing, Video, Social Media, etc.) */}
        {/* ========================================================================= */}
        {Object.keys(departmentsMap).map((deptKey) => {
          const dept = departmentsMap[deptKey];
          const isTabActive = activeTab === 'all' || activeTab === deptKey;
          if (!isTabActive) return null;

          const IconComponent = dept.meta.icon || Users;

          return (
            <motion.div
              key={deptKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-16 lg:mb-20 pt-10 border-t border-gray-200"
            >
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className={`font-mono text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border inline-flex items-center gap-1.5 mb-3 shadow-2xs ${dept.meta.badgeClass}`}>
                  <IconComponent className={`size-3.5 ${dept.meta.iconColor}`} />
                  <span>{dept.meta.badge}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-normal -tracking-[1px] text-black">
                  {dept.meta.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 font-normal mt-2.5 leading-relaxed">
                  {dept.meta.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-6">
                {dept.members.map((member: any, idx: number) => (
                  <TeamMemberCard key={member.id || idx} member={member} cardIndex={idx} />
                ))}
              </div>
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}
