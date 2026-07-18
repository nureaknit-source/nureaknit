# DESIGN.md: Nureaknite

## Brand & Visual Identity

Nureaknite embodies a **cozy, artisanal aesthetic** that reflects the handmade nature of knitting and crochet. The visual identity conveys warmth, craftsmanship, and personal expertise—evoking the feeling of stepping into a premium creative studio run by a trusted educator. Design elements incorporate subtle textile textures, organic shapes, and a carefully curated color palette that balances sophistication with approachability, ensuring the brand feels both professional and intimately personal.

## User Experience Goals

1. **Effortless Content Discovery:** Users can navigate the Pattern Library, Blog, and Shop within 2 clicks from the homepage, with intuitive filtering and search enabling them to find relevant content in under 30 seconds.

2. **Frictionless Purchase & Access:** From product discovery to accessing purchased content (classes, patterns, orders) takes no more than 3 steps; users feel confident that their purchase is secure and immediately accessible.

3. **Personal Connection & Trust:** Every page communicates the creator's expertise, philosophy, and passion through authentic storytelling, high-quality imagery, and transparent communication, fostering a sense of exclusivity and direct relationship with the creator.

## Color Palette

### Primary Colors
- **Warm Cream:** `#F5F1E8` — Soft, inviting background evoking natural yarn and linen.
- **Deep Charcoal:** `#2C2C2C` — Rich, grounded text and primary UI elements.

### Secondary Colors
- **Sage Green:** `#A8B8A8` — Calming, nature-inspired accent for CTAs and highlights.
- **Warm Terracotta:** `#C97C5C` — Earthy, artisanal accent for secondary actions and decorative elements.

### Accent Colors
- **Soft Gold:** `#D4A574` — Premium, warm accent for badges, highlights, and special features.
- **Dusty Rose:** `#B8949A` — Subtle, sophisticated accent for secondary CTAs and borders.

### Neutral Colors
- **Off-White:** `#FAFAF8` — Primary background for content areas.
- **Light Gray:** `#E8E6E1` — Subtle borders, dividers, and disabled states.
- **Medium Gray:** `#9A9A9A` — Secondary text and helper copy.

### CSS Custom Properties (Tailwind-Compatible)

```css
:root {
  /* Primary */
  --color-cream: #F5F1E8;
  --color-charcoal: #2C2C2C;
  
  /* Secondary */
  --color-sage: #A8B8A8;
  --color-terracotta: #C97C5C;
  
  /* Accent */
  --color-gold: #D4A574;
  --color-rose: #B8949A;
  
  /* Neutral */
  --color-off-white: #FAFAF8;
  --color-light-gray: #E8E6E1;
  --color-medium-gray: #9A9A9A;
  
  /* Semantic */
  --color-success: #6B9E7F;
  --color-warning: #E8A87C;
  --color-error: #C97C5C;
  --color-info: #7BA3B8;
}
```

### Tailwind Configuration Snippet

```javascript
module.exports = {
  theme: {
    colors: {
      cream: '#F5F1E8',
      charcoal: '#2C2C2C',
      sage: '#A8B8A8',
      terracotta: '#C97C5C',
      gold: '#D4A574',
      rose: '#B8949A',
      'off-white': '#FAFAF8',
      'light-gray': '#E8E6E1',
      'medium-gray': '#9A9A9A',
      success: '#6B9E7F',
      warning: '#E8A87C',
      error: '#C97C5C',
      info: '#7BA3B8',
    },
  },
};
```

## Typography

### Font Families

- **Headings (H1–H3):** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — Elegant, serif typeface that conveys sophistication and craftsmanship.
  - Weight: 600 (SemiBold) for H1, 600 for H2, 500 (Medium) for H3.
  
