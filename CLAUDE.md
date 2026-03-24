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
bun test         # Run Vitest tests (watch mode)
bun test:run     # Run Vitest tests (CI / single run)
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. Required vars:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SECRET_KEY=<service-role-key>          # server-only, never expose to client
LEMONSQUEEZY_API_KEY=<api-key>
LEMONSQUEEZY_STORE_ID=<store-id>
LEMONSQUEEZY_WEBHOOK_SECRET=<signing-secret>
NEXT_PUBLIC_LS_PRO_VARIANT_ID=<variant-id>
NEXT_PUBLIC_LS_PRO_ANNUAL_VARIANT_ID=<variant-id>
NEXT_PUBLIC_LS_BUSINESS_VARIANT_ID=<variant-id>
NEXT_PUBLIC_LS_BUSINESS_ANNUAL_VARIANT_ID=<variant-id>
IPINFO_TOKEN=                                   # optional, enables geolocation analytics
```

## Architecture

### Proxy (Middleware)

In Next.js 16+, the middleware file is named **`src/proxy.ts`** (renamed from `middleware.ts` in v14-15). The exported function must be `proxy()` and the config export must be `config` (Turbopack 16.2.1 still requires `config`, not `proxyConfig`).

```
src/proxy.ts  →  calls updateSession() from src/shared/lib/supabase/middleware.ts
```

### Routing

Uses **Next.js App Router** with route groups:

| Route group | Purpose |
|---|---|
| `(auth)/` | Unauthenticated pages: login, register, reset-password, confirm-email |
| `(pages)/` | Public-facing pages: landing, pricing, terms, privacy |
| `dashboard/` | Protected routes: qrs, analytics, favorites, billing, team, webhooks, api |
| `api/auth/` | Supabase OAuth callback |
| `api/t/[slug]/` | **Core business logic** — QR scan tracking & redirect |
| `api/v1/` | Public REST API (Business plan, authenticated with API keys) |
| `api/lemonsqueezy/` | Checkout, customer portal |
| `api/webhooks/lemonsqueezy/` | Payment webhook receiver |

### Feature-Sliced Design

Business logic lives in `src/features/` by domain. Each feature follows:

```
features/<domain>/
  components/   # UI components specific to this feature
  hooks/        # Client-side React hooks
  services/
    mutations/  # Server Actions that write data
    queries/    # Server Actions that read data
  schema/       # Zod validation schemas (use factory functions for i18n)
  config/       # Static configuration (e.g. plans.ts)
```

Domains: `auth`, `qr-codes`, `analytics`, `billing`, `folders`, `webhooks`, `api-keys`, `team`, `onboarding`, `tracking`.

Shared/reusable code lives in `src/shared/` (components, utils, lib, context, types).

### Data Layer

- **Supabase SSR** for auth, database, and storage.
- Two client modes:
  - `createClient()` in `src/shared/lib/supabase/server.ts` — respects RLS, use for user reads/writes.
  - `createAdminClient()` in `src/shared/lib/supabase/admin.ts` — **bypasses RLS**, only use in server code after verifying the session.
- Server Components are the default; client components are marked `'use client'`.
- Auth state is validated server-side via `getSession()` which calls `supabase.auth.getUser()` (validates JWT with Supabase, not just reads the cookie).

### Internationalization (i18n)

**Important constraints** — read before touching translations:

- Uses `next-intl` v4 with **cookie-based locale** (no URL segments). Default locale: `es`.
- **No `NextIntlClientProvider` in the tree.** This means `useTranslations()` will crash in client components.
- **Correct pattern:**
  1. Server Component (page) calls `getTranslations('namespace')`.
  2. Builds a plain typed object of strings.
  3. Passes it as a `translations` prop to the client component.
  4. Client component uses `translations.key` (not the hook).
- `error.tsx` and `not-found.tsx` render outside the Next.js layout tree — they cannot access intl context. Keep strings hardcoded in English there.
- Zod schemas use factory functions (`createAuthSchema(m)`, `createQrSchema(m)`) so validation messages can be translated. Pass the messages from the server page down through props.

Translation files: `messages/en.json` and `messages/es.json`. Keep them in sync.

### Billing & Plans

Three tiers defined in `src/features/billing/config/plans.ts`:

| Plan | QRs | Scans/mo | Price |
|---|---|---|---|
| `free` | 3 | 100 | $0 |
| `pro` | ∞ | ∞ | $12/mo |
| `business` | ∞ | ∞ | $29/mo |

Use `hasFeature(planId, 'featureKey')` to gate features. Plan display strings (description, feature list) come from `pricing.plans.*` i18n keys — do not hardcode them.

### QR Tracking Flow

`/api/t/[slug]` is the core redirect endpoint. It:
1. Rate-limits by IP (120 req/min).
2. Looks up the QR by slug or custom_slug.
3. Checks active status, expiry, scan limit, and owner's monthly plan limit.
4. Redirects to password gate if QR is protected.
5. Records the scan (geo, UA, device, unique detection).
6. Fires webhooks fire-and-forget.
7. Redirects to the target URL (with UTM params, conditional iOS/Android URLs).

### UI Stack

- **Tailwind CSS v4** (PostCSS-based, no `tailwind.config`)
- **Hero UI v2** — configured in `src/app/hero.ts`, wrapped in `src/app/providers.tsx`
- **next-themes** for dark/light mode (class-based)
- **Framer Motion** for animations
- **Sonner** for toast notifications
- **React Hook Form + Zod** for all forms
- **@hugeicons/core-free-icons** for icons (not lucide, not heroicons)

### Code Style

Biome enforces: tabs for indentation, single quotes, no semicolons. Run `bun check` before committing.

### Testing

Vitest is configured. Test files live in `src/tests/`. Run `bun test:run` for a single pass.
