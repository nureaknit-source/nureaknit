# ROADMAP.md: Nureaknite

## Phased Delivery Plan

| Phase | Duration | Goals | Key Deliverables |
|:------|:---------|:------|:-----------------|
| **Phase 1: Foundation & Content** | 6 weeks | Establish brand presence, launch pattern library, and enable user accounts. | Homepage, About page, Pattern Library (all free), User authentication, Strapi CMS configured. |
| **Phase 2: Showcase & Coaching** | 4 weeks | Launch product showcase, blog, portfolio, and coaching features. | Product Showcase (catalog), Wishlist feature, Blog/Tutorials, Portfolio Showcase, Coaching request form. |
| **Phase 3: Refinement & Launch** | 3 weeks | Polish, testing, performance optimization, and go-live preparation. | QA testing, performance tuning, security audit, admin training, production deployment. |

**Timeline Disclaimer:** This roadmap assumes a solo developer with part-time QA support. Adjust phase durations proportionally for different team sizes.

---

## MVP Feature List

### P0: Must Have for Launch (Phase 1)

| Feature | Requirement ID | Description | Phase |
|:--------|:---------------|:-----------|:------|
| User Authentication | FR-01 | Email/password registration and login via NextAuth.js. | Phase 1 |
| Pattern Library (Browse & Filter) | FR-02 | Filterable gallery by craft type and difficulty. | Phase 1 |
| Pattern Download | FR-03 | PDF download for authenticated users. | Phase 1 |
| Content Pages (Static) | FR-08 | Blog, Portfolio, and About pages managed via Strapi CMS. | Phase 1 |
| Admin CMS (Strapi) | FR-09 | Full CRUD for Patterns, Blog Posts, Portfolio Items, Products. | Phase 1 |
| Pattern Management (Admin) | FR-10 | Upload PDF, define attributes (difficulty, craft type). | Phase 1 |

### P1: Should Have Within 1 Month Post-Launch (Phase 2)

| Feature | Requirement ID | Description | Target Week |
|:--------|:---------------|:-----------|:-----------|
| Product Showcase | FR-05 | Catalog of physical products with images and external links. | Week 1–2 |
| Wishlist | FR-04 | Users can save products for later reference. | Week 2 |
| Blog & Tutorials Section | FR-08 (Extended) | SEO-optimized blog posts for audience building. | Week 2–3 |
| Portfolio Showcase | FR-08 (Extended) | Gallery of creator's finished works. | Week 2–3 |
| Offline Coaching Request Form | FR-06 | Lead generation form for one-on-one coaching. | Week 3–4 |
| User Profile | FR-07 | My Downloads, My Wishlist, Account Settings. | Week 4 |

### P2: Nice to Have for Future Releases

| Feature | Description | Rationale |
|:--------|:-----------|:---------|
| Email Marketing Integration | Automated welcome series for new registrations. | Nurtures audience relationships. |
| Advanced Analytics | Track pattern popularity, user engagement metrics. | Helps creator optimize content. |
| User Reviews & Testimonials | Users can leave feedback on patterns. | Builds social proof. |
| Multi-Language Support | Localize content for broader reach. | Expands addressable market. |
| Newsletter Signup | Dedicated email signup form (not just pattern download). | Grows mailing list independently. |

---

## Milestones

| Milestone | Phase | Target Date | Deliverables |
|:----------|:------|:-----------|:------------|
| **M1: Brand Foundation** | Phase 1 | Week 2 | Homepage, About page, brand guidelines applied, Strapi CMS configured. |
| **M2: Pattern Library Live** | Phase 1 | Week 4 | All patterns uploaded, filterable gallery, authenticated downloads working. |
| **M3: Auth & User Accounts** | Phase 1 | Week 6 | NextAuth.js integrated, user registration/login working, profile page with downloads. |
| **M4: Shop & Coaching Live** | Phase 2 | Week 8 | Product catalog live, wishlist functional, coaching form working. |
| **M5: Blog & Portfolio** | Phase 2 | Week 10 | Blog section populated, Portfolio Showcase live, SEO optimization applied. |
| **M6: QA & Optimization** | Phase 3 | Week 12 | Performance testing, security audit, bug fixes, documentation complete. |
| **M7: Production Launch** | Phase 3 | Week 13 | Go-live on production, monitoring enabled, admin training completed. |

---

## Dependencies

### External Dependencies

