import { siteUrl } from "@/constans";
import { generateMetadata as home } from "@/app/[lang]/page";
import { generateMetadata as requestScan } from "@/app/[lang]/request-scan/page";
import { generateMetadata as scan } from "@/app/[lang]/scan/page";
import { generateMetadata as privacy } from "@/app/[lang]/privacy/page";
import { generateMetadata as terms } from "@/app/[lang]/terms/page";
import en from "@/dictionaries/en.json";
import ko from "@/dictionaries/ko.json";

jest.mock("server-only", () => ({}));
jest.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
  headers: async () => ({ get: () => null }),
}));

const params = (lang: string) => ({ params: Promise.resolve({ lang }) });

const pages = [
  ["home", home, "seoHome", ""],
  ["request-scan", requestScan, "seoRequestScan", "/request-scan"],
  ["scan", scan, "seoScan", "/scan"],
  ["privacy", privacy, "seoPrivacy", "/privacy"],
  ["terms", terms, "seoTerms", "/terms"],
] as const;

describe("per-page locale metadata (issue #64)", () => {
  describe.each([["en", en], ["ko", ko]] as const)("%s", (lang, dict) => {
    it.each(pages)("%s has dictionary-sourced title/desc + canonical", async (_n, gen, key, path) => {
      const entry = (dict.seo as unknown as Record<string, { title: string; description: string }>)[key];
      const m = await gen(params(lang));
      expect(m.title).toBe(entry.title);
      expect(m.description).toBe(entry.description);
      expect(m.alternates?.canonical).toBe(`${siteUrl}/${lang}${path}`);
      expect(m.openGraph).toEqual(expect.objectContaining({ title: entry.title }));
      expect(m.twitter).toEqual(expect.objectContaining({ card: "summary_large_image" }));
    });
  });

  it("titles are unique per page within a locale", () => {
    const titles = pages.map(([, , key]) => (en.seo as unknown as Record<string, { title: string }>)[key].title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("home description mentions AI Signals/AEO/GEO and is 120-160 chars", () => {
    for (const d of [en, ko]) {
      const desc = d.seo.seoHome.description;
      expect(desc).toMatch(/AEO/);
      expect(desc).toMatch(/GEO/);
      expect(desc).toMatch(/AI/);
      expect(desc.length).toBeGreaterThanOrEqual(120);
      expect(desc.length).toBeLessThanOrEqual(160);
    }
  });
});
