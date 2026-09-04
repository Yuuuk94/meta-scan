import { buildContentMessage } from "@/services/buildContentMessage";

// Only the keys buildContentMessage actually reads — mirrors
// buildBasicSeoMessage.test.ts's `t` slice convention.
const t = {
  contentCharCountPass: "본문 길이가 적절하다 ({count}자)",
  contentCharCountWarning: "본문 길이가 권장 범위(600~2,000자)를 벗어났다 ({count}자)",
  contentHeadingsPass: "제목 구조(H1 1개 + 소제목)가 적절하다",
  contentHeadingsWarning: "제목 구조가 권장 기준에 맞지 않는다 (H1 {count}개)",
  contentTldrPass: "TL;DR 섹션이 있다",
  contentTldrInfo: "TL;DR 섹션이 없다",
};

describe("buildContentMessage", () => {
  it("fills {count} for charCount in the pass state", () => {
    expect(
      buildContentMessage(t, { id: "charCount", status: "pass", detail: 900 })
    ).toBe("본문 길이가 적절하다 (900자)");
  });

  it("fills {count} for charCount in the warning state", () => {
    expect(
      buildContentMessage(t, { id: "charCount", status: "warning", detail: 42 })
    ).toBe("본문 길이가 권장 범위(600~2,000자)를 벗어났다 (42자)");
  });

  it("renders the plain headings pass template (no {count})", () => {
    expect(
      buildContentMessage(t, {
        id: "headings",
        status: "pass",
        detail: { h1: 1, h2: 2, h3: 0 },
      })
    ).toBe("제목 구조(H1 1개 + 소제목)가 적절하다");
  });

  it("fills {count} with the h1 count from headings' object detail in the warning state", () => {
    expect(
      buildContentMessage(t, {
        id: "headings",
        status: "warning",
        detail: { h1: 0, h2: 0, h3: 0 },
      })
    ).toBe("제목 구조가 권장 기준에 맞지 않는다 (H1 0개)");

    expect(
      buildContentMessage(t, {
        id: "headings",
        status: "warning",
        detail: { h1: 2, h2: 1, h3: 0 },
      })
    ).toBe("제목 구조가 권장 기준에 맞지 않는다 (H1 2개)");
  });

  it("assembles tldr pass with no detail", () => {
    expect(buildContentMessage(t, { id: "tldr", status: "pass" })).toBe(
      "TL;DR 섹션이 있다"
    );
  });

  it("assembles tldr info with no detail", () => {
    expect(buildContentMessage(t, { id: "tldr", status: "info" })).toBe(
      "TL;DR 섹션이 없다"
    );
  });

  it("falls back to the raw id when no template key matches (unknown id/status combo)", () => {
    expect(
      buildContentMessage(t, { id: "totally.unknown", status: "info" })
    ).toBe("totally.unknown");
  });
});
