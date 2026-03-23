# Product Requirements Document — QR Generator SaaS

**Version:** 2.0
**Date:** 2026-03-19
**Stack:** Next.js 16 · Supabase · Hero UI · Tailwind CSS v4 · Lemon Squeezy

---

## 1. Overview

QR Generator SaaS is a web application that allows users to create, customize, and track dynamic QR codes. It targets individuals, small businesses, and teams that need branded, analytics-enabled QR codes with a subscription model.

---

## 2. Goals

- Allow users to generate QR codes for multiple content types (URL, text, WiFi, contact, etc.)
- Provide deep analytics on QR scans (device, location, browser, time)
- Offer advanced customization (colors, styles, logos, frames)
- Monetize via a three-tier subscription (Free / Pro / Business)
- Support bilingual interface (Spanish / English)
- Enable team collaboration for Business plan users
- Provide programmatic access via REST API and webhooks

---

## 3. User Roles

| Role     | Description                                         |
|----------|-----------------------------------------------------|
| Guest    | Unauthenticated visitor who scans a QR code         |
| User     | Registered user on any plan                         |
| Member   | Team member invited by a Business plan owner        |
| Admin    | Internal admin with elevated permissions            |

---

## 4. Plans & Limits

| Feature                        | Free       | Pro ($12/mo)   | Business ($29/mo)     |
|-------------------------------|------------|----------------|-----------------------|
| QR codes                      | 3          | Unlimited      | Unlimited             |
| Scans / month                 | 500        | Unlimited      | Unlimited             |
| Basic analytics               | ✓          | ✓              | ✓                     |
| Advanced analytics (world map)| ✗          | ✓              | ✓                     |
| SVG export                    | ✗          | ✓              | ✓                     |
| Conditional redirects         | ✗          | ✓              | ✓                     |
| QR logo / watermark removal   | ✗          | ✓              | ✓                     |
| CSV analytics export          | ✗          | ✓              | ✓                     |
| Custom slug                   | ✗          | ✓              | ✓                     |
| UTM parameters                | ✗          | ✓              | ✓                     |
| Bulk QR actions               | ✗          | ✓              | ✓                     |
| Share QR page                 | ✗          | ✓              | ✓                     |
| QR templates                  | ✗          | ✓              | ✓                     |
| Webhooks                      | ✗          | ✗              | ✓                     |
| REST API + API keys           | ✗          | ✗              | ✓                     |
| Custom domain                 | ✗          | ✗              | ✓                     |
| Team members                  | ✗          | ✗              | Up to 10              |
| Priority support              | ✗          | ✗              | ✓                     |
| Email reports                 | ✗          | ✗              | ✓                     |

> Yearly billing available: Pro at $96/yr (~$8/mo), Business at $232/yr (~$19.33/mo) — 33% savings.

---

## 5. Features

### 5.1 Authentication

- Email/password sign-up and login
- Google OAuth
- Email confirmation flow
- Password reset via email
- Session handled by Supabase SSR (server-side cookies)

### 5.2 Onboarding

- Modal shown once after first login (`onboarding_completed = false`)
- Guides the user through creating their first QR code
- Marks profile as `onboarding_completed = true` on completion

### 5.3 QR Code Management

#### Creation
- Select QR type: `url`, `text`, `email`, `phone`, `wifi`, `contact`, `location`, `event`, `payment`
- Enter content appropriate for the type
- Assign a human-readable name and auto-generated URL slug
- Custom slug (Pro+): user-defined, URL-safe, unique
- Assign to a folder (optional)

#### Customization
- Foreground and background colors (hex)
- Dot styles: `square`, `dots`, `rounded`, `classic`, `classicR`, `extraR`
- Corner square and corner dot styles
- Gradient type: `linear` or `radial` with two-color stop
- Frame style: `none`, `simple`, `rounded`, `bold`; frame color and label text
- Logo upload (stored in Supabase Storage)

