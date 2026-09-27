import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { 
  Service, Project, Product, SaleProject, Blog, BlogCategory, BlogTag, 
  Event, Career, Application, TeamMember, TeamSection, Testimonial, FAQ, 
  ContactMessage, NewsletterSubscriber, NewsletterCampaign, SEOSettings, ActivityLog,
  ChatSession, Opportunity, OpportunityApplication, EventRegistration, Partner, StudentProject, Venture,
  HeroSectionSettings, CompanyMetric, WhySaroHubItem, IndustrySolution, CaseStudy, ProcessStep, TechStackItem, SecurityStandard, CompanyTimelineItem, Lead, MediaItem,
  ConsultationBooking, ProjectEstimateQuote, CompanyGalleryItem
} from './types';

const DB_FILE = path.join(process.cwd(), 'db.json');

export const DEFAULT_TEAM_SECTIONS: TeamSection[] = [
  {
    id: 'founders',
    title: 'Executive Founders & Leadership',
    description: 'Founding partners directing corporate governance, technology research, cloud engineering, and operations from Gilgit-Baltistan.',
    badge: 'EXECUTIVE GOVERNANCE',
    sort_order: 1
  },
  {
    id: 'development',
    title: 'Software & Systems Development',
    description: 'Engineering high-throughput cloud backends, modern web applications, distributed databases, and secure APIs.',
    badge: 'ENGINEERING & ARCHITECTURE',
    sort_order: 2
  },
  {
    id: 'technical',
    title: 'Technical Team',
    description: 'Core technical specialists driving infrastructure, full-stack systems engineering, and modern scalable platforms.',
    badge: 'TECHNICAL EXCELLENCE',
    sort_order: 3
  },
  {
    id: 'design',
    title: 'UI/UX & Product Design',
    description: 'Transforming complex engineering paradigms into intuitive, ergonomic interfaces, design systems, and brand identities.',
    badge: 'DESIGN & USER EXPERIENCE',
    sort_order: 4
  },
  {
    id: 'marketing',
    title: 'Growth & Digital Marketing',
    description: 'Specialized in multi-channel paid acquisition, search visibility, high-converting funnel design, and international branding.',
    badge: 'GROWTH & ACQUISITION',
    sort_order: 5
  },
  {
    id: 'video',
    title: 'Video Editing & Media Production',
    description: 'Crafting high-impact product video demonstrations, cinematic narratives, and high-conversion social video reels.',
    badge: 'CREATIVE & CINEMATIC',
    sort_order: 6
  },
  {
    id: 'social_media',
    title: 'Social Media & Community Management',
    description: 'Cultivating digital community presence, viral social distribution, brand engagement, and real-time audience dialogue.',
    badge: 'COMMUNITY & ENGAGEMENT',
    sort_order: 7
  },
  {
    id: 'operations',
    title: 'Operations & AI Systems',
    description: 'Optimizing corporate workflows, cognitive AI integration, research ventures, and operational excellence.',
    badge: 'OPERATIONS & RESEARCH',
    sort_order: 8
  }
];

export const DEFAULT_VENTURES: Venture[] = [
  {
    id: 1,
    ventureNumber: "VENTURE 01",
    name: "Alin316",
    slug: "alin316",
    shortTitle: "Alin316",
    tagline: "Building a smarter digital future for education.",
    description: "Alin316 is a cloud-based school management and learning platform designed to bring academic, administrative, and educational workflows together in one connected ecosystem.",
    category: "EdTech • SaaS",
    status: "Expanding",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "Student and staff management",
      "Academic and class management",
      "Attendance and performance tracking",
      "Digital learning workflows",
      "School administration",
      "Communication and collaboration",
      "Dashboards and reporting",
      "Cloud-based accessibility"
    ],
    technologies: ["React", "TypeScript", "Node.js", "Cloud", "SaaS"],
    websiteUrl: "https://alin316.sarohub.com",
    demoUrl: "https://alin316-demo.sarohub.com",
    learnMoreUrl: "/ventures/alin316",
    featured: true,
    order: 1,
    published: true,
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Education & EdTech",
    problem: "Traditional educational institutions struggle with fragmented administrative systems, manual attendance tracking, and disconnected parent-teacher-student communication channels.",
    solution: "Alin316 unifies student records, academic grading, fee collection, staff scheduling, and digital learning modules into an intuitive cloud platform.",
    targetMarket: "K-12 Schools, Colleges, Academies, and Educational Networks.",
    businessModel: "SaaS Subscription (Per Student / Monthly / Annual Tier)"
  },
  {
    id: 2,
    ventureNumber: "VENTURE 02",
    name: "SaroHub Real Estate",
    slug: "sarohub-real-estate",
    shortTitle: "SaroHub Real Estate",
    tagline: "Reimagining property discovery, management, and investment.",
    description: "An AI-powered, multi-tenant real estate ecosystem designed to connect property seekers, owners, agents, agencies, and investors through a unified digital platform.",
    category: "PropTech • AI • SaaS",
    status: "In Development",
    logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "AI-powered natural-language property search",
      "Multi-tenant agency management",
      "Property listing and portfolio management",
      "Intelligent recommendations",
      "Agent and agency management",
      "Investment and property analytics",
      "Cross-border property discovery",
      "Virtual property exploration"
    ],
    technologies: ["Python", "AI APIs", "React", "TypeScript", "Node.js"],
    websiteUrl: "",
    demoUrl: "",
    learnMoreUrl: "/ventures/sarohub-real-estate",
    featured: true,
    order: 2,
    published: true,
    createdAt: "2026-03-10T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Real Estate & PropTech",
    problem: "Real estate markets suffer from slow property search, lack of verified data, fragmented agency management tools, and poor cross-border investment accessibility.",
    solution: "An intelligent PropTech platform using AI conversational search, multi-tenant agency management, and automated portfolio analytics.",
    targetMarket: "Property buyers, renters, real estate agencies, property managers, and global investors.",
    businessModel: "Agency SaaS Tiers + Featured Listing Fees"
  },
  {
    id: 3,
    ventureNumber: "VENTURE 03",
    name: "SaroHub CRM",
    slug: "sarohub-crm",
    shortTitle: "SaroHub CRM",
    tagline: "Turning customer relationships into business intelligence.",
    description: "SaroHub CRM is a business relationship and pipeline platform designed to help organizations manage customers, opportunities, workflows, transactions, and business insights from one unified system.",
    category: "SaaS • Business Technology",
    status: "In Development",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "Customer and organization management",
      "Interactive sales pipelines",
      "Relationship and activity tracking",
      "Automated document generation",
      "Revenue and transaction analytics",
      "Multi-currency reporting",
      "Business dashboards",
      "Multi-user collaboration"
    ],
    technologies: ["TypeScript", "React", "Node.js", "Cloud APIs"],
    websiteUrl: "",
    demoUrl: "",
    learnMoreUrl: "/ventures/sarohub-crm",
    featured: true,
    order: 3,
    published: true,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Business Software & CRM",
    problem: "Growing businesses struggle with complex sales funnels, scattered client communications, and lack of real-time visibility into deal pipelines.",
    solution: "SaroHub CRM simplifies lead-to-deal conversion with intuitive drag-and-drop pipelines, automated document generation, and multi-currency transaction tracking.",
    targetMarket: "B2B companies, agencies, technology firms, and service providers.",
    businessModel: "Per User / Monthly SaaS License"
  },
  {
    id: 4,
    ventureNumber: "VENTURE 04",
    name: "SaroHub Sentinel",
    slug: "sarohub-sentinel",
    shortTitle: "SaroHub Sentinel",
    tagline: "Building smarter digital infrastructure for healthcare.",
    description: "SaroHub Sentinel is a healthcare management platform designed to help clinics and healthcare organizations digitize operational workflows, manage patient information, coordinate appointments, and streamline administrative processes.",
    category: "HealthTech • SaaS",
    status: "In Development",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "Patient record management",
      "Appointment and scheduling management",
      "Doctor and staff workflows",
      "Prescription and medication records",
      "Medical billing management",
      "Insurance workflow support",
      "Operational reporting",
      "Role-based access and audit trails"
    ],
    technologies: ["TypeScript", "React", "Node.js", "Python", "Cloud Security"],
    websiteUrl: "",
    demoUrl: "",
    learnMoreUrl: "/ventures/sarohub-sentinel",
    featured: true,
    order: 4,
    published: true,
    createdAt: "2026-05-15T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Healthcare & HealthTech",
    problem: "Medical clinics and healthcare providers frequently deal with paper records, fragmented appointment scheduling, and delayed administrative billing.",
    solution: "SaroHub Sentinel provides a centralized digital workflow system for managing patient records, doctor schedules, prescriptions, and clinic operations.",
    targetMarket: "Private clinics, diagnostic centers, group practices, and healthcare providers.",
    businessModel: "Clinic Monthly Subscription"
  }
];

