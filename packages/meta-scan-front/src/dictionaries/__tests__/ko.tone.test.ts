import ko from "@/dictionaries/ko.json";
import en from "@/dictionaries/en.json";
import { hasInformalKoreanTone } from "@/utils/koTone";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const collectStrings = (node: JsonValue, path: string, acc: [string, string][]): void => {
  if (typeof node === "string") {
    acc.push([path, node]);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((value, index) => collectStrings(value, `${path}[${index}]`, acc));
    return;
  }
  if (node && typeof node === "object") {
    Object.entries(node).forEach(([key, value]) =>
      collectStrings(value, path ? `${path}.${key}` : key, acc)
    );
  }
};

const koEntries: [string, string][] = [];
collectStrings(ko as unknown as JsonValue, "", koEntries);

// 이슈 #17 — 회귀 방지: ko.json의 모든 문자열 값이 해라체 평서형(-다/이다/아니다)이나
// 순수 명령형(-하라/-보라)으로 끝나지 않는지 검사한다. 이후 누군가 해라체 문자열을 다시
// 추가하면 이 테스트가 실패해야 한다.
describe("dictionaries/ko.json copy tone", () => {
  it.each(koEntries)('%s ("%s") is not 해라체/명령형', (path, value) => {
    expect(hasInformalKoreanTone(value)).toBe(false);
  });

  it("covers every string value in ko.json (sanity check on the walker itself)", () => {
    expect(koEntries.length).toBeGreaterThan(50);
  });
});

describe("dictionaries/ko.json specific tone replacements (issue #17 AC2-AC4)", () => {
  it("errorTitle is a polite failure + retry message", () => {
    expect(ko.main.errorTitle).toBe("분석에 실패했습니다. URL을 확인해 주세요.");
  });

  it("faqCtaText ends with a polite invitation", () => {
    expect(ko.main.faqCtaText).toMatch(/점검해\s*보세요\.?$/);
  });

  it("scan.* judgement messages use 합니다체 (content/판정 unchanged, tone only)", () => {
    expect(ko.scan.basicSeoTitleMissing).toBe("title 태그가 없습니다");
    expect(ko.scan.indexingSitemapExistsWarning).toBe("sitemap.xml을 찾을 수 없습니다");
  });
});

// AC7 — 영어 카피(en.json)는 스코프 밖, 이번 이슈로 내용이 전혀 바뀌지 않아야 한다.
describe("dictionaries/en.json regression (out of scope for issue #17)", () => {
  it("main.errorTitle stays in English, untouched", () => {
    expect(en.main.errorTitle).toBe("Analysis failed. Please check your URL.");
  });

  it("main.faqCtaText stays in English, untouched", () => {
    expect(en.main.faqCtaText).toBe(
      "Still have questions? Run the SEO/AEO/GEO checklist on your site."
    );
  });
});
