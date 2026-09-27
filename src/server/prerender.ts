import { SERVICES_DATA, CASE_STUDIES_DATA, BLOG_ARTICLES_DATA, AEO_FAQS } from '../data/seoContent';

interface RouteSEO {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath: string;
  ogType?: string;
  ogImage?: string;
  jsonLd: Record<string, any>[];
  bodyHtml: string;
}

// Global Base Organization Schema
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SaroHub Technologies (Private) Limited',
  alternateName: ['SaroHub', 'SaroHub Technologies'],
  url: 'https://sarohub.com',
  logo: 'https://sarohub.com/assets/sarohub-logo.png',
  description: 'Entrepreneurship-driven technology company building software ventures, AI automation solutions, custom software, SaaS platforms, and enterprise digital systems.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Roshan Electric Store Building 3rd Floor, Ali Chowk',
    addressLocality: 'Skardu',
    addressRegion: 'Gilgit-Baltistan',
    postalCode: '16100',
    addressCountry: 'PK'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-355-5866875',
    contactType: 'customer service',
    email: 'info@sarohub.com',
    availableLanguage: ['English', 'Urdu']
  },
  sameAs: [
    'https://www.linkedin.com/company/sarohub',
    'https://www.facebook.com/sarohub',
    'https://twitter.com/sarohub',
    'https://github.com/sarohub'
  ],
  founder: [
    {
      '@type': 'Person',
      name: 'Ashan Perera',
      jobTitle: 'Co-Founder & CEO'
    },
    {
      '@type': 'Person',
      name: 'Ruwan Silva',
      jobTitle: 'Co-Founder & CTO'
    },
    {
      '@type': 'Person',
      name: 'Sarah Jayawardena',
      jobTitle: 'Co-Founder & Chief Product Officer'
    }
  ]
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SaroHub Technologies',
  url: 'https://sarohub.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://sarohub.com/blog?search={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

// Common Header & Nav HTML for SSR Prerendering
function renderCommonNav(): string {
  return `
    <header class="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950 text-slate-100 py-3.5 px-6">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-white font-bold text-lg font-display tracking-tight">
          <img src="/assets/sarohub-logo.png" alt="SaroHub Technologies Logo" class="h-9 w-auto" width="160" height="36" />
        </a>
        <nav aria-label="Main Navigation" class="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="/" class="hover:text-cyan-400">Home</a>
          <a href="/about" class="hover:text-cyan-400">About Us</a>
          <a href="/services" class="hover:text-cyan-400">Services</a>
          <a href="/projects" class="hover:text-cyan-400">Projects</a>
          <a href="/ventures" class="hover:text-cyan-400">Our Ventures</a>
          <a href="/marketplace" class="hover:text-cyan-400">Marketplace</a>
          <a href="/opportunities" class="hover:text-cyan-400">Opportunities</a>
          <a href="/blog" class="hover:text-cyan-400">Blog</a>
          <a href="/contact" class="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400">Contact Us</a>
        </nav>
      </div>
    </header>
  `;
}

