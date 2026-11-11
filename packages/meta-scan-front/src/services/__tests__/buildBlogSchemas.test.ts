import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
} from "@/services/buildBlogSchemas";

const siteUrl = "https://meta-scan.biz";
const post = {
  slug: "robots-txt",
  lang: "ko" as Language,
  title: "robots.txt 확인하는 법",
  description: "설명",
  publishedAt: "2026-11-11",
  updatedAt: "2026-11-12",
};
const author = { name: "Yuuuk94", url: `${siteUrl}/ko/about` };

describe("buildBlogSchemas (issue #76)", () => {
  it("builds an Article with author Person, dates and language", () => {
    const s = buildArticleSchema({ post, siteUrl, author, siteName: "META_SCAN.BIZ" });
    expect(s).toEqual(
      expect.objectContaining({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: "2026-11-11",
        dateModified: "2026-11-12",
        inLanguage: "ko",
        mainEntityOfPage: `${siteUrl}/ko/blog/robots-txt`,
        author: { "@type": "Person", name: "Yuuuk94", url: author.url },
        publisher: expect.objectContaining({ "@type": "Organization", name: "META_SCAN.BIZ" }),
      }),
    );
  });

  it("falls back to datePublished when there is no update", () => {
    const s = buildArticleSchema({
      post: { ...post, updatedAt: undefined },
      siteUrl,
      author,
      siteName: "META_SCAN.BIZ",
    });
    expect(s.dateModified).toBe("2026-11-11");
  });

  it("builds a positioned BreadcrumbList", () => {
    const s = buildBreadcrumbSchema([
      { name: "홈", url: `${siteUrl}/ko` },
      { name: "블로그", url: `${siteUrl}/ko/blog` },
    ]);
    expect(s["@type"]).toBe("BreadcrumbList");
    expect(s.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "블로그",
      item: `${siteUrl}/ko/blog`,
    });
  });

  it("builds a FAQPage from q/a pairs", () => {
    const s = buildFaqPageSchema([{ q: "Q1", a: "A1" }]);
    expect(s.mainEntity).toEqual([
      { "@type": "Question", name: "Q1", acceptedAnswer: { "@type": "Answer", text: "A1" } },
    ]);
  });
});
