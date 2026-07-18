# CONTENT_STRATEGY.md: Nureaknite

## Overview

This document defines the content strategy for Nureaknite, a personal brand website for a knitting and crochet designer, educator, and content creator. The strategy outlines content pillars, creation workflows, distribution channels, and SEO approach. All content is created and managed by a single creator to maintain brand consistency, personal voice, and exclusivity.

See PRD.md for product vision, functional requirements, and technology stack.

## Content Pillars & Core Content Types

Nureaknite's content strategy is built on four primary pillars, each serving distinct audience engagement goals:

### Pattern Library

**Purpose:** Establish authority, drive SEO traffic, and build email list.

**Patterns:**
- Beginner-friendly designs with clear, step-by-step instructions.
- Seasonal or trending patterns to capture search traffic.
- All patterns are free — accessible after user registration.
- Published as downloadable PDF files (via Supabase Storage).
- Updated monthly to maintain fresh content and SEO signals.
- Target: 2–3 new patterns per month.

**Content Attributes:**
- Craft type (Knitting / Crochet).
- Difficulty level (Beginner / Intermediate / Advanced).
- Estimated time to completion.
- Yarn weight and material recommendations.
- Finished dimensions and photos.

### Blog & Tutorials (Free Educational Content)

**Purpose:** Drive organic search traffic, establish thought leadership, and nurture audience trust through free, high-value content.

**Content Types:**
- **How-To Guides:** Step-by-step tutorials on specific techniques (e.g., "How to Fix a Dropped Stitch," "Blocking Techniques for Beginners").
- **Design Insights:** Behind-the-scenes posts on the creator's design process, inspiration sources, and creative decisions.
- **Material Guides:** Recommendations for yarns, tools, and suppliers; comparisons and reviews.
- **Trend Analysis:** Seasonal trends, color forecasts, and emerging techniques in the knitting/crochet community.
- **Project Spotlights:** Detailed case studies of completed works with photos, challenges overcome, and lessons learned.

**Publishing Schedule:**
- 2 blog posts per month (minimum).
- Evergreen content prioritized for long-term SEO value.
- Seasonal content published 4–6 weeks in advance.

**SEO Strategy:**
- Target long-tail keywords: "beginner crochet patterns," "how to knit a sweater," "best yarn for amigurumi."
- Internal linking to pattern library and shop products.
- Meta descriptions and alt text optimized for search visibility.
- Target: 20%+ of total website traffic from organic search by Q3.

### Portfolio Showcase (Visual Brand Building)

**Purpose:** Demonstrate expertise, build brand credibility, and inspire potential customers.

**Content:**
- High-quality photography of completed works (finished garments, accessories, home décor items).
- Each portfolio item includes: project name, materials used, techniques employed, creation date, and a brief narrative.
- Organized by category (Garments, Accessories, Home Décor, Experimental).
- Filterable by craft type and difficulty level.

**Update Frequency:**
- Add 2–3 new portfolio items per month as new works are completed.
- Refresh photography seasonally to reflect current aesthetic and trends.

**Integration:**
- Portfolio items may link to related patterns.
- Featured portfolio items displayed on the homepage to immediately convey brand quality.

### About & Creator Story (Trust & Connection)

**Purpose:** Humanize the brand, build emotional connection, and establish authority and credibility.

**Content Sections:**
- **Creator Bio:** Personal journey into knitting/crochet, key milestones, and why the creator is passionate about teaching.
- **Philosophy & Approach:** Core values, teaching methodology, and commitment to accessibility and inclusivity.
- **Creative Process:** How the creator develops new patterns, sources inspiration, and iterates on designs.
- **Media & Recognition:** Press mentions, collaborations, exhibitions, or community involvement (if applicable).
- **Contact & Social Links:** Email, Instagram, Pinterest, and other social channels.

**Tone:**
- Warm, personal, and conversational.
- Authentic and vulnerable (sharing challenges and learning moments).
- Professional yet approachable.

**Update Frequency:**
- Reviewed and refreshed annually or when significant milestones occur.

## Content Calendar & Production Workflow

### Annual Content Planning

**Q1 (Jan–Mar):**
- Blog: 6 posts (e.g., "New Year, New Skills," winter color trends, beginner guides).
- Patterns: 3 new patterns.
- Portfolio: 6 new items.

**Q2 (Apr–Jun):**
- Blog: 6 posts (spring projects, material guides, design inspiration).
- Patterns: 3 new patterns.
- Portfolio: 6 new items.

**Q3 (Jul–Sep):**
- Blog: 6 posts (summer projects, advanced techniques, trend forecasts).
- Patterns: 3 new patterns.
- Portfolio: 6 new items.

