# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js 16 App Router project. Application routes live in `src/app`, shared UI and utilities in `src/shared`, and domain logic in `src/features` (`auth`, `qr-codes`, `analytics`, `billing`, `webhooks`, etc.). Translations are stored in `messages/`, static assets in `public/`, unit and service tests in `src/tests/`, and generated browser-flow tests in `testsprite_tests/`. Use `src/features/<domain>/components`, `services`, `schemas`, and `queries|mutations` to keep new work aligned with the existing structure.

## Build, Test, and Development Commands
- `npm run dev`: start the local dev server with Turbopack.
- `npm run build`: create a production build with Next.js.
- `npm run start`: run the built app locally.
- `npm run test` or `npm run test:run`: execute Vitest tests.
- `npm run test:coverage`: generate V8 coverage in `coverage/`.
- `npm run lint`: run Biome lint fixes on `src/`.
- `npm run format`: format `src/` with Biome.
- `npm run check`: run Biome format + lint fixes together.

## Coding Style & Naming Conventions
TypeScript is the default. Biome enforces tabs, single quotes, and no semicolons; run `npm run check` before opening a PR. Use PascalCase for React components (`QrForm.tsx`), kebab-case for route segments and utility filenames where already established, and `*.test.ts(x)` for tests. Keep server actions and data access in `services/`, not inside page components.

## Testing Guidelines
Vitest runs in `jsdom` with setup from `src/tests/setup.ts`. Place unit and service tests under `src/tests/**` and mirror the feature or utility being tested, for example `src/tests/unit/generate-slug.test.ts`. Coverage currently targets `src/features/**`, `src/shared/**`, and `src/app/api/**`; add tests when touching those areas, especially mutations, auth flows, and redirect logic.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes such as `feat:` and `chore:`. Keep commit subjects short and imperative, for example `feat: add QR folder filters`. PRs should include a concise description, linked issue or task, notes about env or schema changes, and screenshots or short recordings for UI work in `src/app` or `src/features`.

## Security & Configuration Tips
Copy values from `.env.example` and keep secrets in `.env.local` only. This repo integrates with Supabase and LemonSqueezy; document any new required variables and avoid committing credentials, generated coverage artifacts, or `.next/` output.
