import { buildAiSignalsMessage } from "@/services/buildAiSignalsMessage";

const t = {
  aiSignalsPromptsTxtPass: "prompts.txt가 확인된다 ({count}바이트)",
  aiSignalsPromptsTxtInfo: "prompts.txt가 있지만 내용이 거의 없다 ({count}바이트)",
  aiSignalsPromptsTxtWarning: "prompts.txt가 없다",
  aiSignalsPromptObjectPass: "PromptObject 구조화 데이터가 확인된다",
  aiSignalsPromptObjectWarning: "PromptObject 구조화 데이터가 없다",
  aiSignalsStructuredDataPass: "구조화 데이터(JSON-LD)가 확인된다",
  aiSignalsStructuredDataWarning: "구조화 데이터가 없다",
  aiSignalsFaqSectionPass: "FAQPage 구조화 데이터가 확인된다",
  aiSignalsFaqSectionWarning: "FAQPage 구조화 데이터가 없다",
  aiSignalsJsRenderDeltaPass: "JS 렌더링 전후 차이가 적다 ({count}%)",
  aiSignalsJsRenderDeltaWarning: "JS 렌더링 전후 차이가 크다 ({count}%)",
  aiSignalsJsRenderDeltaFail: "JS 렌더링 의존도가 매우 높다 ({count}%)",
};

describe("buildAiSignalsMessage", () => {
  it("assembles a promptsTxt:pass sentence with the byte count", () => {
    expect(
      buildAiSignalsMessage(t, { id: "promptsTxt", status: "pass", detail: 128 })
    ).toBe("prompts.txt가 확인된다 (128바이트)");
  });

  it("assembles a promptsTxt:info sentence with the byte count when content is next to empty", () => {
    expect(
      buildAiSignalsMessage(t, { id: "promptsTxt", status: "info", detail: 8 })
    ).toBe("prompts.txt가 있지만 내용이 거의 없다 (8바이트)");
  });

  it("assembles a promptsTxt:warning sentence with no interpolation when it doesn't exist", () => {
    expect(
      buildAiSignalsMessage(t, { id: "promptsTxt", status: "warning" })
    ).toBe("prompts.txt가 없다");
  });

  it("assembles a promptObject:pass / :warning sentence", () => {
    expect(
      buildAiSignalsMessage(t, { id: "promptObject", status: "pass" })
    ).toBe("PromptObject 구조화 데이터가 확인된다");
    expect(
      buildAiSignalsMessage(t, { id: "promptObject", status: "warning" })
    ).toBe("PromptObject 구조화 데이터가 없다");
  });

  it("assembles a structuredData:pass / :warning sentence", () => {
    expect(
      buildAiSignalsMessage(t, { id: "structuredData", status: "pass" })
    ).toBe("구조화 데이터(JSON-LD)가 확인된다");
    expect(
      buildAiSignalsMessage(t, { id: "structuredData", status: "warning" })
    ).toBe("구조화 데이터가 없다");
  });

  it("assembles a faqSection:pass / :warning sentence", () => {
    expect(
      buildAiSignalsMessage(t, { id: "faqSection", status: "pass" })
    ).toBe("FAQPage 구조화 데이터가 확인된다");
    expect(
      buildAiSignalsMessage(t, { id: "faqSection", status: "warning" })
    ).toBe("FAQPage 구조화 데이터가 없다");
  });

  it("formats jsRenderDelta's raw ratio detail as a rounded percentage", () => {
    expect(
      buildAiSignalsMessage(t, { id: "jsRenderDelta", status: "pass", detail: 0.05 })
    ).toBe("JS 렌더링 전후 차이가 적다 (5%)");
    expect(
      buildAiSignalsMessage(t, { id: "jsRenderDelta", status: "warning", detail: 0.3 })
    ).toBe("JS 렌더링 전후 차이가 크다 (30%)");
    expect(
      buildAiSignalsMessage(t, { id: "jsRenderDelta", status: "fail", detail: 0.6 })
    ).toBe("JS 렌더링 의존도가 매우 높다 (60%)");
  });

  it("keeps the sign when jsRenderDelta's raw ratio is negative", () => {
    expect(
      buildAiSignalsMessage(t, { id: "jsRenderDelta", status: "fail", detail: -0.5 })
    ).toBe("JS 렌더링 의존도가 매우 높다 (-50%)");
  });

  it("falls back to the raw id for an unknown id/status combo instead of throwing", () => {
    expect(
      buildAiSignalsMessage(t, { id: "unknownCheck", status: "pass" })
    ).toBe("unknownCheck");
  });
});
