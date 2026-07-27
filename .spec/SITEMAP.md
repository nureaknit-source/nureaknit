# SITEMAP.md — Nurea Knit

## Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 16 (App Router)                │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │   (frontend) Group   │  │    (payload) Group        │ │
│  │  - Public pages      │  │  - /admin (CMS Admin UI)  │ │
│  │  - Auth pages        │  │  - /api/* (REST API)      │ │
│  │  - Profile pages     │  │  - /api/graphql           │ │
│  └────────┬─────────────┘  └───────────┬──────────────┘ │
│           │                            │                │
│  ┌────────▼────────────────────────────▼──────────────┐ │
│  │              Payload CMS (embedded)                 │ │
│  │  Collections → PostgreSQL (Supabase)                │ │
│  │  Media → S3 (Supabase Storage)                      │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                 │
│  ┌─────────────────────▼───────────────────────────────┐ │
│  │  Supabase                                           │ │
│  │  ├─ PostgreSQL (database Payload)                   │ │
│  │  ├─ Auth (frontend user login/register)             │ │
│  │  └─ S3 Storage (gambar & PDF)                       │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Resend (email transaksional)                       │ │
│  │  ├─ Notifikasi contact/coaching ke admin            │ │
│  │  └─ Welcome email ke user baru                      │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Routes

### Public (no auth required)

| Route | File | Type | Konten |
|-------|------|------|--------|
| `/` | `(frontend)/page.tsx` | RSC | Featured patterns, blog posts, products dari Payload |
| `/about` | `(frontend)/about/page.tsx` | RSC | Profil kreator |
| `/blog` | `(frontend)/blog/page.tsx` | RSC | List blog posts dari Payload `blog-posts` |
| `/blog/[slug]` | `(frontend)/blog/[slug]/page.tsx` | RSC (dynamic) | Detail blog post by slug |
| `/contact` | `(frontend)/contact/page.tsx` | **Client** | Form → Server Action → Payload `contact-messages` → email admin via Resend |
| `/faq` | `(frontend)/faq/page.tsx` | RSC | FAQ dari Payload `faq` |
| `/patterns` | `(frontend)/patterns/page.tsx` | RSC | List pola + filter kategori dari `patterns` + `pattern-categories` |
| `/patterns/[slug]` | `(frontend)/patterns/[slug]/page.tsx` | RSC (dynamic) | Detail pola + PDF download |
| `/products` | `(frontend)/products/page.tsx` | RSC | List produk dari `products` |
| `/products/[slug]` | `(frontend)/products/[slug]/page.tsx` | RSC (dynamic) | Detail produk (belum ada checkout — redirect ke contact) |

### Auth (guest only — redirect jika sudah login)

| Route | File | Type | Mekanisme |
|-------|------|------|-----------|
| `/login` | `(frontend)/(auth)/login/page.tsx` | **Client** | Supabase `signInWithPassword` |
| `/register` | `(frontend)/(auth)/register/page.tsx` | **Client** | Supabase `signUp` → `sendWelcomeEmailAction` via Resend |

### Profile (auth required — redirect ke /login jika belum login)

| Route | File | Type | Data Source |
|-------|------|------|-------------|
| `/profile/downloads` | `(frontend)/profile/downloads/page.tsx` | RSC | Payload + Supabase session (belum fully implemented) |
| `/profile/settings` | `(frontend)/profile/settings/page.tsx` | **Client** | Supabase Auth |
| `/profile/wishlist` | `(frontend)/profile/wishlist/page.tsx` | RSC | Payload `wishlist-items` filtered by email |

### SEO & Utility

| Route | File | Fungsi |
|-------|------|--------|
| `/sitemap.xml` | `sitemap.ts` | Dynamic — semua slug dari patterns, blog, products |
| `/robots.txt` | `robots.ts` | Blokir `/admin`, `/api`, `/auth` dari crawler |
| `/manifest.json` | `manifest.ts` | PWA manifest |
| 404 | `not-found.tsx` | Custom 404 |
| / | `error.tsx` (di frontend + payload) | Error boundary |

---

## Backend Routes

### Payload CMS REST API (auto-generated)

| Route | Methods | Deskripsi |
|-------|---------|-----------|
| `/api/{collection}` | GET, POST, PUT, PATCH, DELETE, OPTIONS | Full CRUD untuk 13 collections |
| `/api/graphql` | POST | GraphQL endpoint |
| `/api/graphql-playground` | GET | GraphQL playground UI |

Koleksi yang diekspos:
- `patterns`, `blog-posts`, `portfolio`, `products`
- `pattern-categories`, `faq`, `pages`
- `contact-messages`, `coaching-requests`
- `users`, `media`, `navigation`, `wishlist-items`

### Custom API

| Route | Method | Handler | Fungsi |
|-------|--------|---------|--------|
| `/api/health` | GET | `src/app/api/health/route.ts` | Return `{ status, timestamp, uptime }` |
| `/auth/callback` | GET | `src/app/auth/callback/route.ts` | Exchange OAuth code → Supabase session → redirect `/` |

### Server Actions (`"use server"` — bukan HTTP route)

| File | Functions | Trigger | Efek |
|------|-----------|---------|------|
| `src/actions/contact.ts` | `submitContactAction` | Form contact | Validasi → create `contact-messages` → email admin via Resend |
| `src/actions/coaching.ts` | `submitCoachingAction` | Form coaching | Validasi → create `coaching-requests` → email admin via Resend |
| `src/actions/wishlist.ts` | `addWishlistAction`, `removeWishlistAction`, `getWishlistAction` | Wishlist button | CRUD `wishlist-items` di Payload |
| `src/actions/auth.ts` | `logoutAction` | Logout button | Supabase `signOut` → redirect |
| `src/actions/email.ts` | `sendWelcomeEmailAction` | Register sukses | Welcome email via Resend |

---

## Middleware

| File | Fungsi |
|------|--------|
| `src/proxy.ts` | Rate limiter in-memory — 10 POST/IP/menit, return 429 jika exceeded |

**Catatan:** Bukan Next.js middleware standard. Tidak ada middleware untuk auth guard — proteksi halaman profile dilakukan manual via `redirect()` di masing-masing RSC.

---

## Database Collections (Payload CMS)

### Content

```
Collection: patterns
├── title, slug (unique), description, content (richText)
├── difficulty: beginner | easy | intermediate | advanced
├── yarnWeight: lace | fingering | sport | dk | worsted | aran | bulky | super-bulky
├── image ──→ media (upload)
├── pdf ──→ media (PDF only)
├── categories ──M:N── pattern-categories
├── featured (checkbox), publishedAt (date)

Collection: blog-posts
├── title, slug (unique), excerpt, content (richText)
├── coverImage ──→ media
├── featured (checkbox), publishedAt (date)

Collection: portfolio
├── title, slug (unique), description
├── images[] ──→ media (array of uploads)
├── category: knitting | crochet | other
├── year (number), featured (checkbox)

Collection: products
├── title, slug (unique), description (richText), price (number)
├── images[] ──→ media
├── type: digital | physical
├── featured (checkbox)

Collection: pattern-categories
├── name, slug (unique), description

Collection: faq
├── question, answer (richText), order (number)

Collection: pages
├── title, slug (unique), content (richText), publishedAt (date)
```

### Inquiries (write-only via server action)

```
Collection: contact-messages
├── name, email, subject, message
├── status: unread | read | replied

Collection: coaching-requests
├── name, email, message
├── status: incoming | contacted | completed
```

### System

```
Collection: users
├── name, role: admin | editor
├── Payload auth (email + password)
└── Hanya untuk admin/editor — BUKAN untuk frontend user

Collection: media
├── alt (text)
├── image sizes: thumbnail 400x300, card 768x576, hero 1920x1080
├── mime: images + PDF

Collection: navigation
├── label, url, order, parent (self-relationship)

Collection: wishlist-items
├── email (text — dari Supabase user)
├── product ──→ products
```

---

## Data Flow Diagram

### A. RSC → Payload (read)
```
Browser                              Server
  │                                    │
  │  GET /patterns                     │
  │───────────────────────────────────→│
  │                                    │
  │                                    ├─ getPayload({ config })
  │                                    ├─ payload.find("patterns")
  │                                    ├─ payload.find("pattern-categories")
  │                                    │
  │  ←── HTML (server-rendered) ──────│
```

### B. Client Form → Server Action → Payload + Resend (write)
```
Browser                              Server
  │                                    │
  │  Submit contact form               │
  │───────────────────────────────────→│
  │  useActionState                    │
  │  (formData)                        │
  │                                    ├─ validasi (zod-like)
  │                                    ├─ payload.create("contact-messages")
  │                                    ├─ resend.emails.send()
  │                                    ├─ revalidatePath("/contact")
  │  ←── { success: true } ───────────│
```

### C. Client → Supabase Auth
```
Browser                              Supabase
  │                                    │
  │  login(email, password)            │
  │───────────────────────────────────→│
  │  createBrowserClient()             │
  │  signInWithPassword()              │
  │                                    │
  │  ←── session (cookies) ───────────│
  │                                    │
  │  router.push("/")                  │
  │  router.refresh()                  │
```

### D. Client → Server Action → Supabase + Payload (wishlist hybrid)
```
Browser                              Server
  │                                    │
  │  Click wishlist button             │
  │───────────────────────────────────→│
  │  addWishlistAction(productId)      │
  │  ("use server")                    │
  │                                    │
  │                                    ├─ cookies() → supabase.getUser()
  │                                    │     (dapet email)
  │                                    ├─ payload.find("wishlist-items",
  │                                    │     { email, product })
  │                                    ├─ payload.create("wishlist-items",
  │                                    │     { email, product })
  │                                    ├─ revalidatePath()
  │  ←── { success: true } ───────────│
```

---

## Dependency Graph

```
                 ┌─────────────┐
                 │  Supabase   │
                 │  Auth       │◄──── login/register pages
                 └──────┬──────┘
                        │ getUser()
                        ▼
  ┌──────────────────────────────────┐
  │        Server Actions            │
  │  ┌──────────┐ ┌───────────────┐  │
  │  │ wishlist │ │ contact       │  │
  │  │ auth     │ │ coaching      │  │
  │  └─────┬────┘ │ email (welcome)│  │
  │        │      └───────┬───────┘  │
  └────────┼──────────────┼──────────┘
           │              │
           ▼              ▼
  ┌──────────────┐ ┌──────────────┐
  │   Payload    │ │   Resend     │
  │   CMS        │ │   (email)    │
  │   (CRUD)     │ └──────────────┘
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  PostgreSQL  │
  │  (Supabase)  │
  └──────────────┘
```

---

## Layout Structure

```
RootLayout (src/app/layout.tsx)
├── PayloadProvider
│
├── (frontend)/layout.tsx
│   ├── Navbar (src/components/layout/navbar.tsx)
│   ├── {children} — halaman frontend
│   └── Footer (src/components/layout/footer.tsx)
│
├── (payload)/admin/[[...segments]]/page.tsx
│   └── Payload Admin UI (React SPA)
│
├── (payload)/api/[...slug]/route.ts
│   └── Payload REST API
│
├── not-found.tsx (custom 404)
├── error.tsx (error boundary root)
└── globals.css (Tailwind + custom)
```

---

## UI Component Tree

```
components/
├── layout/
│   ├── navbar.tsx         — Navbar responsif
│   └── footer.tsx         — Footer
│
├── shared/
│   ├── animate-in-view.tsx — Animasi scroll
│   ├── breadcrumbs.tsx    — Breadcrumb navigasi
│   ├── empty-state.tsx    — Komponen "tidak ada data"
│   ├── faq-accordion.tsx  — Akordion FAQ
│   └── rich-text.tsx      — Render Lexical rich text
│
├── ui/
│   ├── badge.tsx          — Label badge
│   ├── button.tsx         — Tombol reusable
│   ├── card.tsx           — Card container
│   ├── container.tsx      — Layout container
│   ├── input.tsx          — Input field
│   ├── lightbox.tsx       — Lightbox gambar
│   ├── section.tsx        — Section wrapper
│   ├── skeleton.tsx       — Loading skeleton
│   ├── toast.tsx          — Notifikasi toast
│   └── typography.tsx     — Tipografi konsisten
│
features/
├── portfolio/
│   └── portfolio-grid.tsx — Grid portfolio (belum terpakai)
└── products/
    └── wishlist-button.tsx — Tombol wishlist (client component)
```
