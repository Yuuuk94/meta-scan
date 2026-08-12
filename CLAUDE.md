# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

pnpm workspace monorepo with two packages, merged via `git subtree` (each retains its
original commit history — see `docs/monorepo-dependency-management.md` for how/why):

- `packages/meta-scan-api` — Express + TypeScript backend. Crawls/scans URLs (meta tags,
  robots.txt, sitemap) and runs Lighthouse audits via headless Chrome.
- `packages/meta-scan-front` — Next.js 15 (App Router) frontend that calls the API and
  renders scan results.

See `docs/monorepo-dependency-management.md` for why pnpm workspaces (over Yarn Berry) was
chosen and how the migration was applied.

## Commands

Run from the repo root unless noted. Package manager is pnpm (`packageManager` pinned in
root `package.json`).

```bash
pnpm install                              # install all workspace deps (once)

pnpm dev:api                              # meta-scan-api dev server (tsx watch, :8080)
pnpm dev:front                            # meta-scan-front dev server (next dev, :3000)

pnpm -r build                             # build every package
pnpm --filter meta-scan-api build         # tsc + tsc-alias -> dist/
pnpm --filter meta-scan-front build       # next build

pnpm -r lint                              # lint every package
pnpm --filter meta-scan-front lint        # eslint (next/core-web-vitals, next/typescript)
pnpm --filter meta-scan-api typecheck     # tsc --noEmit
```

There are no test scripts in either package — do not assume a test runner exists.

**Known gap:** `meta-scan-api`'s `lint` script (`eslint .`) currently fails — the package
has ESLint deps/config in `package.json` but no `eslint.config.js` file exists. Add one
before relying on that script.

**Known gap:** `packages/meta-scan-api/dockerfile` still runs `npm ci` against a
`package*.json` it copies in, but the package no longer has its own lockfile (it lives at
the workspace root as `pnpm-lock.yaml`). The Docker build needs to be updated to a pnpm
workspace-aware build (e.g. copy the root `pnpm-lock.yaml`/`pnpm-workspace.yaml` and use
`pnpm deploy` or `pnpm install --filter`) before it will work again.

Native/build-script deps (`puppeteer`, `esbuild`, `sharp`, etc.) are explicitly allow-listed
in root `package.json` under `pnpm.onlyBuiltDependencies` — pnpm blocks install scripts by
default, so a new native dependency needs to be added there or its postinstall (e.g.
puppeteer's Chromium download) silently won't run.

## Architecture

### meta-scan-api

Layered Express app, module-per-feature under `src/modules/*`, each with
`*.router.ts` (wires routes) → `*Controller.ts` (extends `BaseController`, request/response
only) → `*Service.ts` (business logic). Path aliases (`@core/*`, `@constant/*`, `@config/*`,
`@infra/*`, `@modules/*`) are defined in `tsconfig.json` and resolved by `tsc-alias` at
build time — always import via the alias, not relative paths across module boundaries.

- `src/app.ts` — app entrypoint; mounts routers under `/api/v1/<key>` from a `routers` map,
  Swagger UI at `/api/docs`, CORS allow-list driven by `FRONT_URL`/`FRONT_TEST_URL`/`PUBLIC_URL`.
- `src/core/http/` — `BaseController` (response helpers + async-handler wrapper that
  forwards errors to `next`), `ApiError` (typed HTTP errors with static factories), the
  global `errorHandler`/`notFound` middleware.
- `src/core/validation/validator.ts` — thin Zod wrapper; DTOs in each module's `dto.ts`
  define request schemas and are the source of truth for request types.
- `src/infra/` — two separate browser-automation wrappers with different lifecycles:
  `Puppeteer.ts` (full `puppeteer` browser, used by the `scan` module to load pages and
  extract DOM/meta data) and `ChromeLauncher.ts` (`chrome-launcher`, launches a debuggable
  Chrome instance for `lighthouse` to drive over the DevTools protocol). Don't conflate the
  two — Lighthouse needs a raw Chrome process + port, not a Puppeteer `Browser`.
  `Puppeteer.launch()` passes `--no-sandbox` because Cloud Run (the deploy target, see
  `dockerfile`) runs containers without the sandbox available.
  Every scan/lighthouse call `launch()`s a fresh process and closes/kills it in a `finally`
  block — there is no browser pooling.
- `src/modules/scan/scanService.ts` — the core scan logic: `ping` (HEAD request),
  `robotsTxt` (fetches + hand-rolled robots.txt parser/matcher, no external lib),
  `siteMap` (HEAD check for sitemap.xml), and `crawling` (fetches raw HTML, then loads the
  same URL in Puppeteer to get the post-JS-execution HTML, diffs the two, extracts meta/OG/
  Twitter tags and image alt coverage via `page.evaluate`, and runs a fixed set of SEO
  `checks` — see `runChecks`). This is the most complex module in the API.
- `src/config/swagger.ts` — hand-written OpenAPI 3.1 spec object (not auto-generated from
  routes/DTOs) served at `/api/docs`; keep it in sync manually when adding/changing routes.
- Deployed as a container to Cloud Run (`dockerfile`); requires system Chromium at
  `CHROME_PATH` in the runtime image (installed via `apt-get install chromium` in the
  Dockerfile) since `lighthouse`'s `chrome-launcher` needs a browser binary, distinct from
  Puppeteer's own bundled Chromium.

### meta-scan-front

Next.js App Router with locale-prefixed routing under `src/app/[lang]/`.

- `src/middleware.ts` — on every non-static/non-API request, reads `theme`/`lang` cookies
  (setting defaults from `Accept-Language` on first visit) and redirects to a
  locale-prefixed path (`/`→`/ko/` or `/en/`) if the URL has no locale prefix yet. Allowed
  locales/cookie keys/defaults live in `src/constans/index.ts`.
- `src/dictionaries/` — `en.json`/`ko.json` loaded lazily per-locale via
  `getDictionary(locale)` (`src/dictionaries/index.ts`, `"server-only"` — call it from
  server components/layouts, not client components).
- `src/apis/` — `index.ts` creates a shared `axios` instance with `baseURL` from
  `NEXT_PUBLIC_META_SCAN_API`; per-domain call files (e.g. `scan.ts`) wrap
  `meta-scan-api` endpoints. Note the inconsistency: some calls use the shared `instance`'s
  `baseURL` (`sitePingApi`), others re-prepend `NEXT_PUBLIC_META_SCAN_API` to the path
  explicitly on top of the same instance (`scanRobotsTxtApi`, etc.) — check which pattern an
  existing call follows before adding a new one, don't assume `baseURL` alone is sufficient.
- `src/stores/scanStore.ts` — Zustand store persisted to `localStorage` for
  previously-requested scan URLs.
- `src/templates/` — page-section components grouped by page/feature
  (`main/`, `request-scan/`, `root/`), separate from the generic, mostly-shadcn-style
  primitives in `src/components/ui/`.
- Path alias `@/*` → `src/*` (see `tsconfig.json`).

## Environment variables

- `meta-scan-api`: `PORT` (default 8080), `FRONT_URL`, `FRONT_TEST_URL`, `PUBLIC_URL` (CORS
  allow-list + Swagger server URL), `CHROME_PATH` (Chromium binary for `chrome-launcher`,
  set in `dockerfile` for the container image).
- `meta-scan-front`: `NEXT_PUBLIC_META_SCAN_API` (base URL of `meta-scan-api`).
