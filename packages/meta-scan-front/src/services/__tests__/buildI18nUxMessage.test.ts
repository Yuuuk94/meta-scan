import { buildI18nUxMessage } from "@/services/buildI18nUxMessage";

// Only the keys buildI18nUxMessage actually reads — mirrors
// buildPreviewsMessage.test.ts's `t` slice convention.
const t = {
  i18nUxHreflangPass: "hreflang 대체 링크가 있다",
  i18nUxHreflangInfo: "hreflang 대체 링크가 없다",
  i18nUxViewportPass: "viewport 메타 태그가 있다",
  i18nUxViewportWarning: "viewport 메타 태그가 없다",
};

describe("buildI18nUxMessage", () => {
  it("picks the pass-state template for hreflang", () => {
    expect(buildI18nUxMessage(t, { id: "hreflang", status: "pass" })).toBe(
      "hreflang 대체 링크가 있다"
    );
  });

  it("picks the info-state template for hreflang", () => {
    expect(buildI18nUxMessage(t, { id: "hreflang", status: "info" })).toBe(
      "hreflang 대체 링크가 없다"
    );
  });

  it("picks the pass-state template for viewport", () => {
    expect(buildI18nUxMessage(t, { id: "viewport", status: "pass" })).toBe(
      "viewport 메타 태그가 있다"
    );
  });

  it("picks the warning-state template for viewport", () => {
    expect(buildI18nUxMessage(t, { id: "viewport", status: "warning" })).toBe(
      "viewport 메타 태그가 없다"
    );
  });

  it("falls back to the raw id when no template key matches (unknown id/status combo)", () => {
    expect(
      buildI18nUxMessage(t, { id: "totally.unknown", status: "info" })
    ).toBe("totally.unknown");
  });
});
