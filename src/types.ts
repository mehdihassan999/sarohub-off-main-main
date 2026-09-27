/**
 * SaroHub Technologies (Private) Limited
 * Core Enterprise TypeScript Type Definitions
 */

export interface SEOSettings {
  id: number;
  page_route: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  focus_keyword?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  twitter_image?: string;
  robots_index?: boolean | string;
  robots_follow?: boolean | string;
  no_index?: boolean;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  category?: string;
  banner_url: string;
  hero_headline?: string;
  short_description: string;
  description: string;
  benefits: string[]; // Handled as array
  problems_solved?: string[];
  capabilities?: { title: string; description: string; highlights?: string[] }[];
  target_audience?: string[];
  business_benefits?: { title: string; description: string }[];
  process_steps?: { step: number; title: string; description: string }[];
  technologies: string[]; // Handled as array
  faqs: { question: string; answer: string }[];
  featured?: boolean;
  order?: number;
  published?: boolean;
  meta_title?: string;
  meta_description?: string;
  related_projects?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectResultMetric {
  metric: string;
  label: string;
  detail?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  category: string;
  secondary_categories?: string[];
  industry?: string;
  project_type?: string;
  positioning_statement?: string;
  what_we_solved?: string;
  engagement?: string;
  technologies: string[] | any;
  short_description: string;
  description: string;
  case_study?: string;
  problem_challenge?: string;
  our_approach?: string;
  solution?: string;
  key_features?: string[] | string;
  features?: string[];
  challenges?: any[];
  solutions?: any[];
  sarohub_role?: string[];
  overview?: any;
  results_impact?: string[] | string | ProjectResultMetric[] | any;
  outcome?: string;
  testimonial?: any;
  testimonial_id?: number | null;
  live_url?: string;
  github_url?: string;
  completion_date: string;
  status?: 'In Production' | 'Completed' | 'Ongoing' | 'Archived' | 'Delivered' | string;
  thumbnail_url: string;
  screenshots?: string[];
  gallery?: string[];
  is_draft?: boolean;
  featured?: boolean;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudentProject {
  id: number;
  title: string;
  student_name: string;
  batch_course: string;
  category: string;
  technologies: string[];
  short_description: string;
  description: string;
  thumbnail_url: string;
  images?: string[];
  live_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  features: string[];
  pricing_plans: { name: string; price: string; period: string; features: string[] }[];
  demo_url?: string;
  video_url?: string;
  download_url?: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export type VentureStatusType = 
  | 'Idea' 
  | 'Research' 
  | 'Prototype' 
  | 'In Development' 
  | 'Beta' 
  | 'Active' 
  | 'Expanding' 
  | 'Archived';

export interface VentureGalleryItem {
  url: string;
  caption?: string;
  description?: string;
}

export interface Venture {
  id: number;
  ventureNumber?: string;
  name: string;
  slug: string;
  shortTitle?: string;
  tagline: string;
  description: string;
  category: string;
  status: VentureStatusType;
  logo?: string;
  coverImage?: string;
  galleryImages?: (string | VentureGalleryItem)[];
  gallery?: VentureGalleryItem[];
  keyCapabilities: string[];
  technologies: string[];
  websiteUrl?: string;
  demoUrl?: string;
  learnMoreUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;

  // Optional fields
  industry?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  businessModel?: string;
  launchDate?: string;
  externalLinks?: { name: string; url: string }[];
  metrics?: { label: string; value: string }[];
  team?: { name: string; role: string; avatar?: string }[];
  documentationUrl?: string;
}


export interface SaleProject {
  id: number;
  title: string;
  price: number;
  technology: string[];
  short_description: string;
  features: string[];
  demo_url?: string;
  video_url?: string;
  thumbnail_url: string;
  screenshots: string[];
  screenshot_descriptions?: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_published?: boolean;
  order?: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  author_name: string;
  author_avatar?: string;
  category_id: number;
  featured_image_url: string;
  content: string;
  short_description?: string;
  reading_time: string;
  is_featured: boolean;
  is_draft?: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  created_at: string;
  tags: number[]; // Array of tag IDs
}

export interface Event {
  id: number;
  title: string;
  banner_url: string;
  event_date: string;
  venue: string;
  description: string;
  registration_link?: string;
  form_fields?: OpportunityField[];
  created_at: string;
}

export interface Career {
  id: number;
  position: string;
  department: string;
  salary: string;
  experience: string;
  job_type?: string;
  location?: string;
  skills: string[];
  description: string;
  banner_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Application {
  id: number;
  career_id: number;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
  resume_filename?: string;
  cover_letter?: string;
  applied_at: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface TeamMemberSocialLink {
  platform: string;
  url: string;
}

export interface TeamSection {
  id: string;
  title: string;
  description: string;
  badge?: string;
  sort_order?: number;
  created_at?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  bio: string;
  skills: string[];
  department?: string;
  section_title?: string;
  section_description?: string;
  social_linkedin?: string;
  social_github?: string;
  social_twitter?: string;
  portfolio_url?: string;
  social_links?: TeamMemberSocialLink[];
  experience_years: string;
  is_founder: boolean;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_email?: string;
  client_role: string;
  client_company: string;
  client_avatar?: string;
  company_logo?: string;
  rating: number;
  feedback: string;
  project_id?: number | null;
  service_id?: number | null;
  featured?: boolean;
  published?: boolean;
  status?: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  name?: string;
  is_active: boolean;
  status?: 'active' | 'unsubscribed';
  tags?: string[];
  source?: string;
  subscribed_at: string;
}

export interface NewsletterCampaign {
  id: number;
  name?: string;
  title?: string;
  subject: string;
  content: string;
  featured_image?: string;
  recipient_segment?: string;
  target_audience?: string;
  scheduled_at?: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  sent_at?: string;
  sent_count?: number;
  recipients_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: number;
  admin_id?: number;
  action_type: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'visitor' | 'agent' | 'system';
  text: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  visitor_name: string;
  visitor_phone?: string;
  visitor_email?: string;
  status: 'active' | 'closed';
  agent_unread: boolean;
  visitor_unread: boolean;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface OpportunityField {
  id: string;
  type: 
    | 'text' | 'full_name' | 'email' | 'phone' | 'cnic_passport' | 'date' | 'number' | 'textarea'
    | 'dropdown' | 'radio' | 'checkbox' | 'checkbox_multi' | 'multi_select' | 'yes_no_toggle'
    | 'file' | 'file_multiple' | 'image' | 'resume' | 'cover_letter' | 'transcript' | 'certificate' | 'portfolio_upload'
    | 'url' | 'linkedin' | 'github' | 'country' | 'state' | 'city';
  label: string;
  required: boolean;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
  options?: string[]; // For dropdown, radio, checkbox options
  validation?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    allowedFileTypes?: string[]; // e.g. ['.pdf', '.docx', '.png', '.jpg']
    maxFileSizeMb?: number;
    maxFilesCount?: number;
    customErrorMessage?: string;
  };
}

export interface Opportunity {
  id: number;
  type: string; // Scholarship, Internship, Job, Event, Competition, Training Program, Ambassador Program, etc.
  title: string;
  slug: string;
  short_description?: string;
  description: string;
  eligibility_criteria: string;
  benefits: string;
  location: string;
  duration: string;
  start_date?: string;
  deadline: string;
  positions_count?: number;
  max_applications?: number;
  status: 'Open' | 'Closed';
  featured_image_url?: string;
  is_published: boolean;
  seo_title?: string;
  seo_description?: string;
  form_fields: OpportunityField[];
  created_at: string;
  updated_at: string;
}

export interface OpportunityApplication {
  id: number;
  opportunity_id: number;
  opportunity_title: string;
  opportunity_type: string;
  applicant_name: string;
  applicant_email: string;
  applied_at: string;
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  form_data: { [fieldLabel: string]: any };
  uploaded_documents: { fieldLabel: string; fileName: string; fileUrl: string }[];
  internal_notes?: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  event_title: string;
  applicant_name: string;
  applicant_email: string;
  applied_at: string;
  form_data: { [fieldLabel: string]: any };
  status?: string;
}

export type PartnerCategory = 
  | 'Government Sector'
  | 'Government Collaboration'
  | 'Agency Partner' 
  | 'Technology Partner' 
  | 'Strategic Partner' 
  | 'Development Partner' 
  | 'Education Partner' 
  | 'NGO Collaboration' 
  | 'Business Partner' 
  | 'Community Partner' 
  | 'Research Partner' 
  | 'Academic & Research'
  | 'Investor & Venture'
  | 'Ecosystem Partner'
  | 'Partner' 
  | 'Agency' 
  | 'Investor' 
  | 'Collaborator' 
  | string;

export interface Partner {
  id: number;
  name: string;
  category: PartnerCategory;
  partnership_type?: string;
  org_type?: string;
  logo_url: string;
  cover_url?: string;
  banner_url?: string;
  website_url?: string;
  short_description?: string;
  description?: string;
  collaboration_description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'Active' | 'Completed' | 'Ongoing' | string;
  images?: string[];
  gallery?: string[];
  featured: boolean;
  published?: boolean;
  order: number;
  slug?: string;
  created_at: string;
}

export interface HeroSectionSettings {
  eyebrowText: string;
  headline: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badgeText: string;
  bgMediaUrl?: string;
  heroImageUrl?: string;
}

export interface CompanyMetric {
  id: number;
  number: string;
  label: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
  auto_calculate?: boolean;
  calculation_source?: string;
  is_dynamic?: boolean;
  raw_count?: number;
  live_breakdown?: {
    category: string;
    description: string;
    items: { name: string; type?: string; detail?: string }[];
  };
  live_stats?: Record<string, number>;
}

export interface WhySaroHubItem {
  id: number;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  image?: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface IndustrySolution {
  id: number;
  name: string;
  slug: string;
  problemStatement: string;
  solutions: string[];
  services: string[];
  features: string[];
  caseStudies?: string[];
  technologies: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  order: number;
}

export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  projectType: string;
  challenge: string;
  solution: string;
  approach: string;
  features: string[];
  technologies: string[];
  results: string[];
  metrics: { label: string; value: string }[];
  duration?: string;
  teamMembers?: string[];
  images: string[];
  videoUrl?: string;
  testimonialText?: string;
  testimonialAuthor?: string;
  liveUrl?: string;
  demoUrl?: string;
  relatedServices?: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface ProcessStep {
  id: number;
  stepNumber: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  image?: string;
  order: number;
}

export interface TechStackItem {
  id: number;
  name: string;
  logoUrl?: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'AI' | 'Databases' | 'Cloud' | 'DevOps' | 'Automation' | 'Security';
  description: string;
  websiteUrl?: string;
  proficiencyLevel?: string;
  order: number;
  active: boolean;
}

export interface SecurityStandard {
  id: number;
  title: string;
  category: string;
  description: string;
  details: string[];
  icon: string;
  order: number;
}

export interface CompanyTimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
  image?: string;
  order: number;
  status: 'active' | 'inactive';
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  serviceRequired: string;
  industry?: string;
  projectDescription: string;
  estimatedBudget: string;
  timeline?: string;
  source?: string;
  status: LeadStatus;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
}

export interface MediaItem {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'other';
  category?: string;
  altText?: string;
  sizeBytes?: number;
  uploadedAt: string;
}

export interface GlobalWebsiteSettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl?: string;
  phone: string;
  email: string;
  address: string;
  whatsapp?: string;
  businessHours?: string;
  footerContent?: string;
  copyrightText?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultOgImage?: string;
  googleAnalyticsId?: string;
  metaPixelId?: string;
  socialLinks: { platform: string; url: string }[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  external?: boolean;
  order: number;
  visible: boolean;
  children?: { label: string; path: string }[];
}

export interface NavigationMenu {
  headerMenu: NavigationItem[];
  footerMenu: NavigationItem[];
}

export interface OutgoingEmailLog {
  id: number;
  to: string;
  subject: string;
  category: string;
  status: 'delivered' | 'simulated' | 'failed';
  error?: string;
  created_at: string;
  html?: string;
}

export interface SmtpConfig {
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_secure?: string;
  smtp_from_name?: string;
  smtp_from_email?: string;
}

export interface ConsultationBooking {
  id: number;
  client_name: string;
  client_email: string;
  client_phone?: string;
  company_name?: string;
  consultation_type: string; // e.g. 'Discovery & Technical Feasibility', 'Architecture & Scoping', 'AI & Cloud Strategy', 'Codebase Audit'
  meeting_platform: string; // 'Google Meet', 'Zoom', 'WhatsApp Call', 'Phone'
  scheduled_date: string; // 'YYYY-MM-DD'
  scheduled_time: string; // e.g. '10:00 AM PKT'
  timezone: string;
  project_summary?: string;
  estimated_budget?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectEstimateQuote {
  id: number;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  company_name?: string;
  project_type: string;
  scale_tier: string;
  selected_modules: string[];
  timeline_speed: string;
  currency: 'PKR' | 'USD';
  estimated_cost_min: number;
  estimated_cost_max: number;
  estimated_weeks_min: number;
  estimated_weeks_max: number;
  phases_breakdown: {
    phase: string;
    weeks: number;
    description: string;
  }[];
  project_notes?: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Closed';
  created_at: string;
}

export interface TrustBadge {
  id: number;
  platform: string;
  badge_title: string;
  rating_score: string;
  review_count: string;
  badge_icon: string;
  external_url: string;
  category: string;
  is_active: boolean;
  sort_order: number;
}

export interface ClientEndorsement {
  id: number;
  client_name: string;
  client_title: string;
  company_name: string;
  company_logo?: string;
  avatar_url?: string;
  project_title: string;
  quote: string;
  outcome_metric?: string;
  video_url?: string;
  audio_url?: string;
  media_type: 'quote' | 'video' | 'audio';
  rating: number;
  country?: string;
  is_featured: boolean;
  sort_order?: number;
}

export interface EngagementModel {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  badge?: string;
  turnaround: string;
  pricing_type: string;
  ip_ownership: string;
  team_structure: string;
  best_for: string;
  features: string[];
  sla_guarantee: string;
  cta_label: string;
  cta_link: string;
  is_featured: boolean;
  sort_order: number;
}

export interface LeadMagnet {
  id: number;
  title: string;
  slug: string;
  category: string;
  pages: string;
  description: string;
  cover_image: string;
  download_url: string;
  key_takeaways: string[];
  download_count: number;
  is_featured: boolean;
}

export interface FeasibilityAudit {
  id: number;
  full_name: string;
  email: string;
  company?: string;
  phone?: string;
  project_name: string;
  tech_stack?: string;
  project_stage: string;
  repo_or_spec_link?: string;
  timeline?: string;
  budget_range?: string;
  challenges?: string;
  status: 'Pending' | 'In Review' | 'Completed' | 'Archived';
  admin_notes?: string;
  created_at: string;
}

export interface SolutionMatch {
  id: number;
  contact_name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  stage: string;
  timeline: string;
  budget: string;
  recommended_stack: string[];
  recommended_model: string;
  estimated_weeks: string;
  created_at: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export interface IpGuarantee {
  guarantee_headline: string;
  guarantee_subheading: string;
  bilateral_nda_policy: string;
  code_ownership_terms: string;
  escrow_and_repos: string;
  security_clearance: string;
  sample_nda_template_url: string;
}

export type GalleryCategory = 'Seminars' | 'SEO Collaborations' | 'Office Culture' | 'Tech Masterclasses' | 'Partner Summits' | string;

export interface CompanyGalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  image_url: string;
  caption?: string;
  description?: string;
  event_date?: string;
  location?: string;
  attendees_count?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  order?: number;
  created_at?: string;
  updated_at?: string;
}