// Common Footer HTML for SSR Prerendering
function renderCommonFooter(): string {
  return `
    <footer class="border-t border-slate-800 bg-slate-950 pt-16 pb-12 text-slate-400 text-xs px-6">
      <div class="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <a href="/" class="block mb-3">
            <img src="/assets/sarohub-logo.png" alt="SaroHub Technologies" class="h-8 w-auto" width="140" height="32" />
          </a>
          <p class="text-blue-400 font-semibold mb-3">Building Technology That Turns Ideas Into Ventures.</p>
          <p class="leading-relaxed">
            SaroHub Technologies builds digital products, delivers reliable technology solutions for businesses, and develops ambitious ventures of its own. Partnering with startups, businesses, agencies, and entrepreneurs.
          </p>
        </div>
        <div>
          <h4 class="font-bold text-white uppercase tracking-wider mb-4">Core Services</h4>
          <ul class="space-y-2">
            <li><a href="/services/ai-automation" class="hover:text-cyan-400">AI Automation Services</a></li>
            <li><a href="/services/ai-integration" class="hover:text-cyan-400">AI Integration & Custom LLMs</a></li>
            <li><a href="/services/ai-agents" class="hover:text-cyan-400">AI Agents & Chatbots</a></li>
            <li><a href="/services/custom-software-development" class="hover:text-cyan-400">Custom Software Engineering</a></li>
            <li><a href="/services/saas-development" class="hover:text-cyan-400">SaaS Product Development</a></li>
            <li><a href="/services/mobile-app-development" class="hover:text-cyan-400">Mobile App Development</a></li>
            <li><a href="/services/web-development" class="hover:text-cyan-400">Web Application Engineering</a></li>
            <li><a href="/services/crm-development" class="hover:text-cyan-400">CRM & ERP Development</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white uppercase tracking-wider mb-4">Case Studies</h4>
          <ul class="space-y-2">
            <li><a href="/projects/waziri-mobile" class="hover:text-cyan-400">Waziri Mobile Platform</a></li>
            <li><a href="/projects/the-crescent-resorts" class="hover:text-cyan-400">The Crescent Resorts ERP</a></li>
            <li><a href="/projects/vg4-super-store" class="hover:text-cyan-400">VG4 Super Store Retail POS</a></li>
            <li><a href="/projects/vanguard-erp-systems" class="hover:text-cyan-400">Vanguard ERP Systems</a></li>
            <li><a href="/projects/aura-ai-agent" class="hover:text-cyan-400">Aura AI Cognitive Agent</a></li>
            <li><a href="/projects/apex-ecom-ecosystem" class="hover:text-cyan-400">Apex E-Commerce Ecosystem</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white uppercase tracking-wider mb-4">Contact SaroHub</h4>
          <p class="mb-2"><strong>Headquarters:</strong> Roshan Electric Store Building 3rd Floor, Ali Chowk, Skardu, Gilgit-Baltistan, Pakistan</p>
          <p class="mb-2"><strong>Email:</strong> <a href="mailto:info@sarohub.com" class="text-cyan-400 hover:underline">info@sarohub.com</a></p>
          <p class="mb-2"><strong>Phone / WhatsApp:</strong> +92 355 5866875 / +92 343 0381473</p>
        </div>
      </div>
      <div class="mx-auto max-w-7xl border-t border-slate-800/80 mt-12 pt-6 text-center text-slate-500">
        &copy; ${new Date().getFullYear()} SaroHub Technologies (Private) Limited. All rights reserved.
      </div>
    </footer>
  `;
}

