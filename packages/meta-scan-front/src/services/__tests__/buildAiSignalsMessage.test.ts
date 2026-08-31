import { buildAiSignalsMessage } from "@/services/buildAiSignalsMessage";

const t = {
  aiSignalsPromptsTxtPass: "prompts.txt가 확인된다 ({count}바이트)",
  aiSignalsPromptsTxtInfo: "prompts.txt가 없다",
  aiSignalsPromptObjectPass: "PromptObject 구조화 데이터가 확인된다",
  aiSignalsPromptObjectInfo: "PromptObject 구조화 데이터가 없다",
  aiSignalsStructuredDataPass: "구조화 데이터(JSON-LD)가 확인된다",
  aiSignalsStructuredDataInfo: "구조화 데이터가 없다",
  aiSignalsFaqSectionPass: "FAQPage 구조화 데이터가 확인된다",
  aiSignalsFaqSectionInfo: "FAQPage 구조화 데이터가 없다",
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

  it("assembles a promptsTxt:info sentence with no interpolation", () => {
    expect(
      buildAiSignalsMessage(t, { id: "promptsTxt", status: "info" })
    ).toBe("prompts.txt가 없다");
  });

  it("assembles a promptObject:pass / :info sentence", () => {
    expect(
      buildAiSignalsMessage(t, { id: "promptObject", status: "pass" })
    ).toBe("PromptObject 구조화 데이터가 확인된다");
    expect(
      buildAiSignalsMessage(t, { id: "promptObject", status: "info" })
    ).toBe("PromptObject 구조화 데이터가 없다");
  });

  it("assembles a structuredData:pass / :info sentence", () => {
    expect(
      buildAiSignalsMessage(t, { id: "structuredData", status: "pass" })
    ).toBe("구조화 데이터(JSON-LD)가 확인된다");
    expect(
      buildAiSignalsMessage(t, { id: "structuredData", status: "info" })
    ).toBe("구조화 데이터가 없다");
  });

  it("assembles a faqSection:pass / :info sentence", () => {
    expect(
      buildAiSignalsMessage(t, { id: "faqSection", status: "pass" })
    ).toBe("FAQPage 구조화 데이터가 확인된다");
    expect(
      buildAiSignalsMessage(t, { id: "faqSection", status: "info" })
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
