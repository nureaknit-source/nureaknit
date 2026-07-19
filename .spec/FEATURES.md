# FEATURES.md: Nurea Knit

## 1. Authentication & User Management

This module provides the core functionality for users to create and manage their accounts, enabling access to pattern downloads and wishlist features. Authentication is powered by Supabase Auth.

### 1.1. User Registration & Login (FR-01)
- **Purpose:** Allow new users to create an account and existing users to sign in securely.
- **User Stories:**
  - As a guest, I want to register for an account using my email and a password so I can download patterns and save products to my wishlist.
  - As a registered user, I want to log in with my credentials to access my downloads and wishlist.
  - As a registered user, I want to log out to secure my account when I'm done.
  - As a user, I want to be able to reset my password if I forget it.
- **Acceptance Criteria:**
  - Users can successfully register with a unique email address and a strong password.
  - Users can log in using their registered email and password.
  - Users can log out from any authenticated session.
  - A password reset flow is available via Supabase Auth.
  - Authentication is handled by Supabase Auth.
- **Edge Cases:**
  - Attempting to register with an already existing email address.
  - Attempting to log in with incorrect credentials.
  - Network errors during registration or login.
  - Session expiration and automatic refresh.

## 2. Pattern Library

This module showcases the creator's knitting and crochet patterns. All patterns are free and available for download after login.

### 2.1. Pattern Browsing & Filtering (FR-02)
- **Purpose:** Enable users to easily discover patterns based on their preferences.
- **User Stories:**
  - As a guest, I want to browse a gallery of patterns to find inspiration for my next project.
  - As a guest, I want to filter patterns by craft type (knitting/crochet) to see only relevant designs.
  - As a guest, I want to filter patterns by difficulty level (Beginner, Intermediate, Advanced) to find patterns suitable for my skill level.
- **Acceptance Criteria:**
  - All available patterns are displayed in a browsable gallery format.
  - Each pattern entry includes a clear image, title, craft type, and difficulty badge.
  - Filters for craft type and difficulty are present and functional, dynamically updating the displayed patterns.
- **Edge Cases:**
  - No patterns matching the selected filter criteria.

### 2.2. Pattern Download (FR-03)
- **Purpose:** Allow registered users to download pattern PDFs. Tracks download history per user.
- **User Stories:**
  - As a registered user, I want to download a pattern PDF after logging in.
  - As a registered user, I want to see my download history in my profile.
- **Acceptance Criteria:**
  - Clicking "Download" on a pattern immediately initiates the PDF download.
  - The download event is logged to the user's download history.
  - Users can re-download any pattern anytime from their profile.
- **Edge Cases:**
  - User not logged in -> Prompted to login first.
  - Pattern PDF file missing from storage.

## 3. Product Showcase (Catalog)

This module displays physical products as a browsable catalog. No purchase flow — transactions are handled externally.

### 3.1. Product Browsing & Details (FR-05)
- **Purpose:** Showcase physical products and provide detailed information to potential buyers.
- **User Stories:**
  - As a guest, I want to browse available physical products to see what's offered.
  - As a guest, I want to view detailed information about a product, including images and description.
  - As a guest, I want to know how to purchase the product (via external link or contact).
- **Acceptance Criteria:**
  - Products are displayed with high-quality images, titles, and descriptions.
  - Each product has a dedicated detail page with comprehensive information.
  - Each product displays an external link or "Contact to Purchase" call-to-action.
- **Edge Cases:**
  - Product images failing to load.

## 4. Wishlist

This module allows registered users to save shop products for future reference.

### 4.1. Wishlist (FR-04)
- **Purpose:** Enable users to bookmark products they're interested in.
- **User Stories:**
  - As a registered user, I want to save a product to my wishlist so I can find it later.
  - As a registered user, I want to view all my saved products in one place.
  - As a registered user, I want to remove items from my wishlist.
- **Acceptance Criteria:**
  - A "Save to Wishlist" button is available on each product detail page.
  - Saved items appear in the user's profile under a "Wishlist" section.
  - Users can remove items from their wishlist with one click.
- **Edge Cases:**
  - Attempting to save an already-saved product (prevent duplicate).

## 5. Offline Coaching Request

This module provides a simple lead generation form for users interested in one-on-one offline coaching.

### 5.1. Coaching Request Form (FR-06)
- **Purpose:** Facilitate inquiries for personalized offline coaching sessions.
- **User Stories:**
  - As a guest, I want to submit a request for one-on-one offline coaching.
  - As a guest, I want to provide my contact details and a message about my coaching needs.
- **Acceptance Criteria:**
  - A dedicated page features a simple form with fields for Name, Email, and Message.
  - Upon submission, the form data is sent as an email notification to the admin.
  - A confirmation message is displayed to the user after successful submission.
