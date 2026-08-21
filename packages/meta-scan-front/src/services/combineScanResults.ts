// TODO(ADR-010, docs/frontend-atomic-architecture.md): not implemented yet — this migration pass
// only moved existing code into the new folder structure, it didn't build the missing logic.
//
// Per CLAUDE.md ("현재 상태"): robotsTxt/siteMap/crawling/lighthouse each return their own
// pass/warning/fail/info `checks[]` (judgement lives entirely in meta-scan-api, per ADR-003) —
// this function's job is to merge those four already-judged results into the grouped shape
// `/scan` renders, not to compute any verdicts itself.
//
// Response shapes for crawling/lighthouse aren't typed yet on the front end (see
// `@/api/scanApi` — those two calls are still `unknown`), so a real signature can't be written
// until that's resolved.
//
// export function combineScanResults(...): ScanResultGroup[] { ... }

export {};