#### Protection & Control
- Optional password gate (visitors must enter password before redirect)
- Expiration date (`expires_at`)
- Maximum scan limit (`max_scans`)
- Activation toggle (`is_active`)
- Device-conditional redirects: separate iOS and Android destination URLs (Pro+)
- UTM parameters: `utm_source`, `utm_medium`, `utm_campaign` appended to destination URL (Pro+)

#### Actions
- Edit, delete, duplicate
- Toggle active/inactive
- Mark as favorite
- Move to folder
- Download as PNG or SVG (SVG requires Pro+)
- Share via public share page (Pro+)
- Bulk actions: delete, activate/deactivate, move to folder (Pro+)

#### Templates (Pro+)
- Save current QR style as a named template
- Apply a saved template when creating or editing a QR
- Delete templates

### 5.4 Folder Organization

- Create, rename, delete folders
- Each folder has a unique slug
- QRs can be assigned to one folder
- Sidebar displays folder list with QR count
- Dedicated `/dashboard/qrs/folder/[slug]` route per folder

### 5.5 Analytics

#### Per-QR Analytics (`/dashboard/qrs/[slug]/analytics`)
- Total and unique scan counts
- Scans trend: today, last 7 days, last 30 days (with % change vs prior period)
- Breakdown by OS, device type, browser
- Breakdown by country/region/city
- Scans by hour of day (bar chart)
- World map visualization (Pro+)
- Recent scans table (last 10 entries)
- CSV export (Pro+)

#### Global Analytics (`/dashboard/analytics`)
- Aggregated metrics across all user QRs
- Same chart types and breakdowns as per-QR view

#### Dashboard Stats (`/dashboard`)
- Total QR codes created
- Active QR codes
- Scans today
- Scans this month

### 5.6 Scan Tracking

- Endpoint: `GET /api/t/[slug]`
- Validates QR status (active, not expired, not over scan limit)
- Parses User-Agent (OS, device type, browser) via `ua-parser-js`
- Resolves geolocation from IP via `ipinfo.io` (results cached 24 hours)
- Detects unique scans: a scan from the same IP within 24 hours is not unique
- Increments `scan_count` via Supabase RPC
- Inserts record into `qr_scans` table
- Applies device-conditional redirect (iOS/Android) if configured
- Appends UTM parameters to destination URL if set
- Routes non-URL QR types to `/qr-view/[slug]` for display
- Fires webhooks on scan events (Business+)

#### Error Routes for Guests
| Route              | Trigger                     |
|--------------------|-----------------------------|
| `/qr-expired`      | `expires_at` in the past    |
| `/qr-inactive`     | `is_active = false`         |
| `/qr-limit`        | `scan_count >= max_scans`   |
| `/qr-not-found`    | Slug does not exist         |
| `/qr-gate/[slug]`  | Password-protected QR       |

### 5.7 Billing (Lemon Squeezy)

- Checkout session creation via `POST /api/lemonsqueezy/checkout`
- Customer portal via `GET /api/lemonsqueezy/portal`
- Webhooks at `POST /api/webhooks/lemonsqueezy`
  - Events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`
  - Updates `profiles.plan`, `ls_subscription_id`, `ls_customer_id`, `plan_expires_at`
- Billing management page at `/dashboard/billing`
- Monthly and yearly billing options

### 5.8 Team Management (Business)

- Invite team members by email (up to 10)
- Roles: `admin` or `member`
- Invitation flow:
  - Owner sends invite → email sent via Supabase Auth with token link
  - Invitee clicks `/invite/[token]` → must be logged in with matching email to accept
- Remove members at any time
- Members can view the workspace of the team owner

### 5.9 Webhooks (Business)

- Create webhooks with a name, destination URL, and optional signing secret
- Toggle webhooks active/inactive
- Delete webhooks
- Delivered on QR scan events
- Payload signed with HMAC-SHA256 using the configured secret
- Managed at `/dashboard/webhooks`

### 5.10 REST API & API Keys (Business)

#### API Key Management (`/dashboard/api`)
- Generate named API keys (key shown in plaintext only once at creation)
- Keys stored as bcrypt hashes; only prefix is stored for display
- Revoke keys at any time
- `last_used_at` tracked per key

#### REST API Endpoints (authenticated via `Authorization: Bearer <key>`)

| Method | Path                   | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/api/v1/qrs`          | List QR codes (paginated, 20/page)   |
| POST   | `/api/v1/qrs`          | Create a QR code                     |
| GET    | `/api/v1/qrs/[id]`     | Get a single QR code by ID           |
| PATCH  | `/api/v1/qrs/[id]`     | Update a QR code                     |
| DELETE | `/api/v1/qrs/[id]`     | Delete a QR code                     |

