// Per ADR-006 (docs/adr/index.html#adr-006): robots.txt must be checked alone first; if its
// verdict is disallow, the other three scans (siteMap/crawling/lighthouse) must not be called at
// all (cost control), and `@/ui/organisms/BlockedScreen` should render instead. That sequencing
// logic is a separate slice (issue #1) and isn't wired into `ProcessScreen` on this branch.
//
// This function's job is to merge the 4 already-judged raw responses into the single shape
// `/scan/:id` renders — it doesn't compute any verdicts itself (ADR-003 update, PRD §4). Group
// structure (checks.basicSeo etc.) isn't built yet — out of scope for this walking-skeleton pass
// (docs/feature/01-seo-aeo-geo-checker/pipe-connection/spec-fixed.md).

const DEFAULT_TOP_ISSUES_LIMIT = 3;

// Backend crawling `checks[]` levels (error/warn/info) map onto this
// product's own pass/warning/fail/info vocabulary. `pass` never appears here
// because `checks[]` only lists problems, not passing items.
const LEVEL_TO_TOP_ISSUE_STATUS: Record<
  CrawlingCheckItem["level"],
  TopIssue["status"] | null
> = {
  error: "fail",
  warn: "warning",
  info: null,
};

function buildTopIssues(
  crawling: CrawlingScanData | null,
  limit: number
): TopIssue[] {
  const checks = crawling?.checks ?? [];

  const issues = checks
    .map((check) => ({
      status: LEVEL_TO_TOP_ISSUE_STATUS[check.level],
      check,
    }))
    .filter(
      (entry): entry is { status: TopIssue["status"]; check: CrawlingCheckItem } =>
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
      message: check.message,
    }));
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
    hasSitemap: raw.siteMap?.has,
    topIssues: buildTopIssues(raw.crawling, topIssuesLimit),
    failedApis,
  };
}
