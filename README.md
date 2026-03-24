# QR Generator SaaS

A full-featured SaaS platform for creating, customizing, and tracking dynamic QR codes. Built with Next.js 16, Supabase, and LemonSqueezy.

> **New to the project? Start here.** This document covers everything you need to understand the architecture, run the project locally, and contribute without breaking anything.

---

## Table of Contents

1. [What it does](#what-it-does)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Getting started](#getting-started)
5. [Architecture deep-dive](#architecture-deep-dive)
   - [Routing](#routing)
   - [Feature-Sliced Design](#feature-sliced-design)
   - [Database & Supabase](#database--supabase)
   - [Auth flow](#auth-flow)
   - [QR tracking flow](#qr-tracking-flow)
   - [Billing & plans](#billing--plans)
   - [Internationalization](#internationalization)
   - [API](#api)
6. [Key rules & gotchas](#key-rules--gotchas)
7. [Environment variables reference](#environment-variables-reference)

---

## What it does

QR Generator lets users create **dynamic QR codes** that can be updated after printing. Key features:

- **Create & customize** — dot styles, colors, gradients, logo overlay, frame text
- **Dynamic redirects** — change the destination URL without reprinting the QR
- **Real-time analytics** — scans by country, city, device, browser, OS; world-map view
- **Conditional redirects** — different URL for iOS vs. Android vs. desktop
- **Password protection & expiry** — gate QRs with a password, expiry date, or max-scan limit
- **Folders** — organize QRs into collections
- **Templates** — save style configurations for reuse
- **Team collaboration** — invite members, manage roles (Business plan)
- **Webhooks** — receive HTTP callbacks on scan events (Business plan)
- **REST API** — programmatic QR management (Business plan)
- **Internationalization** — English and Spanish, cookie-based locale switching

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Payments | LemonSqueezy |
| Styling | Tailwind CSS v4 (PostCSS, no config file) |
| UI Components | Hero UI v2 (successor to NextUI) |
| Icons | @hugeicons/core-free-icons |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| i18n | next-intl v4 |
| QR rendering | qr-code-styling, qrcode.react |
| Charts | ApexCharts, react-simple-maps |
| Toasts | Sonner |
| Linter / Formatter | Biome |
| Tests | Vitest |

---

## Project structure

```
.
├── messages/               # i18n translation files
│   ├── en.json
│   └── es.json
├── public/
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   ├── (auth)/         # Login, register, reset-password, confirm-email
│   │   ├── (pages)/        # Landing page, pricing, terms, privacy
│   │   ├── dashboard/      # Protected area (all authenticated routes)
│   │   ├── api/            # Route Handlers (REST + webhooks + tracking)
│   │   ├── qr-gate/        # Password-protected QR entry page
│   │   ├── qr-view/        # Non-URL QR content viewer
│   │   ├── share/          # Public shareable QR page
│   │   └── [qr-status]/    # qr-expired, qr-inactive, qr-limit, qr-not-found
│   ├── features/           # Domain-driven business logic
│   │   ├── analytics/
│   │   ├── api-keys/
│   │   ├── auth/
│   │   ├── billing/
│   │   ├── folders/
│   │   ├── onboarding/
│   │   ├── qr-codes/
│   │   ├── team/
│   │   ├── tracking/
│   │   └── webhooks/
│   ├── shared/             # Cross-feature utilities
│   │   ├── components/     # Reusable UI (Logo, Sidebar, ThemeToggle…)
│   │   ├── context/        # React context (PlanContext, LoaderContext)
│   │   ├── lib/            # Supabase clients, rate limiter, LemonSqueezy
│   │   ├── types/          # database.types.ts (generated from Supabase)
│   │   └── utils/          # Format helpers, slug generator, tracking URL
│   ├── i18n/               # next-intl request config
│   └── proxy.ts            # Middleware entry point
├── .env.example            # All required environment variables with docs
├── CLAUDE.md               # AI assistant context file
└── vitest.config.ts
```

### Inside a feature

Every feature in `src/features/<domain>/` follows the same layout:

```
features/qr-codes/
  components/       # React components specific to this feature
  hooks/            # Client-side hooks (state + side effects)
  services/
    mutations/      # Server Actions that write to the database
    queries/        # Server Actions that read from the database
  schemas/          # Zod schemas (factory functions for i18n support)
  constants.ts      # Enums, lookup tables
```

---

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd generator-qr-sass
bun install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Open .env.local and fill in all values (see reference section below)
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-rls.sql` in the SQL editor to create tables and RLS policies
3. Enable Google OAuth provider in Authentication → Providers
4. Set the redirect URL to `http://localhost:3000/api/auth/callback`

### 4. Set up LemonSqueezy (optional for dev)

1. Create a store at [lemonsqueezy.com](https://lemonsqueezy.com)
2. Create products for Pro and Business plans, note the variant IDs
3. Add a webhook pointing to `<your-url>/api/webhooks/lemonsqueezy`

### 5. Run

```bash
bun dev       # starts at http://localhost:3000
```

### Available commands

```bash
bun dev          # Development server with Turbopack
bun build        # Production build
bun start        # Production server
bun check        # Lint + format (Biome) — run before committing
bun test         # Tests in watch mode (Vitest)
bun test:run     # Tests single run (CI)
```

---

## Architecture deep-dive

### Routing

The App Router uses route groups to separate concerns without affecting the URL:

```
(auth)/login            → /login
(auth)/register         → /register
(pages)/                → /
(pages)/pricing         → /pricing
dashboard/qrs           → /dashboard/qrs
dashboard/qrs/[slug]    → /dashboard/qrs/my-qr
api/t/[slug]            → /api/t/my-qr   ← QR scan redirect (core feature)
api/v1/qrs              → /api/v1/qrs    ← REST API
```

**Middleware** (`src/proxy.ts` → `src/shared/lib/supabase/middleware.ts`) runs on every request:
- Unauthenticated requests to `/dashboard/*` → redirect to `/login`
- Authenticated requests to `/login` or `/register` → redirect to `/dashboard/qrs`
- Uses `supabase.auth.getUser()` (validates JWT with Supabase server, not just reads cookie)

---

### Feature-Sliced Design

The codebase avoids a flat `components/` dump by grouping code by **business domain**. Example:

```ts
// Good — clear domain ownership
import { createQr } from '@/features/qr-codes/services/mutations/create-qr'
import { getAnalytics } from '@/features/analytics/services/queries/get-analytics'

// Avoid — business logic mixed into pages
// src/app/dashboard/qrs/new/page.tsx should only orchestrate, not contain logic
```

**Server vs. Client components:**
- Pages are Server Components by default — they fetch data and pass it as props
- Interactive components (forms, modals, buttons with state) are Client Components (`'use client'`)
- Never put `useTranslations()` in a client component (see i18n section)

---

### Database & Supabase

**Tables:**

| Table | Description |
|---|---|
| `profiles` | User profile + plan (`free` / `pro` / `business`) |
| `qrs` | QR code records (slug, colors, styles, redirect data, limits) |
| `qr_scans` | One row per scan event (ip, browser, os, country, city, is_unique) |
| `folders` | QR organization folders |
| `qr_templates` | Saved style configurations |
| `api_keys` | Hashed API keys for REST API access |
| `webhooks` | Webhook endpoint configurations |
| `team_members` | Team membership (Business plan) |

**Two Supabase client modes:**

```ts
// 1. Standard client — respects RLS policies. Use for all user-facing reads/writes.
import { createClient } from '@/shared/lib/supabase/server'
const supabase = await createClient()

// 2. Admin client — BYPASSES RLS. Only use server-side after verifying the session.
import { createAdminClient } from '@/shared/lib/supabase/admin'
const supabase = createAdminClient()
// Always verify the user first:
const { data } = await getSession()
if (!data?.user) return unauthorized()
```

---

### Auth flow

```
Registration:
  /register form → register() Server Action → supabase.auth.signUp()
    → createProfile() (plan = 'free', onboarding_completed = false)
    → redirect to /confirm-email

Login (email/password):
  /login form → login() Server Action → supabase.auth.signInWithPassword()
    → middleware sets session cookie → redirect to /dashboard/qrs

Login (Google OAuth):
  Google button → supabase.auth.signInWithOAuth()
    → Google consent → /api/auth/callback?code=...
    → exchange code for session → createProfile() if first time
    → redirect to /dashboard/qrs (or ?next= param)

Session validation:
  Every protected request → middleware → supabase.auth.getUser()
  (validates JWT server-side on every request)
```

---

### QR tracking flow

This is the core business logic. When someone scans a QR code:

```
User scans QR
  ↓
/api/t/[slug]  (src/app/api/t/[slug]/route.ts)
  ↓
1. Rate limit check (120 req/min per IP)
2. Look up QR by slug OR custom_slug
3. Guard checks:
   - QR exists?       → /qr-not-found
   - is_active?       → /qr-inactive
   - expired?         → /qr-expired
   - scan limit hit?  → /qr-limit
   - owner plan scan limit hit? → /qr-limit
   - password set?    → /qr-gate/[slug]  (no scan recorded yet)
4. Resolve geolocation from IP (ipinfo.io, 24h cache)
5. Check if unique scan (same IP in last 24h)
6. Increment scan_count (RPC call)
7. Save scan record (browser, OS, device, geo, unique flag)
8. Fire webhooks (fire-and-forget, errors swallowed)
9. Resolve redirect URL:
   - iOS device + ios_url set? → ios_url
   - Android device + android_url set? → android_url
   - Otherwise → data (with UTM params appended)
10. HTTP 307 redirect to resolved URL
```

For non-URL QR types (text, WiFi, vCard, etc.): redirect to `/qr-view/[slug]` which displays the content in the browser.

---

### Billing & plans

Plans are defined in `src/features/billing/config/plans.ts`:

| Plan | QRs | Scans/month | Price |
|---|---|---|---|
| `free` | 3 | 100 | $0 |
| `pro` | unlimited | unlimited | $12/mo · $96/yr |
| `business` | unlimited | unlimited | $29/mo · $232/yr |

**Feature gating:**

```ts
import { hasFeature } from '@/features/billing/config/plans'

// Check if a feature is available
if (!hasFeature(user.plan, 'webhooks')) {
  return { error: 'Upgrade to Business plan' }
}

// Available feature keys: customSlug, utmParams, bulkActions, shareQr,
// templates, svgDownload, advancedAnalytics, conditionalRedirect,
// noWatermark, webhooks, api, teamManagement, customDomain
```

**Plan context (client-side):**

```tsx
import { usePlan } from '@/shared/context/plan-context'
const { hasFeature, plan } = usePlan()
```

**Payment flow:**
1. User clicks upgrade → `POST /api/lemonsqueezy/checkout` → returns checkout URL
2. User pays on LemonSqueezy → webhook fires to `/api/webhooks/lemonsqueezy`
3. Webhook updates `profiles.plan` in Supabase
4. User can manage subscription at `/dashboard/billing` (LemonSqueezy portal)

---

### Internationalization

The project supports Spanish (default) and English. Locale is stored in a cookie (`NEXT_LOCALE`), not in the URL.

**Critical constraint: no `NextIntlClientProvider` in the tree.**

This means `useTranslations()` will **crash** in client components. The only correct pattern is:

```tsx
// ✅ CORRECT — Server Component fetches, passes as props
// src/app/(auth)/login/page.tsx
const LoginPage = async () => {
  const t = await getTranslations('auth.login')
  const tv = await getTranslations('auth.validation')
  return (
    <LoginForm translations={{
      title: t('title'),
      emailInvalid: tv('emailInvalid'),   // ← passed to Zod schema
      loginSuccess: tv('loginSuccess'),   // ← passed to toast
    }} />
  )
}

// ✅ CORRECT — Client Component uses plain prop object
// src/features/auth/components/login-form.tsx
'use client'
const LoginForm = ({ translations: t }: Props) => {
  const { form } = useLogin({ emailInvalid: t.emailInvalid, ... })
  return <p>{t.title}</p>
}

// ❌ WRONG — crashes at runtime
'use client'
const LoginForm = () => {
  const t = useTranslations('auth.login')  // NextIntlClientProvider not found!
}
```

**Zod schemas are internationalized via factory functions:**

```ts
// src/features/auth/schema/auth-form-data.ts
export const createAuthSchema = (m: AuthValidationMessages) =>
  z.object({
    email: z.string().email(m.emailInvalid),
    password: z.string().min(6, m.passwordMin),
  })
```

**Special cases:**
- `error.tsx` and `not-found.tsx` render outside the layout tree during errors — they have no intl context. Keep strings hardcoded in English there.

Translation files: `messages/en.json` and `messages/es.json`. Always update both files together.

---

### API

The public REST API (Business plan only) is authenticated with Bearer tokens:

```
Authorization: Bearer <api_key>
```

API keys are stored as SHA-256 hashes in the `api_keys` table.

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/qrs` | GET | List QRs (paginated, 20/page) |
| `/api/v1/qrs` | POST | Create a QR |
| `/api/v1/qrs/[id]` | PATCH | Update a QR |
| `/api/v1/qrs/[id]` | DELETE | Delete a QR |
| `/api/t/[slug]` | GET | QR scan redirect (public, rate limited) |
| `/api/qr-gate` | POST | Verify QR password |
| `/api/analytics/export` | POST | Export scan data as CSV |
| `/api/lemonsqueezy/checkout` | POST | Get checkout URL |
| `/api/lemonsqueezy/portal` | POST | Get customer portal URL |
| `/api/webhooks/lemonsqueezy` | POST | Payment webhook receiver |
| `/api/auth/callback` | GET | OAuth redirect handler |
| `/api/locale` | POST | Set locale cookie |

---

## Key rules & gotchas

1. **Never use `useTranslations()` in a client component.** Use the prop-passing pattern (see i18n section).

2. **Never expose `createAdminClient()` output to the browser.** Only use it server-side, always after `getSession()` verification.

3. **Run `bun check` before committing.** Biome is strict: tabs, single quotes, no semicolons.

4. **Validation schemas are factory functions.** `createAuthSchema(messages)` and `createQrSchema(messages)` — don't use the static `authFormDataSchema` / `qrSchema` exports unless you explicitly want English-only messages.

5. **Plan display strings come from i18n, not from `plans.ts`.** `plans.ts` holds functional config (limits, feature flags, prices). Descriptions and feature lists are in `pricing.plans.*` keys.

6. **`error.tsx` / `not-found.tsx` are hardcoded in English** on purpose — they render outside the Next.js layout and have no intl context.

7. **The rate limiter in `/api/t/[slug]` is in-memory.** In a multi-instance/serverless deployment each cold start has its own store. For production at scale, replace it with Upstash Redis.

---

## Environment variables reference

Copy `.env.example` to `.env.local`. Full docs are in the example file.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Yes | Full app URL, no trailing slash |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SECRET_KEY` | Yes | Service-role key — server only, never expose |
| `LEMONSQUEEZY_API_KEY` | Yes | LemonSqueezy API secret |
| `LEMONSQUEEZY_STORE_ID` | Yes | LemonSqueezy store ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Yes | Webhook signature secret |
| `NEXT_PUBLIC_LS_PRO_VARIANT_ID` | Yes | Pro monthly variant ID |
| `NEXT_PUBLIC_LS_PRO_ANNUAL_VARIANT_ID` | Yes | Pro annual variant ID |
| `NEXT_PUBLIC_LS_BUSINESS_VARIANT_ID` | Yes | Business monthly variant ID |
| `NEXT_PUBLIC_LS_BUSINESS_ANNUAL_VARIANT_ID` | Yes | Business annual variant ID |
| `NEXT_PUBLIC_TRACKING_URL` | No | Custom tracking domain (e.g. `https://go.yourdomain.com`) |
| `IPINFO_TOKEN` | No | ipinfo.io token for geolocation analytics |
