import { buildPageMetadata } from "@/services/buildPageMetadata";

const siteUrl = "https://meta-scan.biz";
const seo = { title: "T", description: "D", siteName: "META_SCAN.BIZ" };

describe("buildPageMetadata options (issue #76)", () => {
  it("limits hreflang alternates to the given languages", () => {
    const m = buildPageMetadata({ lang: "ko", path: "/blog/x", seo, siteUrl, languages: ["ko"] });
    expect(m.alternates?.languages).toEqual({
      ko: `${siteUrl}/ko/blog/x`,
      "x-default": `${siteUrl}/ko/blog/x`,
    });
  });

  it("marks noindex pages", () => {
    const m = buildPageMetadata({ lang: "ko", path: "/scan", seo, siteUrl, noindex: true });
    expect(m.robots).toEqual({ index: false, follow: true });
  });

  it("uses article og type when asked", () => {
    const m = buildPageMetadata({ lang: "ko", path: "/blog/x", seo, siteUrl, ogType: "article" });
    expect(m.openGraph).toEqual(expect.objectContaining({ type: "article" }));
  });
});
