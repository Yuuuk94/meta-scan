// Per ADR-006 (docs/adr/index.html#adr-006): robots.txt must be checked alone first; if its
// verdict is disallow, the other three scans (siteMap/crawling/lighthouse) must not be called at
// all (cost control), and `@/ui/organisms/BlockedScreen` should render instead. That sequencing
// logic is a separate slice (issue #1) and isn't wired into `ProcessScreen` on this branch.
//
// This function's job is to merge the 4 already-judged raw responses into the single shape
// `/scan/:id` renders — it doesn't compute any verdicts itself (ADR-003 update, PRD §4). Group
// structure (checks.basicSeo etc.) is built here as a straight passthrough (issue #3
// basic-seo-checklist) — no cross-API merge needed since that group only ever comes from the
// crawling response. `checks.indexing` (issue #4 indexing-checklist) is different: it's a real
// cross-API merge — siteMap contributes sitemapExists, robotsTxt contributes
// sitemapDeclaredInRobots, and crawling contributes canonical/canonicalMultiple/
// metaRobotsNoindex, each already judged by the backend (domain/checks/indexingChecks.ts) — this
// just concatenates whichever of the 3 came back. `lighthouse` (issue #9 lighthouse-suggestions)
// isn't a checks[] group at all — it's Lighthouse's own category scores plus a filtered slice of
// its own lhr.audits (ADR-007), built via buildLighthouseScores/buildLighthouseSuggestions rather
// than our pass/warning/fail/info vocabulary. Other groups (content-stats) aren't built yet.

import { buildLighthouseScores } from "@/services/buildLighthouseScores";
import { buildLighthouseSuggestions } from "@/services/buildLighthouseSuggestions";

const DEFAULT_TOP_ISSUES_LIMIT = 3;

// checks.basicSeo's pass/warning/fail/info vocabulary maps onto this
// function's fail-first-then-warning topIssues list. `pass`/`info` never
// surface as a topIssue — `info` means "signal present, not a deduction"
// (design-system.md §8), and `pass` obviously isn't an issue.
const STATUS_TO_TOP_ISSUE_STATUS: Record<
  BasicSeoStatus,
  TopIssue["status"] | null
> = {
  fail: "fail",
  warning: "warning",
  pass: null,
  info: null,
};

function buildTopIssues(
  crawling: CrawlingScanData | null,
  limit: number
): TopIssue[] {
  // Optional-chain past `checks` itself, not just `.basicSeo` — some
  // existing test/mock fixtures (e.g. robots-gating tests) stub crawling's
  // response as a bare `{ status: "ok" }` without a `checks` field at all,
  // and a real backend 2xx with a malformed body shouldn't crash this
  // either.
  const checks = crawling?.checks?.basicSeo ?? [];

  const issues = checks
    .map((check) => ({
      status: STATUS_TO_TOP_ISSUE_STATUS[check.status],
      check,
    }))
    .filter(
      (entry): entry is { status: TopIssue["status"]; check: BasicSeoCheckItem } =>
        entry.status !== null
    );

  // fail 우선, 모자라면 warning으로 채움 (PRD §4)
  const fails = issues.filter((entry) => entry.status === "fail");
  const warnings = issues.filter((entry) => entry.status === "warning");

  return [...fails, ...warnings]
    .slice(0, limit)
    .map(({ status, check }) => ({
      id: check.id,
      status,
      detail: check.detail,
    }));
}

// Order: siteMap (sitemapExists) -> crawling (canonical, canonicalMultiple,
// metaRobotsNoindex) -> robotsTxt (sitemapDeclaredInRobots) — mirrors the
// spec's requirement numbering (spec-fixed.md req #1-#4). A source that
// failed (null) or came back without a `checks.indexing` field just
// contributes nothing, rather than dropping the whole merge.
function buildIndexingChecks(raw: RawScanResponses): IndexingCheckItem[] {
  return [
    ...(raw.siteMap?.checks?.indexing ?? []),
    ...(raw.crawling?.checks?.indexing ?? []),
    ...(raw.robotsTxt?.checks?.indexing ?? []),
  ];
}

export function combineScanResults(
  url: string,
  raw: RawScanResponses,
  topIssuesLimit: number = DEFAULT_TOP_ISSUES_LIMIT
): CombinedScanResult {
  const failedApis = (Object.keys(raw) as FailedScanApi[]).filter(
    (key) => raw[key] === null
  );

  const extract = raw.crawling?.extract;

  return {
    // The scanned page's URL, passed in explicitly by the caller — not
    // derived from raw.robotsTxt.url/raw.siteMap.url, which are the
    // fetched *resource* URLs (…/robots.txt, …/sitemap.xml), not the page.
    url,
    title: extract?.title,
    description: extract?.description,
    canonical: extract?.canonical,
    h1: extract?.h1,
    openGraph: extract?.openGraph,
    twitter: extract?.twitter,
    structuredDataTypes: extract?.structuredDataTypes,
    hasSitemap: raw.siteMap?.has,
    topIssues: buildTopIssues(raw.crawling, topIssuesLimit),
    failedApis,
    checks: {
      basicSeo: raw.crawling?.checks?.basicSeo ?? [],
      indexing: buildIndexingChecks(raw),
      // Straight passthrough, same as basicSeo — all 4 previews checks come
      // from crawling alone, no cross-API merge needed (issue #5
      // previews-checklist).
      previews: raw.crawling?.checks?.previews ?? [],
      // Straight passthrough too — all 5 aiSignals checks
      // (promptsTxt/promptObject/structuredData/faqSection/jsRenderDelta)
      // come from crawling alone, no cross-API merge needed (issue #6
      // ai-signals-checklist).
      aiSignals: raw.crawling?.checks?.aiSignals ?? [],
    },
    lighthouse: {
      scores: buildLighthouseScores(raw.lighthouse),
      suggestions: buildLighthouseSuggestions(raw.lighthouse),
    },
  };
}
