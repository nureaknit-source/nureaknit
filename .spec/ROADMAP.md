# ROADMAP.md: Nurea Knit

## Phased Delivery Plan

| Phase | Duration | Goals | Key Deliverables |
|:------|:---------|:------|:-----------------|
| **Phase 1: Foundation & Restructure** | 3 weeks | Set up Payload CMS, Supabase Auth, restructure codebase, shared design system. | Payload integrated, Supabase Auth working, feature-based architecture, UI foundations, route placeholders. |
| **Phase 2: Feature Development** | 5 weeks | Implement auth, pattern library, blog, portfolio, product showcase. | Login/register, pattern CRUD + download, blog with Payload rich text, portfolio gallery, product catalog. |
| **Phase 3: Conversion & Refinement** | 3 weeks | Coaching, wishlist, profile, FAQ, contact, SEO optimization. | Coaching request form, wishlist CRUD, user profile pages, SEO audit, performance tuning. |
| **Phase 4: Launch** | 2 weeks | QA, content population, production deployment. | Bug fixes, content upload, production go-live on Vercel. |

**Timeline:** ~13 weeks total for MVP.

---

## MVP Feature List

### P0: Must Have for Launch

| Feature | ID | Description | Phase |
|:--------|:---|:-----------|:------|
| Supabase Auth (Register/Login) | FR-01 | Email/password authentication | Phase 1 |
| Payload CMS Integration | FR-09 | Embedded CMS with all collections | Phase 1 |
| Feature-Based Architecture | — | Restructured codebase | Phase 1 |
| Shared UI Components | — | Button, Card, Input, Badge, Layout | Phase 1 |
| Pattern Library (Browse & Filter) | FR-02 | Gallery with craft type/difficulty filters | Phase 2 |
| Pattern Download | FR-03 | PDF download for authenticated users | Phase 2 |
| Content Pages | FR-08 | Blog, Portfolio, About via Payload | Phase 2 |
| Product Showcase | FR-05 | Catalog with images and external links | Phase 2 |

### P1: Should Have (Phase 3)

| Feature | ID | Description |
|:--------|:---|:-----------|
| Wishlist | FR-04 | Save/remove products |
| Offline Coaching Request | FR-06 | Lead generation form + email |
| User Profile | FR-07 | Downloads, wishlist, settings |
| Contact Form | — | Simple contact form |
| FAQ Page | — | Frequently asked questions |

### P2: Nice to Have (Post-Launch)

| Feature | Rationale |
|:--------|:---------|
| Email Marketing Integration | Nurture audience relationships |
| Advanced Analytics | Track pattern popularity, engagement |
| Newsletter Signup | Grow mailing list independently |
| Search (patterns, blog) | Improve content discoverability |
| Multi-Language Support | Expand addressable market |

---

## Milestones

| Milestone | Phase | Target | Deliverables |
|:----------|:------|:-------|:-------------|
| **M1: Foundation** | Phase 1 | Week 3 | Payload integrated, Supabase Auth working, feature-based structure, UI components, route placeholders |
| **M2: Core Features** | Phase 2 | Week 8 | Pattern library + download, blog, portfolio, products all working |
| **M3: Full Features** | Phase 3 | Week 11 | Wishlist, coaching, profile, contact, FAQ complete |
| **M4: Launch** | Phase 4 | Week 13 | QA complete, content populated, production live on Vercel |

---

## Dependencies

### External Dependencies

| Dependency | Purpose | Status |
|:-----------|:--------|:-------|
| **Supabase Project** | PostgreSQL database, Auth, file storage | Required — existing |
| **Vercel Account** | Frontend + CMS hosting | Required |
| **Domain Name** | Custom domain for production | Required |
| **Email Service (Resend)** | Transactional emails (coaching) | Required |
| **Google Analytics & Search Console** | SEO tracking | Recommended |

### Internal Dependencies

| Dependency | Owner | Notes |
|:-----------|:-------|:------|
| Brand Guidelines & Design System | Designer | Must be finalized before UI development |
| Content Inventory | Creator | Patterns, blog posts, products for initial population |
| Payload Collection Definitions | Developer | Must be finalized before frontend integration |
| Admin Training Materials | Developer | Needed before production launch |

---

## Risks & Mitigation

| Risk | Impact | Prob. | Mitigation |
|:-----|:-------|:-----:|:-----------|
| **Creator Content Bottleneck** | High | Medium | Content calendar, batch production before launch |
| **Payload CMS Learning Curve** | Medium | High | Follow Payload documentation, start with simple collections |
| **Scope Creep** | High | High | Strictly enforce PRD, document feature requests in P2 backlog |
| **Admin CMS Usability** | Medium | Medium | Involve creator in Payload testing early |
| **Email Delivery Failures** | Medium | Low | Test Resend early, monitor logs post-launch |
| **Supabase Storage Quota** | Low | Low | Monitor usage monthly, optimize images |

---

## Go-Live Checklist

### Technical
- [ ] All P0 features functional and tested
- [ ] Performance metrics met: FCP < 1.8s, LCP < 2.5s, TTI < 3.0s
- [ ] Security: HTTPS, Supabase RLS, Payload access control
- [ ] Uptime monitoring configured (99.9% target)
- [ ] Automated backups enabled
- [ ] Error logging configured
- [ ] CI/CD pipeline working on Vercel

### Business
- [ ] At least 10 patterns available at launch
- [ ] At least 5 products in shop catalog
- [ ] Admin can manage all content independently via Payload
- [ ] First 50 users registered within first month

### User Experience
- [ ] Registration and login flow completes in < 2 minutes
- [ ] Pattern download flow completes in < 30 seconds
- [ ] Mobile experience fully functional and responsive
- [ ] No critical bugs in first 2 weeks post-launch

---

## Post-Launch Plan

### Weeks 1–2: Stabilization
- Monitor performance and error logs daily.
- Address critical bugs within 24 hours.
- Ensure admin can manage content without support.

### Weeks 3–4: Quick Wins
- Implement P1 features (wishlist, coaching, profile).
- Optimize performance based on real usage data.
- Expand content library.

### Months 2–3: Growth
- SEO campaign targeting long-tail keywords.
- Expand email marketing efforts.
- Gather data for P2 feature prioritization.
