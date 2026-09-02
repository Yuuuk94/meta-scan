import { hasInformalKoreanTone } from "@/utils/koTone";

// docs/design/design-system.md "한국어 카피 톤" 규칙: 평서형은 -습니다/-입니다(그리고
// -합니다/-됩니다 같은 동일 계열 합쇼체 어미), 권유·안내는 -해 주세요. 해라체 평서형
// (-다/-이다/-아니다)이나 순수 명령형(-하라/-보라)은 전부 금지 — 이슈 #17.
describe("hasInformalKoreanTone", () => {
  it.each([
    ["페이지를 찾을 수 없다", true],
    ["요청하신 페이지가 존재하지 않거나 이동되었다", true],
    ["유효한 URL을 입력하라", true],
    ["분석에 실패했다. URL을 확인하라.", true],
    ["아니다. 현재 스캔 결과는 저장되지 않는다", true],
    ["canonical 태그가 없거나 상대경로다", true],
    ["제목 길이가 적절하다 ({count}자)", true],
  ])("flags 해라체/명령형 종결: %s", (value, expected) => {
    expect(hasInformalKoreanTone(value)).toBe(expected);
  });

  it.each([
    ["페이지를 찾을 수 없습니다", false],
    ["요청하신 페이지가 존재하지 않거나 이동되었습니다", false],
    ["유효한 URL을 입력해 주세요", false],
    ["분석에 실패했습니다. URL을 확인해 주세요.", false],
    ["아닙니다. 현재 스캔 결과는 저장되지 않습니다", false],
    ["canonical 태그가 없거나 상대경로입니다", false],
    ["제목 길이가 적절합니다 ({count}자)", false],
    ["여전히 궁금한 점이 있다면 사이트를 직접 점검해 보세요.", false],
    ["Meta-Scan", false],
    ["© 2026 Meta-Scan. All rights reserved.", false],
  ])("accepts 합니다체/권유형 종결: %s", (value, expected) => {
    expect(hasInformalKoreanTone(value)).toBe(expected);
  });
});
