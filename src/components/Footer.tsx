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
    <footer className="bg-[#070707] text-white overflow-hidden border-t border-[#1F1F1F]">
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Top Brand & Mission Segment */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-12 border-b border-[#1A1A1A]">
            <div className="max-w-xl">
              <Link to="/" className="inline-block mb-4 transition-transform duration-300 hover:scale-[1.02]">
                <Logo height={42} showText={false} variant="dark" />
              </Link>
              <div className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
                Software &amp; Research Organization
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal text-white -tracking-[0.5px]">
                Where Ideas Become <span className="italic">Technology.</span>
              </h3>
              <p className="mt-4 text-base text-gray-400 font-normal leading-relaxed">
                Founded in Gilgit-Baltistan, Pakistan. Building for a global market.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="w-full lg:w-96">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
                Join our private newsletter
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex items-center rounded-full bg-[#141414] border border-[#262626] p-1.5 focus-within:border-white transition-colors">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="group px-5 py-2.5 inline-flex items-center justify-center bg-white text-black text-xs font-medium rounded-full hover:bg-gray-200 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
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

          {/* 4-Column Links Grid (NexStudio Structure) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-between gap-12 pb-16 border-b border-[#1A1A1A]">
            
            {/* Col 1: Use Cases & Solutions */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Use Cases</h4>
              <ul className="space-y-3.5 text-white [&>li>a]:text-base [&>li>a]:leading-6 [&>li>a]:text-gray-400 [&>li>a]:hover:text-white [&>li>a]:transition-colors">
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
              <ul className="space-y-3.5 text-white [&>li>a]:text-base [&>li>a]:leading-6 [&>li>a]:text-gray-400 [&>li>a]:hover:text-white [&>li>a]:transition-colors">
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
              <ul className="space-y-3.5 text-white [&>li>a]:text-base [&>li>a]:leading-6 [&>li>a]:text-gray-400 [&>li>a]:hover:text-white [&>li>a]:transition-colors">
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
              <div className="space-y-4 text-sm text-gray-400 leading-relaxed font-normal">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                  <span>{settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-300 shrink-0" />
                  <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="hover:text-white transition-colors">
                    {settings.email || 'info@sarohub.com'}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-300 shrink-0" />
                  <a href={`tel:${settings.phone || '+923555866875'}`} className="hover:text-white transition-colors">
                    {settings.phone || '+92 355 58668 75'}
                  </a>
                </div>

                {/* Social media icons */}
                {socialLinks.length > 0 && (
                  <div className="pt-4 flex flex-wrap gap-2.5">
                    {socialLinks.map((link, idx) => {
                      const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                      return (
                        <a
                          key={idx}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-9 rounded-full bg-[#181818] border border-[#2B2B2B] text-gray-300 hover:text-black hover:bg-white transition-all flex items-center justify-center"
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

          {/* Bottom Copyright and Legal Row */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-mono">
            <p>
              &copy; {currentYear} SAROHUB TECHNOLOGIES (PRIVATE) LIMITED. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 [&>a]:hover:text-white [&>a]:transition-colors">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookie-policy">Cookie Policy</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
