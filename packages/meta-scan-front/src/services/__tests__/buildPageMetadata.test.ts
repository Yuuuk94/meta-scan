import { buildPageMetadata } from "@/services/buildPageMetadata";

const siteUrl = "https://meta-scan.biz";
const seo = { title: "T", description: "D", siteName: "META_SCAN.BIZ" };

describe("buildPageMetadata (issue #64)", () => {
  it("sets title/description from the given dictionary entry", () => {
    const m = buildPageMetadata({ lang: "en", path: "/privacy", seo, siteUrl });
    expect(m.title).toBe("T");
    expect(m.description).toBe("D");
  });

  it("builds openGraph with url/locale/siteName/image", () => {
    const m = buildPageMetadata({ lang: "en", path: "/privacy", seo, siteUrl });
    expect(m.openGraph).toEqual(
      expect.objectContaining({
        title: "T",
        description: "D",
        url: `${siteUrl}/en/privacy`,
        locale: "en_US",
        siteName: "META_SCAN.BIZ",
        images: [{ url: `${siteUrl}/og.png` }],
      }),
    );
    const ko = buildPageMetadata({ lang: "ko", path: "", seo, siteUrl });
    expect(ko.openGraph).toEqual(
      expect.objectContaining({ locale: "ko_KR", url: `${siteUrl}/ko` }),
    );
  });

  it("builds twitter summary_large_image card", () => {
    const m = buildPageMetadata({ lang: "ko", path: "/terms", seo, siteUrl });
    expect(m.twitter).toEqual(
      expect.objectContaining({
        card: "summary_large_image",
        title: "T",
        description: "D",
        images: [`${siteUrl}/og.png`],
      }),
    );
  });

  it("canonical is the page's own absolute url, with ko/en/x-default alternates", () => {
    const m = buildPageMetadata({ lang: "en", path: "/terms", seo, siteUrl });
    expect(m.alternates).toEqual({
      canonical: `${siteUrl}/en/terms`,
      languages: {
        ko: `${siteUrl}/ko/terms`,
        en: `${siteUrl}/en/terms`,
        "x-default": `${siteUrl}/ko/terms`,
      },
    });
  });

  it("canonicalLang overrides the canonical (bare / -> /ko)", () => {
    const m = buildPageMetadata({
      lang: "en",
      canonicalLang: "ko",
      path: "",
      seo,
      siteUrl,
    });
    expect(m.alternates?.canonical).toBe(`${siteUrl}/ko`);
  });
});
