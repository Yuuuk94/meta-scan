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
interface CrawlingCheckItem {
  id: string;
  level: "error" | "warn" | "info";
  message: string;
  target?: string;
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
  checks: CrawlingCheckItem[];
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

interface TopIssue {
  id: string;
  status: "fail" | "warning";
  message: string;
}

/** Already-judged fields merged from the 4 raw responses — `combineScanResults`
 * only merges/sorts, it doesn't compute any verdicts itself (ADR-003 update,
 * PRD §4). Grouped `checks.basicSeo` etc. isn't built yet — out of scope for
 * this pass; only the fields that already exist today are merged. */
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
}

interface ScanResultEntry {
  url: string;
  raw: RawScanResponses;
  combined: CombinedScanResult;
  scannedAt: number;
}
