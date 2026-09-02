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

/** One row of the "미리보기(Previews)" checklist card (issue #5
 * previews-checklist). Like `checks.basicSeo`, all 4 rows come from the
 * `crawling` response alone (no cross-API merge) — mirrors meta-scan-api's
 * `PreviewsCheckItem` (`domain/checks/previewsChecks.ts`). None of the
 * current 4 ids (ogImageDimensions/favicon/ogRequiredTags/twitterCard) ever
 * carry `detail`, but the field is kept optional for parity with
 * BasicSeoCheckItem/IndexingCheckItem. */
interface PreviewsCheckItem {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
}

/** One row of the "AI 신호(AI Signals/AEO)" checklist card (issue #6
 * ai-signals-checklist). Like `checks.basicSeo`/`checks.previews`, all 5
 * rows (promptsTxt/promptObject/structuredData/faqSection/jsRenderDelta)
 * come from the `crawling` response alone (no cross-API merge) — mirrors
 * meta-scan-api's `AiSignalsCheckItem` (`domain/checks/aiSignalsChecks.ts`).
 * `detail` carries promptsTxt's byte count (pass only) or jsRenderDelta's
 * raw signed deltaRatio (all 3 statuses); promptObject/structuredData/
 * faqSection are existence-only, no detail. */
interface AiSignalsCheckItem {
  id: string;
  status: BasicSeoStatus;
  detail?: number;
}

/** Raw heading-tag counts backing the "headings" content check's `detail`
 * (issue #7 content-stats-checklist) — h1 count together with h2/h3
 * presence. Mirrors meta-scan-api's `ContentHeadingCounts`. */
interface ContentHeadingCounts {
  h1: number;
  h2: number;
  h3: number;
}

/** One row of the "콘텐츠 품질(Content Stats)" checklist card (issue #7
 * content-stats-checklist). Reuses BasicSeoStatus's pass/warning/fail/info
 * vocabulary, same as the other groups. Unlike every other checklist item's
 * `detail`, `charCount`'s is a plain number, `headings`'s is the raw
 * `ContentHeadingCounts` object (not a natural single number), and `tldr`
 * omits it entirely (existence-only) — mirrors meta-scan-api's
 * `ContentCheckItem` (`domain/checks/contentChecks.ts`). */
interface ContentCheckItem {
  id: string;
  status: BasicSeoStatus;
  detail?: number | ContentHeadingCounts;
}

/** One row of the "국제화/UX(i18n/UX)" checklist card (issue #8
 * i18n-ux-checklist). Like `checks.basicSeo`/`checks.previews`/
 * `checks.aiSignals`/`checks.content`, both rows (hreflang/viewport) come
 * from the `crawling` response alone (no cross-API merge) — mirrors
 * meta-scan-api's `I18nUxCheckItem` (`domain/checks/i18nUxChecks.ts`).
 * Neither id ever carries `detail` (existence-only checks), but the field is
 * kept optional for parity with the other CheckItem shapes. */
interface I18nUxCheckItem {
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
    // JSON-LD @type values found on the page (e.g. ["WebPage", "FAQPage"])
    // — backend only uses this to judge checks.aiSignals's structuredData/
    // faqSection/promptObject rows (pass/warning), the raw list itself
    // isn't in any check item's `detail`. Passed through as-is so
    // <AiSignalsCard> can show it as a muted suffix next to "구조화 데이터"
    // (ScanZine.dc.html: "구조화 데이터 WebPage, FAQPage").
    structuredDataTypes?: string[];
  };
  // Grouped by checklist card (issue #3 basic-seo-checklist introduces the
  // first group, `basicSeo`; issue #4 indexing-checklist adds `indexing`
  // — though its `sitemapExists`/`sitemapDeclaredInRobots` rows come from
  // the siteMap/robotsTxt responses, not this one; issue #5
  // previews-checklist adds `previews`, a straight passthrough like
  // `basicSeo` since all 4 rows come from this same response; content-stats
  // lands via its own issue; issue #6 ai-signals-checklist adds
  // `aiSignals`, also a straight passthrough — all 5 rows come from this
  // same response's own extraction). Replaces the previous flat
  // `checks: Array<{ id, level, message, target? }>` shape that
  // `ScanService.crawling`'s old push-only-on-problem `runChecks` used to
  // return. issue #7 content-stats-checklist adds `content`
  // (`charCount`/`headings`/`tldr`), also a straight passthrough — all 3
  // rows come from this same response's own extraction. issue #8
  // i18n-ux-checklist adds `i18nUx` (`hreflang`/`viewport`), also a
  // straight passthrough — both rows come from this same response's own
  // extraction.
  checks: {
    basicSeo: BasicSeoCheckItem[];
    indexing: IndexingCheckItem[];
    previews: PreviewsCheckItem[];
    aiSignals: AiSignalsCheckItem[];
    content: ContentCheckItem[];
    i18nUx: I18nUxCheckItem[];
  };
}

/** One Lighthouse category's raw score (0–1, Google's own grading — PRD
 * §3.7/ADR-007: never recomputed or bucketed into our pass/warning/fail/info
 * vocabulary, always shown as-is). */
