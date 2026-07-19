# PRD: Nurea Knit

## Executive Summary & Product Vision

Nurea Knit is a personal brand website for a single knitting and crochet designer, educator, and content creator. The platform serves as a professional digital studio to showcase work, build brand trust, share knowledge, and grow an audience.

The product vision is to create an elegant, personal, and exclusive online space that feels like visiting a premium creative studio. It eschews the complexity of large marketplaces and Learning Management Systems (LMS) to focus on a curated experience delivered by a single, trusted expert.

## Problem Statement & Target Users

- **Problem:** The creator lacks a centralized, professional online platform to consolidate their brand, engage their audience, and share their work across various formats (patterns, tutorials, physical goods).
- **Target Users:**
  - **Knitting & Crochet Hobbyists:** Individuals seeking high-quality, unique patterns and clear, accessible educational content.
  - **Aspiring Designers:** Learners looking for tutorials and coaching from an established creator.

## System Scope & User Roles

The system encompasses a public-facing website for content consumption and product showcase, user accounts for managing downloads and wishlists, and an admin interface for content management via Payload CMS.

| Role | Description |
|:------------------|:-------------------------------------------------------------------------|
| **Guest** | Anonymous visitor. Can browse public content and products. |
| **Registered User** | Authenticated user via Supabase Auth. Can download patterns, save wishlist items, and manage profile. |
| **Admin (Creator)** | The sole owner and manager of the website with full content control via Payload CMS admin panel. |

**Permissions Matrix:**

| Feature / Action | Guest | Registered User | Admin |
|:-------------------------------------------|:-----:|:---------------:|:-----:|
| View Public Pages (Blog, Portfolio, About) | ✅ | ✅ | ✅ |
| Browse Pattern Library & Shop | ✅ | ✅ | ✅ |
| Download Patterns (Login Required) | ❌ | ✅ | N/A |
| Save Wishlist Items | ❌ | ✅ | N/A |
| Submit Coaching Request Form | ✅ | ✅ | N/A |
| Manage All Site Content (Payload CMS) | ❌ | ❌ | ✅ |
| View Coaching Requests | ❌ | ❌ | ✅ |

## Functional Requirements

### User-Facing Requirements
- **FR-01 (Authentication):** Users can register, log in, and log out using email and password. Authentication is managed via Supabase Auth.
- **FR-02 (Pattern Library):** Users can browse a gallery of knitting/crochet patterns. The library must be filterable by craft type (knitting/crochet) and difficulty level (e.g., Beginner, Intermediate, Advanced). All patterns are free.
- **FR-03 (Pattern Download):** Registered users can download pattern PDFs. Download history is tracked per user.
- **FR-04 (Wishlist):** Registered users can save shop products to a personal wishlist for future reference.
- **FR-05 (Product Showcase):** Users can browse physical products (kits, tools, finished works) as a catalog. Product pages display images, descriptions, and external purchase links. No cart or checkout — transactions handled externally.
- **FR-06 (Offline Coaching Request):** A dedicated page contains a simple form for users to request one-on-one offline coaching. The form collects name, email, and a message, and submits the data as an email to the admin. This is a lead-generation form, not a booking system.
- **FR-07 (User Profile):** Registered users have a profile page to view their downloaded patterns, saved wishlist items, and manage account settings.
- **FR-08 (Content Pages):** The site will feature static, CMS-driven pages for the Blog/Tutorials, Portfolio Showcase, and an "About" page.

### Admin-Facing Requirements (via Payload CMS)
- **FR-09 (Content Management):** The Admin can perform full CRUD (Create, Read, Update, Delete) operations on all content collections: Patterns, Blog Posts, Portfolio Items, Products, and Pages.
- **FR-10 (Pattern Management):** Admin can upload a PDF file for each pattern and define its attributes (difficulty, craft type).
- **FR-11 (Product Management):** Admin can manage shop products with images, descriptions, and external purchase links.
- **FR-12 (Coaching Request Management):** Admin can view and manage coaching request submissions.