export interface DBState {
  admin: {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    full_name: string;
    profile_pic: string;
    bio: string;
    role: string;
  };
  seo_settings: SEOSettings[];
  services: Service[];
  projects: Project[];
  products: Product[];
  ventures: Venture[];
  sale_projects: SaleProject[];
  blog_categories: BlogCategory[];
  blog_tags: BlogTag[];
  blogs: Blog[];
  events: Event[];
  careers: Career[];
  applications: Application[];
  team_members: TeamMember[];
  team_sections?: TeamSection[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  contact_messages: ContactMessage[];
  newsletter_subscribers: NewsletterSubscriber[];
  activity_logs: ActivityLog[];
  settings: { [key: string]: string };
  chat_sessions: ChatSession[];
  opportunities: Opportunity[];
  opportunity_applications: OpportunityApplication[];
  event_registrations: EventRegistration[];
  partners: Partner[];
  student_projects: StudentProject[];
  agent_availability: 'online' | 'away' | 'offline';
  hero_settings?: HeroSectionSettings;
  company_metrics?: CompanyMetric[];
  why_sarohub_items?: WhySaroHubItem[];
  industry_solutions?: IndustrySolution[];
  case_studies?: CaseStudy[];
  process_steps?: ProcessStep[];
  tech_stack_items?: TechStackItem[];
  security_standards?: SecurityStandard[];
  company_timeline?: CompanyTimelineItem[];
  leads?: Lead[];
  media_library?: MediaItem[];
  newsletter_campaigns?: NewsletterCampaign[];
  outgoing_emails?: any[];
  consultations?: ConsultationBooking[];
  estimates?: ProjectEstimateQuote[];
  company_gallery?: CompanyGalleryItem[];
}

// Default/Initial Seed Data for Enterprise Look
const INITIAL_DB: DBState = {
  outgoing_emails: [],
  consultations: [],
  estimates: [],
  admin: {
    id: 1,
    username: 'admin',
    email: 'cyberm0101noirhat@gmail.com',
    password_hash: '$2a$10$tZ9B2z2.L.a8g.tY21tWSeQY0E2yqF5BfeHym6t.y8Xz/V10Yp7gS', // SaroHub@Admin2026!
    full_name: 'Super Admin',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
    bio: 'Primary administrator and content director for SaroHub Technologies.',
    role: 'SuperAdmin'
  },
  seo_settings: [
    {
      id: 1,
      page_route: 'home',
      meta_title: 'SaroHub Technologies | Enterprise Software Solutions',
      meta_description: 'SaroHub Technologies delivers premium software engineering, custom cloud systems, and elite cognitive solutions globally.',
      meta_keywords: 'SaroHub, enterprise tech, bespoke software, cloud databases, cognitive AI systems',
    },
    {
      id: 2,
      page_route: 'about',
      meta_title: 'Corporate Pedigree & Leadership | SaroHub Technologies',
      meta_description: 'Learn about our journey, corporate governance, engineering culture, and our elite leadership team.',
      meta_keywords: 'SaroHub, Ashan Perera, Ruwan Silva, corporate strategy, executive board',
    },
    {
      id: 3,
      page_route: 'services',
      meta_title: 'Elite Engineering Services | SaroHub Technologies',
      meta_description: 'Discover our world-class expertise spanning custom SaaS platforms, cognitive systems, enterprise architecture, and secure databases.',
      meta_keywords: 'software development, corporate APIs, microservices framework, cybersecurity audits',
    }
  ],
  services: [
    {
      id: 1,
      title: 'Enterprise Software & Cloud Systems',
      slug: 'enterprise-software-cloud',
      banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
      short_description: 'Building reliable software, scalable cloud infrastructure, and secure business systems.',
      description: 'We build secure, high-performance software and cloud systems that support growing businesses with 24/7 reliability and seamless scalability.',
      benefits: [
        '99.9% Guaranteed Uptime & High Reliability',
        'Automatic Cloud Scaling for High User Traffic',
        'Fast, Organized Database Storage and Backups',
        'End-to-End Data Security and Encryption'
      ],
      technologies: ['MySQL', 'Node.js', 'TypeScript', 'Kubernetes', 'Docker', 'Google Cloud Platform'],
      faqs: [
        { question: 'What types of database systems do you build?', answer: 'We build structured, high-speed relational databases that protect your data and handle rapid business growth.' },
        { question: 'Do you assist with cloud migration?', answer: 'Yes, we create step-by-step plans to smoothly move your existing systems and data into secure cloud environments.' }
      ],
      created_at: '2026-06-25T10:00:00Z',
      updated_at: '2026-06-25T10:00:00Z'
    },
    {
      id: 2,
      title: 'Cognitive Computing & Advanced AI',
      slug: 'cognitive-computing-ai',
      banner_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800&h=450',
      short_description: 'Custom AI solutions, smart search assistants, predictive analytics, and automated workflows.',
      description: 'Unlock business automation through modern artificial intelligence. We build custom conversational AI, automated document assistants, and smart data models tailored to your business needs.',
      benefits: [
        'Up to 85% operational time savings on routine business workflows',
        'Secure private data indexing that keeps your proprietary knowledge protected',
        'Transparent AI outputs with clear analytics and control settings',
        'Fast response times powered by dedicated private AI processing'
      ],
      technologies: ['Python', 'Gemini API', 'TensorFlow', 'PyTorch', 'Vector Databases', 'Node.js'],
      faqs: [
        { question: 'Is our company data safe and private when using AI?', answer: 'Yes. All AI solutions run on isolated, private servers with strict privacy rules ensuring your data is never shared.' },
        { question: 'Can you customize AI assistants for our team?', answer: 'Yes, we build tailored virtual assistants, automated report generators, and dashboards built around your business goals.' }
      ],
      created_at: '2026-06-26T10:00:00Z',
      updated_at: '2026-06-26T10:00:00Z'
    },
    {
      id: 3,
      title: 'Next-Gen Mobile & Web Experiences',
      slug: 'next-gen-mobile-web',
      banner_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450',
      short_description: 'Designing modern, user-friendly websites and responsive mobile applications.',
      description: 'We combine clean design with fast, dependable engineering. Our digital platforms provide intuitive navigation, rapid load speeds, and polished interactions that turn visitors into loyal customers.',
      benefits: [
        'Fast page load speeds and top accessibility ratings',
        'Smooth cross-platform performance across all devices and screen sizes',
        'Clean, intuitive layouts tailored to user needs',
        'Polished motion and interactive transitions'
      ],
      technologies: ['React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Native', 'TypeScript'],
      faqs: [
        { question: 'How do you ensure websites and apps load quickly?', answer: 'We use optimized code, clean asset caching, responsive images, and modern lightweight frameworks.' }
      ],
      created_at: '2026-06-27T10:00:00Z',
      updated_at: '2026-06-27T10:00:00Z'
    }
  ],
  projects: [
    {
      id: 1,
      title: 'Waziri Mobile',
      slug: 'waziri-mobile',
      client_name: 'Waziri Mobile',
      category: 'E-commerce / Commerce',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MERN Stack', 'Tailwind CSS'],
      short_description: 'A modern digital platform enabling smartphone and electronics buyers to explore live store inventories, detailed technical specifications, and place direct purchase inquiries.',
      description: 'Waziri Mobile is a recognized regional retailer supplying smartphones, smart devices, and consumer tech accessories across northern commercial hubs.',
      case_study: 'Created a high-speed digital catalog, multi-variant filter engine, customer inquiry conduit, and central stock management portal that eliminated customer pricing confusion and surged online purchase inquiries by 310%.',
      live_url: 'https://wazirimobile.com',
      github_url: '',
      completion_date: '2026-03-20',
      thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=675',
      created_at: '2026-06-20T10:00:00Z',
      updated_at: '2026-06-20T10:00:00Z'
    },
    {
      id: 2,
      title: 'The Crescent Resorts',
      slug: 'crescent-resorts',
      client_name: 'The Crescent Resorts',
      category: 'Hospitality',
      technologies: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Tailwind CSS'],
      short_description: 'A centralized hotel management and guest booking engine engineered to showcase luxury resort suites, manage room reservations, and eliminate booking collisions.',
      description: 'The Crescent Resorts is a premier hospitality provider operating scenic boutique hotels and retreat properties serving vacationers and corporate groups.',
      case_study: 'Built an enterprise hospitality platform combining a guest-facing direct booking engine with back-office room inventory, guest folios, and amenity scheduling, eliminating booking collisions and saving over 18% in OTA commission fees.',
      live_url: 'https://thecrescentresorts.com',
      github_url: '',
      completion_date: '2026-04-10',
      thumbnail_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200&h=675',
      created_at: '2026-06-21T10:00:00Z',
      updated_at: '2026-06-21T10:00:00Z'
    },
    {
      id: 3,
      title: 'VG4 Super Store',
      slug: 'vg4-super-store',
      client_name: 'VG4 Super Store',
      category: 'Retail',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'WebSockets', 'Tailwind CSS'],
      short_description: 'An offline-capable, multi-terminal Point of Sale (POS) and automated warehouse inventory platform engineered for rapid barcode scanning and real-time stock sync.',
      description: 'VG4 Super Store is a high-volume department retail store handling thousands of customer transactions daily across groceries, electronics, and household goods.',
      case_study: 'Engineered a multi-terminal Point of Sale (POS) system with sub-50ms barcode scanning, local offline resilience, and centralized warehouse inventory management, reducing customer queue times by 68%.',
      live_url: 'https://vg4superstore.com',
      github_url: '',
      completion_date: '2026-05-05',
      thumbnail_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200&h=675',
      created_at: '2026-06-22T10:00:00Z',
      updated_at: '2026-06-22T10:00:00Z'
    },
    {
      id: 4,
      title: 'Askoli Adventure — Adventure Tourism & Tour Booking Platform',
      slug: 'askoli-adventure',
      client_name: 'Askoli Adventure',
      category: 'Web Applications',
      technologies: ['React.js', 'Node.js', 'MySQL', 'Tailwind CSS', 'Web Applications'],
      short_description: 'A comprehensive international adventure tourism platform created for Askoli Adventure, showcasing 50+ Karakoram trekking expeditions, K2 base camp routes, interactive itineraries, and online booking requests.',
      description: 'Askoli Adventure is one of Pakistan\'s established expedition and mountain trekking operators, organizing guided treks across the Karakoram range including K2 Base Camp, Gondogoro La, Broad Peak, and the Baltoro Glacier.',
      case_study: 'Replaced manual email and PDF itineraries with an interactive expedition portal featuring 50+ curated tours, route elevations, gear checklists, and an online booking inquiry workflow that accelerated international booking responses.',
      live_url: 'https://askoliadventure.com/',
      github_url: '',
      completion_date: '2025-01-15',
      thumbnail_url: '/uploads/migrated-db_projects_3_thumbnail_url-1788627608898-bn7oa.png',
      created_at: '2026-06-20T10:00:00Z',
      updated_at: '2026-06-20T10:00:00Z'
    },
    {
      id: 5,
      title: 'BSW Foundation — Education & Social Welfare Platform',
      slug: 'bsw-foundation',
      client_name: 'BSW Foundation',
      category: 'Nonprofit / Social Impact Website',
      technologies: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Web Design'],
      short_description: 'A modern digital platform developed for Baltoro Social Welfare (BSW) Foundation to showcase its educational mission, student sponsorship programs, alumni achievements, transparent donation impact, and community development across the remote Braldo Valley of Baltistan.',
      description: 'Baltoro Social Welfare (BSW) Foundation is a non-profit organization established in 2011 to provide educational access, school infrastructure, female literacy, and student scholarships across remote mountain communities in Baltistan.',
      case_study: 'Built a transparent digital platform documenting 15+ years of grassroots educational welfare, enabling global supporters to sponsor students and verify donation impact.',
      live_url: 'https://bswfoundation.org/',
      github_url: '',
      completion_date: '2025-02-10',
      thumbnail_url: 'https://res.cloudinary.com/dgjuqqu4/image/upload/v1788625453/sarohub/alghhq8fusdgfnd78ayv.png',
      created_at: '2026-06-21T10:00:00Z',
      updated_at: '2026-06-21T10:00:00Z'
    },
    {
      id: 6,
      title: 'Diamond Architects — Architecture, Engineering & Construction Platform',
      slug: 'diamond-architects',
      client_name: 'Diamond Architect',
      category: 'Business Website',
      technologies: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Web Design'],
      short_description: 'A corporate architectural and engineering platform designed for Diamond Architects, showcasing luxury residential villas, commercial complexes, interior designs, structural engineering workflows, and client consultation bookings.',
      description: 'Diamond Architects is an established architecture, structural engineering, and construction firm delivering residential villas, commercial complexes, religious architecture, and interior design.',
      case_study: 'Transformed an offline architectural catalog into a categorized digital portfolio with 3D render showcases, 6-phase project workflows, and an architectural consultation booking portal.',
      live_url: 'https://diamondarchitects.com.pk/',
      github_url: '',
      completion_date: '2025-02-18',
      thumbnail_url: '/uploads/migrated-db_projects_5_thumbnail_url-1788627608925-415vx.png',
      created_at: '2026-06-22T10:00:00Z',
      updated_at: '2026-06-22T10:00:00Z'
    },
    {
      id: 7,
      title: 'Apex Performance & Growth — Multi-Channel Digital Marketing & SEO Campaign',
      slug: 'apex-growth-marketing',
      client_name: 'Apex Retail Group',
      category: 'Digital Marketing',
      technologies: ['Google Ads', 'Meta Ads', 'Google Analytics 4', 'Google Tag Manager', 'SEMrush', 'Technical SEO', 'Klaviyo', 'CRO'],
      short_description: 'Full-funnel performance marketing, technical SEO, and conversion optimization delivering 4.6x average ROAS.',
      description: 'Apex partnered with SaroHub to scale customer acquisition across Google and Meta paid media, repair technical SEO crawl errors, and implement server-side Conversion API tracking.',
      case_study: 'Elevated ROAS from 1.4x to 4.6x, reduced customer acquisition cost by 42%, and surged organic search traffic by 340% within 90 days.',
      live_url: 'https://apexretail.com',
      github_url: '',
      completion_date: '2026-07-10',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-07-10T10:00:00Z',
      updated_at: '2026-07-10T10:00:00Z'
    },
    {
      id: 8,
      title: 'The Crescent Hospitality — Tourism SEO & Paid Booking Acquisition Campaign',
      slug: 'crescent-digital-marketing',
      client_name: 'The Crescent Resorts',
      category: 'Digital Marketing',
      technologies: ['Local SEO', 'Google Ads', 'Meta Ads', 'Tourism Marketing', 'Google Maps'],
      short_description: 'Hyper-targeted local SEO, Google Travel PPC, and Meta video reels driving a 210% surge in direct resort bookings.',
      description: 'A multi-channel tourism acquisition campaign that decoupled the resort from expensive online travel agency commissions by dominating Google Local 3-Pack and targeted search ads.',
      case_study: 'Achieved #1 Google Local 3-Pack ranking, 3.8x campaign ROAS, and generated over 210% increase in commission-free direct reservations.',
      live_url: 'https://thecrescentresorts.com',
      github_url: '',
      completion_date: '2026-06-18',
      thumbnail_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-18T10:00:00Z',
      updated_at: '2026-06-18T10:00:00Z'
    }
  ],
  products: [
    {
      id: 1,
      title: 'SaroHub CRM & Core Pipeline',
      slug: 'sarohub-crm',
      short_description: 'Sales automation, customer tracking, and clear revenue growth reports.',
      description: 'Turn customer relationships into business growth. SaroHub CRM is an easy-to-use platform offering customer management, deal pipelines, and visual sales dashboards.',
      features: [
        'Complete customer contact and interaction history',
        'Visual drag-and-drop sales deal pipeline',
        'One-click proposal and invoice generation',
        'Real-time revenue, conversion, and performance reports'
      ],
      pricing_plans: [
        { name: 'Core Team', price: '$89', period: 'monthly', features: ['Up to 15 team members', 'Full customer directory', 'Sales deal pipeline', 'Automated daily backup'] },
        { name: 'Enterprise Grid', price: '$249', period: 'monthly', features: ['Unlimited users', 'Automated sales pipelines', 'Audit and compliance logs', 'Direct API access', '24/7 dedicated support'] }
      ],
      demo_url: 'https://crm.sarohub.com/demo',
      video_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
      download_url: 'https://sarohub.com/downloads/crm-installer.exe',
      thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-20T10:00:00Z',
      updated_at: '2026-06-20T10:00:00Z'
    },
    {
      id: 2,
      title: 'SaroHub Sentinel Hospital Manager',
      slug: 'sarohub-sentinel-hospital',
      short_description: 'Digital patient records, smart doctor appointment scheduling, and electronic prescriptions.',
      description: 'Streamline clinic and hospital workflows. SaroHub Sentinel securely manages patient records, automates appointment booking, and simplifies medical billing.',
      features: [
        'Secure, private patient health records',
        'Easy appointment scheduling for doctors and patients',
        'Digital prescription management and safety checks',
        'Integrated medical billing and invoice tracking'
      ],
      pricing_plans: [
        { name: 'Standard Clinic', price: '$179', period: 'monthly', features: ['Up to 5 doctors', 'Electronic medical records', 'Appointment scheduler', 'Standard patient reports'] },
        { name: 'Hospital Network', price: 'Custom Quote', period: 'annual', features: ['Unlimited clinical locations', 'Dedicated private cloud hosting', 'Direct insurance connections', 'Guaranteed fast search response'] }
      ],
      demo_url: 'https://sentinel.sarohub.com/demo',
      video_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
      download_url: 'https://sarohub.com/downloads/sentinel-desktop.msi',
      thumbnail_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-21T10:00:00Z',
      updated_at: '2026-06-21T10:00:00Z'
    }
  ],
  ventures: DEFAULT_VENTURES,
  sale_projects: [
    {
      id: 1,
      title: 'Secure Cloud POS System',
      price: 1499.00,
      technology: ['React.js', 'Express', 'MySQL', 'Tailwind CSS'],
      short_description: 'An offline-first, dual-receipt retail checkout gateway featuring instant client logging and multi-terminal sync.',
      features: [
        'Dual-ledger offline-first cache system prevents transaction loss',
        'Secure barcode parsing interfaces and instant receipt generation',
        'Normalized tables ensuring robust client catalog tracking',
        'Fully responsive inventory alert limits'
      ],
      demo_url: 'https://pos-sale.sarohub.com',
      thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
      screenshots: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400'
      ],
      created_at: '2026-06-25T10:00:00Z',
      updated_at: '2026-06-25T10:00:00Z'
    }
  ],
  blog_categories: [
    { id: 1, name: 'Cloud Architecture', slug: 'cloud-architecture' },
    { id: 2, name: 'Cognitive Science', slug: 'cognitive-science' },
    { id: 3, name: 'Enterprise Strategy', slug: 'enterprise-strategy' }
  ],
  blog_tags: [
    { id: 1, name: 'MySQL', slug: 'mysql' },
    { id: 2, name: 'Microservices', slug: 'microservices' },
    { id: 3, name: 'Gemini AI', slug: 'gemini-ai' },
    { id: 4, name: 'High Availability', slug: 'high-availability' }
  ],
  blogs: [
    {
      id: 1,
      title: 'Architecting Relational Systems for Five-Nines Database Uptime',
      slug: 'architecting-relational-systems',
      author_name: 'Ruwan Silva',
      author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      category_id: 1,
      featured_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450',
      content: 'In modern SaaS infrastructure, database latency and availability dictate application success. We dive into the exact methodologies we used to scale SaroHub CRM to thousands of parallel transactions: connection pooling, query indexing, and read-replica routing configurations.\n\n### Why Normalized Databases Matter\nRedundant data leads to locking and consistency failures. Sticking to 3NF standards avoids multi-record syncing errors and keeps transactional costs minimal.\n\n### Designing Indexed Fields\nBy placing selective indices on frequently filtered attributes like email, slug, and category fields, you reduce standard sequential scans into fast logarithmic seek loops. We strongly advise mapping relational foreign keys explicitly to leverage engine cascade optimization.',
      reading_time: '6 min read',
      is_featured: true,
      meta_title: 'Database Design Guide | SaroHub Technologies',
      meta_description: 'A deep architectural review of how we design scalable relational networks with zero lock delays.',
      created_at: '2026-06-28T09:12:00Z',
      tags: [1, 2, 4]
    },
    {
      id: 2,
      title: 'Leveraging Gemini Cognitive SDKs for Safe Enterprise Automations',
      slug: 'leveraging-gemini-cognitive-sdks',
      author_name: 'Ashan Perera',
      author_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150',
      category_id: 2,
      featured_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=450',
      content: 'Cognitive agent automation is no longer a luxury. By integrating the `@google/genai` TypeScript SDK on highly secure private containers, we shield core corporate knowledge while offering predictive insights and dynamic reporting metrics.',
      reading_time: '4 min read',
      is_featured: false,
      meta_title: 'Enterprise AI Strategy | SaroHub Technologies',
      meta_description: 'An executive breakdown on aligning generative model parameters to prevent business leakage.',
      created_at: '2026-06-29T14:30:00Z',
      tags: [3]
    }
  ],
  events: [
    {
      id: 1,
      title: 'SaroHub Enterprise Software Summit 2026',
      banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450',
      event_date: '2026-08-15T09:00:00Z',
      venue: 'SaroHub HQ Conference Complex, Corporate Headquarters / Hybrid Portal',
      description: 'Join our founders, chief technical officers, and enterprise software leaders as we unveil the future of relational database architecture, cognitive business intelligence systems, and distributed microservices.',
      registration_link: 'https://summit.sarohub.com/register',
      created_at: '2026-06-28T10:00:00Z'
    }
  ],
  careers: [],
  applications: [],
  team_members: [
    {
      id: 1,
      name: "Mehdi Hassan",
      position: "Founder & Chief Executive Officer (CEO)",
      photo_url: "/uploads/img-1789637457038-s7ksr1.webp",
      bio: "Leads corporate strategy, venture scaling, and global technology partnerships. Directs SaroHub's vision across proprietary products and client engineering engagements.",
      skills: ["Entrepreneurship", "Business Strategy", "Team Leadership", "Digital Transformation"],
      social_linkedin: "https://linkedin.com/company/sarohub",
      social_github: "https://github.com/sarohub",
      social_twitter: "https://twitter.com/sarohub",
      portfolio_url: "https://sarohub.com",
      experience_years: "8+ Years",
      is_founder: true,
      department: "founders",
      sort_order: 1,
      created_at: "2026-01-15T10:00:00Z",
      social_links: [
        { platform: "LinkedIn", url: "www.linkedin.com/in/mehdi-hassan-936494419" },
        { platform: "GitHub", url: "https://github.com/mehdihassan999" },
        { platform: "Twitter / X", url: "https://x.com/MehdiVentures" }
      ]
    },
    {
      id: 2,
      name: "Muhammad Nawaz",
      position: "Co-Founder & Chief Technology Officer (CTO)",
      photo_url: "/uploads/img-1789637942120-1ob4uw.webp",
      bio: "Technology leader specializing in software development, architecture, and scalable digital solutions.",
      skills: ["Cloud Architecture", "Software Engineering", "Distributed Systems", "Database Sharding", "API Integration", "Technical Leadership", "REST APIs"],
      social_linkedin: "https://linkedin.com/company/sarohub",
      social_github: "https://github.com/sarohub",
      social_twitter: "https://twitter.com/sarohub",
      portfolio_url: "",
      experience_years: "5+ Years",
      is_founder: true,
      department: "development",
      sort_order: 2,
      created_at: "2026-01-15T10:00:00Z",
      social_links: [
        { platform: "LinkedIn", url: "www.linkedin.com/in/ali-nawaz-naji" },
        { platform: "GitHub", url: "https://github.com/naji316" }
      ]
    },
    {
      id: 3,
      name: "Muhammad Kazim",
      position: "Co-Founder & Head of Operations & AI",
      photo_url: "/uploads/img-1789638412385-8co2s7.webp",
      bio: "Leads SaroHub’s overall marketing and growth while managing the marketing team and driving brand development, customer acquisition, and business expansion.",
      skills: ["Marketing Strategy", "Customer Acquisition", "Marketing Team Leadership"],
      social_linkedin: "https://linkedin.com/company/sarohub",
      social_github: "https://github.com/sarohub",
      social_twitter: "https://twitter.com/sarohub",
      portfolio_url: "",
      experience_years: "6+ Years",
      is_founder: true,
      department: "operations",
      sort_order: 3,
      created_at: "2026-01-15T10:00:00Z",
      social_links: [
        { platform: "LinkedIn", url: "https://linkedin.com/company/sarohub" },
        { platform: "GitHub", url: "https://github.com/sarohub" },
        { platform: "Twitter / X", url: "https://twitter.com/sarohub" }
      ]
    },
    {
      id: 4,
      name: "Muzammil Abbas",
      position: "Digital Marketing Specialist",
      photo_url: "/uploads/img-1789637705416-93xrmi.webp",
      bio: "Digital marketing specialist focused on paid advertising, lead generation, and online brand growth.",
      skills: ["Social Media Marketing", "Meta Ads", "Google Ads", "Lead Generation", "ROI Optimization", "Digital Marketing Strategy", "Social Media Management"],
      social_linkedin: "https://linkedin.com/company/sarohub",
      social_github: "https://github.com/sarohub",
      social_twitter: "",
      portfolio_url: "",
      experience_years: "2+ Years",
      is_founder: false,
      department: "marketing",
      sort_order: 4,
      created_at: "2026-02-01T10:00:00Z",
      social_links: [
        { platform: "LinkedIn", url: "https://www.linkedin.com/in/saro-hub-255988431" }
      ]
    }
  ],
  team_sections: DEFAULT_TEAM_SECTIONS,
  testimonials: [
    {
      id: 1,
      client_name: 'Harsha de Silva',
      client_role: 'Operations Director',
      client_company: 'Vanguard Industrial Holdings',
      client_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
      rating: 5,
      feedback: 'The team at SaroHub engineered an absolute masterpiece for us. Their relational Vanguard ERP module tracks millions of structural parts across our sites with flawless real-time indexing. Highly professional engineering partner!',
      created_at: '2026-06-26T10:00:00Z'
    }
  ],
  faqs: [
    {
      id: 1,
      category: 'General',
      question: 'What is SaroHub Technologies core specialty?',
      answer: 'We specialize in enterprise-level bespoke software, high-integrity relational SQL systems, custom cloud architectures, and secure cognitive computing models (AI) tailored to institutional business rules.',
      created_at: '2026-06-25T10:00:00Z'
    },
    {
      id: 2,
      category: 'Pricing',
      question: 'Do you offer custom service SLAs?',
      answer: 'Yes, all our major enterprise and cloud integrations are backed by custom Service Level Agreements guaranteeing up to 99.999% uptime, continuous transaction support, and active engineering help desks.',
      created_at: '2026-06-25T10:00:00Z'
    }
  ],
  contact_messages: [
    {
      id: 1,
      name: 'Rohan Perera',
      email: 'rohan@enterprise.com',
      phone: '+94 71 999 8888',
      subject: 'Cloud ERP System Integration Request',
      message: 'We are looking to migrate our database records into a unified, high-availability platform. We would like to consult with Ashan or Ruwan on the architecture.',
      is_read: false,
      created_at: '2026-06-29T16:20:00Z'
    }
  ],
  newsletter_subscribers: [
    {
      id: 1,
      email: 'news@corporate.com',
      is_active: true,
      subscribed_at: '2026-06-28T11:00:00Z'
    }
  ],
  settings: {
    company_name: 'SaroHub Technologies (Private) Limited',
    office_address: 'Ali Chowk, Roshan Electric Store Building 3rd Floor skardu Gilgit-Baltistan Pakistan',
    email: 'info@sarohub.com',
    phone: '+92 3430381473',
    whatsapp: '+92 3430381473',
    business_hours: 'Monday - Friday: 9:00 AM - 6:00 PM (PKT)',
    facebook: 'https://facebook.com/sarohub',
    linkedin: 'https://linkedin.com/company/sarohub',
    twitter: 'https://twitter.com/sarohub',
    instagram: '',
    github: '',
    youtube: '',
    tiktok: '',
    founder_year: '2022',
    registered_year: '2026',
    ceo_ventures_saas: '5+ Built',
    ceo_engineering_team: '20+ Minds',
    ceo_strategic_focus: 'GB & Global',
    // Dynamic Hero Section Settings
    hero_badge: 'Full-Stack Technology Studio & Venture Partner',
    hero_heading: 'Engineering High-Impact Digital Solutions &',
    hero_heading_accent: 'Scalable Tech Ventures.',
    hero_description: 'Whether you need a dedicated engineering team to build your next web app, AI automation, and marketing pipeline, or a technical partner to co-build scalable B2B products and MVPs from scratch — SaroHub delivers end-to-end technology that drives growth.',
    hero_typed_phrases: JSON.stringify([
      'Custom Web & Mobile Apps',
      'AI Automations & Enterprise ERPs',
      'Rapid MVP Development for Startups',
      'Strategic B2B Technology Partnerships',
      'Performance Growth & Digital Marketing'
    ]),
    hero_primary_cta_text: 'Hire Us for a Project',
    hero_primary_cta_link: '/contact',
    hero_secondary_cta_text: 'B2B Partnerships & Ventures',
    hero_secondary_cta_link: '/partnerships',
    hero_pillar1_title: 'Client Services',
    hero_pillar1_sub: 'Web, Mobile & AI',
    hero_pillar2_title: 'B2B Partnerships',
    hero_pillar2_sub: 'Startups & MVPs',
    hero_pillar3_title: 'Growth & Scale',
    hero_pillar3_sub: 'SEO, Ads & Marketing',
    // What We Do Section Settings
    what_we_do_badge: 'Two Core Engines • One Strategic Partner',
    what_we_do_heading: 'Client Engineering & B2B Ventures',
    what_we_do_subtext: 'We provide full-lifecycle engineering services for businesses needing reliable websites, software, mobile apps, AI automations, and growth marketing—while simultaneously building proprietary products and partnering with startups on high-velocity MVPs.',
    what_we_do_p1_title: 'Client Engineering Services',
    what_we_do_p1_badge: 'Direct Contracting',
    what_we_do_p1_desc: 'We design, engineer, and deploy high-performance websites, custom software, iOS & Android mobile apps, and AI automations with dedicated milestone delivery.',
    what_we_do_p1_cta_text: 'Hire Us for a Project',
    what_we_do_p1_cta_link: '/contact',
    what_we_do_p2_title: 'B2B & Startup Partnerships',
    what_we_do_p2_badge: 'Co-Building & Scale',
    what_we_do_p2_desc: 'We partner with non-technical founders, agencies, and enterprise leaders to build market-ready MVPs, white-label client projects, and scale technical infrastructure.',
    what_we_do_p2_cta_text: 'Discuss a B2B Partnership',
    what_we_do_p2_cta_link: '/partnerships',
    what_we_do_p3_title: 'Proprietary Tech Products',
    what_we_do_p3_badge: 'Our Own Ventures',
    what_we_do_p3_desc: 'We engineer, incubate, and scale our own software products and SaaS ecosystems. Because we build our own ventures, we think like product owners, not just contractors.',
    what_we_do_p3_cta_text: 'Explore Our Ventures',
    what_we_do_p3_cta_link: '/ventures',
    // Call To Action Settings
    cta_heading: 'Have an idea or a business challenge?',
    cta_subtext: "Let's build something meaningful together. Whether you are launching a new product, scaling a business system, or exploring a technology partnership.",
    cta_primary_btn: 'Book Discovery Call',
    cta_primary_link: '/book',
    cta_secondary_btn: 'Calculate Scope & Cost',
    cta_secondary_link: '/estimate',
    cta_tertiary_btn: 'Executive Deck (PDF)',
    cta_tertiary_link: '/capabilities'
  },
  activity_logs: [
    {
      id: 1,
      admin_id: 1,
      action_type: 'SYSTEM_BOOT',
      details: 'SaroHub Technologies backend core bootstrapped with default 3NF schema.',
      ip_address: '127.0.0.1',
      created_at: '2026-06-29T23:48:35-07:00'
    }
  ],
  chat_sessions: [
    {
      id: 'demo-session-1',
      visitor_name: 'Dinuka Perera',
      visitor_email: 'dinuka@cloudscale.lk',
      status: 'active',
      agent_unread: true,
      visitor_unread: false,
      messages: [
        {
          id: 'm1',
          sender: 'visitor',
          text: 'Hi SaroHub team! I am interested in your cognitive computing services for our supply chain optimization. Do you support multi-region deployment?',
          created_at: '2026-06-30T06:50:00Z'
        },
        {
          id: 'm2',
          sender: 'agent',
          text: 'Hello Dinuka! Yes, absolutely. All of our cognitive systems are engineered with sub-millisecond edge indexing and deployed across multi-region high-availability configurations.',
          created_at: '2026-06-30T06:52:00Z'
        },
        {
          id: 'm3',
          sender: 'visitor',
          text: 'That sounds perfect. Could you provide some details on pricing and timeline for a pilot?',
          created_at: '2026-06-30T06:55:00Z'
        }
      ],
      created_at: '2026-06-30T06:50:00Z',
      updated_at: '2026-06-30T06:55:00Z'
    }
  ],
  opportunities: [],
  opportunity_applications: [],
  agent_availability: 'online',
  event_registrations: [],
  partners: [
    {
      id: 1,
      name: "Global Tech Agency Network",
      category: "Agency",
      logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200&h=100",
      website_url: "https://sarohub.com",
      description: "Strategic delivery partner for enterprise web & mobile software applications.",
      featured: true,
      order: 1,
      created_at: "2026-08-01T00:00:00.000Z"
    }
  ],
  student_projects: [
    {
      id: 1,
      title: 'Smart Health Diagnostics Platform',
      student_name: 'Imran Khan & Team',
      batch_course: 'Full-Stack Software Engineering - Batch 2026',
      category: 'AI & Web SaaS',
      technologies: ['React', 'Node.js', 'TypeScript', 'Python', 'Tailwind CSS'],
      short_description: 'An AI-assisted medical telemetry dashboard for patient vitals monitoring and automated diagnostics dispatch.',
      description: 'Built during the 12-week SaroHub IT Center Advanced Bootcamp, this platform processes real-time patient metrics with automated triage alerts and encrypted HIPAA-ready storage.',
      thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=450',
      live_url: 'https://demo-health.sarohub.com',
      github_url: 'https://github.com/sarohub-academy/health-diagnostics',
      created_at: '2026-07-01T10:00:00Z',
      updated_at: '2026-07-01T10:00:00Z'
    },
    {
      id: 2,
      title: 'Autonomous Logistics Tracker',
      student_name: 'Ayesha Rahman',
      batch_course: 'Cloud & Microservices Architecture - Batch 2026',
      category: 'Cloud & IoT',
      technologies: ['Node.js', 'Docker', 'React Native', 'MySQL', 'GCP'],
      short_description: 'Real-time GPS fleet telemetry tracking system with automated route optimization algorithms.',
      description: 'Engineered as a capstone project at SaroHub IT Center. Features live map tracking, driver dispatch alerts, and distributed container deployment.',
      thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800&h=450',
      live_url: 'https://demo-logistics.sarohub.com',
      github_url: 'https://github.com/sarohub-academy/logistics-tracker',
      created_at: '2026-07-15T10:00:00Z',
      updated_at: '2026-07-15T10:00:00Z'
    },
    {
      id: 3,
      title: 'EduSphere Learning Ecosystem',
      student_name: 'Zayn Perera & Fatima Ali',
      batch_course: 'Modern Web Engineering - Batch 2026',
      category: 'EdTech & SaaS',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      short_description: 'Collaborative online learning platform with live code playground, quizzes, and automated certificate generation.',
      description: 'Developed by SaroHub Academy graduates to serve local educational institutes with interactive video courses, automated grading, and peer code reviews.',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&h=450',
      live_url: 'https://demo-edusphere.sarohub.com',
      github_url: 'https://github.com/sarohub-academy/edusphere-app',
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-08-01T10:00:00Z'
    }
  ]
};