- All endpoints enforce plan limits (QR count, feature access)
- `custom_slug` supported on POST if plan has `customSlug` feature

### 5.11 Localization

- Supported locales: `es` (default), `en`
- Language switcher available in the UI
- Locale stored as a cookie (`NEXT_LOCALE`)
- All validation error messages in Spanish by default

### 5.12 Theme

- Light and dark mode via `next-themes` (class-based)
- Theme toggle in dashboard navbar

---

## 6. Data Model

### `profiles`
| Column              | Type      | Notes                         |
|---------------------|-----------|-------------------------------|
| id                  | uuid      | FK to auth.users              |
| email               | text      |                               |
| name, surname       | text      |                               |
| phone               | text      |                               |
| avatar_url          | text      |                               |
| role                | enum      | `admin` \| `user`             |
| plan                | enum      | `free` \| `pro` \| `business` |
| ls_customer_id      | text      | Lemon Squeezy customer ID     |
| ls_subscription_id  | text      | Lemon Squeezy subscription ID |
| plan_expires_at     | timestamp |                               |
| onboarding_completed| boolean   | Defaults to false             |
| created_at          | timestamp |                               |

### `qrs`
| Column              | Type      | Notes                                          |
|---------------------|-----------|------------------------------------------------|
| id                  | uuid      |                                                |
| user_id             | uuid      | FK to profiles                                 |
| folder_id           | uuid      | Nullable FK to folders                         |
| name                | text      |                                                |
| slug                | text      | Unique, auto-generated                         |
| custom_slug         | text      | Nullable; user-defined (Pro+)                  |
| qr_type             | enum      | `url` \| `text` \| `email` \| `phone` \| `wifi` \| `contact` \| `location` \| `event` \| `payment` |
| data                | text      | QR content                                     |
| bg_color, fg_color  | text      | Hex colors                                     |
| dot_color_2         | text      | Gradient second color                          |
| dot_gradient_type   | enum      | `linear` \| `radial`                           |
| dot_style           | text      | Dot render style                               |
| corner_square_style | text      |                                                |
| corner_dot_style    | text      |                                                |
| frame_style         | text      |                                                |
| frame_color         | text      |                                                |
| frame_text          | text      |                                                |
| logo_url            | text      | Public URL in Supabase Storage                 |
| logo_path           | text      | Storage path for deletion                      |
| scan_count          | integer   |                                                |
| is_active           | boolean   |                                                |
| is_favorite         | boolean   |                                                |
| password            | text      | Nullable; enables password gate                |
| expires_at          | timestamp | Nullable                                       |
| max_scans           | integer   | Nullable                                       |
| ios_url             | text      | Nullable; Pro+ conditional redirect            |
| android_url         | text      | Nullable; Pro+ conditional redirect            |
| utm_source          | text      | Nullable; Pro+                                 |
| utm_medium          | text      | Nullable; Pro+                                 |
| utm_campaign        | text      | Nullable; Pro+                                 |
| created_at          | timestamp |                                                |
| updated_at          | timestamp |                                                |

### `folders`
| Column     | Type      | Notes              |
|------------|-----------|--------------------|
| id         | uuid      |                    |
| user_id    | uuid      | FK to profiles     |
| name       | text      |                    |
| slug       | text      | Unique per user    |
| created_at | timestamp |                    |