## Non-Functional Requirements

| Category | Requirement | Target |
|:--------------|:--------------------------------------------------------------------------------------------------------|:-----------------------------------------------|
| **Performance** | First Contentful Paint (FCP) | < 1.8 seconds |
| | Largest Contentful Paint (LCP) for key pages (Homepage, Shop) | < 2.5 seconds |
| | Time to Interactive (TTI) | < 3.0 seconds |
| **Security** | Data Transmission | All traffic served over HTTPS (TLS 1.2+). |
| | Authentication | Supabase Auth with secure password hashing. |
| | Content Access | Pattern downloads secured behind user authentication. |
| **Scalability** | Concurrent Users | Handle 100 concurrent users at launch. |
| | Infrastructure | Vercel infrastructure with auto-scaling. |
| **Availability**| System Uptime | 99.9% |
| **Usability** | Accessibility | WCAG 2.1 Level AA compliance. |
| | Responsiveness | Fully responsive design for mobile, tablet, and desktop. |

## Technology Stack & Rationale

| Component | Technology | Rationale |
|:----------------|:--------------------------|:------------------------------------------------------------------------------------------------------|
| **Frontend** | Next.js (React) | Optimal for SEO (SSG/SSR), performance, and developer experience. Ideal for a content-rich site. |
| **Backend CMS** | Payload CMS (Node.js) | Embedded headless CMS inside Next.js — single deployment, unified codebase, flexible content modeling. |
| **Database** | Supabase (PostgreSQL) | Managed Postgres database with built-in Auth, Storage, and real-time capabilities. |
| **Authentication**| Supabase Auth | Integrated with database, supports email/password, session management, and RLS policies. |
| **File Storage** | Supabase Storage | Secure, integrated storage for PDF patterns and images, managed alongside Payload CMS. |
| **Email** | Resend | Transactional emails (coaching notifications). |
| **Hosting** | Vercel | Single deployment for both frontend and CMS. Auto-scaling, global CDN, CI/CD. |

## Success Metrics & KPIs

| Metric | KPI / Target | Rationale |
|:------------------------|:-------------------------------------------|:-------------------------------------------------|
| **User Engagement** | Monthly Active Users (MAU) > 500 by Q3 | Measures audience growth and site relevance. |
| | Registered Users > 200 by Q3 | Tracks sign-up conversion and audience building. |
| | Email List Growth > 100/month | Tracks effectiveness of pattern lead magnet. |
| **Content Performance** | Organic Search Traffic > 20% of total | Measures the success of the SEO/blog strategy. |
| | Pattern Downloads > 100/month by Q2 | Measures content engagement and value. |

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation Strategy |
|:-----------------------------------|:-------|:----------------------------------------------------------------------------------------------------------------|
| **Single-Point-of-Failure (Creator)** | High | Creator is the sole source of all content. A content calendar and batch production will be used to build a buffer. |
| **Scope Creep** | High | Pressure to add complex community/LMS/e-commerce features can dilute the brand. Strictly adhere to this PRD and the core "personal studio" vision. |
| **Low User Registration** | Medium | Ensure clear value proposition for account creation. Offer incentives (exclusive patterns, early access). |

## Constraints & Assumptions

- **Constraint:** The website will be managed by a single Admin (the creator). The Payload admin interface must be intuitive for a non-technical user.
- **Assumption:** The creator is capable of producing all required content (patterns, blog posts, portfolio items).
- **Assumption:** The target audience is primarily located in Indonesia.

## Out of Scope

The initial release of Nurea Knit will **not** include:
- Multi-language support.
- Community features (forums, user-to-user messaging, activity feeds).
- Online classes or video courses.
- E-commerce checkout, cart, or payment processing.
- Subscription or recurring payment models.
- Marketplace or multi-vendor capabilities.
- A dedicated mobile application.