// Singleton DB Instance Manager
class JSONDatabase {
  private data: DBState = INITIAL_DB;

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        
        // Ensure new modules are correctly backfilled with default seed data if missing
        let hasChanges = false;
        if (!this.data.careers) {
          this.data.careers = INITIAL_DB.careers || [];
          hasChanges = true;
        }
        if (!this.data.applications) {
          this.data.applications = INITIAL_DB.applications || [];
          hasChanges = true;
        }
        if (!this.data.opportunities) {
          this.data.opportunities = INITIAL_DB.opportunities || [];
          hasChanges = true;
        }
        if (!this.data.opportunity_applications) {
          this.data.opportunity_applications = INITIAL_DB.opportunity_applications || [];
          hasChanges = true;
        }
        if (!this.data.event_registrations) {
          this.data.event_registrations = INITIAL_DB.event_registrations || [];
          hasChanges = true;
        }
        if (!this.data.partners) {
          this.data.partners = INITIAL_DB.partners || [];
          hasChanges = true;
        }
        if (!this.data.student_projects) {
          this.data.student_projects = INITIAL_DB.student_projects || [];
          hasChanges = true;
        }
        if (!this.data.ventures) {
          this.data.ventures = DEFAULT_VENTURES;
          hasChanges = true;
        }
        if (!this.data.chat_sessions) {
          this.data.chat_sessions = INITIAL_DB.chat_sessions || [];
          hasChanges = true;
        }
        if (!this.data.agent_availability) {
          this.data.agent_availability = INITIAL_DB.agent_availability || 'online';
          hasChanges = true;
        }

