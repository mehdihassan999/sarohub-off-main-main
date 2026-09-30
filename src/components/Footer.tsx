import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Logo from './Logo';
import SocialIcon from './SocialIcon';
import RollText from './common/RollText';
import DiagonalArrow from './common/DiagonalArrow';
import { api } from '../api';

interface FooterProps {
  settings: { [key: string]: string };
}

const getCompanySocialLinks = (settings: { [key: string]: string }) => {
  const links: Array<{ platform: string; url: string }> = [];
  if (settings.facebook) links.push({ platform: 'Facebook', url: settings.facebook });
  if (settings.linkedin) links.push({ platform: 'LinkedIn', url: settings.linkedin });
  if (settings.twitter) links.push({ platform: 'Twitter', url: settings.twitter });
  if (settings.instagram) links.push({ platform: 'Instagram', url: settings.instagram });
  if (settings.github) links.push({ platform: 'GitHub', url: settings.github });
  if (settings.youtube) links.push({ platform: 'YouTube', url: settings.youtube });
  if (settings.tiktok) links.push({ platform: 'TikTok', url: settings.tiktok });

  if (settings.custom_socials) {
    try {
      const custom = JSON.parse(settings.custom_socials);
      if (Array.isArray(custom)) {
        custom.forEach((c: any) => {
          if (c.url && c.url.trim()) links.push({ platform: c.platform || 'Social', url: c.url.trim() });
        });
      }
    } catch (e) {}
  }
  return links;
};

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus({ type: 'success', message: res.message });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Newsletter registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const socialLinks = getCompanySocialLinks(settings);

  return (
    <footer className="bg-[#06070B] text-white overflow-hidden border-t border-white/[0.08] relative">
      {/* Subtle bottom orange ambient glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF5C00]/5 blur-[120px] pointer-events-none -z-10" />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Top Brand & Mission Segment */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-12 border-b border-white/[0.08]">
            <div className="max-w-xl">
              <Link to="/" className="inline-block mb-4 transition-transform duration-300 hover:scale-[1.02]">
                <Logo height={42} showText={false} variant="dark" imageUrl={settings?.company_logo || settings?.logo_url} />
              </Link>
              <div className="font-mono text-xs uppercase tracking-widest text-[#FF5C00] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                Software &amp; Research Organization
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal text-white -tracking-[0.5px]">
                Where Ideas Become <span className="italic text-[#FF5C00]">Technology.</span>
              </h3>
              <p className="mt-4 text-base text-slate-400 font-normal leading-relaxed">
                Founded in Gilgit-Baltistan, Pakistan. Building for a global market.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="w-full lg:w-96">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
                Join our private newsletter
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex items-center rounded-full bg-[#0E121E] border border-white/[0.12] p-1.5 focus-within:border-[#FF5C00] transition-colors shadow-inner">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="group px-5 py-2.5 inline-flex items-center justify-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-white text-xs font-semibold rounded-full hover:shadow-[0_0_24px_rgba(255,92,0,0.5)] transition-all shrink-0 disabled:opacity-50 cursor-pointer border border-[#FFA566]/30"
                  >
                    <RollText>{loading ? 'SENDING...' : 'SUBSCRIBE'}</RollText>
                  </button>
                </div>
                {status && (
                  <p className={`text-xs mt-1 font-mono ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* 4-Column Links Grid (Vaboulus Structure) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-between gap-12 pb-16 border-b border-white/[0.08]">
            
            {/* Col 1: Use Cases & Solutions */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Use Cases</h4>
              <ul className="space-y-3.5 text-white [&>li>a]:text-base [&>li>a]:leading-6 [&>li>a]:text-slate-400 [&>li>a]:hover:text-[#FF5C00] [&>li>a]:transition-colors">
                <li><Link to="/startups">For Startups & MVPs</Link></li>
                <li><Link to="/agency-partners">Agency Partnerships</Link></li>
                <li><Link to="/industries">Industry Solutions</Link></li>
                <li><Link to="/trust">Trust, IP & Guarantees</Link></li>
                <li><Link to="/book">Schedule Discovery Call</Link></li>
                <li><Link to="/estimate">Scope & Cost Calculator</Link></li>
              </ul>
            </div>

            {/* Col 2: Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Services</h4>
              <ul className="space-y-3.5 text-white [&>li>a]:text-base [&>li>a]:leading-6 [&>li>a]:text-slate-400 [&>li>a]:hover:text-[#FF5C00] [&>li>a]:transition-colors">
                <li><Link to="/services/custom-software">Custom Software & ERP</Link></li>
                <li><Link to="/services/web-development">Web App Development</Link></li>
                <li><Link to="/services/mobile-development">Mobile App Engineering</Link></li>
                <li><Link to="/services/saas-development">SaaS Product Creation</Link></li>
                <li><Link to="/services/ai-automation">AI & Intelligent Systems</Link></li>
                <li><Link to="/services/ui-ux-design">UI/UX & Design Systems</Link></li>
                <li><Link to="/services">All Engineering Services →</Link></li>
              </ul>
            </div>

            {/* Col 3: Ventures & Craft */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Ventures & Work</h4>
              <ul className="space-y-3.5 text-white [&>li>a]:text-base [&>li>a]:leading-6 [&>li>a]:text-slate-400 [&>li>a]:hover:text-[#FF5C00] [&>li>a]:transition-colors">
                <li><Link to="/work">Selected Projects</Link></li>
                <li><Link to="/ventures">Proprietary Ventures</Link></li>
                <li><Link to="/partnerships">Partnership Programs</Link></li>
                <li><Link to="/process">How We Work</Link></li>
                <li><Link to="/technology">Technology Stack</Link></li>
                <li><Link to="/student-projects">IT Academy Capstones</Link></li>
                <li><Link to="/careers">Careers & Job Openings</Link></li>
                <li><Link to="/opportunities">Internships & Fellowships</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact & Office */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Get in Touch</h4>
              <div className="space-y-4 text-sm text-slate-400 leading-relaxed font-normal">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FF5C00] shrink-0 mt-0.5" />
                  <span>{settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#FF5C00] shrink-0" />
                  <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="hover:text-white transition-colors">
                    {settings.email || 'info@sarohub.com'}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#FF5C00] shrink-0" />
                  <a href={`tel:${settings.phone || '+923555866875'}`} className="hover:text-white transition-colors">
                    {settings.phone || '+92 355 58668 75'}
                  </a>
                </div>

                {/* Social media icons */}
                {socialLinks.length > 0 && (
                  <div className="pt-3 flex flex-wrap gap-2.5">
                    {socialLinks.map((link, idx) => {
                      const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                      return (
                        <a
                          key={idx}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-9 rounded-full bg-[#0E121E] border border-white/[0.12] text-slate-300 hover:text-white hover:border-[#FF5C00] hover:bg-[#FF5C00]/10 transition-all flex items-center justify-center"
                          aria-label={link.platform}
                        >
                          <SocialIcon platform={link.platform} className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div>
              © {currentYear} SAROHUB TECHNOLOGIES (PVT) LTD. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/trust" className="text-[#FF5C00] hover:underline">100% IP Guarantee</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
