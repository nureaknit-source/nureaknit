# REQUIREMENTS.md: Nurea Knit

## Functional Requirements

### User-Facing Modules

#### FR-01: User Authentication & Account Management
**Requirement:** Users MUST be able to register with email and password, log in securely, and log out. Authentication SHALL be managed via Supabase Auth with automatic session handling.

**Acceptance Criteria:**
- User can register with a valid email address and password; system validates email format and password strength (minimum 8 characters).
- User can log in with registered credentials; session persists across page navigation and refreshes automatically.
- User can log out; session is immediately cleared and user is redirected to the homepage.
- Password reset flow allows users to reset password via email (Supabase Auth built-in).
- Supabase Auth handles secure password hashing and session management.

---

#### FR-02: Pattern Library Browsing & Filtering
**Requirement:** Users MUST be able to browse a gallery of knitting and crochet patterns with filtering capabilities. The library SHALL support filtering by craft type (Knitting/Crochet) and difficulty level (Beginner/Intermediate/Advanced). All patterns are free.

**Acceptance Criteria:**
- Pattern gallery displays all patterns in a grid layout with thumbnail images, title, and difficulty badge.
- Filters are applied in real-time; selecting a filter updates the displayed patterns without page reload.
- Multiple filters can be combined (e.g., "Crochet + Intermediate"); results reflect all active filters.

---

#### FR-03: Pattern Download (Authenticated)
**Requirement:** Registered users MUST be able to download pattern PDFs after logging in. Download history SHALL be tracked per user.

**Acceptance Criteria:**
- User must be logged in to see the download button; guests see a "Login to Download" prompt.
- Clicking "Download" immediately initiates the PDF download via a signed URL from Supabase Storage.
- The download event is logged to the user's download history.
- Users can re-download patterns anytime from their profile page.

---

#### FR-04: Wishlist
**Requirement:** Registered users MUST be able to save shop products to a personal wishlist. Users can view and manage their wishlist from their profile.

**Acceptance Criteria:**
- Each product detail page displays a "Save to Wishlist" / "Remove from Wishlist" toggle button.
- Adding a product to wishlist requires authentication; guests are prompted to login.
- Wishlist items persist across sessions and are displayed in the user's profile.
- Users can remove items from wishlist with one click.

---

#### FR-05: Product Showcase
**Requirement:** Users MUST be able to browse a catalog of physical products (kits, tools, finished works). Product pages SHALL display images, descriptions, and external purchase links. No cart, checkout, or payment processing exists.

**Acceptance Criteria:**
- Shop page displays all available products in a grid layout with product image and name.
- Clicking a product opens a detail page showing high-resolution images, full description, and an external link or "Contact to Purchase" CTA.
- No "Add to Cart," "Buy Now," or price fields are displayed.

---

#### FR-06: Offline Coaching Request Form
**Requirement:** Users and guests MUST be able to submit a request for one-on-one offline coaching via a dedicated form. The form SHALL collect name, email, and message, and submit the data as an email to the admin via Resend.

**Acceptance Criteria:**
- Coaching request page displays a form with fields for Name, Email, and Message (textarea).
- Form validates that all fields are filled and email format is valid before submission.
- Upon submission, the form data is stored via Payload API and sent as an email to the admin; user receives a confirmation message.

---

#### FR-07: User Profile
**Requirement:** Registered users MUST have access to a personal profile page to view downloaded patterns, saved wishlist items, and manage account settings.

**Acceptance Criteria:**
- Profile page is accessible only to authenticated users; unauthenticated users are redirected to the login page.
- Profile displays three sections: "My Downloads", "My Wishlist", and "Account Settings".
- Each section is clearly labeled and accessible via tabs or sidebar navigation.

---

#### FR-08: Static Content Pages (Blog, Portfolio, About)
**Requirement:** The site MUST feature CMS-driven static pages for Blog/Tutorials, Portfolio Showcase, and an About page. These pages SHALL be managed via Payload CMS and rendered on the frontend.

**Acceptance Criteria:**
- Blog page displays a list of published blog posts with title, excerpt, publication date, and a "Read More" link; posts are sorted by date (newest first).
- Individual blog post pages display full rich text content, publication date, and featured image.
- Portfolio page displays a gallery of creator's work (images, descriptions) organized by category or date.
- About page content is managed via Payload CMS Pages collection.

---

### Admin-Facing Modules (via Payload CMS)

#### FR-09: Content Management (CRUD Operations)
**Requirement:** The Admin MUST be able to perform full CRUD operations on all content collections via Payload CMS. Content collections include Patterns, Blog Posts, Portfolio Items, Products, and Pages.

**Acceptance Criteria:**
- Admin can access Payload admin panel with secure login credentials at `/admin`.
- For each collection, admin can create new entries, view existing entries, edit entries, and delete entries.
- Changes are saved to the database immediately; published content is reflected on the frontend.