        // New Dynamic CMS Collections Backfills
        if (!this.data.hero_settings) {
          (this.data as any).hero_settings = {
            eyebrowText: 'Building Technology That Turns Ideas Into Ventures.',
            headline: 'Build AI-Powered Software & Scalable Digital Systems',
            description: 'SaroHub Technologies engineers custom software, SaaS products, AI solutions, and digital platforms built for global business impact.',
            primaryCtaText: 'Start a Project',
            primaryCtaLink: '#contact-preview',
            secondaryCtaText: 'Explore Our Work',
            secondaryCtaLink: '#featured-projects',
            badgeText: 'Enterprise Software & AI Engineering Partner',
            bgMediaUrl: '',
            heroImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=800'
          };
          hasChanges = true;
        }

        if (!this.data.company_metrics) {
          (this.data as any).company_metrics = [
            { id: 1, number: '50+', label: 'Projects Delivered', description: 'Enterprise platforms & web systems', icon: 'Briefcase', order: 1, active: true },
            { id: 2, number: '18+', label: 'Organizations Served', description: 'Corporate clients & institutions', icon: 'Globe', order: 2, active: true },
            { id: 3, number: '100K+', label: 'Users Reached', description: 'Across deployed SaaS applications', icon: 'Users', order: 3, active: true },
            { id: 4, number: '25+', label: 'Engineering Experts', description: 'Full-stack & AI developers', icon: 'Cpu', order: 4, active: true },
            { id: 5, number: '6', label: 'Proprietary Ventures', description: 'Internal products in market', icon: 'Award', order: 5, active: true },
            { id: 6, number: '12+', label: 'Countries Served', description: 'Clients across US, EU, and Asia', icon: 'MapPin', order: 6, active: true }
          ];
          hasChanges = true;
        }

