// Dev-only fixture so `/scan/:id` has something to render without running a
// full scan first — real captured response (robotsTxt/siteMap/crawling/
// lighthouse, lighthouse trimmed to category scores + a couple of
// representative low-scoring audits) from https://dev-portfolio.withmay.com
// via the local API, then combined with the actual `combineScanResults` so
// it matches production shape exactly.
// Refreshed 2026-08-31 (issue #5 previews-checklist) — `checks.previews` is
// now a real capture too, not the earlier synthetic placeholder.
// Refreshed again same day (issue #6 ai-signals-checklist) — `checks.aiSignals`
// added; this site has no prompts.txt/PromptObject/structured data (all
// `warning` per the 2026-08-31 판정 기준 재정의 — absence is no longer
// `info`) and a small JS-render delta (matches `html.deltaRatio` below,
// `pass`).
// Refreshed 2026-08-31 (issue #9 lighthouse-suggestions) — added
// raw.lighthouse.audits (trimmed, real ids/titles) and combined.lighthouse
// so the new card has something to render in dev.
// Refreshed again (issue #7 content-stats-checklist) — `checks.content`
// added; this site's actual body is short (well under the 600-char floor)
// and has no heading structure or TL;DR block, so all 3 rows read as
// warning/warning/info.
// Refreshed again (issue #8 i18n-ux-checklist) — `checks.i18nUx` added;
// this site is single-locale (no hreflang alternates, info) but does have a
// viewport meta tag (pass).
// Only ever used from `ScanResultScreen` when `location.hostname` is
// localhost/127.0.0.1 (see there) — never reachable in a deployed build.
export const mockScanResultEntry: Omit<ScanResultEntry, "scannedAt"> = {
  url: "https://dev-portfolio.withmay.com",
  raw: {
    robotsTxt: {
      status: "ok",
      has: false,
      checks: { indexing: [{ id: "sitemapDeclaredInRobots", status: "info" }] },
    },
    siteMap: {
      status: "ok",
      has: false,
      checks: { indexing: [{ id: "sitemapExists", status: "warning" }] },
    },
    crawling: {
      status: "ok",
      url: "https://dev-portfolio.withmay.com",
      finalUrl: "https://dev-portfolio.withmay.com/",
      timingMs: { firstHtml: 271, onload: 1234 },
      html: {
        first: { length: 62941, sha1: "ca2de3ea95e08fbc055b116db839a1b4eb63f8a8" },
        onload: { length: 63546, sha1: "7fdf14584a6e47107cf543600ce2cd25c60b2223" },
        deltaRatio: 0.009520662197463255,
      },
      extract: {
        title: "Shin, Yukyung",
        description: "Shin, Yukyung",
        h1: [":LOGO"],
        images: { total: 8, altMissing: 0 },
        openGraph: { "og:image": "" },
        twitter: {},
        duplicates: { metaName: [], metaProperty: [] },
      },
      checks: {
        basicSeo: [
          { id: "title.length", status: "pass", detail: 13 },
          { id: "desc.length", status: "warning", detail: 13 },
          { id: "keywords.deprecated", status: "pass" },
          { id: "img.altMissing", status: "pass", detail: 0 },
          { id: "meta.duplicate", status: "pass", detail: 0 },
        ],
        indexing: [
          { id: "canonical", status: "info" },
          { id: "canonicalMultiple", status: "pass" },
          { id: "metaRobotsNoindex", status: "pass" },
        ],
        previews: [
          { id: "ogImageDimensions", status: "warning" },
          { id: "favicon", status: "pass" },
          { id: "ogRequiredTags", status: "warning" },
          { id: "twitterCard", status: "warning" },
        ],
        aiSignals: [
          { id: "promptsTxt", status: "warning" },
          { id: "promptObject", status: "warning" },
          { id: "structuredData", status: "warning" },
          { id: "faqSection", status: "warning" },
          { id: "jsRenderDelta", status: "pass", detail: 0.009520662197463255 },
        ],
        content: [
          {
            id: "headings",
            status: "warning",
            detail: { h1: 1, h2: 0, h3: 0 },
          },
          { id: "charCount", status: "warning", detail: 42 },
          { id: "tldr", status: "info" },
        ],
        i18nUx: [
          { id: "hreflang", status: "info" },
          { id: "viewport", status: "pass" },
        ],
      },
    },
    lighthouse: {
      lighthouseVersion: "12.8.2",
      requestedUrl: "https://dev-portfolio.withmay.com/",
      categories: {
        performance: { title: "Performance", score: 0.98 },
        accessibility: { title: "Accessibility", score: 0.95 },
        "best-practices": { title: "Best Practices", score: 1 },
        seo: { title: "SEO", score: 1 },
      },
      audits: {
        "uses-responsive-images": {
          id: "uses-responsive-images",
          title: "Properly size images",
          description:
            "Serve images that are appropriately-sized to save cellular data and improve load time.",
          score: 0.75,
        },
        "unused-javascript": {
          id: "unused-javascript",
          title: "Reduce unused JavaScript",
          description:
            "Reduce unused JavaScript and defer loading scripts until they are required.",
          score: 0.5,
        },
      },
    },
  },
  combined: {
    url: "https://dev-portfolio.withmay.com",
    title: "Shin, Yukyung",
    description: "Shin, Yukyung",
    h1: [":LOGO"],
    openGraph: { "og:image": "" },
    twitter: {},
    hasSitemap: false,
    topIssues: [{ id: "desc.length", status: "warning", detail: 13 }],
    failedApis: [],
    checks: {
      basicSeo: [
        { id: "title.length", status: "pass", detail: 13 },
        { id: "desc.length", status: "warning", detail: 13 },
        { id: "keywords.deprecated", status: "pass" },
        { id: "img.altMissing", status: "pass", detail: 0 },
        { id: "meta.duplicate", status: "pass", detail: 0 },
      ],
      indexing: [
        { id: "sitemapExists", status: "warning" },
        { id: "canonical", status: "info" },
        { id: "canonicalMultiple", status: "pass" },
        { id: "metaRobotsNoindex", status: "pass" },
        { id: "sitemapDeclaredInRobots", status: "info" },
      ],
      previews: [
        { id: "ogImageDimensions", status: "warning" },
        { id: "favicon", status: "pass" },
        { id: "ogRequiredTags", status: "warning" },
        { id: "twitterCard", status: "warning" },
      ],
      aiSignals: [
        { id: "promptsTxt", status: "warning" },
        { id: "promptObject", status: "warning" },
        { id: "structuredData", status: "warning" },
        { id: "faqSection", status: "warning" },
        { id: "jsRenderDelta", status: "pass", detail: 0.009520662197463255 },
      ],
      content: [
        { id: "headings", status: "warning", detail: { h1: 1, h2: 0, h3: 0 } },
        { id: "charCount", status: "warning", detail: 42 },
        { id: "tldr", status: "info" },
      ],
      i18nUx: [
        { id: "hreflang", status: "info" },
        { id: "viewport", status: "pass" },
      ],
    },
    lighthouse: {
      scores: {
        performance: 0.98,
        seo: 1,
        accessibility: 0.95,
        bestPractices: 1,
      },
      suggestions: [
        {
          id: "unused-javascript",
          title: "Reduce unused JavaScript",
          description:
            "Reduce unused JavaScript and defer loading scripts until they are required.",
          score: 0.5,
        },
        {
          id: "uses-responsive-images",
          title: "Properly size images",
          description:
            "Serve images that are appropriately-sized to save cellular data and improve load time.",
          score: 0.75,
        },
      ],
    },
  },
};
