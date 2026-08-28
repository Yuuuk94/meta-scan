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
  checks: [
    { id: "h1.multiple", level: "info", message: "info issue" },
    { id: "img.alt_missing", level: "warn", message: "alt missing" },
    { id: "title.missing", level: "error", message: "no title" },
  ],
};

const robotsTxt: RobotsTxtData = { status: "ok", has: true, url: "https://example.com" };
const siteMap: SiteMapData = { status: "ok", has: true, url: "https://example.com" };

describe("combineScanResults", () => {
  it("merges already-judged fields from the 4 raw responses without recomputing them", () => {
    const combined = combineScanResults({
      robotsTxt,
      siteMap,
      crawling,
      lighthouse: { fake: "lhr" },
    });

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
    const combined = combineScanResults({
      robotsTxt,
      siteMap: null,
      crawling: null,
      lighthouse: null,
    });

    expect(combined.failedApis).toEqual(
      expect.arrayContaining(["siteMap", "crawling", "lighthouse"])
    );
    expect(combined.failedApis).not.toContain("robotsTxt");
  });

  it("builds topIssues fail-first, backfilled with warning, capped at 3 by default", () => {
    const manyIssues: CrawlingScanData = {
      ...crawling,
      checks: [
        { id: "warn1", level: "warn", message: "w1" },
        { id: "fail1", level: "error", message: "f1" },
        { id: "warn2", level: "warn", message: "w2" },
        { id: "fail2", level: "error", message: "f2" },
        { id: "info1", level: "info", message: "i1" },
      ],
    };

    const combined = combineScanResults({
      robotsTxt,
      siteMap,
      crawling: manyIssues,
      lighthouse: {},
    });

    expect(combined.topIssues).toHaveLength(3);
    expect(combined.topIssues[0].status).toBe("fail");
    expect(combined.topIssues[1].status).toBe("fail");
    expect(combined.topIssues.map((i) => i.id)).not.toContain("info1");
  });

  it("returns an empty topIssues list when there is no fail/warning (positive-state case)", () => {
    const clean: CrawlingScanData = {
      ...crawling,
      checks: [{ id: "info1", level: "info", message: "i1" }],
    };

    const combined = combineScanResults({
      robotsTxt,
      siteMap,
      crawling: clean,
      lighthouse: {},
    });

    expect(combined.topIssues).toEqual([]);
  });
});
