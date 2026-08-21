Empty on purpose — this is the Atomic Design "templates" layer (ADR-010,
`docs/case-study/frontend-atomic-architecture.md`): route-level skeletons that arrange `organisms/` without
real data (e.g. a future `HomeTemplate.tsx`, `RequestScanTemplate.tsx`, `ScanResultTemplate.tsx`).

Not built in this migration pass, which was scoped to "pure move + stubs" only — the existing
`app/[lang]/**/page.tsx` files still assemble `organisms/` directly. Building real template files
here is follow-up work.