| Dependency | Purpose | Status | Notes |
|:-----------|:--------|:-------|:------|
| **Supabase Project** | Database, authentication, and file storage. | Required | PostgreSQL DB, auth schema, and storage bucket must be provisioned. |
| **Vercel & Render Accounts** | Frontend and backend hosting. | Required | CI/CD pipelines configured; environment variables set for each stage. |
| **Domain Name & SSL Certificate** | Website domain and HTTPS. | Required | Domain registered and pointed to Vercel; SSL auto-provisioned by Vercel. |
| **Email Service (Resend)** | Transactional emails (password resets, admin alerts). | Required | Configure API key in backend. |
| **Google Analytics & Search Console** | SEO tracking and performance monitoring. | Recommended | Set up for blog and organic search measurement. |

### Internal Dependencies

| Dependency | Purpose | Owner | Status |
|:-----------|:--------|:-------|:-------|
| **Brand Guidelines & Design System** | Visual identity, color palette, typography. | Designer | Must be finalized before frontend development. |
| **Figma Mockups & Wireframes** | UI/UX designs for all key pages. | Designer | Required before frontend development begins. |
| **Content Inventory** | List of initial patterns, blog posts, portfolio items, and products. | Creator | Needed by Week 2 to populate Strapi. |
| **Strapi Data Models & API Specs** | Schema definitions for Patterns, Blog Posts, Products. | Developer | Must be finalized before frontend integration. |
| **Admin Training Materials** | Documentation for content management in Strapi. | Developer | Needed before production launch. |

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|:-----|:-------|:-----------|:-------------------|
| **Creator Content Production Bottleneck** | High | Medium | Establish a content calendar and batch-produce patterns/blog posts before launch. Build a 2–3 week content buffer. |
| **Database Performance Under Load** | Medium | Low | Conduct load testing with 100+ concurrent users. Implement caching if needed. |
| **Scope Creep** | High | High | Strictly enforce the PRD and "personal studio" vision. Document feature requests in a P2 backlog. |
| **Admin CMS Usability Issues** | Medium | Medium | Involve the creator in Strapi UI testing early. Provide clear documentation. |
| **Email Delivery Failures** | Medium | Low | Test email service early. Monitor email logs post-launch. |
| **Mobile Responsiveness Issues** | Medium | Medium | Conduct mobile testing on real devices. Use responsive design from the start. |
| **Supabase Storage Quota Exceeded** | Low | Low | Monitor storage usage monthly. Implement image optimization. |

---

## Success Criteria & Go-Live Checklist

### Technical Success Criteria

- [ ] All P0 features functional and tested in production-like environment.
- [ ] Performance metrics met: FCP < 1.8s, LCP < 2.5s, TTI < 3.0s on key pages.
- [ ] Security audit completed; no critical vulnerabilities identified.
- [ ] Uptime monitoring configured; target 99.9% availability.
- [ ] Automated backups enabled for database and file storage.
- [ ] Error logging and monitoring configured.
- [ ] CI/CD pipelines working for frontend and backend.

### Business Success Criteria

- [ ] At least 10 patterns available at launch.
- [ ] At least 10 physical products in shop catalog.
- [ ] Admin can manage all content independently via Strapi CMS.
- [ ] First 50 users registered within first month.
- [ ] Email list grows to 100+ subscribers within first month.
- [ ] Organic search traffic begins appearing for target keywords.

### User Experience Success Criteria

- [ ] User registration and login flow completes in < 2 minutes.
- [ ] Pattern download flow completes in < 30 seconds.
- [ ] Mobile experience is fully functional and responsive.
- [ ] No critical bugs reported in first 2 weeks post-launch.

---

## Post-Launch Support & Iteration Plan

### Week 1–2 Post-Launch (Stabilization)

- Monitor system performance and error logs daily.
- Address critical bugs within 24 hours.
- Gather user feedback via email and analytics.
- Ensure admin can manage content without technical support.

### Week 3–4 Post-Launch (Quick Wins)

- Implement P1 features (product showcase, wishlist, blog, coaching).
- Optimize performance based on real-world usage data.
- Expand content library (add new patterns, blog posts).

### Month 2–3 Post-Launch (Growth Phase)

- Launch SEO campaign targeting long-tail keywords.
- Expand email marketing efforts.
- Gather data for P2 feature prioritization.

---

## Team & Responsibilities

| Role | Responsibilities | Availability |
|:-----|:-----------------|:------------|
| **Developer** | Next.js app, UI components, Strapi CMS setup, API development, database schema. | Full-time, Phases 1–3 |
| **Designer** | Brand guidelines, Figma mockups, UI/UX design. | Part-time, Phases 1–2 |
| **Creator (Admin)** | Content production, pattern design, blog writing, feedback on UX. | Ongoing, all phases |
