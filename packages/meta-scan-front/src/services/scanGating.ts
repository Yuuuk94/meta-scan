// TODO(ADR-010, docs/frontend-atomic-architecture.md): not implemented yet — this migration pass
// only moved existing code into the new folder structure, it didn't build the missing logic.
//
// Per ADR-006 (docs/adr/index.html#adr-006): robots.txt must be checked alone first; if its
// verdict is disallow, the other three scans (siteMap/crawling/lighthouse) must not be called at
// all (cost control), and `@/ui/organisms/BlockedScreen` should render instead. That sequencing
// logic doesn't exist yet — `@/ui/organisms/ProcessScreen` still fires all four calls in parallel via
// `Promise.allSettled` (see its `promistList`) and never renders `BlockedScreen`.
//
// export function shouldBlockScan(robotsTxtResult: RobotsTxtData): boolean { ... }

export {};
