# BUSINESS_RULES.md: Nurea Knit

## Core Business Rules

These rules define the fundamental operational policies and constraints governing the Nurea Knit platform.

- **BR-01: Single Creator Principle:** All content (patterns, blog posts, portfolio items) and products offered on Nurea Knit originate solely from the designated creator (Admin). The platform does not support multiple vendors, instructors, or community contributions.
- **BR-02: Free Content Model:** All patterns on the platform are free to download. There are no premium or paid content offerings.
- **BR-03: Pattern Download (Authenticated):** Only registered, authenticated users can download pattern PDFs. Download history is tracked per user.
- **BR-04: Email Capture:** User email addresses are captured upon registration for lead generation and future marketing communications.
- **BR-05: Product Showcase Only:** Physical products displayed in the shop are for showcase purposes only. No purchases, cart, or checkout functionality exists on the platform. External links or contact instructions guide users to purchase elsewhere.
- **BR-06: Offline Coaching Request:** The platform facilitates lead generation for one-on-one offline coaching via a dedicated request form. This is a communication channel, not a booking or scheduling system.
- **BR-07: Wishlist:** Registered users can save shop products to a personal wishlist. This is for reference only and does not imply purchase intent or reservation.

## Domain Constraints & Validation Rules

- **User Accounts:**
  - Email addresses must be unique and valid.
  - Passwords must meet minimum complexity requirements (min 8 characters).
- **Patterns:**
  - Each pattern must have a unique slug.
  - Must be associated with a craft type (Knitting, Crochet, Both).
  - Must have a difficulty level (Beginner, Intermediate, Advanced).
  - A PDF file must be uploaded for each pattern.
- **Shop Products (Physical Goods):**
  - Each product must have a unique slug.
  - Must have a name, description, and at least one image.
- **Coaching Request Form:**
  - Name field is required.
  - Email field is required and must be a valid email format.
  - Message field is required.
- **Content Uploads:**
  - Pattern files must be in PDF format.
  - Images for products, portfolio, and blog must be in common web image formats (JPG, PNG, WebP).

## Status Transitions

### Coaching Request Status Transitions

| Current State | Event/Action | New State | Notes |
|:--------------|:-------------|:----------|:------|
| New | Admin reviews request | Contacted | Admin acknowledges the request |
| Contacted | Admin completes follow-up | Archived | Request is closed |

## Role Access Policies

- **Guest (Anonymous User):**
  - Can browse all public content (Homepage, Blog, Portfolio, About pages).
  - Can view the Pattern Library and Product Showcase.
  - Can submit the One-on-One Offline Coaching request form.
  - Cannot download patterns (must register/login).

- **Registered User (Authenticated User):**
  - Possesses all permissions of a Guest.
  - Can download patterns (PDF format).
  - Can view download history in their profile.
  - Can save products to wishlist.
  - Can manage account settings.

- **Admin (Creator):**
  - Has full administrative access to Payload CMS.
  - Can perform CRUD operations on all content collections: Patterns, Blog Posts, Portfolio Items, Products, Pages, Coaching Requests.
  - Can upload and manage PDF files for patterns.
  - Can view and manage coaching request submissions.