        if (!this.data.why_sarohub_items) {
          (this.data as any).why_sarohub_items = [
            { id: 1, title: 'Business-First Engineering', shortDescription: 'We focus on real business results before selecting technology.', detailedDescription: 'Our design starts with your business goals, return on investment, and long-term usability.', icon: 'CheckCircle', order: 1, status: 'active' },
            { id: 2, title: 'Practical AI Solutions', shortDescription: 'Targeted artificial intelligence that creates measurable business value.', detailedDescription: 'We integrate smart search, automated workflows, and helpful AI assistants into everyday tools.', icon: 'Cpu', order: 2, status: 'active' },
            { id: 3, title: 'Product-Driven Mindset', shortDescription: 'Built for ease of use, customer retention, and steady growth.', detailedDescription: 'Every platform is designed with an intuitive user interface and room to expand.', icon: 'TrendingUp', order: 3, status: 'active' },
            { id: 4, title: 'Built to Grow', shortDescription: 'Reliable cloud infrastructure engineered for high traffic and speed.', detailedDescription: 'Our systems handle peak user activity smoothly with 24/7 reliability and fast loading times.', icon: 'Grid', order: 4, status: 'active' },
            { id: 5, title: 'Full-Service Technology Partner', shortDescription: 'Strategy, design, development, and ongoing support all in one place.', detailedDescription: 'From initial planning to cloud launch and ongoing maintenance, we take care of the full project lifecycle.', icon: 'Award', order: 1, status: 'active' }
          ];
          hasChanges = true;
        }

