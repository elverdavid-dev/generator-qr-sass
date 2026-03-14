# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Development server with Turbopack
bun build        # Production build
bun start        # Production server
bun lint         # Lint and auto-fix (Biome)
bun format       # Format code (Biome)
bun check        # Run all Biome checks and fixes
```

> No test suite is configured.

## Environment Variables

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Architecture

### Routing

Uses **Next.js App Router** with route groups:
- `(auth)/` — unauthenticated pages (login, register, reset-password, confirm-email)
- `(pages)/` — public-facing pages (home, QR landing pages)
- `dashboard/` — protected routes (qrs, favorites, analytics)
- `api/auth/` — Supabase auth callbacks
- `api/t/[slug]/` — QR tracking & redirect endpoint

### Feature-Sliced Design

Business logic is organized under `src/features/` by domain:
```
features/
  auth/
    components/   # Auth UI components
    hooks/        # e.g., use-login.tsx
    services/     # Server actions (login, register, google auth)
    schema/       # Zod validation schemas
  qr/
    components/   # QR-specific UI
```

Shared/reusable components live in `src/components/`. Global server-side utilities (session, profile) are in `src/services/`.

### Data Layer

- **Supabase SSR** for auth, database, and storage — client created in `src/lib/supabase/server.ts`
- Server Components are the default; client components are marked `'use client'`
- Forms use **React Hook Form** + **Zod** (error messages are in Spanish)

### UI Stack

- **Tailwind CSS v4** (PostCSS-based, no `tailwind.config`)
- **Hero UI v2** (successor to NextUI) — configured in `src/app/hero.ts` and wrapped in `src/app/providers.tsx`
- **next-themes** for dark/light mode (class-based)
- **Framer Motion** for animations
- **Sonner** for toast notifications
- **@bprogress/next** for route transition progress bar

### Code Style

Biome enforces: tabs for indentation, single quotes, no semicolons. Run `bun check` before committing.
