import { 
  Service, Project, Product, SaleProject, Blog, BlogCategory, BlogTag, 
  Event, Career, Application, TeamMember, TeamSection, Testimonial, FAQ, 
  ContactMessage, NewsletterSubscriber, SEOSettings, ActivityLog,
  ChatSession, Opportunity, OpportunityApplication, EventRegistration, Partner, StudentProject, Venture,
  HeroSectionSettings, CompanyMetric, WhySaroHubItem, IndustrySolution, CaseStudy, ProcessStep, TechStackItem, SecurityStandard, CompanyTimelineItem, Lead, MediaItem,
  TrustBadge, ClientEndorsement, EngagementModel, LeadMagnet, FeasibilityAudit, SolutionMatch, IpGuarantee,
  CompanyGalleryItem
} from './types';

/**
 * SaroHub Technologies (Private) Limited
 * Frontend API Utility wrapper for backend synchronization
 */

const API_BASE = '/api';

// Retrieve token from storage
export function getAuthToken(): string | null {
  try {
    return (
      localStorage.getItem('sarohub_auth_token') ||
      localStorage.getItem('sarohub_token') ||
      sessionStorage.getItem('sarohub_auth_token') ||
      sessionStorage.getItem('sarohub_token') ||
      null
    );
  } catch (e) {
    return null;
  }
}

// Set or clear tokens
export function setAuthToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem('sarohub_auth_token', token);
      localStorage.setItem('sarohub_token', token);
    } else {
      localStorage.removeItem('sarohub_auth_token');
      localStorage.removeItem('sarohub_token');
      sessionStorage.removeItem('sarohub_auth_token');
      sessionStorage.removeItem('sarohub_token');
    }
  } catch (e) {
    console.error('Local storage token access error:', e);
  }
}

// In-memory cache for API GET responses to guarantee high availability
const apiMemoryCache = new Map<string, any>();

export function clearApiCache(pathPrefix?: string) {
  if (!pathPrefix) {
    apiMemoryCache.clear();
    return;
  }
  for (const key of apiMemoryCache.keys()) {
    if (key.startsWith(pathPrefix)) {
      apiMemoryCache.delete(key);
    }
  }
}

const STATIC_GET_FALLBACKS: Record<string, any> = {
  '/settings': {
    company_name: 'SaroHub Technologies (Private) Limited',
    office_address: 'Ali Chowk, Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan',
    email: 'info@sarohub.com',
    phone: '+92 343 0381473',
    whatsapp: '+92 343 0381473',
    business_hours: 'Monday - Friday: 9:00 AM - 6:00 PM (PKT)',
    hero_badge: 'Full-Stack Technology Studio & Venture Partner',
    hero_primary_cta_text: 'Hire Us for a Project',
    hero_primary_cta_link: '/contact',
    hero_secondary_cta_text: 'B2B Partnerships & Ventures',
    hero_secondary_cta_link: '/partnerships'
  },
  '/services': [],
  '/projects': [],
  '/products': [],
  '/team': [],
  '/blogs': [],
  '/sale-projects': [],
  '/events': [],
  '/testimonials': [],
  '/ventures': [],
  '/seo': [],
  '/stats': [],
  '/process-steps': [],
  '/why-sarohub': [],
  '/partners': [],
  '/tech-stack': [],
  '/hero-settings': {},
  '/trust-badges': [],
  '/client-endorsements': [],
  '/engagement-models': [],
  '/lead-magnets': [],
  '/ip-guarantee': null,
  '/company-gallery': [],
  '/company-metrics': [],
  '/security-standards': [],
  '/company-timeline': [],
  '/case-studies': [],
  '/industries': [],
  '/student-projects': [],
  '/chats/agent/status': { availability: 'online' }
};

