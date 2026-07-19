# CONTENT_STRATEGY.md: Nurea Knit

## Overview

This document defines the content strategy for Nurea Knit, a personal brand website for a knitting and crochet designer, educator, and content creator. The strategy outlines content pillars, creation workflows, distribution channels, and SEO approach. All content is created and managed by a single creator to maintain brand consistency, personal voice, and exclusivity.

## Content Pillars & Core Content Types

Nurea Knit's content strategy is built on four primary pillars, each serving distinct audience engagement goals:

### Pattern Library

**Purpose:** Establish authority, drive SEO traffic, and build email list.

- Beginner-friendly designs with clear, step-by-step instructions.
- Seasonal or trending patterns to capture search traffic.
- All patterns are free — accessible after user registration.
- Published as downloadable PDF files (stored in Supabase Storage).
- Updated monthly to maintain fresh content and SEO signals.
- Target: 2–3 new patterns per month.

**Content Attributes:**
- Craft type (Knitting / Crochet)
- Difficulty level (Beginner / Intermediate / Advanced)
- Estimated time to completion
- Yarn weight and material recommendations
- Finished dimensions and photos

### Blog & Tutorials (Free Educational Content)

**Purpose:** Drive organic search traffic, establish thought leadership, and nurture audience trust.

**Content Types:**
- **How-To Guides:** Step-by-step tutorials on specific techniques.
- **Design Insights:** Behind-the-scenes posts on the creator's design process.
- **Material Guides:** Recommendations for yarns, tools, and suppliers.
- **Trend Analysis:** Seasonal trends, color forecasts, emerging techniques.
- **Project Spotlights:** Detailed case studies of completed works.

**Publishing Schedule:**
- 2 blog posts per month (minimum).
- Evergreen content prioritized for long-term SEO value.

### Portfolio Showcase (Visual Brand Building)

**Purpose:** Demonstrate expertise, build brand credibility, and inspire potential customers.

- High-quality photography of completed works.
- Organized by category (Garments, Accessories, Home Décor, Experimental).
- Filterable by craft type and difficulty level.
- Add 2–3 new portfolio items per month.

### About & Creator Story (Trust & Connection)

**Purpose:** Humanize the brand, build emotional connection, and establish authority.

- Creator bio, philosophy, creative process.
- Media and recognition (if applicable).
- Contact and social links.

## Content Calendar & Production Workflow

### Annual Content Planning

| Quarter | Blog Posts | New Patterns | Portfolio Items |
|:--------|:----------:|:------------:|:---------------:|
| Q1 | 6 | 3 | 6 |
| Q2 | 6 | 3 | 6 |
| Q3 | 6 | 3 | 6 |
| Q4 | 6 | 3 | 6 |

### Monthly Production Workflow

1. **Content Planning (Week 1):** Outline blog topics, pattern ideas, portfolio updates.
2. **Content Creation (Weeks 2–3):** Produce blog posts, photograph portfolio items, develop patterns.
3. **Review & Editing (Week 4):** Proofread, optimize images, finalize PDFs, schedule publication.
4. **Publication & Promotion:** Publish to website, share on social media, email subscribers.

### Content Management System (Payload CMS)

All content is managed via Payload CMS admin panel (embedded in Next.js), enabling the creator to:
- Create, edit, and publish blog posts, patterns, and portfolio items without technical knowledge.
- Schedule content publication in advance.
- Manage media assets (images, PDFs) centrally.
- Maintain consistent metadata and SEO fields across all collections.

## Content Types & Metadata

### Pattern Content Model

| Field | Type | Required | Notes |
|:---|:---|:---:|:---|
| Title | Text | ✅ | e.g., "Cozy Winter Cowl" |
| Slug | Text | ✅ | URL-friendly identifier |
| Description | RichText | ✅ | Brief overview of the pattern |
| Difficulty | Select | ✅ | Beginner / Intermediate / Advanced |
| Craft Type | Select | ✅ | Knitting / Crochet / Both |
| PDF | Upload | ✅ | Uploaded to Supabase Storage |
| Thumbnail | Upload | ✅ | Cover image for pattern gallery |
| Yarn Weight | Text | | Recommended yarn weight |
| Estimated Time | Text | | e.g., "4–6 hours" |
| Materials | Text | | Recommended supplies |
| Tags | Array | | e.g., ["seasonal", "beginner-friendly"] |
| Published Date | Date | ✅ | Auto-set on publication |