**Q4 (Oct–Dec):**
- Blog: 6 posts (holiday projects, gift guides, year-in-review).
- Patterns: 3 new patterns.
- Portfolio: 6 new items.

### Monthly Production Workflow

1. **Content Planning (1st week):** Creator outlines blog topics, pattern ideas, and portfolio updates for the month.
2. **Content Creation (2nd–3rd week):** Creator produces blog posts, photographs portfolio items, and develops patterns.
3. **Review & Editing (4th week):** Proofread blog posts, optimize images, finalize pattern PDFs, and schedule publication.
4. **Publication & Promotion (End of month):** Publish content to website, share on social media, and send email announcements to subscribers.

### Content Management System (Strapi)

All content is managed via Strapi headless CMS, enabling the creator to:
- Create, edit, and publish blog posts, patterns, and portfolio items without technical knowledge.
- Schedule content publication in advance.
- Manage media assets (images, PDFs) centrally.
- Maintain consistent metadata and SEO fields across all content types.

See TECHNICAL_ARCHITECTURE.md for Strapi configuration details.

## Content Types & Metadata Structure

### Pattern Content Model

| Field | Type | Required | Notes |
|:---|:---|:---:|:---|
| Title | String | ✅ | e.g., "Cozy Winter Cowl" |
| Description | Text | ✅ | Brief overview of the pattern. |
| Difficulty | Enum | ✅ | Beginner / Intermediate / Advanced |
| Craft Type | Enum | ✅ | Knitting / Crochet |
| PDF File | File | ✅ | Uploaded to Supabase Storage. |
| Thumbnail Image | Image | ✅ | Cover image for pattern gallery. |
| Yarn Weight | String | ❌ | e.g., "Worsted Weight" |
| Estimated Time | String | ❌ | e.g., "4–6 hours" |
| Materials List | Text | ❌ | Recommended supplies. |
| Tags | Array | ❌ | e.g., ["seasonal", "beginner-friendly", "gift"] |
| Published Date | Date | ✅ | Auto-set on publication. |
| SEO Slug | String | ✅ | URL-friendly identifier. |
| SEO Meta Description | String | ❌ | 150–160 characters for search results. |

### Blog Post Content Model

| Field | Type | Required | Notes |
|:---|:---|:---:|:---|
| Title | String | ✅ | e.g., "How to Fix a Dropped Stitch" |
| Content | Rich Text | ✅ | Full blog post body with formatting. |
| Featured Image | Image | ✅ | Hero image for the post. |
| Excerpt | Text | ✅ | 150–200 character summary. |
| Category | Enum | ✅ | Tutorial / Design / Material / Trend / Spotlight |
| Tags | Array | ❌ | e.g., ["beginner", "troubleshooting", "knitting"] |
| Published Date | Date | ✅ | Auto-set on publication. |
| Author | String | ✅ | Always "Nureaknite" (single creator). |
| SEO Slug | String | ✅ | URL-friendly identifier. |
| SEO Meta Description | String | ❌ | 150–160 characters for search results. |
| SEO Keywords | Array | ❌ | Primary and secondary keywords. |

### Portfolio Item Content Model

| Field | Type | Required | Notes |
|:---|:---|:---:|:---|
| Title | String | ✅ | e.g., "Autumn Leaf Shawl" |
| Description | Text | ✅ | Project narrative and inspiration. |
| Category | Enum | ✅ | Garments / Accessories / Home Décor / Experimental |
| Craft Type | Enum | ✅ | Knitting / Crochet |
| Difficulty | Enum | ✅ | Beginner / Intermediate / Advanced |
| Images | Array of Images | ✅ | Multiple high-quality photos. |
| Materials Used | Text | ❌ | Yarn type, quantities, tools. |
| Techniques | Array | ❌ | e.g., ["colorwork", "lace", "shaping"] |
| Completion Date | Date | ✅ | When the project was finished. |
| Related Pattern | Reference | ❌ | Link to pattern if available for purchase. |
| Related Class | Reference | ❌ | Link to relevant class. |
| SEO Slug | String | ✅ | URL-friendly identifier. |

## SEO & Organic Growth Strategy

### Keyword Research & Targeting

**Primary Keywords (High Volume, Medium Competition):**
- "Crochet patterns for beginners"
- "Knitting tutorials"
- "How to crochet"
- "Beginner knitting projects"

**Long-Tail Keywords (Lower Volume, Lower Competition):**
- "Easy crochet patterns for beginners"
- "How to fix a dropped stitch in crochet"
- "Best yarn for amigurumi"
- "Crochet blanket patterns free"

