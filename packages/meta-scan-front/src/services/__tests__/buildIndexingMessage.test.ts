import { buildIndexingMessage } from "@/services/buildIndexingMessage";

// Only the keys buildIndexingMessage actually reads — mirrors
// buildBasicSeoMessage.test.ts's `t` slice convention.
const t = {
  indexingSitemapExistsPass: "sitemap.xml이 확인된다",
  indexingSitemapExistsWarning: "sitemap.xml을 찾을 수 없다",
  indexingSitemapDeclaredPass: "robots.txt에 sitemap이 선언되어 있다",
  indexingSitemapDeclaredInfo: "robots.txt에 sitemap이 선언되어 있지 않다",
  indexingCanonicalPass: "canonical 태그가 정상적으로 설정되어 있다",
  indexingCanonicalInfo: "canonical 태그가 없거나 상대경로다",
  indexingCanonicalMultiplePass: "canonical 태그가 하나만 있다",
  indexingCanonicalMultipleFail: "canonical 태그가 여러 개 있다",
  indexingMetaRobotsNoindexPass: "noindex 지시어가 없다",
  indexingMetaRobotsNoindexFail: "noindex 지시어가 있어 색인에서 제외된다",
};

describe("buildIndexingMessage", () => {
  it("picks the pass-state template for sitemapExists", () => {
    expect(
      buildIndexingMessage(t, { id: "sitemapExists", status: "pass" })
    ).toBe("sitemap.xml이 확인된다");
  });

  it("picks the warning-state template for sitemapExists", () => {
    expect(
      buildIndexingMessage(t, { id: "sitemapExists", status: "warning" })
    ).toBe("sitemap.xml을 찾을 수 없다");
  });

  it("picks the pass-state template for sitemapDeclaredInRobots", () => {
    expect(
      buildIndexingMessage(t, { id: "sitemapDeclaredInRobots", status: "pass" })
    ).toBe("robots.txt에 sitemap이 선언되어 있다");
  });

  it("picks the info-state template for sitemapDeclaredInRobots", () => {
    expect(
      buildIndexingMessage(t, { id: "sitemapDeclaredInRobots", status: "info" })
    ).toBe("robots.txt에 sitemap이 선언되어 있지 않다");
  });

  it("picks the pass-state template for canonical", () => {
    expect(buildIndexingMessage(t, { id: "canonical", status: "pass" })).toBe(
      "canonical 태그가 정상적으로 설정되어 있다"
    );
  });

  it("picks the info-state template for canonical", () => {
    expect(buildIndexingMessage(t, { id: "canonical", status: "info" })).toBe(
      "canonical 태그가 없거나 상대경로다"
    );
  });

  it("picks the pass-state template for canonicalMultiple", () => {
    expect(
      buildIndexingMessage(t, { id: "canonicalMultiple", status: "pass" })
    ).toBe("canonical 태그가 하나만 있다");
  });

  it("picks the fail-state template for canonicalMultiple", () => {
    expect(
      buildIndexingMessage(t, { id: "canonicalMultiple", status: "fail" })
    ).toBe("canonical 태그가 여러 개 있다");
  });

  it("picks the pass-state template for metaRobotsNoindex", () => {
    expect(
      buildIndexingMessage(t, { id: "metaRobotsNoindex", status: "pass" })
    ).toBe("noindex 지시어가 없다");
  });

  it("picks the fail-state template for metaRobotsNoindex", () => {
    expect(
      buildIndexingMessage(t, { id: "metaRobotsNoindex", status: "fail" })
    ).toBe("noindex 지시어가 있어 색인에서 제외된다");
  });

  it("falls back to the raw id when no template key matches (unknown id/status combo)", () => {
    expect(
      buildIndexingMessage(t, { id: "totally.unknown", status: "info" })
    ).toBe("totally.unknown");
  });
});
