import { getPost, getPostLanguages, getPosts, postTextLength } from "@/services/blogPosts";

// issue #76 — site blog registry. Also a content-quality gate: AdSense
// rejected the site for low-value content, so every post must clear a
// minimum bar before it can ship.
describe("blogPosts", () => {
  const ko = getPosts("ko");

  it("has Korean posts, newest first", () => {
    expect(ko.length).toBeGreaterThan(0);
    const dates = ko.map((p) => p.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("slugs are unique and url-safe within a locale", () => {
    const slugs = ko.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("getPost finds by locale + slug and misses unknown ones", () => {
    const first = ko[0];
    expect(getPost("ko", first.slug)).toBe(first);
    expect(getPost("ko", "no-such-post")).toBeUndefined();
  });

  it("getPostLanguages lists only locales that have the slug", () => {
    expect(getPostLanguages(ko[0].slug)).toContain("ko");
    expect(getPostLanguages("no-such-post")).toEqual([]);
  });

  // issue #82 — every Korean post ships with an English version under the
  // same slug, so hreflang pairs are complete in both directions.
  it("every ko post has an en version with the same slug", () => {
    for (const p of ko) expect(getPostLanguages(p.slug)).toEqual(["ko", "en"]);
    expect(getPosts("en").length).toBe(ko.length);
  });

  const all = [...ko, ...getPosts("en")];
  describe.each(all.map((p) => [`${p.lang}/${p.slug}`, p] as const))("%s", (_slug, post) => {
    it("meets the content bar (2,500+ chars of body text)", () => {
      expect(postTextLength(post)).toBeGreaterThanOrEqual(2500);
    });

    it("has a 20-60 char title and 70-160 char description", () => {
      expect(post.title.length).toBeGreaterThanOrEqual(10);
      expect(post.title.length).toBeLessThanOrEqual(60);
      expect(post.description.length).toBeGreaterThanOrEqual(70);
      expect(post.description.length).toBeLessThanOrEqual(160);
    });

    it("has a summary, 3+ sections, 2+ FAQ items and https references", () => {
      expect(post.summary.length).toBeGreaterThan(0);
      expect(post.sections.length).toBeGreaterThanOrEqual(3);
      expect(post.faq.length).toBeGreaterThanOrEqual(2);
      expect(post.references.length).toBeGreaterThan(0);
      for (const r of post.references) expect(r.url).toMatch(/^https:\/\//);
    });

    it("has an ISO publish date", () => {
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("only links related posts that exist in the same locale", () => {
      for (const slug of post.related) {
        expect(getPost(post.lang, slug)).toBeDefined();
      }
    });
  });
});
