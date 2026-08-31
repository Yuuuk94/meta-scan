import sitemap from "@/app/sitemap";
import { siteUrl } from "@/constans";

// meta-scan's own sitemap.xml (issue #10) — distinct from the scan-target
// robots/sitemap checker in the checklist category. Locale-prefixed URLs
// per spec-fixed.md decision log #1 (index each language page separately),
// and /scan/:id (personalized result page) intentionally excluded.
describe("sitemap", () => {
  it("includes ko and en variants of every static route", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        `${siteUrl}/ko`,
        `${siteUrl}/ko/request-scan`,
        `${siteUrl}/ko/scan`,
        `${siteUrl}/ko/privacy`,
        `${siteUrl}/ko/terms`,
        `${siteUrl}/en`,
        `${siteUrl}/en/request-scan`,
        `${siteUrl}/en/scan`,
        `${siteUrl}/en/privacy`,
        `${siteUrl}/en/terms`,
      ])
    );
  });

  it("does not include the personalized /scan/:id result route", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls.some((url) => /\/scan\/[^/]+$/.test(url))).toBe(false);
  });

  it("emits exactly 10 entries (5 routes x 2 locales)", () => {
    expect(sitemap()).toHaveLength(10);
  });
});
