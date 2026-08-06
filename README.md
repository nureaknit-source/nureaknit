# Nurea Knit

Knitting &amp; crochet patterns, tutorials, and inspiration — built with Next.js, Payload CMS, and Supabase.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Supabase project (auth + storage)
- Resend API key (for email notifications)

### Setup

1. Clone & install dependencies:
   ```bash
   npm install
   ```

2. Copy environment template and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. Apply database migrations via Payload CLI:
   ```bash
   npm run migrate
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) — the site auto-updates as you edit.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| CMS | Payload CMS (embedded) |
| Database | PostgreSQL |
| Auth | Supabase Auth (Google OAuth) |
| Storage | Supabase S3 / Payload Media |
| Email | Resend |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── (frontend)/   # Public-facing pages
│   ├── (payload)/    # Payload CMS admin & API
│   └── auth/callback # OAuth callback handler
├── collections/      # Payload CMS content collections
├── components/       # React components (ui, shared, layout)
├── features/         # Feature-scoped components
├── actions/          # Server Actions (form submissions, data mutations)
├── lib/              # Utilities (validation, email, payload helpers)
└── utils/supabase/   # Supabase client/server wrappers
```

## License

[LICENSE](LICENSE)
