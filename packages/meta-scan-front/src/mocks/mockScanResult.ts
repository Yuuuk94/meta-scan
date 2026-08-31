// Dev-only fixture so `/scan/:id` has something to render without running a
// full scan first — real captured response (robotsTxt/siteMap/crawling/
// lighthouse, lighthouse trimmed to just category scores) from
// https://dev-portfolio.withmay.com via the local API, then combined with
// the actual `combineScanResults` so it matches production shape exactly.
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
      timingMs: { firstHtml: 84, onload: 1201 },
      html: {
        first: { length: 62941, sha1: "ca2de3ea95e08fbc055b116db839a1b4eb63f8a8" },
        onload: { length: 63546, sha1: "02b7d2c08ba77a5cf9f4d148f30df3f75e7b68d7" },
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
    },
  },
};
