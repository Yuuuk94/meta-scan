import {
  getAiSignalsDetailSuffix,
  getAiSignalsLabel,
} from "@/services/buildAiSignalsMessage";

const t = {
  aiSignalsPromptsTxtLabel: "prompts.txt",
  aiSignalsPromptObjectLabel: "PromptObject",
  aiSignalsStructuredDataLabel: "구조화 데이터",
  aiSignalsFaqSectionLabel: "FAQ 섹션",
  aiSignalsJsRenderDeltaLabel: "JS 렌더링 의존도",
  aiSignalsPromptsTxtPassSuffix: "{count}바이트",
  aiSignalsPromptsTxtInfoSuffix: "내용 부족",
  aiSignalsPromptsTxtWarningSuffix: "없음",
  aiSignalsPromptObjectPassSuffix: "발견됨",
  aiSignalsPromptObjectWarningSuffix: "없음",
  aiSignalsStructuredDataPassSuffix: "발견됨",
  aiSignalsStructuredDataWarningSuffix: "없음",
  aiSignalsFaqSectionPassSuffix: "발견됨",
  aiSignalsFaqSectionWarningSuffix: "없음",
  aiSignalsJsRenderDeltaPassSuffix: "{count}%",
  aiSignalsJsRenderDeltaWarningSuffix: "{count}%",
  aiSignalsJsRenderDeltaFailSuffix: "{count}%",
};

describe("getAiSignalsLabel", () => {
  it("returns the short static label for a known id", () => {
    expect(getAiSignalsLabel(t, "promptsTxt")).toBe("prompts.txt");
    expect(getAiSignalsLabel(t, "jsRenderDelta")).toBe("JS 렌더링 의존도");
  });

  it("falls back to the raw id for an unknown id", () => {
    expect(getAiSignalsLabel(t, "somethingNew")).toBe("somethingNew");
  });
});

describe("getAiSignalsDetailSuffix", () => {
  it("builds a promptsTxt:pass suffix with the byte count", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "promptsTxt", status: "pass", detail: 128 })
    ).toBe("128바이트");
  });

  it("builds a promptsTxt:info suffix when content is next to empty", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "promptsTxt", status: "info", detail: 8 })
    ).toBe("내용 부족");
  });

  it("builds a promptsTxt:warning suffix with no interpolation when it doesn't exist", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "promptsTxt", status: "warning" })
    ).toBe("없음");
  });

  it("builds promptObject:pass / :warning suffixes", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "promptObject", status: "pass" })
    ).toBe("발견됨");
    expect(
      getAiSignalsDetailSuffix(t, { id: "promptObject", status: "warning" })
    ).toBe("없음");
  });

  it("builds structuredData:pass / :warning suffixes", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "structuredData", status: "pass" })
    ).toBe("발견됨");
    expect(
      getAiSignalsDetailSuffix(t, { id: "structuredData", status: "warning" })
    ).toBe("없음");
  });

  it("builds faqSection:pass / :warning suffixes", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "faqSection", status: "pass" })
    ).toBe("발견됨");
    expect(
      getAiSignalsDetailSuffix(t, { id: "faqSection", status: "warning" })
    ).toBe("없음");
  });

  it("builds jsRenderDelta:pass/:warning/:fail suffixes as a rounded percentage", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "jsRenderDelta", status: "pass", detail: 0.05 })
    ).toBe("5%");
    expect(
      getAiSignalsDetailSuffix(t, { id: "jsRenderDelta", status: "warning", detail: 0.25 })
    ).toBe("25%");
    expect(
      getAiSignalsDetailSuffix(t, { id: "jsRenderDelta", status: "fail", detail: 0.5 })
    ).toBe("50%");
  });

  it("returns undefined for an unknown id/status combo", () => {
    expect(
      getAiSignalsDetailSuffix(t, { id: "somethingNew", status: "pass" })
    ).toBeUndefined();
  });
});
