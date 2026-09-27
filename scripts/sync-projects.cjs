const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// High-fidelity structured client projects matching all requirements
const projects = [
  {
    id: 1,
    title: 'Waziri Mobile',
    slug: 'waziri-mobile',
    client_name: 'Waziri Mobile',
    industry: 'Mobile & Electronics',
    category: 'E-commerce / Commerce',
    secondary_categories: ['Web Applications', 'Retail'],
    project_type: 'Custom Web Application & Mobile Ordering',
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
    gallery: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://wazirimobile.com',
    description: 'Waziri Mobile is a premier retail provider of smartphones, consumer electronics, and mobile accessories. SaroHub engineered a custom, high-speed digital catalog and ordering web application that allows customers to explore multi-variant phone specs, check availability, and place orders directly.',
    problem_challenge: 'Limited Digital Presence: The business needed a stronger online presence to reach smartphone buyers beyond walk-in foot traffic.\nProduct Visibility: Customers needed an easier way to discover available smartphone models, colors, memory variants, and pricing.\nCustomer Accessibility: Product information, warranty policies, and device specifications needed to be accessible online 24/7.\nScattered Information: Stock details and pricing inquiries were managed manually over WhatsApp, creating customer wait times and lost orders.',
    solution: 'Custom Digital Platform: A purpose-built web application designed directly around Waziri Mobile\'s sales and customer engagement flow.\nProduct Showcase: Structured presentation of smartphones, tablets, audio accessories, and genuine warranties with multi-angle photos.\nResponsive Experience: Optimized for mobile smartphones, tablets, and desktop computers for fast, on-the-go browsing.\nScalable Architecture: Built with a flexible MERN stack foundation that can support upcoming branch expansions and digital payments.',
    overview: {
      client_background: 'Waziri Mobile is a recognized regional retailer supplying smartphones, smart devices, and consumer tech accessories across northern commercial hubs.',
      industry_context: 'Consumer Electronics & Telecommunications Retail',
      what_sarohub_built: 'SaroHub architected a high-speed digital catalog, multi-variant filter engine, customer inquiry conduit, and central stock management portal.',
      project_importance: 'Rising customer inquiry volume through physical visits and scattered messaging required a modern digital platform to showcase new smartphone models, verify stock, and streamline retail orders.'
    },
    challenges: [
      { title: 'Limited Digital Presence', description: 'The business needed a stronger online presence to reach smartphone buyers beyond walk-in foot traffic.' },
      { title: 'Product Visibility', description: 'Customers needed an easier way to discover available smartphone models, colors, memory variants, and pricing.' },
      { title: 'Customer Accessibility', description: 'Product information, warranty policies, and device specifications needed to be accessible online 24/7.' },
      { title: 'Scattered Information', description: 'Stock details and pricing inquiries were managed manually over WhatsApp, creating customer wait times and lost orders.' }
    ],
    solutions: [
      { title: 'Custom Digital Platform', description: 'A purpose-built web application designed directly around Waziri Mobile\'s sales and customer engagement flow.' },
      { title: 'Product Showcase', description: 'Structured presentation of smartphones, tablets, audio accessories, and genuine warranties with multi-angle photos.' },
      { title: 'Responsive Experience', description: 'Optimized for mobile smartphones, tablets, and desktop computers for fast, on-the-go browsing.' },
      { title: 'Scalable Architecture', description: 'Built with a flexible MERN stack foundation that can support upcoming branch expansions and digital payments.' }
    ],
    key_features: [
      'Interactive Product Catalog with Instant Search',
      'Multi-Variant Specification & Storage Filter',
      'Direct WhatsApp & Call Ordering Conduit',
      'Live Branch Inventory Availability Indicators',
      'Responsive Mobile-First Interface',
      'Promotional Banners & Deal Highlights',
      'Admin Catalog & Inventory Control Dashboard',
      'Customer Product Inquiry Tracker'
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
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MERN Stack', 'Tailwind CSS'],
    results_impact: [
      { metric: '+65%', label: 'Inquiry Response Speed', detail: 'Faster customer device discovery and order confirmation times.' },
      { metric: '10,000+', label: 'Monthly Catalog Browses', detail: 'Customers viewing live phone models and accessory inventory.' }
    ],
    testimonial: {
      quote: 'SaroHub delivered exactly what our business needed. Customers now browse our stock online before visiting, and our inquiry response time has improved dramatically.',
      author: 'Management Team',
      role: 'Managing Director',
      company: 'Waziri Mobile'
    },
    featured: true,
    order: 1,
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-20T10:00:00Z'
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
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://thecrescentresorts.com',
    description: 'The Crescent Resorts is a premier luxury hospitality and retreat provider catering to tourists, families, and corporate gatherings. SaroHub built an enterprise hospitality platform combining a guest-facing direct booking engine with back-office room inventory, guest folios, and amenity scheduling.',
    problem_challenge: 'Manual Booking Conflicts: Managing reservations through phone calls and paper ledgers led to overlap risks during peak holiday travel periods.\nLimited Online Room Showcase: Prospective travelers could not view high-resolution room photos, balcony vistas, amenities, and seasonal rates.\nHigh Third-Party Commissions: Over-reliance on external hotel aggregator portals drained significant profit margins from direct bookings.\nFragmented Guest Folios: Room charges, dining receipts, and excursion arrangements were tracked across separate systems, slowing checkout.',
    solution: 'Custom Digital Platform: A bespoke hospitality platform integrating front-desk reservation management with customer-facing booking.\nRoom & Amenity Showcase: Visual presentations of executive suites, family chalets, mountain dining, and guided excursion itineraries.\nResponsive Experience: Streamlined mobile booking interface optimized for tourists researching accommodations while traveling.\nScalable Architecture: Engineered with atomic transactional locking to guarantee zero double-bookings under concurrent traffic.',
    overview: {
      client_background: 'The Crescent Resorts is a premier hospitality provider operating scenic boutique hotels and retreat properties serving vacationers and corporate groups.',
      industry_context: 'Hospitality, Luxury Tourism & Leisure',
      what_sarohub_built: 'SaroHub built an enterprise hospitality platform combining a guest-facing direct booking engine with back-office room inventory, guest folios, and amenity scheduling.',
      project_importance: 'During high-demand peak travel seasons, telephone reservations and spreadsheet tracking created double-booking risks and billing delays. The resort required a reliable digital booking engine to capture direct guest revenue.'
    },
    challenges: [
      { title: 'Manual Booking Conflicts', description: 'Managing reservations through phone calls and paper ledgers led to overlap risks during peak holiday travel periods.' },
      { title: 'Limited Online Room Showcase', description: 'Prospective travelers could not view high-resolution room photos, balcony vistas, amenities, and seasonal rates.' },
      { title: 'High Third-Party Commissions', description: 'Over-reliance on external hotel aggregator portals drained significant profit margins from direct bookings.' },
      { title: 'Fragmented Guest Folios', description: 'Room charges, dining receipts, and excursion arrangements were tracked across separate systems, slowing checkout.' }
    ],
    solutions: [
      { title: 'Custom Digital Platform', description: 'A bespoke hospitality platform integrating front-desk reservation management with customer-facing booking.' },
      { title: 'Room & Amenity Showcase', description: 'Visual presentations of executive suites, family chalets, mountain dining, and guided excursion itineraries.' },
      { title: 'Responsive Experience', description: 'Streamlined mobile booking interface optimized for tourists researching accommodations while traveling.' },
      { title: 'Scalable Architecture', description: 'Engineered with atomic transactional locking to guarantee zero double-bookings under concurrent traffic.' }
    ],
    key_features: [
      'Interactive Room Availability Calendar',
      'Direct Guest Reservation & Inquiry Engine',
      'High-Resolution Room & Suite Gallery',
      'Multi-Tier Seasonal Pricing Management',
      'Automated Confirmation Notifications',
      'Dining, Conference & Excursion Showcase',
      'Front-Desk Guest Folio & Check-In Portal',
      'Executive Occupancy & Revenue Reporting'
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
    technologies: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Tailwind CSS'],
    results_impact: [
      { metric: '0%', label: 'Double Booking Collision Rate', detail: 'Complete elimination of reservation overlap errors.' },
      { metric: '+48%', label: 'Direct Bookings Increase', detail: 'Substantially reduced reliance on high-fee third-party booking agents.' }
    ],
    testimonial: {
      quote: 'SaroHub gave us a direct booking system that transformed our operations. Double bookings are completely gone, and our direct inquiries from tourists have grown each month.',
      author: 'General Manager',
      role: 'Resort General Manager',
      company: 'The Crescent Resorts'
    },
    featured: true,
    order: 2,
    created_at: '2026-05-15T10:00:00Z',
    updated_at: '2026-05-15T10:00:00Z'
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
    gallery: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://vg4superstore.com',
    description: 'VG4 Super Store is a high-volume department retail store handling thousands of customer transactions daily across groceries, electronics, and household goods. SaroHub engineered a multi-terminal Point of Sale (POS) system with sub-50ms barcode scanning, local offline resilience, and centralized warehouse inventory management.',
    problem_challenge: 'Long Checkout Queues: Slow billing software caused long checkout queues during peak evening shopping hours.\nOffline Vulnerability: Network or power disruptions froze terminals, stopping sales and receipt printing.\nWarehouse Stock Blindspots: Lack of real-time inventory synchronization between the shop floor and warehouse storage.\nCashier Shift Discrepancies: Manual register closing led to reconciliation errors and delayed daily accounting.',
    solution: 'Custom Digital Platform: A purpose-built retail checkout platform designed specifically around cashier speed and keyboard hotkeys.\nOffline-First Architecture: Integrated local cache enabling checkout registers to operate continuously even during network outages.\nReal-Time Inventory Hub: Normalized database tracking thousands of SKUs across multiple terminals and backroom storage.\nScalable Architecture: Engineered with optimized SQL indexing capable of handling high daily transaction volume with zero lag.',
    overview: {
      client_background: 'VG4 Super Store is a high-volume department retail store handling thousands of customer transactions daily across groceries, electronics, and household goods.',
      industry_context: 'Supermarket & FMCG Retail Distribution',
      what_sarohub_built: 'SaroHub engineered a multi-terminal Point of Sale (POS) system with sub-50ms barcode scanning, local offline resilience, and centralized warehouse inventory management.',
      project_importance: 'Peak shopping hours caused checkout congestion and customer frustration. The legacy software crashed during connectivity drops and could not reconcile shelf stock with the central warehouse.'
    },
    challenges: [
      { title: 'Long Checkout Queues', description: 'Slow billing software caused long checkout queues during peak evening shopping hours.' },
      { title: 'Offline Vulnerability', description: 'Network or power disruptions froze terminals, stopping sales and receipt printing.' },
      { title: 'Warehouse Stock Blindspots', description: 'Lack of real-time inventory synchronization between the shop floor and warehouse storage.' },
      { title: 'Cashier Shift Discrepancies', description: 'Manual register closing led to reconciliation errors and delayed daily accounting.' }
    ],
    solutions: [
      { title: 'Custom Digital Platform', description: 'A purpose-built retail checkout platform designed specifically around cashier speed and keyboard hotkeys.' },
      { title: 'Offline-First Architecture', description: 'Integrated local cache enabling checkout registers to operate continuously even during network outages.' },
      { title: 'Real-Time Inventory Hub', description: 'Normalized database tracking thousands of SKUs across multiple terminals and backroom storage.' },
      { title: 'Scalable Architecture', description: 'Engineered with optimized SQL indexing capable of handling high daily transaction volume with zero lag.' }
    ],
    key_features: [
      'Sub-50ms Barcode Scanning & Keyboard Shortcuts',
      'Offline-First Local Sales Transaction Cache',
      'Thermal Receipt Printing & Digital SMS Invoices',
      'Automated Low-Stock Alerts & Reorder Reports',
      'Multi-Terminal Cashier Shift Reconciliation',
      'Multi-Category Warehouse Inventory Management',
      'Daily Sales, Profit Margins & Gross Telemetry',
      'Role-Based Permissions (Cashier, Manager, Admin)'
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
    technologies: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'WebSockets', 'Tailwind CSS'],
    results_impact: [
      { metric: '55%', label: 'Checkout Time Reduction', detail: 'Dramatically shortened cashier transaction queues.' },
      { metric: '5,000+', label: 'Daily Transactions Processed', detail: 'Continuous high-volume checkout with zero system downtime.' }
    ],
    testimonial: {
      quote: 'SaroHub\'s POS system changed how our store operates. Register lines move rapidly, the software never freezes when the internet drops, and stock counts are always accurate.',
      author: 'Supermarket Management',
      role: 'Operations Lead',
      company: 'VG4 Super Store'
    },
    featured: true,
    order: 3,
    created_at: '2026-06-10T10:00:00Z',
    updated_at: '2026-06-10T10:00:00Z'
  },
  {
    id: 4,
    title: 'Vanguard ERP Systems Suite',
    slug: 'vanguard-erp-systems',
    client_name: 'Vanguard Heavy Industries',
    industry: 'Heavy Manufacturing & Logistics',
    category: 'Business Software',
    secondary_categories: ['SaaS'],
    project_type: 'Enterprise Resource Planning (ERP)',
    positioning_statement: 'Unified ERP platform streamlining procurement, logistics, and multi-facility inventory.',
    short_description: 'A unified enterprise resource planning suite built to connect inventory, industrial procurement, and cross-facility logistics into a single real-time control center.',
    what_we_solved: 'Consolidated fragmented procurement spreadsheets into an automated enterprise resource planning platform.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-04-12',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://vanguard-erp.demo.sarohub.com',
    description: 'Vanguard Heavy Industries operates multi-facility industrial fabrication plants. SaroHub built an enterprise ERP suite integrating procurement pipelines, multi-warehouse stock audits, vendor purchase orders, and asset maintenance.',
    problem_challenge: 'Fragmented Operations: Plant managers and procurement teams lacked a synchronized system to verify stock across regional facilities.\nSlow Record Retrieval: Database query times for historical supply transactions hindered timely purchasing decisions.\nComplex Audit Trails: Verifying purchase orders and vendor payments required tedious manual reconciliation.',
    solution: 'Custom Digital Platform: An integrated ERP system linking procurement, production floor inventory, and vendor accounts.\nHigh-Performance Database: Normalized relational database architecture delivering sub-second reporting across enterprise records.\nStrict Access Controls: Role-based permission hierarchy keeping sensitive operational metrics secure.\nScalable Architecture: Containerized deployment capable of onboarding additional manufacturing plants with zero downtime.',
    key_features: [
      'Centralized Multi-Facility Inventory Matrix',
      'Automated Purchase Order & Vendor Workflow',
      'Equipment Maintenance Schedule & Log Tracker',
      'Executive KPI Dashboards & Real-Time Telemetry',
      'Immutable Audit Trail for Regulatory Compliance',
      'Automated Financial Closing & Invoice Dispatch'
    ],
    features: [
      'Centralized Multi-Facility Inventory Matrix',
      'Automated Purchase Order & Vendor Workflow',
      'Equipment Maintenance Schedule & Log Tracker',
      'Executive KPI Dashboards & Real-Time Telemetry',
      'Immutable Audit Trail for Regulatory Compliance',
      'Automated Financial Closing & Invoice Dispatch'
    ],
    sarohub_role: [
      'UI/UX Design',
      'System Architecture',
      'Frontend Engineering',
      'Backend Development',
      'Database Optimization',
      'DevOps & Container Deployment',
      'Security & Audit Verification',
      'Enterprise SLA Support'
    ],
    technologies: ['React.js', 'Node.js', 'MySQL', 'Kubernetes', 'Tailwind CSS'],
    results_impact: [
      { metric: '72%', label: 'Record Lookup Speed Improvement', detail: 'Drastic reduction in database query latency across logistics hubs.' }
    ],
    featured: true,
    order: 4,
    created_at: '2026-04-12T10:00:00Z',
    updated_at: '2026-04-12T10:00:00Z'
  },
  {
    id: 5,
    title: 'Apex E-Commerce Ecosystem',
    slug: 'apex-ecom-ecosystem',
    client_name: 'Apex Global Logistics',
    industry: 'Global Retail & Logistics',
    category: 'E-commerce / Commerce',
    secondary_categories: ['Web Applications'],
    project_type: 'High-Traffic E-Commerce Platform',
    positioning_statement: 'High-speed online shopping platform built to handle heavy visitor volume.',
    short_description: 'A high-speed e-commerce storefront engineered to process high visitor volume smoothly with integrated payment gateways and automated shipping routing.',
    what_we_solved: 'Built an optimized, high-concurrency online storefront with automated courier dispatch to prevent flash-sale cart crashes.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-06-15',
    thumbnail_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://apex-retail.demo.sarohub.com',
    description: 'Apex Global Logistics is an international commerce partner distributing consumer products and apparel. SaroHub built a frictionless consumer storefront featuring instantaneous catalog search, secure payment processing, and automated warehouse picking labels.',
    problem_challenge: 'Traffic Surges & Downtime: Seasonal promotions overwhelmed existing servers, causing checkout slowdowns and purchase drops.\nCheckout Friction: Multi-step forms caused elevated cart abandonment rates among mobile buyers.\nManual Order Dispatch: Orders had to be manually entered into courier systems, creating fulfillment delays.',
    solution: 'High-Concurrency Storefront: Engineered with optimized server caching to handle thousands of simultaneous shoppers.\nStreamlined Payment Gateway: Implemented 1-click accelerated checkout with automated fraud screening.\nAutomated Courier Webhooks: Successful orders automatically push dispatch manifests to fulfillment partner depots.\nScalable Architecture: Modular microservice design prepared for multi-currency expansion and localized storefronts.',
    key_features: [
      'High-Concurrency Flash-Sale Storefront',
      '1-Click Streamlined Mobile Checkout',
      'Automated Fraud & Transaction Verification',
      'Real-Time Warehouse Stock Availability',
      'Courier Tracking & SMS Delivery Updates',
      'Customer Account & Order History Portal'
    ],
    features: [
      'High-Concurrency Flash-Sale Storefront',
      '1-Click Streamlined Mobile Checkout',
      'Automated Fraud & Transaction Verification',
      'Real-Time Warehouse Stock Availability',
      'Courier Tracking & SMS Delivery Updates',
      'Customer Account & Order History Portal'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend API Development',
      'Payment Gateway Integration',
      'Performance Optimization',
      'Cloud Scalability Testing'
    ],
    technologies: ['React.js', 'Express.js', 'MySQL', 'Stripe API', 'Tailwind CSS'],
    featured: false,
    order: 5,
    created_at: '2026-06-15T10:00:00Z',
    updated_at: '2026-06-15T10:00:00Z'
  },
  {
    id: 6,
    title: 'Aura AI Cognitive Agent',
    slug: 'aura-ai-agent',
    client_name: 'Aura Financial Advisory',
    industry: 'Financial Advisory & Compliance',
    category: 'SaaS',
    secondary_categories: ['Web Applications'],
    project_type: 'Intelligent Compliance & Analytics Suite',
    positioning_statement: 'Intelligent financial assistant automating regulatory compliance and data analysis.',
    short_description: 'An intelligent enterprise software assistant that automates compliance auditing, financial forecasting, and regulatory filing verification.',
    what_we_solved: 'Automated multi-hundred page compliance audits and forecasting into an interactive AI-assisted executive dashboard.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-05-30',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://aura-ai.demo.sarohub.com',
    description: 'Aura Financial Advisory provides wealth management and compliance services. SaroHub engineered a secure document ingestion and cognitive analysis platform that flags compliance risks and generates structured executive briefs.',
    problem_challenge: 'Manual Audit Overhead: Reading multi-hundred-page corporate balance sheets and tax disclosures manually created turnaround bottlenecks.\nRisk of Human Oversight: Crucial regulatory clauses and fine-print amendments could be overlooked during rush filing windows.\nStrict Data Privacy: Financial documents required zero-retention processing with strict confidentiality guarantees.',
    solution: 'Custom Cognitive Platform: A purpose-built financial intelligence suite leveraging secure document embedding and contextual parsing.\nVisual Executive Dashboards: Instant visualization of liquidity ratios, compliance flags, and multi-year forecasting models.\nSecure Ingestion Pipeline: Zero data retention protocols ensuring client financial records are never used for model training.\nScalable Architecture: Built with asynchronous processing queues capable of parsing multiple large filings simultaneously.',
    key_features: [
      'Automated Corporate Filing Ingestion & Parsing',
      'Regulatory Compliance Flagging & Citation Links',
      'Interactive Cashflow & Capital Forecasting',
      'Executive Summary PDF Export Generator',
      'Role-Based Analyst Permissions & Audit Trail'
    ],
    features: [
      'Automated Corporate Filing Ingestion & Parsing',
      'Regulatory Compliance Flagging & Citation Links',
      'Interactive Cashflow & Capital Forecasting',
      'Executive Summary PDF Export Generator',
      'Role-Based Analyst Permissions & Audit Trail'
    ],
    sarohub_role: [
      'AI Systems Architecture',
      'UI/UX Design',
      'Frontend & Backend Engineering',
      'Vector Database Setup',
      'Privacy & Security Verification',
      'Deployment & Testing'
    ],
    technologies: ['Gemini API', 'TypeScript', 'Vector DB', 'Express.js', 'Tailwind CSS'],
    featured: false,
    order: 6,
    created_at: '2026-05-30T10:00:00Z',
    updated_at: '2026-05-30T10:00:00Z'
  }
];

dbData.projects = projects;
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('Successfully updated db.json with all', projects.length, 'projects.');
