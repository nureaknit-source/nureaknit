# USERFLOW.md: Nurea Knit

## User Authentication

This flow describes the standard process for users to register for a new account or log in to an existing one via Supabase Auth.

| No | Actor | Action/Step | System Response | Alternative/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest | Clicks "Login" or "Register" from navigation | Displays login/register page | N/A |
| 2 | Guest | Fills registration form (email, password, confirm) and clicks "Register" | Supabase Auth creates user, logs in, redirects to homepage | Invalid input → validation errors. Email exists → error message |
| 3 | Guest | Fills login form (email, password) and clicks "Login" | Supabase Auth authenticates, sets session, redirects to homepage | Invalid credentials → "Email atau password salah" |
| 4 | Registered User | Clicks "Logout" from user menu | Supabase Auth clears session, redirects to homepage | N/A |

**Trigger:** User wishes to download patterns or access profile features.
**Pre-conditions:** User is a Guest.
**Post-conditions:** User is authenticated and logged in.

---

## Download Pattern

This flow details how a registered user discovers and downloads a free pattern.

| No | Actor | Action/Step | System Response | Alternative/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Browses "Pattern Library", selects a pattern | Displays pattern detail page with description, images, "Download" button | N/A |
| 2 | Guest | Clicks "Download" | Prompts user to Log In or Register | Registered User → proceeds to Step 4 |
| 3 | Guest | Completes auth flow | Authenticates and redirects back to pattern page | Auth failure → error message |
| 4 | Registered User | Clicks "Download" | System logs download via Payload API, returns signed URL from Supabase Storage, browser downloads PDF | Download error → error message |
| 5 | Registered User | Navigates to Profile → "My Downloads" | Displays all downloaded patterns with re-download links | N/A |

**Trigger:** User wants to download a pattern PDF.
**Pre-conditions:** User has browsed the pattern library.
**Post-conditions:** User has downloaded the PDF, download is recorded in their history.

---

## Save to Wishlist

This flow describes how a registered user saves a shop product to their wishlist.

| No | Actor | Action/Step | System Response | Alternative/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Browses "Shop", selects a product | Displays product detail page with "Save to Wishlist" button | N/A |
| 2 | Guest | Clicks "Save to Wishlist" | Prompts to Log In or Register | Registered User → proceeds to Step 4 |
| 3 | Guest | Completes auth flow | Authenticates and redirects back | Auth failure → error message |
| 4 | Registered User | Clicks "Save to Wishlist" | System adds product to wishlist via Payload API. Button changes to "Remove" | Already saved → prevent duplicate |
| 5 | Registered User | Clicks "Remove from Wishlist" | System removes product. Button changes back to "Save" | N/A |
| 6 | Registered User | Navigates to Profile → "My Wishlist" | Displays all saved products with remove option | N/A |

**Trigger:** User finds a product they want to remember for later.
**Pre-conditions:** User is browsing the product showcase.
**Post-conditions:** Product is saved to user's wishlist or removed from it.

---

## Request One-on-One Offline Coaching

This flow describes how a user submits a request for personalized offline coaching.

| No | Actor | Action/Step | System Response | Alternative/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Navigates to "Coaching" page | Displays info about coaching service and form (Name, Email, Message) | N/A |
| 2 | Guest/Registered User | Fills form, clicks "Submit Request" | System validates data. If valid, creates CoachingRequest via Payload API, sends email to admin via Resend, shows success message | Invalid data → validation errors. Email failure → shows error |
| 3 | Admin | Receives email notification with coaching request details | N/A (Admin responds via email) | N/A |

**Trigger:** User is interested in one-on-one offline coaching.
**Pre-conditions:** User is on the coaching page.
**Post-conditions:** Admin receives lead with the user's coaching inquiry.

---

## Browse Product Showcase

This flow outlines how users browse the physical product catalog.

| No | Actor | Action/Step | System Response | Alternative/Error Path |
|:---|:---|:---|:---|:---|
| 1 | Guest/Registered User | Navigates to "Shop" | Displays grid of all available products with images and names | N/A |
| 2 | Guest/Registered User | Clicks on a product | Displays detail page with hi-res images, description, external link | N/A |
| 3 | Guest/Registered User | Clicks external link | Opens external marketplace/contact page in new tab | N/A |

**Trigger:** User wants to browse physical products offered by the creator.
**Pre-conditions:** User is on the website.
**Post-conditions:** User has viewed product details and been directed to external purchase channel.
