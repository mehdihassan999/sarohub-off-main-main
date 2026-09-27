-- ==========================================
-- SaroHub Technologies (Private) Limited
-- Enterprise Corporate Database Schema (MySQL)
-- Normalized Database Design (3NF)
-- ==========================================

CREATE DATABASE IF NOT EXISTS sarohub_db;
USE sarohub_db;

-- 1. Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    profile_pic VARCHAR(255) NULL,
    bio TEXT NULL,
    role VARCHAR(30) DEFAULT 'SuperAdmin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users (Future-ready) Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    status ENUM('active', 'suspended', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SEO Metadata Table
CREATE TABLE IF NOT EXISTS seo_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_route VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'home', 'about', 'services', 'projects', 'blog'
    meta_title VARCHAR(150) NOT NULL,
    meta_description VARCHAR(255) NOT NULL,
    meta_keywords VARCHAR(255) NOT NULL,
    og_title VARCHAR(150) NULL,
    og_description VARCHAR(255) NULL,
    og_image VARCHAR(255) NULL,
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    canonical_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_seo_page (page_route)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    banner_url VARCHAR(255) NOT NULL,
    short_description VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    benefits TEXT NOT NULL, -- JSON or Delimited list of benefits
    technologies VARCHAR(255) NOT NULL, -- Comma-separated list
    faqs TEXT NULL, -- JSON containing dynamic FAQ objects [{question: "...", answer: "..."}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_services_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Service Images
CREATE TABLE IF NOT EXISTS service_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_service_images_service (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    client_name VARCHAR(100) NOT NULL,
    category ENUM('Web', 'Mobile', 'SaaS', 'AI', 'UI/UX', 'E-Commerce') NOT NULL,
    technologies VARCHAR(255) NOT NULL, -- Comma-separated list
    short_description VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    case_study TEXT NULL,
    live_url VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    completion_date DATE NOT NULL,
    thumbnail_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_projects_category (category),
    INDEX idx_projects_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Project Images (Gallery)
CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_images_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Products (Company-Developed Software) Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    short_description VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL, -- JSON array of features
    pricing_plans TEXT NOT NULL, -- JSON array of pricing plans e.g., Basic, Pro, Enterprise
    demo_url VARCHAR(255) NULL,
    video_url VARCHAR(255) NULL,
    download_url VARCHAR(255) NULL,
    thumbnail_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Product Images
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_images_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Projects for Sale Table (Marketplace)
CREATE TABLE IF NOT EXISTS sale_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    technology VARCHAR(255) NOT NULL, -- Comma-separated list
    short_description VARCHAR(255) NOT NULL,
    features TEXT NOT NULL, -- JSON array of features
    demo_url VARCHAR(255) NULL,
    thumbnail_url VARCHAR(255) NOT NULL,
    screenshots TEXT NOT NULL, -- JSON array of image URLs
    screenshot_descriptions TEXT NULL, -- JSON array matching screenshot descriptions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_blog_cats_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Blog Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_blog_tags_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Blogs Table (Dynamic CMS)
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    author_name VARCHAR(100) NOT NULL,
    author_avatar VARCHAR(255) NULL,
    category_id INT NOT NULL,
    featured_image_url VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    reading_time VARCHAR(20) NOT NULL, -- e.g. "5 min read"
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(150) NULL,
    meta_description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE RESTRICT,
    INDEX idx_blogs_slug (slug),
    INDEX idx_blogs_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Blog Tag Mapping (Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS blog_tag_mapping (
    blog_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (blog_id, tag_id),
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    banner_url VARCHAR(255) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    registration_link VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_events_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Event Gallery Table
CREATE TABLE IF NOT EXISTS event_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Careers Table (Job Vacancies)
CREATE TABLE IF NOT EXISTS careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    salary VARCHAR(100) NOT NULL, -- e.g. "Competitive / Depend on Experience"
    experience VARCHAR(50) NOT NULL, -- e.g. "2+ Years"
    skills VARCHAR(255) NOT NULL, -- Comma separated skills
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_careers_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Career Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    resume_url VARCHAR(255) NOT NULL,
    cover_letter TEXT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    INDEX idx_applications_career (career_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    skills VARCHAR(255) NOT NULL, -- Comma separated
    social_linkedin VARCHAR(255) NULL,
    social_github VARCHAR(255) NULL,
    social_twitter VARCHAR(255) NULL,
    portfolio_url VARCHAR(255) NULL,
    experience_years VARCHAR(20) NOT NULL,
    is_founder BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_team_founder (is_founder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_role VARCHAR(100) NOT NULL,
    client_company VARCHAR(100) NOT NULL,
    client_avatar VARCHAR(255) NULL,
    rating INT DEFAULT 5,
    feedback TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- e.g., 'General', 'Services', 'Pricing'
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_faqs_cat (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_unread (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_newsletter_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. Company Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. Media Library Table
CREATE TABLE IF NOT EXISTS media_library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(150) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- e.g., 'image/png', 'application/pdf'
    file_size INT NOT NULL, -- in bytes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. Activity Logs Table (Security / Admin Audit)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NULL,
    action_type VARCHAR(50) NOT NULL, -- e.g., 'LOGIN', 'CREATE_PROJECT', 'DELETE_BLOG'
    details TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE SET NULL,
    INDEX idx_logs_type (action_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED INITIAL DATA
-- ==========================================

-- Seed Admin (Password: 'SaroHub@Admin2026!')
-- Password hash is generated via bcrypt (strength 10)
INSERT INTO admin (username, email, password_hash, full_name, role, bio) 
VALUES (
    'admin', 
    'cyberm0101noirhat@gmail.com', 
    '$2a$10$tZ9B2z2.L.a8g.tY21tWSeQY0E2yqF5BfeHym6t.y8Xz/V10Yp7gS', -- SaroHub@Admin2026!
    'Administrator', 
    'SuperAdmin',
    'Primary administrator for SaroHub Technologies content portal.'
) ON DUPLICATE KEY UPDATE id=id;

-- Seed SEO Settings
INSERT INTO seo_settings (page_route, meta_title, meta_description, meta_keywords) VALUES
('home', 'SaroHub Technologies | Leading Enterprise Software Solutions', 'SaroHub Technologies provides high-quality software, mobile app, and SaaS development services with standard modern architectures.', 'SaroHub, enterprise software, SaaS, software development, cloud solutions'),
('about', 'About Us | SaroHub Technologies', 'Learn about our journey, vision, mission, and the founders driving innovation at SaroHub.', 'SaroHub about, leadership, enterprise vision'),
('services', 'Services | SaroHub Technologies', 'Explore our comprehensive list of software development, AI, cloud integration, and UI/UX services.', 'software services, cloud computing, AI development'),
('projects', 'Our Projects | SaroHub Technologies', 'Explore our premium portfolio, case studies, and enterprise solutions developed for global clients.', 'SaroHub portfolio, completed projects, client success stories'),
('products', 'Our Products | SaroHub Technologies', 'Enterprise software products, CRM, ERP, School Management systems developed by SaroHub.', 'SaroHub CRM, ERP, POS systems, company software'),
('careers', 'Careers | Join SaroHub Technologies', 'Discover exciting career opportunities and shape the future of enterprise software solutions with SaroHub.', 'software jobs, technology careers, developer vacancies'),
('contact', 'Contact Us | SaroHub Technologies', 'Get in touch with SaroHub Technologies for your enterprise software and custom application development needs.', 'contact SaroHub, software company office, project inquiry');

-- Seed Team Founders
INSERT INTO team_members (name, position, photo_url, bio, skills, social_linkedin, social_github, experience_years, is_founder, sort_order) VALUES
('Ashan Perera', 'Co-Founder & CEO', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300', 'Visionary tech entrepreneur with over a decade of experience leading global enterprise software design and strategic market expansions.', 'Leadership, Strategy, Cloud Architecture, Enterprise Sales', 'linkedin.com/in/ashan-perera', 'github.com/ashan', '12 Years', TRUE, 1),
('Ruwan Silva', 'Co-Founder & CTO', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300', 'Full-stack software architect specializing in scalable microservices, low-latency relational architectures, and high-performance system design.', 'MySQL, Node.js, React, Kubernetes, Distributed Systems', 'linkedin.com/in/ruwan-silva', 'github.com/ruwan', '10 Years', TRUE, 2),
('Sarah Jayawardena', 'Co-Founder & Chief Product Officer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300', 'Aesthetic-driven UI/UX designer and product manager passionate about crafting ergonomic user journeys and premium digital products.', 'Product Management, UI/UX Design, Figma, Agile Leadership', 'linkedin.com/in/sarah-j', 'github.com/sarah', '8 Years', TRUE, 3);
