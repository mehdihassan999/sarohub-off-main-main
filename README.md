# SaroHub Technologies Enterprise Portal & Corporate Website

Welcome to the official, enterprise-ready source repository for **SaroHub Technologies (Private) Limited**.

This workspace contains a highly-engineered, secure, fully responsive corporate website paired with a hidden, authenticated content management system (Admin Portal). The system features an architectural design matching the look, speed, and integrity of top-tier technology institutions such as Vercel, Microsoft, and Stripe.

---

## 🛠️ Technology Stack

### Frontend Core
* **React.js & TypeScript**: Functional components built on structured, static type definitions (`src/types.ts`).
* **Vite Compilation**: Ultra-fast bundler configuration optimizing bundle loading.
* **Tailwind CSS**: Utility-first styling framework implementing professional typography, glassmorphism card highlights, and modern glowing grids.
* **Framer Motion**: Ergonomic entrance transitions, hover responses, and micro-interaction animations.
* **Lucide Icons**: Unified visual library for sharp vector icons.

### Backend Infrastructure
* **Express.js Server**: High-performance RESTful router serving client routes and routing `/api/*` endpoints.
* **JWT Authentication**: 12-hour encrypted JSON Web Token signing ensuring all dynamic administrative edits are completely authenticated.
* **Bcrypt Password Cryptography**: Standard strength 10 salt hashing protecting superadmin credentials.
* **Audit Registry & Logging**: Full security tracking logging every login event, update, and modification to prevent breach vectors.
* **Relational Mock State Engine**: Local state engine reflecting standard database records, seeding real contents automatically to ensure instant preview readiness.

### Production Database Design (MySQL)
* Fully normalized **3rd Normal Form (3NF)** schema script.
* Explicit foreign key constraints, cascade constraints, indexed fields, and timestamp hooks.
* Complete database structure located in `/schema.sql`.

---

## 📂 Project Structure

The code is designed following rigorous architectural separation:

```
sarohub/
├── schema.sql             # Complete 3NF MySQL Database Schema Script
├── db.json                # Local Relational JSON DB Storage (Auto-seeded)
├── server.ts              # Full-Stack Express Server (Serves API & Vite build)
└── src/
    ├── api.ts             # REST API client wrapping fetch operations
    ├── types.ts           # Global Enterprise TypeScript Types
    ├── index.css          # Tailwind variables configuration
    ├── App.tsx            # Main client-side router, public pages & Admin CMS
    └── components/
        ├── Navbar.tsx     # Animated Glassmorphic Header Navigation
        └── Footer.tsx     # Corporate details & live Newsletter module
```

---

## 🛡️ Database Schema (MySQL - 3NF)

The complete SQL blueprint is contained in `/schema.sql`. Key Normalized relationships:

1. **`admin`**: Primary administrative credentials with bcrypt hashes.
2. **`services` & `service_images`**: Comma-separated technologies, JSON-parsed FAQ arrays, and dynamic benefits.
3. **`projects` & `project_images`**: Logged case study outcomes filterable by categorizations.
4. **`products` & `product_images`**: Core company SaaS programs (CRM, POS, Hospital Sentinel) mapped to multi-tier dynamic pricing schemas.
5. **`blogs` & `blog_categories` / `blog_tags`**: CMS blog architecture supporting rich text, reading times, featured categories, and tag mapping.
6. **`careers` & `applications`**: Relational candidate application log. Job candidates upload application vectors and resumes that are parsed and reviewed dynamically inside the Admin dashboard.
7. **`activity_logs`**: System security audits documenting critical administrative mutations.

---

## 🔐 Administrative Portals

To maintain a secure posture:
* **Hidden Route**: The Admin panel is not exposed at generic `/admin` paths. It is housed at `/portal-login` which transitions to `/control-room` upon successful authorization.
* **Secure Defaults**:
  * **Username**: `admin`
  * **Password**: `SaroHub@Admin2026!`

---

## 🚀 Deployment Instructions

### Local Development
1. Clone this repository workspace.
2. Initialize and install dependencies:
   ```bash
   npm install
   ```
3. Boot the full-stack development workspace on Port 3000:
   ```bash
   npm run dev
   ```

### Production Build & Deploy
To compile the unified React client bundles and the self-contained Express server via `esbuild`, run:
```bash
npm run build
npm start
```
This produces optimized production static assets in `/dist` and compiles `/server.ts` into a self-contained CommonJS target at `/dist/server.cjs` for cold-start speed and container safety.


SaroHub@Admin2026!