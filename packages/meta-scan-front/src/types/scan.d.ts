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
}

interface SiteMapData extends OkStatus, HasData {
  url?: string;
  redirected?: boolean;
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
  // first group, `basicSeo`; other groups — indexing/content-stats/previews
  // — land via their own issues). Replaces the previous flat
  // `checks: Array<{ id, level, message, target? }>` shape that
  // `ScanService.crawling`'s old push-only-on-problem `runChecks` used to
  // return.
  checks: { basicSeo: BasicSeoCheckItem[] };
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
 * Other groups (indexing/content-stats/previews) aren't built yet. */
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
  checks: { basicSeo: BasicSeoCheckItem[] };
}

interface ScanResultEntry {
  url: string;
  raw: RawScanResponses;
  combined: CombinedScanResult;
  scannedAt: number;
}
