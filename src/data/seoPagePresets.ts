/**
 * SaroHub Technologies (Private) Limited
 * Comprehensive SEO Blueprints & Recommended Metadata Presets for Major Pages
 */

export interface PageSEOPreset {
  route: string;
  name: string;
  category: 'Core' | 'Services & Growth' | 'Insights & Community' | 'Legal';
  canonicalUrl: string;
  recommendedTitle: string;
  recommendedDescription: string;
  recommendedKeywords: string;
  ogType?: 'website' | 'article' | 'product';
}

export const MAJOR_PAGE_PRESETS: PageSEOPreset[] = [
  {
    route: 'home',
    name: 'Homepage',
    category: 'Core',
    canonicalUrl: 'https://sarohub.com/',
    recommendedTitle: 'SaroHub Technologies | Digital Products, Technology Solutions & Ventures',
    recommendedDescription: 'SaroHub Technologies builds digital products, delivers reliable technology solutions for businesses, and develops ambitious ventures. Based in Gilgit-Baltistan, Pakistan, building globally.',
    recommendedKeywords: 'SaroHub, SaroHub Technologies, SaroHub Skardu, SaroHub Pakistan, sarohub.com, custom software development Pakistan, digital products, software engineering Skardu, Gilgit-Baltistan IT company, software company Pakistan, AI solutions, web app development, mobile app development, SaaS development, tech partner',
    ogType: 'website'
  },
  {
    route: 'services',
    name: 'Software Services & Capabilities',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/services',
    recommendedTitle: 'Software Engineering & Technology Solutions | SaroHub Technologies',
    recommendedDescription: 'Explore SaroHub Technologies full suite of software development services: AI solutions, web applications, mobile apps, SaaS platforms, and enterprise business systems.',
    recommendedKeywords: 'SaroHub services, custom software development, AI solutions, mobile apps, web development, SaaS engineering, enterprise software Pakistan, cloud architecture',
    ogType: 'website'
  },
  {
    route: 'projects',
    name: 'Selected Work & Case Studies',
    category: 'Core',
    canonicalUrl: 'https://sarohub.com/projects',
    recommendedTitle: 'Selected Work & Enterprise Case Studies | SaroHub Technologies',
    recommendedDescription: 'Discover verified client case studies, enterprise software deployments, and digital products engineered by SaroHub Technologies for global enterprises.',
    recommendedKeywords: 'SaroHub case studies, client projects, enterprise web applications, software engineering portfolio, production deployments, tech case studies',
    ogType: 'website'
  },
  {
    route: 'products',
    name: 'Proprietary Products & Ventures',
    category: 'Core',
    canonicalUrl: 'https://sarohub.com/products',
    recommendedTitle: 'Proprietary Digital Products & Tech Ventures | SaroHub Technologies',
    recommendedDescription: 'Explore venture-scale digital products engineered by SaroHub Technologies: SaaS platforms, developer tools, fintech integrations, and workflow automation suites.',
    recommendedKeywords: 'SaroHub ventures, digital products, SaaS applications, proprietary technology, startup venture studio, enterprise software products',
    ogType: 'website'
  },
  {
    route: 'about',
    name: 'About SaroHub & Leadership',
    category: 'Core',
    canonicalUrl: 'https://sarohub.com/about',
    recommendedTitle: 'About SaroHub Technologies | Team, Mission & History',
    recommendedDescription: 'Learn about SaroHub Technologies: our history in Skardu, our team, our mission to turn ambitious ideas into digital products and software ventures.',
    recommendedKeywords: 'About SaroHub, SaroHub team, SaroHub founders, Skardu tech company, Gilgit Baltistan software house, SaroHub history, Mehdi Hassan CEO',
    ogType: 'website'
  },
  {
    route: 'technology',
    name: 'Technology Stack & Architecture',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/technology',
    recommendedTitle: 'Modern Tech Stack & Cloud Architecture | SaroHub Technologies',
    recommendedDescription: 'Inspect the battle-tested engineering stack behind SaroHub Technologies: TypeScript, Next.js, Node.js, PostgreSQL, Docker, and Google Cloud infrastructure.',
    recommendedKeywords: 'tech stack, TypeScript architecture, React development, PostgreSQL, Node.js backend, Docker cloud deployment, Google Cloud Platform, software architecture',
    ogType: 'website'
  },
  {
    route: 'process',
    name: 'Development Process & Methodology',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/process',
    recommendedTitle: 'Engineering Process & Delivery Lifecycle | SaroHub Technologies',
    recommendedDescription: 'See how SaroHub Technologies turns concept into verified production release through transparent sprints, rigorous automated QA, and high-availability deployment.',
    recommendedKeywords: 'agile software lifecycle, engineering delivery process, software QA, sprint planning, client collaboration, continuous delivery, enterprise SLA',
    ogType: 'website'
  },
  {
    route: 'startups',
    name: 'Startups & MVP Engineering',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/startups',
    recommendedTitle: 'Startup MVP Development & Technical Co-Founding | SaroHub Technologies',
    recommendedDescription: 'Accelerate your startup from concept to investor-ready MVP in 4 to 8 weeks with SaroHub Technologies venture engineering, scalable architecture, and seed support.',
    recommendedKeywords: 'MVP development, startup software engineering, technical partner, build MVP fast, seed stage software, venture studio Pakistan',
    ogType: 'website'
  },
  {
    route: 'industries',
    name: 'Industry Verticals & Solutions',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/industries',
    recommendedTitle: 'Industry Solutions & Enterprise Verticals | SaroHub Technologies',
    recommendedDescription: 'Domain-specific software engineering for healthcare, logistics, e-commerce, fintech, hospitality, and education tailored to strict regulatory compliance.',
    recommendedKeywords: 'industry software solutions, healthcare apps, logistics tracking software, fintech applications, edtech platforms, enterprise software verticals',
    ogType: 'website'
  },
  {
    route: 'partnerships',
    name: 'Corporate & Venture Partnerships',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/partnerships',
    recommendedTitle: 'Strategic & Venture Partnerships | SaroHub Technologies',
    recommendedDescription: 'Partner with SaroHub Technologies as a corporate co-developer, joint venture equity partner, or ecosystem investor to build high-margin digital businesses.',
    recommendedKeywords: 'tech partnerships, joint venture software, corporate co-development, equity engineering, technology investor partnerships',
    ogType: 'website'
  },
  {
    route: 'agency-partners',
    name: 'Agency & White-Label Partnerships',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/agency-partners',
    recommendedTitle: 'Agency White-Label Engineering & Dedicated Teams | SaroHub Technologies',
    recommendedDescription: 'Expand your agency capacity with white-label software engineering teams, backend architects, and rapid frontend developers under your brand.',
    recommendedKeywords: 'white-label software development, agency engineering partner, dedicated developers, staff augmentation, offshore dev team Pakistan',
    ogType: 'website'
  },
  {
    route: 'blogs',
    name: 'Research Blogs & Engineering Insights',
    category: 'Insights & Community',
    canonicalUrl: 'https://sarohub.com/blogs',
    recommendedTitle: 'Engineering Research Papers & Insights | SaroHub Technologies',
    recommendedDescription: 'Technical research papers, architecture blueprints, and engineering analyses on distributed systems, AI workflows, and software venture economics.',
    recommendedKeywords: 'tech blogs, software engineering articles, AI workflows, cloud computing architecture, tech insights Pakistan, SaroHub research',
    ogType: 'article'
  },
  {
    route: 'events',
    name: 'Corporate Conferences & Hackathons',
    category: 'Insights & Community',
    canonicalUrl: 'https://sarohub.com/events',
    recommendedTitle: 'Corporate Conferences, Summits & Hackathons | SaroHub Technologies',
    recommendedDescription: 'Participate in upcoming tech conferences, university hackathons, and corporate engineering masterclasses hosted by SaroHub Technologies.',
    recommendedKeywords: 'tech events Pakistan, Skardu hackathons, developer conferences, IT summits, programming workshops Gilgit-Baltistan',
    ogType: 'website'
  },
  {
    route: 'careers',
    name: 'Careers & Job Vacancies',
    category: 'Insights & Community',
    canonicalUrl: 'https://sarohub.com/careers',
    recommendedTitle: 'Careers & Engineering Opportunities | SaroHub Technologies',
    recommendedDescription: 'Join SaroHub Technologies engineering team. Explore open roles in full-stack TypeScript development, AI engineering, product design, and cloud infrastructure.',
    recommendedKeywords: 'SaroHub careers, software developer jobs Pakistan, remote engineer jobs, tech vacancies Skardu, TypeScript developer hiring',
    ogType: 'website'
  },
  {
    route: 'opportunities',
    name: 'Talent Scholarships & Opportunities',
    category: 'Insights & Community',
    canonicalUrl: 'https://sarohub.com/opportunities',
    recommendedTitle: 'Scholarships, Internships & Talent Portal | SaroHub Technologies',
    recommendedDescription: 'Apply for sponsored technical apprenticeships, software engineering scholarships, and remote internships at SaroHub Technologies.',
    recommendedKeywords: 'tech scholarships, software internship Pakistan, developer apprenticeships, IT training Skardu, youth tech opportunities',
    ogType: 'website'
  },
  {
    route: 'book',
    name: 'Consultation Booking Scheduler',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/book',
    recommendedTitle: 'Schedule Technical Consultation | SaroHub Technologies',
    recommendedDescription: 'Schedule a free 30-minute discovery consultation with SaroHub engineering directors. Discuss system architecture, project scope, and feasibility.',
    recommendedKeywords: 'book software consultation, technical discovery meeting, software scope discussion, hire software company, tech consultation',
    ogType: 'website'
  },
  {
    route: 'estimate',
    name: 'Interactive Project Cost Estimator',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/estimate',
    recommendedTitle: 'Interactive Project Scope & Cost Estimator | SaroHub Technologies',
    recommendedDescription: 'Calculate realistic timelines and investment ranges for your custom web app, mobile app, or SaaS platform with SaroHub interactive estimator.',
    recommendedKeywords: 'software cost calculator, project budget estimator, app development pricing, SaaS cost estimate, software price quotes',
    ogType: 'website'
  },
  {
    route: 'capabilities',
    name: 'Executive Capabilities Deck',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/capabilities',
    recommendedTitle: 'Executive Capabilities & Pitch Deck | SaroHub Technologies',
    recommendedDescription: 'Review our executive capabilities deck showcasing technology verticals, enterprise case studies, proprietary products, and SLA guarantees.',
    recommendedKeywords: 'SaroHub capabilities deck, enterprise pitch deck, software agency credentials, corporate presentation, company overview',
    ogType: 'website'
  },
  {
    route: 'marketplace',
    name: 'Production Templates & Code Assets',
    category: 'Services & Growth',
    canonicalUrl: 'https://sarohub.com/marketplace',
    recommendedTitle: 'Production Templates & Ready Software Assets | SaroHub Technologies',
    recommendedDescription: 'Acquire production-ready full-stack application blueprints, dashboard boilerplates, and SaaS starters engineered by SaroHub Technologies.',
    recommendedKeywords: 'software templates, SaaS starter kits, web app code templates, production boilerplate, developer code assets',
    ogType: 'product'
  },
  {
    route: 'student-projects',
    name: 'IT Academy Student Showcase',
    category: 'Insights & Community',
    canonicalUrl: 'https://sarohub.com/student-projects',
    recommendedTitle: 'IT Academy Graduate Projects & Showcase | SaroHub Technologies',
    recommendedDescription: 'Explore capstone full-stack web applications and AI tools built by graduates of SaroHub Technologies rigorous software engineering academy.',
    recommendedKeywords: 'student projects, coding academy portfolio, full stack capstones, tech graduates showcase, junior developer portfolio',
    ogType: 'website'
  },
  {
    route: 'contact',
    name: 'Contact & Global Inquiries',
    category: 'Core',
    canonicalUrl: 'https://sarohub.com/contact',
    recommendedTitle: 'Contact SaroHub Technologies | Global Inquiries & Office Info',
    recommendedDescription: 'Reach out to SaroHub Technologies. Connect with our corporate headquarters in Skardu, Pakistan or book a direct consultation via WhatsApp, email, or meeting.',
    recommendedKeywords: 'contact SaroHub, SaroHub phone number, SaroHub address Skardu, hire developers Pakistan, contact tech agency',
    ogType: 'website'
  },
  {
    route: 'privacy-policy',
    name: 'Privacy Policy & Data Protection',
    category: 'Legal',
    canonicalUrl: 'https://sarohub.com/privacy-policy',
    recommendedTitle: 'Privacy Policy & Data Protection | SaroHub Technologies',
    recommendedDescription: 'Read the privacy policy of SaroHub Technologies (Private) Limited regarding user privacy, data security, GDPR/CCPA alignment, and confidentiality.',
    recommendedKeywords: 'SaroHub privacy policy, data protection, privacy terms, corporate confidentiality, data security',
    ogType: 'website'
  },
  {
    route: 'terms',
    name: 'Terms & Conditions of Service',
    category: 'Legal',
    canonicalUrl: 'https://sarohub.com/terms',
    recommendedTitle: 'Terms of Service & Enterprise SLA | SaroHub Technologies',
    recommendedDescription: 'Review the contractual terms of service, intellectual property assignments, and service level agreements governing SaroHub Technologies projects.',
    recommendedKeywords: 'terms of service, software contract terms, intellectual property ownership, enterprise SLA, SaroHub legal terms',
    ogType: 'website'
  }
];

export function getPresetByRoute(route: string): PageSEOPreset | undefined {
  const normalized = route.toLowerCase().replace(/^\/+|\/+$/g, '');
  const key = !normalized ? 'home' : normalized;
  return MAJOR_PAGE_PRESETS.find(p => p.route === key);
}