interface LighthouseCategoryResult {
  title: string;
  score: number | null;
}

/** One row of `lhr.audits` — only the fields this app actually reads, not
 * the full upstream shape (which also carries `scoreDisplayMode`,
 * `numericValue`, `details`, etc. — see the `lighthouse` npm package's
 * `Audit.Result` type). */
interface LighthouseAuditResult {
  id: string;
  title: string;
  description?: string;
  score: number | null;
}

/** `lighthouse run`'s response body. Unlike `robotsTxt`/`siteMap`/`crawling`,
 * `LighthouseController.run` returns `result?.lhr` directly, without the
 * `{ status: "ok", ... }` wrapper the other 3 scan endpoints use
 * (meta-scan-api CLAUDE.md "응답 스프레드 규약과 예외") — code that treats this
 * like the other 3 (a bare `.status === "ok"` check) will always read a
 * real response as failed (see ProcessScreen's per-call `isOk` predicate).
 * All fields optional since only `categories`/`audits` are consumed here;
 * the real `lhr` carries many more (`fetchTime`, `configSettings`, ...). */
interface LighthouseData {
  lighthouseVersion?: string;
  requestedUrl?: string;
  categories?: Record<string, LighthouseCategoryResult>;
  audits?: Record<string, LighthouseAuditResult>;
}

/** Raw response bodies for the 4 scan APIs, as ProcessScreen collects them.
 * `null` means that call never resolved with a body (still pending, or
 * failed — Promise.allSettled swallows the rejection). */
interface RawScanResponses {
  robotsTxt: RobotsTxtData | null;
  siteMap: SiteMapData | null;
  crawling: CrawlingScanData | null;
  lighthouse: LighthouseData | null;
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
 * PRD §4). `checks.basicSeo`/`checks.previews` are straight passthroughs of
 * `raw.crawling.checks.basicSeo`/`.previews` (issue #3 basic-seo-checklist,
 * issue #5 previews-checklist) — no cross-API merge needed since those
 * groups only ever come from one response. `checks.indexing` (issue #4
 * indexing-checklist) *is* a cross-API merge — `siteMap`/`robotsTxt`/
 * `crawling` each contribute their own subset, and this is where they get
 * concatenated into one array. `openGraph`/`twitter` (already present above)
 * double as the previews card's raw values for its Google/Twitter-style
 * mockup render (issue #5 req #3/#4) — not re-derived here. `checks.aiSignals`
 * (issue #6 ai-signals-checklist) is a straight passthrough too, same as
 * `basicSeo`/`previews` — all 5 rows only ever come from `crawling`.
 * `checks.content` (issue #7 content-stats-checklist) is a straight
 * passthrough too, same as `basicSeo`/`previews`/`aiSignals`. `checks.i18nUx`
 * (issue #8 i18n-ux-checklist) is a straight passthrough too, same as the
 * above — both rows only ever come from `crawling`. */
/** score (0–1) is intentionally required and non-null here — this is the
 * already-filtered output of `buildLighthouseSuggestions` (`score !== null`
 * is part of the filter, spec-fixed.md req #1), unlike the raw
 * `LighthouseAuditResult.score` it's built from. */
interface LighthouseSuggestion {
  id: string;
  title: string;
  description?: string;
  score: number;
}

/** The 4 Lighthouse category scores (0–1, `null` when that category is
 * missing from the response), plus the top-5 lowest-scoring audits
 * (`score !== null && score < 0.9`, spec-fixed.md req #1) — built by
 * `services/buildLighthouseScores.ts` / `services/buildLighthouseSuggestions.ts`
 * from `raw.lighthouse`, not passed through as the full `lhr` (which also
 * carries `details`/full-text descriptions per audit — no need to duplicate
 * that inside `combined` when `raw.lighthouse` already has it). Optional on
 * `CombinedScanResult` (not always present in older/hand-built fixtures),
 * but `combineScanResults` itself always sets it. */
interface CombinedLighthouse {
  scores: {
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPractices: number | null;
  };
  suggestions: LighthouseSuggestion[];
}

interface CombinedScanResult {
  url?: string;
  title?: string;
  description?: string;
  canonical?: string;
  h1?: string[];
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  /** Straight passthrough of extract.structuredDataTypes — <AiSignalsCard>'s
   * muted suffix next to "구조화 데이터", not used for any judgement here. */
  structuredDataTypes?: string[];
  hasSitemap?: boolean;
  /** fail-first, backfilled with warning, capped at `topIssuesLimit` (default 3). */
  topIssues: TopIssue[];
  failedApis: FailedScanApi[];
  checks: {
    basicSeo: BasicSeoCheckItem[];
    indexing: IndexingCheckItem[];
    previews: PreviewsCheckItem[];
    aiSignals: AiSignalsCheckItem[];
    content: ContentCheckItem[];
    i18nUx: I18nUxCheckItem[];
  };
  /** Issue #9 lighthouse-suggestions. */
  lighthouse?: CombinedLighthouse;
}

interface ScanResultEntry {
  url: string;
  raw: RawScanResponses;
  combined: CombinedScanResult;
  scannedAt: number;
}
