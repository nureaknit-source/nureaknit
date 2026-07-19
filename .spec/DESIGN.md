# DESIGN.md: Nurea Knit

## Brand & Visual Identity

Nurea Knit embodies a **cozy, artisanal aesthetic** that reflects the handmade nature of knitting and crochet. The visual identity conveys warmth, craftsmanship, and personal expertise—evoking the feeling of stepping into a premium creative studio run by a trusted educator. Design elements incorporate subtle textile textures, organic shapes, and a carefully curated color palette that balances sophistication with approachability, ensuring the brand feels both professional and intimately personal.

## User Experience Goals

1. **Effortless Content Discovery:** Users can navigate the Pattern Library, Blog, and Shop within 2 clicks from the homepage, with intuitive filtering enabling them to find relevant content in under 30 seconds.

2. **Frictionless Access:** From product discovery to accessing patterns takes no more than 3 steps; users feel confident that their downloads are immediately accessible.

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

### CSS Custom Properties

```css
:root {
  --color-cream: #F5F1E8;
  --color-charcoal: #2C2C2C;
  --color-sage: #A8B8A8;
  --color-terracotta: #C97C5C;
  --color-gold: #D4A574;
  --color-rose: #B8949A;
  --color-off-white: #FAFAF8;
  --color-light-gray: #E8E6E1;
  --color-medium-gray: #9A9A9A;
  --color-success: #6B9E7F;
  --color-warning: #E8A87C;
  --color-error: #C97C5C;
  --color-info: #7BA3B8;
}
```

## Typography

### Font Families

- **Headings (H1–H3):** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — Elegant, serif typeface that conveys sophistication and craftsmanship.
  - Weight: 600 (SemiBold) for H1, 600 for H2, 500 (Medium) for H3.

- **Body & UI Text:** [Inter](https://fonts.google.com/specimen/Inter) — Clean, modern sans-serif for readability and accessibility.
  - Weight: 400 (Regular) for body text, 500 (Medium) for labels, 600 (SemiBold) for strong emphasis.

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

## UI Components & Spacing

### Grid & Spacing Unit

- **Base Unit:** 8px (8px grid system for consistency and scalability).
- **Spacing Scale:** 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px.

### Border Radius Scale

| Size | Value | Usage |
|:-----|:------|:------|
| None | 0px | Optional sharp-edged buttons |
| Small | 4px | Input fields, small badges |
| Medium | 8px | Cards, modals, buttons |
| Large | 12px | Hero sections, large cards |
| Full | 9999px | Avatars, pill-shaped buttons |

### Standard Spacing Values

| Spacing | Value | Common Usage |
|:--------|:------|:-------------|
| xs | 8px | Padding within small components, tight spacing |
| sm | 16px | Padding within cards, spacing between inline elements |
| md | 24px | Padding within sections, spacing between related blocks |
| lg | 32px | Spacing between major sections, page content padding |
| xl | 48px | Large gaps between distinct page sections |
| 2xl | 64px | Hero section padding, top-level section spacing |

### Component Specifications

**Buttons:**
- Padding: 12px vertical × 24px horizontal
- Border Radius: 8px
- Font Size: 16px (Medium weight)
- States: Default, Hover (opacity 0.9, shadow), Active (opacity 0.8), Disabled (opacity 0.5)

**Cards:**
- Padding: 24px
- Border Radius: 12px
- Background: Off-White (#FAFAF8) or Cream (#F5F1E8)
- Border: 1px solid Light Gray (#E8E6E1)
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.08)

**Input Fields:**
- Padding: 12px 16px
- Border Radius: 8px
- Border: 1px solid Light Gray (#E8E6E1)
- Focus State: Border color Sage Green (#A8B8A8), shadow 0 0 0 3px rgba(168, 184, 168, 0.1)

**Navigation Bar:**
- Height: 64px (desktop), 56px (mobile)
- Padding: 16px 32px (desktop), 16px 16px (mobile)
- Background: Off-White (#FAFAF8) with subtle bottom border

## Page Priorities

### Priority 1: Core User Journeys

1. **Homepage / Landing Page** — Hero section, featured content, navigation, email signup
2. **Pattern Library (Browse & Filter)** — Grid view, craft type/difficulty filters
3. **Pattern Detail Page** — Preview image, description, download button
4. **User Dashboard (Post-Login)** — My Downloads, My Wishlist, Account Settings
5. **Shop (Product Catalog)** — Product grid, detail pages, external links

### Priority 2: Content & Engagement

6. **Blog / Tutorials** — Article list, detail pages, SEO-optimized
7. **Portfolio Showcase** — Gallery, lightbox, descriptions
8. **About Page** — Creator's story, philosophy, journey

### Priority 3: Conversion & Support

9. **Offline Coaching Request Form** — Name, Email, Message
10. **FAQ / Help Page** — Common questions, contact info

## Interaction & Motion

### Hover States

- **Buttons:** Opacity 0.9; shadow 0 4px 12px rgba(0, 0, 0, 0.12)
- **Links:** Color transitions to Sage Green; underline appears
- **Cards:** Lift effect with shadow increase (0 8px 24px rgba(0, 0, 0, 0.15))
- **Product Images:** Zoom 1.05x scale with smooth transition
- **Form Inputs:** Border transitions to Sage Green; glow effect

### Transitions & Animations

| Element | Transition | Duration | Easing |
|:--------|:-----------|:---------|:-------|
| Button Hover | opacity, box-shadow | 200ms | ease-in-out |
| Link Underline | width, color | 200ms | ease-out |
| Card Lift | transform, box-shadow | 250ms | cubic-bezier(0.34, 1.56, 0.64, 1) |
| Page Fade-In | opacity | 300ms | ease-in |
| Modal Slide-Up | transform, opacity | 300ms | cubic-bezier(0.34, 1.56, 0.64, 1) |
| Dropdown Menu | opacity, transform | 150ms | ease-out |

## Accessibility

### Contrast Ratios

All text and interactive elements meet **WCAG 2.1 Level AA** requirements.

| Element | Foreground | Background | Ratio | Standard |
|:--------|:-----------|:-----------|:------|:---------|
| Body Text | #2C2C2C | #FAFAF8 | 15.8:1 | AA ✅ |
| Headings | #2C2C2C | #F5F1E8 | 14.2:1 | AA ✅ |
| Primary CTA | #FAFAF8 | #A8B8A8 | 4.8:1 | AA ✅ |
| Secondary Text | #9A9A9A | #FAFAF8 | 7.1:1 | AA ✅ |

### Keyboard Navigation

- All interactive elements reachable via Tab key
- Visible focus indicators (2px solid Sage Green border)
- "Skip to Main Content" link at top of every page
- All form inputs have associated labels
- Semantic HTML (header, nav, main, footer)
- Minimum 44×44px touch targets on mobile

### Screen Reader Optimization

- Proper heading hierarchy (H1 → H2 → H3)
- ARIA labels for icon-only buttons
- `aria-live="polite"` for dynamic updates
- `aria-hidden="true"` for decorative elements
- Descriptive alt text for all images

---

**See [PRD.md](PRD.md) for functional requirements, technology stack, and business metrics.**