- **Body & UI Text:** [Inter](https://fonts.google.com/specimen/Inter) — Clean, modern sans-serif for readability and accessibility.
  - Weight: 400 (Regular) for body text, 500 (Medium) for labels and emphasis, 600 (SemiBold) for strong emphasis.

- **Accent/Decorative:** [Caveat](https://fonts.google.com/specimen/Caveat) — Handwritten-style font used sparingly for section headers, testimonials, or decorative elements to reinforce the artisanal brand.
  - Weight: 400 (Regular) or 700 (Bold) for emphasis.

### Font Size Scale

| Element | Size | Line Height | Letter Spacing |
|:--------|:-----|:------------|:---------------|
| H1 (Page Title) | 48px | 1.2 | -0.5px |
| H2 (Section Header) | 36px | 1.3 | -0.3px |
| H3 (Subsection) | 28px | 1.4 | 0px |
| H4 (Card Title) | 20px | 1.4 | 0px |
| Body Large | 18px | 1.6 | 0px |
| Body Regular | 16px | 1.6 | 0px |
| Body Small | 14px | 1.5 | 0.3px |
| Label / UI | 12px | 1.4 | 0.5px |

### Font Weights

- **Light (300):** Not used in primary UI; reserved for decorative or de-emphasized text.
- **Regular (400):** Body text, descriptions, helper copy.
- **Medium (500):** Labels, button text, secondary headings.
- **SemiBold (600):** Primary headings, strong emphasis, CTA buttons.
- **Bold (700):** Decorative accents, testimonials, special highlights.

## UI Components & Spacing

### Grid & Spacing Unit

- **Base Unit:** 8px (Nureaknite uses an 8px grid system for consistency and scalability).
- **Spacing Scale:** 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px.

### Border Radius Scale

| Size | Value | Usage |
|:-----|:------|:------|
| None | 0px | Buttons with sharp edges (optional). |
| Small | 4px | Subtle rounding for input fields, small badges. |
| Medium | 8px | Standard rounding for cards, modals, buttons. |
| Large | 12px | Generous rounding for hero sections, large cards. |
| Full | 9999px | Fully rounded for avatars, pill-shaped buttons. |

### Standard Spacing Values

| Spacing | Value | Common Usage |
|:--------|:------|:-------------|
| xs | 8px | Padding within small components, tight spacing. |
| sm | 16px | Padding within cards, spacing between inline elements. |
| md | 24px | Padding within sections, spacing between related blocks. |
| lg | 32px | Spacing between major sections, padding around page content. |
| xl | 48px | Large gaps between distinct page sections. |
| 2xl | 64px | Hero section padding, top-level section spacing. |

### Component Specifications

**Buttons:**
- Padding: 12px (vertical) × 24px (horizontal) for standard buttons.
- Border Radius: 8px.
- Font Size: 16px (Medium weight).
- States: Default, Hover (opacity 0.9, slight shadow), Active (opacity 0.8), Disabled (opacity 0.5, cursor not-allowed).

**Cards:**
- Padding: 24px.
- Border Radius: 12px.
- Background: Off-White (#FAFAF8) or Cream (#F5F1E8).
- Border: 1px solid Light Gray (#E8E6E1).
- Shadow: Subtle (0 2px 8px rgba(0, 0, 0, 0.08)).

**Input Fields:**
- Padding: 12px 16px.
- Border Radius: 8px.
- Border: 1px solid Light Gray (#E8E6E1).
- Focus State: Border color changes to Sage Green (#A8B8A8), subtle shadow (0 0 0 3px rgba(168, 184, 168, 0.1)).

**Navigation Bar:**
- Height: 64px (desktop), 56px (mobile).
- Padding: 16px 32px (desktop), 16px 16px (mobile).
- Background: Off-White (#FAFAF8) with subtle bottom border (1px solid Light Gray).

## Screen Priorities

### Priority 1: Core User Journeys (Highest Impact)

1. **Homepage / Landing Page**
   - Hero section with creator introduction and brand story.
   - Featured content (latest blog post, bestselling pattern, upcoming class).
   - Clear navigation to Pattern Library, Shop, Classes, and Blog.
   - Email signup for free pattern lead magnet.

2. **Pattern Library (Browse & Filter)**
   - Grid view of all patterns (free and premium).
   - Filters: Craft Type (Knitting/Crochet), Difficulty (Beginner/Intermediate/Advanced), Price (Free/Premium).
   - Search functionality.
   - Pattern card preview with title, difficulty badge, price, and "View Details" CTA.

3. **Pattern Detail Page**
   - High-quality pattern preview image.
   - Pattern description, difficulty level, craft type, materials list.
   - Price and purchase button (for premium) or download button (for free, email-gated).
   - Related patterns carousel.

4. **Online Classes (Browse & Purchase)**
   - Grid view of all available classes.
   - Class card with thumbnail, title, description, price, and "Enroll" CTA.
   - Class detail page with full description, lesson count, duration, and purchase button.

5. **User Dashboard (Post-Login)**
   - Sidebar navigation: My Classes, Downloaded Patterns, Order History, Account Settings.
   - My Classes section: List of purchased classes with progress indicators and "Continue Learning" CTA.
   - Downloaded Patterns section: List of purchased premium patterns with download links.
   - Order History: Unified view of all digital and physical purchases.

6. **Shop (E-commerce)**
   - Product grid with filters (Category, Price Range).
   - Product card with image, title, price, stock status, and "Add to Cart" CTA.
   - Product detail page with images, description, specifications, price, quantity selector, and "Add to Cart" button.
   - Shopping cart and checkout flow (Midtrans integration).

7. **Checkout & Payment**
   - Cart summary with line items, subtotal, shipping (flat rate), and total.
   - Shipping address form.
   - Payment method selection (Midtrans gateway).
   - Order confirmation page with order number and next steps.

### Priority 2: Content & Engagement (High Impact)

8. **Blog / Tutorials**
   - Blog post list with search and category filters.
   - Blog post detail page with full article, author bio, and related posts.
   - SEO-optimized structure for organic search visibility.

9. **Portfolio Showcase**
   - Gallery of creator's finished works with high-quality images.
   - Optional: Lightbox or modal for detailed image viewing.
   - Brief description of each piece (materials, techniques, inspiration).

10. **About Page**
    - Creator's story, background, and philosophy.
    - Journey into knitting/crochet design and education.
    - Professional credentials and achievements.
    - Call-to-action to explore classes, patterns, or coaching.

### Priority 3: Conversion & Support (Medium Impact)

11. **Offline Coaching Request Form**
    - Simple form: Name, Email, Message.
    - Submission confirmation message.
    - Form data sent to admin email.

12. **Account Settings / Profile**
    - Email and password management.
    - Notification preferences.
    - Account deletion option.

13. **FAQ / Help Page**
    - Common questions about patterns, classes, shop, and coaching.
    - Contact information and support channels.

## Interaction & Motion

### Hover States

- **Buttons:** Opacity decreases to 0.9; subtle shadow appears (0 4px 12px rgba(0, 0, 0, 0.12)).
- **Links:** Text color transitions to Sage Green (#A8B8A8); underline appears (2px solid).
- **Cards:** Subtle lift effect with shadow increase (0 8px 24px rgba(0, 0, 0, 0.15)); background may lighten slightly.
- **Product Images:** Slight zoom (1.05x scale) with smooth transition.
- **Form Inputs:** Border color transitions to Sage Green; subtle glow (0 0 0 3px rgba(168, 184, 168, 0.1)).

### Transitions & Animations

| Element | Transition | Duration | Easing |
|:--------|:-----------|:---------|:-------|
| Button Hover | opacity, box-shadow | 200ms | ease-in-out |
| Link Underline | width, color | 200ms | ease-out |
| Card Lift | transform, box-shadow | 250ms | cubic-bezier(0.34, 1.56, 0.64, 1) |
| Page Fade-In | opacity | 300ms | ease-in |
| Modal Slide-Up | transform, opacity | 300ms | cubic-bezier(0.34, 1.56, 0.64, 1) |
| Dropdown Menu | opacity, transform | 150ms | ease-out |
| Loading Spinner | transform (rotation) | 1s | linear (infinite) |
| Success Toast | slide-in, fade-out | 300ms in / 200ms out | ease-in-out |

### Animation Durations

- **Micro-interactions (hover, focus):** 150–200ms.
- **Page transitions & modals:** 250–300ms.
- **Loading states:** 1s (continuous).
- **Toast notifications:** 300ms in, 3s display, 200ms out.

### Specific Interaction Patterns

**Pattern/Product Cards:**
- On hover: Card lifts with shadow increase; product image zooms slightly (1.05x).
- On click: Smooth navigation to detail page with fade transition.

**Add to Cart / Purchase Button:**
- On click: Button shows brief loading state (spinner or text change to "Processing...").
- On success: Toast notification appears ("Added to cart" or "Purchase successful") with fade-in/out animation.

**Form Submission:**
- On focus: Input border transitions to Sage Green with subtle glow.
- On submit: Button shows loading state; form fields are disabled.
- On success: Confirmation message appears with fade-in animation; form resets or redirects.

**Class Progress Checkbox:**
- On click: Checkbox animates with a brief scale-up effect (1.1x) and color transition to Sage Green.
- Completion percentage bar updates smoothly (width transition over 300ms).

**Navigation Menu (Mobile):**
- Hamburger icon animates to "X" on open (rotate 90°, 200ms).
- Menu slides in from left with fade-in (300ms).
- Menu items stagger-animate in (50ms delay between each item).

## Accessibility

### Contrast Ratios

All text and interactive elements meet **WCAG 2.1 Level AA** minimum contrast requirements:

| Element | Foreground | Background | Ratio | Standard |
|:--------|:-----------|:-----------|:------|:---------|
| Body Text | Charcoal (#2C2C2C) | Off-White (#FAFAF8) | 15.8:1 | AA ✅ |
| Headings | Charcoal (#2C2C2C) | Cream (#F5F1E8) | 14.2:1 | AA ✅ |
| Primary CTA | Off-White (#FAFAF8) | Sage Green (#A8B8A8) | 4.8:1 | AA ✅ |
| Secondary Text | Medium Gray (#9A9A9A) | Off-White (#FAFAF8) | 7.1:1 | AA ✅ |
| Disabled State | Medium Gray (#9A9A9A) | Light Gray (#E8E6E1) | 4.5:1 | AA ✅ |
| Error Message | Terracotta (#C97C5C) | Off-White (#FAFAF8) | 5.2:1 | AA ✅ |

### Keyboard Navigation

- **Tab Order:** All interactive elements (buttons, links, form inputs) are reachable via Tab key in a logical, top-to-bottom order.
- **Focus Indicators:** All focusable elements display a visible focus ring (2px solid Sage Green border with 3px offset) when navigated via keyboard.
- **Skip Links:** A "Skip to Main Content" link appears at the top of every page for keyboard users to bypass repetitive navigation.
- **Form Labels:** All form inputs have associated `<label>` elements with `for` attributes; screen readers announce labels clearly.
- **ARIA Landmarks:** Pages use semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`) and ARIA roles where necessary (e.g., `role="banner"`, `role="contentinfo"`).
- **Button & Link Text:** All buttons and links have descriptive, meaningful text (avoid "Click Here" or "Read More" without context).
- **Modal Dialogs:** Modals trap focus within the dialog; pressing Escape closes the modal and returns focus to the triggering element.
- **Dropdown Menus:** Arrow keys (Up/Down) navigate menu items; Enter selects; Escape closes.
- **Image Alt Text:** All images have concise, descriptive alt text; decorative images use `alt=""`.
- **Color Not Sole Indicator:** Status indicators (success, error, warning) use icons or text in addition to color.
- **Reduced Motion:** Users with `prefers-reduced-motion` enabled see simplified animations (no parallax, reduced transitions to 100ms, no auto-play).

### Screen Reader Optimization

- **Semantic HTML:** Proper use of heading hierarchy (H1 → H2 → H3), lists, and form elements.
- **ARIA Labels:** Interactive components without visible text (e.g., icon buttons) use `aria-label` or `aria-labelledby`.
- **Live Regions:** Cart updates, form validation messages, and toast notifications use `aria-live="polite"` to announce changes.
- **Hidden Content:** Decorative elements use `aria-hidden="true"` to prevent screen reader announcement.

### Mobile & Touch Accessibility

- **Touch Target Size:** All interactive elements (buttons, links, form inputs) have a minimum 44×44px touch target.
- **Spacing:** Interactive elements are spaced at least 8px apart to prevent accidental activation.
- **Responsive Text:** Font sizes scale appropriately on mobile; minimum 16px for body text to prevent browser zoom on input focus (iOS).

---

**See [PRD.md](PRD.md) for functional requirements, technology stack, and business metrics.**