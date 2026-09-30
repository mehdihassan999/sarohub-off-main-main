import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, Award, Briefcase, Sparkles,
  Calendar, Calculator, FileText, Factory, Rocket, Handshake, Workflow,
  Cpu, Newspaper, Presentation, Users, GraduationCap, ShieldCheck, Camera,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import RollText from './common/RollText';
import DiagonalArrow from './common/DiagonalArrow';

interface NavbarProps {
  isAdminLoggedIn: boolean;
  logoUrl?: string;
  settings?: { [key: string]: string };
}

export default function Navbar({ isAdminLoggedIn, logoUrl, settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const activeLogoUrl = logoUrl || settings?.company_logo || settings?.logo_url;

  const moreRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // NexStudio scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Services dropdown items
  const serviceItems = [
    { name: 'Custom Software', path: '/services/custom-software', desc: 'Enterprise architecture & bespoke systems' },
    { name: 'Web Development', path: '/services/web-development', desc: 'Fast, secure, responsive web platforms' },
    { name: 'Mobile Development', path: '/services/mobile-development', desc: 'Native & cross-platform iOS/Android' },
    { name: 'SaaS Development', path: '/services/saas-development', desc: 'Multi-tenant cloud subscription products' },
    { name: 'AI & Automation', path: '/services/ai-automation', desc: 'LLM workflows, agents & intelligent tools' },
    { name: 'E-Commerce Platforms', path: '/services/ecommerce-platforms', desc: 'Scalable digital stores & payment gateways' },
    { name: 'Digital Solutions', path: '/services/digital-solutions', desc: 'Modernizing internal business workflows' },
    { name: 'UI/UX Design', path: '/services/ui-ux-design', desc: 'User-centered design & interactive prototypes' },
    { name: 'Graphic Designing', path: '/services/graphic-design', desc: 'Brand identity, visual design & vector assets' },
    { name: 'Digital Marketing', path: '/services/digital-marketing', desc: 'Data-driven growth, SEO & performance ads' },
  ];

  // Secondary client tools
  const featuredClientTools = [
    { name: 'Book Consultation', path: '/book', desc: 'Reserve 30-min discovery call', icon: Calendar },
    { name: 'Scope Calculator', path: '/estimate', desc: 'Instant pricing & roadmap', icon: Calculator },
    { name: 'Trust & Guarantees', path: '/trust', desc: '100% IP rights & strict NDAs', icon: ShieldCheck },
    { name: 'Executive Deck (PDF)', path: '/capabilities', desc: 'Downloadable one-pager', icon: FileText },
  ];

  const solutionsLinks = [
    { name: 'Trust & Guarantees', path: '/trust', desc: '100% IP rights & strict NDAs', icon: ShieldCheck },
    { name: 'Industries', path: '/industries', desc: 'Sector-specific engineering', icon: Factory },
    { name: 'For Startups', path: '/startups', desc: 'MVP to venture acceleration', icon: Rocket },
    { name: 'Agency Partners', path: '/agency-partners', desc: 'White-label tech under NDA', icon: Handshake },
    { name: 'How We Work', path: '/process', desc: '6-phase delivery lifecycle', icon: Workflow },
  ];

  const ecosystemLinks = [
    { name: 'Technology Stack', path: '/technology', desc: 'Frameworks, clouds & AI', icon: Cpu },
    { name: 'Insights & Articles', path: '/insights', desc: 'Engineering thought leadership', icon: Newspaper },
    { name: 'Events & Masterclasses', path: '/events', desc: 'Tech summits & hackathons', icon: Presentation },
    { name: 'Company Gallery', path: '/gallery', desc: 'Seminars, collaborations & culture', icon: Camera },
    { name: 'Careers & Hiring', path: '/careers', desc: 'Join engineering & ventures', icon: Users },
    { name: 'Student Projects', path: '/student-projects', desc: 'IT Academy capstones', icon: GraduationCap },
  ];

  const moreLinks = [...solutionsLinks, ...ecosystemLinks];

  const allMobileLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Work & Projects', path: '/work' },
    { name: 'Ventures', path: '/ventures' },
    { name: 'Partnerships', path: '/partnerships' },
    { name: 'Trust & Guarantees', path: '/trust' },
    { name: 'Industries', path: '/industries' },
    { name: 'For Startups', path: '/startups' },
    { name: 'Agency Partners', path: '/agency-partners' },
    { name: 'How We Work', path: '/process' },
    { name: 'Technology', path: '/technology' },
    { name: 'Insights', path: '/insights' },
    { name: 'Events', path: '/events' },
    { name: 'Company Gallery', path: '/gallery' },
    { name: 'Careers & Hiring', path: '/careers' },
    { name: 'Opportunities & Fellowships', path: '/opportunities' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
    setServicesOpen(false);
    setToolsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090E]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
          : 'bg-[#08090E]/80 backdrop-blur-md border-b border-white/[0.06]'
      }`}
    >
      <nav>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4 lg:py-5">
            {/* Logo */}
            <div>
              <Link to="/" className="inline-block transition-transform duration-300 hover:scale-[1.02]">
                <Logo height={36} showText={false} variant="dark" imageUrl={activeLogoUrl} />
              </Link>
            </div>

            {/* Desktop Navigation Links (Vaboulus Style) */}
            <div className="hidden lg:block">
              <ul className="flex items-center space-x-6 xl:space-x-8">
                {/* Home */}
                <li>
                  <Link
                    to="/"
                    className={`group py-2 inline-block uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors ${
                      isActive('/') && location.pathname === '/'
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>HOME</RollText>
                  </Link>
                </li>

                {/* About */}
                <li>
                  <Link
                    to="/about"
                    className={`group py-2 inline-block uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors ${
                      isActive('/about')
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>ABOUT</RollText>
                  </Link>
                </li>

                {/* Services Dropdown */}
                <li className="relative" ref={servicesRef}>
                  <button
                    onClick={() => {
                      setServicesOpen(!servicesOpen);
                      setMoreOpen(false);
                      setToolsOpen(false);
                    }}
                    className={`group py-2 inline-flex items-center gap-1.5 uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                      location.pathname.startsWith('/services')
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>SERVICES</RollText>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        servicesOpen ? 'rotate-180 text-[#FF5C00]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 mt-3 w-80 rounded-2xl border border-white/[0.1] bg-[#0E121E]/95 backdrop-blur-2xl p-3 shadow-2xl z-50 text-left"
                      >
                        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-white/[0.08] mb-1 flex justify-between items-center">
                          <span>Capabilities</span>
                          <Link
                            to="/services"
                            onClick={() => setServicesOpen(false)}
                            className="text-[#FF5C00] font-semibold hover:underline"
                          >
                            All Services →
                          </Link>
                        </div>
                        <div className="space-y-0.5 max-h-96 overflow-y-auto pr-1">
                          {serviceItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setServicesOpen(false)}
                              className="group block px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors"
                            >
                              <div className="text-xs font-medium text-white group-hover:text-[#FF5C00] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                {/* Work / Projects */}
                <li>
                  <Link
                    to="/work"
                    className={`group py-2 inline-block uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors ${
                      isActive('/work') || isActive('/projects')
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>PROJECTS</RollText>
                  </Link>
                </li>

                {/* Ventures */}
                <li>
                  <Link
                    to="/ventures"
                    className={`group py-2 inline-block uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors ${
                      isActive('/ventures')
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>VENTURES</RollText>
                  </Link>
                </li>

                {/* Partnerships */}
                <li>
                  <Link
                    to="/partnerships"
                    className={`group py-2 inline-block uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors ${
                      isActive('/partnerships')
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>PARTNERSHIPS</RollText>
                  </Link>
                </li>

                {/* Insights / Blog */}
                <li>
                  <Link
                    to="/insights"
                    className={`group py-2 inline-block uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors ${
                      isActive('/insights') || isActive('/blog')
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>BLOG</RollText>
                  </Link>
                </li>

                {/* Careers */}
                <li>
                  <Link
                    to="/careers"
                    className={`group py-2 inline-flex items-center gap-1.5 uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors ${
                      isActive('/careers') || isActive('/opportunities')
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-[#FF5C00]'
                    }`}
                  >
                    <RollText>CAREERS</RollText>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                  </Link>
                </li>

                {/* More / Ecosystem Dropdown */}
                <li className="relative" ref={moreRef}>
                  <button
                    onClick={() => {
                      setMoreOpen(!moreOpen);
                      setServicesOpen(false);
                      setToolsOpen(false);
                    }}
                    className={`group py-2 inline-flex items-center gap-1.5 uppercase text-xs xl:text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                      moreLinks.some((l) => isActive(l.path))
                        ? 'text-[#FF5C00] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <RollText>MORE</RollText>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        moreOpen ? 'rotate-180 text-[#FF5C00]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {moreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/[0.1] bg-[#0E121E]/95 backdrop-blur-2xl p-3 shadow-2xl z-50 text-left"
                      >
                        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-white/[0.08] mb-2">
                          Client Solutions
                        </div>
                        <div className="grid grid-cols-1 gap-1 mb-3">
                          {solutionsLinks.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMoreOpen(false)}
                              className="group flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-slate-400 group-hover:text-[#FF5C00] shrink-0 transition-colors" />
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-white group-hover:text-[#FF5C00] transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-white/[0.08] mb-2">
                          Company & Ecosystem
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {ecosystemLinks.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMoreOpen(false)}
                              className="group flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-slate-400 group-hover:text-[#FF5C00] shrink-0 transition-colors" />
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-white group-hover:text-[#FF5C00] transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </ul>
            </div>

            {/* Right Action / CTA */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Signature Vaboulus Orange Pill Button */}
              <Link
                to="/contact"
                className="group px-5 lg:px-6 py-2.5 lg:py-3 hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-xs lg:text-sm font-semibold leading-5 text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2 border border-[#FFA566]/30"
              >
                <RollText>CONTACT US</RollText>
                <DiagonalArrow size={18} />
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer (Vaboulus Dark Frosted Sheet) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden border-b border-white/[0.1] bg-[#0E121E]/98 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-6">
                <ul className="space-y-1 divide-y divide-white/[0.06]">
                  {allMobileLinks.map((item) => (
                    <li key={item.path} className="pt-2">
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`group block py-2 uppercase text-sm font-medium tracking-wide transition-colors ${
                          isActive(item.path) ? 'text-[#FF5C00] font-semibold' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <RollText>{item.name}</RollText>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col gap-3">
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="group px-6 py-3.5 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-sm font-semibold text-white rounded-full shadow-[0_0_24px_rgba(255,92,0,0.38)] hover:shadow-[0_0_36px_rgba(255,92,0,0.65)] hover:scale-[1.02] transition-all text-center border border-[#FFA566]/30"
                  >
                    <RollText>CONTACT US</RollText>
                    <DiagonalArrow size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
