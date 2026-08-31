/**
 * Pure judgement logic for the "색인/크롤링(Indexing)" checklist card (issue #4
 * indexing-checklist). Unlike buildBasicSeoChecks (issue #3), these four checks don't all come
 * from a single endpoint — `sitemapExists` and `sitemapDeclaredInRobots` are built from the
 * `siteMap`/`robotsTxt` service responses respectively, while `canonical`/`canonicalMultiple`/
 * `metaRobotsNoindex` are built from `crawling`'s DOM extraction. Each service method attaches
 * its own subset to its response's `checks.indexing`; the frontend concatenates them
 * (`combineScanResults`) the same way it already does for `checks.basicSeo` passthrough — no
 * verdict computation happens on the frontend (ADR-003 update, PRD §4).
 */

// A single leading slash that isn't a protocol-relative "//host/..." href — mirrors the pre-
// ADR-011 legacy `runChecks` regex for canonical-is-relative detection (see git history of
// ScanService before the Hexagonal migration).
const RELATIVE_PATH_RE = /^\/(?!\/)/;

export function buildSitemapExistsCheck(hasSitemap: boolean): IndexingCheckItem {
  return { id: "sitemapExists", status: hasSitemap ? "pass" : "warning" };
}

export function buildSitemapDeclaredInRobotsCheck(
  sitemapsDeclaredInRobots: string[]
): IndexingCheckItem {
  return {
    id: "sitemapDeclaredInRobots",
    status: sitemapsDeclaredInRobots.length > 0 ? "pass" : "info",
  };
}

// "정상/자기참조=pass, 없음/상대경로=info" (spec decision log #1 — kept as code-current "info",
// PRD §3.2 says "warning" but that's the doc that's stale, not this). Only the *first* canonical
// tag's href is judged here — `buildCanonicalMultipleCheck` handles the "more than one" case
// separately and doesn't care whether the values agree.
export function buildCanonicalCheck(canonicalLinks: string[]): IndexingCheckItem {
  const first = canonicalLinks[0];
  const isRelative = !!first && RELATIVE_PATH_RE.test(first);
  return { id: "canonical", status: !first || isRelative ? "info" : "pass" };
}

// 1개=pass, 2개 이상=fail — href 값이 같든 다르든 개수만으로 판정 (spec decision log #4).
export function buildCanonicalMultipleCheck(
  canonicalLinks: string[]
): IndexingCheckItem {
  return {
    id: "canonicalMultiple",
    status: canonicalLinks.length >= 2 ? "fail" : "pass",
  };
}

// Token-exact match on a comma/whitespace-separated `<meta name="robots" content="...">` value —
// not a substring check, to avoid false positives like "max-snippet: noindex-example" (spec
// decision log #5).
export function buildMetaRobotsNoindexCheck(
  metaRobotsContent?: string
): IndexingCheckItem {
  const tokens = (metaRobotsContent ?? "")
    .split(/[,\s]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return {
    id: "metaRobotsNoindex",
    status: tokens.includes("noindex") ? "fail" : "pass",
  };
}