### Blog Post Content Model

| Field | Type | Required | Notes |
|:---|:---|:---:|:---|
| Title | Text | ✅ | e.g., "How to Fix a Dropped Stitch" |
| Slug | Text | ✅ | URL-friendly identifier |
| Content | RichText | ✅ | Full blog post body |
| Featured Image | Upload | ✅ | Hero image |
| Excerpt | Text | ✅ | 150–200 character summary |
| Category | Select | ✅ | Tutorial / Design / Material / Trend / Spotlight |
| Tags | Array | | e.g., ["beginner", "troubleshooting"] |
| Published Date | Date | ✅ | Auto-set on publication |
| Author | Text | ✅ | Always "Nurea Knit" |

### Portfolio Item Content Model

| Field | Type | Required | Notes |
|:---|:---|:---:|:---|
| Title | Text | ✅ | e.g., "Autumn Leaf Shawl" |
| Slug | Text | ✅ | URL-friendly identifier |
| Description | RichText | ✅ | Project narrative |
| Category | Select | ✅ | Garments / Accessories / Home Décor / Experimental |
| Craft Type | Select | ✅ | Knitting / Crochet |
| Difficulty | Select | | Beginner / Intermediate / Advanced |
| Images | Array of Uploads | ✅ | Multiple high-quality photos |
| Techniques | Array | | e.g., ["colorwork", "lace"] |
| Completion Date | Date | ✅ | When the project was finished |

## SEO Strategy

### Keyword Research & Targeting

**Primary Keywords:**
- "Crochet patterns for beginners"
- "Knitting tutorials"
- "How to crochet"
- "Beginner knitting projects"

**Long-Tail Keywords:**
- "Easy crochet patterns for beginners"
- "How to fix a dropped stitch in crochet"
- "Best yarn for amigurumi"

**Strategy:**
- Blog posts target long-tail keywords with lower competition.
- Pattern pages target medium-tail keywords.
- Portfolio pages include keyword-rich descriptions.

### On-Page SEO

- Title tags include primary keyword (50–60 characters).
- Meta descriptions include keyword and CTA (150–160 characters).
- Proper heading hierarchy (H1, H2, H3).
- Image alt text with descriptive, keyword-rich phrases.
- Clean URL structure (`/patterns/easy-crochet-scarf`).
- Internal linking (min 3 links per post).
- Word count: 1,500–2,500 for comprehensive guides.

### Technical SEO

- Next.js SSG/ISR for fast page loads.
- Image optimization (WebP, lazy loading).
- XML sitemap auto-generated.
- Structured data (schema.org) for patterns, blog posts, products.

## Email Marketing

### Lead Magnets
- Free pattern downloads (gated behind registration).
- Exclusive beginner's guide or resource list.

### Welcome Series (Automated)
- Email 1: Welcome + link to free pattern.
- Email 2 (Day 3): Introduction to creator and brand story.
- Email 3 (Day 7): Highlight popular blog posts and patterns.

### Monthly Newsletter
- New blog posts and tutorials.
- Upcoming pattern releases.
- Seasonal project ideas and inspiration.

## Content Tone & Brand Voice

- **Warm & Approachable:** Conversational language, not intimidating.
- **Authentic & Personal:** Real experiences, challenges, learning moments.
- **Educational & Empowering:** Clear, actionable guidance.
- **Artistic & Inspirational:** Celebrate creativity and craftsmanship.
- **Inclusive & Encouraging:** Welcome all skill levels.

## Content Maintenance

- Evergreen content remains available indefinitely.
- Outdated content is updated rather than deleted.
- Seasonal content is refreshed annually.
- Quarterly content audit for accuracy and SEO optimization.

---

**See [PRD.md](PRD.md) for product vision and technology stack.**