**Strategy:**
- Blog posts target long-tail keywords with lower competition.
- Pattern pages target medium-tail keywords (e.g., "cozy cowl crochet pattern").
- Portfolio pages include keyword-rich descriptions.

### On-Page SEO

**Blog Posts:**
- Title: Include primary keyword (50–60 characters).
- Meta Description: Include keyword and call-to-action (150–160 characters).
- Headings: Use H2 and H3 tags with keyword variations.
- Internal Links: Link to related patterns and blog posts (minimum 3 per post).
- Images: Optimize alt text with descriptive, keyword-rich phrases.
- Word Count: Target 1,500–2,500 words for comprehensive guides.

**Pattern Pages:**
- Title: Include craft type and difficulty (e.g., "Easy Crochet Cowl Pattern for Beginners").
- Meta Description: Highlight key features and difficulty level.
- Content: Include yarn weight, estimated time, and materials in structured format.
- Images: High-quality photos of finished project from multiple angles.



### Technical SEO

- **Site Speed:** Optimize images, leverage Next.js static generation, and use Vercel CDN for fast delivery.
- **Mobile Responsiveness:** Ensure all pages render correctly on mobile, tablet, and desktop.
- **XML Sitemap:** Auto-generated and submitted to Google Search Console.
- **Robots.txt:** Configured to allow search engine crawling of all public pages.
- **Structured Data:** Implement schema markup for blog posts, products, and courses.
- **HTTPS:** All traffic served over secure HTTPS (TLS 1.2+).

### Link Building & Authority

- **Internal Linking:** Every blog post links to at least 3 related patterns or portfolio items.
- **Social Sharing:** Blog posts and portfolio items shared on Instagram, Pinterest, and email newsletter.
- **Guest Contributions:** (Future) Contribute guest posts to knitting/crochet blogs and publications.
- **Backlink Opportunities:** (Future) Reach out to craft blogs, YouTube channels, and communities for mentions and links.

### Content Refresh & Maintenance

- **Quarterly Review:** Audit top-performing blog posts and update with new information, images, or links.
- **Seasonal Updates:** Refresh seasonal content (e.g., holiday guides) annually.
- **Broken Link Audits:** Monthly checks for broken internal and external links.

## Email Marketing & Audience Building

### Email List Growth

**Lead Magnets:**
- Free pattern downloads (gated behind email capture).
- Exclusive beginner's guide or resource list.
- Early access to new patterns.

**Target:** 100+ new email subscribers per month by Q2.

### Email Campaigns

**Welcome Series (Automated):**
- Email 1: Welcome + link to free pattern.
- Email 2 (Day 3): Introduction to creator and brand story.
- Email 3 (Day 7): Highlight popular blog posts and patterns.

**Monthly Newsletter:**
- New blog posts and tutorials.
- Upcoming pattern releases.
- Seasonal project ideas and inspiration.
- Exclusive discounts or early access for subscribers.

**Promotional Campaigns:**
- New pattern launch: 3-email sequence over 2 weeks.
- Seasonal sales: Holiday gift guides and limited-time offers.
- Re-engagement: Winback campaigns for inactive subscribers (quarterly).

**Tools:** Strapi integration with email service (e.g., Mailchimp, Brevo) for automated list management and campaign tracking.

## Social Media Content Strategy

### Platform Focus

