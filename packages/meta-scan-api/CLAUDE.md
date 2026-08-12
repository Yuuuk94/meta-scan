# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
package. It's part of the `meta-scan` pnpm workspace — see the repo-root `CLAUDE.md` for
monorepo-wide commands and context.

## Commands

Run these from the **repo root** (pnpm workspace scripts), not from inside this directory,
unless noted:

```bash
pnpm dev:api                              # tsx watch src/app.ts, :8080
pnpm --filter meta-scan-api build         # tsc -p tsconfig.json && tsc-alias -p tsconfig.json -> dist/
pnpm --filter meta-scan-api start         # node dist/app.js (run built output)
pnpm --filter meta-scan-api lint          # eslint .
pnpm --filter meta-scan-api typecheck     # tsc --noEmit
pnpm --filter meta-scan-api build:docker  # build the Docker image (see "Docker build" below)
```

No test scripts exist — don't assume a test runner.

## Architecture

Layered Express app, module-per-feature under `src/modules/*`, each with
`*.router.ts` (wires routes) → `*Controller.ts` (extends `BaseController`, request/response
only) → `*Service.ts` (business logic). Path aliases (`@core/*`, `@constant/*`, `@config/*`,
`@infra/*`, `@modules/*`, defined in `tsconfig.json`) are resolved by `tsc-alias` at build
time — import via the alias, not relative paths, across module boundaries.

- `src/app.ts` — entrypoint; mounts routers under `/api/v1/<key>` from a `routers` map,
  Swagger UI at `/api/docs`, CORS allow-list driven by `FRONT_URL`/`FRONT_TEST_URL`/`PUBLIC_URL`.
- `src/core/http/` — `BaseController` (response helpers + async-handler wrapper that
  forwards errors to `next`), `ApiError` (typed HTTP errors with static factories), the
  global `errorHandler`/`notFound` middleware.
- `src/core/validation/validator.ts` — thin Zod wrapper; DTOs in each module's `dto.ts`
  are the source of truth for request types/schemas.
- `src/infra/` — two separate browser-automation wrappers with different lifecycles, don't
  conflate them:
  - `Puppeteer.ts` — full `puppeteer` browser (bundled Chromium), used by `scan` to load
    pages and extract DOM/meta data. `launch()` passes `--no-sandbox` because Cloud Run
    (the deploy target) runs containers without a sandbox available.
  - `ChromeLauncher.ts` — `chrome-launcher`, launches a debuggable *system* Chrome instance
    (`CHROME_PATH`) for `lighthouse` to drive over the DevTools protocol. Lighthouse needs a
    raw Chrome process + port, not a Puppeteer `Browser`.
  Every scan/lighthouse call `launch()`s a fresh process and closes/kills it in a `finally`
  block — there is no browser pooling.
- `src/modules/scan/scanService.ts` — the core scan logic and the most complex module:
  `ping` (HEAD request), `robotsTxt` (fetch + hand-rolled robots.txt parser/matcher, no
  external lib), `siteMap` (HEAD check for sitemap.xml), and `crawling` (fetches raw HTML,
  then loads the same URL in Puppeteer to get post-JS-execution HTML, diffs the two,
  extracts meta/OG/Twitter tags and image alt coverage via `page.evaluate`, and runs a fixed
  set of SEO `checks` — see `runChecks`).
- `src/config/swagger.ts` — hand-written OpenAPI 3.1 spec object (not auto-generated from
  routes/DTOs), served at `/api/docs`; keep it in sync manually when adding/changing routes.

## Docker build

`dockerfile` is workspace-aware: its **build context must be the repo root**, not this
directory (it needs `pnpm-workspace.yaml`/`pnpm-lock.yaml` from the root), so always build
via `pnpm --filter meta-scan-api build:docker` (passes `../..` as context from this dir) or
`pnpm docker:build:api` from the root — never a bare `docker build .` run from here.

Internally the Dockerfile runs `pnpm --filter meta-scan-api build` then
`pnpm --filter meta-scan-api deploy --prod --legacy /deploy/meta-scan-api` to produce a
standalone `node_modules` (pnpm's workspace `node_modules` is symlink-based and not
copy-safe on its own), then copies only that into the runtime stage. This relies on
`package.json`'s `"files": ["dist"]` — without it, `pnpm deploy` follows git-tracked-files
rules and silently drops `dist/` (which is gitignored). `--legacy` is required because this
package has no in-workspace dependencies to inject (plain `pnpm deploy` on pnpm 10 refuses
non-injected workspaces).

The runtime image also installs system Chromium via `apt-get` and sets `CHROME_PATH` for
`chrome-launcher`/Lighthouse — separate from Puppeteer's own bundled Chromium.

## Environment variables

`PORT` (default 8080), `FRONT_URL`, `FRONT_TEST_URL`, `PUBLIC_URL` (CORS allow-list +
Swagger server URL), `CHROME_PATH` (Chromium binary path for `chrome-launcher`, set in
`dockerfile` for the container image).
