/**
 * SaroHub Technologies (Private) Limited
 * Enterprise Portal & Corporate Website Application Core
 */

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
  Navigate
} from 'react-router-dom';
import {
  Cpu, Mail, Phone, MapPin, Send, MessageSquare, Plus, Edit, Trash2,
  LogOut, Key, Settings, Globe, Calendar, DollarSign, Award, Users,
  CheckCircle, Clock, ArrowRight, Search, FileText, Check, Lock, User,
  TrendingUp, Briefcase, Grid, Tag, Activity, Eye, BookOpen, AlertCircle, ChevronDown, X,
  Star, ChevronLeft, ChevronRight, Sparkles, Code, RefreshCw, Package, ExternalLink,
  Download, Loader2, Server, ShieldCheck, Camera, Hash, Layers, FolderPlus,
  Crown, Rocket, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, getAuthToken, setAuthToken } from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TestimonialCarousel from './components/TestimonialCarousel';
import ChatWidget from './components/ChatWidget';
import ImageUploadField from './components/ImageUploadField';
import PublicOpportunitiesView from './components/opportunities/PublicOpportunitiesView';
import AdminOpportunitiesModule from './components/opportunities/AdminOpportunitiesModule';
import AdminPartnersModule from './components/admin/AdminPartnersModule';
import AdminSEOModule from './components/admin/AdminSEOModule';
import DocumentPreviewModal, { downloadApplicationDocument } from './components/documents/DocumentPreviewModal';
import MailOutboxModal from './components/admin/MailOutboxModal';
import FieldSettingsEditor from './components/opportunities/FieldSettingsEditor';
import { FIELD_TYPES } from './components/opportunities/FormBuilderPresets';
import { OpportunityField } from './types';

// Modular Homepage Sections
import HeroSection from './components/home/HeroSection';
import WhatWeDoSection from './components/home/WhatWeDoSection';
import SelectedVenturesSection from './components/home/SelectedVenturesSection';
import SelectedWorkSection from './components/home/SelectedWorkSection';
import CEOMessage from './components/home/CEOMessage';
import CompanyOverview from './components/home/CompanyOverview';
import CompanyStatistics from './components/home/CompanyStatistics';
import OurServices from './components/home/OurServices';
import WhyChooseUs from './components/home/WhyChooseUs';
import FeaturedProjects from './components/home/FeaturedProjects';
import StudentProjectsCarousel from './components/home/StudentProjectsCarousel';
import CompanyProducts from './components/home/CompanyProducts';
import ProjectsForSale from './components/home/ProjectsForSale';
import DevelopmentProcess from './components/home/DevelopmentProcess';
import TechnologiesWeUse from './components/home/TechnologiesWeUse';
import ClientTestimonials from './components/home/ClientTestimonials';
import LatestBlogs from './components/home/LatestBlogs';
import UpcomingEvents from './components/home/UpcomingEvents';
import EventApplicantsTable from './components/events/EventApplicantsTable';
import { UserCheck, GraduationCap } from 'lucide-react';
import LeadershipTeam from './components/home/LeadershipTeam';
import CareerOpportunitiesSection from './components/home/CareerOpportunitiesSection';
import FAQAccordion from './components/home/FAQAccordion';
import CallToAction from './components/home/CallToAction';
import NewsletterSubscription from './components/home/NewsletterSubscription';
import ContactPreview from './components/home/ContactPreview';
import PartnersCarousel from './components/home/PartnersCarousel';

// Dedicated New Views
import AboutView from './views/AboutView';
import IndustriesView from './views/IndustriesView';
import StartupsView from './views/StartupsView';
import AgencyPartnersView from './views/AgencyPartnersView';
import ProcessView from './views/ProcessView';
import TechnologyView from './views/TechnologyView';
import PartnershipsView from './views/PartnershipsView';

// Venture System
import VentureSection from './components/ventures/VentureSection';
import VentureDetail from './components/ventures/VentureDetail';
import VentureBuildingProcess from './components/ventures/VentureBuildingProcess';
import BuildWithSaroHub from './components/ventures/BuildWithSaroHub';
import VentureAdmin from './components/ventures/VentureAdmin';

// Dedicated SEO & AEO Detail Views
import ServiceDetailView from './views/ServiceDetailView';
import ProjectDetailView from './views/ProjectDetailView';
import BlogDetailView from './views/BlogDetailView';
import EventsView from './views/EventsView';
import ConsultationBookingView from './views/ConsultationBookingView';
import ProjectEstimatorView from './views/ProjectEstimatorView';
import ExecutiveDeckView from './views/ExecutiveDeckView';
import ConsultationsAdminModule from './components/admin/ConsultationsAdminModule';
import { TrustAndAssuranceView } from './views/TrustAndAssuranceView';
import { TrustAndAssuranceSection } from './components/trust/TrustAndAssuranceSection';
import { AdminTrustModule } from './components/admin/AdminTrustModule';
import { AdminGalleryModule } from './components/admin/AdminGalleryModule';
import { AdminCompanyMetricsModule } from './components/admin/AdminCompanyMetricsModule';
import { CompanyGalleryView } from './views/CompanyGalleryView';
import { CompanyGallerySlider } from './components/home/CompanyGallerySlider';
import SEOHead from './components/seo/SEOHead';
import Breadcrumbs from './components/seo/Breadcrumbs';
import { getServiceBySlug } from './data/seoContent';