**Instagram:**
- Primary platform for visual storytelling and community building.
- Content: Work-in-progress photos, finished projects, behind-the-scenes, creator tips.
- Posting frequency: 3–4 posts per week + daily Stories.
- Hashtags: Mix of popular (#crochet, #knitting) and niche (#crochetdesigner, #handmadewithcare).

**Pinterest:**
- Secondary platform for driving traffic to blog posts and patterns.
- Content: High-quality images of finished projects with descriptive pins linking to blog posts and pattern pages.
- Posting frequency: 5–10 pins per week (mix of new and repins).
- Strategy: Create multiple pin designs for each blog post and pattern to maximize reach.

### Content Repurposing

- Blog posts adapted into Instagram carousel posts or Stories.
- Portfolio photos shared on Instagram and Pinterest.
- Email newsletter content summarized in social media posts.

## Content Tone & Brand Voice

### Core Characteristics

- **Warm & Approachable:** Conversational language that makes knitting/crochet feel accessible, not intimidating.
- **Authentic & Personal:** Share real experiences, challenges, and learning moments. Avoid overly polished or corporate tone.
- **Educational & Empowering:** Provide clear, actionable guidance that builds confidence in learners.
- **Artistic & Inspirational:** Celebrate creativity, experimentation, and the joy of handmade craftsmanship.
- **Inclusive & Encouraging:** Welcome all skill levels and backgrounds. Emphasize that mistakes are part of the learning process.

### Writing Guidelines

- Use "you" and "we" to create connection with the audience.
- Include personal anecdotes and stories to illustrate points.
- Avoid jargon; define technical terms when first introduced.
- Use short paragraphs and bullet points for readability.
- Include calls-to-action that invite engagement (e.g., "Share your finished project in the comments!").

## Monetization Through Content

### Audience Building

**Content (Blog, Patterns):**
- Drives organic search traffic and builds email list.
- Establishes authority and trust within the knitting/crochet community.

**Email Newsletter:**
- Nurtures audience relationships and drives engagement.
- Enables direct communication for new releases and updates.

**Social Media:**
- Builds brand awareness and drives traffic to website.
- Enables community engagement and customer feedback.

**One-on-One Offline Coaching:**
- Lead generation via simple request form (not automated booking).
- Admin reviews requests and negotiates pricing/scheduling directly with interested clients.

## Content Performance Metrics & Analytics

### Key Performance Indicators (KPIs)

| Metric | Target | Frequency |
|:---|:---|:---|
| Blog Traffic (Monthly) | 2,000+ unique visitors by Q3 | Monthly |
| Organic Search Traffic | 20%+ of total traffic by Q3 | Monthly |
| Email List Growth | 100+ new subscribers/month by Q2 | Monthly |
| Email Open Rate | 25%+ | Monthly |
| Email Click-Through Rate | 3%+ | Monthly |
| Pattern Downloads | 100+ per month by Q2 | Monthly |
| Social Media Engagement | 5%+ engagement rate on Instagram | Monthly |
| Portfolio Views | 500+ monthly views by Q2 | Monthly |
| Registered Users | 200+ by Q3 | Monthly |

### Analytics Tools

- **Google Analytics 4:** Track website traffic, user behavior, and conversion funnels.
- **Google Search Console:** Monitor search performance, keywords, and indexing status.
- **Strapi Analytics:** Track content performance and user interactions within the CMS.
- **Email Service Analytics:** Monitor newsletter open rates, click-through rates, and subscriber growth.
- **Social Media Insights:** Track engagement, reach, and follower growth on Instagram and Pinterest.

### Reporting & Optimization

- **Monthly Review:** Analyze traffic, engagement, and sales data to identify top-performing content.
- **Quarterly Strategy Adjustment:** Based on performance data, adjust content topics, publishing frequency, and promotional strategies.
- **Content Audit:** Annually review all content for accuracy, relevance, and SEO optimization.

## Content Governance & Approval Workflow

### Single Creator Model

As Nureaknite is managed by a single creator, content governance is streamlined:

1. **Planning:** Creator outlines content ideas and calendar.
2. **Creation:** Creator produces all content (writing, photography, video).
3. **Self-Review:** Creator proofreads, optimizes, and prepares content for publication.
4. **Publication:** Creator publishes via Strapi CMS to the website.
5. **Promotion:** Creator shares content on social media and email.

### Quality Standards

- **Accuracy:** All technical information (patterns, techniques) is verified before publication.
- **Consistency:** Content tone, style, and branding are consistent across all channels.
- **Accessibility:** All images include alt text; videos include captions (where applicable).
- **SEO Compliance:** All content includes optimized titles, meta descriptions, and internal links.

## Future Content Expansion (Post-Launch)

### Potential Content Initiatives (Year 2+)

- **Video Tutorials:** Public YouTube channel with free beginner tutorials and behind-the-scenes content.
- **Podcast:** Audio content exploring design philosophy, creative process, and industry trends.
- **Community Challenges:** Monthly design challenges or project prompts to engage audience (without building a full community platform).
- **Collaborations:** Guest posts, interviews, or joint projects with other creators or brands.

- **Merchandise:** Branded items (stickers, t-shirts, notepads) featuring original designs.
- **Affiliate Partnerships:** Recommendations for yarn, tools, and supplies with affiliate links (if aligned with brand values).

These initiatives will be evaluated based on audience demand, creator capacity, and alignment with the core brand vision.

## Content Maintenance & Archival

### Evergreen Content

- Blog posts and patterns remain available indefinitely unless outdated or inaccurate.
- Outdated content is updated rather than deleted to preserve SEO value and user access.

### Seasonal Content

- Seasonal blog posts and patterns are archived at the end of the season but remain accessible via search and archives.
- Seasonal content is refreshed and republished annually.

### Discontinued Products

- If a pattern is discontinued, it is removed from the public library.

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Owner:** Nureaknite Creator  
**Next Review:** Q2 2024