        if (!this.data.process_steps) {
          (this.data as any).process_steps = [
            { id: 1, stepNumber: '01', title: 'Discover', shortDescription: 'Understanding your business goals, target audience, and project needs.', detailedDescription: 'We define clear project goals, user requirements, and delivery milestones.', icon: 'Search', order: 1 },
            { id: 2, stepNumber: '02', title: 'Strategy', shortDescription: 'System planning, technical architecture, and roadmap design.', detailedDescription: 'Creating clear technology roadmaps, data structures, and user experience wireframes.', icon: 'FileText', order: 2 },
            { id: 3, stepNumber: '03', title: 'Design', shortDescription: 'Interactive mockups, clean visual layouts, and user experience testing.', detailedDescription: 'Designing modern, intuitive screens that look great on mobile and desktop.', icon: 'Grid', order: 3 },
            { id: 4, stepNumber: '04', title: 'Build', shortDescription: 'Iterative software development with regular progress updates and quality checks.', detailedDescription: 'Full-stack development with rigorous testing, clean code, and security reviews.', icon: 'Code', order: 4 },
            { id: 5, stepNumber: '05', title: 'Launch', shortDescription: 'Smooth cloud deployment, performance testing, and live release.', detailedDescription: 'Deploying to reliable cloud servers with live monitoring and backup safeguards.', icon: 'Globe', order: 5 },
            { id: 6, stepNumber: '06', title: 'Scale', shortDescription: 'Ongoing maintenance, speed optimization, and feature enhancements.', detailedDescription: 'Continuous technical support, speed improvements, and smooth scaling as your business grows.', icon: 'TrendingUp', order: 6 }
          ];
          hasChanges = true;
        }