// Helper fetch client with automatic token header injection, progressive retry, and graceful cache fallback
async function request<T>(path: string, options: RequestInit = {}, customRetries?: number): Promise<T> {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const retries = customRetries !== undefined ? customRetries : (isGet ? 4 : 1);
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response | null = null;
  let lastErr: any = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
      });
      if (res) break;
    } catch (err: any) {
      lastErr = err;
      if (attempt < retries) {
        const delay = Math.min(300 * Math.pow(1.8, attempt), 2500);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  const cleanPath = path.split('?')[0];

  if (!res) {
    // Check cache or static fallback for GET requests
    if (isGet) {
      if (apiMemoryCache.has(path)) {
        console.warn(`[API Resilient Fallback] Using memory-cached response for: ${path}`);
        return apiMemoryCache.get(path) as T;
      }
      if (STATIC_GET_FALLBACKS[cleanPath] !== undefined) {
        console.warn(`[API Resilient Fallback] Using static baseline fallback for: ${cleanPath}`);
        return STATIC_GET_FALLBACKS[cleanPath] as T;
      }
    }
    throw new Error(lastErr?.message || 'Network connection failed. Please check server status.');
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    if (isGet) {
      if (apiMemoryCache.has(path)) {
        return apiMemoryCache.get(path) as T;
      }
      if (STATIC_GET_FALLBACKS[cleanPath] !== undefined) {
        return STATIC_GET_FALLBACKS[cleanPath] as T;
      }
    }
    throw new Error(errData.error || `Request failed with status ${res.status}`);
  }

  // Verify response is valid JSON
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const rawText = await res.text().catch(() => '');
    try {
      const parsed = JSON.parse(rawText);
      if (isGet) apiMemoryCache.set(path, parsed);
      return parsed as T;
    } catch {
      if (isGet && apiMemoryCache.has(path)) {
        return apiMemoryCache.get(path) as T;
      }
      if (isGet && STATIC_GET_FALLBACKS[cleanPath] !== undefined) {
        return STATIC_GET_FALLBACKS[cleanPath] as T;
      }
      throw new Error(`Unexpected non-JSON response from server for ${path}`);
    }
  }

  const data = await res.json();
  if (isGet) {
    apiMemoryCache.set(path, data);
  }
  return data as Promise<T>;
}

// In-memory cache for ventures to ensure instant page transitions
let cachedVentures: any[] | null = null;

