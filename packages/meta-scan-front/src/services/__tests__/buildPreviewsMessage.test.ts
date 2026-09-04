import { buildPreviewsMessage } from "@/services/buildPreviewsMessage";

// Only the keys buildPreviewsMessage actually reads — mirrors
// buildIndexingMessage.test.ts's `t` slice convention.
const t = {
  previewsOgImageDimensionsPass: "og:image가 설정되어 있다",
  previewsOgImageDimensionsWarning: "og:image가 없다",
  previewsFaviconPass: "favicon이 확인된다",
  previewsFaviconWarning: "favicon을 찾을 수 없다",
  previewsOgRequiredTagsPass: "OG 필수 태그가 모두 있다",
  previewsOgRequiredTagsWarning: "OG 필수 태그 중 일부가 없다",
  previewsTwitterCardPass: "twitter:card가 설정되어 있다",
  previewsTwitterCardWarning: "twitter:card가 없다",
};

describe("buildPreviewsMessage", () => {
  it("picks the pass-state template for ogImageDimensions", () => {
    expect(
      buildPreviewsMessage(t, { id: "ogImageDimensions", status: "pass" })
    ).toBe("og:image가 설정되어 있다");
  });

  it("picks the warning-state template for ogImageDimensions", () => {
    expect(
      buildPreviewsMessage(t, { id: "ogImageDimensions", status: "warning" })
    ).toBe("og:image가 없다");
  });

  it("picks the pass-state template for favicon", () => {
    expect(buildPreviewsMessage(t, { id: "favicon", status: "pass" })).toBe(
      "favicon이 확인된다"
    );
  });

  it("picks the warning-state template for favicon", () => {
    expect(buildPreviewsMessage(t, { id: "favicon", status: "warning" })).toBe(
      "favicon을 찾을 수 없다"
    );
  });

  it("picks the pass-state template for ogRequiredTags", () => {
    expect(
      buildPreviewsMessage(t, { id: "ogRequiredTags", status: "pass" })
    ).toBe("OG 필수 태그가 모두 있다");
  });

  it("picks the warning-state template for ogRequiredTags", () => {
    expect(
      buildPreviewsMessage(t, { id: "ogRequiredTags", status: "warning" })
    ).toBe("OG 필수 태그 중 일부가 없다");
  });

  it("picks the pass-state template for twitterCard", () => {
    expect(
      buildPreviewsMessage(t, { id: "twitterCard", status: "pass" })
    ).toBe("twitter:card가 설정되어 있다");
  });

  it("picks the warning-state template for twitterCard", () => {
    expect(
      buildPreviewsMessage(t, { id: "twitterCard", status: "warning" })
    ).toBe("twitter:card가 없다");
  });

  it("falls back to the raw id when no template key matches (unknown id/status combo)", () => {
    expect(
      buildPreviewsMessage(t, { id: "totally.unknown", status: "info" })
    ).toBe("totally.unknown");
  });
});