        if (!this.data.security_standards) {
          (this.data as any).security_standards = [
            { id: 1, title: 'Secure Logins & Access Control', category: 'Security', description: 'Secure user logins, role-based permissions, and multi-factor verification.', details: ['Role-based access for team members and admins', 'Secure session logins that refresh automatically', 'Strong industry-standard password protection'], icon: 'Lock', order: 1 },
            { id: 2, title: 'Data Protection & Privacy', category: 'Compliance', description: 'High-grade data encryption for sensitive business and customer information.', details: ['Encrypted customer databases and private records', 'Automated daily backups with secure off-site copies', 'Strict privacy and data protection guidelines'], icon: 'CheckCircle', order: 2 },
            { id: 3, title: 'System & Platform Defense', category: 'Infrastructure', description: 'Protections against unauthorized requests, data tampering, and overload.', details: ['Input validation to prevent data manipulation', 'Advanced firewalls to block spam and online threats', 'Fair-usage traffic management to protect speed'], icon: 'Shield', order: 3 },
            { id: 4, title: 'Quality Checks & Live Monitoring', category: 'DevOps', description: 'Automated security scans, clean code testing, and 24/7 uptime monitoring.', details: ['Automated code testing before new updates go live', 'Continuous security checks on server software', '24/7 system health monitoring and quick alerts'], icon: 'Activity', order: 4 }
          ];
          hasChanges = true;
        }