// =========================================================================
// MAIN APP COMPONENT
// =========================================================================

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!getAuthToken());
  const [globalSettings, setGlobalSettings] = useState<{ [key: string]: string }>({
    company_name: 'SaroHub Technologies (Private) Limited',
    office_address: 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan',
    email: 'info@sarohub.com',
    phone: '+92 355 58668 75',
    whatsapp: '+92 355 58668 75',
    business_hours: 'Monday - Saturday: 9:00 AM - 6:00 PM (PKT)'
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sarohub-theme') || 'theme-obsidian';
  });

  useEffect(() => {
    api.getSettings().then(setGlobalSettings).catch(console.error);
    api.getVentures().catch(() => {});

    const onDataUpdated = () => {
      api.getSettings().then(setGlobalSettings).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <SEOHead />
      <div className={`flex min-h-screen flex-col font-sans antialiased bg-white text-black selection:bg-black selection:text-white relative`}>
        {/* Navigation Bar */}
        <Navbar isAdminLoggedIn={isAdminLoggedIn} />

        {/* Core Layout Pages */}
        <main className="flex-1 relative z-10 overflow-x-hidden">

          <Routes>
            <Route path="/" element={<HomeView settings={globalSettings} />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/about-us" element={<Navigate to="/about" replace />} />
            <Route path="/services" element={<ServicesView settings={globalSettings} />} />
            <Route path="/our-services" element={<Navigate to="/services" replace />} />
            <Route path="/services/:slug" element={<ServiceDetailView />} />
            
            {/* Work & Projects */}
            <Route path="/work" element={<ProjectsView />} />
            <Route path="/work/:slug" element={<ProjectDetailView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/portfolio" element={<Navigate to="/work" replace />} />
            <Route path="/case-studies" element={<Navigate to="/work" replace />} />
            <Route path="/projects/:slug" element={<ProjectDetailView />} />
            <Route path="/student-projects" element={<StudentProjectsView />} />
            
            {/* Ventures */}
            <Route path="/ventures" element={<VenturesView />} />
            <Route path="/products" element={<VenturesView />} />
            <Route path="/ventures/:slug" element={<VentureDetail />} />
            
            {/* Dedicated Venture & Partner Landing Pages */}
            <Route path="/partnerships" element={<PartnershipsView />} />
            <Route path="/industries" element={<IndustriesView />} />
            <Route path="/startups" element={<StartupsView />} />
            <Route path="/agency-partners" element={<AgencyPartnersView />} />
            <Route path="/process" element={<ProcessView />} />
            <Route path="/how-we-work" element={<Navigate to="/process" replace />} />
            <Route path="/technology" element={<TechnologyView />} />
            <Route path="/tech-stack" element={<Navigate to="/technology" replace />} />

            {/* Content & Insights */}
            <Route path="/marketplace" element={<MarketplaceView />} />
            <Route path="/insights" element={<BlogView />} />
            <Route path="/insights/:slug" element={<BlogDetailView />} />
            <Route path="/blog" element={<BlogView />} />
            <Route path="/blog/:slug" element={<BlogDetailView />} />
            <Route path="/events" element={<EventsView />} />
            <Route path="/gallery" element={<CompanyGalleryView />} />
            <Route path="/company-gallery" element={<Navigate to="/gallery" replace />} />
            <Route path="/life" element={<Navigate to="/gallery" replace />} />
            <Route path="/careers" element={<CareersView />} />
            <Route path="/opportunities" element={<PublicOpportunitiesView />} />
            <Route path="/contact" element={<ContactView settings={globalSettings} />} />
            <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

            {/* Client-Winning Growth Engines */}
            <Route path="/book" element={<ConsultationBookingView settings={globalSettings} />} />
            <Route path="/consultation" element={<Navigate to="/book" replace />} />
            <Route path="/book-consultation" element={<Navigate to="/book" replace />} />

            <Route path="/estimate" element={<ProjectEstimatorView settings={globalSettings} />} />
            <Route path="/calculator" element={<Navigate to="/estimate" replace />} />
            <Route path="/project-estimator" element={<Navigate to="/estimate" replace />} />

            <Route path="/capabilities" element={<ExecutiveDeckView settings={globalSettings} />} />
            <Route path="/deck" element={<Navigate to="/capabilities" replace />} />
            <Route path="/capabilities-deck" element={<Navigate to="/capabilities" replace />} />

            {/* Enterprise Trust, 100% IP Guarantee & Engagement Models */}
            <Route path="/trust" element={<TrustAndAssuranceView />} />
            <Route path="/guarantee" element={<Navigate to="/trust" replace />} />
            <Route path="/assurance" element={<Navigate to="/trust" replace />} />
            <Route path="/ip-guarantee" element={<Navigate to="/trust" replace />} />

            {/* Policies */}
            <Route path="/privacy-policy" element={<PolicyView title="Privacy Policy" />} />
            <Route path="/terms" element={<PolicyView title="Terms & Conditions" />} />
            <Route path="/cookie-policy" element={<PolicyView title="Cookie Policy" />} />

            {/* Portal Authentication & Hidden Panels */}
            <Route path="/admin" element={<PortalLoginView onLoginSuccess={() => setIsAdminLoggedIn(true)} />} />
            <Route path="/portal-login" element={<Navigate to="/admin" replace />} />
            <Route
              path="/control-room"
              element={
                isAdminLoggedIn ? (
                  <ControlRoomView
                    onLogout={() => {
                      api.logout();
                      setIsAdminLoggedIn(false);
                    }}
                    onSettingsChange={setGlobalSettings}
                  />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            {/* Venture Admin */}
            <Route
              path="/admin/ventures"
              element={
                isAdminLoggedIn ? (
                  <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
                    <div className="max-w-5xl mx-auto py-16">
                      <VentureAdmin />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
          </Routes>
        </main>

        {/* Corporate Footer */}
        <Footer settings={globalSettings} />

        {/* Global floating live chat portal widget */}
        <ChatWidget />


      </div>
    </Router>
  );
}

// =========================================================================
// 1. PUBLIC VIEW COMPONENTS
// =========================================================================

// --- HOME VIEW ---
function HomeView({ settings }: { settings: { [key: string]: string } }) {
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [saleProjects, setSaleProjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [homeSettings, setHomeSettings] = useState<{ [key: string]: string }>(settings || {});

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setHomeSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    api.getSettings().then(setHomeSettings).catch(console.error);
    api.getServices().then(setServices).catch(console.error);
    api.getProjects().then(setProjects).catch(console.error);
    api.getProducts().then(setProducts).catch(console.error);
    api.getTeam().then(setTeam).catch(console.error);
    api.getBlogs().then(setBlogs).catch(console.error);
    api.getSaleProjects().then(setSaleProjects).catch(console.error);
    api.getEvents().then(setEvents).catch(console.error);
    api.getTestimonials().then(setTestimonials).catch(console.error);

    const onDataUpdated = () => {
      api.getSettings().then(setHomeSettings).catch(console.error);
      api.getProjects().then(setProjects).catch(console.error);
      api.getProducts().then(setProducts).catch(console.error);
      api.getSaleProjects().then(setSaleProjects).catch(console.error);
      api.getEvents().then(setEvents).catch(console.error);
      api.getBlogs().then(setBlogs).catch(console.error);
      api.getServices().then(setServices).catch(console.error);
      api.getTeam().then(setTeam).catch(console.error);
      api.getTestimonials().then(setTestimonials).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  useEffect(() => {
    console.debug('[HOME] projects loaded:', projects.length);
  }, [projects]);

  return (
    <div className="relative">
      <SEOHead
        title="SAROHUB | Where Ideas Become Technology. Software & Research Organization"
        description="SAROHUB is a Software & Research Organization. Where Ideas Become Technology. Custom software, research innovation, and proprietary ventures from Gilgit-Baltistan to the world."
      />
      {/* 01 — Hero */}
      <HeroSection settings={homeSettings} />

      {/* 02 — What We Do */}
      <WhatWeDoSection settings={homeSettings} />

      {/* 03 — Selected Ventures / Products */}
      <SelectedVenturesSection />

      {/* 04 — Selected Work */}
      <SelectedWorkSection projects={projects} />

      {/* 05 — Upcoming Events & Masterclasses */}
      <UpcomingEvents events={events} />

      {/* 06 — Why SaroHub */}
      <WhyChooseUs settings={homeSettings} />

      {/* Enterprise Trust, Verified Badges & 100% IP Guarantee */}
      <TrustAndAssuranceSection showAllSections={false} />

      {/* Leadership & Specialized Teams (Founders, Development, Design, Marketing) */}
      <LeadershipTeam team={team} />

      {/* Actively Hiring: Careers, Internships & Fellowships */}
      <CareerOpportunitiesSection />

      {/* Trusted by Global Industry Leaders — Client Reviews CMS */}
      <ClientTestimonials testimonials={testimonials} />

      {/* Image Gallery — Modern Professional Slider */}
      <CompanyGallerySlider />

      {/* 06 — SaroHub in Numbers */}
      <CompanyStatistics />

      {/* 07 — Final CTA */}
      <CallToAction settings={homeSettings} />
    </div>
  );
}

// --- SERVICES VIEW ---
function ServicesView({ settings }: { settings?: { [key: string]: string } }) {
  const [services, setServices] = useState<any[]>([]);
  const [serviceSettings, setServiceSettings] = useState<{ [key: string]: string }>(settings || {});

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setServiceSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    api.getSettings().then(setServiceSettings).catch(console.error);
    api.getServices().then(setServices).catch(console.error);

    const onDataUpdated = () => {
      api.getSettings().then(setServiceSettings).catch(console.error);
      api.getServices().then(setServices).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <div className="relative">
      <SEOHead
        title="Software & Technology Services | SaroHub Technologies"
        description="Comprehensive engineering services including custom software development, web & mobile applications, SaaS engineering, AI automation, and cloud systems."
        keywords="software development services, custom software Skardu, SaaS development Pakistan, AI automation services, web applications"
        canonicalUrl="https://sarohub.com/services"
      />
      <div className="py-16 border-b text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            Capabilities & Verticals
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            Software & Technology Services
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Custom software development, scalable cloud systems, web platforms, and practical AI solutions.
          </p>
        </div>
      </div>
      <OurServices services={services} />
      <DevelopmentProcess />
      <TechnologiesWeUse />
      <WhyChooseUs settings={serviceSettings} />
      <CallToAction settings={serviceSettings} />
    </div>
  );
}

// --- CLIENT PROJECTS / SELECTED WORK VIEW ---
function ProjectsView() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    const onDataUpdated = () => {
      api.getProjects().then(setProjects).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="Selected Work & Case Studies | SaroHub Technologies"
        description="Explore enterprise applications, cloud architectures, and digital products engineered by SaroHub Technologies for global clients."
        keywords="SaroHub portfolio, SaroHub case studies, software projects, web applications Skardu, SaaS products Pakistan"
        canonicalUrl="https://sarohub.com/work"
      />
      <FeaturedProjects projects={projects} />
    </div>
  );
}

// --- IT ACADEMY STUDENT PROJECTS VIEW ---
function StudentProjectsView() {
  const [studentProjects, setStudentProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getStudentProjects().then(setStudentProjects).catch(console.error);

    const onDataUpdated = () => {
      api.getStudentProjects().then(setStudentProjects).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="IT Academy Capstone Projects | SaroHub Technologies"
        description="Discover production-grade software applications and portfolio systems developed by students and fellows at the SaroHub IT Academy in Gilgit-Baltistan."
        keywords="SaroHub IT Academy, student projects Skardu, software training Gilgit Baltistan, tech talent Pakistan"
        canonicalUrl="https://sarohub.com/student-projects"
      />
      <StudentProjectsCarousel studentProjects={studentProjects} />
    </div>
  );
}

// --- OUR VENTURES & PRODUCTS VIEW ---
function VenturesView() {
  return (
    <div className="relative">
      <SEOHead
        title="Proprietary Ventures & Digital Products | SaroHub Technologies"
        description="Discover proprietary software products, SaaS platforms, and digital ventures developed and scaled in-house by SaroHub Technologies."
        keywords="SaroHub ventures, tech ventures Pakistan, SaaS incubator, software ventures Skardu, proprietary products"
        canonicalUrl="https://sarohub.com/ventures"
      />
      <VentureSection />
      <VentureBuildingProcess />
      <BuildWithSaroHub />
    </div>
  );
}

// --- MARKETPLACE VIEW ---
function MarketplaceView() {
  const [saleProjects, setSaleProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showInquiryModal, setShowInquiryModal] = useState<any | null>(null);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [isInquirySubmitting, setIsInquirySubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    api.getSaleProjects().then(setSaleProjects).catch(console.error);
    api.getSettings().then(setSettings).catch(console.error);

    const onDataUpdated = () => {
      api.getSaleProjects().then(setSaleProjects).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  const derivedCategories = React.useMemo(() => {
    const cats = saleProjects.flatMap((p) => {
      if (!p) return [];
      const tech = Array.isArray(p.technology) ? p.technology : (p.technology ? String(p.technology).split(/[,|•]/) : []);
      return tech.map((t: any) => String(t).trim()).filter(Boolean);
    });
    return ['All', ...Array.from(new Set(cats))];
  }, [saleProjects]);

  const filteredSaleProjects = React.useMemo(() => {
    if (activeTab === 'All') return saleProjects;
    return saleProjects.filter(p => {
      if (!p) return false;
      const tech = Array.isArray(p.technology)
        ? p.technology.map((t: any) => String(t).trim())
        : String(p.technology || '').split(/[,|•]/).map(s => s.trim());
      return tech.includes(activeTab);
    });
  }, [saleProjects, activeTab]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInquirySubmitting) return;
    setIsInquirySubmitting(true);
    try {
      await api.submitContactForm({
        name: inquiryForm.name,
        email: inquiryForm.email,
        subject: 'Marketplace Inquiry: ' + (showInquiryModal?.title || 'Software Template'),
        message: inquiryForm.message
      });
      setSuccessMsg('Thank you! Your inquiry message has been successfully sent to info@sarohub.com. We will contact you at ' + inquiryForm.email + ' shortly.');
      setInquiryForm({ name: '', email: '', message: '' });
      setTimeout(() => {
        setShowInquiryModal(null);
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      setSuccessMsg('❌ Failed to send inquiry. Please try again or contact us directly at info@sarohub.com');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setIsInquirySubmitting(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : '';
  };

  const parseScreenshots = (screenshots: any): string[] => {
    if (!screenshots) return [];
    if (Array.isArray(screenshots)) return screenshots.filter(Boolean);
    if (typeof screenshots === 'string') {
      return screenshots.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/50 mb-4">
          <Tag className="h-3 w-3" /> Ready Templates
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">Commercial Software Templates</h1>
        <p className="mt-4 text-sm text-slate-600 max-w-2xl">
          Purchase fully developed, production-ready source code templates. All items come with modular structures, database setups, and 12-month technical SLA support.
        </p>

        <p className="mt-2 text-xs text-slate-500">Showing <strong>{filteredSaleProjects.length}</strong> {filteredSaleProjects.length === 1 ? 'template' : 'templates'}</p>

        {/* Tab filters */}
        {derivedCategories.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-6">
            {derivedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`rounded-lg px-4 py-2 text-xs font-mono font-semibold transition-all cursor-pointer ${activeTab === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filteredSaleProjects.length === 0 ? (
          <div className="mt-12 bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 font-medium">
            No commercial templates found for the selected filter.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredSaleProjects.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-48 overflow-hidden relative bg-slate-100">
                    <img src={item.thumbnail_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <span className="absolute top-4 right-4 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold font-mono text-white shadow-sm">
                      {item.price ? `$${item.price}` : 'Inquire'}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">{item.short_description}</p>

                    {/* Features */}
                    <div className="mt-4 space-y-2">
                      {Array.isArray(item.features) ? item.features.slice(0, 3).map((f: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      )) : null}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-6 border-t border-slate-100 flex gap-4 justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400 font-medium truncate">Tech: {Array.isArray(item.technology) ? item.technology.join(', ') : 'React/Node'}</span>
                  <button
                    onClick={() => setShowInquiryModal(item)}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all shadow-md hover:shadow-cyan-500/20 cursor-pointer font-mono"
                  >
                    View Details & Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inquiry Modal */}
        <AnimatePresence>
          {showInquiryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" onClick={() => setShowInquiryModal(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl my-3 sm:my-8 max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] overflow-hidden flex flex-col relative"
              >
                <div className="flex justify-between items-start mb-6 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1.5 uppercase">
                      Commercial Software Solution
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{showInquiryModal.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                        USD {showInquiryModal.price ? `$${showInquiryModal.price}` : 'Pricing Upon Request'}
                      </span>
                      {Array.isArray(showInquiryModal.technology) && showInquiryModal.technology.map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInquiryModal(null)}
                    aria-label="Close product inquiry"
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="min-h-0 overflow-y-auto pr-1 sm:pr-2 space-y-6">
                  {/* VIDEO SHOWCASE */}
                  {showInquiryModal.video_url && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Product Demo Video:</h4>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                        {getYoutubeEmbedUrl(showInquiryModal.video_url) ? (
                          <iframe
                            src={getYoutubeEmbedUrl(showInquiryModal.video_url)}
                            title="Product Demo"
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950">
                            <Globe className="h-8 w-8 text-cyan-400 mb-2 animate-pulse" />
                            <p className="text-[11px] text-slate-400">External demo presentation link:</p>
                            <a
                              href={showInquiryModal.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-colors"
                            >
                              Launch Presentation <ArrowRight className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* IMAGES & SCREENSHOTS */}
                  {parseScreenshots(showInquiryModal.screenshots).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Product Screenshots:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {parseScreenshots(showInquiryModal.screenshots).map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative h-24 rounded-xl overflow-hidden border border-slate-800 group bg-slate-900">
                            <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DESCRIPTION & FEATURES */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Product Capability Overview:</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                      {showInquiryModal.description || showInquiryModal.short_description}
                    </p>

                    {Array.isArray(showInquiryModal.features) && showInquiryModal.features.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {showInquiryModal.features.map((feat: string, i: number) => (
                          <div key={i} className="flex gap-2 items-start text-xs text-slate-300">
                            <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CONTACT & BUY OPTIONS */}
                  <div className="border-t border-slate-800 pt-6 space-y-4">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Procurement & Licensing Channels:</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Email inquiry card */}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('info@sarohub.com')}&su=${encodeURIComponent('Inquiry: Procurement of Software Product - ' + showInquiryModal.title)}&body=${encodeURIComponent('Hello SaroHub, I am interested in procuring a license for the "' + showInquiryModal.title + '" corporate software product.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 transition-all group"
                      >
                        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">Email</span>
                          <span className="block text-xs font-bold text-white group-hover:text-blue-300 truncate">info@sarohub.com</span>
                        </div>
                      </a>

                      {/* WhatsApp 1 */}
                      <a
                        href={`https://wa.me/923430381473?text=${encodeURIComponent('Hello SaroHub! I am interested in the "' + showInquiryModal.title + '" software product. Please share more details.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all group"
                      >
                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">WhatsApp</span>
                          <span className="block text-xs font-bold text-white group-hover:text-emerald-300">0343 0381473</span>
                        </div>
                      </a>

                      {/* WhatsApp 2 */}
                      <a
                        href={`https://wa.me/923555866875?text=${encodeURIComponent('Hello SaroHub! I am interested in the "' + showInquiryModal.title + '" software product. Please share more details.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all group"
                      >
                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">WhatsApp</span>
                          <span className="block text-xs font-bold text-white group-hover:text-emerald-300">0355 5866875</span>
                        </div>
                      </a>
                    </div>

                    {/* MESSAGE INBOX BOX */}
                    <div className="bg-slate-900/70 rounded-2xl p-5 border border-slate-800 mt-4">
                      <span className="block text-xs font-mono text-slate-400 uppercase mb-3">Leave an instant inquiry message:</span>
                      {successMsg ? (
                        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-400 font-medium">
                          {successMsg}
                        </div>
                      ) : (
                        <form onSubmit={handleInquirySubmit} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              required
                              placeholder="Your Name (e.g. John Doe)"
                              value={inquiryForm.name}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <input
                              type="email"
                              required
                              placeholder="Your Email (e.g. you@company.com)"
                              value={inquiryForm.email}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                          <textarea
                            required
                            rows={2}
                            placeholder="Please specify customization or licensing requirements..."
                            value={inquiryForm.message}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={isInquirySubmitting}
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 text-xs font-bold text-slate-950 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isInquirySubmitting ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />
                                <span>Sending Procurement Inquiry...</span>
                              </>
                            ) : (
                              <span>Send Procurement Inquiry</span>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// --- BLOG VIEW (CMS) ---
function BlogView() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [activePost, setActivePost] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadBlogs = () => {
      Promise.all([
        api.getBlogs(),
        api.getBlogCategories(),
        api.getBlogTags()
      ]).then(([blogsData, catsData, tagsData]) => {
        setBlogs(blogsData || []);
        setCategories(catsData || []);
        setTags(tagsData || []);

        const postId = searchParams.get('id') || searchParams.get('post');
        if (postId && Array.isArray(blogsData)) {
          const found = blogsData.find((b: any) => String(b.id) === String(postId));
          if (found) setActivePost(found);
        }
      }).catch(console.error);
    };

    loadBlogs();

    window.addEventListener('sarohub-data-updated', loadBlogs);
    return () => window.removeEventListener('sarohub-data-updated', loadBlogs);
  }, []);

  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePost]);

  const openPost = (item: any) => {
    setActivePost(item);
    setSearchParams({ id: String(item.id) });
  };

  const closePost = () => {
    setActivePost(null);
    setSearchParams({});
  };

  const filteredBlogs = blogs.filter(b => {
    const matchSearch = (b.title || '').toLowerCase().includes(search.toLowerCase()) || (b.content || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === null || b.category_id === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col lg:flex-row gap-12 justify-between items-start">
          <div className="w-full lg:w-3/4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/50 mb-4">
              <BookOpen className="h-3 w-3" /> Articles & Insights
            </span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">Blog & Insights</h1>
            <p className="mt-4 text-sm text-slate-600 mb-12 max-w-2xl">
              Practical tech guides, software development tutorials, and technology updates compiled by our team.
            </p>

            {/* Blogs List */}
            <div className="space-y-8">
              {filteredBlogs.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 font-medium">
                  No blog articles found matching your criteria.
                </div>
              ) : (
                filteredBlogs.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openPost(item)}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-full md:w-2/5 h-64 overflow-hidden relative bg-slate-100 shrink-0">
                      <img src={item.featured_image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-4 items-center text-xs text-slate-400">
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] text-blue-700 font-mono font-bold">
                            {categories.find(c => c.id === item.category_id)?.name || 'Technical'}
                          </span>
                          <span>{item.reading_time || '5 min read'}</span>
                          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">{item.content ? item.content.replace(/[#*`_]/g, '') : ''}</p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'} alt={item.author_name} className="h-8 w-8 rounded-full object-cover bg-slate-100" referrerPolicy="no-referrer" />
                          <span className="text-xs text-slate-700 font-semibold">{item.author_name || 'SaroHub Team'}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPost(item);
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Read Article <BookOpen className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/4 space-y-8 lg:sticky lg:top-24">
            {/* Search */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-bold">Search Bulletin</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Query syntax..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                <Search className="absolute right-3 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-bold">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`block w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${selectedCat === null ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  All Research Areas
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`block w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${selectedCat === c.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Blog Post Overlay */}
        <AnimatePresence>
          {activePost && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden"
              onClick={closePost}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl h-[calc(100dvh-3rem)] max-h-[calc(100dvh-3rem)] sm:h-[78vh] sm:max-h-[78vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Fixed Top Modal Header with Guaranteed Visible Close Button */}
                <div className="relative z-50 flex items-center gap-2 px-4 pr-16 py-3 bg-white border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">Engineering Article</span>
                  </div>
                  <button
                    onClick={closePost}
                    aria-label="Close article modal"
                    className="absolute top-2 right-3 z-[60] h-10 w-10 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Scrollable Modal Content Container */}
                <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
                  {/* Hero / Banner Image */}
                  <div className="h-40 sm:h-64 md:h-72 overflow-hidden relative bg-slate-100">
                    <img
                      src={activePost.featured_image_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={activePost.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  </div>

                  {/* Article Detail Body */}
                  <div className="p-4 pb-8 sm:p-6 sm:pb-10 md:p-8 md:pb-12">
                    <div className="flex flex-wrap gap-2.5 items-center text-xs text-slate-500">
                      <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] text-blue-700 font-mono font-bold">
                        {categories.find(c => c.id === activePost.category_id)?.name || 'Technical'}
                      </span>
                      <span>{activePost.reading_time || '5 min read'}</span>
                      <span>&bull;</span>
                      <span>{activePost.created_at ? new Date(activePost.created_at).toLocaleDateString() : ''}</span>
                    </div>

                    <h2 className="mt-4 font-display text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                      {activePost.title}
                    </h2>

                    {/* Author detail */}
                    <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-5">
                      <img
                        src={activePost.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'}
                        alt={activePost.author_name}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover bg-slate-100 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{activePost.author_name || 'SaroHub Team'}</h5>
                        <span className="text-[10px] font-mono text-slate-400 font-medium">Research & Development Lead</span>
                      </div>
                    </div>

                    <div className="mt-6 text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
                      {activePost.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// --- CAREERS VIEW ---
function CareersView() {
  const [careers, setCareers] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'careers' | 'internships' | 'scholarships'>('all');
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', cvUrl: '', coverLetter: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scroll and allow Escape key when modal is open
  useEffect(() => {
    if (activeJob) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveJob(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activeJob]);

  const fetchAllData = () => {
    setLoading(true);
    Promise.all([
      api.getCareers().catch(() => []),
      api.getOpportunities().catch(() => [])
    ]).then(([cData, oData]) => {
      setCareers(Array.isArray(cData) ? cData.filter((j: any) => j.is_active !== false) : []);
      setOpportunities(Array.isArray(oData) ? oData.filter((o: any) => {
        const isPub = o.is_published === true || o.is_published === 1 || o.is_published === 'true' || o.is_published === '1' || o.is_published === undefined;
        const st = (o.status || 'open').toLowerCase();
        return isPub && (st === 'open' || st === 'active');
      }) : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllData();
    window.addEventListener('sarohub-data-updated', fetchAllData);
    return () => window.removeEventListener('sarohub-data-updated', fetchAllData);
  }, []);

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError('');
    const file = e.target.files?.[0];
    if (!file) { setCvFile(null); return; }
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      setCvError('Only PDF and Word documents (.pdf, .doc, .docx) are accepted.');
      setCvFile(null);
      e.target.value = '';
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setCvError('File size must be under 5MB. Please upload a smaller file.');
      setCvFile(null);
      e.target.value = '';
      return;
    }
    setCvFile(file);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setCvError('Please upload your CV/Resume (PDF or Word format).');
      return;
    }
    setIsSubmitting(true);
    try {
      let uploadedCvUrl = '';
      try {
        const uploadRes = await api.uploadCv(cvFile);
        uploadedCvUrl = uploadRes.url;
      } catch (uploadErr) {
        // Fallback to base64 encoding if direct upload encounters an error
        const reader = new FileReader();
        uploadedCvUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(cvFile);
        });
      }

      if (activeJob.isOpportunity) {
        try {
          await api.submitOpportunityApplication(activeJob.id, {
            'Full Name': applyForm.name,
            'Email Address': applyForm.email,
            'Phone Number': applyForm.phone,
            'Cover Letter': applyForm.coverLetter,
            'CV / Resume': uploadedCvUrl
          });
        } catch {
          // Also submit to generic application if opportunity submission had schema mismatch
          await api.submitApplication({
            career_id: activeJob.id,
            full_name: applyForm.name,
            email: applyForm.email,
            phone: applyForm.phone,
            resume_url: uploadedCvUrl,
            resume_filename: cvFile.name,
            cover_letter: `Applied for Opportunity: ${activeJob.position}. Cover: ${applyForm.coverLetter}`
          });
        }
      } else {
        await api.submitApplication({
          career_id: activeJob.id,
          full_name: applyForm.name,
          email: applyForm.email,
          phone: applyForm.phone,
          resume_url: uploadedCvUrl,
          resume_filename: cvFile.name,
          cover_letter: applyForm.coverLetter
        });
      }

      setSuccess('Application submitted successfully! Our talent acquisition and review committee will evaluate your credentials and respond shortly.');
      setApplyForm({ name: '', email: '', phone: '', cvUrl: '', coverLetter: '' });
      setCvFile(null);
      setTimeout(() => {
        setActiveJob(null);
        setSuccess('');
      }, 4000);
    } catch (err: any) {
      alert(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine items for unified filtering
  const allItems: any[] = [
    ...careers.map(c => ({
      ...c,
      isOpportunity: false,
      itemType: (c.job_type || '').toLowerCase().includes('intern') ? 'internship' : 'career',
      displayType: c.job_type || 'Full-Time Job',
      displayTitle: c.position,
      displaySubtitle: `${c.department || 'Engineering'} • ${c.experience || 'Experience Target'}`,
      displayComp: c.salary,
      displayLocation: c.location || 'Hybrid / Onsite',
      displayDesc: c.description,
      displaySkills: Array.isArray(c.skills) ? c.skills : []
    })),
    ...opportunities.map(o => ({
      ...o,
      isOpportunity: true,
      itemType: (o.type || '').toLowerCase().includes('intern') ? 'internship' : 'scholarship',
      displayType: o.type || 'Program',
      displayTitle: o.title,
      displaySubtitle: `${o.location || 'Academic & Research Wing'} • ${o.duration || 'Program Duration'}`,
      displayComp: o.benefits,
      displayLocation: o.location || 'Skardu HQ / Remote',
      displayDesc: o.short_description || o.description,
      displaySkills: []
    }))
  ];

  const filteredItems = allItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'careers') return !item.isOpportunity && item.itemType !== 'internship';
    if (activeTab === 'internships') return item.itemType === 'internship';
    if (activeTab === 'scholarships') return item.itemType === 'scholarship';
    return true;
  });

  return (
    <div className="py-20 lg:py-24 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200/80 mb-4 shadow-2xs">
            <Briefcase className="h-4 w-4 text-blue-600" /> SaroHub Talent &amp; Innovation Portal
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Build the Future <span className="text-blue-600">With Us</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Join SaroHub Technologies to build next-generation enterprise software, AI-driven solutions, and digital infrastructures that power businesses worldwide. Explore our open positions, university internships, and technical research fellowships.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Openings &amp; Programs ({allItems.length})
          </button>
          <button
            onClick={() => setActiveTab('careers')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'careers'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Full-Time Jobs ({careers.filter(c => !(c.job_type || '').toLowerCase().includes('intern')).length})
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'internships'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Internships &amp; Traineeships ({allItems.filter(i => i.itemType === 'internship').length})
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'scholarships'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Scholarships &amp; Fellowships ({opportunities.filter(o => !(o.type || '').toLowerCase().includes('intern')).length})
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {loading ? (
            [1, 2, 3, 4].map(n => (
              <div key={n} className="h-64 rounded-2xl bg-white border border-slate-200 p-8 animate-pulse" />
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={`${item.isOpportunity ? 'opp' : 'career'}-${item.id}`} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                {item.banner_url && (
                  <div className="w-full h-48 overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img src={item.banner_url} alt={item.displayTitle} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500" />
                  </div>
                )}
                {item.featured_image_url && !item.banner_url && (
                  <div className="w-full h-48 overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img src={item.featured_image_url} alt={item.displayTitle} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                      <span className="font-mono text-xs sm:text-sm text-blue-700 font-bold uppercase tracking-wider">
                        {item.displaySubtitle}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-xs sm:text-sm font-mono font-bold shadow-2xs">
                          {item.displayType}
                        </span>
                        {item.displayLocation && (
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm font-mono font-semibold border border-slate-200">
                            {item.displayLocation}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-2 font-display text-2xl sm:text-[26px] font-bold text-slate-950 group-hover:text-blue-600 transition-colors tracking-tight">
                      {item.displayTitle}
                    </h3>

                    {item.displayComp && (
                      <div className="mt-3 flex items-center gap-1.5 text-sm sm:text-base font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl w-fit">
                        <DollarSign className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                        <span>{item.displayComp}</span>
                      </div>
                    )}

                    <p className="mt-4 text-base text-slate-700 leading-relaxed font-normal line-clamp-3">
                      {item.displayDesc}
                    </p>

                    {item.deadline && (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg">
                        <Calendar className="h-4 w-4 text-rose-500" />
                        <span>Deadline: {item.deadline}</span>
                      </div>
                    )}

                    {item.displaySkills && item.displaySkills.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {item.displaySkills.map((s: string, idx: number) => (
                          <span key={idx} className="rounded-lg bg-slate-100 border border-slate-300 px-3 py-1 text-xs sm:text-[13px] font-mono font-bold text-slate-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-xs sm:text-sm font-mono font-semibold text-slate-500">
                      {item.isOpportunity ? 'Academic / Fellowship' : 'Direct Hiring'}
                    </span>
                    <button
                      onClick={() => setActiveJob({
                        ...item,
                        id: item.id,
                        position: item.displayTitle,
                        department: item.department || item.type || 'Engineering & Research',
                        experience: item.experience || item.duration || 'Standard Eligibility'
                      })}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs sm:text-sm font-bold text-white cursor-pointer shadow-sm transition-all hover:shadow-md inline-flex items-center gap-1.5"
                    >
                      <span>{item.isOpportunity ? 'Apply for Program' : 'Apply for Vacancy'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-20 px-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
              <Briefcase className="h-14 w-14 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900">No Postings in This Category Currently Listed</h3>
              <p className="text-base text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                We are constantly expanding our engineering, AI, and cloud teams. Submit your CV for future openings and priority consideration.
              </p>
              <button
                onClick={() => setActiveJob({ id: 0, position: 'General Application & Executive Talent Pool', department: 'Talent Acquisition', experience: 'Open' })}
                className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Submit General Application</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Apply Modal */}
        <AnimatePresence>
          {activeJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      {activeJob.department || 'Career Opening'}
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-slate-950">
                      {activeJob.position}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 font-medium">Requirement: {activeJob.experience}</p>
                  </div>
                  <button 
                    onClick={() => setActiveJob(null)} 
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {success ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900 leading-relaxed font-medium mt-4">
                    {success}
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4.5 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={applyForm.name}
                          onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">Phone Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="+92 3XX XXXXXXX"
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                        Upload CV / Resume * <span className="text-slate-500 font-normal lowercase">(PDF or Word, max 5MB)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleCvFileChange}
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-2.5 text-sm text-slate-950 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {cvFile && (
                          <p className="mt-2 text-xs font-bold text-emerald-700 font-mono flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-emerald-600" /> {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                        {cvError && (
                          <p className="mt-2 text-xs font-bold text-rose-600">{cvError}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">Cover Letter Summary</label>
                      <textarea
                        rows={3}
                        placeholder="Highlight your background, relevant achievements, or why you'd be a great fit..."
                        value={applyForm.coverLetter}
                        onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveJob(null)}
                        className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md cursor-pointer transition-colors"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- CONTACT VIEW ---
function ContactView({ settings }: { settings: { [key: string]: string } }) {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const subjectParam = searchParams.get('subject');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: serviceParam ? `Consultation: ${serviceParam}` : (subjectParam || ''),
    message: serviceParam ? `Hello, I would like to consult with your engineering team regarding ${serviceParam}.` : ''
  });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceParam) {
      setForm(prev => ({
        ...prev,
        subject: `Consultation: ${serviceParam}`,
        message: prev.message || `Hello, I would like to consult with your engineering team regarding ${serviceParam}.`
      }));
    }
  }, [serviceParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMsg(null);
    try {
      await api.submitContactForm(form);
      setMsg({ type: 'success', text: 'Thank you! Your message has been received. Our team will review your requirements and respond within 24 business hours.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Unable to submit your message at this time. Please try again in a moment or email us directly at info@sarohub.com.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-slate-50">
      <SEOHead
        title="Contact Us & Project Inquiries | SaroHub Technologies"
        description="Connect with SaroHub Technologies for custom software development, venture building partnerships, startup MVPs, or technology consultations."
        keywords="contact SaroHub, software inquiry, hire software engineers Skardu, build startup venture, technology consultation"
        canonicalUrl="https://sarohub.com/contact"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Details */}
          <div>
            <span className="font-mono text-xs text-blue-600 uppercase font-bold tracking-wider">Start A Conversation</span>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Let's Build Something Great</h1>
            <p className="mt-6 text-sm text-slate-600 leading-relaxed">
              Connect with our engineering and partnership team to discuss ventures, custom software development, startup MVPs, or strategic collaborations.
            </p>

            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Headquarters & Tech Center</h4>
                  <p className="text-xs text-slate-500 mt-1">{settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Email Inquiries</h4>
                  <p className="text-xs font-semibold mt-1">
                    <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                      {settings.email || 'info@sarohub.com'}
                    </a>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Send RFPs, proposals & direct emails</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Direct Phone & WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-1">{settings.whatsapp || settings.phone || '+92 343 0381473'}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Working Hours</h4>
                  <p className="text-xs text-slate-500 mt-1">{settings.business_hours || 'Monday – Friday: 9:00 AM – 6:00 PM (PKT)'}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
            <h3 className="font-display text-xl font-bold text-slate-900 mb-6">Send Us A Message</h3>

            {msg && (
              <div className={`mb-6 p-4 rounded-xl border text-xs leading-relaxed font-medium ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Contact Phone / WhatsApp (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., +92 343 0381473"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Start a Project / Technical Consultation"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Your Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe your project scope, requirements, or inquiry..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                id="contact-form-submit-btn"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed py-3 text-sm font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- STANDARD POLICY VIEW ---
function PolicyView({ title }: { title: string }) {
  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-sm">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 mb-8">{title}</h1>
        <div className="text-slate-600 leading-relaxed space-y-6 text-sm">
          <p>
            Operating as an official software institution (SaroHub Technologies (Private) Limited), we enforce security headers and isolated virtual private networks to maintain user protection.
          </p>
          <h3 className="font-display font-bold text-slate-900 text-base mt-8">1. Database Security Protocol</h3>
          <p>
            All application credentials, emails, and phone logs registered through our site are parsed securely utilizing parameterized SQL configurations to completely prevent SQL injection vectors.
          </p>
          <h3 className="font-display font-bold text-slate-900 text-base mt-8">2. Operational SLA Warranties</h3>
          <p>
            Systems, purchase queries, and client data arrays are maintained on continuous replication disks to prevent transaction loss.
          </p>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 2. ADMIN PANEL / CONTROL ROOM VIEWS
// =========================================================================

// --- LOGIN VIEW ---
interface PortalLoginProps {
  onLoginSuccess: () => void;
}

function PortalLoginView({ onLoginSuccess }: PortalLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(username, password);
      onLoginSuccess();
      navigate('/control-room');
    } catch (err: any) {
      setError(err.message || 'Access Denied. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);
    try {
      const response = await api.forgotPassword(forgotEmail);
      setForgotSuccess(response.message || 'Password reset email sent successfully.');
    } catch (err: any) {
      setForgotError(err.message || 'Failed to submit recovery request.');
    } finally {
      setForgotLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="flex min-h-[70vh] bg-slate-50 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
              <Key className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">Reset Credentials</h2>
            <p className="mt-2 text-xs font-mono text-slate-500 font-medium">Security Authorization & Identity Verification</p>
          </div>

          {forgotError && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>{forgotError}</span>
            </div>
          )}

          {forgotSuccess ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex flex-col gap-2 font-medium">
                <div className="flex items-center gap-2 font-bold font-mono">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>RECOVERY SENT SUCCESSFULLY</span>
                </div>
                <p className="leading-relaxed mt-1 text-slate-600">{forgotSuccess}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setForgotSuccess('');
                  setForgotEmail('');
                }}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Administrative Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="cyberm0101noirhat@gmail.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {forgotLoading ? 'Verifying Identity...' : 'Dispatch Reset Email'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setForgotError('');
                }}
                className="w-full rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] bg-slate-50 items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">Secure Control Room</h2>
          <p className="mt-2 text-xs font-mono text-slate-500 font-medium">SuperAdmin Gateway Credentials Required</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">Administrative Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono text-slate-500">Encrypted Password Core</label>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setError('');
                }}
                className="text-[10px] font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- PORTAL CONTROL ROOM PANEL ---
function ControlRoomView({ onLogout, onSettingsChange }: { onLogout: () => void; onSettingsChange?: (settings: { [key: string]: string }) => void }) {
  const [activeModule, setActiveModule] = useState<string>('stats');
  const [eventApplicants, setEventApplicants] = useState<any[]>([]);
  // Load event registrations when tab is active
  const loadEventApplicants = async () => {
    try {
      const data = await api.getEventRegistrations();
      setEventApplicants(data);
    } catch (err) {
      console.error('Failed to load event applicants', err);
    }
  };
  const [stats, setStats] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [replyModal, setReplyModal] = useState<{ msg: any; mode: 'email' | 'whatsapp' } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState<string>('');
  const [whatsappSenderNumber, setWhatsappSenderNumber] = useState('03430381473');

  const [opps, setOpps] = useState<any[]>([]);
  const [oppApps, setOppApps] = useState<any[]>([]);

  // Settings edit
  const [officeAdd, setOfficeAdd] = useState('');
  const [compMail, setCompMail] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compWhatsapp, setCompWhatsapp] = useState('');
  const [compHours, setCompHours] = useState('');
  const [smFacebook, setSmFacebook] = useState('');
  const [smLinkedin, setSmLinkedin] = useState('');
  const [smTwitter, setSmTwitter] = useState('');
  const [smInstagram, setSmInstagram] = useState('');
  const [smGithub, setSmGithub] = useState('');
  const [smYoutube, setSmYoutube] = useState('');
  const [smTiktok, setSmTiktok] = useState('');
  const [customCompanySocials, setCustomCompanySocials] = useState<Array<{ platform: string; url: string }>>([]);

  // SMTP Server & Outgoing Mail Settings
  const [smtpHst, setSmtpHst] = useState('smtp.gmail.com');
  const [smtpPrt, setSmtpPrt] = useState('465');
  const [smtpUsr, setSmtpUsr] = useState('');
  const [smtpPwd, setSmtpPwd] = useState('');
  const [smtpFromName, setSmtpFromName] = useState('SaroHub Talent Acquisition');
  const [smtpFromEmail, setSmtpFromEmail] = useState('');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestEmail, setSmtpTestEmail] = useState('');
  const [smtpTestFeedback, setSmtpTestFeedback] = useState<{ success: boolean; message: string; hint?: string } | null>(null);

  // Admin profile & credentials states
  const [profileUsername, setProfileUsername] = useState('');
  const [profileFullName, setProfileFullName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form toggles
  const [services, setServices] = useState<any[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const initialServicePayload = {
    title: '',
    slug: '',
    category: 'Custom Software Development',
    banner_url: '',
    hero_headline: '',
    short_description: '',
    description: '',
    problems_solved: '',
    capabilities: [
      { title: 'Custom Architecture & Microservices', description: 'Scalable, event-driven backend systems and databases engineered for high throughput.' },
      { title: 'Modern Responsive Frontend Portals', description: 'Sub-second rendering, mobile-first interfaces, and intuitive administrative dashboards.' },
      { title: 'API Middleware & Webhook Integrations', description: 'Unified connectors bridging CRM, ERP, payment processors, and messaging platforms.' }
    ],
    target_audience: '',
    business_benefits: [
      { metric: '99.99%', label: 'Infrastructure Availability', description: 'Fault-tolerant deployment ensures reliable continuous uptime.' },
      { metric: '3x', label: 'Velocity Multiplier', description: 'Accelerate feature deployment and customer onboarding cycles.' },
      { metric: '100%', label: 'Source Code Ownership', description: 'Full commercial IP transfer and complete technical documentation.' }
    ],
    process_steps: [
      { step: '01', title: 'Technical Discovery & Scoping', description: 'Map workflows, user personas, database schemas, and integration dependencies.' },
      { step: '02', title: 'System Architecture & UI/UX', description: 'Produce clickable wireframes, component design systems, and API contracts.' },
      { step: '03', title: 'Sprint Engineering & CI/CD', description: 'Build in rapid 2-week milestones with automated regression testing.' },
      { step: '04', title: 'Security Auditing & Hardening', description: 'Perform penetration scans, stress testing, and staging environment verification.' },
      { step: '05', title: 'Production Cutover & SLA Support', description: 'Zero-downtime deployment, DNS provisioning, and continuous maintenance.' }
    ],
    technologies: '',
    benefits: '',
    faqs: [
      { question: '', answer: '' }
    ]
  };
  const [servicePayload, setServicePayload] = useState(initialServicePayload);
  const [serviceFormTab, setServiceFormTab] = useState<'overview' | 'problems' | 'capabilities' | 'audience' | 'metrics' | 'tech_faqs'>('overview');

  // CEO Message Settings
  const [ceoName, setCeoName] = useState('');
  const [ceoTitle, setCeoTitle] = useState('');
  const [ceoPhoto, setCeoPhoto] = useState('');
  const [ceoMessage, setCeoMessage] = useState('');
  const [founderYear, setFounderYear] = useState('2022');
  const [registeredYear, setRegisteredYear] = useState('2026');
  const [ceoVenturesSaas, setCeoVenturesSaas] = useState('5+ Built');
  const [ceoEngineeringTeam, setCeoEngineeringTeam] = useState('20+ Minds');
  const [ceoStrategicFocus, setCeoStrategicFocus] = useState('GB & Global');

  // Hero Section Dynamic Settings
  const [heroBadge, setHeroBadge] = useState('');
  const [heroHeading, setHeroHeading] = useState('');
  const [heroHeadingAccent, setHeroHeadingAccent] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroTypedPhrases, setHeroTypedPhrases] = useState('');
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState('');
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState('');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('');
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState('');
  const [heroPillar1Title, setHeroPillar1Title] = useState('');
  const [heroPillar1Sub, setHeroPillar1Sub] = useState('');
  const [heroPillar2Title, setHeroPillar2Title] = useState('');
  const [heroPillar2Sub, setHeroPillar2Sub] = useState('');
  const [heroPillar3Title, setHeroPillar3Title] = useState('');
  const [heroPillar3Sub, setHeroPillar3Sub] = useState('');

  // What We Do Dynamic Settings
  const [whatWeDoBadge, setWhatWeDoBadge] = useState('');
  const [whatWeDoHeading, setWhatWeDoHeading] = useState('');
  const [whatWeDoSubtext, setWhatWeDoSubtext] = useState('');
  const [whatWeDoP1Title, setWhatWeDoP1Title] = useState('');
  const [whatWeDoP1Badge, setWhatWeDoP1Badge] = useState('');
  const [whatWeDoP1Desc, setWhatWeDoP1Desc] = useState('');
  const [whatWeDoP1CtaText, setWhatWeDoP1CtaText] = useState('');
  const [whatWeDoP1CtaLink, setWhatWeDoP1CtaLink] = useState('');
  const [whatWeDoP1Highlights, setWhatWeDoP1Highlights] = useState('');
  const [whatWeDoP2Title, setWhatWeDoP2Title] = useState('');
  const [whatWeDoP2Badge, setWhatWeDoP2Badge] = useState('');
  const [whatWeDoP2Desc, setWhatWeDoP2Desc] = useState('');
  const [whatWeDoP2CtaText, setWhatWeDoP2CtaText] = useState('');
  const [whatWeDoP2CtaLink, setWhatWeDoP2CtaLink] = useState('');
  const [whatWeDoP2Highlights, setWhatWeDoP2Highlights] = useState('');
  const [whatWeDoP3Title, setWhatWeDoP3Title] = useState('');
  const [whatWeDoP3Badge, setWhatWeDoP3Badge] = useState('');
  const [whatWeDoP3Desc, setWhatWeDoP3Desc] = useState('');
  const [whatWeDoP3CtaText, setWhatWeDoP3CtaText] = useState('');
  const [whatWeDoP3CtaLink, setWhatWeDoP3CtaLink] = useState('');
  const [whatWeDoP3Highlights, setWhatWeDoP3Highlights] = useState('');

  // Call To Action (CTA) Banner Dynamic Settings
  const [ctaHeading, setCtaHeading] = useState('');
  const [ctaSubtext, setCtaSubtext] = useState('');
  const [ctaPrimaryBtn, setCtaPrimaryBtn] = useState('');
  const [ctaPrimaryLink, setCtaPrimaryLink] = useState('');
  const [ctaSecondaryBtn, setCtaSecondaryBtn] = useState('');
  const [ctaSecondaryLink, setCtaSecondaryLink] = useState('');
  const [ctaTertiaryBtn, setCtaTertiaryBtn] = useState('');
  const [ctaTertiaryLink, setCtaTertiaryLink] = useState('');

  // Company Overview / Mission / Vision Settings
  const [overviewTitle, setOverviewTitle] = useState('');
  const [overviewDescription, setOverviewDescription] = useState('');
  const [overviewTagline, setOverviewTagline] = useState('');
  const [missionText, setMissionText] = useState('');
  const [visionText, setVisionText] = useState('');

  // Why Choose Us Settings
  const [whyHeading, setWhyHeading] = useState('');
  const [whySubtitle, setWhySubtitle] = useState('');

  // Blogs CMS
  const [blogs, setBlogs] = useState<any[]>([]);
  const [adminBlogCategories, setAdminBlogCategories] = useState<any[]>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [blogPayload, setBlogPayload] = useState({
    title: '',
    category_id: '1',
    custom_category_name: '',
    author_name: 'Mehdi Hassan',
    author_avatar: '',
    reading_time: '5 min read',
    featured_image_url: '',
    content: '',
    is_featured: false
  });

  // Testimonials CMS
  const [adminTestimonials, setAdminTestimonials] = useState<any[]>([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialPayload, setTestimonialPayload] = useState({ client_name: '', client_role: '', client_company: '', feedback: '', rating: '5', client_avatar: '' });

  // Projects CMS
  const [adminProjects, setAdminProjects] = useState<any[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectPayload, setProjectPayload] = useState({
    title: '',
    client_name: '',
    category: 'Web Applications',
    custom_category: '',
    industry: '',
    project_type: '',
    positioning_statement: '',
    technologies: '',
    short_description: '',
    description: '',
    what_we_solved: '',
    case_study: '',
    problem_challenge: '',
    solution: '',
    key_features: '',
    live_url: '',
    github_url: '',
    completion_date: '',
    status: 'Delivered',
    featured: true,
    order: '1',
    thumbnail_url: '',
    screenshots: ['', '', '', '', '']
  });

  // Team / About CMS
  const [adminTeam, setAdminTeam] = useState<any[]>([]);
  const [adminTeamSections, setAdminTeamSections] = useState<any[]>([]);
  const [showSectionManager, setShowSectionManager] = useState(false);
  const [selectedTeamSectionFilter, setSelectedTeamSectionFilter] = useState('all');
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionFormPayload, setSectionFormPayload] = useState({
    title: '',
    description: '',
    badge: ''
  });
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamPayload, setTeamPayload] = useState({
    name: '',
    position: '',
    photo_url: '',
    bio: '',
    skills: '',
    department: 'founders',
    section_title: '',
    section_description: '',
    is_new_section: false,
    new_section_title: '',
    new_section_description: '',
    new_section_badge: '',
    social_linkedin: '',
    social_github: '',
    social_twitter: '',
    portfolio_url: '',
    social_links: [] as Array<{ platform: string; url: string }>,
    experience_years: '5 Years',
    is_founder: false,
    sort_order: '10'
  });

  // Products CMS
  const [adminProducts, setAdminProducts] = useState<any[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productPayload, setProductPayload] = useState({
    title: '',
    short_description: '',
    description: '',
    features: '',
    demo_url: '',
    video_url: '',
    download_url: '',
    thumbnail_url: ''
  });

  // Projects for Sale CMS
  const [adminSaleProjects, setAdminSaleProjects] = useState<any[]>([]);
  const [showSaleProjectForm, setShowSaleProjectForm] = useState(false);
  const [saleProjectPayload, setSaleProjectPayload] = useState({
    title: '',
    price: '',
    technology: '',
    short_description: '',
    features: '',
    demo_url: '',
    video_url: '',
    screenshots: [] as Array<{ url: string; description: string }>,
    thumbnail_url: ''
  });

  // Events CMS
  const [adminEvents, setAdminEvents] = useState<any[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventPayload, setEventPayload] = useState({
    title: '',
    banner_url: '',
    event_date: '',
    venue: '',
    description: '',
    registration_link: '',
    form_fields: [] as OpportunityField[]
  });
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [eventNewFieldType, setEventNewFieldType] = useState<OpportunityField['type']>('text');
  const [eventNewFieldLabel, setEventNewFieldLabel] = useState('');
  const [eventNewFieldPlaceholder, setEventNewFieldPlaceholder] = useState('');
  const [eventNewFieldOptions, setEventNewFieldOptions] = useState('');
  const [eventNewFieldRequired, setEventNewFieldRequired] = useState(false);

  // Careers CMS
  const [adminCareers, setAdminCareers] = useState<any[]>([]);
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [careerPayload, setCareerPayload] = useState({
    position: '',
    department: '',
    salary: '',
    experience: '',
    job_type: 'Full-Time',
    location: 'Hybrid / Onsite',
    skills: '',
    description: '',
    banner_url: '',
    is_active: true
  });

  // FAQs CMS
  const [adminFAQs, setAdminFAQs] = useState<any[]>([]);
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [faqPayload, setFaqPayload] = useState({
    category: 'General',
    question: '',
    answer: ''
  });

  // SEO Settings CMS
  const [adminSEO, setAdminSEO] = useState<any[]>([]);

  // Newsletter CMS
  const [adminNewsletter, setAdminNewsletter] = useState<any[]>([]);

  // Editing state for full CRUD
  const [editingItem, setEditingItem] = useState<{ id: number; type: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [adminAlert, setAdminAlert] = useState<{ title: string; message: string } | null>(null);

  // Document Preview & Mail Outbox Modal State
  const [showMailOutboxModal, setShowMailOutboxModal] = useState<boolean>(false);
  const [isShortlistingId, setIsShortlistingId] = useState<number | null>(null);
  const [docPreviewState, setDocPreviewState] = useState<{
    isOpen: boolean;
    url: string;
    filename: string;
    candidateName: string;
    position: string;
    status: string;
    id?: number;
  } | null>(null);

  // Chat Support Panel
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [agentAvailability, setAgentAvailability] = useState<'online' | 'away' | 'offline'>('online');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatReplyText, setChatReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);

  // Message Log Search & Filter State
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'contact' | 'assistant'>('all');

  // IT Academy Student Projects CMS State
  const [adminStudentProjects, setAdminStudentProjects] = useState<any[]>([]);
  const [showStudentProjectForm, setShowStudentProjectForm] = useState(false);
  const [studentProjectPayload, setStudentProjectPayload] = useState({
    title: '',
    student_name: '',
    batch_course: '',
    category: 'Full-Stack Software',
    thumbnail_url: '',
    images: ['', '', '', '', ''],
    short_description: '',
    description: '',
    technologies: '',
    live_url: '',
    github_url: ''
  });

  const loadAllAdminData = () => {
    api.getStats().then(setStats).catch(console.error);
    api.getContactMessages().then(setMessages).catch(console.error);
    api.getApplications().then(setApps).catch(console.error);
    api.getLogs().then(setLogs).catch(console.error);
    api.getServices().then(setServices).catch(console.error);
    api.getBlogs().then(setBlogs).catch(console.error);
    api.getBlogCategories().then(setAdminBlogCategories).catch(console.error);
    api.getTestimonials().then(setAdminTestimonials).catch(console.error);
    api.getProjects().then(setAdminProjects).catch(console.error);
    api.getStudentProjects().then(setAdminStudentProjects).catch(console.error);
    api.getTeam().then(setAdminTeam).catch(console.error);
    api.getTeamSections().then(setAdminTeamSections).catch(console.error);
    api.getProducts().then(setAdminProducts).catch(console.error);
    api.getSaleProjects().then(setAdminSaleProjects).catch(console.error);
    api.getEvents().then(setAdminEvents).catch(console.error);
    api.getEventRegistrations().then(setEventApplicants).catch(console.error);
    api.getCareers().then(setAdminCareers).catch(console.error);
    api.getOpportunities().then(setOpps).catch(console.error);
    api.getOpportunityApplications().then(setOppApps).catch(console.error);
    api.getFAQs().then(setAdminFAQs).catch(console.error);
    api.getNewsletterSubscribers().then(setAdminNewsletter).catch(console.error);
    api.getSEO().then(setAdminSEO).catch(console.error);
    api.getChats().then(data => {
      setChatSessions(data.sessions || []);
      setAgentAvailability(data.availability || 'online');
    }).catch(console.error);
    api.getSettings().then(s => {
      setOfficeAdd(s.office_address || '');
      setCompMail(s.email || '');
      setCompPhone(s.phone || '');
      setCompWhatsapp(s.whatsapp || '');
      setCompHours(s.business_hours || '');
      setSmFacebook(s.facebook || '');
      setSmLinkedin(s.linkedin || '');
      setSmTwitter(s.twitter || '');
      setSmInstagram(s.instagram || '');
      setSmGithub(s.github || '');
      setSmYoutube(s.youtube || '');
      setSmTiktok(s.tiktok || '');
      setCeoName(s.ceo_name || '');
      setCeoTitle(s.ceo_title || '');
      setCeoPhoto(s.ceo_photo || '');
      setCeoMessage(s.ceo_message || '');
      setFounderYear(s.founder_year || '2022');
      setRegisteredYear(s.registered_year || '2026');
      setCeoVenturesSaas(s.ceo_ventures_saas || '5+ Built');
      setCeoEngineeringTeam(s.ceo_engineering_team || '20+ Minds');
      setCeoStrategicFocus(s.ceo_strategic_focus || 'GB & Global');
      // Hero Section
      setHeroBadge(s.hero_badge || '');
      setHeroHeading(s.hero_heading || '');
      setHeroHeadingAccent(s.hero_heading_accent || '');
      setHeroDescription(s.hero_description || '');
      setHeroTypedPhrases(s.hero_typed_phrases || '');
      setHeroPrimaryCtaText(s.hero_primary_cta_text || '');
      setHeroPrimaryCtaLink(s.hero_primary_cta_link || '');
      setHeroSecondaryCtaText(s.hero_secondary_cta_text || '');
      setHeroSecondaryCtaLink(s.hero_secondary_cta_link || '');
      setHeroPillar1Title(s.hero_pillar1_title || '');
      setHeroPillar1Sub(s.hero_pillar1_sub || '');
      setHeroPillar2Title(s.hero_pillar2_title || '');
      setHeroPillar2Sub(s.hero_pillar2_sub || '');
      setHeroPillar3Title(s.hero_pillar3_title || '');
      setHeroPillar3Sub(s.hero_pillar3_sub || '');
      // What We Do Section
      setWhatWeDoBadge(s.what_we_do_badge || '');
      setWhatWeDoHeading(s.what_we_do_heading || '');
      setWhatWeDoSubtext(s.what_we_do_subtext || '');
      setWhatWeDoP1Title(s.what_we_do_p1_title || '');
      setWhatWeDoP1Badge(s.what_we_do_p1_badge || '');
      setWhatWeDoP1Desc(s.what_we_do_p1_desc || '');
      setWhatWeDoP1CtaText(s.what_we_do_p1_cta_text || '');
      setWhatWeDoP1CtaLink(s.what_we_do_p1_cta_link || '');
      setWhatWeDoP1Highlights(s.what_we_do_p1_highlights || '');
      setWhatWeDoP2Title(s.what_we_do_p2_title || '');
      setWhatWeDoP2Badge(s.what_we_do_p2_badge || '');
      setWhatWeDoP2Desc(s.what_we_do_p2_desc || '');
      setWhatWeDoP2CtaText(s.what_we_do_p2_cta_text || '');
      setWhatWeDoP2CtaLink(s.what_we_do_p2_cta_link || '');
      setWhatWeDoP2Highlights(s.what_we_do_p2_highlights || '');
      setWhatWeDoP3Title(s.what_we_do_p3_title || '');
      setWhatWeDoP3Badge(s.what_we_do_p3_badge || '');
      setWhatWeDoP3Desc(s.what_we_do_p3_desc || '');
      setWhatWeDoP3CtaText(s.what_we_do_p3_cta_text || '');
      setWhatWeDoP3CtaLink(s.what_we_do_p3_cta_link || '');
      setWhatWeDoP3Highlights(s.what_we_do_p3_highlights || '');
      // Call To Action (CTA) Section
      setCtaHeading(s.cta_heading || '');
      setCtaSubtext(s.cta_subtext || '');
      setCtaPrimaryBtn(s.cta_primary_btn || '');
      setCtaPrimaryLink(s.cta_primary_link || '');
      setCtaSecondaryBtn(s.cta_secondary_btn || '');
      setCtaSecondaryLink(s.cta_secondary_link || '');
      setCtaTertiaryBtn(s.cta_tertiary_btn || '');
      setCtaTertiaryLink(s.cta_tertiary_link || '');
      // Overview / Mission / Vision
      setOverviewTitle(s.overview_title || '');
      setOverviewDescription(s.overview_description || '');
      setOverviewTagline(s.overview_tagline || '');
      setMissionText(s.mission_text || '');
      setVisionText(s.vision_text || '');
      // Why Choose Us
      setWhyHeading(s.why_heading || '');
      setWhySubtitle(s.why_subtitle || '');
      // Outgoing Mail & SMTP Delivery Engine
      if (s.smtp_host) setSmtpHst(s.smtp_host);
      if (s.smtp_port) setSmtpPrt(String(s.smtp_port));
      if (s.smtp_user) setSmtpUsr(s.smtp_user);
      if (s.smtp_pass) setSmtpPwd(s.smtp_pass);
      if (s.smtp_from_name) setSmtpFromName(s.smtp_from_name);
      if (s.smtp_from_email) setSmtpFromEmail(s.smtp_from_email);
      if (s.custom_socials) {
        try {
          setCustomCompanySocials(JSON.parse(s.custom_socials));
        } catch (e) {
          setCustomCompanySocials([]);
        }
      } else {
        setCustomCompanySocials([]);
      }
    }).catch(console.error);
    api.getProfile().then(p => {
      setProfileUsername(p.username || '');
      setProfileFullName(p.full_name || '');
      setProfileEmail(p.email || '');
      setProfileBio(p.bio || '');
    }).catch(console.error);
    // Notify public views that admin data was refreshed so they can re-fetch if needed
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('sarohub-data-updated'));
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Poll chat sessions while either admin chat-related view is active.
  useEffect(() => {
    if (activeModule !== 'chats' && activeModule !== 'messages') return;

    const pollInterval = setInterval(() => {
      api.getChats().then(data => {
        setChatSessions(data.sessions || []);
        setAgentAvailability(data.availability || 'online');
      }).catch(console.error);
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [activeModule]);

  const handleUpdateAgentStatus = async (status: 'online' | 'away' | 'offline') => {
    try {
      const res = await api.updateAgentStatus(status);
      setAgentAvailability(res.availability);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCloseSession = async (id: string) => {
    if (!confirm('Are you sure you want to archive and close this support ticket?')) return;
    try {
      await api.closeChatSession(id);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteChatSession = async (id: string) => {
    setDeleteConfirm({
      message: 'Are you sure you want to permanently delete this entire chat conversation thread?',
      onConfirm: async () => {
        // Optimistic UI update
        setChatSessions(prev => prev.filter(s => String(s.id) !== String(id)));
        if (selectedChatId === id) {
          setSelectedChatId(null);
        }
        try {
          await api.deleteChatSession(id);
          loadAllAdminData();
          setAdminAlert({ title: 'Chat Conversation Deleted', message: 'The conversation thread has been removed successfully.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Chat', message: err.message || 'Failed to delete chat session.' });
          loadAllAdminData();
        }
      }
    });
  };

  const handleDeleteChatMessage = async (sessionId: string, messageId: string) => {
    setDeleteConfirm({
      message: 'Are you sure you want to permanently delete this single message?',
      onConfirm: async () => {
        // Optimistic UI update
        setChatSessions(prev => prev.map(s => {
          if (String(s.id) === String(sessionId)) {
            return {
              ...s,
              messages: (s.messages || []).filter(m => String(m.id) !== String(messageId))
            };
          }
          return s;
        }));
        try {
          await api.deleteChatMessage(sessionId, messageId);
          loadAllAdminData();
          setAdminAlert({ title: 'Message Deleted', message: 'The chat message has been deleted.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Message', message: err.message || 'Failed to delete message.' });
          loadAllAdminData();
        }
      }
    });
  };

  const handleDeleteContactMessage = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to permanently delete this message record?',
      onConfirm: async () => {
        // Optimistic UI update
        setMessages(prev => prev.filter(m => Number(m.id) !== Number(id)));
        try {
          await api.deleteContactMessage(id);
          loadAllAdminData();
          setAdminAlert({ title: 'Message Deleted', message: 'Inquiry message has been removed successfully.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Message', message: err.message || 'Failed to delete message.' });
          loadAllAdminData();
        }
      }
    });
  };

  const handleMarkMsgRead = async (id: number) => {
    // Optimistic UI update
    setMessages(prev => prev.map(m => (Number(m.id) === Number(id) ? { ...m, is_read: 1 } : m)));
    try {
      await api.markMessageAsRead(id);
      loadAllAdminData();
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      loadAllAdminData();
    }
  };

  const handleMarkAllMsgsRead = async () => {
    const unreadMessages = messages.filter(m => !m.is_read);
    if (unreadMessages.length === 0) return;
    
    // Optimistic UI update
    setMessages(prev => prev.map(m => ({ ...m, is_read: 1 })));
    try {
      await Promise.all(unreadMessages.map(m => api.markMessageAsRead(m.id)));
      loadAllAdminData();
      setAdminAlert({ title: 'Messages Updated', message: 'All unread messages marked as read.' });
    } catch (err: any) {
      console.error(err);
      loadAllAdminData();
    }
  };

  const handleClearAllChats = () => {
    setDeleteConfirm({
      message: 'Are you sure you want to permanently delete and wipe ALL live chat conversations?',
      onConfirm: async () => {
        try {
          await api.clearAllChats();
          setSelectedChatId(null);
          loadAllAdminData();
          setAdminAlert({ title: 'All Chats Cleared', message: 'All active and archived chat sessions have been wiped.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Error Clearing Chats', message: err.message || 'Failed to clear all chats.' });
        }
      }
    });
  };

  const handleSendAgentMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || !chatReplyText.trim() || isSendingReply) return;

    const textToSend = chatReplyText;
    setChatReplyText('');
    setIsSendingReply(true);

    try {
      await api.sendChatMessage(selectedChatId, {
        sender: 'agent',
        text: textToSend
      });
      // Refresh chats instantly
      const updated = await api.getChats();
      setChatSessions(updated.sessions || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleSuggestReply = async () => {
    if (!selectedChatId || isGeneratingSuggestion) return;
    setIsGeneratingSuggestion(true);
    try {
      const res = await api.suggestChatReply(selectedChatId);
      setChatReplyText(res.suggestion || '');
    } catch (err: any) {
      alert('Failed to fetch AI suggestions: ' + err.message);
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveSettings({
        office_address: officeAdd,
        email: compMail,
        phone: compPhone,
        whatsapp: compWhatsapp,
        business_hours: compHours,
        facebook: smFacebook,
        linkedin: smLinkedin,
        twitter: smTwitter,
        instagram: smInstagram,
        github: smGithub,
        youtube: smYoutube,
        tiktok: smTiktok,
        ceo_name: ceoName,
        ceo_title: ceoTitle,
        ceo_photo: ceoPhoto,
        ceo_message: ceoMessage,
        founder_year: founderYear,
        registered_year: registeredYear,
        ceo_ventures_saas: ceoVenturesSaas,
        ceo_engineering_team: ceoEngineeringTeam,
        ceo_strategic_focus: ceoStrategicFocus,
        // Hero Section
        hero_badge: heroBadge,
        hero_heading: heroHeading,
        hero_heading_accent: heroHeadingAccent,
        hero_description: heroDescription,
        hero_typed_phrases: heroTypedPhrases,
        hero_primary_cta_text: heroPrimaryCtaText,
        hero_primary_cta_link: heroPrimaryCtaLink,
        hero_secondary_cta_text: heroSecondaryCtaText,
        hero_secondary_cta_link: heroSecondaryCtaLink,
        hero_pillar1_title: heroPillar1Title,
        hero_pillar1_sub: heroPillar1Sub,
        hero_pillar2_title: heroPillar2Title,
        hero_pillar2_sub: heroPillar2Sub,
        hero_pillar3_title: heroPillar3Title,
        hero_pillar3_sub: heroPillar3Sub,
        // What We Do Section
        what_we_do_badge: whatWeDoBadge,
        what_we_do_heading: whatWeDoHeading,
        what_we_do_subtext: whatWeDoSubtext,
        what_we_do_p1_title: whatWeDoP1Title,
        what_we_do_p1_badge: whatWeDoP1Badge,
        what_we_do_p1_desc: whatWeDoP1Desc,
        what_we_do_p1_cta_text: whatWeDoP1CtaText,
        what_we_do_p1_cta_link: whatWeDoP1CtaLink,
        what_we_do_p1_highlights: whatWeDoP1Highlights,
        what_we_do_p2_title: whatWeDoP2Title,
        what_we_do_p2_badge: whatWeDoP2Badge,
        what_we_do_p2_desc: whatWeDoP2Desc,
        what_we_do_p2_cta_text: whatWeDoP2CtaText,
        what_we_do_p2_cta_link: whatWeDoP2CtaLink,
        what_we_do_p2_highlights: whatWeDoP2Highlights,
        what_we_do_p3_title: whatWeDoP3Title,
        what_we_do_p3_badge: whatWeDoP3Badge,
        what_we_do_p3_desc: whatWeDoP3Desc,
        what_we_do_p3_cta_text: whatWeDoP3CtaText,
        what_we_do_p3_cta_link: whatWeDoP3CtaLink,
        what_we_do_p3_highlights: whatWeDoP3Highlights,
        // Call To Action (CTA) Section
        cta_heading: ctaHeading,
        cta_subtext: ctaSubtext,
        cta_primary_btn: ctaPrimaryBtn,
        cta_primary_link: ctaPrimaryLink,
        cta_secondary_btn: ctaSecondaryBtn,
        cta_secondary_link: ctaSecondaryLink,
        cta_tertiary_btn: ctaTertiaryBtn,
        cta_tertiary_link: ctaTertiaryLink,
        // Overview / Mission / Vision
        overview_title: overviewTitle,
        overview_description: overviewDescription,
        overview_tagline: overviewTagline,
        mission_text: missionText,
        vision_text: visionText,
        // Why Choose Us
        why_heading: whyHeading,
        why_subtitle: whySubtitle,
        // SMTP Outgoing Mail Settings
        smtp_host: smtpHst.trim(),
        smtp_port: parseInt(smtpPrt) || 465,
        smtp_user: smtpUsr.trim(),
        smtp_pass: smtpPwd.trim(),
        smtp_from_name: smtpFromName.trim(),
        smtp_from_email: smtpFromEmail.trim() || smtpUsr.trim(),
        custom_socials: JSON.stringify(customCompanySocials.filter(c => c.url && c.url.trim()))
      });
      // Refresh global settings used by public pages (Footer social links etc.)
      api.getSettings().then((s) => {
        if (onSettingsChange) onSettingsChange(s);
      }).catch(console.error);
      setAdminAlert({ title: 'Settings Saved', message: 'Corporate settings, CEO message, and social media channels have been synchronized successfully.' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Settings', message: err.message });
    }
  };

  const handleTestSmtpConnection = async () => {
    if (!smtpTestEmail.trim()) {
      setAdminAlert({ title: 'Recipient Email Required', message: 'Please enter an email address to send the diagnostic test message to.' });
      return;
    }
    setIsTestingSmtp(true);
    setSmtpTestFeedback(null);
    try {
      const token = getAuthToken() || localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
      const res = await fetch('/api/admin/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          test_email: smtpTestEmail.trim(),
          host: smtpHst.trim(),
          port: smtpPrt.trim(),
          user: smtpUsr.trim(),
          pass: smtpPwd.trim(),
          from_name: smtpFromName.trim(),
          from_email: smtpFromEmail.trim() || smtpUsr.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpTestFeedback({ success: true, message: data.message || `Diagnostic email successfully delivered to ${smtpTestEmail}!` });
        setAdminAlert({ title: 'SMTP Test Successful', message: data.message || `Diagnostic test email delivered to ${smtpTestEmail}!` });
      } else {
        const errorMsg = data.error || 'SMTP connection failed. Check credentials or Google App Password.';
        setSmtpTestFeedback({ success: false, message: errorMsg, hint: data.hint });
        setAdminAlert({
          title: 'SMTP Authentication Notice',
          message: data.hint ? `${errorMsg}\n\n💡 Solution:\n${data.hint}` : errorMsg
        });
      }
    } catch (err: any) {
      setSmtpTestFeedback({ success: false, message: err.message || 'Network error during SMTP test.' });
      setAdminAlert({ title: 'Connection Error', message: err.message });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleResetToSandboxMode = async () => {
    try {
      const token = getAuthToken() || localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
      const res = await fetch('/api/admin/reset-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setSmtpPwd('');
        setSmtpUsr('');
        setSmtpTestFeedback({
          success: true,
          message: 'Switched to Outbox Sandbox Mode. System emails will be stored safely in the Mail Outbox with full HTML fidelity.'
        });
        setAdminAlert({
          title: 'Sandbox Mode Enabled',
          message: 'Mail delivery switched to Outbox Sandbox Mode. RSVPs, candidate notifications, and inquiries are recorded safely in your Mail Outbox without requiring live external SMTP credentials.'
        });
        loadAllAdminData();
      }
    } catch (err: any) {
      setAdminAlert({ title: 'Reset Failed', message: err.message });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        username: profileUsername,
        full_name: profileFullName,
        email: profileEmail,
        bio: profileBio
      } as any);
      alert('Administrator profile settings updated successfully!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and password confirmation do not match.');
      return;
    }
    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      alert('Administrator password credential successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditService = (s: any) => {
    const bp = getServiceBySlug(s.slug || '');

    const problems = (Array.isArray(s.problems_solved) && s.problems_solved.length > 0)
      ? s.problems_solved
      : ((Array.isArray(s.problemsSolved) && s.problemsSolved.length > 0)
        ? s.problemsSolved
        : (bp?.problemsSolved || []));

    const capabilities = (Array.isArray(s.capabilities) && s.capabilities.length > 0)
      ? s.capabilities
      : (bp?.capabilities && bp.capabilities.length > 0
        ? bp.capabilities
        : [{ title: 'Custom Architecture & Microservices', description: 'Scalable, event-driven backend systems and databases engineered for high throughput.' }]);

    const targetAudience = (Array.isArray(s.target_audience) && s.target_audience.length > 0)
      ? s.target_audience
      : ((Array.isArray(s.targetAudience) && s.targetAudience.length > 0)
        ? s.targetAudience
        : (bp?.targetAudience || []));

    const businessBenefits = (Array.isArray(s.business_benefits) && s.business_benefits.length > 0)
      ? s.business_benefits
      : ((Array.isArray(s.businessBenefits) && s.businessBenefits.length > 0)
        ? s.businessBenefits
        : (bp?.businessBenefits && bp.businessBenefits.length > 0
          ? bp.businessBenefits
          : [{ metric: '99.99%', label: 'Infrastructure Availability', description: 'Fault-tolerant deployment ensures reliable continuous uptime.' }]));

    const processSteps = (Array.isArray(s.process_steps) && s.process_steps.length > 0)
      ? s.process_steps
      : ((Array.isArray(s.processSteps) && s.processSteps.length > 0)
        ? s.processSteps
        : (bp?.processSteps || []));

    const faqs = (Array.isArray(s.faqs) && s.faqs.length > 0)
      ? s.faqs
      : (bp?.faqs && bp.faqs.length > 0 ? bp.faqs : [{ question: '', answer: '' }]);

    setServicePayload({
      title: s.title || '',
      slug: s.slug || '',
      category: s.category || bp?.category || 'Custom Software Development',
      banner_url: s.banner_url || bp?.bannerImage || '',
      hero_headline: s.hero_headline || s.heroHeadline || bp?.heroHeadline || '',
      short_description: s.short_description || bp?.heroSubheadline || '',
      description: s.description || bp?.overview || '',
      problems_solved: Array.isArray(problems) ? problems.join('\n') : (typeof problems === 'string' ? problems : ''),
      capabilities: capabilities.map((c: any) => ({ title: c.title || '', description: c.description || '' })),
      target_audience: Array.isArray(targetAudience) ? targetAudience.join('\n') : (typeof targetAudience === 'string' ? targetAudience : ''),
      business_benefits: businessBenefits.map((b: any) => ({ metric: b.metric || '', label: b.label || '', description: b.description || '' })),
      process_steps: processSteps,
      technologies: Array.isArray(s.technologies) ? s.technologies.join(', ') : (s.technologies || (bp?.technologies ? bp.technologies.join(', ') : '')),
      benefits: Array.isArray(s.benefits) ? s.benefits.join(', ') : (s.benefits || ''),
      faqs: faqs.map((f: any) => ({ question: f.question || '', answer: f.answer || '' }))
    });
    setServiceFormTab('overview');
    setEditingItem({ id: s.id, type: 'service' });
    setShowServiceForm(true);
  };

  const handleEditBlog = (b: any) => {
    setBlogPayload({
      title: b.title || '',
      category_id: String(b.category_id || 1),
      author_name: b.author_name || 'Mehdi Hassan',
      author_avatar: b.author_avatar || '',
      reading_time: b.reading_time || '5 min read',
      featured_image_url: b.featured_image_url || '',
      content: b.content || '',
      is_featured: !!b.is_featured
    });
    setEditingItem({ id: b.id, type: 'blog' });
    setShowBlogForm(true);
  };

  const handleEditProject = (p: any) => {
    const existingScreenshots = Array.isArray(p.screenshots) ? p.screenshots : (Array.isArray(p.gallery) ? p.gallery : []);
    const standardCats = ['Web Applications', 'Mobile Applications', 'SaaS & Cloud Platforms', 'AI & Intelligent Systems', 'UI/UX & Product Design', 'E-Commerce / Commerce', 'Business Software'];
    const isCustomCat = !standardCats.includes(p.category || 'Web Applications');
    
    // Format challenges
    let formattedChallenges = '';
    if (Array.isArray(p.challenges) && p.challenges.length > 0) {
      formattedChallenges = p.challenges.map((c: any) => typeof c === 'string' ? c : `${c.title ? c.title + ': ' : ''}${c.description || ''}`).join('\n');
    } else if (p.problem_challenge) {
      formattedChallenges = p.problem_challenge;
    }

    // Format solutions
    let formattedSolutions = '';
    if (Array.isArray(p.solutions) && p.solutions.length > 0) {
      formattedSolutions = p.solutions.map((s: any) => typeof s === 'string' ? s : `${s.title ? s.title + ': ' : ''}${s.description || ''}`).join('\n');
    } else if (p.solution) {
      formattedSolutions = p.solution;
    }

    // Format features
    let formattedFeatures = '';
    if (Array.isArray(p.features) && p.features.length > 0) {
      formattedFeatures = p.features.join('\n');
    } else if (Array.isArray(p.key_features) && p.key_features.length > 0) {
      formattedFeatures = p.key_features.join('\n');
    } else if (typeof p.key_features === 'string') {
      formattedFeatures = p.key_features;
    }

    // Format tech
    let techString = '';
    if (Array.isArray(p.technologies)) {
      techString = p.technologies.join(', ');
    } else if (p.technologies?.tags && Array.isArray(p.technologies.tags)) {
      techString = p.technologies.tags.join(', ');
    } else if (typeof p.technologies === 'string') {
      techString = p.technologies;
    }

    setProjectPayload({
      title: p.title || '',
      client_name: p.client_name || '',
      category: isCustomCat ? 'Custom' : (p.category || 'Web Applications'),
      custom_category: isCustomCat ? (p.category || '') : '',
      industry: p.industry || '',
      project_type: p.project_type || '',
      positioning_statement: p.positioning_statement || '',
      technologies: techString,
      short_description: p.short_description || '',
      description: p.description || (p.overview ? p.overview.client_background : '') || '',
      what_we_solved: p.what_we_solved || p.case_study || '',
      case_study: p.case_study || p.what_we_solved || '',
      problem_challenge: formattedChallenges,
      solution: formattedSolutions,
      key_features: formattedFeatures,
      live_url: p.live_url || '',
      github_url: p.github_url || '',
      completion_date: p.completion_date || '',
      status: p.status || 'Delivered',
      featured: p.featured !== undefined ? !!p.featured : true,
      order: String(p.order !== undefined ? p.order : '1'),
      thumbnail_url: p.thumbnail_url || '',
      screenshots: [
        existingScreenshots[0] || '',
        existingScreenshots[1] || '',
        existingScreenshots[2] || '',
        existingScreenshots[3] || '',
        existingScreenshots[4] || ''
      ]
    });
    setEditingItem({ id: p.id, type: 'project' });
    setShowProjectForm(true);
  };

  const handleEditTeamMember = (t: any) => {
    const initialSocials: Array<{ platform: string; url: string }> = Array.isArray(t.social_links) && t.social_links.length > 0
      ? [...t.social_links]
      : [];

    if (initialSocials.length === 0) {
      if (t.social_linkedin) initialSocials.push({ platform: 'LinkedIn', url: t.social_linkedin });
      if (t.social_github) initialSocials.push({ platform: 'GitHub', url: t.social_github });
      if (t.social_twitter) initialSocials.push({ platform: 'Twitter / X', url: t.social_twitter });
      if (t.portfolio_url) initialSocials.push({ platform: 'Portfolio', url: t.portfolio_url });
    }

    setTeamPayload({
      name: t.name,
      position: t.position || '',
      photo_url: t.photo_url || '',
      bio: t.bio || '',
      skills: Array.isArray(t.skills) ? t.skills.join(', ') : (t.skills || ''),
      department: t.department || (t.is_founder ? 'founders' : 'development'),
      section_title: t.section_title || '',
      section_description: t.section_description || '',
      is_new_section: false,
      new_section_title: '',
      new_section_description: '',
      new_section_badge: '',
      social_linkedin: t.social_linkedin || '',
      social_github: t.social_github || '',
      social_twitter: t.social_twitter || '',
      portfolio_url: t.portfolio_url || '',
      social_links: initialSocials,
      experience_years: t.experience_years || '5 Years',
      is_founder: !!t.is_founder,
      sort_order: String(t.sort_order || '10')
    });
    setEditingItem({ id: t.id, type: 'team' });
    setShowTeamForm(true);
  };

  const handleEditProduct = (pr: any) => {
    setProductPayload({
      title: pr.title,
      short_description: pr.short_description || '',
      description: pr.description || '',
      features: Array.isArray(pr.features) ? pr.features.join(', ') : (pr.features || ''),
      demo_url: pr.demo_url || '',
      video_url: pr.video_url || '',
      download_url: pr.download_url || '',
      thumbnail_url: pr.thumbnail_url || ''
    });
    setEditingItem({ id: pr.id, type: 'product' });
    setShowProductForm(true);
  };

  const handleEditTestimonial = (t: any) => {
    setTestimonialPayload({
      client_name: t.client_name,
      client_role: t.client_role || '',
      client_company: t.client_company || '',
      feedback: t.feedback || '',
      rating: String(t.rating || '5'),
      client_avatar: t.client_avatar || ''
    });
    setEditingItem({ id: t.id, type: 'testimonial' });
    setShowTestimonialForm(true);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const problemsArray = servicePayload.problems_solved
        ? servicePayload.problems_solved.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const targetAudienceArray = servicePayload.target_audience
        ? servicePayload.target_audience.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const capabilitiesArray = (servicePayload.capabilities || [])
        .filter(c => c && c.title && c.title.trim())
        .map(c => ({ title: c.title.trim(), description: c.description.trim() }));

      const businessBenefitsArray = (servicePayload.business_benefits || [])
        .filter(b => b && b.metric && b.metric.trim())
        .map(b => ({ metric: b.metric.trim(), label: b.label.trim(), description: b.description.trim() }));

      const faqsArray = (servicePayload.faqs || [])
        .filter(f => f && f.question && f.question.trim())
        .map(f => ({ question: f.question.trim(), answer: f.answer.trim() }));

      const data = {
        title: servicePayload.title,
        slug: servicePayload.slug ? servicePayload.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-') : servicePayload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: servicePayload.category || 'Custom Software Development',
        banner_url: servicePayload.banner_url,
        hero_headline: servicePayload.hero_headline,
        short_description: servicePayload.short_description,
        description: servicePayload.description,
        problems_solved: problemsArray,
        capabilities: capabilitiesArray,
        target_audience: targetAudienceArray,
        business_benefits: businessBenefitsArray,
        process_steps: servicePayload.process_steps || [],
        benefits: servicePayload.benefits.split(',').map(s => s.trim()).filter(Boolean),
        technologies: servicePayload.technologies.split(',').map(s => s.trim()).filter(Boolean),
        faqs: faqsArray
      };

      if (editingItem && editingItem.type === 'service') {
        await api.updateService(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createService(data);
      }
      setShowServiceForm(false);
      setServicePayload(initialServicePayload);
      window.dispatchEvent(new Event('sarohub-data-updated'));
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Service', message: err.message });
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalCategoryId = parseInt(blogPayload.category_id);
      // Check if custom category was selected or typed
      if (blogPayload.category_id === '__custom__' || (!finalCategoryId && blogPayload.custom_category_name?.trim())) {
        if (blogPayload.custom_category_name?.trim()) {
          const newCat = await api.createBlogCategory(blogPayload.custom_category_name.trim());
          if (newCat && newCat.id) {
            finalCategoryId = newCat.id;
            const updatedCats = await api.getBlogCategories();
            setAdminBlogCategories(updatedCats || []);
          }
        }
      }

      const data = {
        title: blogPayload.title,
        category_id: finalCategoryId || 1,
        author_name: blogPayload.author_name,
        author_avatar: blogPayload.author_avatar,
        reading_time: blogPayload.reading_time,
        featured_image_url: blogPayload.featured_image_url,
        content: blogPayload.content,
        is_featured: blogPayload.is_featured,
        tags: [1, 2]
      };
      if (editingItem && editingItem.type === 'blog') {
        await api.updateBlog(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createBlog(data);
      }
      setShowBlogForm(false);
      setBlogPayload({
        title: '',
        category_id: '1',
        custom_category_name: '',
        author_name: 'Mehdi Hassan',
        author_avatar: '',
        reading_time: '5 min read',
        featured_image_url: '',
        content: '',
        is_featured: false
      });
      window.dispatchEvent(new Event('sarohub-data-updated'));
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Article', message: err.message });
    }
  };

  const handleCreateCategory = async (nameToAdd?: string) => {
    const name = (nameToAdd || newCatName).trim();
    if (!name) return;
    try {
      const created = await api.createBlogCategory(name, {
        description: newCatDesc.trim() || undefined
      });
      setNewCatName('');
      setNewCatDesc('');
      setShowCategoryModal(false);
      const updatedCats = await api.getBlogCategories();
      setAdminBlogCategories(updatedCats || []);
      if (created && created.id) {
        setBlogPayload(prev => ({
          ...prev,
          category_id: String(created.id),
          custom_category_name: ''
        }));
      }
      window.dispatchEvent(new Event('sarohub-data-updated'));
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Creating Category', message: err.message });
    }
  };

  const handleDeleteCategory = async (catId: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this article category? Articles under it might need reassignment.',
      onConfirm: async () => {
        try {
          await api.deleteBlogCategory(catId);
          const updatedCats = await api.getBlogCategories();
          setAdminBlogCategories(updatedCats || []);
          window.dispatchEvent(new Event('sarohub-data-updated'));
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Category', message: err.message });
        }
      }
    });
  };

  const handleDeleteService = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this service blueprint?',
      onConfirm: async () => {
        try {
          await api.deleteService(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Service', message: err.message });
        }
      }
    });
  };

  const handleDeleteBlog = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this blog post?',
      onConfirm: async () => {
        try {
          await api.deleteBlog(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Article', message: err.message });
        }
      }
    });
  };

  const handleReviewApp = async (id: number, status: 'reviewed' | 'shortlisted' | 'rejected') => {
    setIsShortlistingId(id);
    try {
      const response = await api.updateApplicationStatus(id, status);
      const app = apps.find(a => a.id === id);
      const candidateEmail = app?.email || 'the candidate';

      if (status === 'shortlisted') {
        const dispatch = response?.email_dispatch;
        const isLiveDelivered = dispatch?.status === 'delivered';
        const isSimulated = dispatch?.status === 'simulated';
        const dispatchError = dispatch?.error;

        let emailStatusText = `An official confirmation email was dispatched to ${candidateEmail}.`;
        if (isLiveDelivered) {
          emailStatusText = `A live notification email was successfully transmitted directly to ${candidateEmail}!`;
        } else if (isSimulated) {
          emailStatusText = `An official email to ${candidateEmail} was recorded in the Outbox (Simulated Mode). To send live emails to real inboxes, please enter your Gmail/SMTP credentials under Admin Settings > Outgoing Mail Server.`;
        } else if (dispatchError) {
          emailStatusText = `Candidate shortlisted, but SMTP delivery to ${candidateEmail} encountered an error: "${dispatchError}". Check your credentials in Settings > Outgoing Mail Server.`;
        }

        setAdminAlert({
          title: 'Candidate Shortlisted Successfully',
          message: `Candidate ${app?.full_name || ''} has been marked as Shortlisted! ${emailStatusText} You can view full delivery traces anytime in the Mail Outbox.`
        });
      } else if (status === 'rejected') {
        setAdminAlert({
          title: 'Application Status Updated',
          message: `Application for ${app?.full_name || 'candidate'} has been updated to Declined.`
        });
      } else {
        setAdminAlert({
          title: 'Application Status Updated',
          message: response?.message || `Application status updated to ${status}.`
        });
      }
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Reviewing Application', message: err.message });
    } finally {
      setIsShortlistingId(null);
    }
  };

  const handleToggleProjectFeatured = async (p: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const nextFeatured = !p.featured;
      await api.updateProject(p.id, { featured: nextFeatured });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Featured Status', message: err.message });
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryVal = projectPayload.category === 'Custom'
        ? (projectPayload.custom_category.trim() || 'Custom')
        : projectPayload.category;
      const cleanScreenshots = (projectPayload.screenshots || []).filter((s: any) => typeof s === 'string' && s.trim());
      const featuresList = projectPayload.key_features ? projectPayload.key_features.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
      
      const data = {
        title: projectPayload.title,
        client_name: projectPayload.client_name,
        category: categoryVal,
        industry: projectPayload.industry.trim() || 'Technology & Enterprise',
        project_type: projectPayload.project_type.trim() || 'Bespoke Software Solution',
        positioning_statement: projectPayload.positioning_statement.trim() || projectPayload.short_description,
        technologies: projectPayload.technologies.split(',').map(t => t.trim()).filter(Boolean),
        short_description: projectPayload.short_description,
        description: projectPayload.description,
        what_we_solved: projectPayload.what_we_solved.trim() || projectPayload.case_study.trim() || 'Engineered tailored digital architecture solving core operational bottlenecks.',
        case_study: projectPayload.case_study.trim() || projectPayload.what_we_solved.trim() || '',
        problem_challenge: projectPayload.problem_challenge,
        solution: projectPayload.solution,
        key_features: featuresList,
        features: featuresList,
        live_url: projectPayload.live_url,
        github_url: projectPayload.github_url,
        completion_date: projectPayload.completion_date,
        status: projectPayload.status || 'Delivered',
        featured: !!projectPayload.featured,
        order: parseInt(projectPayload.order) || 99,
        thumbnail_url: projectPayload.thumbnail_url || cleanScreenshots[0] || '',
        screenshots: cleanScreenshots,
        gallery: cleanScreenshots
      };
      if (editingItem && editingItem.type === 'project') {
        await api.updateProject(editingItem.id, data);
        setAdminAlert({ title: 'Client Project Saved', message: 'Client project details updated successfully.' });
        setEditingItem(null);
      } else {
        await api.createProject(data);
        setAdminAlert({ title: 'Client Project Published', message: 'New client project published successfully.' });
      }
      setShowProjectForm(false);
      setProjectPayload({
        title: '',
        client_name: '',
        category: 'Web Applications',
        custom_category: '',
        industry: '',
        project_type: '',
        positioning_statement: '',
        technologies: '',
        short_description: '',
        description: '',
        what_we_solved: '',
        case_study: '',
        problem_challenge: '',
        solution: '',
        key_features: '',
        live_url: '',
        github_url: '',
        completion_date: '',
        status: 'Delivered',
        featured: true,
        order: '1',
        thumbnail_url: '',
        screenshots: ['', '', '', '', '']
      });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Client Project', message: err.message });
    }
  };

  const handleDeleteProject = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this client project?',
      onConfirm: async () => {
        try {
          await api.deleteProject(id);
          loadAllAdminData();
          window.dispatchEvent(new Event('sarohub-data-updated'));
          setAdminAlert({ title: 'Client Project Deleted', message: 'Project removed successfully.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Client Project', message: err.message });
        }
      }
    });
  };

  const handleCreateStudentProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanImages = (studentProjectPayload.images || []).filter((img: any) => typeof img === 'string' && img.trim()).slice(0, 5);
      const payload = {
        ...studentProjectPayload,
        images: cleanImages,
        thumbnail_url: studentProjectPayload.thumbnail_url || cleanImages[0] || ''
      };

      if (editingItem && editingItem.type === 'student_project') {
        await api.updateStudentProject(editingItem.id, payload);
        setAdminAlert({ title: 'Student Project Saved', message: 'Student project details updated successfully.' });
      } else {
        await api.createStudentProject(payload);
        setAdminAlert({ title: 'Student Project Published', message: 'New student project published successfully.' });
      }
      setShowStudentProjectForm(false);
      setEditingItem(null);
      setStudentProjectPayload({
        title: '',
        student_name: '',
        batch_course: '',
        category: 'Full-Stack Software',
        thumbnail_url: '',
        images: ['', '', '', '', ''],
        short_description: '',
        description: '',
        technologies: '',
        live_url: '',
        github_url: ''
      });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Operation Failed', message: err.message || 'Failed to save student project.' });
    }
  };

  const handleEditStudentProject = (item: any) => {
    setEditingItem({ id: item.id, type: 'student_project' });
    const existingImages = Array.isArray(item.images) ? item.images : (item.thumbnail_url ? [item.thumbnail_url] : []);
    const imageSlots = [
      existingImages[0] || '',
      existingImages[1] || '',
      existingImages[2] || '',
      existingImages[3] || '',
      existingImages[4] || ''
    ];

    setStudentProjectPayload({
      title: item.title || '',
      student_name: item.student_name || '',
      batch_course: item.batch_course || '',
      category: item.category || 'Full-Stack Software',
      thumbnail_url: item.thumbnail_url || existingImages[0] || '',
      images: imageSlots,
      short_description: item.short_description || '',
      description: item.description || '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies || '',
      live_url: item.live_url || '',
      github_url: item.github_url || ''
    });
    setShowStudentProjectForm(true);
  };

  const handleDeleteStudentProject = (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this student project?',
      onConfirm: async () => {
        try {
          await api.deleteStudentProject(id);
          loadAllAdminData();
          window.dispatchEvent(new Event('sarohub-data-updated'));
          setAdminAlert({ title: 'Deleted', message: 'Student project removed successfully.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Delete Failed', message: err.message || 'Failed to delete student project.' });
        }
      }
    });
  };

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let targetDept = teamPayload.department;
      let targetSecTitle = teamPayload.section_title;
      let targetSecDesc = teamPayload.section_description;

      // If user opted to create a new section inline
      if (teamPayload.is_new_section && teamPayload.new_section_title.trim()) {
        const newTitle = teamPayload.new_section_title.trim();
        const newDesc = teamPayload.new_section_description.trim() || `Specialized professionals driving innovation and domain excellence in ${newTitle}.`;
        const newBadge = teamPayload.new_section_badge.trim() || 'SPECIALIZED TEAM';
        const slug = newTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

        targetDept = slug;
        targetSecTitle = newTitle;
        targetSecDesc = newDesc;

        // Auto create section via API
        await api.createTeamSection({
          id: slug,
          title: newTitle,
          description: newDesc,
          badge: newBadge
        }).catch(console.error);
      } else if (targetDept) {
        const match = adminTeamSections.find(s => s.id === targetDept || s.title.toLowerCase() === targetDept.toLowerCase());
        if (match) {
          targetSecTitle = targetSecTitle || match.title;
          targetSecDesc = targetSecDesc || match.description;
        }
      }

      const data = {
        name: teamPayload.name,
        position: teamPayload.position,
        photo_url: teamPayload.photo_url,
        bio: teamPayload.bio,
        skills: teamPayload.skills.split(',').map(s => s.trim()).filter(Boolean),
        department: targetDept || (teamPayload.is_founder ? 'founders' : 'development'),
        section_title: targetSecTitle,
        section_description: targetSecDesc,
        social_linkedin: teamPayload.social_linkedin,
        social_github: teamPayload.social_github,
        social_twitter: teamPayload.social_twitter,
        portfolio_url: teamPayload.portfolio_url,
        social_links: (teamPayload.social_links || []).filter(s => s.url && s.url.trim()),
        experience_years: teamPayload.experience_years,
        is_founder: teamPayload.is_founder,
        sort_order: parseInt(teamPayload.sort_order) || 10
      };
      if (editingItem && editingItem.type === 'team') {
        await api.updateTeamMember(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createTeamMember(data);
      }
      setShowTeamForm(false);
      setTeamPayload({
        name: '',
        position: '',
        photo_url: '',
        bio: '',
        skills: '',
        department: 'founders',
        section_title: '',
        section_description: '',
        is_new_section: false,
        new_section_title: '',
        new_section_description: '',
        new_section_badge: '',
        social_linkedin: '',
        social_github: '',
        social_twitter: '',
        portfolio_url: '',
        social_links: [],
        experience_years: '5 Years',
        is_founder: false,
        sort_order: '10'
      });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Team Member', message: err.message });
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionFormPayload.title.trim()) return;
    try {
      if (editingSection) {
        await api.updateTeamSection(editingSection.id, {
          title: sectionFormPayload.title.trim(),
          description: sectionFormPayload.description.trim(),
          badge: sectionFormPayload.badge.trim()
        });
        setEditingSection(null);
      } else {
        await api.createTeamSection({
          title: sectionFormPayload.title.trim(),
          description: sectionFormPayload.description.trim(),
          badge: sectionFormPayload.badge.trim()
        });
      }
      setSectionFormPayload({ title: '', description: '', badge: '' });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Section', message: err.message });
    }
  };

  const handleDeleteSection = async (id: string, title: string) => {
    setDeleteConfirm({
      message: `Are you sure you want to remove the "${title}" section? (Team members assigned to it will remain, with default section headings).`,
      onConfirm: async () => {
        try {
          await api.deleteTeamSection(id);
          loadAllAdminData();
          window.dispatchEvent(new Event('sarohub-data-updated'));
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Section', message: err.message });
        }
      }
    });
  };

  const handleDeleteTeamMember = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this team member?',
      onConfirm: async () => {
        try {
          await api.deleteTeamMember(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Removing Team Member', message: err.message });
        }
      }
    });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: productPayload.title,
        short_description: productPayload.short_description,
        description: productPayload.description,
        features: productPayload.features.split(',').map(f => f.trim()),
        demo_url: productPayload.demo_url,
        video_url: productPayload.video_url,
        download_url: productPayload.download_url,
        thumbnail_url: productPayload.thumbnail_url
      };
      if (editingItem && editingItem.type === 'product') {
        await api.updateProduct(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createProduct(data);
      }
      setShowProductForm(false);
      setProductPayload({
        title: '',
        short_description: '',
        description: '',
        features: '',
        demo_url: '',
        video_url: '',
        download_url: '',
        thumbnail_url: ''
      });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Product', message: err.message });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: async () => {
        try {
          setAdminProducts((prev) => prev.filter((p) => p.id !== id));
          await api.deleteProduct(id);
          await loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Product', message: err.message || 'Failed to delete product.' });
          loadAllAdminData();
        }
      }
    });
  };

  const handleCreateSaleProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: saleProjectPayload.title,
        price: parseFloat(saleProjectPayload.price) || 0,
        technology: saleProjectPayload.technology.split(',').map(t => t.trim()),
        short_description: saleProjectPayload.short_description,
        features: saleProjectPayload.features.split(',').map(f => f.trim()),
        demo_url: saleProjectPayload.demo_url,
        video_url: saleProjectPayload.video_url,
        screenshots: saleProjectPayload.screenshots.map(image => image.url),
        screenshot_descriptions: saleProjectPayload.screenshots.map(image => image.description),
        thumbnail_url: saleProjectPayload.thumbnail_url
      };
      if (editingItem && editingItem.type === 'sale_project') {
        await api.updateSaleProject(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createSaleProject(data);
      }
      setShowSaleProjectForm(false);
      setSaleProjectPayload({ title: '', price: '', technology: '', short_description: '', features: '', demo_url: '', video_url: '', screenshots: [], thumbnail_url: '' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Template', message: err.message });
    }
  };

  const handleDeleteSaleProject = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this template?',
      onConfirm: async () => {
        try {
          await api.deleteSaleProject(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Template', message: err.message });
        }
      }
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: eventPayload.title,
        banner_url: eventPayload.banner_url,
        event_date: eventPayload.event_date,
        venue: eventPayload.venue,
        description: eventPayload.description,
        registration_link: eventPayload.registration_link,
        form_fields: eventPayload.form_fields || []
      };
      if (editingItem && editingItem.type === 'event') {
        await api.updateEvent(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createEvent(data);
      }
      setShowEventForm(false);
      setEventPayload({ title: '', banner_url: '', event_date: '', venue: '', description: '', registration_link: '', form_fields: [] });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Event', message: err.message });
    }
  };

  const handleAddEventField = () => {
    if (!eventNewFieldLabel.trim()) {
      alert('Field Label/Name is required.');
      return;
    }

    const fieldId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newField: OpportunityField = {
      id: fieldId,
      type: eventNewFieldType,
      label: eventNewFieldLabel.trim(),
      required: eventNewFieldRequired,
      placeholder: eventNewFieldPlaceholder.trim() || undefined,
    };

    if (['dropdown', 'radio', 'checkbox_multi', 'multi_select'].includes(eventNewFieldType)) {
      const opts = eventNewFieldOptions.split(',').map(s => s.trim()).filter(Boolean);
      newField.options = opts.length > 0 ? opts : ['Choice A', 'Choice B', 'Choice C'];
    }

    setEventPayload(prev => ({
      ...prev,
      form_fields: [...(prev.form_fields || []), newField]
    }));

    // Reset helper inputs
    setEventNewFieldLabel('');
    setEventNewFieldPlaceholder('');
    setEventNewFieldOptions('');
    setEventNewFieldRequired(false);
    setExpandedFieldId(fieldId);
  };

  const handleUpdateEventField = (index: number, updated: OpportunityField) => {
    setEventPayload(prev => {
      const copy = [...(prev.form_fields || [])];
      copy[index] = updated;
      return { ...prev, form_fields: copy };
    });
  };

  const handleRemoveEventField = (fieldId: string) => {
    setEventPayload(prev => ({
      ...prev,
      form_fields: (prev.form_fields || []).filter(f => f.id !== fieldId)
    }));
    if (expandedFieldId === fieldId) {
      setExpandedFieldId(null);
    }
  };

  const handleMoveEventField = (index: number, direction: 'up' | 'down') => {
    setEventPayload(prev => {
      const fields = [...(prev.form_fields || [])];
      if (direction === 'up' && index > 0) {
        const temp = fields[index];
        fields[index] = fields[index - 1];
        fields[index - 1] = temp;
      } else if (direction === 'down' && index < fields.length - 1) {
        const temp = fields[index];
        fields[index] = fields[index + 1];
        fields[index + 1] = temp;
      }
      return { ...prev, form_fields: fields };
    });
  };

  const handleMoveEventFieldToLimit = (index: number, limit: 'top' | 'bottom') => {
    setEventPayload(prev => {
      const fields = [...(prev.form_fields || [])];
      const target = fields[index];
      const filtered = fields.filter((_, i) => i !== index);
      if (limit === 'top') {
        return { ...prev, form_fields: [target, ...filtered] };
      } else {
        return { ...prev, form_fields: [...filtered, target] };
      }
    });
  };

  const handleDeleteEvent = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this corporate event?',
      onConfirm: async () => {
        try {
          await api.deleteEvent(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Event', message: err.message });
        }
      }
    });
  };

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        position: careerPayload.position,
        department: careerPayload.department,
        salary: careerPayload.salary,
        experience: careerPayload.experience,
        job_type: careerPayload.job_type || 'Full-Time',
        location: careerPayload.location || 'Hybrid / Onsite',
        skills: typeof careerPayload.skills === 'string' ? careerPayload.skills.split(',').map(s => s.trim()).filter(Boolean) : (careerPayload.skills || []),
        description: careerPayload.description,
        banner_url: careerPayload.banner_url,
        is_active: careerPayload.is_active !== undefined ? careerPayload.is_active : true
      };
      if (editingItem && editingItem.type === 'career') {
        await api.updateCareer(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createCareer(data);
      }
      setShowCareerForm(false);
      setCareerPayload({
        position: '',
        department: '',
        salary: '',
        experience: '',
        job_type: 'Full-Time',
        location: 'Hybrid / Onsite',
        skills: '',
        description: '',
        banner_url: '',
        is_active: true
      });
      window.dispatchEvent(new Event('sarohub-data-updated'));
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Job Vacancy', message: err.message });
    }
  };

  const handleToggleCareerStatus = async (item: any) => {
    try {
      await api.updateCareer(item.id, { is_active: !item.is_active });
      window.dispatchEvent(new Event('sarohub-data-updated'));
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Vacancy Status', message: err.message });
    }
  };

  const handleDeleteCareer = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this job vacancy?',
      onConfirm: async () => {
        try {
          await api.deleteCareer(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Job Vacancy', message: err.message });
        }
      }
    });
  };


  const handleDeleteApplication = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to permanently delete this job application?',
      onConfirm: async () => {
        try {
          await api.deleteApplication(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Application', message: err.message });
        }
      }
    });
  };

  const handleCreateFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        category: faqPayload.category,
        question: faqPayload.question,
        answer: faqPayload.answer
      };
      if (editingItem && editingItem.type === 'faq') {
        await api.updateFAQ(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createFAQ(data);
      }
      setShowFAQForm(false);
      setFaqPayload({ category: 'General', question: '', answer: '' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving FAQ', message: err.message });
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this FAQ?',
      onConfirm: async () => {
        try {
          await api.deleteFAQ(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting FAQ', message: err.message });
        }
      }
    });
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        client_name: testimonialPayload.client_name,
        client_role: testimonialPayload.client_role,
        client_company: testimonialPayload.client_company,
        feedback: testimonialPayload.feedback,
        rating: parseInt(testimonialPayload.rating) || 5,
        client_avatar: testimonialPayload.client_avatar
      };
      if (editingItem && editingItem.type === 'testimonial') {
        await api.updateTestimonial(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createTestimonial(data);
      }
      setShowTestimonialForm(false);
      setTestimonialPayload({ client_name: '', client_role: '', client_company: '', feedback: '', rating: '5', client_avatar: '' });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Endorsement', message: err.message });
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this review testimonial?',
      onConfirm: async () => {
        try {
          await api.deleteTestimonial(id);
          loadAllAdminData();
          window.dispatchEvent(new Event('sarohub-data-updated'));
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Testimonial', message: err.message });
        }
      }
    });
  };

  return (
    <>
      {/* Email/WhatsApp Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
          <div className="relative w-full max-w-lg rounded-2xl p-8 shadow-2xl border border-slate-800 bg-slate-950">
            <button onClick={() => { setReplyModal(null); setReplyText(''); setReplySubject(''); setReplyStatus(''); }} className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl font-bold">✕</button>
            {replyModal.mode === 'email' ? (
              <>
                <h3 className="font-display text-lg font-bold text-white mb-1">Reply via Email</h3>
                <p className="text-xs text-slate-500 mb-4">From: <span className="text-cyan-400">info@sarohub.com</span> → To: <span className="text-cyan-400">{replyModal.msg.email}</span></p>
                <input
                  type="text"
                  value={replySubject}
                  onChange={e => setReplySubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full mb-3 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply message here..."
                  className="w-full mb-3 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
                {replyStatus && <p className={`text-xs mb-3 font-semibold ${replyStatus.startsWith('✅') ? 'text-emerald-400' : 'text-rose-400'}`}>{replyStatus}</p>}
                <button
                  disabled={sendingReply || !replyText.trim()}
                  onClick={async () => {
                    setSendingReply(true);
                    setReplyStatus('');
                    try {
                      await api.replyContactMessage(replyModal.msg.id, { subject: replySubject || `Re: ${replyModal.msg.subject}`, message: replyText });
                      setReplyStatus('✅ Email sent successfully from info@sarohub.com!');
                      setReplyText('');
                      setReplySubject('');
                    } catch (err: any) {
                      setReplyStatus('❌ Failed: ' + (err.message || String(err)));
                    } finally {
                      setSendingReply(false);
                    }
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-all"
                >
                  {sendingReply ? 'Sending...' : '📧 Send from info@sarohub.com'}
                </button>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg font-bold text-white mb-1">Reply via WhatsApp</h3>
                <p className="text-xs text-slate-500 mb-4">Send from SaroHub Business → To: <span className="text-green-400">{replyModal.msg.phone}</span></p>
                <div className="mb-4">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Select Sender Number</label>
                  <select
                    value={whatsappSenderNumber}
                    onChange={e => setWhatsappSenderNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-green-400 text-sm font-mono focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                  >
                    <option value="03430381473">0343 0381473 — Primary Business Line</option>
                    <option value="03555866875">0355 5866875 — Mehdi Hassan (CEO)</option>
                    <option value="03445312774">0344 5312774 — Muhammad Kazim (CMO)</option>
                    <option value="03239171065">0323 9171065 — Support Line</option>
                  </select>
                </div>
                <textarea
                  rows={5}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your WhatsApp message here..."
                  className="w-full mb-4 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                />
                <p className="text-[10px] text-slate-500 mb-3">💡 Make sure WhatsApp Web is open and logged in with the selected number <strong className="text-green-400">{whatsappSenderNumber.replace(/(\d{4})(\d{7})/, '$1 $2')}</strong>. The chat will open automatically.</p>
                <a
                  href={`https://web.whatsapp.com/send?phone=${(replyModal.msg.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '92')}&text=${encodeURIComponent(replyText || 'Hello from SaroHub Technologies!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition-all text-center"
                  onClick={() => setReplyModal(null)}
                >
                  💬 Open WhatsApp Web & Send
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <div className="admin-panel-root mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Navigation Sidebar */}
          <div className="w-full md:w-1/4 space-y-2">
            <div className="glass rounded-2xl p-6 mb-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Authenticated User</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">SuperAdmin</h5>
                  <span className="text-[10px] font-mono text-emerald-400">Security Clearance</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-rose-950 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out Session
              </button>
            </div>

            <div className="glass rounded-2xl p-4 space-y-4">
              {/* Overview */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveModule('stats')}
                  className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'stats' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <TrendingUp className="h-4 w-4" /> Overview & Telemetry
                </button>
                <button
                  onClick={() => setActiveModule('company_metrics')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'company_metrics' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Hash className="h-4 w-4 text-blue-400" /> SaroHub in Numbers
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Live Stats
                  </span>
                </button>
              </div>

              {/* 1. Content Management */}
              <div className="space-y-1">
                <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Content Management
                </div>
                <button
                  onClick={() => setActiveModule('ventures')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'ventures' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <TrendingUp className="h-4 w-4" /> Ventures Portfolio
                </button>
                <button
                  onClick={() => setActiveModule('products')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'products' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="h-4 w-4" /> Software Products
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {adminProducts.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveModule('projects')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'projects' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Briefcase className="h-4 w-4" /> Client Projects
                </button>
                <button
                  onClick={() => setActiveModule('student_projects')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'student_projects' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4" /> Student Projects
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {adminStudentProjects.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveModule('services')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'services' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Grid className="h-4 w-4" /> Services Blueprints
                </button>
                <button
                  onClick={() => setActiveModule('blogs')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'blogs' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <FileText className="h-4 w-4" /> Insights & Articles
                </button>
                <button
                  onClick={() => setActiveModule('events')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'events' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Calendar className="h-4 w-4" /> Events Calendar
                </button>
                <button
                  onClick={() => setActiveModule('about')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'about' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Users className="h-4 w-4" /> Team & Leadership
                </button>
              </div>

              {/* 2. Business & Leads */}
              <div className="space-y-1">
                <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Business & Operations
                </div>
                <button
                  onClick={() => setActiveModule('consultations')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'consultations' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-cyan-400" /> Booked Consultations
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800 font-bold">
                    Pipeline
                  </span>
                </button>
                <button
                  onClick={() => setActiveModule('messages')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'messages' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4" /> Inquiries & Leads
                  </span>
                  {messages.filter(m => !m.is_read).length > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">
                      {messages.filter(m => !m.is_read).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveModule('apps')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'apps' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="h-4 w-4" /> Applications & CVs
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {apps.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveModule('careers')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'careers' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="h-4 w-4" /> Careers & Job Openings
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {adminCareers.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveModule('opportunities')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'opportunities' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <GraduationCap className="h-4 w-4" /> Opportunities &amp; Internships
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    CMS
                  </span>
                </button>
                <button
                  onClick={() => setActiveModule('event_applicants')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between gap-2.5 transition-all cursor-pointer ${activeModule === 'event_applicants' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <UserCheck className="h-4 w-4" /> Event Registrations
                  </span>
                  {eventApplicants && eventApplicants.length > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/60 text-cyan-400 border border-cyan-500/20 font-bold">
                      {eventApplicants.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveModule('partners')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'partners' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Users className="h-4 w-4" /> Partners & Ecosystem
                </button>
                <button
                  onClick={() => setActiveModule('chats')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'chats' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare className="h-4 w-4" /> Live Support Desk
                  </span>
                  {chatSessions.filter(s => s.agent_unread).length > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                      {chatSessions.filter(s => s.agent_unread).length}
                    </span>
                  )}
                </button>
              </div>

              {/* 3. Growth & Feedback */}
              <div className="space-y-1">
                <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Growth & Web
                </div>
                <button
                  onClick={() => setActiveModule('seo')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'seo' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Globe className="h-4 w-4" /> SEO & Meta Tags
                </button>
                <button
                  onClick={() => setActiveModule('trust')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'trust' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Trust, IP &amp; Models
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    CMS
                  </span>
                </button>
                <button
                  id="nav-module-gallery"
                  onClick={() => setActiveModule('gallery')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all ${activeModule === 'gallery' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <Camera className="h-4 w-4 text-cyan-400" /> Company Gallery
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    MEDIA
                  </span>
                </button>
                <button
                  onClick={() => setActiveModule('testimonials')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'testimonials' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Award className="h-4 w-4" /> Testimonial Reviews
                </button>
                <button
                  onClick={() => setActiveModule('faqs')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'faqs' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <AlertCircle className="h-4 w-4" /> FAQs Knowledgebase
                </button>
                <button
                  onClick={() => setActiveModule('newsletter')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'newsletter' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Tag className="h-4 w-4" /> Newsletter Subscribers
                </button>
              </div>

              {/* 4. Settings */}
              <div className="space-y-1">
                <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Settings & Security
                </div>
                <button
                  onClick={() => setActiveModule('settings')}
                  className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-all ${activeModule === 'settings' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
                >
                  <Settings className="h-4 w-4" /> System & Company Config
                </button>
                <button
                  onClick={() => setShowMailOutboxModal(true)}
                  className="w-full text-left rounded-xl px-3.5 py-2 text-xs font-mono flex items-center justify-between transition-all text-slate-400 hover:text-white hover:bg-slate-900/60 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-cyan-400" /> Mail Outbox &amp; SMTP
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Live Logs
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Pane */}
          <div className="w-full md:w-3/4 glass rounded-3xl p-8 border border-slate-900 min-h-[60vh]">

            {/* Module 1: Stats */}
            {activeModule === 'stats' && (

              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Platform Telemetry</h2>
                  <p className="text-xs text-slate-500 mt-1">Real-time dynamic operations summary across all relational modules</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-cyan-400 block">{stats?.visitors || 18450}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Impression Logs</span>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-white block">{messages.length}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Queries Sent</span>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-white block">{apps.length}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">CV Candidates</span>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-blue-500 block">99.999%</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">SLA Target</span>
                  </div>
                </div>

                {/* SaroHub in Numbers Management Section */}
                <div className="border-t border-slate-900 pt-8">
                  <AdminCompanyMetricsModule />
                </div>

                {/* Opportunities Module Statistics Section */}
                <div className="border-t border-slate-900 pt-8">
                  <h3 className="font-display font-bold text-white mb-4">Scholarship & Internship Portal Telemetry</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-blue-400 block">{opps.length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">Total Blueprints</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-cyan-400 block">{opps.filter(o => o.status === 'Open').length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">Active Cycles</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-white block">{oppApps.length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">Applications Logged</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-yellow-500 block">{oppApps.filter(a => a.status === 'Shortlisted').length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight font-bold">Shortlisted</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-emerald-500 block">{oppApps.filter(a => a.status === 'Selected').length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight font-bold">Executive Selects</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Settings Modification */}
                <div className="border-t border-slate-900 pt-8">
                  <h3 className="font-display font-bold text-white mb-4">WTC Corporate Registry Sync</h3>
                  <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Corporate Headquarters Registry Address</label>
                      <input
                        type="text"
                        value={officeAdd}
                        onChange={(e) => setOfficeAdd(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Corporate Contact Registry Email</label>
                      <input
                        type="email"
                        value={compMail}
                        onChange={(e) => setCompMail(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="rounded bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">Synchronize Registry</button>
                    </div>
                  </form>
                </div>

                {/* Security Audit Activity Logs */}
                <div className="border-t border-slate-900 pt-8">
                  <h3 className="font-display font-bold text-white flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-cyan-400" /> Administrative Audit Trail
                  </h3>
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-900 bg-slate-950/50 font-mono text-[10px] text-slate-400 p-4 divide-y divide-slate-900">
                    {logs.map((log) => (
                      <div key={log.id} className="py-2.5 flex items-start gap-4 justify-between">
                        <div>
                          <span className="text-cyan-400 font-bold">[{log.action_type}]</span>
                          <p className="mt-1 text-slate-300 leading-normal">{log.details}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-slate-600 block">ADMIN_SECURE</span>
                          <span className="text-[9px] text-slate-700 block">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Module: SaroHub in Numbers Dedicated View */}
            {activeModule === 'company_metrics' && (
              <AdminCompanyMetricsModule />
            )}

            {/* Module: Consultations */}
            {activeModule === 'consultations' && (
              <ConsultationsAdminModule />
            )}

            {/* Module 2: Messages */}
            {activeModule === 'event_applicants' && (
              <EventApplicantsTable applicants={eventApplicants} refresh={loadEventApplicants} />
            )}
            {activeModule === 'messages' && (() => {
              // Flatten and prepare combined message items
              const chatMessagesList = chatSessions.flatMap((session) => 
                (session.messages || []).map((chatMessage: any) => ({
                  type: 'chat' as const,
                  id: `chat-${session.id}-${chatMessage.id}`,
                  rawId: chatMessage.id,
                  sessionId: session.id,
                  name: session.visitor_name || 'Anonymous Visitor',
                  email: session.visitor_email || '',
                  phone: session.visitor_phone || '',
                  subject: 'RinaAI Assistant Conversation',
                  message: chatMessage.text,
                  sender: chatMessage.sender,
                  created_at: chatMessage.created_at || session.created_at || new Date().toISOString(),
                  is_read: 1
                }))
              );

              const contactMessagesList = messages.map((m) => ({
                type: 'contact' as const,
                id: `contact-${m.id}`,
                rawId: m.id,
                sessionId: null,
                name: m.name,
                email: m.email,
                phone: m.phone || '',
                subject: m.subject || 'Direct Website Inquiry',
                message: m.message,
                sender: 'visitor',
                created_at: m.created_at || new Date().toISOString(),
                is_read: m.is_read ? 1 : 0
              }));

              const unreadCount = messages.filter(m => !m.is_read).length;
              const totalCount = contactMessagesList.length + chatMessagesList.length;

              // Filter items based on active search and category
              let filteredList = [...contactMessagesList, ...chatMessagesList];

              if (messageFilter === 'unread') {
                filteredList = filteredList.filter(item => item.type === 'contact' && !item.is_read);
              } else if (messageFilter === 'contact') {
                filteredList = filteredList.filter(item => item.type === 'contact');
              } else if (messageFilter === 'assistant') {
                filteredList = filteredList.filter(item => item.type === 'chat');
              }

              if (messageSearch.trim()) {
                const q = messageSearch.toLowerCase().trim();
                filteredList = filteredList.filter(item => 
                  (item.name && item.name.toLowerCase().includes(q)) ||
                  (item.email && item.email.toLowerCase().includes(q)) ||
                  (item.phone && item.phone.toLowerCase().includes(q)) ||
                  (item.subject && item.subject.toLowerCase().includes(q)) ||
                  (item.message && item.message.toLowerCase().includes(q))
                );
              }

              // Sort by newest date
              filteredList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

              return (
                <div className="space-y-6">
                  {/* Header & Metric Overview */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-cyan-400" />
                        <span>Corporate Message Registries</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Consolidated repository of customer inquiries, consultation requests, and RinaAI cognitive assistant conversations.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllMsgsRead}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark All Read ({unreadCount})
                        </button>
                      )}
                      <button
                        onClick={loadAllAdminData}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Refresh Registry"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Total Entries</span>
                      <p className="text-xl font-bold text-white mt-1">{totalCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
                      <span className="text-[10px] font-mono uppercase text-cyan-400">Direct Inquiries</span>
                      <p className="text-xl font-bold text-cyan-300 mt-1">{messages.length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                      <span className="text-[10px] font-mono uppercase text-amber-400">Unread Inquiries</span>
                      <p className="text-xl font-bold text-amber-300 mt-1">{unreadCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20">
                      <span className="text-[10px] font-mono uppercase text-blue-400">Chat Transcripts</span>
                      <p className="text-xl font-bold text-blue-300 mt-1">{chatMessagesList.length}</p>
                    </div>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => setMessageFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          messageFilter === 'all'
                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        All ({totalCount})
                      </button>
                      <button
                        onClick={() => setMessageFilter('unread')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          messageFilter === 'unread'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <span>Unread</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setMessageFilter('contact')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          messageFilter === 'contact'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        Contact Forms ({messages.length})
                      </button>
                      <button
                        onClick={() => setMessageFilter('assistant')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          messageFilter === 'assistant'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        AI / Chat Logs ({chatMessagesList.length})
                      </button>
                    </div>

                    {/* Search Field */}
                    <div className="relative min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="text"
                        value={messageSearch}
                        onChange={(e) => setMessageSearch(e.target.value)}
                        placeholder="Search messages by name, topic, email..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      {messageSearch && (
                        <button
                          onClick={() => setMessageSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredList.length === 0 ? (
                      <div className="text-center py-16 px-4 rounded-2xl border border-slate-800 bg-slate-900/30">
                        <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                        <h4 className="font-display font-bold text-white text-base">No Messages Found</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          {messageSearch 
                            ? `No records match your search filter "${messageSearch}". Try clearing your keywords.`
                            : 'No inquiries or transcripts have been logged in this category yet.'}
                        </p>
                        {messageSearch && (
                          <button
                            onClick={() => setMessageSearch('')}
                            className="mt-4 px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredList.map((item) => {
                        const isChat = item.type === 'chat';
                        const isUnread = !isChat && !item.is_read;

                        const chatContactObj = {
                          id: isChat ? item.sessionId : item.rawId,
                          name: item.name,
                          email: item.email,
                          phone: item.phone,
                          subject: item.subject,
                          message: item.message
                        };

                        return (
                          <div
                            key={item.id}
                            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                              isUnread
                                ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                : isChat
                                  ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                                  : 'bg-slate-950/60 border-slate-800/60 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                              
                              {/* Left: Sender & Message Info */}
                              <div className="space-y-3 flex-1 min-w-0">
                                {/* Header badges & metadata */}
                                <div className="flex flex-wrap items-center gap-2">
                                  {isChat ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold font-mono uppercase">
                                      <Sparkles className="h-3 w-3" />
                                      RinaAI Chat
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold font-mono uppercase">
                                      <Mail className="h-3 w-3" />
                                      Website Contact Form
                                    </span>
                                  )}

                                  {isUnread && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse">
                                      New / Unread
                                    </span>
                                  )}

                                  <span className="text-[11px] font-mono text-slate-400">
                                    {new Date(item.created_at).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>

                                {/* Sender Details */}
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-400 uppercase shrink-0">
                                    {item.name ? item.name.charAt(0) : 'U'}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-display font-bold text-white text-base truncate">
                                      {item.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 font-mono">
                                      {item.email ? (
                                        <a href={`mailto:${item.email}`} className="text-cyan-400 hover:underline truncate">
                                          {item.email}
                                        </a>
                                      ) : (
                                        <span className="text-slate-600">No email</span>
                                      )}
                                      {item.phone && (
                                        <span className="text-slate-400">
                                          &bull; Tel: <a href={`tel:${item.phone}`} className="text-green-400 hover:underline">{item.phone}</a>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Subject Headline */}
                                <div className="font-medium text-xs sm:text-sm text-slate-200">
                                  <span className="text-slate-500 font-mono">Subject: </span>
                                  <span className="font-semibold text-white">{item.subject}</span>
                                </div>

                                {/* Body Content */}
                                <div className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl break-words">
                                  {item.message}
                                </div>
                              </div>

                              {/* Right: Action Toolbar */}
                              <div className="shrink-0 flex flex-wrap lg:flex-col items-end justify-start gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                                <div className="flex flex-wrap gap-1.5">
                                  {/* Reply Email */}
                                  <button
                                    disabled={!item.email}
                                    onClick={() => {
                                      setReplyModal({ msg: chatContactObj, mode: 'email' });
                                      setReplySubject(`Re: ${item.subject}`);
                                      setReplyText('');
                                      setReplyStatus('');
                                    }}
                                    className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-400 flex items-center gap-1.5 hover:bg-blue-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    title={item.email ? 'Reply via Email (from info@sarohub.com)' : 'No visitor email provided'}
                                  >
                                    <Mail className="h-3.5 w-3.5" /> Email
                                  </button>

                                  {/* Reply WhatsApp */}
                                  {item.phone && (
                                    <button
                                      onClick={() => {
                                        setReplyModal({ msg: chatContactObj, mode: 'whatsapp' });
                                        setReplyText('Hello from SaroHub Technologies! We have received your message and would love to assist you.');
                                        setWhatsappSenderNumber('03430381473');
                                      }}
                                      className="rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-1.5 text-xs font-bold text-green-400 flex items-center gap-1.5 hover:bg-green-500/20 transition-colors cursor-pointer"
                                      title="Reply via WhatsApp"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                                    </button>
                                  )}

                                  {/* Mark Read/Unread (for contact messages) */}
                                  {!isChat && (
                                    <button
                                      onClick={() => handleMarkMsgRead(item.rawId)}
                                      className={`rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                        item.is_read
                                          ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                          : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                                      }`}
                                      title={item.is_read ? 'Message is marked as read' : 'Mark as read'}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      {item.is_read ? 'Read' : 'Mark Read'}
                                    </button>
                                  )}

                                  {/* Delete Button */}
                                  {isChat ? (
                                    <>
                                      <button
                                        onClick={() => handleDeleteChatMessage(item.sessionId!, item.rawId)}
                                        className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 text-xs font-bold text-rose-400 flex items-center gap-1 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                        title="Delete this message"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteChatSession(item.sessionId!)}
                                        className="rounded-lg bg-rose-950/40 border border-rose-800/40 px-2.5 py-1.5 text-xs font-bold text-rose-300 flex items-center gap-1 hover:bg-rose-900/60 transition-colors cursor-pointer"
                                        title="Clear Entire Thread"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" /> Thread
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleDeleteContactMessage(item.rawId)}
                                      className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-400 flex items-center gap-1.5 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                      title="Delete Message"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </button>
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Module 3: Career Apps */}
            {activeModule === 'apps' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Job Candidates Portal ({apps.length})</h2>
                    <p className="text-xs text-slate-500 mt-1">Incoming job applications, candidate contact info, cover letters, and uploaded CV documents</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowMailOutboxModal(true)}
                      className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Inspect SMTP Status and Dispatched Emails"
                    >
                      <Mail className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Mail Outbox &amp; SMTP Logs</span>
                    </button>
                  </div>
                </div>

                {apps.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/30 text-center">
                    <p className="text-sm text-slate-500">No job applications submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apps.map((a) => {
                      const matchedJob = adminCareers.find(c => c.id === a.career_id);
                      const positionName = matchedJob ? matchedJob.position : `Position ID #${a.career_id}`;
                      return (
                        <div key={a.id} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/50 hover:border-slate-800 transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-display font-bold text-white text-base">{a.full_name}</h4>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono font-medium">
                                  Applied for: {positionName}
                                </span>
                              </div>
                              <div className="text-xs font-mono text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                                <span>📧 {a.email}</span>
                                <span>📞 {a.phone}</span>
                                <span>📅 {new Date(a.applied_at).toLocaleDateString()}</span>
                              </div>

                              {a.resume_url && (
                                <div className="pt-2">
                                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">Attached CV Document:</span>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDocPreviewState({
                                          isOpen: true,
                                          url: a.resume_url,
                                          filename: a.resume_filename || `CV_${a.full_name.replace(/\s+/g, '_')}.pdf`,
                                          candidateName: a.full_name,
                                          position: positionName,
                                          status: a.status,
                                          id: a.id
                                        });
                                      }}
                                      className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300 font-mono hover:bg-cyan-900/60 transition-colors cursor-pointer"
                                      title="Open In-App CV Viewer"
                                    >
                                      <Eye className="h-3.5 w-3.5 text-cyan-400" />
                                      <span>Preview CV</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const success = await downloadApplicationDocument(
                                          a.resume_url,
                                          a.resume_filename || `CV_${a.full_name.replace(/\s+/g, '_')}.pdf`,
                                          (errMsg) => setAdminAlert({ title: 'Download Notice', message: errMsg })
                                        );
                                        if (success) {
                                          setAdminAlert({
                                            title: 'Download Started',
                                            message: `Downloading document: ${a.resume_filename || 'Candidate_CV.pdf'}`
                                          });
                                        }
                                      }}
                                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 font-mono hover:bg-slate-850 hover:text-white transition-colors cursor-pointer"
                                      title="Download CV to your device"
                                    >
                                      <Download className="h-3.5 w-3.5 text-slate-400" />
                                      <span className="truncate max-w-[180px]">{a.resume_filename || 'Download CV'}</span>
                                    </button>
                                    <a
                                      href={`/api/documents/view?url=${encodeURIComponent(a.resume_url)}&filename=${encodeURIComponent(a.resume_filename || 'CV.pdf')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 p-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                      title="Open document viewer in new tab"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  </div>
                                </div>
                              )}

                              {a.cover_letter && (
                                <div className="pt-2">
                                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Cover Letter Summary:</span>
                                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-900 italic">
                                    "{a.cover_letter}"
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="shrink-0 text-right space-y-3 self-stretch sm:self-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                              <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-mono font-extrabold uppercase border ${a.status === 'shortlisted' ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' :
                                a.status === 'rejected' ? 'bg-rose-950/60 border-rose-500/30 text-rose-400' :
                                  'bg-amber-950/60 border-amber-500/30 text-amber-400'
                                }`}>
                                Status: {a.status}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  disabled={isShortlistingId === a.id}
                                  onClick={() => handleReviewApp(a.id, 'shortlisted')}
                                  className="rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-3 py-1.5 text-xs text-slate-950 font-bold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  {isShortlistingId === a.id ? (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Shortlisting...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-3.5 w-3.5" /> Shortlist
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReviewApp(a.id, 'rejected')}
                                  className="rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleDeleteApplication(a.id)}
                                  className="rounded-lg bg-rose-950/40 border border-rose-900/60 hover:bg-rose-950 text-rose-400 p-1.5 text-xs font-bold transition-colors cursor-pointer"
                                  title="Delete Application"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Module 4: Services */}
            {activeModule === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Services Blueprints CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure and list core service operations dynamically</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setServicePayload(initialServicePayload);
                      setShowServiceForm(!showServiceForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Blueprint
                  </button>
                </div>

                {showServiceForm && (
                  <form onSubmit={handleCreateService} className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                      <div>
                        <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                          <Code className="h-4 w-4 text-cyan-400" />
                          {editingItem && editingItem.type === 'service' ? `Edit Service Blueprint: ${servicePayload.title || 'Untitled'}` : 'Create New Service Blueprint'}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Manage SEO, technical capabilities, problems eliminated, target audience, metrics, and FAQs dynamically.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowServiceForm(false);
                            setEditingItem(null);
                            setServicePayload(initialServicePayload);
                          }}
                          className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-1.5 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer transition-colors shadow-sm">
                          <Check className="h-3.5 w-3.5" /> {editingItem && editingItem.type === 'service' ? 'Save Blueprint' : 'Publish Blueprint'}
                        </button>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-slate-800/60 pb-3">
                      {[
                        { id: 'overview', label: '1. Overview & Hero' },
                        { id: 'problems', label: '2. Problems We Eliminate' },
                        { id: 'capabilities', label: '3. Technical Capabilities' },
                        { id: 'audience', label: '4. Target Audience' },
                        { id: 'metrics', label: '5. Metrics & Advantages' },
                        { id: 'tech_faqs', label: '6. Tech Stack & FAQs' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setServiceFormTab(tab.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                            serviceFormTab === tab.id
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* TAB 1: OVERVIEW & HERO */}
                    {serviceFormTab === 'overview' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-mono text-slate-400 mb-1">Service Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Custom Software Development"
                              value={servicePayload.title}
                              onChange={(e) => setServicePayload({ ...servicePayload, title: e.target.value })}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">URL Slug (lowercase-kebab)</label>
                            <input
                              type="text"
                              placeholder="e.g. custom-software"
                              value={servicePayload.slug}
                              onChange={(e) => setServicePayload({ ...servicePayload, slug: e.target.value })}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Category / Domain</label>
                            <input
                              type="text"
                              placeholder="e.g. Software Engineering & Systems"
                              value={servicePayload.category}
                              onChange={(e) => setServicePayload({ ...servicePayload, category: e.target.value })}
                              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                          <ImageUploadField
                            label="Featured Banner / Hero Graphic"
                            value={servicePayload.banner_url}
                            onChange={(url) => setServicePayload({ ...servicePayload, banner_url: url })}
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Hero Main Headline</label>
                          <input
                            type="text"
                            placeholder="e.g. Custom Software Development Engineered for Enterprise Performance"
                            value={servicePayload.hero_headline}
                            onChange={(e) => setServicePayload({ ...servicePayload, hero_headline: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Short Description (Sub-headline / Summary)</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Short technical overview summarizing scope and primary value proposition..."
                            value={servicePayload.short_description}
                            onChange={(e) => setServicePayload({ ...servicePayload, short_description: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Detailed Technical Copy & Scope (Comprehensive Overview)</label>
                          <textarea
                            rows={4}
                            required
                            placeholder="In-depth narrative explaining architectural philosophy, compliance standards, scaling criteria..."
                            value={servicePayload.description}
                            onChange={(e) => setServicePayload({ ...servicePayload, description: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 2: PROBLEMS WE ELIMINATE */}
                    {serviceFormTab === 'problems' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-mono text-cyan-400 font-semibold">
                              Operational Problems We Eliminate (1 per line)
                            </label>
                            <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/50">
                              {servicePayload.problems_solved.split('\n').filter(s => s.trim()).length} problems listed
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">
                            Each line entered below will render as a dedicated eliminated bottleneck with a warning/cross icon on the service detail page.
                          </p>
                          <textarea
                            rows={7}
                            placeholder={`Operational bottlenecks caused by disconnected manual workflows.\nSystem scalability constraints under sudden user traffic surges.\nData silos between internal teams and legacy third-party tools.\nSecurity vulnerabilities and downtime from unmanaged cloud infrastructure.`}
                            value={servicePayload.problems_solved}
                            onChange={(e) => setServicePayload({ ...servicePayload, problems_solved: e.target.value })}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-white font-mono leading-relaxed focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 3: TECHNICAL CAPABILITIES */}
                    {serviceFormTab === 'capabilities' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-mono text-cyan-400 font-semibold">Technical Capabilities & Architecture Pillars</h4>
                            <p className="text-xs text-slate-400">Add or edit key technical pillars and architectural modules.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setServicePayload({
                              ...servicePayload,
                              capabilities: [...(servicePayload.capabilities || []), { title: '', description: '' }]
                            })}
                            className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Capability
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(servicePayload.capabilities || []).map((cap, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 flex flex-col md:flex-row gap-3 items-start">
                              <div className="flex-1 w-full space-y-2">
                                <input
                                  type="text"
                                  placeholder="Capability Title (e.g. Custom Architecture & Microservices)"
                                  value={cap.title}
                                  onChange={(e) => {
                                    const next = [...servicePayload.capabilities];
                                    next[idx] = { ...next[idx], title: e.target.value };
                                    setServicePayload({ ...servicePayload, capabilities: next });
                                  }}
                                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-semibold"
                                />
                                <textarea
                                  rows={2}
                                  placeholder="Technical description of this capability..."
                                  value={cap.description}
                                  onChange={(e) => {
                                    const next = [...servicePayload.capabilities];
                                    next[idx] = { ...next[idx], description: e.target.value };
                                    setServicePayload({ ...servicePayload, capabilities: next });
                                  }}
                                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = servicePayload.capabilities.filter((_, i) => i !== idx);
                                  setServicePayload({ ...servicePayload, capabilities: next });
                                }}
                                className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer self-end md:self-center"
                                title="Remove Capability"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 4: TARGET AUDIENCE */}
                    {serviceFormTab === 'audience' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-mono text-cyan-400 font-semibold">
                              Target Organizations & Use Cases (1 per line)
                            </label>
                            <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/50">
                              {servicePayload.target_audience.split('\n').filter(s => s.trim()).length} audience targets
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">
                            Describe who this solution is built for (enterprises, scaling tech startups, public institutions).
                          </p>
                          <textarea
                            rows={6}
                            placeholder={`Mid-to-large enterprises replacing legacy on-premise systems.\nFunded scaleups requiring rapid full-stack product iteration.\nOrganizations needing custom integrations between ERP, CRM, and cloud services.`}
                            value={servicePayload.target_audience}
                            onChange={(e) => setServicePayload({ ...servicePayload, target_audience: e.target.value })}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-white font-mono leading-relaxed focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 5: METRICS & ADVANTAGES */}
                    {serviceFormTab === 'metrics' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-mono text-cyan-400 font-semibold">Verified Impact & Strategic Metrics</h4>
                            <p className="text-xs text-slate-400">Measurable KPIs highlighted prominently in the benefits banner.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setServicePayload({
                              ...servicePayload,
                              business_benefits: [...(servicePayload.business_benefits || []), { metric: '', label: '', description: '' }]
                            })}
                            className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Metric
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(servicePayload.business_benefits || []).map((ben, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 flex flex-col md:flex-row gap-3 items-start">
                              <div className="w-full md:w-32">
                                <label className="block text-[10px] font-mono text-slate-400 mb-1">Metric Value</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 99.99%"
                                  value={ben.metric}
                                  onChange={(e) => {
                                    const next = [...servicePayload.business_benefits];
                                    next[idx] = { ...next[idx], metric: e.target.value };
                                    setServicePayload({ ...servicePayload, business_benefits: next });
                                  }}
                                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white font-bold font-mono focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div className="w-full md:w-48">
                                <label className="block text-[10px] font-mono text-slate-400 mb-1">Metric Label</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Uptime SLA"
                                  value={ben.label}
                                  onChange={(e) => {
                                    const next = [...servicePayload.business_benefits];
                                    next[idx] = { ...next[idx], label: e.target.value };
                                    setServicePayload({ ...servicePayload, business_benefits: next });
                                  }}
                                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div className="flex-1 w-full">
                                <label className="block text-[10px] font-mono text-slate-400 mb-1">Technical Context</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Fault-tolerant deployment ensures reliable continuous uptime."
                                  value={ben.description}
                                  onChange={(e) => {
                                    const next = [...servicePayload.business_benefits];
                                    next[idx] = { ...next[idx], description: e.target.value };
                                    setServicePayload({ ...servicePayload, business_benefits: next });
                                  }}
                                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = servicePayload.business_benefits.filter((_, i) => i !== idx);
                                  setServicePayload({ ...servicePayload, business_benefits: next });
                                }}
                                className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer self-end md:self-center mt-3 md:mt-0"
                                title="Remove Metric"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="block text-xs font-mono text-slate-400 mb-1">High-Level Advantages (Comma separated)</label>
                          <input
                            type="text"
                            placeholder="Zero Tech Debt, High Scalability, Enterprise SLA Support"
                            value={servicePayload.benefits}
                            onChange={(e) => setServicePayload({ ...servicePayload, benefits: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 6: TECH STACK & FAQS */}
                    {serviceFormTab === 'tech_faqs' && (
                      <div className="space-y-6 animate-fade-in">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Technologies & Frameworks (Comma separated)</label>
                          <input
                            type="text"
                            placeholder="TypeScript, Node.js, React, Next.js, PostgreSQL, Docker, Kubernetes, AWS"
                            value={servicePayload.technologies}
                            onChange={(e) => setServicePayload({ ...servicePayload, technologies: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                          <p className="text-[11px] text-slate-500 mt-1 font-mono">
                            These appear as high-contrast technology chips on the service detail page.
                          </p>
                        </div>

                        <div className="border-t border-slate-800/80 pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-mono text-cyan-400 font-semibold">Service-Specific FAQs</h4>
                              <p className="text-xs text-slate-400">Technical questions directly answered on this service page.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setServicePayload({
                                ...servicePayload,
                                faqs: [...(servicePayload.faqs || []), { question: '', answer: '' }]
                              })}
                              className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add FAQ
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(servicePayload.faqs || []).map((faq, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    placeholder="Question (e.g. How do you ensure code maintainability and security?)"
                                    value={faq.question}
                                    onChange={(e) => {
                                      const next = [...servicePayload.faqs];
                                      next[idx] = { ...next[idx], question: e.target.value };
                                      setServicePayload({ ...servicePayload, faqs: next });
                                    }}
                                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white font-semibold focus:border-cyan-500 focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = servicePayload.faqs.filter((_, i) => i !== idx);
                                      setServicePayload({ ...servicePayload, faqs: next });
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                                    title="Delete FAQ"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Clear, authoritative answer..."
                                  value={faq.answer}
                                  onChange={(e) => {
                                    const next = [...servicePayload.faqs];
                                    next[idx] = { ...next[idx], answer: e.target.value };
                                    setServicePayload({ ...servicePayload, faqs: next });
                                  }}
                                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] font-mono text-slate-500">
                        Changes persist directly to database and live service views.
                      </span>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowServiceForm(false);
                            setEditingItem(null);
                            setServicePayload(initialServicePayload);
                          }}
                          className="rounded-lg border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer shadow-sm">
                          {editingItem && editingItem.type === 'service' ? 'Save Blueprint' : 'Publish Blueprint'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {services.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">{s.title}</h4>
                        <p className="text-[10px] font-mono text-slate-500">{s.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(s)}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                          title="Edit Blueprint"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Blueprint"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 5: Blogs */}
            {activeModule === 'blogs' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Research Blogs CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Author and organize corporate engineering articles dynamically</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-2 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Manage Custom Blog Categories"
                    >
                      <Tag className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Manage Categories ({adminBlogCategories.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setBlogPayload({
                          title: '',
                          category_id: adminBlogCategories[0]?.id ? String(adminBlogCategories[0].id) : '1',
                          custom_category_name: '',
                          author_name: 'Mehdi Hassan',
                          author_avatar: '',
                          reading_time: '5 min read',
                          featured_image_url: '',
                          content: '',
                          is_featured: false
                        });
                        setShowBlogForm(!showBlogForm);
                      }}
                      className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer hover:bg-cyan-400 transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Author Article
                    </button>
                  </div>
                </div>

                {showBlogForm && (
                  <form onSubmit={handleCreateBlog} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'blog' ? 'Edit Research Article' : 'Author New Engineering Article'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Article Title</label>
                        <input
                          type="text"
                          required
                          value={blogPayload.title}
                          onChange={(e) => setBlogPayload({ ...blogPayload, title: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-mono text-slate-500">Category</label>
                          <button
                            type="button"
                            onClick={() => {
                              setBlogPayload(prev => ({
                                ...prev,
                                category_id: '__custom__'
                              }));
                            }}
                            className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                          >
                            + Custom Category
                          </button>
                        </div>
                        <select
                          value={blogPayload.category_id}
                          onChange={(e) => setBlogPayload({ ...blogPayload, category_id: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        >
                          {adminBlogCategories.length > 0 ? (
                            adminBlogCategories.map((cat) => (
                              <option key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </option>
                            ))
                          ) : (
                            <option value="1">Technical & Engineering</option>
                          )}
                          <option value="__custom__">+ Add Custom Category...</option>
                        </select>

                        {blogPayload.category_id === '__custom__' && (
                          <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2 animate-fade-in">
                            <label className="block text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                              New Custom Category Name
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="e.g. AI & Cloud Architecture"
                                value={blogPayload.custom_category_name || ''}
                                onChange={(e) => setBlogPayload({ ...blogPayload, custom_category_name: e.target.value })}
                                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!blogPayload.custom_category_name?.trim()) return;
                                  try {
                                    const res = await api.createBlogCategory(blogPayload.custom_category_name.trim());
                                    const updated = await api.getBlogCategories();
                                    setAdminBlogCategories(updated || []);
                                    setBlogPayload(prev => ({
                                      ...prev,
                                      category_id: res?.id ? String(res.id) : prev.category_id,
                                      custom_category_name: ''
                                    }));
                                    loadAllAdminData();
                                  } catch (err: any) {
                                    setAdminAlert({ title: 'Error', message: err.message });
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs font-mono hover:bg-cyan-400 cursor-pointer whitespace-nowrap"
                              >
                                Save &amp; Select
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Author Name</label>
                        <input
                          type="text"
                          required
                          value={blogPayload.author_name}
                          onChange={(e) => setBlogPayload({ ...blogPayload, author_name: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Reading Time</label>
                        <input
                          type="text"
                          placeholder="5 min read"
                          value={blogPayload.reading_time}
                          onChange={(e) => setBlogPayload({ ...blogPayload, reading_time: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <ImageUploadField
                        label="Author Avatar Image"
                        value={blogPayload.author_avatar}
                        onChange={(url) => setBlogPayload({ ...blogPayload, author_avatar: url })}
                        placeholder="https://..."
                      />
                    </div>

                    <ImageUploadField
                      label="Featured Banner Image"
                      value={blogPayload.featured_image_url}
                      onChange={(url) => setBlogPayload({ ...blogPayload, featured_image_url: url })}
                      placeholder="https://..."
                    />

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Full Article Content (Markdown Text)</label>
                      <textarea
                        rows={6}
                        required
                        value={blogPayload.content}
                        onChange={(e) => setBlogPayload({ ...blogPayload, content: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="blog_is_featured"
                        checked={blogPayload.is_featured}
                        onChange={(e) => setBlogPayload({ ...blogPayload, is_featured: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                      />
                      <label htmlFor="blog_is_featured" className="text-xs font-mono text-slate-400 select-none">
                        Mark as Featured Article
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBlogForm(false);
                          setEditingItem(null);
                          setBlogPayload({
                            title: '',
                            category_id: '1',
                            author_name: 'Mehdi Hassan',
                            author_avatar: '',
                            reading_time: '5 min read',
                            featured_image_url: '',
                            content: '',
                            is_featured: false
                          });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'blog' ? 'Save Changes' : 'Publish Article'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {blogs.map((b) => (
                    <div key={b.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">{b.title}</h4>
                        <p className="text-[10px] font-mono text-slate-500">Author: {b.author_name} &bull; {b.reading_time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBlog(b)}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Management Modal */}
                <AnimatePresence>
                  {showCategoryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
                      >
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-cyan-400" />
                            <h3 className="font-display font-bold text-white text-sm">Manage Article Categories</h3>
                          </div>
                          <button
                            onClick={() => setShowCategoryModal(false)}
                            className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Add New Category Input */}
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                          <span className="block text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                            + Add New Custom Category
                          </span>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Category Name (e.g. AI & Machine Learning, DevOps)"
                              value={newCatName}
                              onChange={(e) => setNewCatName(e.target.value)}
                              className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                            />
                            <input
                              type="text"
                              placeholder="Brief Description (optional)"
                              value={newCatDesc}
                              onChange={(e) => setNewCatDesc(e.target.value)}
                              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleCreateCategory()}
                              disabled={!newCatName.trim()}
                              className="w-full rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 py-2 text-xs font-bold font-mono transition-colors cursor-pointer"
                            >
                              Create &amp; Save Category
                            </button>
                          </div>
                        </div>

                        {/* Existing Categories List */}
                        <div className="space-y-2">
                          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                            Existing Categories ({adminBlogCategories.length})
                          </span>
                          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/50">
                            {adminBlogCategories.map((cat) => (
                              <div key={cat.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                                <div>
                                  <span className="font-bold text-white">{cat.name}</span>
                                  {cat.description && (
                                    <p className="text-[10px] text-slate-400 mt-0.5">{cat.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBlogPayload(prev => ({
                                        ...prev,
                                        category_id: String(cat.id),
                                        custom_category_name: ''
                                      }));
                                      setShowCategoryModal(false);
                                    }}
                                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 cursor-pointer"
                                  >
                                    Select
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-1 rounded text-rose-400 hover:bg-rose-950/50 cursor-pointer"
                                    title="Delete category"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowCategoryModal(false)}
                            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs text-slate-300 font-mono cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Module 6: Testimonials Admin Panel */}
            {activeModule === 'testimonials' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Client Testimonials Reviews</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage public-facing enterprise recommendations and endorsements</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setTestimonialPayload({ client_name: '', client_role: '', client_company: '', client_avatar: '', rating: '5', feedback: '' });
                      setShowTestimonialForm(!showTestimonialForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Review
                  </button>
                </div>

                {showTestimonialForm && (
                  <form onSubmit={handleCreateTestimonial} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'testimonial' ? 'Edit Testimonial Review' : 'Create Client Testimonial Review'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Client Name</label>
                        <input
                          type="text"
                          required
                          value={testimonialPayload.client_name}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, client_name: e.target.value })}
                          placeholder="e.g. Ruwan Silva"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Client Role/Designation</label>
                        <input
                          type="text"
                          required
                          value={testimonialPayload.client_role}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, client_role: e.target.value })}
                          placeholder="e.g. VP of Operations"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Client Company</label>
                        <input
                          type="text"
                          required
                          value={testimonialPayload.client_company}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, client_company: e.target.value })}
                          placeholder="e.g. Apex Cargo Systems"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImageUploadField
                        label="Client Avatar Image"
                        value={testimonialPayload.client_avatar}
                        onChange={(url) => setTestimonialPayload({ ...testimonialPayload, client_avatar: url })}
                        placeholder="https://..."
                      />
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Rating Stars</label>
                        <select
                          value={testimonialPayload.rating}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, rating: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        >
                          <option value="5">5 Stars (Excellent)</option>
                          <option value="4">4 Stars (Good)</option>
                          <option value="3">3 Stars (Average)</option>
                          <option value="2">2 Stars (Poor)</option>
                          <option value="1">1 Star (Critical)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Feedback/Recommendation Message</label>
                      <textarea
                        rows={4}
                        required
                        value={testimonialPayload.feedback}
                        onChange={(e) => setTestimonialPayload({ ...testimonialPayload, feedback: e.target.value })}
                        placeholder="Type testimonial feedback text..."
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTestimonialForm(false);
                          setEditingItem(null);
                          setTestimonialPayload({ client_name: '', client_role: '', client_company: '', client_avatar: '', rating: '5', feedback: '' });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'testimonial' ? 'Save Changes' : 'Add Endorsement'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminTestimonials.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl border border-slate-900 bg-slate-950/50 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex gap-1 text-cyan-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-current text-cyan-400' : 'text-slate-700'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 italic">"{t.feedback}"</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-900/40 gap-4">
                        <div className="flex items-center gap-3">
                          <img src={t.client_avatar} alt={t.client_name} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <h5 className="font-display font-bold text-white text-xs">{t.client_name}</h5>
                            <span className="text-[10px] text-slate-500 block">{t.client_role} &bull; {t.client_company}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTestimonial(t)}
                            className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module: Client Projects CMS */}
            {activeModule === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Client Projects CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure and display client projects, custom solutions, and delivered software dynamically</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setProjectPayload({
                        title: '',
                        client_name: '',
                        category: 'Web Applications',
                        custom_category: '',
                        industry: '',
                        project_type: '',
                        positioning_statement: '',
                        technologies: '',
                        short_description: '',
                        description: '',
                        what_we_solved: '',
                        case_study: '',
                        problem_challenge: '',
                        solution: '',
                        key_features: '',
                        live_url: '',
                        github_url: '',
                        completion_date: '',
                        status: 'Delivered',
                        featured: true,
                        order: String(adminProjects.length + 1),
                        thumbnail_url: '',
                        screenshots: ['', '', '', '', '']
                      });
                      setShowProjectForm(!showProjectForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Client Project
                  </button>
                </div>

                {showProjectForm && (
                  <form onSubmit={handleCreateProject} className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                        {editingItem && editingItem.type === 'project' ? 'Edit Client Project Case Study' : 'Create New Client Project Case Study'}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        All fields sync dynamically to Homepage &amp; Case Study pages
                      </span>
                    </div>

                    {/* Section 1: Core Identification */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">1. General Information &amp; Client</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Project Title *</label>
                          <input
                            type="text"
                            required
                            value={projectPayload.title}
                            onChange={(e) => setProjectPayload({ ...projectPayload, title: e.target.value })}
                            placeholder="e.g. Waziri Mobile, Crescent Resorts, Omnichannel Grid"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Client Name / Organization *</label>
                          <input
                            type="text"
                            required
                            value={projectPayload.client_name}
                            onChange={(e) => setProjectPayload({ ...projectPayload, client_name: e.target.value })}
                            placeholder="e.g. Waziri Communications, The Crescent Group"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                          <select
                            value={projectPayload.category}
                            onChange={(e) => setProjectPayload({ ...projectPayload, category: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          >
                            {['Web Applications', 'Mobile Applications', 'SaaS & Cloud Platforms', 'AI & Intelligent Systems', 'UI/UX & Product Design', 'E-Commerce / Commerce', 'Business Software', 'Custom'].map(cat => (
                              <option key={cat} value={cat}>{cat === 'Custom' ? 'Custom Category (Specify)' : cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Industry</label>
                          <input
                            type="text"
                            placeholder="e.g. Retail & Telecommunications"
                            value={projectPayload.industry}
                            onChange={(e) => setProjectPayload({ ...projectPayload, industry: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Delivery Status</label>
                          <select
                            value={projectPayload.status}
                            onChange={(e) => setProjectPayload({ ...projectPayload, status: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          >
                            <option value="Delivered">Delivered &amp; Live</option>
                            <option value="Completed">Completed</option>
                            <option value="Live in Production">Live in Production</option>
                            <option value="In Development">In Development</option>
                            <option value="Ongoing">Ongoing Retainer</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Display Sort Order</label>
                          <input
                            type="number"
                            min="1"
                            max="999"
                            value={projectPayload.order}
                            onChange={(e) => setProjectPayload({ ...projectPayload, order: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {projectPayload.category === 'Custom' && (
                        <div>
                          <label className="block text-xs font-mono text-cyan-400 mb-1">Custom Category Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Logistics & Supply Chain, Embedded IoT"
                            value={projectPayload.custom_category}
                            onChange={(e) => setProjectPayload({ ...projectPayload, custom_category: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-cyan-500/50 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Project Type / Subtitle</label>
                          <input
                            type="text"
                            placeholder="e.g. Bespoke Mobile App &amp; In-Store Digital Device Showcase"
                            value={projectPayload.project_type}
                            onChange={(e) => setProjectPayload({ ...projectPayload, project_type: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Technologies (Comma separated)</label>
                          <input
                            type="text"
                            placeholder="React Native, TypeScript, Node.js, PostgreSQL"
                            value={projectPayload.technologies}
                            onChange={(e) => setProjectPayload({ ...projectPayload, technologies: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Completion / Delivery Date</label>
                          <input
                            type="date"
                            value={projectPayload.completion_date}
                            onChange={(e) => setProjectPayload({ ...projectPayload, completion_date: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div className="pt-4 flex items-center gap-3">
                          <label className="relative flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={projectPayload.featured}
                              onChange={(e) => setProjectPayload({ ...projectPayload, featured: e.target.checked })}
                              className="h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900 cursor-pointer"
                            />
                            <span className="text-xs font-medium text-white">
                              Feature this project on Homepage <span className="text-cyan-400 font-semibold">(Selected Work)</span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Visual Assets */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">2. Cover Image &amp; Showcase Gallery</h4>
                      <ImageUploadField
                        label="Primary Cover Image / Thumbnail URL *"
                        value={projectPayload.thumbnail_url}
                        onChange={(url) => setProjectPayload({ ...projectPayload, thumbnail_url: url })}
                        placeholder="https://images.unsplash.com/... or upload directly"
                      />

                      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                            Interactive Gallery Screenshots (Up to 5 images)
                          </label>
                          <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                            {(projectPayload.screenshots || []).filter((s: any) => typeof s === 'string' && s.trim()).length} of 5 Added
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {[0, 1, 2, 3, 4].map((slotIdx) => (
                            <div key={slotIdx} className="p-2.5 rounded-lg border border-slate-800/60 bg-slate-950/60">
                              <ImageUploadField
                                label={`Screenshot #${slotIdx + 1}`}
                                value={(projectPayload.screenshots && projectPayload.screenshots[slotIdx]) || ''}
                                onChange={(url) => {
                                  const newScreenshots = [...(projectPayload.screenshots || ['', '', '', '', ''])];
                                  while (newScreenshots.length <= slotIdx) newScreenshots.push('');
                                  newScreenshots[slotIdx] = url;
                                  setProjectPayload({ ...projectPayload, screenshots: newScreenshots });
                                }}
                                placeholder="https://... or upload from system"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Narratives & Case Study Content */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">3. Case Study Narratives &amp; Results</h4>
                      
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Short Summary / Card Teaser *</label>
                        <input
                          type="text"
                          required
                          value={projectPayload.short_description}
                          onChange={(e) => setProjectPayload({ ...projectPayload, short_description: e.target.value })}
                          placeholder="Brief 1-2 line description displayed on project cards"
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          What We Solved (Core Breakthrough / Impact Summary) *
                        </label>
                        <input
                          type="text"
                          required
                          value={projectPayload.what_we_solved}
                          onChange={(e) => setProjectPayload({ ...projectPayload, what_we_solved: e.target.value, case_study: e.target.value })}
                          placeholder="e.g. Modernized digital retail presence, reduced manual stock queries by 85%, and enabled seamless cataloging."
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">
                            Challenges / Problem Statement (Multiple lines or bullet points)
                          </label>
                          <textarea
                            rows={4}
                            value={projectPayload.problem_challenge}
                            onChange={(e) => setProjectPayload({ ...projectPayload, problem_challenge: e.target.value })}
                            placeholder="Fragmented inventory tracking across physical branches&#10;Slow manual ordering and customer inquiry turnaround&#10;Lack of modern mobile-optimized interface"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">
                            Solution Implemented (Multiple lines or bullet points)
                          </label>
                          <textarea
                            rows={4}
                            value={projectPayload.solution}
                            onChange={(e) => setProjectPayload({ ...projectPayload, solution: e.target.value })}
                            placeholder="Architected cross-platform React Native app with cloud sync&#10;Engineered real-time device specification search&#10;Automated WhatsApp order routing and notification pipeline"
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          Key Features &amp; Capabilities (One per line)
                        </label>
                        <textarea
                          rows={3}
                          value={projectPayload.key_features}
                          onChange={(e) => setProjectPayload({ ...projectPayload, key_features: e.target.value })}
                          placeholder="Real-Time Device &amp; Stock Availability Search&#10;Cross-Branch Inventory Synchronization&#10;Automated WhatsApp Inquiry &amp; Order Routing&#10;Instant Pricing Matrix Updates"
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          Detailed Project Overview &amp; Architectural Scope
                        </label>
                        <textarea
                          rows={3}
                          value={projectPayload.description}
                          onChange={(e) => setProjectPayload({ ...projectPayload, description: e.target.value })}
                          placeholder="Comprehensive architectural background, design patterns, and engineering scope delivered by SaroHub Technologies..."
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Live Demo / Production Website URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={projectPayload.live_url}
                            onChange={(e) => setProjectPayload({ ...projectPayload, live_url: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">GitHub / Code Repository URL</label>
                          <input
                            type="text"
                            placeholder="https://github.com/sarohub/..."
                            value={projectPayload.github_url}
                            onChange={(e) => setProjectPayload({ ...projectPayload, github_url: e.target.value })}
                            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProjectForm(false);
                          setEditingItem(null);
                        }}
                        className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20">
                        {editingItem && editingItem.type === 'project' ? 'Save Changes' : 'Publish Client Project'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Client Projects List */}
                <div className="grid grid-cols-1 gap-4">
                  {adminProjects.map((p) => {
                    const screenshotCount = (Array.isArray(p.screenshots) ? p.screenshots : (Array.isArray(p.gallery) ? p.gallery : [])).filter(Boolean).length;
                    const isFeatured = p.featured !== undefined ? !!p.featured : true;
                    return (
                      <div key={p.id} className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={p.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'}
                            alt={p.title}
                            className="h-14 w-20 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-900"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-semibold border border-slate-800">
                                #{p.order !== undefined ? p.order : p.id}
                              </span>
                              <h4 className="font-display font-bold text-white text-sm truncate">{p.title}</h4>
                              {isFeatured ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Featured on Home
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                                  Standard
                                </span>
                              )}
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {p.status || 'Delivered'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                              Client: <span className="text-white font-medium">{p.client_name}</span> &bull; Category: <span className="text-cyan-400">{p.category}</span>
                              {p.industry && <span> &bull; <span className="text-slate-300">{p.industry}</span></span>}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                              "{p.what_we_solved || p.short_description || p.description}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {/* Toggle Featured Button */}
                          <button
                            onClick={(e) => handleToggleProjectFeatured(p, e)}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
                              isFeatured
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                            }`}
                            title={isFeatured ? 'Click to unfeature from homepage' : 'Click to feature on homepage'}
                          >
                            <Star className={`h-3.5 w-3.5 ${isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                            <span className="hidden sm:inline">{isFeatured ? 'Featured' : 'Make Featured'}</span>
                          </button>

                          {/* View Case Study */}
                          <a
                            href={`/projects/${p.slug || p.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                            title="Preview Case Study Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditProject(p)}
                            className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="rounded-lg bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Module: Leadership Team CMS */}
            {activeModule === 'about' && (
              <div className="space-y-6 animate-fade-in">
                {/* Module Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-400" /> Teams & Leadership Management
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure corporate executive leadership, technical teams, specialized departments, and custom team sections.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setShowSectionManager(!showSectionManager)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        showSectionManager
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Layers className="h-4 w-4 text-cyan-400" />
                      <span>Manage Team Sections</span>
                      <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300">
                        {adminTeamSections.length}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setTeamPayload({
                          name: '',
                          position: '',
                          bio: '',
                          skills: '',
                          photo_url: '',
                          department: adminTeamSections.length > 0 ? adminTeamSections[0].id : 'founders',
                          section_title: adminTeamSections.length > 0 ? adminTeamSections[0].title : 'Executive Founders & Leadership',
                          section_description: adminTeamSections.length > 0 ? adminTeamSections[0].description : '',
                          is_new_section: false,
                          new_section_title: '',
                          new_section_description: '',
                          new_section_badge: '',
                          experience_years: '5 Years',
                          sort_order: '10',
                          is_founder: false,
                          social_linkedin: '',
                          social_github: '',
                          social_twitter: '',
                          portfolio_url: '',
                          social_links: []
                        });
                        setShowTeamForm(!showTeamForm);
                      }}
                      className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Team Member
                    </button>
                  </div>
                </div>

                {/* Team Sections / Departments Manager Drawer */}
                {showSectionManager && (
                  <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/70 p-5 space-y-5 animate-fade-in shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <Layers className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-white">Team Sections / Departments Manager</h3>
                          <p className="text-[11px] text-slate-400">
                            Create custom sections (e.g. Technical Team, AI Lab, Media Team) with unique titles, descriptions, and badges.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSectionManager(false)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                        title="Close Manager"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Section Creation / Editing Form */}
                      <form onSubmit={handleSaveSection} className="lg:col-span-5 bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FolderPlus className="h-3.5 w-3.5" />
                            {editingSection ? 'Edit Section' : 'Create New Section'}
                          </h4>
                          {editingSection && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSection(null);
                                setSectionFormPayload({ title: '', description: '', badge: '' });
                              }}
                              className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Section Title <span className="text-cyan-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Technical Team, AI Engineering, Mobile Dev"
                            value={sectionFormPayload.title}
                            onChange={(e) => setSectionFormPayload({ ...sectionFormPayload, title: e.target.value })}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Section Badge / Subtitle (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. TECHNICAL EXCELLENCE, ENGINEERING & ARCHITECTURE"
                            value={sectionFormPayload.badge}
                            onChange={(e) => setSectionFormPayload({ ...sectionFormPayload, badge: e.target.value })}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Section Description
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Describe the focus, mission, or responsibilities of this team section on the public website..."
                            value={sectionFormPayload.description}
                            onChange={(e) => setSectionFormPayload({ ...sectionFormPayload, description: e.target.value })}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="submit"
                            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 cursor-pointer transition-colors"
                          >
                            {editingSection ? 'Update Section' : '+ Add Section'}
                          </button>
                        </div>
                      </form>

                      {/* Current Sections List */}
                      <div className="lg:col-span-7 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>Current Active Sections ({adminTeamSections.length})</span>
                          <span className="text-[10px] text-slate-500">Live on public website &amp; filters</span>
                        </div>

                        {adminTeamSections.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                            No team sections defined yet. Create your first section (e.g. Technical Team) on the left.
                          </div>
                        ) : (
                          adminTeamSections.map((sec) => {
                            const memberCount = adminTeam.filter(
                              m => (m.department || '').toLowerCase() === sec.id.toLowerCase() ||
                                   (m.section_title || '').toLowerCase() === sec.title.toLowerCase()
                            ).length;

                            return (
                              <div
                                key={sec.id}
                                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="font-display font-bold text-xs text-white truncate">{sec.title}</h5>
                                    {sec.badge && (
                                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 uppercase">
                                        {sec.badge}
                                      </span>
                                    )}
                                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300">
                                      {memberCount} member{memberCount === 1 ? '' : 's'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                    {sec.description || 'No section description configured.'}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSection(sec);
                                      setSectionFormPayload({
                                        title: sec.title,
                                        description: sec.description || '',
                                        badge: sec.badge || ''
                                      });
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 cursor-pointer"
                                    title="Edit Section Details"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSection(sec.id, sec.title)}
                                    className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950 text-rose-400 cursor-pointer"
                                    title="Delete Section"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Member Add / Edit Form Modal */}
                {showTeamForm && (
                  <form onSubmit={handleCreateTeamMember} className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 space-y-5 animate-fade-in shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-cyan-400" />
                        {editingItem && editingItem.type === 'team' ? 'Edit Team Member' : 'Add Team Member'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowTeamForm(false);
                          setEditingItem(null);
                        }}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          Full Name <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe, Ali Nawaz"
                          value={teamPayload.name}
                          onChange={(e) => setTeamPayload({ ...teamPayload, name: e.target.value })}
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">
                          Professional Position / Title <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lead Technical Architect, Full-Stack Engineer, Video Producer"
                          value={teamPayload.position}
                          onChange={(e) => setTeamPayload({ ...teamPayload, position: e.target.value })}
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* TEAM SECTION ASSIGNMENT / CREATION BLOCK */}
                    <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div>
                          <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5" /> Team Section / Department Assignment
                          </label>
                          <p className="text-[11px] text-slate-400">
                            Choose which team section this member belongs to, or create a brand new section (like Technical Team) right here.
                          </p>
                        </div>

                        {/* Mode Selector Toggle */}
                        <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start sm:self-center">
                          <button
                            type="button"
                            onClick={() => setTeamPayload({ ...teamPayload, is_new_section: false })}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                              !teamPayload.is_new_section
                                ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Assign to Existing Section
                          </button>
                          <button
                            type="button"
                            onClick={() => setTeamPayload({ ...teamPayload, is_new_section: true })}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                              teamPayload.is_new_section
                                ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                                : 'text-slate-400 hover:text-cyan-400'
                            }`}
                          >
                            <Plus className="h-3 w-3" />
                            <span>Create New Section</span>
                          </button>
                        </div>
                      </div>

                      {/* Case 1: Select Existing Section */}
                      {!teamPayload.is_new_section ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-mono text-slate-400 mb-1">
                              Select Target Section
                            </label>
                            <select
                              value={teamPayload.department || 'founders'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '__CREATE_NEW__') {
                                  setTeamPayload({ ...teamPayload, is_new_section: true });
                                  return;
                                }
                                const found = adminTeamSections.find(s => s.id === val || s.title.toLowerCase() === val.toLowerCase());
                                setTeamPayload({
                                  ...teamPayload,
                                  department: val,
                                  section_title: found ? found.title : '',
                                  section_description: found ? found.description : ''
                                });
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                            >
                              {adminTeamSections.map((sec) => (
                                <option key={sec.id} value={sec.id}>
                                  {sec.title} {sec.badge ? `(${sec.badge})` : ''}
                                </option>
                              ))}

                              {/* Guarantee standard fallback options if adminTeamSections hasn't populated */}
                              {adminTeamSections.length === 0 && (
                                <>
                                  <option value="technical">Technical Team (TECHNICAL EXCELLENCE)</option>
                                  <option value="founders">Executive Founders &amp; Leadership (EXECUTIVE GOVERNANCE)</option>
                                  <option value="development">Software &amp; Systems Development</option>
                                  <option value="design">UI/UX &amp; Product Design</option>
                                  <option value="marketing">Growth &amp; Digital Marketing</option>
                                  <option value="video">Video Editing &amp; Media Production</option>
                                  <option value="social_media">Social Media &amp; Community</option>
                                  <option value="operations">Operations &amp; AI Systems</option>
                                </>
                              )}

                              <option value="__CREATE_NEW__" className="text-cyan-400 font-bold bg-slate-900">
                                ＋ + Create New Section with Title &amp; Description...
                              </option>
                            </select>
                          </div>

                          {/* Selected Section Details Preview */}
                          {(() => {
                            const curSec = adminTeamSections.find(
                              s => s.id === (teamPayload.department || '').toLowerCase() ||
                                   s.title.toLowerCase() === (teamPayload.section_title || teamPayload.department || '').toLowerCase()
                            );
                            if (!curSec) return null;
                            return (
                              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3 text-xs">
                                <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mt-0.5">
                                  <Layers className="h-3.5 w-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">{curSec.title}</span>
                                    {curSec.badge && (
                                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300">
                                        {curSec.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {curSec.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        /* Case 2: Create New Section Inline with Title, Description, and Badge */
                        <div className="p-4 rounded-xl border border-cyan-500/40 bg-slate-950/80 space-y-3 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                              Define New Team Section Details
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                              Auto-Creates Live Section
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                                Section Title <span className="text-cyan-400">*</span>
                              </label>
                              <input
                                type="text"
                                required={teamPayload.is_new_section}
                                placeholder="e.g. Technical Team, AI Lab, Security Team"
                                value={teamPayload.new_section_title}
                                onChange={(e) => setTeamPayload({ ...teamPayload, new_section_title: e.target.value })}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                                Section Badge / Category (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. TECHNICAL EXCELLENCE, INNOVATION LAB"
                                value={teamPayload.new_section_badge}
                                onChange={(e) => setTeamPayload({ ...teamPayload, new_section_badge: e.target.value })}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-slate-300 mb-1">
                              Section Description <span className="text-cyan-400">*</span>
                            </label>
                            <textarea
                              rows={2}
                              required={teamPayload.is_new_section}
                              placeholder="e.g. Core technical specialists driving infrastructure, scalable systems, and cutting-edge software architecture."
                              value={teamPayload.new_section_description}
                              onChange={(e) => setTeamPayload({ ...teamPayload, new_section_description: e.target.value })}
                              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                            />
                          </div>

                          <p className="text-[10px] text-slate-400 font-mono">
                            💡 Saving this member will automatically create this new section in the system and assign this member to it.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ImageUploadField
                        label="Photo"
                        value={teamPayload.photo_url}
                        onChange={(url) => setTeamPayload({ ...teamPayload, photo_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Years of Experience</label>
                        <input
                          type="text"
                          placeholder="e.g. 5+ Years"
                          value={teamPayload.experience_years}
                          onChange={(e) => setTeamPayload({ ...teamPayload, experience_years: e.target.value })}
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Display Sort Order</label>
                        <input
                          type="number"
                          value={teamPayload.sort_order}
                          onChange={(e) => setTeamPayload({ ...teamPayload, sort_order: e.target.value })}
                          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Key Skills (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Cloud Infrastructure, TypeScript, Distributed Systems, Python, Kubernetes"
                        value={teamPayload.skills}
                        onChange={(e) => setTeamPayload({ ...teamPayload, skills: e.target.value })}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Professional Biography</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detailed professional experience, engineering achievements, and technical background..."
                        value={teamPayload.bio}
                        onChange={(e) => setTeamPayload({ ...teamPayload, bio: e.target.value })}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                      />
                    </div>

                    {/* Dynamic Social Media Channels Section */}
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          Social &amp; Professional Links
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(teamPayload.social_links || []).length} channel(s)
                        </span>
                      </div>

                      {/* Active Channels List */}
                      {(teamPayload.social_links || []).length > 0 ? (
                        <div className="space-y-2">
                          {(teamPayload.social_links || []).map((link, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                                {link.platform}
                              </span>
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => {
                                  const updated = [...(teamPayload.social_links || [])];
                                  updated[sIdx].url = e.target.value;
                                  setTeamPayload({ ...teamPayload, social_links: updated });
                                }}
                                placeholder="https://..."
                                className="flex-1 text-xs bg-transparent border-none text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (teamPayload.social_links || []).filter((_, idx) => idx !== sIdx);
                                  setTeamPayload({ ...teamPayload, social_links: updated });
                                }}
                                className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 cursor-pointer"
                                title="Remove Channel"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] font-mono text-slate-500 italic">No social media channels added yet for this profile.</p>
                      )}

                      {/* Add Channel Controls */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 border-t border-slate-800">
                        <select
                          id="new_social_platform_select"
                          className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Twitter / X">Twitter / X</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="TikTok">TikTok</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Telegram">Telegram</option>
                          <option value="Discord">Discord</option>
                          <option value="Medium">Medium</option>
                          <option value="Portfolio">Portfolio / Website</option>
                        </select>

                        <input
                          type="text"
                          id="new_social_url_input"
                          placeholder="https://linkedin.com/in/... or URL"
                          className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none min-w-[180px]"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const platformEl = document.getElementById('new_social_platform_select') as HTMLSelectElement;
                            const urlEl = document.getElementById('new_social_url_input') as HTMLInputElement;
                            if (urlEl && urlEl.value.trim()) {
                              const newLink = { platform: platformEl.value, url: urlEl.value.trim() };
                              setTeamPayload({
                                ...teamPayload,
                                social_links: [...(teamPayload.social_links || []), newLink]
                              });
                              urlEl.value = '';
                            }
                          }}
                          className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Link</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="is_founder"
                        checked={teamPayload.is_founder}
                        onChange={(e) => setTeamPayload({ ...teamPayload, is_founder: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                      />
                      <label htmlFor="is_founder" className="text-xs font-mono text-slate-400 select-none cursor-pointer">
                        Identify as Executive Founding Member (Highlights with Founder badge)
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTeamForm(false);
                          setEditingItem(null);
                        }}
                        className="rounded-lg border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer transition-all shadow-sm"
                      >
                        {editingItem && editingItem.type === 'team' ? 'Save Changes' : 'Save & Add Member'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Section Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/60 scrollbar-none">
                  <button
                    onClick={() => setSelectedTeamSectionFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                      selectedTeamSectionFilter === 'all'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    All Members ({adminTeam.length})
                  </button>

                  {adminTeamSections.map((sec) => {
                    const count = adminTeam.filter(
                      m => (m.department || '').toLowerCase() === sec.id.toLowerCase() ||
                           (m.section_title || '').toLowerCase() === sec.title.toLowerCase()
                    ).length;

                    return (
                      <button
                        key={sec.id}
                        onClick={() => setSelectedTeamSectionFilter(sec.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
                          selectedTeamSectionFilter === sec.id
                            ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <span>{sec.title}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          selectedTeamSectionFilter === sec.id ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Team Members Grid / Cards */}
                {(() => {
                  const filteredTeam = adminTeam.filter(t => {
                    if (selectedTeamSectionFilter === 'all') return true;
                    const sec = adminTeamSections.find(s => s.id === selectedTeamSectionFilter);
                    const secTitle = sec ? sec.title.toLowerCase() : selectedTeamSectionFilter.toLowerCase();
                    return (t.department || '').toLowerCase() === selectedTeamSectionFilter.toLowerCase() ||
                           (t.section_title || '').toLowerCase() === secTitle;
                  });

                  if (filteredTeam.length === 0) {
                    return (
                      <div className="p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3">
                        <Users className="h-8 w-8 text-slate-600 mx-auto" />
                        <h4 className="font-display font-bold text-sm text-slate-300">No team members in this section</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Add members to this section by clicking "Add Team Member" above and selecting or creating a section.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 gap-3.5">
                      {filteredTeam.map((t) => {
                        const matchingSec = adminTeamSections.find(
                          s => s.id === (t.department || '').toLowerCase() ||
                               s.title.toLowerCase() === (t.section_title || t.department || '').toLowerCase()
                        );

                        return (
                          <div
                            key={t.id}
                            className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={t.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300'}
                                alt={t.name}
                                className="h-12 w-12 object-cover rounded-full border border-slate-700 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-display font-bold text-white text-sm truncate">{t.name}</h4>
                                  
                                  {/* Executive Role Identification Badges */}
                                  {(() => {
                                    const posL = (t.position || '').toLowerCase();
                                    if (posL.includes('ceo') || posL.includes('chief executive')) {
                                      return (
                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-bold flex items-center gap-1 shadow-2xs">
                                          <Crown className="h-3 w-3 text-cyan-400" /> CEO
                                        </span>
                                      );
                                    }
                                    if (posL.includes('cto') || posL.includes('chief technology')) {
                                      return (
                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-bold flex items-center gap-1 shadow-2xs">
                                          <Cpu className="h-3 w-3 text-cyan-400" /> CTO
                                        </span>
                                      );
                                    }
                                    if (posL.includes('cmo') || posL.includes('chief marketing')) {
                                      return (
                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-bold flex items-center gap-1 shadow-2xs">
                                          <Rocket className="h-3 w-3 text-cyan-400" /> CMO
                                        </span>
                                      );
                                    }
                                    if (posL.includes('coo') || posL.includes('operations & ai')) {
                                      return (
                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-bold flex items-center gap-1 shadow-2xs">
                                          <Sparkles className="h-3 w-3 text-cyan-400" /> COO
                                        </span>
                                      );
                                    }
                                    if ((t.department || '').toLowerCase().includes('tech') || posL.includes('engineer') || posL.includes('developer')) {
                                      return (
                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-bold flex items-center gap-1 shadow-2xs">
                                          <Terminal className="h-3 w-3 text-cyan-400" /> Technical
                                        </span>
                                      );
                                    }
                                    return null;
                                  })()}

                                  {t.is_founder && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold">
                                      Founder
                                    </span>
                                  )}
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
                                    {t.section_title || matchingSec?.title || (t.department ? t.department.replace('_', ' ') : 'Specialized Team')}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 truncate flex items-center gap-2 flex-wrap mt-0.5">
                                  <span>{t.position}</span>
                                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded-full shadow-2xs">
                                    <Clock className="h-3 w-3 text-cyan-400" /> {t.experience_years || '5+ Years Exp'}
                                  </span>
                                </p>
                                {t.section_description && (
                                  <p className="text-[10px] text-slate-500 truncate max-w-md">
                                    {t.section_description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                              <button
                                onClick={() => handleEditTeamMember(t)}
                                className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-cyan-400 hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                                title="Edit Team Member"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteTeamMember(t.id)}
                                className="rounded-lg bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer transition-colors"
                                title="Delete Team Member"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Module: Products CMS */}
            {activeModule === 'products' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                      <Package className="h-5 w-5 text-cyan-400" /> SaroHub Software Products CMS
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Configure SaroHub modular software systems listed in the directory catalogs</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveModule('ventures')}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <TrendingUp className="h-3.5 w-3.5 text-cyan-400" /> Ventures Portfolio
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setProductPayload({
                          title: '',
                          thumbnail_url: '',
                          features: '',
                          short_description: '',
                          description: '',
                          demo_url: '',
                          video_url: '',
                          download_url: ''
                        });
                        setShowProductForm(!showProductForm);
                      }}
                      className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Product
                    </button>
                  </div>
                </div>

                {showProductForm && (
                  <form onSubmit={handleCreateProduct} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'product' ? 'Edit Product Catalog Profile' : 'Create New Product Catalog Profile'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Product Title</label>
                        <input
                          type="text"
                          required
                          value={productPayload.title}
                          onChange={(e) => setProductPayload({ ...productPayload, title: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <ImageUploadField
                        label="Product Thumbnail Image"
                        value={productPayload.thumbnail_url}
                        onChange={(url) => setProductPayload({ ...productPayload, thumbnail_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Key Features (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="Relational logging, Auto document generator, Dynamic multi-currency pipelines"
                        value={productPayload.features}
                        onChange={(e) => setProductPayload({ ...productPayload, features: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Short Description</label>
                      <input
                        type="text"
                        required
                        value={productPayload.short_description}
                        onChange={(e) => setProductPayload({ ...productPayload, short_description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Detailed Product Copy</label>
                      <textarea
                        rows={3}
                        required
                        value={productPayload.description}
                        onChange={(e) => setProductPayload({ ...productPayload, description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Demo Live URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={productPayload.demo_url}
                          onChange={(e) => setProductPayload({ ...productPayload, demo_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Demo Embed YouTube Video ID/URL</label>
                        <input
                          type="text"
                          placeholder="https://youtube.com/embed/..."
                          value={productPayload.video_url}
                          onChange={(e) => setProductPayload({ ...productPayload, video_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Installer Download URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={productPayload.download_url}
                          onChange={(e) => setProductPayload({ ...productPayload, download_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingItem(null);
                          setProductPayload({ title: '', thumbnail_url: '', features: '', short_description: '', description: '', demo_url: '', video_url: '', download_url: '' });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'product' ? 'Save Changes' : 'Publish Product'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {adminProducts.map((pr) => (
                    <div key={pr.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img src={pr.thumbnail_url} alt={pr.title} className="h-10 w-16 object-cover rounded" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">{pr.title}</h4>
                          <p className="text-[10px] font-mono text-slate-500">{pr.slug}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(pr)}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(pr.id);
                          }}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 7: Live Support Desk Panel */}
            {activeModule === 'chats' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header Status & Availability Controller */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                      Live Chat Support Desk
                      <span className="animate-pulse block h-2 w-2 rounded-full bg-emerald-500" />
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time metadata communication matrix with corporate clients</p>
                  </div>

                  {/* Agent Availability selector */}
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 px-2">Set Status:</span>
                    {(['online', 'away', 'offline'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateAgentStatus(status)}
                        className={`text-[9px] font-mono uppercase font-bold tracking-wider rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${agentAvailability === status
                          ? status === 'online'
                            ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                            : status === 'away'
                              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                              : 'bg-slate-500 text-slate-950 font-extrabold'
                          : 'text-slate-400 hover:text-white'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropdown to look for the whole conversation of any user */}
                <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex-1 relative">
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                      Conversation Selector & Lookup
                    </label>
                    <div className="relative">
                      <select
                        value={selectedChatId || ''}
                        onChange={(e) => {
                          const id = e.target.value;
                          if (id) {
                            setSelectedChatId(id);
                            const sess = chatSessions.find(s => s.id === id);
                            if (sess) {
                              sess.agent_unread = false;
                              api.getChatSession(id);
                            }
                          } else {
                            setSelectedChatId(null);
                          }
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 appearance-none font-sans cursor-pointer pr-10"
                      >
                        <option value="">-- Select a User Conversation ({chatSessions.length} active threads) --</option>
                        {chatSessions.map((sess) => {
                          const lastMsg = sess.messages && sess.messages.length > 0 ? sess.messages[sess.messages.length - 1].text.slice(0, 30) : 'No messages';
                          return (
                            <option key={sess.id} value={sess.id}>
                              {sess.agent_unread ? '● [UNREAD] ' : ''}{sess.visitor_name} ({sess.visitor_email || sess.visitor_phone || 'No contact info'}) - {sess.messages?.length || 0} msgs - {sess.status.toUpperCase()}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {chatSessions.length > 0 && (
                    <div className="flex items-end shrink-0 pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={handleClearAllChats}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs font-mono text-rose-400 hover:bg-rose-900/60 font-semibold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
                        title="Delete and wipe all chat sessions"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Wipe All Chats
                      </button>
                    </div>
                  )}
                </div>

                {/* Chat Split Pane */}
                <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">

                  {/* Left pane: Session List */}
                  <div className="w-full lg:w-1/3 space-y-3 lg:max-h-[580px] lg:overflow-y-auto pr-1">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                        User Conversations ({chatSessions.length})
                      </span>
                    </div>

                    {chatSessions.length === 0 ? (
                      <div className="bg-slate-950/30 rounded-2xl border border-slate-900 p-8 text-center">
                        <p className="text-slate-500 text-xs">No active conversations found.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chatSessions.map((sess) => {
                          const isSelected = selectedChatId === sess.id;
                          const unread = sess.agent_unread;
                          const isClosed = sess.status === 'closed';

                          return (
                            <div
                              key={sess.id}
                              className={`w-full rounded-2xl p-4 border transition-all flex flex-col gap-2 relative ${isSelected
                                ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                                : 'bg-slate-950/50 border-slate-900/60 hover:border-slate-800'
                                }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedChatId(sess.id);
                                    sess.agent_unread = false;
                                    api.getChatSession(sess.id);
                                  }}
                                  className="text-left flex-1 min-w-0 cursor-pointer"
                                >
                                  <span className="text-xs font-bold text-white truncate block">
                                    {sess.visitor_name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-sans line-clamp-1 block mt-0.5">
                                    {sess.visitor_email || sess.visitor_phone || 'No direct contact'}
                                  </span>
                                </button>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {unread && (
                                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold uppercase animate-pulse">
                                      Unread
                                    </span>
                                  )}
                                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${isClosed ? 'bg-slate-900 text-slate-500' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                                    }`}>
                                    {sess.status}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteChatSession(sess.id);
                                    }}
                                    className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/30 transition-colors cursor-pointer"
                                    title="Delete this entire conversation"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 border-t border-slate-900/30 pt-2 mt-1 w-full">
                                <span>{sess.messages?.length || 0} messages</span>
                                <span>{new Date(sess.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right pane: Active Conversation window */}
                  <div className="w-full lg:w-2/3 glass bg-slate-950/30 border border-slate-900/60 rounded-3xl p-6 flex flex-col min-h-[450px] lg:max-h-[580px]">
                    {selectedChatId ? (
                      (() => {
                        const session = chatSessions.find(s => s.id === selectedChatId);
                        if (!session) return <p className="text-slate-500 text-xs my-auto text-center">Ticket reference missing.</p>;
                        const isClosed = session.status === 'closed';

                        return (
                          <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Chat Window Header */}
                            <div className="border-b border-slate-900/80 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div>
                                <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                                  {session.visitor_name}
                                  <span className="text-[10px] font-mono text-cyan-400 font-normal">
                                    ({session.visitor_phone || 'No phone'} &bull; {session.visitor_email || 'No email'})
                                  </span>
                                </h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Session ID: <span className="font-mono text-slate-400">{session.id}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteChatSession(session.id)}
                                  className="rounded-xl bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 text-[10px] font-mono text-rose-400 hover:bg-rose-900/60 tracking-wider font-semibold uppercase flex items-center gap-1.5 cursor-pointer transition-all"
                                  title="Delete & Clear This Entire Conversation"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete Conversation
                                </button>
                                {!isClosed && (
                                  <button
                                    onClick={() => handleCloseSession(session.id)}
                                    className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-[10px] font-mono text-amber-400 hover:bg-slate-800 tracking-wider font-semibold uppercase cursor-pointer transition-all"
                                  >
                                    Close Session
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Message Logs Area - Styled as distinct blocks */}
                            <div className="flex-1 overflow-y-auto py-5 space-y-3.5 pr-1 min-h-[250px] max-h-[350px]">
                              {session.messages && session.messages.length > 0 ? (
                                session.messages.map((msg: any) => {
                                  const isAgent = msg.sender === 'agent';
                                  const isSystem = msg.sender === 'system';
                                  const isAI = typeof msg.text === 'string' && msg.text.startsWith('[AI Assistant]');
                                  const text = isAI ? msg.text.replace('[AI Assistant]', '').trim() : msg.text;

                                  if (isSystem) {
                                    return (
                                      <div key={msg.id} className="text-center py-1">
                                        <span className="inline-block rounded-md bg-slate-900/60 px-2.5 py-1 text-[9px] font-mono text-slate-500">
                                          {msg.text}
                                        </span>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={msg.id}
                                      className={`rounded-2xl p-4 border transition-all group ${isAgent
                                        ? 'bg-slate-900/90 border-slate-800 text-slate-100 ml-6'
                                        : isAI
                                          ? 'bg-cyan-950/20 border-cyan-500/20 text-cyan-100 mr-6'
                                          : 'bg-slate-950/80 border-slate-800/80 text-white mr-6'
                                        }`}
                                    >
                                      {/* Block Header */}
                                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-900/50">
                                        <div className="flex items-center gap-2">
                                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold ${isAgent
                                            ? 'bg-amber-500 text-slate-950'
                                            : isAI
                                              ? 'bg-cyan-500 text-slate-950'
                                              : 'bg-slate-800 text-cyan-400'
                                            }`}>
                                            {isAgent ? 'OP' : isAI ? 'AI' : 'V'}
                                          </div>
                                          <span className="text-[11px] font-mono font-bold text-slate-300">
                                            {isAgent
                                              ? 'Support Operator'
                                              : isAI
                                                ? 'RinaAI Cognitive Assistant'
                                                : `${session.visitor_name} (User)`}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-mono text-slate-500">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteChatMessage(session.id, msg.id)}
                                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                                            title="Delete this message"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Block Content */}
                                      <div className="text-xs leading-relaxed font-sans whitespace-pre-wrap break-words">
                                        {text}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-center py-10 text-slate-600 text-xs font-mono">
                                  No messages logged in this conversation thread yet.
                                </div>
                              )}
                            </div>

                            {/* Action Input Footer */}
                            {!isClosed ? (
                              <form onSubmit={handleSendAgentMessage} className="border-t border-slate-900/80 pt-4 mt-auto">
                                {/* Sparkles suggest-reply bar */}
                                <div className="flex justify-between items-center gap-3 mb-3">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Operator Console</span>
                                  <button
                                    type="button"
                                    disabled={isGeneratingSuggestion}
                                    onClick={handleSuggestReply}
                                    className="text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 hover:bg-cyan-950 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                                  >
                                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
                                    {isGeneratingSuggestion ? 'Synthesizing...' : 'Suggest AI Reply'}
                                  </button>
                                </div>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={chatReplyText}
                                    onChange={e => setChatReplyText(e.target.value)}
                                    placeholder={isGeneratingSuggestion ? "Reading conversation parameters..." : "Write message as support operator..."}
                                    disabled={isSendingReply}
                                    className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!chatReplyText.trim() || isSendingReply}
                                    className="rounded-xl bg-cyan-500 text-slate-950 font-bold px-4 py-3 hover:bg-cyan-400 text-xs font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                                  >
                                    Send
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="border-t border-slate-900/80 pt-4 text-center mt-auto">
                                <span className="text-[10px] font-mono text-slate-500 uppercase">This session is closed and archived.</span>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="my-auto text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                          <MessageSquare className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold text-sm">No Active Conversation Selected</p>
                          <p className="text-slate-600 text-xs mt-1">Select a ticket from the left panel or dropdown above to inspect messages.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Module: Student Projects CMS */}
            {activeModule === 'student_projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                      SaroHub IT Academy — Student Projects CMS
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Manage and publish dynamic student capstone projects trained at our IT Center</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setStudentProjectPayload({
                        title: '',
                        student_name: '',
                        batch_course: '',
                        category: 'Full-Stack Software',
                        thumbnail_url: '',
                        images: ['', '', '', '', ''],
                        short_description: '',
                        description: '',
                        technologies: '',
                        live_url: '',
                        github_url: ''
                      });
                      setShowStudentProjectForm(!showStudentProjectForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Student Project
                  </button>
                </div>

                {showStudentProjectForm && (
                  <form onSubmit={handleCreateStudentProject} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'student_project' ? 'Edit Student Project Showcase' : 'Publish New Student Project'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Project Title</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.title}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, title: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. Smart Health Diagnostics Platform"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Student / Team Name(s)</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.student_name}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, student_name: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. Ruwan Silva & Team"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Batch / Course Title</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.batch_course}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, batch_course: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. Full-Stack Web Development - Batch 2026"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Category Domain</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.category}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, category: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. AI & Web SaaS, Cloud & IoT, Mobile Apps"
                        />
                      </div>
                    </div>

                    <div className="border border-slate-900 bg-slate-900/40 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <label className="block text-xs font-mono font-bold text-cyan-400">
                          📷 Project Showcase Images (Up to 5 Screenshots/Images)
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {(studentProjectPayload.images || []).filter(img => typeof img === 'string' && img.trim()).length} / 5 Uploaded
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[0, 1, 2, 3, 4].map((idx) => (
                          <div key={idx}>
                            <ImageUploadField
                              label={`Image ${idx + 1} ${idx === 0 ? '(Cover Thumbnail)' : '(Optional)'}`}
                              value={(studentProjectPayload.images && studentProjectPayload.images[idx]) || ''}
                              onChange={(url) => {
                                const currentImages = Array.isArray(studentProjectPayload.images) ? [...studentProjectPayload.images] : ['', '', '', '', ''];
                                currentImages[idx] = url;
                                const coverImg = currentImages[0] || studentProjectPayload.thumbnail_url;
                                setStudentProjectPayload({
                                  ...studentProjectPayload,
                                  images: currentImages,
                                  thumbnail_url: coverImg
                                });
                              }}
                              placeholder={`https://... (Image ${idx + 1} URL or Upload)`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Short Description (Summary)</label>
                      <input
                        type="text"
                        required
                        value={studentProjectPayload.short_description}
                        onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, short_description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Full Technical Architecture & Description</label>
                      <textarea
                        rows={3}
                        value={studentProjectPayload.description}
                        onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        placeholder="Detailed copy about how the students built this project..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Technologies Trained (Comma separated)</label>
                        <input
                          type="text"
                          value={studentProjectPayload.technologies}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, technologies: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="React, Node.js, Python, Tailwind"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Live Demo URL (Optional)</label>
                        <input
                          type="text"
                          value={studentProjectPayload.live_url}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, live_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">GitHub Repo Link (Optional)</label>
                        <input
                          type="text"
                          value={studentProjectPayload.github_url}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, github_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowStudentProjectForm(false);
                          setEditingItem(null);
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 cursor-pointer"
                      >
                        {editingItem && editingItem.type === 'student_project' ? 'Save Changes' : 'Publish Student Project'}
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Student Projects */}
                <div className="grid grid-cols-1 gap-4">
                  {adminStudentProjects.length === 0 ? (
                    <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-8 text-center text-slate-500 text-xs">
                      No student projects recorded yet. Click "Add Student Project" above to create one.
                    </div>
                  ) : (
                    adminStudentProjects.map((sp) => (
                      <div key={sp.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={sp.thumbnail_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=450'}
                            alt={sp.title}
                            className="h-12 w-20 object-cover rounded-lg shrink-0 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-white text-sm truncate">{sp.title}</h4>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold shrink-0">
                                {sp.category}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              Student: <strong className="text-white">{sp.student_name}</strong> &bull; {sp.batch_course}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditStudentProject(sp)}
                            className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                            title="Edit Student Project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudentProject(sp.id)}
                            className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                            title="Delete Student Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Module 8: Commercial Templates for Sale */}
            {activeModule === 'sale_projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Commercial Software Templates</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Control ready-made products and SaaS templates listed for sale</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setSaleProjectPayload({ title: '', price: '', technology: '', short_description: '', features: '', demo_url: '', video_url: '', screenshots: [], thumbnail_url: '' });
                      setShowSaleProjectForm(!showSaleProjectForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showSaleProjectForm ? 'Close Form' : 'Add Template'}
                  </button>
                </div>

                {showSaleProjectForm && (
                  <form onSubmit={handleCreateSaleProject} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit Template' : 'Add New Commercial Template'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Template Title</label>
                        <input
                          type="text"
                          value={saleProjectPayload.title}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, title: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Price (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={saleProjectPayload.price}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, price: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Technologies Used (comma separated)</label>
                        <input
                          type="text"
                          placeholder="React, Node.js, Express, MySQL"
                          value={saleProjectPayload.technology}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, technology: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <ImageUploadField
                        label="Thumbnail Image"
                        value={saleProjectPayload.thumbnail_url}
                        onChange={(url) => setSaleProjectPayload({ ...saleProjectPayload, thumbnail_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <ImageUploadField
                        label="Upload Additional Product Image"
                        value=""
                        multiple
                        onChange={(url) => setSaleProjectPayload(prev => ({ ...prev, screenshots: [...prev.screenshots, { url, description: '' }] }))}
                        placeholder="Upload from your system or paste an image URL"
                      />
                      {saleProjectPayload.screenshots.length > 0 && (
                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Uploaded Additional Images</label>
                          {saleProjectPayload.screenshots.map((image, index) => (
                            <div key={`${image.url}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-2">
                              <img src={image.url} alt={image.description || `Additional image ${index + 1}`} className="h-14 w-20 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                              <input
                                type="text"
                                value={image.description}
                                onChange={e => setSaleProjectPayload(prev => ({
                                  ...prev,
                                  screenshots: prev.screenshots.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: e.target.value } : entry)
                                }))}
                                placeholder="Image description"
                                className="min-w-0 flex-1 text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                              />
                              <button type="button" onClick={() => setSaleProjectPayload(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, entryIndex) => entryIndex !== index) }))} className="rounded-lg p-2 text-rose-400 hover:bg-rose-950/40 cursor-pointer" title="Remove additional image">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Short Description</label>
                        <input
                          type="text"
                          value={saleProjectPayload.short_description}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, short_description: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Features / Modules (comma separated list)</label>
                        <input
                          type="text"
                          placeholder="Complete Admin Dashboard, JWT Auth, Interactive Analytics"
                          value={saleProjectPayload.features}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, features: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Live Demo URL</label>
                        <input
                          type="text"
                          value={saleProjectPayload.demo_url}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, demo_url: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Product Presentation / Demo Video URL (e.g. YouTube/Loom)</label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={saleProjectPayload.video_url}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, video_url: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSaleProjectForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 cursor-pointer">
                        {editingItem ? 'Update Template' : 'Save Template'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminSaleProjects.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-white text-sm">{item.title}</h4>
                          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/20 rounded px-2 py-0.5">${item.price}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.short_description}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.technology?.map((tech: string, index: number) => (
                            <span key={index} className="text-[9px] font-mono bg-slate-900 border border-slate-800/80 rounded text-slate-500 px-1.5 py-0.5">{tech}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 border-t border-slate-900/50 pt-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingItem({ id: item.id, type: 'sale_project' });
                            setSaleProjectPayload({
                              title: item.title,
                              price: item.price.toString(),
                              technology: Array.isArray(item.technology) ? item.technology.join(', ') : '',
                              short_description: item.short_description,
                              features: Array.isArray(item.features) ? item.features.join(', ') : '',
                              demo_url: item.demo_url || '',
                              video_url: item.video_url || '',
                              screenshots: (Array.isArray(item.screenshots) ? item.screenshots : []).map((url: string, index: number) => ({
                                url,
                                description: Array.isArray(item.screenshot_descriptions) ? item.screenshot_descriptions[index] || '' : ''
                              })),
                              thumbnail_url: item.thumbnail_url || ''
                            });
                            setShowSaleProjectForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSaleProject(item.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 9: Corporate Events */}
            {activeModule === 'events' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Corporate Conferences & Hackathons</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Publish community conferences, guest masterclasses, and tech hackathons</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setEventPayload({ title: '', banner_url: '', event_date: '', venue: '', description: '', registration_link: '', form_fields: [] });
                      setShowEventForm(!showEventForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showEventForm ? 'Close Form' : 'Publish Event'}
                  </button>
                </div>

                {showEventForm && (
                  <form onSubmit={handleCreateEvent} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit Corporate Event' : 'Add New Corporate Event'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Event Title *</label>
                        <input
                          type="text"
                          value={eventPayload.title}
                          onChange={e => setEventPayload({ ...eventPayload, title: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Event Date & Time *</label>
                        <input
                          type="text"
                          placeholder="Oct 12, 2026 - 10:00 AM"
                          value={eventPayload.event_date}
                          onChange={e => setEventPayload({ ...eventPayload, event_date: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Venue Location *</label>
                        <input
                          type="text"
                          placeholder="WTC Ballroom / Online Webinar"
                          value={eventPayload.venue}
                          onChange={e => setEventPayload({ ...eventPayload, venue: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <ImageUploadField
                        label="Banner Image"
                        value={eventPayload.banner_url}
                        onChange={(url) => setEventPayload({ ...eventPayload, banner_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Event Details & Description *</label>
                        <textarea
                          rows={3}
                          value={eventPayload.description}
                          onChange={e => setEventPayload({ ...eventPayload, description: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Registration RSVP URL (Optional External Link Override)</label>
                        <input
                          type="text"
                          placeholder="Leave blank to use SaroHub's built-in dynamic RSVP form"
                          value={eventPayload.registration_link}
                          onChange={e => setEventPayload({ ...eventPayload, registration_link: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>

                      {/* DYNAMIC FORM FIELDS BUILDER SECTOR */}
                      <div className="md:col-span-2 border-t border-slate-800/80 pt-6 mt-4 space-y-4">
                        <div>
                          <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Settings className="h-4 w-4 text-cyan-400" /> Dynamic Event Registration Form Builder
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Define custom input fields that attendees must fill out when registering for this corporate event on the public events page (T-shirt sizes, food restrictions, designations etc.).
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Left Column: Form Fields List */}
                          <div className="lg:col-span-2 space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                            {(eventPayload.form_fields || []).length === 0 ? (
                              <div className="text-center py-10 bg-slate-950/25 border border-slate-900/40 rounded-xl flex flex-col items-center justify-center">
                                <Sparkles className="h-6 w-6 text-slate-600 mb-2 animate-pulse" />
                                <p className="text-xs text-slate-500 font-mono text-center px-4">No custom fields added yet. Only default Name and Email fields will be requested during registration.</p>
                              </div>
                            ) : (
                              (eventPayload.form_fields || []).map((field, idx) => (
                                <FieldSettingsEditor
                                  key={field.id}
                                  field={field}
                                  index={idx}
                                  totalFields={(eventPayload.form_fields || []).length}
                                  isExpanded={expandedFieldId === field.id}
                                  onToggleExpand={() => setExpandedFieldId(expandedFieldId === field.id ? null : field.id)}
                                  onUpdateField={(updated) => handleUpdateEventField(idx, updated)}
                                  onRemoveField={() => handleRemoveEventField(field.id)}
                                  onMoveField={(dir) => handleMoveEventField(idx, dir)}
                                  onMoveToLimit={(limit) => handleMoveEventFieldToLimit(idx, limit)}
                                />
                              ))
                            )}
                          </div>

                          {/* Right Column: Quick Create custom fields panel */}
                          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-3 self-start">
                            <h5 className="font-display font-bold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                              <Plus className="h-3.5 w-3.5 text-cyan-400" /> Create Custom Field
                            </h5>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-500 mb-1">Field Type</label>
                              <select
                                value={eventNewFieldType}
                                onChange={(e) => setEventNewFieldType(e.target.value as any)}
                                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-white"
                              >
                                {FIELD_TYPES.map(t => (
                                  <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-500 mb-1">Field Label / Title *</label>
                              <input
                                type="text"
                                placeholder="e.g., Designation, Food allergies"
                                value={eventNewFieldLabel}
                                onChange={(e) => setEventNewFieldLabel(e.target.value)}
                                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-500 mb-1">Placeholder (Optional)</label>
                              <input
                                type="text"
                                placeholder="e.g., Enter your details..."
                                value={eventNewFieldPlaceholder}
                                onChange={(e) => setEventNewFieldPlaceholder(e.target.value)}
                                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              />
                            </div>

                            {['dropdown', 'radio', 'checkbox_multi', 'multi_select'].includes(eventNewFieldType) && (
                              <div>
                                <label className="block text-[9px] font-mono text-cyan-400 mb-1 font-bold">Choices (Comma-separated) *</label>
                                <input
                                  type="text"
                                  placeholder="e.g., Choice A, Choice B, Choice C"
                                  value={eventNewFieldOptions}
                                  onChange={(e) => setEventNewFieldOptions(e.target.value)}
                                  className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="checkbox"
                                id="event_field_req"
                                checked={eventNewFieldRequired}
                                onChange={(e) => setEventNewFieldRequired(e.target.checked)}
                                className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                              />
                              <label htmlFor="event_field_req" className="text-[10px] font-mono text-slate-400 cursor-pointer select-none">
                                Mandatory input field
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddEventField}
                              className="w-full mt-2 rounded bg-slate-850 hover:bg-slate-700 border border-slate-750 text-slate-200 py-2 text-xs font-mono font-bold transition-all cursor-pointer"
                            >
                              + Append Field
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-850/60">
                      <button
                        type="button"
                        onClick={() => setShowEventForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
                      >
                        {editingItem ? 'Save Changes' : 'Publish Event'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminEvents.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between animate-fade-in">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display font-bold text-white text-sm">{item.title}</h4>
                          {item.form_fields && item.form_fields.length > 0 && (
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/40 shrink-0">
                              Custom Form: {item.form_fields.length} fields
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5 mt-3">
                          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-cyan-400" /> {item.event_date}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" /> {item.venue}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex justify-end gap-2 border-t border-slate-900/50 pt-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingItem({ id: item.id, type: 'event' });
                            setEventPayload({
                              title: item.title,
                              banner_url: item.banner_url || '',
                              event_date: item.event_date,
                              venue: item.venue,
                              description: item.description,
                              registration_link: item.registration_link || '',
                              form_fields: item.form_fields || []
                            });
                            setShowEventForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                          title="Edit Event & Form Fields"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(item.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 10: Careers */}
            {activeModule === 'careers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Job Openings &amp; Vacancy Management</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Publish and manage career postings with dynamic live sync to the public Careers portal</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setCareerPayload({
                        position: '',
                        department: '',
                        salary: '',
                        experience: '',
                        job_type: 'Full-Time',
                        location: 'Hybrid / Onsite',
                        skills: '',
                        description: '',
                        banner_url: '',
                        is_active: true
                      });
                      setShowCareerForm(!showCareerForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)] hover:bg-cyan-400 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> {showCareerForm ? 'Close Form' : 'Publish Job Opening'}
                  </button>
                </div>

                {showCareerForm && (
                  <form onSubmit={handleCreateCareer} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit Job Opening' : 'Add New Job Opening'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Job Position Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Full-Stack Engineer"
                          value={careerPayload.position}
                          onChange={e => setCareerPayload({ ...careerPayload, position: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Department Name *</label>
                        <input
                          type="text"
                          placeholder="R&D, CyberSec, Enterprise Engineering"
                          value={careerPayload.department}
                          onChange={e => setCareerPayload({ ...careerPayload, department: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Job Type / Commitment *</label>
                        <select
                          value={careerPayload.job_type || 'Full-Time'}
                          onChange={e => setCareerPayload({ ...careerPayload, job_type: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contract / Project">Contract / Project</option>
                          <option value="Internship">Internship</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Work Location *</label>
                        <input
                          type="text"
                          placeholder="e.g. Colombo HQ / Hybrid"
                          value={careerPayload.location || ''}
                          onChange={e => setCareerPayload({ ...careerPayload, location: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Salary Range / Compensation</label>
                        <input
                          type="text"
                          placeholder="Rs. 150,000 - Rs. 250,000 LKR / negotiable"
                          value={careerPayload.salary}
                          onChange={e => setCareerPayload({ ...careerPayload, salary: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Experience Target</label>
                        <input
                          type="text"
                          placeholder="3+ Years, Mid-Senior"
                          value={careerPayload.experience}
                          onChange={e => setCareerPayload({ ...careerPayload, experience: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Required Skills (comma separated list)</label>
                        <input
                          type="text"
                          placeholder="React, TypeScript, AWS, Next.js, Docker"
                          value={careerPayload.skills}
                          onChange={e => setCareerPayload({ ...careerPayload, skills: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Job Description &amp; Responsibilities *</label>
                        <textarea
                          rows={4}
                          value={careerPayload.description}
                          onChange={e => setCareerPayload({ ...careerPayload, description: e.target.value })}
                          required
                          placeholder="Describe the responsibilities, project scope, qualifications and expectations..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          Banner Image <span className="text-slate-600">(Upload from system OR enter image URL link)</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/... or paste image URL link"
                            value={careerPayload.banner_url}
                            onChange={e => setCareerPayload({ ...careerPayload, banner_url: e.target.value })}
                            className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                          />
                          <label className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 px-4 py-3 text-xs font-mono text-cyan-400 cursor-pointer transition-colors">
                            <Plus className="h-4 w-4" />
                            <span>Upload from System</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setCareerPayload(prev => ({ ...prev, banner_url: reader.result as string }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {careerPayload.banner_url && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 relative group max-h-40">
                            <img src={careerPayload.banner_url} alt="Banner preview" className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <button
                              type="button"
                              onClick={() => setCareerPayload({ ...careerPayload, banner_url: '' })}
                              className="absolute top-2 right-2 rounded-lg bg-rose-950/80 text-rose-400 px-2.5 py-1 text-xs font-mono border border-rose-800 hover:bg-rose-900 cursor-pointer"
                            >
                              Remove Banner
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="jobActive"
                          checked={careerPayload.is_active}
                          onChange={e => setCareerPayload({ ...careerPayload, is_active: e.target.checked })}
                          className="rounded bg-slate-950 border-slate-800 text-cyan-500 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="jobActive" className="text-xs font-mono text-slate-300 select-none cursor-pointer">
                          Active vacancy (displayed on public Careers page and accepts applicant CVs)
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCareerForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer hover:bg-cyan-400 transition-colors"
                      >
                        {editingItem ? 'Save Changes' : 'Publish Job Opening'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminCareers.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between hover:border-slate-800 transition-colors">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-display font-bold text-white text-base">{item.position}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-mono text-slate-400">{item.department}</span>
                              <span className="text-slate-700">&bull;</span>
                              <span className="text-[10px] font-mono text-cyan-400 font-semibold">{item.job_type || 'Full-Time'}</span>
                              <span className="text-slate-700">&bull;</span>
                              <span className="text-[10px] font-mono text-slate-400">{item.location || 'Hybrid / Onsite'}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleCareerStatus(item)}
                            title="Click to toggle status"
                            className={`text-[10px] font-mono tracking-wider font-extrabold uppercase rounded px-2.5 py-1 border transition-colors cursor-pointer shrink-0 ${item.is_active !== false
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60'
                              : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:bg-slate-900'
                              }`}
                          >
                            {item.is_active !== false ? '● Active' : '○ Draft'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-900/40 rounded-xl border border-slate-900 p-3 text-[11px] font-mono text-slate-400">
                          <div>
                            <span className="block text-[8px] uppercase text-slate-600 tracking-wider">Salary</span>
                            {item.salary || 'Negotiable'}
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-slate-600 tracking-wider">Experience</span>
                            {item.experience || 'Not specified'}
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {Array.isArray(item.skills) ? item.skills.map((skill: string, index: number) => (
                            <span key={index} className="text-[9px] font-mono bg-slate-900 border border-slate-800/80 rounded text-slate-400 px-1.5 py-0.5">{skill}</span>
                          )) : null}
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-900/50 pt-4 mt-4">
                        <span className="text-[10px] font-mono text-slate-600">ID #{item.id}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingItem({ id: item.id, type: 'career' });
                              setCareerPayload({
                                position: item.position,
                                department: item.department,
                                salary: item.salary,
                                experience: item.experience,
                                job_type: item.job_type || 'Full-Time',
                                location: item.location || 'Hybrid / Onsite',
                                skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || ''),
                                description: item.description,
                                banner_url: item.banner_url || '',
                                is_active: item.is_active !== false
                              });
                              setShowCareerForm(true);
                            }}
                            className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                            title="Edit Job Opening"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCareer(item.id)}
                            className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                            title="Delete Job Opening"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 11: FAQs */}
            {activeModule === 'faqs' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">FAQs Knowledgebase CMS</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Maintain frequent corporate services questions and answers</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setFaqPayload({ category: 'General', question: '', answer: '' });
                      setShowFAQForm(!showFAQForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showFAQForm ? 'Close Form' : 'Add FAQ'}
                  </button>
                </div>

                {showFAQForm && (
                  <form onSubmit={handleCreateFAQ} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit FAQ Entry' : 'Add New FAQ Entry'}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">FAQ Category</label>
                        <input
                          type="text"
                          placeholder="General, Custom Development, Pricing, Integration"
                          value={faqPayload.category}
                          onChange={e => setFaqPayload({ ...faqPayload, category: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Question Formulation</label>
                        <input
                          type="text"
                          value={faqPayload.question}
                          onChange={e => setFaqPayload({ ...faqPayload, question: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Corporate Response / Answer</label>
                        <textarea
                          rows={4}
                          value={faqPayload.answer}
                          onChange={e => setFaqPayload({ ...faqPayload, answer: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowFAQForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
                      >
                        {editingItem ? 'Save Changes' : 'Submit FAQ'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {adminFAQs.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <span className="inline-block text-[9px] font-mono uppercase bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded px-2 py-0.5 mb-2 font-bold tracking-wider">{item.category}</span>
                        <h4 className="font-display font-bold text-white text-sm">{item.question}</h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.answer}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingItem({ id: item.id, type: 'faq' });
                            setFaqPayload({
                              category: item.category,
                              question: item.question,
                              answer: item.answer
                            });
                            setShowFAQForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFAQ(item.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 12: SEO Configurations */}
            {activeModule === 'seo' && (
              <AdminSEOModule
                adminSEO={adminSEO}
                onRefresh={loadAllAdminData}
                setAdminAlert={setAdminAlert}
                setDeleteConfirm={setDeleteConfirm}
              />
            )}

            {/* Module: Trust, IP Guarantee & Engagement Models CMS */}
            {activeModule === 'trust' && (
              <div className="space-y-6 animate-fade-in">
                <AdminTrustModule />
              </div>
            )}

            {/* Module: Company Gallery */}
            {activeModule === 'gallery' && (
              <div className="space-y-6 animate-fade-in">
                <AdminGalleryModule />
              </div>
            )}

            {/* Module 13: Newsletter Subscribers */}
            {activeModule === 'newsletter' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <h2 className="font-display text-xl font-bold text-white">Newsletter Subscriptions Matrix</h2>
                  <p className="text-xs text-slate-500 mt-0.5">View weekly technical research paper subscribers</p>
                </div>

                <div className="glass rounded-2xl border border-slate-900 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-900 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                        <th className="p-4">Subscriber ID</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Subscription Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {adminNewsletter.length > 0 ? (
                        adminNewsletter.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-900/10">
                            <td className="p-4 font-mono text-[10px] text-slate-500">#SUB-{1000 + sub.id}</td>
                            <td className="p-4 font-mono text-white">{sub.email}</td>
                            <td className="p-4 text-slate-400">{new Date(sub.subscribed_at).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                            <td className="p-4">
                              <span className="inline-block text-[8px] font-mono font-extrabold uppercase bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded px-1.5 py-0.5">ACTIVE</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs">No active newsletter subscription profiles recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Module: Partners & Investors */}
            {activeModule === 'partners' && (
              <div className="animate-fade-in">
                <AdminPartnersModule onNotify={(title, message) => setAdminAlert({ title, message })} />
              </div>
            )}

            {/* Module 14: System Settings */}
            {activeModule === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <h2 className="font-display text-xl font-bold text-white">Enterprise System Settings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Synchronize corporate addresses, secure support emails, and manage administrator credentials</p>
                </div>

                {/* Profile Setting Form */}
                <form onSubmit={handleUpdateProfile} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm">Administrator Profile Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Admin Username</label>
                      <input
                        type="text"
                        value={profileUsername}
                        onChange={e => setProfileUsername(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileFullName}
                        onChange={e => setProfileFullName(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={e => setProfileEmail(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Biography</label>
                      <input
                        type="text"
                        value={profileBio}
                        onChange={e => setProfileBio(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>

                {/* Security Credentials Form */}
                <form onSubmit={handleChangePassword} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm">Security & Access Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    >
                      Change Password
                    </button>
                  </div>
                </form>

                <form onSubmit={handleUpdateSettings} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-6">

                  {/* ── Hero Section Settings ── */}
                  <div>
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
                      Hero Section Text &amp; Actions
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Controls the positioning badge, main heading, gradient accent word, description, typing phrases, CTA buttons, and pillars on the homepage hero.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Hero Top Positioning Badge</label>
                        <input
                          type="text"
                          value={heroBadge}
                          onChange={e => setHeroBadge(e.target.value)}
                          placeholder="Full-Stack Technology Studio & Venture Partner"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Hero Main Heading</label>
                        <input
                          type="text"
                          value={heroHeading}
                          onChange={e => setHeroHeading(e.target.value)}
                          placeholder="Engineering High-Impact Digital Solutions &"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Gradient Accent Word / Phrase</label>
                        <input
                          type="text"
                          value={heroHeadingAccent}
                          onChange={e => setHeroHeadingAccent(e.target.value)}
                          placeholder="Scalable Tech Ventures."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Hero Supporting Description</label>
                        <textarea
                          rows={3}
                          value={heroDescription}
                          onChange={e => setHeroDescription(e.target.value)}
                          placeholder="Whether you need a dedicated engineering team to build your next web app, AI automation, and marketing pipeline, or a technical partner to co-build scalable B2B products and MVPs from scratch — SaroHub delivers end-to-end technology that drives growth."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Rotating Typed Phrases (One per line or JSON Array)</label>
                        <textarea
                          rows={3}
                          value={heroTypedPhrases}
                          onChange={e => setHeroTypedPhrases(e.target.value)}
                          placeholder={"Custom Web & Mobile Apps\nAI Automations & Enterprise ERPs\nRapid MVP Development for Startups\nStrategic B2B Technology Partnerships\nPerformance Growth & Digital Marketing"}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-500/40"
                        />
                        <p className="text-[9px] text-slate-500 mt-1">Enter one phrase per line, or enter a JSON array. Leave empty to use defaults.</p>
                      </div>

                      {/* Hero CTAs */}
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Primary Button Text</label>
                        <input
                          type="text"
                          value={heroPrimaryCtaText}
                          onChange={e => setHeroPrimaryCtaText(e.target.value)}
                          placeholder="Hire Us for a Project"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Primary Button Link</label>
                        <input
                          type="text"
                          value={heroPrimaryCtaLink}
                          onChange={e => setHeroPrimaryCtaLink(e.target.value)}
                          placeholder="/contact"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Secondary Button Text</label>
                        <input
                          type="text"
                          value={heroSecondaryCtaText}
                          onChange={e => setHeroSecondaryCtaText(e.target.value)}
                          placeholder="B2B Partnerships & Ventures"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Secondary Button Link</label>
                        <input
                          type="text"
                          value={heroSecondaryCtaLink}
                          onChange={e => setHeroSecondaryCtaLink(e.target.value)}
                          placeholder="/partnerships"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>

                      {/* Hero Bottom 3 Pillars */}
                      <div className="md:col-span-2 pt-2">
                        <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Hero Bottom 3 Pillars</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Pillar 1</span>
                            <input
                              type="text"
                              value={heroPillar1Title}
                              onChange={e => setHeroPillar1Title(e.target.value)}
                              placeholder="Client Services"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                            <input
                              type="text"
                              value={heroPillar1Sub}
                              onChange={e => setHeroPillar1Sub(e.target.value)}
                              placeholder="Web, Mobile & AI"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Pillar 2</span>
                            <input
                              type="text"
                              value={heroPillar2Title}
                              onChange={e => setHeroPillar2Title(e.target.value)}
                              placeholder="B2B Partnerships"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                            <input
                              type="text"
                              value={heroPillar2Sub}
                              onChange={e => setHeroPillar2Sub(e.target.value)}
                              placeholder="Startups & MVPs"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Pillar 3</span>
                            <input
                              type="text"
                              value={heroPillar3Title}
                              onChange={e => setHeroPillar3Title(e.target.value)}
                              placeholder="Growth & Scale"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                            <input
                              type="text"
                              value={heroPillar3Sub}
                              onChange={e => setHeroPillar3Sub(e.target.value)}
                              placeholder="SEO, Ads & Marketing"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── What We Do (Client Services & B2B Partnerships) ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                      What We Do Section (Client Services &amp; Partnerships)
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Manage the header, descriptions, bullet highlights, and action buttons for the three core business offerings on the homepage.</p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Section Eyebrow Badge</label>
                          <input
                            type="text"
                            value={whatWeDoBadge}
                            onChange={e => setWhatWeDoBadge(e.target.value)}
                            placeholder="Two Core Engines • One Strategic Partner"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Section Main Heading</label>
                          <input
                            type="text"
                            value={whatWeDoHeading}
                            onChange={e => setWhatWeDoHeading(e.target.value)}
                            placeholder="Client Engineering & B2B Ventures"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Section Subtitle / Description</label>
                          <textarea
                            rows={2}
                            value={whatWeDoSubtext}
                            onChange={e => setWhatWeDoSubtext(e.target.value)}
                            placeholder="We provide full-lifecycle engineering services for businesses needing reliable websites, software, mobile apps, AI automations, and growth marketing..."
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                      </div>

                      {/* Pillar 1: Client Services */}
                      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 font-mono uppercase">
                            Pillar 1: Client Engineering Services (Direct Contracting)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Pillar Title</label>
                            <input
                              type="text"
                              value={whatWeDoP1Title}
                              onChange={e => setWhatWeDoP1Title(e.target.value)}
                              placeholder="Client Engineering Services"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Badge Tag</label>
                            <input
                              type="text"
                              value={whatWeDoP1Badge}
                              onChange={e => setWhatWeDoP1Badge(e.target.value)}
                              placeholder="Direct Contracting"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={whatWeDoP1Desc}
                              onChange={e => setWhatWeDoP1Desc(e.target.value)}
                              placeholder="We design, engineer, and deploy high-performance websites..."
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Key Highlights / Bullets (One per line)</label>
                            <textarea
                              rows={3}
                              value={whatWeDoP1Highlights}
                              onChange={e => setWhatWeDoP1Highlights(e.target.value)}
                              placeholder={"Custom Websites & Web Applications\nCross-Platform Mobile Apps (iOS & Android)\nCustom Software, ERPs & AI Automation\nSEO, Paid Ads & Performance Marketing"}
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Button Text</label>
                            <input
                              type="text"
                              value={whatWeDoP1CtaText}
                              onChange={e => setWhatWeDoP1CtaText(e.target.value)}
                              placeholder="Hire Us for a Project"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Button Link</label>
                            <input
                              type="text"
                              value={whatWeDoP1CtaLink}
                              onChange={e => setWhatWeDoP1CtaLink(e.target.value)}
                              placeholder="/contact"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pillar 2: B2B Partnerships */}
                      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono uppercase">
                            Pillar 2: B2B &amp; Startup Partnerships (Co-Building)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Pillar Title</label>
                            <input
                              type="text"
                              value={whatWeDoP2Title}
                              onChange={e => setWhatWeDoP2Title(e.target.value)}
                              placeholder="B2B & Startup Partnerships"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Badge Tag</label>
                            <input
                              type="text"
                              value={whatWeDoP2Badge}
                              onChange={e => setWhatWeDoP2Badge(e.target.value)}
                              placeholder="Co-Building & Scale"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={whatWeDoP2Desc}
                              onChange={e => setWhatWeDoP2Desc(e.target.value)}
                              placeholder="We partner with non-technical founders, agencies, and enterprise leaders..."
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Key Highlights / Bullets (One per line)</label>
                            <textarea
                              rows={3}
                              value={whatWeDoP2Highlights}
                              onChange={e => setWhatWeDoP2Highlights(e.target.value)}
                              placeholder={"Rapid MVP Development in 4–8 Weeks\nFractional CTO & Technical Arm for Startups\nWhite-Label Engineering for Agencies\nJoint Ventures & Strategic Co-Development"}
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Button Text</label>
                            <input
                              type="text"
                              value={whatWeDoP2CtaText}
                              onChange={e => setWhatWeDoP2CtaText(e.target.value)}
                              placeholder="Discuss a B2B Partnership"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Button Link</label>
                            <input
                              type="text"
                              value={whatWeDoP2CtaLink}
                              onChange={e => setWhatWeDoP2CtaLink(e.target.value)}
                              placeholder="/partnerships"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pillar 3: Proprietary Products */}
                      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 font-mono uppercase">
                            Pillar 3: Proprietary Tech Products (Ventures)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Pillar Title</label>
                            <input
                              type="text"
                              value={whatWeDoP3Title}
                              onChange={e => setWhatWeDoP3Title(e.target.value)}
                              placeholder="Proprietary Tech Products"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Badge Tag</label>
                            <input
                              type="text"
                              value={whatWeDoP3Badge}
                              onChange={e => setWhatWeDoP3Badge(e.target.value)}
                              placeholder="Our Own Ventures"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={whatWeDoP3Desc}
                              onChange={e => setWhatWeDoP3Desc(e.target.value)}
                              placeholder="We engineer, incubate, and scale our own software products..."
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Key Highlights / Bullets (One per line)</label>
                            <textarea
                              rows={3}
                              value={whatWeDoP3Highlights}
                              onChange={e => setWhatWeDoP3Highlights(e.target.value)}
                              placeholder={"Alin316 EdTech & School Management Ecosystem\nSaroHub Sentinel & Operational ERP Platforms\nTested, enterprise-grade cloud architectures\nReady-to-deploy modules & B2B licensing"}
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Button Text</label>
                            <input
                              type="text"
                              value={whatWeDoP3CtaText}
                              onChange={e => setWhatWeDoP3CtaText(e.target.value)}
                              placeholder="Explore Our Ventures"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Button Link</label>
                            <input
                              type="text"
                              value={whatWeDoP3CtaLink}
                              onChange={e => setWhatWeDoP3CtaLink(e.target.value)}
                              placeholder="/ventures"
                              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Call To Action (CTA) Banner Settings ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-violet-400" />
                      Bottom Call-To-Action (CTA) Banner
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Controls the headline, descriptive text, and 3 action buttons on the prominent bottom banner of the website.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CTA Headline</label>
                        <input
                          type="text"
                          value={ctaHeading}
                          onChange={e => setCtaHeading(e.target.value)}
                          placeholder="Have an idea or a business challenge?"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CTA Description / Subtext</label>
                        <textarea
                          rows={2}
                          value={ctaSubtext}
                          onChange={e => setCtaSubtext(e.target.value)}
                          placeholder="Let's build something meaningful together. Whether you are launching a new product, scaling a business system, or exploring a technology partnership."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Primary Button Text</label>
                        <input
                          type="text"
                          value={ctaPrimaryBtn}
                          onChange={e => setCtaPrimaryBtn(e.target.value)}
                          placeholder="Book Discovery Call"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Primary Button Link</label>
                        <input
                          type="text"
                          value={ctaPrimaryLink}
                          onChange={e => setCtaPrimaryLink(e.target.value)}
                          placeholder="/book"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Secondary Button Text</label>
                        <input
                          type="text"
                          value={ctaSecondaryBtn}
                          onChange={e => setCtaSecondaryBtn(e.target.value)}
                          placeholder="Calculate Scope & Cost"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Secondary Button Link</label>
                        <input
                          type="text"
                          value={ctaSecondaryLink}
                          onChange={e => setCtaSecondaryLink(e.target.value)}
                          placeholder="/estimate"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Tertiary Button Text</label>
                        <input
                          type="text"
                          value={ctaTertiaryBtn}
                          onChange={e => setCtaTertiaryBtn(e.target.value)}
                          placeholder="Executive Deck (PDF)"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Tertiary Button Link</label>
                        <input
                          type="text"
                          value={ctaTertiaryLink}
                          onChange={e => setCtaTertiaryLink(e.target.value)}
                          placeholder="/capabilities"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Company Overview / Mission / Vision ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                      Company Overview, Mission &amp; Vision
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Text shown in the "Company Overview" section on the homepage and about page, including mission and vision card text.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Overview Section Heading</label>
                        <input
                          type="text"
                          value={overviewTitle}
                          onChange={e => setOverviewTitle(e.target.value)}
                          placeholder="We Turn Ideas Into Ventures."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Overview Tagline / Sub-caption</label>
                        <input
                          type="text"
                          value={overviewTagline}
                          onChange={e => setOverviewTagline(e.target.value)}
                          placeholder="Founded in Gilgit-Baltistan, Pakistan."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Overview Description Paragraph</label>
                        <textarea
                          rows={3}
                          value={overviewDescription}
                          onChange={e => setOverviewDescription(e.target.value)}
                          placeholder="SaroHub Technologies is an entrepreneurship-driven technology company..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Our Mission Statement</label>
                        <textarea
                          rows={3}
                          value={missionText}
                          onChange={e => setMissionText(e.target.value)}
                          placeholder="To turn ambition into ventures by combining entrepreneurship, technology, AI..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Our Vision Statement</label>
                        <textarea
                          rows={3}
                          value={visionText}
                          onChange={e => setVisionText(e.target.value)}
                          placeholder="To become a global force in venture creation..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Why Choose Us ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                      Why Choose Us Section
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Controls the heading, subtitle, and all 4 reason cards in the "Why Build With SaroHub?" section.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Section Heading</label>
                        <input
                          type="text"
                          value={whyHeading}
                          onChange={e => setWhyHeading(e.target.value)}
                          placeholder="Why Build With SaroHub?"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Section Subtitle</label>
                        <input
                          type="text"
                          value={whySubtitle}
                          onChange={e => setWhySubtitle(e.target.value)}
                          placeholder="Combining entrepreneurial insight, product-driven engineering..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── CEO Message ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-4">CEO Message &amp; Leadership Vision Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CEO Name</label>
                        <input
                          type="text"
                          value={ceoName}
                          onChange={e => setCeoName(e.target.value)}
                          placeholder="Mehdi Hassan"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CEO Executive Title</label>
                        <input
                          type="text"
                          value={ceoTitle}
                          onChange={e => setCeoTitle(e.target.value)}
                          placeholder="CEO & Founder"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <ImageUploadField
                        label="CEO Profile Photo"
                        value={ceoPhoto}
                        onChange={(url) => setCeoPhoto(url)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CEO Statement / Message</label>
                      <textarea
                        rows={6}
                        value={ceoMessage}
                        onChange={e => setCeoMessage(e.target.value)}
                        placeholder="Write the message from the CEO..."
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>

                    {/* CEO Leadership Metrics Settings */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <label className="block text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                        Leadership Metrics &amp; Key Figures (Dynamic)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Founder Year</label>
                          <input
                            type="text"
                            value={founderYear}
                            onChange={e => setFounderYear(e.target.value)}
                            placeholder="2022"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Fully Registered Year</label>
                          <input
                            type="text"
                            value={registeredYear}
                            onChange={e => setRegisteredYear(e.target.value)}
                            placeholder="2026"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Ventures &amp; SaaS Metric</label>
                          <input
                            type="text"
                            value={ceoVenturesSaas}
                            onChange={e => setCeoVenturesSaas(e.target.value)}
                            placeholder="5+ Built"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Engineering Team Metric</label>
                          <input
                            type="text"
                            value={ceoEngineeringTeam}
                            onChange={e => setCeoEngineeringTeam(e.target.value)}
                            placeholder="20+ Minds"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-2">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Strategic Focus Metric</label>
                          <input
                            type="text"
                            value={ceoStrategicFocus}
                            onChange={e => setCeoStrategicFocus(e.target.value)}
                            placeholder="GB & Global"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-4">Corporate Physical & Electronic Address Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Registered Office Address</label>
                        <input
                          type="text"
                          value={officeAdd}
                          onChange={e => setOfficeAdd(e.target.value)}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Primary Support & Sales Email</label>
                        <input
                          type="email"
                          value={compMail}
                          onChange={e => setCompMail(e.target.value)}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          value={compPhone}
                          onChange={e => setCompPhone(e.target.value)}
                          placeholder="+92 343 0381471"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp Number</label>
                        <input
                          type="text"
                          value={compWhatsapp}
                          onChange={e => setCompWhatsapp(e.target.value)}
                          placeholder="+92 343 0381471"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Business Hours</label>
                        <input
                          type="text"
                          value={compHours}
                          onChange={e => setCompHours(e.target.value)}
                          placeholder="Monday - Friday: 9:00 AM - 6:00 PM (PKT)"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="font-display font-bold text-white text-sm mb-3">Official Social Media Channels</h4>
                    <p className="text-[10px] text-slate-500 mb-4">Enter the full URL for each social platform. Leave empty to hide the icon from public pages.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Facebook</label>
                        <input
                          type="text"
                          value={smFacebook}
                          onChange={e => setSmFacebook(e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">LinkedIn</label>
                        <input
                          type="text"
                          value={smLinkedin}
                          onChange={e => setSmLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/company/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Twitter / X</label>
                        <input
                          type="text"
                          value={smTwitter}
                          onChange={e => setSmTwitter(e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Instagram</label>
                        <input
                          type="text"
                          value={smInstagram}
                          onChange={e => setSmInstagram(e.target.value)}
                          placeholder="https://instagram.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">GitHub</label>
                        <input
                          type="text"
                          value={smGithub}
                          onChange={e => setSmGithub(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">YouTube</label>
                        <input
                          type="text"
                          value={smYoutube}
                          onChange={e => setSmYoutube(e.target.value)}
                          placeholder="https://youtube.com/@..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">TikTok</label>
                        <input
                          type="text"
                          value={smTiktok}
                          onChange={e => setSmTiktok(e.target.value)}
                          placeholder="https://tiktok.com/@..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>

                    {/* Dynamic Custom Company Channels Manager */}
                    <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Additional Dynamic Company Channels</h5>
                        <span className="text-[10px] text-slate-500 font-mono">{customCompanySocials.length} dynamic channel(s)</span>
                      </div>

                      {customCompanySocials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {customCompanySocials.map((channel, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                                {channel.platform}
                              </span>
                              <input
                                type="text"
                                value={channel.url}
                                onChange={(e) => {
                                  const updated = [...customCompanySocials];
                                  updated[cIdx].url = e.target.value;
                                  setCustomCompanySocials(updated);
                                }}
                                placeholder="https://..."
                                className="flex-1 text-xs bg-transparent border-none text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomCompanySocials(customCompanySocials.filter((_, idx) => idx !== cIdx));
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 cursor-pointer"
                                title="Delete Channel"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] font-mono text-slate-500 italic">No extra dynamic channels added. Add custom channels like WhatsApp, Telegram, Discord, Medium, Threads below.</p>
                      )}

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2">
                        <select
                          id="new_company_social_platform"
                          className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                        >
                          <option value="WhatsApp">WhatsApp Channel</option>
                          <option value="Telegram">Telegram Group</option>
                          <option value="Discord">Discord Server</option>
                          <option value="Medium">Medium Blog</option>
                          <option value="LinkedIn">LinkedIn Company</option>
                          <option value="Twitter / X">Twitter / X</option>
                          <option value="Facebook">Facebook Page</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube Channel</option>
                          <option value="Portfolio">Custom Website / Portal</option>
                        </select>

                        <input
                          type="text"
                          id="new_company_social_url"
                          placeholder="https://chat.whatsapp.com/... or URL"
                          className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none min-w-[200px]"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const platformEl = document.getElementById('new_company_social_platform') as HTMLSelectElement;
                            const urlEl = document.getElementById('new_company_social_url') as HTMLInputElement;
                            if (urlEl && urlEl.value.trim()) {
                              setCustomCompanySocials([
                                ...customCompanySocials,
                                { platform: platformEl.value, url: urlEl.value.trim() }
                              ]);
                              urlEl.value = '';
                            }
                          }}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Company Channel</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Outgoing Mail Server (SMTP) & Automated Email Delivery */}
                  <div className="pt-6 border-t border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                          <Server className="h-4 w-4 text-cyan-400" />
                          <span>Outgoing Mail Server (SMTP) &amp; Automated Email Delivery</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-2xl">
                          Configure live SMTP credentials to automatically deliver shortlist and applicant update emails directly into candidate inboxes. If left unconfigured or in Sandbox Mode, emails operate safely in simulated mode and are stored in the Mail Outbox.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleResetToSandboxMode}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1.5 border border-cyan-900/50 cursor-pointer transition-colors"
                          title="Switch to Outbox Sandbox Mode"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Use Sandbox Mode</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMailOutboxModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Open Mail Outbox</span>
                        </button>
                      </div>
                    </div>

                    {/* Google Gmail Special Authentication Guidance */}
                    <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs text-slate-300 flex items-start gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-cyan-300 font-mono text-[11px]">
                          Gmail Account Requirement: 16-Character App Password
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Google no longer allows login with regular Gmail passwords for SMTP. To deliver live emails, enable <strong>2-Step Verification</strong> in your Google Account, generate an <strong>App Password</strong> at <em>myaccount.google.com &gt; Security &gt; 2-Step Verification &gt; App Passwords</em>, and paste the 16 characters below. If you do not have an App Password, leave it blank or click <strong>&quot;Use Sandbox Mode&quot;</strong> to record all RSVPs and dispatches in the Mail Outbox.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={smtpHst}
                          onChange={e => setSmtpHst(e.target.value)}
                          placeholder="smtp.gmail.com"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={smtpPrt}
                          onChange={e => setSmtpPrt(e.target.value)}
                          placeholder="465 (SSL) or 587 (TLS)"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          Sender Display Name
                        </label>
                        <input
                          type="text"
                          value={smtpFromName}
                          onChange={e => setSmtpFromName(e.target.value)}
                          placeholder="SaroHub Talent Acquisition"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          SMTP Username / Email
                        </label>
                        <input
                          type="text"
                          value={smtpUsr}
                          onChange={e => setSmtpUsr(e.target.value)}
                          placeholder="your-email@gmail.com"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          SMTP Password / 16-Char App Password
                        </label>
                        <input
                          type="password"
                          value={smtpPwd}
                          onChange={e => setSmtpPwd(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 font-mono"
                        />
                        <p className="text-[9px] text-slate-500 mt-1 font-mono">
                          Leave blank for Sandbox Mode, or enter 16-character Google App Password.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          From / Reply-To Email
                        </label>
                        <input
                          type="email"
                          value={smtpFromEmail}
                          onChange={e => setSmtpFromEmail(e.target.value)}
                          placeholder="Leave empty to use username email"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 font-mono"
                        />
                      </div>
                    </div>

                    {/* Interactive Diagnostic Test Tool */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mt-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                            Verify Outgoing Mail Delivery (Live Diagnostic)
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Send a real-time verification email to confirm that your SMTP credentials connect and deliver properly.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={smtpTestEmail}
                            onChange={e => setSmtpTestEmail(e.target.value)}
                            placeholder="Recipient email for test..."
                            className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500/40 min-w-[220px]"
                          />
                          <button
                            type="button"
                            disabled={isTestingSmtp}
                            onClick={handleTestSmtpConnection}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                          >
                            {isTestingSmtp ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Testing...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                <span>Test Connection</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {smtpTestFeedback && (
                        <div className={`mt-3 p-3.5 rounded-xl text-xs font-mono border flex items-start gap-2.5 ${
                          smtpTestFeedback.success
                            ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300'
                            : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
                        }`}>
                          {smtpTestFeedback.success ? (
                            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                          )}
                          <div className="space-y-1 min-w-0">
                            <span className="font-bold block break-words">{smtpTestFeedback.message}</span>
                            {smtpTestFeedback.hint && (
                              <p className="text-[11px] text-slate-300 leading-relaxed font-sans mt-1 bg-black/30 p-2 rounded-lg border border-white/5">
                                {smtpTestFeedback.hint}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    >
                      Synchronize Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeModule === 'opportunities' && (
              <div className="space-y-6 animate-fade-in">
                <AdminOpportunitiesModule onNotify={(title, msg) => setAdminAlert({ title, message: msg })} />
              </div>
            )}

            {activeModule === 'ventures' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-cyan-400" /> Proprietary Ventures CMS
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Manage spin-offs, ventures in market, and product incubations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModule('products')}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Package className="h-3.5 w-3.5" /> Switch to Software Products ({adminProducts.length})
                  </button>
                </div>
                <VentureAdmin />
              </div>
            )}

          </div>

        </div>

        {/* Custom Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-display font-bold text-white text-lg mb-2">Are you absolutely sure?</h3>
              <p className="text-sm text-slate-400 mb-6">{deleteConfirm.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteConfirm.onConfirm();
                    setDeleteConfirm(null);
                  }}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Alert Modal */}
        {adminAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-display font-bold text-white text-lg mb-2">{adminAlert.title}</h3>
              <p className="text-sm text-slate-400 mb-6">{adminAlert.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setAdminAlert(null)}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Document Viewer & CV Preview Modal */}
        {docPreviewState && (
          <DocumentPreviewModal
            isOpen={docPreviewState.isOpen}
            onClose={() => setDocPreviewState(null)}
            documentUrl={docPreviewState.url}
            filename={docPreviewState.filename}
            candidateName={docPreviewState.candidateName}
            appliedPosition={docPreviewState.position}
            status={docPreviewState.status}
            onShortlist={() => {
              if (docPreviewState.id) {
                handleReviewApp(docPreviewState.id, 'shortlisted');
                setDocPreviewState(prev => prev ? { ...prev, status: 'shortlisted' } : null);
              }
            }}
          />
        )}

        {/* Global Outgoing Mail Dispatch & SMTP Monitor */}
        <MailOutboxModal
          isOpen={showMailOutboxModal}
          onClose={() => setShowMailOutboxModal(false)}
        />
      </div>
    </>
  );
}