// Generate Route SEO & Full Semantic HTML
export function getRouteSEO(pathname: string): RouteSEO {
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';

  // 1. HOME PAGE
  if (cleanPath === '/' || cleanPath === '') {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: AEO_FAQS.slice(0, 6).map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100">
        <section class="py-24 px-6 text-center max-w-5xl mx-auto">
          <span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
            Digital Products, Technology Solutions &amp; Ventures
          </span>
          <h1 class="font-display text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Building Technology That Turns Ideas Into <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Ventures.</span>
          </h1>
          <p class="text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            SaroHub Technologies builds digital products, delivers reliable technology solutions for businesses, and develops ambitious ventures of its own. We partner with startups, businesses, agencies, and entrepreneurs to design, build, and scale modern software.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="/contact" class="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 text-sm">
              Schedule Technical Consultation
            </a>
            <a href="/services" class="px-8 py-4 rounded-xl border border-slate-700 bg-slate-900 font-semibold text-slate-200 text-sm">
              Explore Services & Verticals
            </a>
          </div>
        </section>

        <!-- Services Grid -->
        <section class="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white mb-4">Engineering Capabilities & Verticals</h2>
            <p class="text-slate-400 max-w-2xl mx-auto text-sm">
              Discover our core service offerings designed for scalable performance, enterprise security, and verified ROI.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${SERVICES_DATA.map(s => `
              <article class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 class="text-xl font-bold text-white mb-2">${s.title}</h3>
                  <p class="text-xs text-slate-400 mb-4 leading-relaxed">${s.overview.substring(0, 180)}...</p>
                </div>
                <a href="/services/${s.slug}" class="text-xs font-mono font-bold text-cyan-400 hover:underline">
                  Learn more about ${s.shortTitle} &rarr;
                </a>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- Selected Case Studies -->
        <section class="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-white mb-4">Featured Client Case Studies</h2>
            <p class="text-slate-400 max-w-2xl mx-auto text-sm">
              Real-world systems engineered and deployed by SaroHub Technologies.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${CASE_STUDIES_DATA.slice(0, 3).map(c => `
              <article class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <img src="${c.bannerImage}" alt="${c.title}" class="w-full h-48 object-cover" width="600" height="300" />
                <div class="p-6">
                  <span class="text-[10px] font-mono font-bold uppercase text-cyan-400">${c.industry}</span>
                  <h3 class="text-lg font-bold text-white mt-1 mb-2">${c.clientName}</h3>
                  <p class="text-xs text-slate-400 mb-4">${c.shortDescription}</p>
                  <a href="/projects/${c.slug}" class="text-xs font-mono font-bold text-cyan-400 hover:underline">
                    View Case Study &rarr;
                  </a>
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- AEO Q&A Section -->
        <section class="py-20 px-6 max-w-4xl mx-auto border-t border-slate-800">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p class="text-slate-400 text-sm">Direct answers about SaroHub Technologies capabilities, company overview, and engagement models.</p>
          </div>
          <div class="space-y-4">
            ${AEO_FAQS.slice(0, 6).map(faq => `
              <details class="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-sm">
                <summary class="font-bold text-white cursor-pointer">${faq.question}</summary>
                <p class="mt-3 text-slate-300 leading-relaxed text-xs sm:text-sm">${faq.answer}</p>
              </details>
            `).join('')}
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'SaroHub Technologies | Digital Products, Technology Solutions & Ventures',
      description: 'SaroHub Technologies builds digital products, delivers reliable technology solutions for businesses, and develops ambitious ventures. Based in Gilgit-Baltistan, Pakistan, building globally.',
      keywords: 'SaroHub, SaroHub Technologies, SaroHub Skardu, SaroHub Pakistan, sarohub.com, SaroHub software, SaroHub ventures, custom software development Pakistan, digital products, software engineering Skardu, Gilgit-Baltistan IT company, software company Pakistan, AI solutions, web app development, mobile app development, SaaS development, tech partner',
      canonicalPath: 'https://sarohub.com',
      ogType: 'website',
      jsonLd: [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, faqSchema],
      bodyHtml
    };
  }

  // 2. ABOUT PAGE
  if (cleanPath === '/about') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://sarohub.com/about' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100">
        <section class="py-20 px-6 text-center max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
            <a href="/" class="hover:text-cyan-400">Home</a> &gt; <span class="text-white font-semibold">About Us</span>
          </nav>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Corporate Overview
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">About SaroHub Technologies</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            SaroHub Technologies (Private) Limited is an entrepreneurship-driven technology company founded in Gilgit-Baltistan, Pakistan, building ventures, products, and software platforms for a global market.
          </p>
        </section>

        <!-- Company Mission & Specialization -->
        <section class="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">Our Vision & Core Mission</h2>
            <p class="text-sm text-slate-300 leading-relaxed mb-4">
              At SaroHub Technologies, our mission is "Building Technology That Turns Ideas Into Ventures." We are a technology company that builds digital products for clients, develops ambitious ventures of our own, and delivers reliable technology solutions for businesses, startups, entrepreneurs, and agencies worldwide.
            </p>
            <p class="text-sm text-slate-300 leading-relaxed">
              We specialize in normalized high-throughput relational databases, server-side AI model integration, mobile applications, and resilient cloud architectures.
            </p>
          </div>
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs sm:text-sm">
            <h3 class="text-lg font-bold text-white mb-2">Corporate Facts & Entity Details</h3>
            <p><strong class="text-cyan-400">Legal Entity:</strong> SaroHub Technologies (Private) Limited</p>
            <p><strong class="text-cyan-400">Headquarters:</strong> Roshan Electric Store Building 3rd Floor, Ali Chowk, Skardu, Gilgit-Baltistan, Pakistan</p>
            <p><strong class="text-cyan-400">Founders:</strong> Ashan Perera (CEO), Ruwan Silva (CTO), Sarah Jayawardena (CPO)</p>
            <p><strong class="text-cyan-400">Global Reach:</strong> Clients and partners in North America, Europe, Asia, and regional markets.</p>
            <p><strong class="text-cyan-400">Direct Inquiries:</strong> <a href="mailto:info@sarohub.com" class="text-cyan-400 hover:underline">info@sarohub.com</a> | +92 355 5866875</p>
          </div>
        </section>

        <!-- Entity Q&A for AEO -->
        <section class="py-16 px-6 max-w-4xl mx-auto border-t border-slate-800">
          <h2 class="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions About SaroHub</h2>
          <div class="space-y-4">
            ${AEO_FAQS.map(faq => `
              <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 class="font-bold text-white text-sm sm:text-base mb-2">${faq.question}</h3>
                <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">${faq.answer}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'About SaroHub Technologies | Enterprise Software & AI Ventures',
      description: 'Learn about SaroHub Technologies (Private) Limited, our leadership team, our software engineering capabilities, our IT Academy, and our venture-building mission.',
      canonicalPath: 'https://sarohub.com/about',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 3. SERVICES INDEX PAGE
  if (cleanPath === '/services') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://sarohub.com/services' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100">
        <section class="py-20 px-6 text-center max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
            <a href="/" class="hover:text-cyan-400">Home</a> &gt; <span class="text-white font-semibold">Services</span>
          </nav>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            Capabilities & Verticals
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Enterprise Software Engineering & AI Services</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            From intelligent AI automation and autonomous agents to custom full-stack software, SaaS platforms, and mobile apps, SaroHub delivers production-grade digital assets.
          </p>
        </section>

        <section class="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${SERVICES_DATA.map(s => `
              <article class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-mono font-bold uppercase text-cyan-400 mb-2 block">${s.category}</span>
                  <h2 class="text-xl font-bold text-white mb-2">${s.title}</h2>
                  <p class="text-xs text-slate-300 leading-relaxed mb-4">${s.overview.substring(0, 200)}...</p>
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    ${s.technologies.slice(0, 4).map(t => `<span class="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-cyan-300 font-mono">${t}</span>`).join('')}
                  </div>
                </div>
                <a href="/services/${s.slug}" class="text-xs font-mono font-bold text-cyan-400 hover:underline">
                  View Detailed Service Specifications &rarr;
                </a>
              </article>
            `).join('')}
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'Software Engineering & AI Automation Services | SaroHub Technologies',
      description: 'Explore SaroHub Technologies full suite of software development services: AI automation, AI agents, custom software, SaaS products, mobile apps, and business systems.',
      canonicalPath: 'https://sarohub.com/services',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 4. SPECIFIC SERVICE DETAIL PAGE (`/services/:slug`)
  if (cleanPath.startsWith('/services/')) {
    const serviceSlug = cleanPath.replace('/services/', '');
    const service = SERVICES_DATA.find(s => s.slug === serviceSlug);

    if (service) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://sarohub.com/services' },
          { '@type': 'ListItem', position: 3, name: service.shortTitle, item: `https://sarohub.com/services/${service.slug}` }
        ]
      };

      const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.overview,
        provider: {
          '@type': 'Organization',
          name: 'SaroHub Technologies (Private) Limited',
          url: 'https://sarohub.com'
        },
        serviceType: service.category,
        areaServed: 'Worldwide'
      };

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      };

      const bodyHtml = `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100">
          <section class="py-20 px-6 max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
              <a href="/" class="hover:text-cyan-400">Home</a> &gt; <a href="/services" class="hover:text-cyan-400">Services</a> &gt; <span class="text-white font-semibold">${service.shortTitle}</span>
            </nav>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
              ${service.category}
            </span>
            <h1 class="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">${service.heroHeadline}</h1>
            <p class="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">${service.heroSubheadline}</p>
            <div class="flex flex-wrap gap-4 mb-12">
              <a href="/contact" class="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">Request Technical Scoping</a>
              <a href="mailto:info@sarohub.com" class="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white font-semibold text-xs">Email info@sarohub.com</a>
            </div>
          </section>

          <section class="py-16 px-6 max-w-5xl mx-auto border-t border-slate-800">
            <h2 class="text-2xl font-bold text-white mb-4">Service Overview</h2>
            <p class="text-sm text-slate-300 leading-relaxed mb-8">${service.overview}</p>
            
            <h3 class="text-xl font-bold text-white mb-4">Operational Challenges Solved</h3>
            <ul class="space-y-2 mb-8 list-disc pl-5 text-sm text-slate-300">
              ${service.problemsSolved.map(p => `<li>${p}</li>`).join('')}
            </ul>

            <h3 class="text-xl font-bold text-white mb-4">Core Technical Capabilities</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              ${service.capabilities.map(c => `
                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 class="font-bold text-white text-sm mb-1">${c.title}</h4>
                  <p class="text-xs text-slate-400">${c.description}</p>
                </div>
              `).join('')}
            </div>

            <h3 class="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <div class="space-y-4 mb-12">
              ${service.faqs.map(f => `
                <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 class="font-bold text-white text-sm mb-2">${f.question}</h4>
                  <p class="text-xs text-slate-300 leading-relaxed">${f.answer}</p>
                </div>
              `).join('')}
            </div>
          </section>
        </main>
        ${renderCommonFooter()}
      `;

      return {
        title: service.metaTitle,
        description: service.metaDescription,
        canonicalPath: `https://sarohub.com/services/${service.slug}`,
        jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema, serviceSchema, faqSchema],
        bodyHtml
      };
    }
  }

  // 5. PROJECTS / CASE STUDIES INDEX PAGE
  if (cleanPath === '/projects') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://sarohub.com/projects' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100">
        <section class="py-20 px-6 text-center max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
            <a href="/" class="hover:text-cyan-400">Home</a> &gt; <span class="text-white font-semibold">Projects</span>
          </nav>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            Proven Deployments
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Client Case Studies & Software Deployments</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            Explore authentic case studies of bespoke software platforms, high-traffic retail systems, ERPs, and AI automation engines delivered by SaroHub Technologies.
          </p>
        </section>

        <section class="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${CASE_STUDIES_DATA.map(c => `
              <article class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between">
                <img src="${c.bannerImage}" alt="${c.title}" class="w-full h-48 object-cover" width="600" height="300" />
                <div class="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span class="text-[10px] font-mono font-bold uppercase text-cyan-400">${c.industry}</span>
                    <h2 class="text-lg font-bold text-white mt-1 mb-2">${c.clientName}</h2>
                    <p class="text-xs text-slate-400 mb-4 leading-relaxed">${c.shortDescription}</p>
                  </div>
                  <a href="/projects/${c.slug}" class="text-xs font-mono font-bold text-cyan-400 hover:underline">
                    Read Complete Case Study &rarr;
                  </a>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'Client Projects & Case Studies | SaroHub Technologies',
      description: 'Review case studies of production software systems engineered by SaroHub Technologies for retail, telecom, hospitality, manufacturing, and financial clients.',
      canonicalPath: 'https://sarohub.com/projects',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 6. SPECIFIC CASE STUDY DETAIL (`/projects/:slug`)
  if (cleanPath.startsWith('/projects/')) {
    const projectSlug = cleanPath.replace('/projects/', '');
    const project = CASE_STUDIES_DATA.find(c => c.slug === projectSlug);

    if (project) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://sarohub.com/projects' },
          { '@type': 'ListItem', position: 3, name: project.clientName, item: `https://sarohub.com/projects/${project.slug}` }
        ]
      };

      const creativeWorkSchema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.overview,
        datePublished: project.completionDate,
        author: {
          '@type': 'Organization',
          name: 'SaroHub Technologies (Private) Limited'
        }
      };

      const bodyHtml = `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100">
          <section class="py-20 px-6 max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
              <a href="/" class="hover:text-cyan-400">Home</a> &gt; <a href="/projects" class="hover:text-cyan-400">Projects</a> &gt; <span class="text-white font-semibold">${project.clientName}</span>
            </nav>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
              ${project.industry}
            </span>
            <h1 class="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">${project.title}</h1>
            <p class="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">${project.shortDescription}</p>
          </section>

          <section class="py-16 px-6 max-w-5xl mx-auto border-t border-slate-800 space-y-8">
            <div>
              <h2 class="text-2xl font-bold text-white mb-3">Project Overview</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${project.overview}</p>
            </div>
            
            <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 class="text-lg font-bold text-white mb-2">The Operational Challenge</h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${project.clientProblem}</p>
            </div>

            <div class="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
              <h3 class="text-lg font-bold text-white mb-2">The SaroHub Engineering Solution</h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${project.sarohubSolution}</p>
            </div>

            <div>
              <h3 class="text-xl font-bold text-white mb-4">Key Features Delivered</h3>
              <ul class="space-y-2 list-disc pl-5 text-sm text-slate-300">
                ${project.keyFeatures.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
          </section>
        </main>
        ${renderCommonFooter()}
      `;

      return {
        title: project.metaTitle,
        description: project.metaDescription,
        canonicalPath: `https://sarohub.com/projects/${project.slug}`,
        ogType: 'article',
        jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema, creativeWorkSchema],
        bodyHtml
      };
    }
  }

  // 7. BLOG INDEX PAGE
  if (cleanPath === '/blog') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://sarohub.com/blog' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100">
        <section class="py-20 px-6 text-center max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
            <a href="/" class="hover:text-cyan-400">Home</a> &gt; <span class="text-white font-semibold">Blog</span>
          </nav>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Technical Bulletins
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Engineering & Technology Bulletins</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            In-depth guides on AI automation, software architecture, relational database performance, and SaaS product engineering.
          </p>
        </section>

        <section class="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${BLOG_ARTICLES_DATA.map(b => `
              <article class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-mono font-bold uppercase text-cyan-400 mb-2 block">${b.category}</span>
                  <h2 class="text-xl font-bold text-white mb-2">${b.title}</h2>
                  <p class="text-xs text-slate-400 mb-4 leading-relaxed">${b.summary}</p>
                </div>
                <a href="/blog/${b.slug}" class="text-xs font-mono font-bold text-cyan-400 hover:underline">
                  Read Full Technical Article &rarr;
                </a>
              </article>
            `).join('')}
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'Engineering Blog & Technical Bulletins | SaroHub Technologies',
      description: 'Technical articles, AI automation guides, SaaS architecture principles, and software engineering best practices by the SaroHub Technologies research team.',
      canonicalPath: 'https://sarohub.com/blog',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 8. SPECIFIC BLOG POST (`/blog/:slug`)
  if (cleanPath.startsWith('/blog/')) {
    const blogSlug = cleanPath.replace('/blog/', '');
    const article = BLOG_ARTICLES_DATA.find(b => b.slug === blogSlug);

    if (article) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://sarohub.com/blog' },
          { '@type': 'ListItem', position: 3, name: article.title, item: `https://sarohub.com/blog/${article.slug}` }
        ]
      };

      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedDate,
        author: {
          '@type': 'Person',
          name: article.authorName,
          jobTitle: article.authorRole
        },
        publisher: {
          '@type': 'Organization',
          name: 'SaroHub Technologies (Private) Limited',
          url: 'https://sarohub.com'
        }
      };

      const bodyHtml = `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100">
          <article class="py-20 px-6 max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
              <a href="/" class="hover:text-cyan-400">Home</a> &gt; <a href="/blog" class="hover:text-cyan-400">Blog</a> &gt; <span class="text-white font-semibold">${article.title}</span>
            </nav>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              ${article.category}
            </span>
            <h1 class="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">${article.title}</h1>
            <p class="text-xs text-slate-400 mb-8">By ${article.authorName} (${article.authorRole}) &bull; ${article.publishedDate} &bull; ${article.readingTime}</p>
            <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-200 mb-8 leading-relaxed font-medium">
              ${article.summary}
            </div>
            <div class="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <p>Explore full architectural patterns for modern systems, database normalization, and secure AI API proxy layers.</p>
              <p>For more technical details or consultation, visit our <a href="/services" class="text-cyan-400 underline">Services Directory</a> or <a href="/contact" class="text-cyan-400 underline">Contact our engineering team</a>.</p>
            </div>
          </article>
        </main>
        ${renderCommonFooter()}
      `;

      return {
        title: article.metaTitle,
        description: article.metaDescription,
        canonicalPath: `https://sarohub.com/blog/${article.slug}`,
        ogType: 'article',
        jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema, articleSchema],
        bodyHtml
      };
    }
  }

  // 9. CONTACT PAGE
  if (cleanPath === '/contact') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://sarohub.com/contact' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100">
        <section class="py-20 px-6 text-center max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400 mb-6">
            <a href="/" class="hover:text-cyan-400">Home</a> &gt; <span class="text-white font-semibold">Contact Us</span>
          </nav>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            Connect With SaroHub
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Contact SaroHub Technologies</h1>
          <p class="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Get in touch with our software engineering directors for project scoping, software licensing, venture partnerships, or IT Academy inquiries.
          </p>
        </section>

        <section class="py-12 px-6 max-w-5xl mx-auto border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 class="font-bold text-white mb-2">Corporate Office</h2>
            <p class="text-slate-300 leading-relaxed text-xs">
              Roshan Electric Store Building 3rd Floor, Ali Chowk, Skardu, Gilgit-Baltistan, Pakistan
            </p>
          </div>
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 class="font-bold text-white mb-2">Direct Email</h2>
            <p class="text-slate-300 text-xs">
              <a href="mailto:info@sarohub.com" class="text-cyan-400 hover:underline">info@sarohub.com</a>
            </p>
          </div>
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h2 class="font-bold text-white mb-2">Phone & WhatsApp</h2>
            <p class="text-slate-300 text-xs mb-1">+92 355 5866875</p>
            <p class="text-slate-300 text-xs">+92 343 0381473</p>
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'Contact SaroHub Technologies | Software Engineering Inquiries',
      description: 'Contact SaroHub Technologies (Private) Limited in Skardu, Pakistan. Email info@sarohub.com or call +92 355 5866875 for custom software and AI project inquiries.',
      keywords: 'contact SaroHub, software engineering inquiry, hire software developers Pakistan, Skardu tech office, AI consultation, SaroHub phone number, SaroHub email',
      canonicalPath: 'https://sarohub.com/contact',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 10. VENTURES PAGE
  if (cleanPath === '/ventures' || cleanPath === '/products') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Our Ventures', item: 'https://sarohub.com/ventures' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-7xl mx-auto">
        <div class="text-center max-w-4xl mx-auto mb-16">
          <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            SaroHub Venture Studio
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Our Proprietary Software Ventures</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            SaroHub Technologies conceives, incubates, and scales innovative digital ventures and SaaS products designed to solve real business challenges globally.
          </p>
        </div>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'Our Ventures & Products | SaroHub Technologies',
      description: 'Discover proprietary software ventures, SaaS platforms, and digital products conceived, engineered, and scaled by SaroHub Technologies.',
      keywords: 'SaroHub ventures, tech ventures Pakistan, SaaS platforms, software products, startup studio Skardu, digital ventures, venture building',
      canonicalPath: 'https://sarohub.com/ventures',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 11. MARKETPLACE PAGE
  if (cleanPath === '/marketplace') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Marketplace', item: 'https://sarohub.com/marketplace' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-7xl mx-auto">
        <div class="text-center max-w-4xl mx-auto mb-16">
          <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            Commercial Software Assets
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">SaroHub Software Marketplace</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            Acquire fully-built, battle-tested software systems, turnkey SaaS codebases, and ready-to-deploy platforms built by SaroHub Technologies.
          </p>
        </div>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'Software Marketplace & Ready Systems | SaroHub Technologies',
      description: 'Explore turnkey software solutions, production-ready web apps, and commercial systems available for direct acquisition from SaroHub Technologies.',
      keywords: 'software marketplace, buy turnkey software, ready SaaS systems, web application codebases, commercial software Pakistan, SaroHub marketplace',
      canonicalPath: 'https://sarohub.com/marketplace',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 12. OPPORTUNITIES PAGE
  if (cleanPath === '/opportunities') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Opportunities', item: 'https://sarohub.com/opportunities' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-7xl mx-auto">
        <div class="text-center max-w-4xl mx-auto mb-16">
          <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Growth & Acceleration
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Public Programs & Opportunities</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            Fellowships, developer incubations, and growth opportunities at SaroHub Technologies for emerging engineers and startup founders.
          </p>
        </div>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'Programs & Opportunities | SaroHub Technologies',
      description: 'Explore tech fellowships, talent incubations, and developer opportunities offered by SaroHub Technologies in Gilgit-Baltistan and beyond.',
      keywords: 'SaroHub opportunities, tech fellowships Pakistan, software engineering internships, developer incubation Skardu, tech training Gilgit-Baltistan',
      canonicalPath: 'https://sarohub.com/opportunities',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 13. STUDENT PROJECTS PAGE
  if (cleanPath === '/student-projects') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Student Projects', item: 'https://sarohub.com/student-projects' }
      ]
    };

    const bodyHtml = `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-7xl mx-auto">
        <div class="text-center max-w-4xl mx-auto mb-16">
          <span class="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
            IT Academy Showcase
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-white mb-6">Student Projects & Innovations</h1>
          <p class="text-base text-slate-300 leading-relaxed">
            Real-world applications and digital products engineered by graduates of the SaroHub IT Academy in Skardu, Gilgit-Baltistan.
          </p>
        </div>
      </main>
      ${renderCommonFooter()}
    `;

    return {
      title: 'IT Academy Student Projects | SaroHub Technologies',
      description: 'Explore live web applications, mobile apps, and systems built by talented students and graduates at SaroHub IT Academy in Skardu.',
      keywords: 'SaroHub student projects, IT Academy Skardu, software students Gilgit-Baltistan, programming portfolio Pakistan, student web apps',
      canonicalPath: 'https://sarohub.com/student-projects',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml
    };
  }

  // 14. EVENTS PAGE
  if (cleanPath === '/events') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Events', item: 'https://sarohub.com/events' }
      ]
    };

    return {
      title: 'Tech Events & Workshops | SaroHub Technologies',
      description: 'Attend upcoming technology workshops, hackathons, and software engineering webinars hosted by SaroHub Technologies.',
      keywords: 'SaroHub events, tech workshops Skardu, developer meetups Pakistan, hackathons Gilgit-Baltistan, software seminars',
      canonicalPath: 'https://sarohub.com/events',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml: `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-7xl mx-auto text-center">
          <h1 class="text-4xl font-bold text-white mb-4">Upcoming Tech Events & Workshops</h1>
          <p class="text-slate-300 max-w-xl mx-auto text-sm">Join workshops, developer sessions, and hackathons hosted by SaroHub Technologies.</p>
        </main>
        ${renderCommonFooter()}
      `
    };
  }

  // 15. CAREERS PAGE
  if (cleanPath === '/careers') {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sarohub.com' },
        { '@type': 'ListItem', position: 2, name: 'Careers', item: 'https://sarohub.com/careers' }
      ]
    };

    return {
      title: 'Careers & Job Openings | SaroHub Technologies',
      description: 'Join the engineering, design, and venture building team at SaroHub Technologies. Explore open technical positions and career opportunities.',
      keywords: 'SaroHub careers, software engineer jobs Pakistan, tech jobs Skardu, frontend developer jobs, backend developer jobs, Gilgit-Baltistan tech careers',
      canonicalPath: 'https://sarohub.com/careers',
      jsonLd: [ORGANIZATION_SCHEMA, breadcrumbSchema],
      bodyHtml: `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-7xl mx-auto text-center">
          <h1 class="text-4xl font-bold text-white mb-4">Careers at SaroHub Technologies</h1>
          <p class="text-slate-300 max-w-xl mx-auto text-sm">Build world-class digital products and scalable software ventures with our team.</p>
        </main>
        ${renderCommonFooter()}
      `
    };
  }

  // 16. PRIVACY POLICY
  if (cleanPath === '/privacy-policy') {
    return {
      title: 'Privacy Policy | SaroHub Technologies',
      description: 'Privacy Policy and data governance protocols for SaroHub Technologies (Private) Limited.',
      keywords: 'privacy policy SaroHub, data protection, privacy terms SaroHub Technologies',
      canonicalPath: 'https://sarohub.com/privacy-policy',
      jsonLd: [ORGANIZATION_SCHEMA],
      bodyHtml: `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <p class="text-slate-300 leading-relaxed text-sm">SaroHub Technologies enforces rigorous data protection and encryption standards.</p>
        </main>
        ${renderCommonFooter()}
      `
    };
  }

  // 17. TERMS & CONDITIONS
  if (cleanPath === '/terms') {
    return {
      title: 'Terms & Conditions | SaroHub Technologies',
      description: 'Terms and Conditions for software services and products provided by SaroHub Technologies (Private) Limited.',
      keywords: 'terms and conditions SaroHub, service agreement, SaroHub software terms',
      canonicalPath: 'https://sarohub.com/terms',
      jsonLd: [ORGANIZATION_SCHEMA],
      bodyHtml: `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">Terms & Conditions</h1>
          <p class="text-slate-300 leading-relaxed text-sm">Terms and Conditions of engagement with SaroHub Technologies (Private) Limited.</p>
        </main>
        ${renderCommonFooter()}
      `
    };
  }

  // 18. COOKIE POLICY
  if (cleanPath === '/cookie-policy') {
    return {
      title: 'Cookie Policy | SaroHub Technologies',
      description: 'Information on how SaroHub Technologies utilizes cookies and browser storage technologies.',
      keywords: 'cookie policy SaroHub, cookies usage, SaroHub privacy',
      canonicalPath: 'https://sarohub.com/cookie-policy',
      jsonLd: [ORGANIZATION_SCHEMA],
      bodyHtml: `
        ${renderCommonNav()}
        <main class="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold text-white mb-6">Cookie Policy</h1>
          <p class="text-slate-300 leading-relaxed text-sm">Cookie and local state storage specifications for SaroHub Technologies.</p>
        </main>
        ${renderCommonFooter()}
      `
    };
  }

  // Fallback for all other routes (Ventures, Marketplace, Opportunities, Events, Careers, Terms, Privacy)
  return {
    title: 'SaroHub Technologies | Digital Products, Technology Solutions & Ventures',
    description: 'SaroHub Technologies builds digital products, delivers reliable technology solutions for businesses, and develops ambitious ventures.',
    keywords: 'SaroHub, SaroHub Technologies, SaroHub Pakistan, software company, tech ventures',
    canonicalPath: `https://sarohub.com${cleanPath}`,
    jsonLd: [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
    bodyHtml: `
      ${renderCommonNav()}
      <main class="min-h-screen bg-slate-950 text-slate-100 py-24 px-6 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">SaroHub Technologies</h1>
        <p class="text-slate-300 max-w-xl mx-auto text-sm">Building software ventures, AI automation solutions, and enterprise applications.</p>
        <div class="mt-8">
          <a href="/services" class="text-cyan-400 text-xs font-mono font-bold hover:underline">Explore Services &rarr;</a>
        </div>
      </main>
      ${renderCommonFooter()}
    `
  };
}

