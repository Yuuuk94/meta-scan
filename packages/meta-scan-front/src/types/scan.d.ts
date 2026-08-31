interface UrlData {
  url: string;
}

interface HasData {
  has: boolean;
}

interface RedirectedData {
  redirected: boolean;
}
interface SiteStatusData extends OkStatus, UrlData, RedirectedData {}

interface RobotsTxtData extends OkStatus, HasData {
  url?: string;
  redirected?: boolean;
  allow?: Record<string, boolean>;
  contents?: string;
  sitemap?: string[];
  checks?: { indexing: IndexingCheckItem[] };
}

interface SiteMapData extends OkStatus, HasData {
  url?: string;
  redirected?: boolean;
  checks?: { indexing: IndexingCheckItem[] };
}

/** Mirrors meta-scan-api's `MetaScanResult` (packages/meta-scan-api/src/types/meta.d.ts)
 * + the `{ status: "ok", ... }` spread the scan adapter wraps responses in
 * (see meta-scan-api CLAUDE.md "응답 스프레드 규약"). Replaces the previous
 * `unknown` placeholder now that the backend shape is stable enough to type
 * (front CLAUDE.md "API 호출 패턴" flagged this as the thing to fill in). */

/** Judgement vocabulary shared with `<StatusBadge>` (pass/warning/fail/info —
 * docs/design-system.md §8), mirrors meta-scan-api's `BasicSeoStatus`. */
type BasicSeoStatus = "pass" | "warning" | "fail" | "info";

/** One row of the "기본 SEO" checklist card (issue #3 basic-seo-checklist).
 * `detail` is a raw number (char count / missing count / duplicate count) —
 * the backend never returns a rendered sentence; the frontend assembles one
 * from `dictionaries/{ko,en}.json` templates (see
 * `services/buildBasicSeoMessage.ts`) so copy stays translatable. Mirrors
 * meta-scan-api's `BasicSeoCheckItem`. */
interface BasicSeoCheckItem {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
}

/** One row of the "색인/크롤링(Indexing)" checklist card (issue #4
 * indexing-checklist). Unlike `checks.basicSeo`, these rows come from three
 * different responses (`siteMap`/`robotsTxt`/`crawling`) and get
 * concatenated by `combineScanResults` — see that file's comment. Mirrors
 * meta-scan-api's `IndexingCheckItem`. */
interface IndexingCheckItem {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
}

interface CrawlingScanData extends OkStatus {
  url: string;
  finalUrl: string;
  timingMs: { firstHtml: number; onload: number };
  html: {
    first: { length: number; sha1: string };
    onload: { length: number; sha1: string };
    deltaRatio: number;
  };
  extract: {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    h1: string[];
    images: { total: number; altMissing: number };
    openGraph: Record<string, string>;
    twitter: Record<string, string>;
    duplicates: { metaName: string[]; metaProperty: string[] };
  };
  // Grouped by checklist card (issue #3 basic-seo-checklist introduces the
  // first group, `basicSeo`; issue #4 indexing-checklist adds `indexing`
  // — though its `sitemapExists`/`sitemapDeclaredInRobots` rows come from
  // the siteMap/robotsTxt responses, not this one; other groups —
  // content-stats/previews — land via their own issues). Replaces the
  // previous flat `checks: Array<{ id, level, message, target? }>` shape
  // that `ScanService.crawling`'s old push-only-on-problem `runChecks` used
  // to return.
  checks: { basicSeo: BasicSeoCheckItem[]; indexing: IndexingCheckItem[] };
}

/** Raw response bodies for the 4 scan APIs, as ProcessScreen collects them.
 * `null` means that call never resolved with a body (still pending, or
 * failed — Promise.allSettled swallows the rejection). Lighthouse stays
 * `unknown` — its `lhr` shape isn't consumed by this walking-skeleton pass
 * (docs/feature/01-seo-aeo-geo-checker/pipe-connection/spec-fixed.md). */
interface RawScanResponses {
  robotsTxt: RobotsTxtData | null;
  siteMap: SiteMapData | null;
  crawling: CrawlingScanData | null;
  lighthouse: unknown | null;
}

type FailedScanApi = "robotsTxt" | "siteMap" | "crawling" | "lighthouse";

/** `detail` (not a rendered `message`) so the sentence gets assembled at
 * render time from `dictionaries/{ko,en}.json` (issue #3 basic-seo-checklist
 * req #3) instead of being baked into `localStorage`-persisted state in
 * whatever locale was active at scan time. See
 * `services/buildBasicSeoMessage.ts` + `<ScanHero>`. */
interface TopIssue {
  id: string;
  status: "fail" | "warning";
  detail?: number;
}

/** Already-judged fields merged from the 4 raw responses — `combineScanResults`
 * only merges/sorts, it doesn't compute any verdicts itself (ADR-003 update,
 * PRD §4). `checks.basicSeo` is a straight passthrough of
 * `raw.crawling.checks.basicSeo` (issue #3 basic-seo-checklist) — no
 * cross-API merge needed since that group only ever comes from one response.
 * `checks.indexing` (issue #4 indexing-checklist) *is* a cross-API merge —
 * `siteMap`/`robotsTxt`/`crawling` each contribute their own subset, and
 * this is where they get concatenated into one array. Other groups
 * (content-stats/previews) aren't built yet. */
interface CombinedScanResult {
  url?: string;
  title?: string;
  description?: string;
  canonical?: string;
  h1?: string[];
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  hasSitemap?: boolean;
  /** fail-first, backfilled with warning, capped at `topIssuesLimit` (default 3). */
  topIssues: TopIssue[];
  failedApis: FailedScanApi[];
  checks: { basicSeo: BasicSeoCheckItem[]; indexing: IndexingCheckItem[] };
}

interface ScanResultEntry {
  url: string;
  raw: RawScanResponses;
  combined: CombinedScanResult;
  scannedAt: number;
}