- **Edge Cases:**
  - Invalid email format.
  - Failure to send the email notification to the admin.
  - Form submission with empty required fields.

## 6. Content Pages

These pages provide static and dynamic informational content, showcasing the creator's work, sharing knowledge, and building brand identity.

### 6.1. Blog & Tutorials (FR-08)
- **Purpose:** Share free educational content, tips, and articles to engage the audience and improve SEO.
- **User Stories:**
  - As a guest, I want to read blog posts and tutorials to learn new techniques and gain insights.
  - As a guest, I want to easily navigate through different articles.
- **Acceptance Criteria:**
  - A dedicated blog section displays a list of articles.
  - Each article has its own page with title, content (text, images), and publication date.
  - Content is managed via Payload CMS.
- **Edge Cases:**
  - Blog post not found (404).
  - Images within blog posts failing to load.

### 6.2. Portfolio Showcase (FR-08)
- **Purpose:** Visually present the creator's finished works and design capabilities.
- **User Stories:**
  - As a guest, I want to view a gallery of the creator's finished projects to appreciate their craftsmanship.
- **Acceptance Criteria:**
  - A dedicated portfolio page displays a collection of project images.
  - Each project can have a title and a brief description.
  - Content is managed via Payload CMS.
- **Edge Cases:**
  - Portfolio images failing to load.

### 6.3. About Page (FR-08)
- **Purpose:** Introduce the creator, their philosophy, and their creative journey, fostering a personal connection.
- **User Stories:**
  - As a guest, I want to learn more about the creator, their background, and their creative philosophy.
- **Acceptance Criteria:**
  - A dedicated "About" page contains text and images detailing the creator's story.
  - Content is managed via Payload CMS.

## 7. User Profile

A personal page for registered users to view their downloaded patterns, saved wishlist items, and manage account settings.

### 7.1. My Downloads
- **Purpose:** Provide a central location for users to access all patterns they've downloaded.
- **User Stories:**
  - As a registered user, I want to see a list of all patterns I have downloaded.
  - As a registered user, I want to re-download any pattern from my profile.
- **Acceptance Criteria:**
  - The profile displays a list of all patterns downloaded by the logged-in user.
  - Each pattern entry includes a download link for the PDF file.

### 7.2. My Wishlist
- **Purpose:** Allow users to view all products they've saved for later.
- **User Stories:**
  - As a registered user, I want to see all products I've saved to my wishlist.
  - As a registered user, I want to remove items from my wishlist.
- **Acceptance Criteria:**
  - The profile displays a list of all wishlist items saved by the user.
  - Each item shows product details and a "Remove" button.

### 7.3. Account Settings
- **Purpose:** Allow users to manage their account details.
- **Acceptance Criteria:**
  - Users can update their name, email, and password.

## 8. Admin Content Management (via Payload CMS)

The creator manages all website content through Payload CMS admin panel. This section outlines the capabilities provided by the CMS for the Admin (Creator).

### 8.1. General Content CRUD (FR-09)
- **Purpose:** Enable the Admin to create, read, update, and delete all types of content on the website.
- **User Stories:**
  - As an Admin, I want to manage all website content from a single interface.
- **Acceptance Criteria:**
  - Payload CMS provides dedicated collections for Patterns, Blog Posts, Portfolio Items, Products, and Pages.
  - Admin can perform full CRUD operations on all these collections.
- **Edge Cases:**
  - Data validation errors during content creation/update.
  - Accidental deletion of content (recycle bin in Payload).

### 8.2. Pattern Management (FR-10)
- **Purpose:** Allow the Admin to upload pattern files and define their attributes.
- **User Stories:**
  - As an Admin, I want to upload new PDF pattern files.
  - As an Admin, I want to define attributes like craft type and difficulty for each pattern.
- **Acceptance Criteria:**
  - Admin can upload PDF files associated with pattern entries.
  - Admin can select craft type and difficulty level from predefined options.
- **Edge Cases:**
  - Uploading non-PDF files.

### 8.3. Product Management (FR-11)
- **Purpose:** Allow the Admin to manage shop product catalog.
- **User Stories:**
  - As an Admin, I want to add new products to the shop catalog.
  - As an Admin, I want to set external purchase links for each product.
- **Acceptance Criteria:**
  - Admin can create product entries with images, descriptions, and external links.
  - Admin can edit or remove products from the catalog.

### 8.4. Coaching Request Management (FR-12)
- **Purpose:** Allow the Admin to view and manage coaching requests.
- **User Stories:**
  - As an Admin, I want to view all coaching requests submitted by users.
  - As an Admin, I want to update the status of a coaching request.
- **Acceptance Criteria:**
  - A dedicated section in Payload CMS displays all coaching requests.
  - Admin can update request status (New, Contacted, Archived).