// Generate valid XML Sitemap string
export function generateSitemapXml(): string {
  const baseUrl = 'https://sarohub.com';
  const now = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/services`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/projects`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/ventures`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/student-projects`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/marketplace`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/opportunities`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${baseUrl}/events`, priority: '0.7', changefreq: 'weekly' },
    { loc: `${baseUrl}/careers`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy-policy`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${baseUrl}/terms`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${baseUrl}/cookie-policy`, priority: '0.5', changefreq: 'yearly' }
  ];

  const serviceUrls = SERVICES_DATA.map(s => ({
    loc: `${baseUrl}/services/${s.slug}`,
    priority: '0.9',
    changefreq: 'weekly'
  }));

  const projectUrls = CASE_STUDIES_DATA.map(c => ({
    loc: `${baseUrl}/projects/${c.slug}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  const blogUrls = BLOG_ARTICLES_DATA.map(b => ({
    loc: `${baseUrl}/blog/${b.slug}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  const allUrls = [...staticUrls, ...serviceUrls, ...projectUrls, ...blogUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// Generate valid Robots.txt string
export function generateRobotsTxt(): string {
  return `# SaroHub Technologies Robots.txt
# https://sarohub.com

User-agent: *
Allow: /
Disallow: /admin
Disallow: /control-room
Disallow: /admin/
Disallow: /control-room/
Disallow: /api/

# Explicit permissions for major Search & AI Crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://sarohub.com/sitemap.xml
`;
}
