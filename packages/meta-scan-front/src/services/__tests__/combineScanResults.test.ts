import { combineScanResults } from "@/services/combineScanResults";

const crawling: CrawlingScanData = {
  status: "ok",
  url: "https://example.com",
  finalUrl: "https://example.com",
  timingMs: { firstHtml: 10, onload: 20 },
  html: {
    first: { length: 100, sha1: "a" },
    onload: { length: 120, sha1: "b" },
    deltaRatio: 0.12,
  },
  extract: {
    title: "Example Domain",
    description: "An example page",
    canonical: "https://example.com",
    h1: ["Example Domain"],
    images: { total: 0, altMissing: 0 },
    openGraph: { "og:title": "Example Domain" },
    twitter: { "twitter:card": "summary" },
    duplicates: { metaName: [], metaProperty: [] },
  },
  checks: {
    basicSeo: [
      { id: "title.length", status: "pass", detail: 14 },
      { id: "desc.length", status: "pass", detail: 16 },
      { id: "keywords.deprecated", status: "info" },
      { id: "img.altMissing", status: "warning", detail: 2 },
      { id: "meta.duplicate", status: "pass", detail: 0 },
    ],
    indexing: [
      { id: "canonical", status: "pass" },
      { id: "canonicalMultiple", status: "pass" },
      { id: "metaRobotsNoindex", status: "pass" },
    ],
    previews: [
      { id: "ogImageDimensions", status: "pass" },
      { id: "favicon", status: "warning" },
      { id: "ogRequiredTags", status: "pass" },
      { id: "twitterCard", status: "warning" },
    ],
    aiSignals: [
      { id: "promptsTxt", status: "pass", detail: 128 },
      { id: "promptObject", status: "info" },
      { id: "structuredData", status: "pass" },
      { id: "faqSection", status: "info" },
      { id: "jsRenderDelta", status: "pass", detail: 0.05 },
    ],
  },
};

const robotsTxt: RobotsTxtData = {
  status: "ok",
  has: true,
  url: "https://example.com",
  checks: { indexing: [{ id: "sitemapDeclaredInRobots", status: "pass" }] },
};
const siteMap: SiteMapData = {
  status: "ok",
  has: true,
  url: "https://example.com",
  checks: { indexing: [{ id: "sitemapExists", status: "pass" }] },
};

describe("combineScanResults", () => {
  it("merges already-judged fields from the 4 raw responses without recomputing them", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling,
      lighthouse: { fake: "lhr" },
    });

    expect(combined.url).toBe("https://example.com");
    expect(combined.title).toBe("Example Domain");
    expect(combined.description).toBe("An example page");
    expect(combined.canonical).toBe("https://example.com");
    expect(combined.h1).toEqual(["Example Domain"]);
    expect(combined.openGraph).toEqual({ "og:title": "Example Domain" });
    expect(combined.twitter).toEqual({ "twitter:card": "summary" });
    expect(combined.hasSitemap).toBe(true);
    expect(combined.failedApis).toEqual([]);
  });

  it("marks null raw responses as failed APIs", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap: null,
      crawling: null,
      lighthouse: null,
    });

    expect(combined.failedApis).toEqual(
      expect.arrayContaining(["siteMap", "crawling", "lighthouse"])
    );
    expect(combined.failedApis).not.toContain("robotsTxt");
    // Must stay the scanned page's URL even when crawling failed — not
    // silently fall back to robotsTxt/siteMap's own fetch URLs.
    expect(combined.url).toBe("https://example.com");
  });

  it("passes checks.basicSeo through from the crawling response as-is", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling,
      lighthouse: {},
    });

    expect(combined.checks.basicSeo).toEqual(crawling.checks.basicSeo);
  });

  it("passes checks.previews through from the crawling response as-is (issue #5)", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling,
      lighthouse: {},
    });

    expect(combined.checks.previews).toEqual(crawling.checks.previews);
  });

  it("defaults checks.previews to an empty array when crawling failed", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling: null,
      lighthouse: {},
    });

    expect(combined.checks.previews).toEqual([]);
  });

  it("passes checks.aiSignals through from the crawling response as-is (issue #6)", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling,
      lighthouse: {},
    });

    expect(combined.checks.aiSignals).toEqual(crawling.checks.aiSignals);
  });

  it("defaults checks.aiSignals to an empty array when crawling failed", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling: null,
      lighthouse: {},
    });

    expect(combined.checks.aiSignals).toEqual([]);
  });

  it("defaults checks.basicSeo to an empty array when crawling failed", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling: null,
      lighthouse: {},
    });

    expect(combined.checks.basicSeo).toEqual([]);
  });

  it("merges checks.indexing from siteMap/crawling/robotsTxt into one array (issue #4)", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling,
      lighthouse: {},
    });

    expect(combined.checks.indexing).toEqual([
      { id: "sitemapExists", status: "pass" },
      { id: "canonical", status: "pass" },
      { id: "canonicalMultiple", status: "pass" },
      { id: "metaRobotsNoindex", status: "pass" },
      { id: "sitemapDeclaredInRobots", status: "pass" },
    ]);
  });

  it("defaults checks.indexing to an empty array when siteMap/robotsTxt/crawling all failed", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt: null,
      siteMap: null,
      crawling: null,
      lighthouse: {},
    });

    expect(combined.checks.indexing).toEqual([]);
  });

  it("still merges the indexing rows that did come back when only some of the 3 sources failed", () => {
    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap: null,
      crawling,
      lighthouse: {},
    });

    expect(combined.checks.indexing).toEqual([
      { id: "canonical", status: "pass" },
      { id: "canonicalMultiple", status: "pass" },
      { id: "metaRobotsNoindex", status: "pass" },
      { id: "sitemapDeclaredInRobots", status: "pass" },
    ]);
  });

  it("builds topIssues fail-first, backfilled with warning, capped at 3 by default", () => {
    const manyIssues: CrawlingScanData = {
      ...crawling,
      checks: {
        basicSeo: [
          { id: "img.altMissing", status: "warning", detail: 2 },
          { id: "title.missing", status: "fail" },
          { id: "desc.length", status: "warning", detail: 9 },
          { id: "desc.missing", status: "fail" },
          { id: "keywords.deprecated", status: "info" },
        ],
        indexing: [],
        previews: [],
        aiSignals: [],
      },
    };

    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling: manyIssues,
      lighthouse: {},
    });

    expect(combined.topIssues).toHaveLength(3);
    expect(combined.topIssues[0].status).toBe("fail");
    expect(combined.topIssues[1].status).toBe("fail");
    expect(combined.topIssues.map((i) => i.id)).not.toContain(
      "keywords.deprecated"
    );
  });

  it("returns an empty topIssues list when there is no fail/warning basicSeo item (positive-state case)", () => {
    const clean: CrawlingScanData = {
      ...crawling,
      checks: {
        basicSeo: [
          { id: "title.length", status: "pass", detail: 14 },
          { id: "keywords.deprecated", status: "info" },
        ],
        indexing: [],
        previews: [],
        aiSignals: [],
      },
    };

    const combined = combineScanResults("https://example.com", {
      robotsTxt,
      siteMap,
      crawling: clean,
      lighthouse: {},
    });

    expect(combined.topIssues).toEqual([]);
  });
});