---

#### FR-10: Pattern Management
**Requirement:** The Admin MUST be able to create, edit, and delete patterns. For each pattern, the admin SHALL be able to upload a PDF file and define its attributes (difficulty level, craft type).

**Acceptance Criteria:**
- Pattern creation form includes fields for Title, Description, Craft Type (dropdown), Difficulty Level (dropdown), and PDF File Upload.
- Admin can upload a PDF file; the system validates file format and stores it in Supabase Storage via Payload.
- Admin can edit pattern details and replace the PDF file.

---

#### FR-11: Product Management
**Requirement:** The Admin MUST be able to manage shop products. Each product SHALL include images, descriptions, and an optional external purchase link.

**Acceptance Criteria:**
- Product creation form includes fields for Name, Description, Images (multiple), and External Link (optional URL field).
- Admin can edit or delete products; changes are reflected on the frontend immediately.

---

#### FR-12: Coaching Request Management
**Requirement:** The Admin MUST be able to view and manage coaching request submissions.

**Acceptance Criteria:**
- A dedicated section in Payload CMS displays all coaching requests with name, email, message, and submission date.
- Admin can update the status of a request (New, Contacted, Archived).

---

## Non-Functional Requirements

| Category | Requirement | Measurable Target |
|:---|:---|:---|
| **Performance** | First Contentful Paint (FCP) | < 1.8 seconds on 4G network |
| | Largest Contentful Paint (LCP) for key pages | < 2.5 seconds on 4G network |
| | Time to Interactive (TTI) | < 3.0 seconds on 4G network |
| | Image Optimization | All images optimized; WebP format; lazy-loaded below fold |
| **Security** | Data Transmission | 100% HTTPS (TLS 1.2+); no mixed content |
| | Password Security | Managed by Supabase Auth (automatic bcrypt hashing) |
| | Admin Authentication | Payload admin panel requires secure login; session timeout |
| **Scalability** | Concurrent Users | Handle 100 concurrent users at launch without degradation |
| | File Storage | Supabase Storage supports unlimited file uploads |
| | Infrastructure Auto-Scaling | Vercel auto-scales as needed |
| **Availability**| System Uptime | 99.9% uptime target |
| | Backup & Recovery | Supabase automatic daily backups; 30-day retention |
| **Usability** | Accessibility | WCAG 2.1 Level AA compliance |
| | Responsiveness | Fully responsive design; mobile (320px+), tablet (768px+), desktop (1024px+) |
| | Form Validation | Real-time client-side validation; clear error messages |

---

## Technical Constraints

- **Single Admin Management:** The website is managed by a single Admin (the creator). The Payload admin interface MUST be intuitive for a non-technical user.
- **File Storage:** PDF patterns and product images MUST be stored in Supabase Storage. Managed via Payload CMS uploads.
- **Email Delivery:** Transactional emails (coaching notifications) MUST be sent via Resend.

---

## Assumptions

- **Creator Capability:** The creator is capable of producing all required content (patterns, blog posts, portfolio items) on a consistent schedule.
- **Email Capture:** Users are willing to register and provide their email address to download patterns.
- **Admin Technical Proficiency:** The admin has basic technical proficiency (can log into Payload, upload files, fill out forms) but is not a developer.
- **Offline Coaching:** Offline coaching requests are handled entirely outside the system (via email); the system only captures and forwards the request.

---

## User Flows & Interactions

### Guest User Flow
1. Guest visits homepage → browses public content.
2. Guest browses pattern library → filters by craft type, difficulty.
3. Guest clicks "Download Pattern" → redirected to login/register page.
4. Guest registers or logs in via Supabase Auth → redirected back to pattern with download available.
5. Guest browses product showcase → views product details with external purchase link.
6. Guest visits coaching page → submits request form.

### Registered User Flow (Pattern Download)
1. User logs in via Supabase Auth → browses pattern library.
2. User clicks "Download" on a pattern → PDF downloads immediately via signed URL.
3. User visits profile → "My Downloads" section displays all downloaded patterns with re-download links.

### Registered User Flow (Wishlist)
1. User logs in → browses product showcase.
2. User clicks "Save to Wishlist" on a product → product added to wishlist.
3. User visits profile → "My Wishlist" section displays all saved products.

### Coaching Request Flow
1. Guest or user visits "Coaching" page → views coaching request form.
2. User fills form (name, email, message) → submits.
3. Form data stored in Payload → email sent to admin via Resend → user sees confirmation.
4. Admin reviews email → responds directly to user's email address.

### Admin Flow (Content Management)
1. Admin logs into Payload CMS at `/admin` → accesses content dashboard.
2. Admin creates/edits patterns, blog posts, portfolio items, products.
3. Admin uploads PDF files and images.
4. Admin publishes content → content appears on frontend.
5. Admin views coaching requests → updates status.