### `qr_scans`
| Column         | Type      | Notes                                  |
|----------------|-----------|----------------------------------------|
| id             | uuid      |                                        |
| qr_id          | uuid      | FK to qrs                              |
| user_id        | uuid      | FK to profiles                         |
| ip_address     | text      |                                        |
| os             | text      |                                        |
| device_type    | text      |                                        |
| browser        | text      |                                        |
| country        | text      |                                        |
| region         | text      |                                        |
| city           | text      |                                        |
| is_unique_scan | boolean   | False if same IP scanned within 24h    |
| created_at     | timestamp |                                        |

### `team_members`
| Column      | Type      | Notes                                  |
|-------------|-----------|----------------------------------------|
| id          | uuid      |                                        |
| owner_id    | uuid      | FK to profiles (Business plan owner)   |
| member_id   | uuid      | Nullable FK to profiles (set on accept)|
| email       | text      | Invited email address                  |
| role        | enum      | `admin` \| `member`                    |
| status      | enum      | `pending` \| `active`                  |
| token       | text      | Nullable; cleared on acceptance        |
| invited_at  | timestamp |                                        |
| joined_at   | timestamp | Nullable; set on acceptance            |

### `webhooks`
| Column     | Type      | Notes                          |
|------------|-----------|--------------------------------|
| id         | uuid      |                                |
| user_id    | uuid      | FK to profiles                 |
| name       | text      |                                |
| url        | text      | HTTPS destination URL          |
| secret     | text      | Nullable; HMAC signing secret  |
| is_active  | boolean   |                                |
| created_at | timestamp |                                |

### `api_keys`
| Column       | Type      | Notes                                    |
|--------------|-----------|------------------------------------------|
| id           | uuid      |                                          |
| user_id      | uuid      | FK to profiles                           |
| name         | text      |                                          |
| key_hash     | text      | bcrypt hash; never returned to client    |
| key_prefix   | text      | First 12 chars; shown for identification |
| is_active    | boolean   |                                          |
| last_used_at | timestamp | Nullable                                 |
| created_at   | timestamp |                                          |

---

## 7. Routes

### Public
| Path                  | Description                        |
|-----------------------|------------------------------------|
| `/`                   | Landing page                       |
| `/pricing`            | Pricing plans page                 |
| `/login`              | Email/Google login                 |
| `/register`           | Registration                       |
| `/reset-password`     | Password reset request             |
| `/confirm-email`      | Email confirmation                 |
| `/invite/[token]`     | Team invitation acceptance         |
| `/qr-view/[slug]`     | Display non-URL QR content         |
| `/qr-gate/[slug]`     | Password gate                      |
| `/share/[slug]`       | Public QR share page               |
| `/qr-expired`         | Expired QR error page              |
| `/qr-inactive`        | Inactive QR error page             |
| `/qr-limit`           | Scan limit error page              |
| `/qr-not-found`       | Not found error page               |

### Protected (Dashboard)
| Path                              | Description                          |
|-----------------------------------|--------------------------------------|
| `/dashboard`                      | Stats overview                       |
| `/dashboard/qrs`                  | QR list (paginated, 10/page)         |
| `/dashboard/qrs/new`              | Create QR                            |
| `/dashboard/qrs/[slug]`           | QR detail                            |
| `/dashboard/qrs/[slug]/edit`      | Edit QR                              |
| `/dashboard/qrs/[slug]/analytics` | QR analytics                         |
| `/dashboard/qrs/folder/[slug]`    | QRs in a folder                      |
| `/dashboard/analytics`            | Global analytics                     |
| `/dashboard/favorites`            | Favorite QR codes                    |
| `/dashboard/profile`              | User profile settings                |
| `/dashboard/billing`              | Subscription management              |
| `/dashboard/team`                 | Team management (Business)           |
| `/dashboard/webhooks`             | Webhook management (Business)        |
| `/dashboard/api`                  | API key management (Business)        |

