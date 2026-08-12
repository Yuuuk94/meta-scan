# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
package. It's part of the `meta-scan` pnpm workspace — see the repo-root `CLAUDE.md` for
monorepo-wide commands and context.

## Commands

Run these from the **repo root** (pnpm workspace scripts), not from inside this directory,
unless noted:

```bash
pnpm dev:front                              # next dev, :3000
pnpm --filter meta-scan-front build         # next build
pnpm --filter meta-scan-front start         # next start (serve the production build)
pnpm --filter meta-scan-front lint          # eslint (next/core-web-vitals, next/typescript)
```

No test scripts exist — don't assume a test runner.

Requires `packages/meta-scan-front/.env.local` with
`NEXT_PUBLIC_META_SCAN_API=http://localhost:8080` (or wherever `meta-scan-api` is running)
for local dev — it's gitignored and not created automatically.

## Architecture

Next.js App Router with locale-prefixed routing under `src/app/[lang]/`.

- `src/middleware.ts` — on every non-static/non-API request, reads `theme`/`lang` cookies
  (setting defaults from `Accept-Language` on first visit) and redirects to a
  locale-prefixed path (`/` → `/ko/` or `/en/`) if the URL has no locale prefix yet. Allowed
  locales/cookie keys/defaults live in `src/constans/index.ts`.
- `src/dictionaries/` — `en.json`/`ko.json` loaded lazily per-locale via
  `getDictionary(locale)` (`src/dictionaries/index.ts`, `"server-only"` — call it from
  server components/layouts, not client components).
- `src/apis/` — `index.ts` creates a shared `axios` instance with `baseURL` from
  `NEXT_PUBLIC_META_SCAN_API`; per-domain call files (e.g. `scan.ts`) wrap `meta-scan-api`
  endpoints. **Inconsistency to be aware of**: some calls rely on the shared `instance`'s
  `baseURL` alone (`sitePingApi`), others re-prepend `NEXT_PUBLIC_META_SCAN_API` to the path
  explicitly on top of the same instance (`scanRobotsTxtApi`, etc.) — check which pattern an
  existing call follows before adding a new one, don't assume `baseURL` alone is sufficient.
- `src/stores/scanStore.ts` — Zustand store persisted to `localStorage` for
  previously-requested scan URLs.
- `src/templates/` — page-section components grouped by page/feature
  (`main/`, `request-scan/`, `root/`), separate from the generic, mostly-shadcn-style
  primitives in `src/components/ui/`.
- Path alias `@/*` → `src/*` (see `tsconfig.json`).

## Environment variables

`NEXT_PUBLIC_META_SCAN_API` — base URL of `meta-scan-api`. Must be set in `.env.local` for
local dev (see Commands above); set as a build/deploy-time env var in production (Vercel).
