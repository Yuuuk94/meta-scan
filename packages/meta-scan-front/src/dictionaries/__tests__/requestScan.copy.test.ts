import ko from "@/dictionaries/ko.json";
import en from "@/dictionaries/en.json";

// 이슈 #20 process-screen-copy — ProcessScreen 4단계 스텝 라벨이 실제 API 이름
// (robots.txt/sitemap.xml/crawling/Lighthouse)을 노출하지 않고 사용자 언어의
// 액션 중심 라벨이어야 한다. 순서는 rawKeys(robotsTxt/siteMap/crawling/lighthouse)에
// 1:1 대응 — 인덱스를 바꾸면 ProcessScreen의 스텝-인덱스 매핑이 깨진다.
describe("dictionaries requestScan.steps (issue #20)", () => {
  it("ko.json steps are action-oriented, no raw API names", () => {
    expect(ko.requestScan.steps).toEqual([
      "사이트 접근성 확인",
      "구조 정보 수집",
      "콘텐츠 및 AI 신호 분석",
      "성능 및 품질 진단",
    ]);
  });

  it("en.json steps are action-oriented, no raw API names", () => {
    en.requestScan.steps.forEach((label) => {
      expect(label.toLowerCase()).not.toMatch(
        /robots\.txt|sitemap\.xml|lighthouse/
      );
    });
    expect(en.requestScan.steps).toHaveLength(4);
  });

  it("no step label in either locale leaks a raw API name", () => {
    const rawApiNamePattern = /robots\.txt|sitemap\.xml|lighthouse/i;
    [...ko.requestScan.steps, ...en.requestScan.steps].forEach((label) => {
      expect(label).not.toMatch(rawApiNamePattern);
    });
  });
});

// 캡션(stepsHint)은 대체 문구 없이 완전히 제거 — 키 자체가 존재하면 안 된다
// (빈 문자열로 남기지 않음).
describe("dictionaries requestScan.stepsHint removal (issue #20)", () => {
  it("ko.json requestScan has no stepsHint key", () => {
    expect(
      Object.prototype.hasOwnProperty.call(ko.requestScan, "stepsHint")
    ).toBe(false);
  });

  it("en.json requestScan has no stepsHint key", () => {
    expect(
      Object.prototype.hasOwnProperty.call(en.requestScan, "stepsHint")
    ).toBe(false);
  });
});
