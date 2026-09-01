import robots from "@/app/robots";
import { siteUrl } from "@/constans";

// meta-scan's own robots.txt (issue #10) — allows crawling and points to
// the sitemap above.
describe("robots", () => {
  it("allows all user agents to crawl the whole site", () => {
    const result = robots();

    expect(result.rules).toEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" })
    );
  });

  it("declares the sitemap location", () => {
    const result = robots();

    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});