### Internal API
| Method | Path                             | Description                      |
|--------|----------------------------------|----------------------------------|
| GET    | `/api/t/[slug]`                  | QR tracking & redirect           |
| POST   | `/api/qr-gate`                   | Password verification            |
| GET    | `/api/analytics/export`          | CSV export                       |
| GET    | `/api/auth/callback`             | Supabase OAuth callback          |
| GET    | `/api/auth/confirm`              | Email confirmation               |
| POST   | `/api/lemonsqueezy/checkout`     | Create checkout session          |
| GET    | `/api/lemonsqueezy/portal`       | Customer portal                  |
| POST   | `/api/webhooks/lemonsqueezy`     | Subscription webhooks            |
| POST   | `/api/locale`                    | Set language cookie              |

### Public REST API (Business — Bearer token)
| Method | Path                   | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/api/v1/qrs`          | List QR codes (paginated)            |
| POST   | `/api/v1/qrs`          | Create a QR code                     |
| GET    | `/api/v1/qrs/[id]`     | Get a QR code by ID                  |
| PATCH  | `/api/v1/qrs/[id]`     | Update a QR code                     |
| DELETE | `/api/v1/qrs/[id]`     | Delete a QR code                     |

---

## 8. Technical Architecture

### Stack
- **Framework:** Next.js 16 App Router with Turbopack
- **Database & Auth:** Supabase (PostgreSQL + SSR)
- **Storage:** Supabase Storage (QR logos)
- **Payments:** Lemon Squeezy
- **UI Library:** Hero UI v2 (successor to NextUI)
- **Styling:** Tailwind CSS v4 (PostCSS, no config file)
- **Forms:** React Hook Form + Zod
- **Charts:** ApexCharts + react-simple-maps
- **State:** Zustand (sidebar, loader)
- **Animations:** Framer Motion
- **Toasts:** Sonner
- **i18n:** next-intl
- **Linting/Formatting:** Biome (tabs, single quotes, no semicolons)
- **Testing:** Vitest + Testing Library + jsdom
- **Runtime:** Bun

### Code Organization
```
src/
  app/                  # Next.js routes (App Router)
    (auth)/             # Unauthenticated pages
    (pages)/            # Public pages
    dashboard/          # Protected dashboard
    api/                # Internal API routes
      v1/               # Public REST API (Business)
  features/             # Feature-sliced business logic
    auth/
    qr-codes/
    folders/
    analytics/
    billing/
    tracking/
    team/
    webhooks/
    api-keys/
    onboarding/
  shared/
    components/         # Reusable UI components
    context/            # React contexts & Zustand stores
    lib/                # Utilities (supabase, api-key-auth, etc.)
    types/              # TypeScript types and DB types
```

### Key Patterns
- **Server Components** are the default; client components are marked `'use client'`
- **Server Actions** for all mutations and protected queries
- **Supabase SSR** client created per-request via `src/shared/lib/supabase/server.ts`
- **Plan enforcement** runs in server actions and API routes before accessing premium features
- **API key auth** uses bcrypt hash comparison; raw key shown only once at creation
- **IP-based geolocation** results are cached 24 hours to minimize external API calls

---

## 9. Non-Functional Requirements

| Requirement        | Target                                                         |
|--------------------|----------------------------------------------------------------|
| Performance        | Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms          |
| Availability       | 99.9% uptime (Vercel + Supabase SLAs)                         |
| Security           | Auth via Supabase JWT; RLS on all tables; server-side plan checks; API keys hashed with bcrypt |
| Scalability        | Stateless API routes; database indexed on slug, user_id, qr_id |
| Accessibility      | WCAG 2.1 AA baseline (Hero UI components)                     |
| SEO                | Static landing and pricing pages; SSR for dashboard           |

---

## 10. Out of Scope (v1)

- Native mobile apps
- QR code scanning from camera in-app
- White-label / reseller program
- A/B testing different QR destinations
- Real-time analytics (WebSocket)
- Bulk QR creation via CSV upload
- Email reports delivery (UI placeholder exists, delivery not implemented)