        if (!this.data.company_timeline) {
          (this.data as any).company_timeline = [
            { id: 1, year: '2022', title: 'SaroHub Initiative Begins', description: 'Founded as a specialized technology research group and custom software consultancy.', order: 1, status: 'active' },
            { id: 2, year: '2024', title: 'IT Training Center & AI Lab Launch', description: 'Expanded into hands-on IT Academy training and cognitive computing R&D.', order: 2, status: 'active' },
            { id: 3, year: '2026', title: 'Incorporation & Venture Expansion', description: 'Officially incorporated SaroHub Technologies (Pvt) Ltd, scaling proprietary SaaS ventures and enterprise client platforms.', order: 3, status: 'active' }
          ];
          hasChanges = true;
        }

        if (!this.data.leads) {
          (this.data as any).leads = [];
          hasChanges = true;
        }

        if (!this.data.media_library) {
          (this.data as any).media_library = [];
          hasChanges = true;
        }

        if (!(this.data as any).outgoing_emails) {
          (this.data as any).outgoing_emails = [];
          hasChanges = true;
        }

        if (!this.data.consultations) {
          this.data.consultations = [];
          hasChanges = true;
        }

        if (!this.data.estimates) {
          this.data.estimates = [];
          hasChanges = true;
        }

        if (!this.data.company_gallery) {
          this.data.company_gallery = [];
          hasChanges = true;
        }

        // Backfill portfolio_url for existing team members missing it
        if (this.data.team_members) {
          this.data.team_members.forEach((m: any) => {
            if (m.portfolio_url === undefined) {
              m.portfolio_url = '';
              hasChanges = true;
            }
          });
        }
        // Backfill new settings keys
        const settingDefaults: { [key: string]: string } = {
          instagram: '',
          github: '',
          youtube: '',
          tiktok: '',
          // Dynamic Hero Section Settings
          hero_badge: 'Full-Stack Technology Studio & Venture Partner',
          hero_heading: 'Engineering High-Impact Digital Solutions &',
          hero_heading_accent: 'Scalable Tech Ventures.',
          hero_description: 'Whether you need a dedicated engineering team to build your next web app, AI automation, and marketing pipeline, or a technical partner to co-build scalable B2B products and MVPs from scratch — SaroHub delivers end-to-end technology that drives growth.',
          hero_typed_phrases: JSON.stringify([
            'Custom Web & Mobile Apps',
            'AI Automations & Enterprise ERPs',
            'Rapid MVP Development for Startups',
            'Strategic B2B Technology Partnerships',
            'Performance Growth & Digital Marketing'
          ]),
          hero_primary_cta_text: 'Hire Us for a Project',
          hero_primary_cta_link: '/contact',
          hero_secondary_cta_text: 'B2B Partnerships & Ventures',
          hero_secondary_cta_link: '/partnerships',
          hero_pillar1_title: 'Client Services',
          hero_pillar1_sub: 'Web, Mobile & AI',
          hero_pillar2_title: 'B2B Partnerships',
          hero_pillar2_sub: 'Startups & MVPs',
          hero_pillar3_title: 'Growth & Scale',
          hero_pillar3_sub: 'SEO, Ads & Marketing',
          // What We Do Section Settings
          what_we_do_badge: 'Two Core Engines • One Strategic Partner',
          what_we_do_heading: 'Client Engineering & B2B Ventures',
          what_we_do_subtext: 'We provide full-lifecycle engineering services for businesses needing reliable websites, software, mobile apps, AI automations, and growth marketing—while simultaneously building proprietary products and partnering with startups on high-velocity MVPs.',
          what_we_do_p1_title: 'Client Engineering Services',
          what_we_do_p1_badge: 'Direct Contracting',
          what_we_do_p1_desc: 'We design, engineer, and deploy high-performance websites, custom software, iOS & Android mobile apps, and AI automations with dedicated milestone delivery.',
          what_we_do_p1_cta_text: 'Hire Us for a Project',
          what_we_do_p1_cta_link: '/contact',
          what_we_do_p2_title: 'B2B & Startup Partnerships',
          what_we_do_p2_badge: 'Co-Building & Scale',
          what_we_do_p2_desc: 'We partner with non-technical founders, agencies, and enterprise leaders to build market-ready MVPs, white-label client projects, and scale technical infrastructure.',
          what_we_do_p2_cta_text: 'Discuss a B2B Partnership',
          what_we_do_p2_cta_link: '/partnerships',
          what_we_do_p3_title: 'Proprietary Tech Products',
          what_we_do_p3_badge: 'Our Own Ventures',
          what_we_do_p3_desc: 'We engineer, incubate, and scale our own software products and SaaS ecosystems. Because we build our own ventures, we think like product owners, not just contractors.',
          what_we_do_p3_cta_text: 'Explore Our Ventures',
          what_we_do_p3_cta_link: '/ventures',
          // Call To Action Settings
          cta_heading: 'Have an idea or a business challenge?',
          cta_subtext: "Let's build something meaningful together. Whether you are launching a new product, scaling a business system, or exploring a technology partnership.",
          cta_primary_btn: 'Book Discovery Call',
          cta_primary_link: '/book',
          cta_secondary_btn: 'Calculate Scope & Cost',
          cta_secondary_link: '/estimate',
          cta_tertiary_btn: 'Executive Deck (PDF)',
          cta_tertiary_link: '/capabilities'
        };
        if (this.data.settings) {
          for (const key of Object.keys(settingDefaults)) {
            if (this.data.settings[key] === undefined) {
              this.data.settings[key] = settingDefaults[key];
              hasChanges = true;
            }
          }
        }
        if (!this.data.team_members || !Array.isArray(this.data.team_members) || this.data.team_members.length === 0) {
          this.data.team_members = INITIAL_DB.team_members || [];
          hasChanges = true;
        }

        if (!this.data.team_sections || this.data.team_sections.length === 0) {
          this.data.team_sections = DEFAULT_TEAM_SECTIONS;
          hasChanges = true;
        }
        if (hasChanges) {
          this.save();
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Failed to load local DB state. Reverting to initial seed.", e);
      this.data = INITIAL_DB;
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to save local DB state.", e);
    }
  }

  // Get current DB snapshot
  getState(): DBState {
    return this.data;
  }

  // Update complete state (useful for admin actions)
  updateState(updater: (state: DBState) => void) {
    updater(this.data);
    this.save();
  }

  // Activity logger helper
  logActivity(adminId: number | undefined, action: string, details: string, ip: string) {
    const nextId = this.data.activity_logs.length > 0 ? Math.max(...this.data.activity_logs.map(l => l.id)) + 1 : 1;
    this.data.activity_logs.unshift({
      id: nextId,
      admin_id: adminId,
      action_type: action,
      details,
      ip_address: 'ADMIN_SECURE',
      created_at: new Date().toISOString()
    });
    this.save();
  }
}

export const db = new JSONDatabase();
