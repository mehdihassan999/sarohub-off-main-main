export interface ProjectChallenge {
  title: string;
  description: string;
}

export interface ProjectSolution {
  title: string;
  description: string;
}

export interface ProjectImpactOutcome {
  title: string;
  description: string;
}

export interface ProjectMetricResult {
  metric: string;
  label: string;
  detail?: string;
}

export interface ProjectTechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  architecture?: string;
  tags: string[];
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar_url?: string;
}

export interface ClientProject {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  category: string; // One of: 'Web Applications', 'Websites', 'SaaS', 'Business Software', 'E-commerce / Commerce', 'Hospitality', 'Retail', 'Education', 'Other'
  secondary_categories?: string[];
  project_type: string;
  positioning_statement: string;
  short_description: string;
  what_we_solved: string;
  status: 'Delivered' | 'Completed' | 'Ongoing' | 'In Production';
  engagement: string;
  completion_date: string;
  thumbnail_url: string;
  screenshots: string[];
  live_url?: string;
  github_url?: string;

  // Case Study Sections
  overview: {
    client_background: string;
    industry_context: string;
    what_sarohub_built: string;
    project_importance: string;
  };
  challenges: ProjectChallenge[];
  solutions: ProjectSolution[];
  features: string[];
  sarohub_role: string[];
  technologies: ProjectTechStack;
  results_impact: {
    metrics?: ProjectMetricResult[];
    qualitative_outcomes: ProjectImpactOutcome[];
  };
  testimonial?: ProjectTestimonial;
  featured?: boolean;
  order?: number;
}

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 1,
    title: 'Waziri Mobile',
    slug: 'waziri-mobile',
    client_name: 'Waziri Mobile',
    industry: 'Mobile & Electronics',
    category: 'E-commerce / Commerce',
    secondary_categories: ['Web Applications', 'Retail'],
    project_type: 'Custom Web Application & Ordering Platform',
    positioning_statement: 'Digital platform for a modern mobile & electronics business.',
    short_description: 'A modern digital platform enabling smartphone and electronics buyers to explore live store inventories, detailed technical specifications, and place direct purchase inquiries.',
    what_we_solved: 'Created a modern digital platform to improve product visibility and customer accessibility.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-03-20',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://wazirimobile.com',
    overview: {
      client_background: 'Waziri Mobile is a recognized regional retailer supplying smartphones, smart devices, and consumer tech accessories across northern commercial hubs.',
      industry_context: 'Consumer Electronics & Telecommunications Retail',
      what_sarohub_built: 'SaroHub architected a high-speed digital catalog, multi-variant filter engine, customer inquiry conduit, and central stock management portal.',
      project_importance: 'Rising customer inquiry volume through physical visits and scattered messaging required a modern digital platform to showcase new smartphone models, verify stock, and streamline retail orders.'
    },
    challenges: [
      {
        title: 'Limited Digital Presence',
        description: 'The business needed a stronger online presence to reach smartphone buyers beyond walk-in foot traffic.'
      },
      {
        title: 'Product Visibility',
        description: 'Customers needed an easier way to discover available smartphone models, colors, memory variants, and pricing.'
      },
      {
        title: 'Customer Accessibility',
        description: 'Product information, warranty policies, and device specifications needed to be accessible online 24/7.'
      },
      {
        title: 'Scattered Information',
        description: 'Stock details and pricing inquiries were managed manually over WhatsApp, creating customer wait times and lost orders.'
      }
    ],
    solutions: [
      {
        title: 'Custom Digital Platform',
        description: 'A purpose-built web application designed directly around Waziri Mobile\'s sales and customer engagement flow.'
      },
      {
        title: 'Product Showcase',
        description: 'Structured presentation of smartphones, tablets, audio accessories, and genuine warranties with multi-angle photos.'
      },
      {
        title: 'Responsive Experience',
        description: 'Optimized for mobile smartphones, tablets, and desktop computers for fast, on-the-go browsing.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Built with a flexible MERN stack foundation that can support upcoming branch expansions and digital payments.'
      }
    ],
    features: [
      'Interactive Product Catalog with Instant Search',
      'Multi-Variant Specification & Storage Filter',
      'Direct WhatsApp & Call Ordering Conduit',
      'Live Branch Inventory Availability Indicators',
      'Responsive Mobile-First Interface',
      'Promotional Banners & Deal Highlights',
      'Admin Catalog & Inventory Control Dashboard',
      'Customer Product Inquiry Tracker'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend Development',
      'Database Development',
      'API Development',
      'System Architecture',
      'Deployment & Hosting Setup',
      'Quality Assurance Testing',
      'Technical Support'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'MongoDB',
      architecture: 'MERN Stack Architecture',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MERN Stack', 'Tailwind CSS']
    },
    results_impact: {
      metrics: [
        { metric: '+65%', label: 'Inquiry Response Speed', detail: 'Faster customer device discovery and order confirmation times.' },
        { metric: '10,000+', label: 'Monthly Catalog Browses', detail: 'Customers viewing live phone models and accessory inventory.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Improved Product Visibility',
          description: 'Created a stronger, credible digital presence enabling customers across the region to explore phone models online.'
        },
        {
          title: 'Better Customer Experience',
          description: 'Made technical specifications, storage options, and prices easy to compare on any mobile phone.'
        },
        {
          title: 'Centralized Platform',
          description: 'Unified product listings, branch details, and order inquiries into one cohesive digital destination.'
        },
        {
          title: 'Scalable Foundation',
          description: 'Built a reliable technology base ready for future branch rollouts and expanded electronics lines.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub delivered exactly what our business needed. Customers now browse our stock online before visiting, and our inquiry response time has improved dramatically.',
      author: 'Management Team',
      role: 'Managing Director',
      company: 'Waziri Mobile'
    },
    featured: true,
    order: 1
  },
  {
    id: 2,
    title: 'The Crescent Resorts',
    slug: 'the-crescent-resorts',
    client_name: 'The Crescent Resorts',
    industry: 'Hospitality',
    category: 'Hospitality',
    secondary_categories: ['Web Applications'],
    project_type: 'Hospitality Booking & Digital Guest Experience Platform',
    positioning_statement: 'Hospitality & digital guest experience platform for premier northern tourism.',
    short_description: 'A centralized hotel management and guest booking engine engineered to showcase luxury resort suites, manage room reservations, and eliminate booking collisions.',
    what_we_solved: 'Replaced manual booking records with a centralized digital reservation and guest management system that eliminated double-bookings.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-05-15',
    thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://thecrescentresorts.com',
    overview: {
      client_background: 'The Crescent Resorts is a premier hospitality provider operating scenic boutique hotels and retreat properties serving vacationers and corporate groups.',
      industry_context: 'Hospitality, Luxury Tourism & Leisure',
      what_sarohub_built: 'SaroHub built an enterprise hospitality platform combining a guest-facing direct booking engine with back-office room inventory, guest folios, and amenity scheduling.',
      project_importance: 'During high-demand peak travel seasons, telephone reservations and spreadsheet tracking created double-booking risks and billing delays. The resort required a reliable digital booking engine to capture direct guest revenue.'
    },
    challenges: [
      {
        title: 'Manual Booking Conflicts',
        description: 'Managing reservations through phone calls and paper ledgers led to overlap risks during peak holiday travel periods.'
      },
      {
        title: 'Limited Online Room Showcase',
        description: 'Prospective travelers could not view high-resolution room photos, balcony vistas, amenities, and seasonal rates.'
      },
      {
        title: 'High Third-Party Commissions',
        description: 'Over-reliance on external hotel aggregator portals drained significant profit margins from direct bookings.'
      },
      {
        title: 'Fragmented Guest Folios',
        description: 'Room charges, dining receipts, and excursion arrangements were tracked across separate systems, slowing checkout.'
      }
    ],
    solutions: [
      {
        title: 'Custom Digital Platform',
        description: 'A bespoke hospitality platform integrating front-desk reservation management with customer-facing booking.'
      },
      {
        title: 'Room & Amenity Showcase',
        description: 'Visual presentations of executive suites, family chalets, mountain dining, and guided excursion itineraries.'
      },
      {
        title: 'Responsive Experience',
        description: 'Streamlined mobile booking interface optimized for tourists researching accommodations while traveling.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Engineered with atomic transactional locking to guarantee zero double-bookings under concurrent traffic.'
      }
    ],
    features: [
      'Interactive Room Availability Calendar',
      'Direct Guest Reservation & Inquiry Engine',
      'High-Resolution Room & Suite Gallery',
      'Multi-Tier Seasonal Pricing Management',
      'Automated Confirmation Notifications',
      'Dining, Conference & Excursion Showcase',
      'Front-Desk Guest Folio & Check-In Portal',
      'Executive Occupancy & Revenue Reporting'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend Development',
      'Database Development',
      'API Development',
      'System Architecture',
      'Deployment & Optimization',
      'Quality Assurance Testing',
      'Technical Support'
    ],
    technologies: {
      frontend: 'React.js, TypeScript, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'PostgreSQL',
      architecture: 'RESTful API & Modular Web Architecture',
      tags: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Tailwind CSS']
    },
    results_impact: {
      metrics: [
        { metric: '0%', label: 'Double Booking Collision Rate', detail: 'Complete elimination of reservation overlap errors.' },
        { metric: '+48%', label: 'Direct Bookings Increase', detail: 'Substantially reduced reliance on high-fee third-party booking agents.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Zero Booking Collisions',
          description: 'Centralized digital room ledger completely eliminated double-booking headaches and front-desk confusion.'
        },
        {
          title: 'Higher Direct Reservations',
          description: 'Empowered travelers to reserve directly through the resort website, saving substantial third-party OTA commissions.'
        },
        {
          title: 'Elevated Brand Perception',
          description: 'Delivered an elegant digital presence that faithfully reflects the premium quality of the resort grounds.'
        },
        {
          title: 'Streamlined Check-In',
          description: 'Pre-registered booking data allowed front desk personnel to accelerate guest check-in significantly.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub gave us a direct booking system that transformed our operations. Double bookings are completely gone, and our direct inquiries from tourists have grown each month.',
      author: 'General Manager',
      role: 'Resort General Manager',
      company: 'The Crescent Resorts'
    },
    featured: true,
    order: 2
  },
  {
    id: 3,
    title: 'VG4 Super Store',
    slug: 'vg4-super-store',
    client_name: 'VG4 Super Store',
    industry: 'Retail',
    category: 'Retail',
    secondary_categories: ['Business Software'],
    project_type: 'Retail Point of Sale & Warehouse Inventory Platform',
    positioning_statement: 'Retail & business management system with ultra-fast POS and warehouse inventory.',
    short_description: 'An offline-capable, multi-terminal Point of Sale (POS) and automated warehouse inventory platform engineered for rapid barcode scanning and real-time stock sync.',
    what_we_solved: 'Replaced an unstable legacy billing tool with a sub-50ms barcode scanning POS and real-time inventory management system.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-06-10',
    thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://vg4superstore.com',
    overview: {
      client_background: 'VG4 Super Store is a high-volume department retail store handling thousands of customer transactions daily across groceries, electronics, and household goods.',
      industry_context: 'Supermarket & FMCG Retail Distribution',
      what_sarohub_built: 'SaroHub engineered a multi-terminal Point of Sale (POS) system with sub-50ms barcode scanning, local offline resilience, and centralized warehouse inventory management.',
      project_importance: 'Peak shopping hours caused checkout congestion and customer frustration. The legacy software crashed during connectivity drops and could not reconcile shelf stock with the central warehouse.'
    },
    challenges: [
      {
        title: 'Long Checkout Queues',
        description: 'Slow billing software caused long checkout queues during peak evening shopping hours.'
      },
      {
        title: 'Offline Vulnerability',
        description: 'Network or power disruptions froze terminals, stopping sales and receipt printing.'
      },
      {
        title: 'Warehouse Stock Blindspots',
        description: 'Lack of real-time inventory synchronization between the shop floor and warehouse storage.'
      },
      {
        title: 'Cashier Shift Discrepancies',
        description: 'Manual register closing led to reconciliation errors and delayed daily accounting.'
      }
    ],
    solutions: [
      {
        title: 'Custom Digital Platform',
        description: 'A purpose-built retail checkout platform designed specifically around cashier speed and keyboard hotkeys.'
      },
      {
        title: 'Offline-First Architecture',
        description: 'Integrated local cache enabling checkout registers to operate continuously even during network outages.'
      },
      {
        title: 'Real-Time Inventory Hub',
        description: 'Normalized database tracking thousands of SKUs across multiple terminals and backroom storage.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Engineered with optimized SQL indexing capable of handling high daily transaction volume with zero lag.'
      }
    ],
    features: [
      'Sub-50ms Barcode Scanning & Keyboard Shortcuts',
      'Offline-First Local Sales Transaction Cache',
      'Thermal Receipt Printing & Digital SMS Invoices',
      'Automated Low-Stock Alerts & Reorder Reports',
      'Multi-Terminal Cashier Shift Reconciliation',
      'Multi-Category Warehouse Inventory Management',
      'Daily Sales, Profit Margins & Gross Telemetry',
      'Role-Based Permissions (Cashier, Manager, Admin)'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend Development',
      'Database Development',
      'API Development',
      'System Architecture',
      'On-Premises Hardware Configuration',
      'Quality Assurance & Stress Testing',
      'Technical Support & Cashier Training'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'MySQL, SQLite Local Cache',
      architecture: 'Offline-First Client with WebSockets Cloud Sync',
      tags: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'WebSockets', 'Tailwind CSS']
    },
    results_impact: {
      metrics: [
        { metric: '55%', label: 'Checkout Time Reduction', detail: 'Dramatically shortened cashier transaction queues.' },
        { metric: '5,000+', label: 'Daily Transactions Processed', detail: 'Continuous high-volume checkout with zero system downtime.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Faster Checkout Speed',
          description: 'Cashiers process customers rapidly with sub-50ms barcode lookups, eliminating bottleneck queues.'
        },
        {
          title: 'Zero Sales Interruptions',
          description: 'Offline-first database architecture keeps registers running smoothly through power and internet cuts.'
        },
        {
          title: 'Precise Stock Control',
          description: 'Warehouse staff and supervisors maintain real-time visibility over inventory levels and low-stock alerts.'
        },
        {
          title: 'Automated Shift Audits',
          description: 'Cashiers close shifts with one-click reconciliation, eliminating manual calculation discrepancies.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub\'s POS system changed how our store operates. Register lines move rapidly, the software never freezes when the internet drops, and stock counts are always accurate.',
      author: 'Supermarket Management',
      role: 'Operations Lead',
      company: 'VG4 Super Store'
    },
    featured: true,
    order: 3
  },
  {
    id: 4,
    title: 'Askoli Adventure — Adventure Tourism & Tour Booking Platform',
    slug: 'askoli-adventure',
    client_name: 'Askoli Adventure',
    industry: 'Adventure Tourism & Expeditions',
    category: 'Web Applications',
    secondary_categories: ['Hospitality', 'Websites'],
    project_type: 'Tourism Booking & Expedition Showcase Platform',
    positioning_statement: 'International adventure expedition showcase and structured mountain tour booking platform.',
    short_description: 'A comprehensive international adventure tourism platform created for Askoli Adventure, showcasing 50+ Karakoram trekking expeditions, K2 base camp routes, interactive itineraries, and online booking requests.',
    what_we_solved: 'Replaced manual email and PDF itineraries with an interactive expedition portal featuring 50+ curated tours, route elevations, gear checklists, and an online booking inquiry workflow.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2025-01-15',
    thumbnail_url: '/uploads/migrated-db_projects_3_thumbnail_url-1788627608898-bn7oa.png',
    screenshots: [
      '/uploads/migrated-db_projects_3_screenshots_0-1788627608901-b1ln6.png',
      '/uploads/migrated-db_projects_3_screenshots_1-1788627608904-e5ck8.png',
      '/uploads/migrated-db_projects_3_screenshots_2-1788627608907-wpexm.png'
    ],
    live_url: 'https://askoliadventure.com/',
    overview: {
      client_background: 'Askoli Adventure is one of Pakistan\'s established expedition and mountain trekking operators, organizing guided treks across the Karakoram range including K2 Base Camp, Gondogoro La, Broad Peak, and the Baltoro Glacier.',
      industry_context: 'International Mountain Tourism, Mountaineering & Adventure Travel',
      what_sarohub_built: 'SaroHub engineered a high-performance tourism web application featuring interactive tour listings, dynamic filtering by difficulty and duration, day-by-day expedition timelines, gear checklists, and an integrated reservation inquiry engine.',
      project_importance: 'International mountain travelers needed trustworthy route information, elevation profiles, and transparent pricing when booking high-altitude mountain expeditions.'
    },
    challenges: [
      {
        title: 'Scattered Expedition Details',
        description: 'Multi-week itineraries, logistics, and gear requirements were previously distributed across informal PDFs and brochures.'
      },
      {
        title: 'Lack of Structured Booking',
        description: 'Inquiries via email lacked vital traveler info like mountain experience, group sizes, and preferred travel dates.'
      },
      {
        title: 'Global High-Latency Access',
        description: 'The website needed to load quickly and reliably for international clients across Europe, North America, and East Asia.'
      }
    ],
    solutions: [
      {
        title: 'Interactive Expedition Showcase',
        description: 'Rich itinerary displays with elevation profiles, included amenities, safety guidelines, and high-resolution mountain photography.'
      },
      {
        title: 'Multi-Step Booking Pipeline',
        description: 'An online booking inquiry workflow capturing dates, group size, and mountaineering experience directly.'
      },
      {
        title: 'Dynamic Filtering Engine',
        description: 'Instant tour discovery filtered by region (Baltistan, Hunza, Gilgit), difficulty (Challenging, Extreme), and duration.'
      },
      {
        title: 'Fast Global CDN Delivery',
        description: 'Optimized media assets and CDN caching ensuring rapid page load speeds for international visitors.'
      }
    ],
    features: [
      '50+ Curated Trekking & Mountaineering Tours',
      'Interactive Day-by-Day Expedition Itineraries',
      'Elevation Maps & Mountain Profile Visuals',
      'Structured Tour Inquiry & Booking System',
      'Destination & Difficulty Level Filtering',
      'WhatsApp Direct Traveler Chat Integration',
      'High-Resolution Karakoram Photo Galleries'
    ],
    sarohub_role: [
      'UI/UX Interface Design',
      'Full-Stack Web Development',
      'Content Architecture & Itinerary Taxonomy',
      'Responsive Mobile Engineering',
      'Performance & International SEO Optimization'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'MySQL',
      architecture: 'Modern Responsive Web Application with CDN Caching',
      tags: ['React.js', 'Node.js', 'MySQL', 'Tailwind CSS', 'Web Applications']
    },
    results_impact: {
      metrics: [
        { metric: '50+', label: 'Curated Expedition Tours', detail: 'Covering K2 Base Camp, Concordia, Gondogoro La, and Karakoram peaks.' },
        { metric: '100%', label: 'Mobile Responsive Booking', detail: 'Seamless inquiry and itinerary exploration across all devices.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Enhanced Global Inquiries',
          description: 'Significantly increased international inquiries from mountain enthusiasts and tour groups across Europe and the Americas.'
        },
        {
          title: 'Streamlined Booking Correspondence',
          description: 'Structured online booking forms reduced inquiry resolution time from days to hours.'
        },
        {
          title: 'High-Altitude Tourism Authority',
          description: 'Positioned Askoli Adventure as a premier operator with clear route, safety, and equipment documentation.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub delivered a platform that truly captures the grandeur of the Karakoram. Our international guests can now explore our K2 itineraries, check difficulty levels, and book seamlessly.',
      author: 'Expedition Directorate',
      role: 'Head of Operations',
      company: 'Askoli Adventure'
    },
    featured: true,
    order: 4
  },
  {
    id: 5,
    title: 'BSW Foundation — Education & Social Welfare Platform',
    slug: 'bsw-foundation',
    client_name: 'BSW Foundation',
    industry: 'Nonprofit & Social Welfare',
    category: 'Websites',
    secondary_categories: ['Education', 'Web Applications'],
    project_type: 'Social Welfare & Educational Impact Platform',
    positioning_statement: 'Transparent digital platform showcasing educational missions, student sponsorships, and community impact.',
    short_description: 'A modern digital platform developed for Baltoro Social Welfare (BSW) Foundation to showcase its educational mission, student sponsorship programs, alumni achievements, transparent donation impact, and community development across the remote Braldo Valley of Baltistan.',
    what_we_solved: 'Built a transparent digital platform documenting 15+ years of grassroots educational welfare, enabling global supporters to sponsor students and verify donation impact.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2025-02-10',
    thumbnail_url: 'https://res.cloudinary.com/dgjuqqu4/image/upload/v1788625453/sarohub/alghhq8fusdgfnd78ayv.png',
    screenshots: [
      'https://res.cloudinary.com/dgjuqqu4/image/upload/v1788625464/sarohub/vqzmotrcul6b8yr2azfj.png',
      'https://res.cloudinary.com/dgjuqqu4/image/upload/v1788625469/sarohub/x4tphjc0kwlewu930j0f.png',
      'https://res.cloudinary.com/dgjuqqu4/image/upload/v1788625482/sarohub/uspv3sigq07kbjmqfy0k.png'
    ],
    live_url: 'https://bswfoundation.org/',
    overview: {
      client_background: 'Baltoro Social Welfare (BSW) Foundation is a non-profit organization established in 2011 to provide educational access, school infrastructure, female literacy, and student scholarships across remote mountain communities in Baltistan.',
      industry_context: 'Nonprofit Social Welfare, Education & Community Development',
      what_sarohub_built: 'SaroHub developed a comprehensive digital portal featuring student impact stories, scholarship sponsorship tiers, annual reports, photo galleries, and donation channels.',
      project_importance: 'The foundation needed an authoritative, transparent digital presence to connect remote educational initiatives with overseas donors and philanthropic partners.'
    },
    challenges: [
      {
        title: 'Remote Community Isolation',
        description: 'Demonstrating tangible educational progress from difficult-to-reach mountain valleys to donors abroad was challenging.'
      },
      {
        title: 'Donor Verification & Trust',
        description: 'Providing transparent evidence of how donations translate directly into tuition, books, school uniforms, and winter camps.'
      },
      {
        title: 'Program Visibility',
        description: 'Displaying diverse initiatives like female literacy, winter tuition camps, and school building projects in a unified interface.'
      }
    ],
    solutions: [
      {
        title: 'Student Impact & Alumni Stories',
        description: 'Dedicated case studies highlighting student journeys from village classrooms to universities and professional careers.'
      },
      {
        title: 'Sponsorship Tiers Breakdown',
        description: 'Clear visibility into the exact educational costs covered by monthly and annual sponsorships.'
      },
      {
        title: 'Transparent Financial & Annual Reports',
        description: 'Downloadable verification documents and milestone timelines dating back to the foundation\'s inception in 2011.'
      },
      {
        title: 'Community Gallery & Field Updates',
        description: 'High-resolution visual documentation of educational camps, book distributions, and school construction.'
      }
    ],
    features: [
      'Mission & Social Impact Showcase',
      'Student Sponsorship & Program Details',
      'Alumni Success Stories & Testimonials',
      'Transparent Financial & Project Reports',
      'Event & Field Activity Photo Galleries',
      'Volunteer & Partner Engagement Forms',
      'Multi-Channel Contact & WhatsApp Assistance'
    ],
    sarohub_role: [
      'Social Impact UI/UX Design',
      'Responsive Web Development',
      'Storytelling & Content Strategy',
      'Cross-Device Accessibility Optimization'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js',
      database: 'MySQL',
      architecture: 'Lightweight Fast-Loading Social Welfare Web Architecture',
      tags: ['React.js', 'Tailwind CSS', 'Social Impact', 'Web Development']
    },
    results_impact: {
      metrics: [
        { metric: '15+ Yrs', label: 'Welfare Legacy Documented', detail: 'Serving students from remote valleys of Baltistan since 2011.' },
        { metric: '100%', label: 'Donation Transparency', detail: 'Clear breakdown of student sponsorship allocations and school support.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Amplified Donor Trust',
          description: 'Transparent reporting and student tracking significantly improved donor confidence and sponsorship contributions.'
        },
        {
          title: 'Global Diaspora Engagement',
          description: 'Connected the foundation with educational advocates and donors across Pakistan and international expat communities.'
        },
        {
          title: 'Long-Term Archive',
          description: 'Preserved over a decade of community development milestones, school records, and scholarship recipients.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub gave our educational mission a world-class digital home. The platform has helped us connect with donors globally, ensuring hundreds of mountain children continue their education.',
      author: 'Foundation Executive Board',
      role: 'Board of Directors',
      company: 'BSW Foundation'
    },
    featured: true,
    order: 5
  },
  {
    id: 6,
    title: 'Diamond Architects — Architecture, Engineering & Construction Platform',
    slug: 'diamond-architects',
    client_name: 'Diamond Architects',
    industry: 'Architecture, Engineering & Construction',
    category: 'Business Software',
    secondary_categories: ['Websites', 'Web Applications'],
    project_type: 'Architectural Portfolio & Engineering Consultation Platform',
    positioning_statement: 'High-end architectural portfolio showcasing residential, commercial, and structural engineering projects.',
    short_description: 'A corporate architectural and engineering platform designed for Diamond Architects, showcasing luxury residential villas, commercial complexes, interior designs, structural engineering workflows, and client consultation bookings.',
    what_we_solved: 'Transformed an offline architectural catalog into a categorized digital portfolio with 3D render showcases, 6-phase project workflows, and an architectural consultation booking portal.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2025-02-18',
    thumbnail_url: '/uploads/migrated-db_projects_5_thumbnail_url-1788627608925-415vx.png',
    screenshots: [
      'https://res.cloudinary.com/dgjuqqu4/image/upload/v1788625899/sarohub/xdq4cf3oczys1oxevcxz.png',
      '/uploads/migrated-db_projects_5_screenshots_1-1788627608926-w75um.png',
      '/uploads/migrated-db_projects_5_screenshots_2-1788627608926-le5dm.png',
      '/uploads/migrated-db_projects_5_screenshots_3-1788627608927-bimo4.png'
    ],
    live_url: 'https://diamondarchitects.com.pk/',
    overview: {
      client_background: 'Diamond Architects is an established architecture, structural engineering, and construction firm delivering residential villas, commercial complexes, religious architecture, and interior design.',
      industry_context: 'Architecture, Structural Engineering & Turnkey Construction',
      what_sarohub_built: 'SaroHub engineered a corporate portfolio website featuring categorized design galleries, detailed project pages, service breakdowns (from soil testing to site supervision), and consultation request workflows.',
      project_importance: 'High-value commercial developers and residential property owners needed to evaluate the firm\'s craftsmanship, architectural methodology, and verified credentials before commissioning multi-million dollar projects.'
    },
    challenges: [
      {
        title: 'Multi-Disciplinary Service Clarity',
        description: 'Explaining diverse services spanning architecture, soil testing, town planning, interior design, and turnkey construction.'
      },
      {
        title: 'High-Resolution Portfolio Presentation',
        description: 'Displaying large architectural renders and construction photography without degrading page loading performance.'
      },
      {
        title: 'Client Consultation Intake',
        description: 'Capturing specific project requirements such as plot dimensions, architectural style, and budget tiers from prospective clients.'
      }
    ],
    solutions: [
      {
        title: 'Structured Category Filtering',
        description: 'Instant filtering across Residential, Commercial, Interior Design, and Civic/Religious portfolios.'
      },
      {
        title: 'End-to-End Architectural Workflow',
        description: 'Visual step-by-step presentation of the firm\'s 6-phase project lifecycle from concept sketches to turnkey handover.'
      },
      {
        title: 'Project Consultation Request Engine',
        description: 'Interactive inquiry forms allowing clients to specify plot sizes, project typology, budget tiers, and reference files.'
      },
      {
        title: 'Credibility & Credentials Hub',
        description: 'Displaying licensed engineering certifications, municipal affiliations, and team achievements.'
      }
    ],
    features: [
      'Residential, Commercial & Interior Project Portfolios',
      'High-Resolution Architectural Renders & Photography',
      'End-to-End Architectural Workflow Presentation',
      'Structural Engineering & Soil Testing Service Details',
      'Interactive Client Consultation Request Engine',
      'Team Profiles & Professional Certifications',
      'WhatsApp Direct Consultation Link'
    ],
    sarohub_role: [
      'Architectural Brand & Digital Design',
      'High-Performance Frontend Development',
      'Responsive Image Optimization Pipeline',
      'Client Lead Capture Integration'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'MySQL',
      architecture: 'Modern Responsive Architecture Portfolio with Next-Gen Image Optimization',
      tags: ['React.js', 'Tailwind CSS', 'Architecture Portfolio', 'Web Development']
    },
    results_impact: {
      metrics: [
        { metric: '4 Categories', label: 'Organized Design Portfolio', detail: 'Residential, Commercial, Interior, and Civic Architecture.' },
        { metric: '6 Phases', label: 'Documented Project Workflow', detail: 'From initial soil testing to final turnkey handover.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Higher Quality Commercial Leads',
          description: 'Streamlined consultation forms attracted higher-value commercial developers and private villa builders.'
        },
        {
          title: 'Elevated Architectural Credibility',
          description: 'Organized portfolio presentation established Diamond Architects as a premier regional design and construction firm.'
        },
        {
          title: 'Faster Project Onboarding',
          description: 'Structured intake workflows reduced preliminary consultation alignment from days to hours.'
        }
      ]
    },
    testimonial: {
      quote: 'The website built by SaroHub has elevated our corporate image tremendously. Clients now review our project portfolios and design process before our first meeting, which makes closing deals much faster.',
      author: 'Principal Architect & MD',
      role: 'Managing Director',
      company: 'Diamond Architects'
    },
    featured: true,
    order: 6
  },
  {
    id: 7,
    title: 'Apex Performance & Growth — Multi-Channel Digital Marketing & SEO Campaign',
    slug: 'apex-growth-marketing',
    client_name: 'Apex Retail Group',
    industry: 'E-Commerce & Consumer Retail',
    category: 'Digital Marketing',
    secondary_categories: ['E-commerce / Commerce', 'Web Applications'],
    project_type: 'Multi-Channel Performance Marketing, Technical SEO & Paid Ads Campaign',
    positioning_statement: 'High-ROAS Google & Meta performance ad engine with conversion rate optimization and technical SEO.',
    short_description: 'Full-funnel digital marketing campaign executed by SaroHub: restructured Google Search/Shopping ads, deployed Meta lookalike funnels, resolved critical SEO indexation bottlenecks, and configured automated email recovery workflows.',
    what_we_solved: 'Eliminated wasted ad spend by restructuring campaigns, resolving technical SEO crawl errors, and engineering high-converting landing pages that elevated ROAS from 1.4x to 4.6x.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-07-10',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://apexretail.com',
    overview: {
      client_background: 'Apex Retail Group is a fast-scaling multi-category consumer e-commerce retailer offering lifestyle goods, electronics, and home essentials.',
      industry_context: 'Digital Commerce, Paid Media & Multi-Channel Acquisition',
      what_sarohub_built: 'SaroHub architected and executed an end-to-end digital marketing growth engine: paid media restructuring across Google Ads and Meta, server-side Conversion API (CAPI) attribution, technical SEO remediation, and high-converting landing page redesigns.',
      project_importance: 'Rising customer acquisition costs and low organic visibility were eroding margins. Apex required a proven digital growth partner to optimize paid spend, maximize ROAS, and establish sustainable organic search dominance.'
    },
    challenges: [
      {
        title: 'Unprofitable Ad Spend (1.4x ROAS)',
        description: 'Previous ad campaigns targeted broad, unqualified keywords and unsegmented audiences, burning budget without generating profitable purchases.'
      },
      {
        title: 'High Landing Page Bounce Rates',
        description: 'Visitors were bouncing within 5 seconds due to slow mobile loading speeds, cluttered navigation, and friction in the checkout funnel.'
      },
      {
        title: 'Inaccurate Conversion Attribution',
        description: 'Browser cookie blocking and missing server-side event tracking caused significant data loss in Google Analytics and Meta Ads Manager.'
      },
      {
        title: 'Depressed Organic Visibility',
        description: 'Over 4,000 product pages were poorly indexed due to canonicalization issues, missing schema markup, and sluggish Core Web Vitals.'
      }
    ],
    solutions: [
      {
        title: 'Full-Funnel Paid Advertising Engine',
        description: 'Restructured Google Search, Shopping, Performance Max, and Meta lookalike audience funnels with strict negative keyword lists and creative testing sprints.'
      },
      {
        title: 'Conversion Rate Optimization (CRO)',
        description: 'Engineered lightweight, mobile-first product landing pages and a streamlined single-page checkout that improved conversion rate from 1.2% to 3.4%.'
      },
      {
        title: 'Server-Side CAPI & GA4 Attribution',
        description: 'Deployed Google Tag Manager server-side containers and Meta Conversions API to recover 100% of purchase event signals with zero cookie loss.'
      },
      {
        title: 'Technical SEO & Content Architecture',
        description: 'Audited and fixed crawl errors, deployed rich Product and Breadcrumb JSON-LD schema, and targeted high-intent commercial search terms.'
      }
    ],
    features: [
      'Google Search, Shopping & Performance Max Campaigns',
      'Meta (Facebook & Instagram) Dynamic Product Retargeting',
      'Server-Side Conversion API (CAPI) & GA4 Attribution',
      'Technical SEO Audit, Schema Markup & Crawl Optimization',
      'High-Converting Landing Page UI/UX & A/B Testing',
      'Automated Klaviyo Email Abandoned Cart Sequences',
      'Weekly Transparent ROAS, CPA & Spend Analytics Portal',
      'Iterative Creative Ad Copy & Video Reels Production'
    ],
    sarohub_role: [
      'Digital Marketing Strategy',
      'Paid Ads Campaign Architecture',
      'Technical SEO Implementation',
      'Conversion Rate Optimization (CRO)',
      'Server-Side Event Tagging & Analytics',
      'Landing Page UX Engineering',
      'Performance Reporting & Optimization'
    ],
    technologies: {
      frontend: 'Google Ads, Meta Ads Manager',
      backend: 'Google Tag Manager Server Container',
      database: 'Google Analytics 4 & BigQuery',
      architecture: 'Full-Funnel Growth & Multi-Touch Attribution Engine',
      tags: ['Google Ads', 'Meta Ads', 'Google Analytics 4', 'Google Tag Manager', 'SEMrush', 'Technical SEO', 'Klaviyo', 'CRO']
    },
    results_impact: {
      metrics: [
        { metric: '4.6x', label: 'Average ROAS', detail: 'Increased return on ad spend across Google and Meta paid channels.' },
        { metric: '+340%', label: 'Organic Traffic Growth', detail: 'Substantial surge in non-branded organic search impressions and clicks.' },
        { metric: '-42%', label: 'Reduced CAC', detail: 'Lowered customer acquisition cost through conversion rate optimization.' },
        { metric: '18,500+', label: 'Orders Generated', detail: 'Direct purchase conversions driven through optimized campaigns.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Predictable Customer Acquisition',
          description: 'Replaced erratic ad results with a predictable, scalable customer acquisition machine that consistently delivers positive unit economics.'
        },
        {
          title: 'Authoritative Organic Ranking',
          description: 'Achieved first-page rankings on Google for high-converting category keywords, creating an evergreen stream of free customer traffic.'
        },
        {
          title: 'Complete Data Transparency',
          description: 'Empowered executive leadership with real-time attribution dashboards showing exact ROAS, CPA, and customer lifetime value per ad dollar.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub revolutionized our customer acquisition. In three months, our ROAS climbed from 1.4x to over 4.6x while our organic search traffic tripled. They don\'t just run ads—they understand unit economics, conversion psychology, and technical tracking.',
      author: 'Marcus Vance',
      role: 'Chief Commercial Officer',
      company: 'Apex Retail Group'
    },
    featured: true,
    order: 2
  },
  {
    id: 8,
    title: 'The Crescent Hospitality — Tourism SEO & Paid Booking Acquisition Campaign',
    slug: 'crescent-digital-marketing',
    client_name: 'The Crescent Resorts & Hospitality',
    industry: 'Hospitality & Luxury Tourism',
    category: 'Digital Marketing',
    secondary_categories: ['Hospitality', 'Websites'],
    project_type: 'Local SEO, Google Travel Ads & Social Media Marketing Campaign',
    positioning_statement: 'Targeted hospitality marketing driving a 210% increase in direct resort bookings.',
    short_description: 'A multi-channel tourism marketing campaign combining Google Local 3-Pack optimization, Google Travel ads, high-intent travel keyword content, and targeted Meta video campaigns to acquire direct guests with zero OTA commission.',
    what_we_solved: 'Freed the resort from paying 18-22% commissions to third-party travel agencies (OTAs) by establishing a high-converting direct booking acquisition engine.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-06-18',
    thumbnail_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://thecrescentresorts.com',
    overview: {
      client_background: 'The Crescent Resorts operates luxury boutique resort destinations in northern Pakistan, catering to domestic travelers, international adventurers, and corporate retreats.',
      industry_context: 'Hospitality Digital Marketing, Local SEO & Travel Acquisition',
      what_sarohub_built: 'SaroHub implemented a regional and international digital marketing campaign combining Google Business Profile optimization, localized high-intent travel keyword SEO, targeted Meta travel reels, and automated booking inquiry routing.',
      project_importance: 'The resort was losing significant profit margins to third-party online travel agencies (OTAs) taking up to 22% in commission fees. They needed a high-performance direct digital marketing channel.'
    },
    challenges: [
      {
        title: 'Heavy OTA Commission Dependency',
        description: 'Over 80% of bookings came through third-party platforms charging exorbitant 18-22% commissions per stay.'
      },
      {
        title: 'Underdeveloped Local & Regional Search Presence',
        description: 'The resort was missing out on travelers searching for luxury resort stays, honeymoon packages, and mountain retreats on Google Maps.'
      },
      {
        title: 'Seasonal Demand Volatility',
        description: 'Inconsistent off-season bookings led to unoptimized occupancy rates during shoulder months.'
      }
    ],
    solutions: [
      {
        title: 'Local SEO & Google 3-Pack Optimization',
        description: 'Optimized Google Business Profiles, citation directories, and localized hotel schema markup, securing #1 rankings for northern resort searches.'
      },
      {
        title: 'Google Travel & Search Ads',
        description: 'Launched targeted pay-per-click ads for high-intent search terms (e.g. "luxury resort Skardu", "best hotel Shangrila", "honeymoon suites").'
      },
      {
        title: 'Meta Visual Storytelling & Reels Ads',
        description: 'Created scenic, experiential video reels targeting adventure travelers and corporate event planners in major metropolitan cities.'
      }
    ],
    features: [
      'Google Business Profile & Local 3-Pack Domination',
      'Targeted Google Search & Travel Hotel Campaigns',
      'Meta Experiential Video & Story Ads',
      'Direct WhatsApp Booking Fast-Track Integration',
      'Seasonal Corporate Retreat & Honeymoon Campaign Funnels',
      'Review Management & Reputation Growth Workflow'
    ],
    sarohub_role: [
      'Tourism Marketing Strategy',
      'Local SEO & Google Maps Optimization',
      'Paid Search & Social Media Advertising',
      'Ad Creative Direction & Video Reels Production',
      'Lead Generation & Booking Optimization'
    ],
    technologies: {
      frontend: 'Google Ads, Meta Business Manager',
      backend: 'Google Business Profile API',
      database: 'Google Analytics 4 & Looker Studio',
      architecture: 'Direct Hospitality Booking Funnel',
      tags: ['Local SEO', 'Google Ads', 'Meta Ads', 'Tourism Marketing', 'Google Maps', 'Hospitality Growth']
    },
    results_impact: {
      metrics: [
        { metric: '+210%', label: 'Direct Bookings Boost', detail: 'Dramatic growth in commission-free guest reservations.' },
        { metric: '#1 Rank', label: 'Google Local 3-Pack', detail: 'Top position for primary regional luxury hospitality searches.' },
        { metric: '3.8x', label: 'Ad Spend ROAS', detail: 'Return on ad spend across seasonal holiday campaigns.' },
        { metric: '120k+', label: 'Targeted Video Views', detail: 'Engaged potential luxury travelers across Instagram and Facebook.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Direct Revenue Independence',
          description: 'Reduced reliance on costly travel agencies, saving substantial commission fees each tourist season.'
        },
        {
          title: 'Elevated Brand Prestige',
          description: 'Established the resort as the premier luxury destination in the region through consistent, high-aesthetic visual marketing.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub\'s digital marketing and local SEO strategy transformed our revenue model. Over 65% of our seasonal suite reservations now come directly through our own channels rather than costly travel agency portals.',
      author: 'Karim Shah',
      role: 'General Manager',
      company: 'The Crescent Resorts'
    },
    featured: true,
    order: 3
  }
];

// Helper functions
export function getAllClientProjects(): ClientProject[] {
  return [...CLIENT_PROJECTS].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getClientProjectBySlug(slug: string): ClientProject | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return CLIENT_PROJECTS.find(p => 
    p.slug.toLowerCase() === normalized || 
    String(p.id) === normalized
  );
}

// Available categories that actually have projects
export const STANDARD_CATEGORIES = [
  'All',
  'Digital Marketing',
  'Web Applications',
  'Websites',
  'SaaS',
  'Business Software',
  'E-commerce / Commerce',
  'Hospitality',
  'Retail',
  'Education',
  'Other'
] as const;

export function getAvailableCategories(projectsList: ClientProject[] = CLIENT_PROJECTS): string[] {
  const activeSet = new Set<string>();
  
  projectsList.forEach(p => {
    if (p.category) activeSet.add(p.category);
    if (Array.isArray(p.secondary_categories)) {
      p.secondary_categories.forEach(c => activeSet.add(c));
    }
  });

  // Keep standard ordering, only including categories that have projects
  const available: string[] = ['All'];
  STANDARD_CATEGORIES.forEach(cat => {
    if (cat !== 'All' && activeSet.has(cat)) {
      available.push(cat);
    }
  });

  // Also catch any custom admin categories that might exist
  activeSet.forEach(cat => {
    if (!available.includes(cat)) {
      available.push(cat);
    }
  });

  return available;
}
