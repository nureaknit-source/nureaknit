# USERFLOW.md: Nureaknite

## User Authentication

This flow describes the standard process for users to register for a new account or log in to an existing one, which is a prerequisite for downloading patterns and using wishlist features.

| No | Actor | Action/Step | System Response | Alternative/Alternative Path/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest | Clicks "Login" or "Register" from the navigation bar. | Displays a modal or dedicated page with login and registration forms. | N/A |
| 2 | Guest | Fills out the registration form (email, password, confirm password) and clicks "Register". | System validates input. If successful, creates a new user record, logs the user in, and redirects to the homepage or previous page. | Invalid input -> Displays validation errors. Email already registered -> Prompts user to log in. |
| 3 | Guest | Fills out the login form (email, password) and clicks "Login". | System authenticates user credentials via NextAuth.js. If successful, logs the user in and redirects to the homepage or previous page. | Invalid credentials -> Displays "Incorrect email or password" error. |
| 4 | Registered User | Clicks "Logout" from the user menu. | System clears the user's session and redirects to the homepage. | N/A |

**Trigger:** User wishes to download patterns or access profile features.
**Pre-conditions:** User is a Guest.
**Post-conditions:** User is authenticated and logged in.

---

## Download Pattern

This flow details how a registered user discovers and downloads a free pattern.

| No | Actor | Action/Step | System Response | Alternative/Alternative Path/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Browses the "Pattern Library" and selects a pattern. | Displays the pattern detail page with description, images, and a "Download" button. | N/A |
| 2 | Guest | Clicks "Download". | Prompts the user to Log In or Register. | Registered User -> Proceeds directly to Step 4. |
| 3 | Guest | Completes the User Authentication flow (Login or Register). | Authenticates the user and redirects them back to the pattern page. | Authentication failure -> Displays error. |
| 4 | Registered User | Clicks "Download". | System logs the download in the user's history and returns a signed PDF URL from Supabase Storage. User's browser downloads the PDF. | Download error -> Displays error message. |
| 5 | Registered User | (Optional) Navigates to their "Profile" -> "My Downloads". | Displays the list of all downloaded patterns with re-download links. | N/A |

**Trigger:** User wants to download a pattern PDF.
**Pre-conditions:** User has browsed the pattern library.
**Post-conditions:** User has downloaded the PDF, and the download is recorded in their history.

---

## Save to Wishlist

This flow describes how a registered user saves a shop product to their wishlist.

| No | Actor | Action/Step | System Response | Alternative/Alternative Path/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Browses the "Shop" section and selects a product. | Displays the product detail page with images, description, and a "Save to Wishlist" button. | N/A |
| 2 | Guest | Clicks "Save to Wishlist". | Prompts the user to Log In or Register. | Registered User -> Proceeds directly to Step 4. |
| 3 | Guest | Completes the User Authentication flow (Login or Register). | Authenticates the user and redirects them back to the product page. | Authentication failure -> Displays error. |
| 4 | Registered User | Clicks "Save to Wishlist". | System adds the product to the user's wishlist. Button changes to "Remove from Wishlist". | Product already in wishlist -> Prevent duplicate. |
| 5 | Registered User | Clicks "Remove from Wishlist". | System removes the product from the wishlist. Button changes back to "Save to Wishlist". | N/A |
| 6 | Registered User | (Optional) Navigates to "Profile" -> "My Wishlist". | Displays all saved products with option to remove. | N/A |

**Trigger:** User finds a product they want to remember for later.
**Pre-conditions:** User is browsing the product showcase.
**Post-conditions:** Product is saved to user's wishlist or removed from it.

---

## Request One-on-One Offline Coaching

This flow describes how a user can submit a request for personalized offline coaching.

| No | Actor | Action/Step | System Response | Alternative/Alternative Path/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Navigates to the "One-on-One Offline Coaching" page. | Displays information about the coaching service and a contact form with fields for Name, Email, and Message. | N/A |
| 2 | Guest/Registered User | Fills out the required form fields and clicks "Submit Request". | System validates form data. If valid, stores the request in Strapi and sends an email to the Admin. Displays a success message. | Invalid form data -> Displays validation errors. Email sending failure -> Displays error. |
| 3 | Admin | Receives an email notification with the user's coaching request details. | N/A (Admin interacts with an external email client). | N/A |

**Trigger:** User is interested in personalized, one-on-one offline coaching.
**Pre-conditions:** User is on the dedicated coaching page.
**Post-conditions:** The Admin receives a lead generation email with the user's coaching inquiry.

---

## Browse Product Showcase

This flow outlines how users browse the physical product catalog (no purchase).

| No | Actor | Action/Step | System Response | Alternative/Alternative Path/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Navigates to the "Shop" section. | Displays a grid of all available products with images and names. | N/A |
| 2 | Guest/Registered User | Clicks on a product. | Displays the product detail page with high-resolution images, description, and an external link (e.g., "Buy on Shopee" or "Contact for Price"). | N/A |
| 3 | Guest/Registered User | Clicks the external link. | Opens the external marketplace/contact page in a new tab. | N/A |

**Trigger:** User wants to browse physical products offered by the creator.
**Pre-conditions:** User is on the website.
**Post-conditions:** User has viewed product details and been directed to an external purchase channel.
