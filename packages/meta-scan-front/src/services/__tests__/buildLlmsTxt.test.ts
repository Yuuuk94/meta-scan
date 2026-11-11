import { buildLlmsTxt } from "@/services/buildLlmsTxt";

// issue #76 — /llms.txt used to fall through to the home page HTML.
describe("buildLlmsTxt", () => {
  const txt = buildLlmsTxt({
    siteUrl: "https://meta-scan.biz",
    posts: [
      { lang: "ko", slug: "robots-txt", title: "robots.txt 확인하는 법", description: "설명" },
    ],
  });

  it("starts with an H1 and a blockquote summary (llmstxt.org format)", () => {
    const lines = txt.split("\n");
    expect(lines[0]).toBe("# META_SCAN.BIZ");
    expect(txt).toMatch(/\n> .*SEO.*AEO.*GEO/);
  });

  it("links the tool pages and every blog post", () => {
    expect(txt).toContain("(https://meta-scan.biz/ko)");
    expect(txt).toContain("(https://meta-scan.biz/en)");
    expect(txt).toContain("(https://meta-scan.biz/ko/about)");
    expect(txt).toContain("- [robots.txt 확인하는 법](https://meta-scan.biz/ko/blog/robots-txt): 설명");
  });
});
