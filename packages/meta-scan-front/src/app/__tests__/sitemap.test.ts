import sitemap from "@/app/sitemap";
import { siteUrl } from "@/constans";
import { getPosts } from "@/services/blogPosts";

// meta-scan's own sitemap.xml (issue #10). Issue #76: thin tool screens
// (/scan, /request-scan) are dropped — AdSense flagged low-value content —
// and the blog/about pages are added.
describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("includes ko and en content routes", () => {
    expect(urls).toEqual(
      expect.arrayContaining([
        `${siteUrl}/ko`,
        `${siteUrl}/ko/about`,
        `${siteUrl}/ko/blog`,
        `${siteUrl}/ko/privacy`,
        `${siteUrl}/ko/terms`,
        `${siteUrl}/en`,
        `${siteUrl}/en/about`,
        `${siteUrl}/en/privacy`,
        `${siteUrl}/en/terms`,
      ]),
    );
  });

  it("includes every Korean blog post with lastModified", () => {
    for (const p of getPosts("ko")) {
      const entry = sitemap().find((e) => e.url === `${siteUrl}/ko/blog/${p.slug}`);
      expect(entry?.lastModified).toBe(p.updatedAt ?? p.publishedAt);
    }
  });

  it("drops thin tool screens and personalized results", () => {
    expect(urls.some((u) => /\/(scan|request-scan)(\/|$)/.test(u))).toBe(false);
  });
});
