import { buildBasicSeoMessage } from "@/services/buildBasicSeoMessage";

// Only the keys buildBasicSeoMessage actually reads — mirrors how `t` is
// used elsewhere in this codebase (a flat Record<string, string | string[]>
// slice of dictionaries/{ko,en}.json's "scan" section).
const t = {
  basicSeoTitleMissing: "title 태그가 없다",
  basicSeoTitleLengthWarning: "제목 길이가 권장 범위를 벗어났다 ({count}자)",
  basicSeoTitleLengthPass: "제목 길이가 적절하다 ({count}자)",
  basicSeoDescMissing: "meta description이 없다",
  basicSeoDescLengthWarning: "설명 길이가 권장 범위를 벗어났다 ({count}자)",
  basicSeoDescLengthPass: "설명 길이가 적절하다 ({count}자)",
  basicSeoKeywordsInfo: "keywords 메타 태그는 더 이상 사용되지 않는다",
  basicSeoKeywordsPass: "keywords 메타 태그를 사용하지 않고 있다",
  basicSeoImgAltWarning: "대체 텍스트(alt)가 없는 이미지가 {count}개 있다",
  basicSeoImgAltPass: "모든 이미지에 대체 텍스트(alt)가 있다",
  basicSeoMetaDuplicateInfo: "중복된 meta 태그가 {count}개 있다",
  basicSeoMetaDuplicatePass: "중복된 meta 태그가 없다",
};

describe("buildBasicSeoMessage", () => {
  it("assembles a plain message for an id with no detail (title.missing)", () => {
    expect(buildBasicSeoMessage(t, { id: "title.missing", status: "fail" })).toBe(
      "title 태그가 없다"
    );
  });

  it("fills {count} for title.length in the warning state", () => {
    expect(
      buildBasicSeoMessage(t, { id: "title.length", status: "warning", detail: 5 })
    ).toBe("제목 길이가 권장 범위를 벗어났다 (5자)");
  });

  it("fills {count} for title.length in the pass state (same id, different status -> different template)", () => {
    expect(
      buildBasicSeoMessage(t, { id: "title.length", status: "pass", detail: 42 })
    ).toBe("제목 길이가 적절하다 (42자)");
  });

  it("assembles desc.missing with no detail", () => {
    expect(buildBasicSeoMessage(t, { id: "desc.missing", status: "warning" })).toBe(
      "meta description이 없다"
    );
  });

  it("fills {count} for desc.length pass", () => {
    expect(
      buildBasicSeoMessage(t, { id: "desc.length", status: "pass", detail: 120 })
    ).toBe("설명 길이가 적절하다 (120자)");
  });

  it("picks the info-state template for keywords.deprecated", () => {
    expect(
      buildBasicSeoMessage(t, { id: "keywords.deprecated", status: "info" })
    ).toBe("keywords 메타 태그는 더 이상 사용되지 않는다");
  });

  it("picks the pass-state template for keywords.deprecated", () => {
    expect(
      buildBasicSeoMessage(t, { id: "keywords.deprecated", status: "pass" })
    ).toBe("keywords 메타 태그를 사용하지 않고 있다");
  });

  it("fills {count} for img.altMissing warning", () => {
    expect(
      buildBasicSeoMessage(t, { id: "img.altMissing", status: "warning", detail: 3 })
    ).toBe("대체 텍스트(alt)가 없는 이미지가 3개 있다");
  });

  it("uses the pass template (no {count}) for img.altMissing pass", () => {
    expect(
      buildBasicSeoMessage(t, { id: "img.altMissing", status: "pass", detail: 0 })
    ).toBe("모든 이미지에 대체 텍스트(alt)가 있다");
  });

  it("fills {count} for meta.duplicate info", () => {
    expect(
      buildBasicSeoMessage(t, { id: "meta.duplicate", status: "info", detail: 2 })
    ).toBe("중복된 meta 태그가 2개 있다");
  });

  it("uses the pass template for meta.duplicate pass", () => {
    expect(
      buildBasicSeoMessage(t, { id: "meta.duplicate", status: "pass", detail: 0 })
    ).toBe("중복된 meta 태그가 없다");
  });

  it("falls back to the raw id when no template key matches (unknown id/status combo)", () => {
    expect(
      buildBasicSeoMessage(t, { id: "totally.unknown", status: "info" })
    ).toBe("totally.unknown");
  });
});
