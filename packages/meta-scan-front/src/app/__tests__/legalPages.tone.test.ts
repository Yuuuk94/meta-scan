import { hasInformalKoreanTone } from "@/utils/koTone";
import { getContent as getPrivacyContent } from "@/app/[lang]/privacy/content";
import { getContent as getTermsContent } from "@/app/[lang]/terms/content";

const testContactEmail = "test@example.com";

// 이슈 #17 AC6 — privacy/terms 본문 전체(리드 문구 + 각 섹션 heading/body)가 합니다체다.
describe.each([
  ["privacy", getPrivacyContent(testContactEmail)],
  ["terms", getTermsContent(testContactEmail)],
])("%s/page.tsx ko content tone (issue #17 AC6)", (_name, content) => {
  it("lead is not 해라체/명령형", () => {
    expect(hasInformalKoreanTone(content.ko.lead)).toBe(false);
  });

  it("every section heading/body sentence is not 해라체/명령형", () => {
    for (const section of content.ko.sections) {
      expect(hasInformalKoreanTone(section.heading)).toBe(false);
      for (const paragraph of section.body) {
        expect(hasInformalKoreanTone(paragraph)).toBe(false);
      }
    }
  });
});