export const api = {
  // 1. Auth Module
  async login(username: string, password: string) {
    const data = await request<{ token: string; admin: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setAuthToken(data.token);
    return data;
  },

  async logout() {
    setAuthToken(null);
  },

  async getProfile() {
    return request<any>('/auth/profile');
  },

  async updateProfile(body: { username?: string; full_name: string; email: string; bio: string; profile_pic?: string }) {
    return request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async changePassword(body: any) {
    return request<any>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async forgotPassword(email: string) {
    return request<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ url: string }>('/upload', {
      method: 'POST',
      body: formData
    });
  },

  async getLogs() {
    return request<any[]>('/auth/logs');
  },

  // 2. Stats
  async getStats() {
    return request<any>('/stats');
  },

  // 3. Services CRUD
  async getServices() {
    return request<any[]>('/services');
  },

  async getService(idOrSlug: string | number) {
    return request<any>(`/services/${idOrSlug}`);
  },

  async createService(body: any) {
    return request<any>('/services', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateService(id: number, body: any) {
    return request<any>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteService(id: number) {
    return request<any>(`/services/${id}`, {
      method: 'DELETE'
    });
  },

  // 4. Projects CRUD
  async getProjects() {
    return request<any[]>('/projects');
  },

  async getProject(idOrSlug: string | number) {
    return request<any>(`/projects/${idOrSlug}`);
  },

  async createProject(body: any) {
    return request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateProject(id: number, body: any) {
    return request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteProject(id: number) {
    return request<any>(`/projects/${id}`, {
      method: 'DELETE'
    });
  },

  // 4.5 Ventures CRUD
  getCachedVentures() {
    return cachedVentures;
  },

  async getVentures(forceFresh = false) {
    if (!forceFresh && cachedVentures && cachedVentures.length > 0) {
      // Silently refresh in background
      request<any[]>('/ventures').then((fresh) => {
        if (Array.isArray(fresh)) {
          cachedVentures = fresh;
        }
      }).catch(() => {});
      return cachedVentures;
    }
    const data = await request<any[]>('/ventures');
    if (Array.isArray(data)) {
      cachedVentures = data;
    }
    return data;
  },

  async getVentureBySlug(slug: string) {
    if (cachedVentures && cachedVentures.length > 0) {
      const match = cachedVentures.find((v: any) => v.slug === slug || String(v.id) === slug);
      if (match) {
        // Silently revalidate in background
        request<any>(`/ventures/slug/${slug}`).then((fresh) => {
          if (fresh && fresh.id && cachedVentures) {
            const idx = cachedVentures.findIndex((v: any) => v.id === fresh.id);
            if (idx !== -1) cachedVentures[idx] = fresh;
          }
        }).catch(() => {});
        return match;
      }
    }
    return request<any>(`/ventures/slug/${slug}`);
  },

  async createVenture(body: any) {
    cachedVentures = null;
    return request<any>('/ventures', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateVenture(id: string | number, body: any) {
    cachedVentures = null;
    return request<any>(`/ventures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteVenture(id: string | number) {
    cachedVentures = null;
    return request<any>(`/ventures/${id}`, {
      method: 'DELETE'
    });
  },

  // 5. Products CRUD
  async getProducts() {
    return request<any[]>('/products');
  },

  async createProduct(body: any) {
    return request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateProduct(id: number, body: any) {
    return request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteProduct(id: number) {
    return request<any>(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // 6. Projects for Sale
  async getSaleProjects() {
    return request<any[]>('/sale-projects');
  },

  async createSaleProject(body: any) {
    return request<any>('/sale-projects', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateSaleProject(id: number, body: any) {
    return request<any>(`/sale-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteSaleProject(id: number) {
    return request<any>(`/sale-projects/${id}`, {
      method: 'DELETE'
    });
  },

  // 7. Blog Module
  async getBlogs() {
    return request<any[]>('/blogs');
  },

  async getBlogCategories() {
    return request<any[]>('/blog-categories');
  },

  async getBlogTags() {
    return request<any[]>('/blog-tags');
  },

  async createBlog(body: any) {
    return request<any>('/blogs', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateBlog(id: number, body: any) {
    return request<any>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteBlog(id: number) {
    return request<any>(`/blogs/${id}`, {
      method: 'DELETE'
    });
  },

  async createBlogCategory(name: string, extra?: { slug?: string; description?: string; icon?: string; is_published?: boolean; order?: number }) {
    return request<any>('/blog-categories', {
      method: 'POST',
      body: JSON.stringify({ name, ...(extra || {}) })
    });
  },

  async updateBlogCategory(id: number, body: { name?: string; slug?: string; description?: string; icon?: string; is_published?: boolean; order?: number }) {
    return request<any>(`/blog-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteBlogCategory(id: number) {
    return request<any>(`/blog-categories/${id}`, {
      method: 'DELETE'
    });
  },

  async createBlogTag(name: string) {
    return request<any>('/blog-tags', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },

  // 8. Events CRUD
  async getEvents() {
    return request<any[]>('/events');
  },

  async createEvent(body: any) {
    return request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateEvent(id: number, body: any) {
    return request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteEvent(id: number) {
    return request<any>(`/events/${id}`, {
      method: 'DELETE'
    });
  },

  async getEventRegistrations() {
    return request<any[]>('/events-registrations');
  },

  async submitEventRegistration(eventId: number, body: any) {
    return request<any>(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async deleteEventRegistration(id: number) {
    return request<any>(`/events-registrations/${id}`, {
      method: 'DELETE'
    });
  },

  async confirmEventReservation(id: number) {
    return request<any>(`/events-registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'Confirmed' })
    });
  },

  // 9. Careers & Applications
  async getCareers() {
    return request<any[]>('/careers');
  },

  async createCareer(body: any) {
    return request<any>('/careers', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateCareer(id: number, body: any) {
    return request<any>(`/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteCareer(id: number) {
    return request<any>(`/careers/${id}`, {
      method: 'DELETE'
    });
  },

  async getApplications() {
    return request<any[]>('/applications');
  },

  async submitApplication(body: any) {
    return request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateApplicationStatus(id: number, status: string) {
    return request<any>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async uploadCv(file: File) {
    const formData = new FormData();
    formData.append('cv', file);
    return request<{ url: string }>('/upload-cv', {
      method: 'POST',
      body: formData
    });
  },

  async deleteApplication(id: number) {
    return request<any>(`/applications/${id}`, {
      method: 'DELETE'
    });
  },

  // Opportunities module APIs
  async getOpportunities() {
    return request<any[]>('/opportunities');
  },

  async getOpportunity(id: number) {
    return request<any>(`/opportunities/${id}`);
  },

  async createOpportunity(body: any) {
    return request<any>('/opportunities', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateOpportunity(id: number, body: any) {
    return request<any>(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async duplicateOpportunity(id: number) {
    return request<any>(`/opportunities/${id}/duplicate`, {
      method: 'POST'
    });
  },

  async deleteOpportunity(id: number) {
    return request<any>(`/opportunities/${id}`, {
      method: 'DELETE'
    });
  },

  async getOpportunityApplications() {
    return request<any[]>('/opportunities-applications');
  },

  async submitOpportunityApplication(opportunityId: number, body: any) {
    return request<any>(`/opportunities/${opportunityId}/apply`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateOpportunityApplicationStatus(id: number, status: string) {
    return request<any>(`/opportunities-applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async updateOpportunityApplicationNotes(id: number, notes: string) {
    return request<any>(`/opportunities-applications/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    });
  },

  async sendOpportunityNotification(id: number, messageText: string) {
    return request<any>(`/opportunities-applications/${id}/notify`, {
      method: 'POST',
      body: JSON.stringify({ messageText })
    });
  },

  async deleteOpportunityApplication(id: number) {
    return request<any>(`/opportunities-applications/${id}`, {
      method: 'DELETE'
    });
  },

  // 10. Team & Sections
  async getTeamSections(forceFresh = false) {
    if (forceFresh) {
      clearApiCache('/team-sections');
    }
    return request<TeamSection[]>('/team-sections');
  },

  async createTeamSection(body: any) {
    clearApiCache('/team');
    clearApiCache('/team-sections');
    return request<any>('/team-sections', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateTeamSection(id: string, body: any) {
    clearApiCache('/team');
    clearApiCache('/team-sections');
    return request<any>(`/team-sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteTeamSection(id: string) {
    clearApiCache('/team');
    clearApiCache('/team-sections');
    return request<any>(`/team-sections/${id}`, {
      method: 'DELETE'
    });
  },

  async getTeam(forceFresh = false) {
    if (forceFresh) {
      clearApiCache('/team');
    }
    return request<any[]>('/team');
  },

  async createTeamMember(body: any) {
    clearApiCache('/team');
    clearApiCache('/team-sections');
    return request<any>('/team', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateTeamMember(id: number, body: any) {
    clearApiCache('/team');
    clearApiCache('/team-sections');
    return request<any>(`/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteTeamMember(id: number) {
    clearApiCache('/team');
    clearApiCache('/team-sections');
    return request<any>(`/team/${id}`, {
      method: 'DELETE'
    });
  },

  // 11. FAQs & Testimonials
  async getFAQs() {
    return request<any[]>('/faqs');
  },

  async createFAQ(body: any) {
    return request<any>('/faqs', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateFAQ(id: number, body: any) {
    return request<any>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteFAQ(id: number) {
    return request<any>(`/faqs/${id}`, {
      method: 'DELETE'
    });
  },

  async getTestimonials(admin?: boolean) {
    return request<any[]>(`/testimonials${admin ? '?admin=true' : ''}`);
  },

  async createTestimonial(body: any) {
    return request<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateTestimonial(id: number, body: any) {
    return request<any>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async updateTestimonialStatus(id: number, body: { status?: string; featured?: boolean; published?: boolean }) {
    return request<any>(`/testimonials/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteTestimonial(id: number) {
    return request<any>(`/testimonials/${id}`, {
      method: 'DELETE'
    });
  },

  // Company Gallery API
  async getCompanyGallery(params?: { category?: string; admin?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      searchParams.set('category', params.category);
    }
    if (params?.admin) {
      searchParams.set('admin', 'true');
    }
    const query = searchParams.toString();
    return request<CompanyGalleryItem[]>(`/company-gallery${query ? `?${query}` : ''}`);
  },

  async getCompanyGalleryItem(id: number) {
    return request<CompanyGalleryItem>(`/company-gallery/${id}`);
  },

  async createCompanyGalleryItem(body: Partial<CompanyGalleryItem>) {
    return request<CompanyGalleryItem>('/company-gallery', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateCompanyGalleryItem(id: number, body: Partial<CompanyGalleryItem>) {
    return request<CompanyGalleryItem>(`/company-gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteCompanyGalleryItem(id: number) {
    return request<{ success: boolean; deletedId: number }>(`/company-gallery/${id}`, {
      method: 'DELETE'
    });
  },

  // 12. Contact Messages & Newsletters
  async getContactMessages() {
    return request<any[]>('/contact');
  },

  async submitContactForm(body: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async markMessageAsRead(id: number) {
    return request<any>(`/contact/${id}`, {
      method: 'PUT'
    });
  },

  async deleteContactMessage(id: number) {
    return request<any>(`/contact/${id}`, {
      method: 'DELETE'
    });
  },

  async replyContactMessage(id: number, body: { subject: string; message: string }) {
    return request<any>(`/contact/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async getNewsletterSubscribers() {
    return request<any[]>('/newsletter');
  },

  async subscribeNewsletter(email: string) {
    return request<any>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async updateNewsletterSubscriber(id: number, body: { is_active: boolean }) {
    return request<any>(`/newsletter/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteNewsletterSubscriber(id: number) {
    return request<any>(`/newsletter/${id}`, {
      method: 'DELETE'
    });
  },

  // Newsletter Campaigns
  async getNewsletterCampaigns() {
    return request<any[]>('/newsletter-campaigns');
  },

  async createNewsletterCampaign(body: any) {
    return request<any>('/newsletter-campaigns', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateNewsletterCampaign(id: number, body: any) {
    return request<any>(`/newsletter-campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteNewsletterCampaign(id: number) {
    return request<any>(`/newsletter-campaigns/${id}`, {
      method: 'DELETE'
    });
  },

  async sendNewsletterCampaign(id: number) {
    return request<any>(`/newsletter-campaigns/${id}/send`, {
      method: 'POST'
    });
  },

  async testNewsletterCampaign(id: number, test_email?: string) {
    return request<any>(`/newsletter-campaigns/${id}/test`, {
      method: 'POST',
      body: JSON.stringify({ test_email })
    });
  },

  // 13. Settings & SEO
  async getSettings() {
    return request<{ [key: string]: string }>('/settings');
  },

  async saveSettings(body: any) {
    return request<any>('/settings', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async getSEO() {
    return request<any[]>('/seo');
  },

  async saveSEO(body: { page_route: string; meta_title: string; meta_description: string; meta_keywords?: string; og_title?: string; og_description?: string; og_image?: string; canonical_url?: string; no_index?: boolean }) {
    return request<any>('/seo', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async deleteSEO(id: number) {
    return request<any>(`/seo/${id}`, {
      method: 'DELETE'
    });
  },

  // 14. Live Chat Module
  async getChats() {
    return request<{ sessions: any[]; availability: 'online' | 'away' | 'offline' }>('/chats');
  },

  async getAgentStatus() {
    return request<{ availability: 'online' | 'away' | 'offline' }>('/chats/agent/status');
  },

  async updateAgentStatus(availability: 'online' | 'away' | 'offline') {
    return request<any>('/chats/agent/status', {
      method: 'PUT',
      body: JSON.stringify({ availability })
    });
  },

  async getChatSession(id: string) {
    return request<any>(`/chats/${id}`);
  },

  async closeChatSession(id: string) {
    return request<any>(`/chats/${id}/close`, {
      method: 'PUT'
    });
  },

  async sendChatMessage(sessionId: string, payload: { sender: 'visitor' | 'agent'; text: string; visitorName?: string; visitorPhone?: string; visitorEmail?: string }) {
    return request<any>(`/chats/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async suggestChatReply(sessionId: string) {
    return request<{ suggestion: string }>(`/chats/${sessionId}/suggest-reply`, {
      method: 'POST'
    });
  },

  async deleteChatSession(sessionId: string) {
    return request<{ success: boolean }>(`/chats/${encodeURIComponent(sessionId)}`, {
      method: 'DELETE'
    });
  },

  async deleteChatMessage(sessionId: string, messageId: string) {
    return request<{ success: boolean }>(`/chats/${encodeURIComponent(sessionId)}/messages/${encodeURIComponent(messageId)}`, {
      method: 'DELETE'
    });
  },

  async clearAllChats() {
    return request<{ success: boolean }>('/chats', {
      method: 'DELETE'
    });
  },

  async clearAllChatSessions() {
    return request<{ success: boolean }>('/chats', {
      method: 'DELETE'
    });
  },

  // Partners, Agencies & Investors
  async getPartners() {
    return request<Partner[]>('/partners');
  },

  async createPartner(data: Partial<Partner>) {
    return request<Partner>('/partners', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updatePartner(id: number, data: Partial<Partner>) {
    return request<Partner>(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deletePartner(id: number) {
    return request<{ success: boolean }>(`/partners/${id}`, {
      method: 'DELETE'
    });
  },

  // IT Academy Student Projects
  async getStudentProjects() {
    return request<StudentProject[]>('/student-projects');
  },

  async createStudentProject(data: Partial<StudentProject>) {
    return request<StudentProject>('/student-projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateStudentProject(id: number, data: Partial<StudentProject>) {
    return request<StudentProject>(`/student-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteStudentProject(id: number) {
    return request<{ success: boolean }>(`/student-projects/${id}`, {
      method: 'DELETE'
    });
  },

  // Hero Settings
  async getHeroSettings() {
    return request<HeroSectionSettings>('/hero-settings');
  },
  async updateHeroSettings(data: Partial<HeroSectionSettings>) {
    return request<{ success: boolean; hero_settings: HeroSectionSettings }>('/hero-settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Company Metrics / Statistics
  async getCompanyMetrics() {
    return request<CompanyMetric[]>('/company-metrics');
  },
  async createCompanyMetric(data: Partial<CompanyMetric>) {
    return request<{ success: boolean }>('/company-metrics', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateCompanyMetric(id: number, data: Partial<CompanyMetric>) {
    return request<{ success: boolean }>(`/company-metrics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteCompanyMetric(id: number) {
    return request<{ success: boolean }>(`/company-metrics/${id}`, {
      method: 'DELETE'
    });
  },

  // Why SaroHub
  async getWhySaroHub() {
    return request<WhySaroHubItem[]>('/why-sarohub');
  },
  async createWhySaroHub(data: Partial<WhySaroHubItem>) {
    return request<{ success: boolean }>('/why-sarohub', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateWhySaroHub(id: number, data: Partial<WhySaroHubItem>) {
    return request<{ success: boolean }>(`/why-sarohub/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteWhySaroHub(id: number) {
    return request<{ success: boolean }>(`/why-sarohub/${id}`, {
      method: 'DELETE'
    });
  },

  // Industry Solutions
  async getIndustries() {
    return request<IndustrySolution[]>('/industries');
  },
  async createIndustry(data: Partial<IndustrySolution>) {
    return request<{ success: boolean }>('/industries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateIndustry(id: number, data: Partial<IndustrySolution>) {
    return request<{ success: boolean }>(`/industries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteIndustry(id: number) {
    return request<{ success: boolean }>(`/industries/${id}`, {
      method: 'DELETE'
    });
  },

  // Case Studies
  async getCaseStudies() {
    return request<CaseStudy[]>('/case-studies');
  },
  async createCaseStudy(data: Partial<CaseStudy>) {
    return request<{ success: boolean }>('/case-studies', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateCaseStudy(id: number, data: Partial<CaseStudy>) {
    return request<{ success: boolean }>(`/case-studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteCaseStudy(id: number) {
    return request<{ success: boolean }>(`/case-studies/${id}`, {
      method: 'DELETE'
    });
  },

  // Process Steps
  async getProcessSteps() {
    return request<ProcessStep[]>('/process-steps');
  },
  async createProcessStep(data: Partial<ProcessStep>) {
    return request<{ success: boolean }>('/process-steps', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateProcessStep(id: number, data: Partial<ProcessStep>) {
    return request<{ success: boolean }>(`/process-steps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteProcessStep(id: number) {
    return request<{ success: boolean }>(`/process-steps/${id}`, {
      method: 'DELETE'
    });
  },

  // Tech Stack
  async getTechStack() {
    return request<TechStackItem[]>('/tech-stack');
  },
  async createTechStack(data: Partial<TechStackItem>) {
    return request<{ success: boolean }>('/tech-stack', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateTechStack(id: number, data: Partial<TechStackItem>) {
    return request<{ success: boolean }>(`/tech-stack/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteTechStack(id: number) {
    return request<{ success: boolean }>(`/tech-stack/${id}`, {
      method: 'DELETE'
    });
  },

  // Security Standards
  async getSecurityStandards() {
    return request<SecurityStandard[]>('/security-standards');
  },
  async createSecurityStandard(data: Partial<SecurityStandard>) {
    return request<{ success: boolean }>('/security-standards', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateSecurityStandard(id: number, data: Partial<SecurityStandard>) {
    return request<{ success: boolean }>(`/security-standards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteSecurityStandard(id: number) {
    return request<{ success: boolean }>(`/security-standards/${id}`, {
      method: 'DELETE'
    });
  },

  // Company Timeline
  async getCompanyTimeline() {
    return request<CompanyTimelineItem[]>('/company-timeline');
  },
  async createCompanyTimeline(data: Partial<CompanyTimelineItem>) {
    return request<{ success: boolean }>('/company-timeline', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateCompanyTimeline(id: number, data: Partial<CompanyTimelineItem>) {
    return request<{ success: boolean }>(`/company-timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteCompanyTimeline(id: number) {
    return request<{ success: boolean }>(`/company-timeline/${id}`, {
      method: 'DELETE'
    });
  },

  // Leads CRM
  async getLeads() {
    return request<Lead[]>('/leads');
  },
  async submitLead(data: Partial<Lead>) {
    return request<{ success: boolean; lead: Lead }>('/leads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateLead(id: number, data: Partial<Lead>) {
    return request<{ success: boolean }>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteLead(id: number) {
    return request<{ success: boolean }>(`/leads/${id}`, {
      method: 'DELETE'
    });
  },

  // Centralized Media Library
  async getMedia() {
    return request<MediaItem[]>('/media');
  },
  async createMedia(data: Partial<MediaItem>) {
    return request<{ success: boolean }>('/media', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteMedia(id: number) {
    return request<{ success: boolean }>(`/media/${id}`, {
      method: 'DELETE'
    });
  },

  // Consultation Bookings
  async getConsultations() {
    return request<any[]>('/consultations');
  },
  async getConsultationAvailability(date: string) {
    return request<{ date: string; allSlots: string[]; bookedSlots: string[]; availableSlots: string[] }>(`/consultations/availability?date=${encodeURIComponent(date)}`);
  },
  async createConsultation(data: any) {
    return request<{ success: boolean; message: string; booking: any; googleCalUrl: string; icsData: string }>('/consultations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateConsultationStatus(id: number, status: string, notes?: string) {
    return request<{ success: boolean }>(`/consultations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },
  async deleteConsultation(id: number) {
    return request<{ success: boolean }>(`/consultations/${id}`, {
      method: 'DELETE'
    });
  },

  // Estimates
  async createEstimate(data: any) {
    return request<{ success: boolean; message: string; quote: any }>('/estimates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // ----------------------------------------------------
  // Trust & Conversion Features API
  // ----------------------------------------------------
  // 1. Trust Badges
  async getTrustBadges() {
    return request<TrustBadge[]>('/trust-badges');
  },
  async createTrustBadge(data: Partial<TrustBadge>) {
    return request<{ success: boolean; badge: TrustBadge }>('/trust-badges', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateTrustBadge(id: number, data: Partial<TrustBadge>) {
    return request<{ success: boolean }>(`/trust-badges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteTrustBadge(id: number) {
    return request<{ success: boolean }>(`/trust-badges/${id}`, {
      method: 'DELETE'
    });
  },

  // 2. Client Endorsements (Video / Audio / Quotes)
  async getClientEndorsements() {
    return request<ClientEndorsement[]>('/client-endorsements');
  },
  async createClientEndorsement(data: Partial<ClientEndorsement>) {
    return request<{ success: boolean; endorsement: ClientEndorsement }>('/client-endorsements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateClientEndorsement(id: number, data: Partial<ClientEndorsement>) {
    return request<{ success: boolean }>(`/client-endorsements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteClientEndorsement(id: number) {
    return request<{ success: boolean }>(`/client-endorsements/${id}`, {
      method: 'DELETE'
    });
  },

  // 3. Engagement Models
  async getEngagementModels() {
    return request<EngagementModel[]>('/engagement-models');
  },
  async createEngagementModel(data: Partial<EngagementModel>) {
    return request<{ success: boolean; model: EngagementModel }>('/engagement-models', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateEngagementModel(id: number, data: Partial<EngagementModel>) {
    return request<{ success: boolean }>(`/engagement-models/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteEngagementModel(id: number) {
    return request<{ success: boolean }>(`/engagement-models/${id}`, {
      method: 'DELETE'
    });
  },

  // 4. Lead Magnets (Guides, Whitepapers & Download Tracker)
  async getLeadMagnets() {
    return request<LeadMagnet[]>('/lead-magnets');
  },
  async createLeadMagnet(data: Partial<LeadMagnet>) {
    return request<{ success: boolean; leadMagnet: LeadMagnet }>('/lead-magnets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateLeadMagnet(id: number, data: Partial<LeadMagnet>) {
    return request<{ success: boolean }>(`/lead-magnets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteLeadMagnet(id: number) {
    return request<{ success: boolean }>(`/lead-magnets/${id}`, {
      method: 'DELETE'
    });
  },
  async trackLeadMagnetDownload(id: number, info: { email: string; full_name?: string; company?: string }) {
    return request<{ success: boolean; message: string; downloadUrl: string; title: string }>(`/lead-magnets/${id}/download`, {
      method: 'POST',
      body: JSON.stringify(info)
    });
  },

  // 5. 48-Hour Technical Feasibility & Architecture Audit
  async getFeasibilityAudits() {
    return request<FeasibilityAudit[]>('/feasibility-audits');
  },
  async submitFeasibilityAudit(data: Partial<FeasibilityAudit>) {
    return request<{ success: boolean; message: string; audit: FeasibilityAudit }>('/feasibility-audits', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateFeasibilityAudit(id: number, data: Partial<FeasibilityAudit>) {
    return request<{ success: boolean }>(`/feasibility-audits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteFeasibilityAudit(id: number) {
    return request<{ success: boolean }>(`/feasibility-audits/${id}`, {
      method: 'DELETE'
    });
  },

  // 6. Interactive Solution Matcher Submissions
  async getSolutionMatches() {
    return request<SolutionMatch[]>('/solution-matches');
  },
  async submitSolutionMatch(data: Partial<SolutionMatch>) {
    return request<{ success: boolean; message: string; solutionMatch: SolutionMatch }>('/solution-matches', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteSolutionMatch(id: number) {
    return request<{ success: boolean }>(`/solution-matches/${id}`, {
      method: 'DELETE'
    });
  },

  // 7. IP & NDA Guarantee Settings
  async getIpGuarantee() {
    return request<IpGuarantee>('/ip-guarantee');
  },
  async updateIpGuarantee(data: Partial<IpGuarantee>) {
    return request<{ success: boolean; ip_guarantee: IpGuarantee }>('/ip-guarantee', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};




