import { describe, expect, it } from "vitest";
import { buildBasicSeoChecks } from "@/domain/checks/basicSeoChecks.js";

// Minimal valid extract fixture (passes every basicSeo check) so each test
// only overrides the field it's exercising.
function extract(overrides: Partial<BasicSeoExtractInput> = {}): BasicSeoExtractInput {
  return {
    title: "A perfectly reasonable page title for SEO",
    description:
      "A meta description long enough to sit comfortably inside the recommended 50 to 160 character range for search engines.",
    keywords: undefined,
    images: { total: 3, altMissing: 0 },
    duplicates: { metaName: [], metaProperty: [] },
    ...overrides,
  };
}

describe("buildBasicSeoChecks", () => {
  it("always returns exactly 5 rows regardless of pass/fail state", () => {
    const checks = buildBasicSeoChecks(extract());
    expect(checks).toHaveLength(5);
    expect(checks.map((c) => c.id).sort()).toEqual(
      [
        "title.length",
        "desc.length",
        "keywords.deprecated",
        "img.altMissing",
        "meta.duplicate",
      ].sort()
    );
  });

  it("marks a missing title as fail with id title.missing (no detail)", () => {
    const checks = buildBasicSeoChecks(extract({ title: undefined }));
    const row = checks.find((c) => c.id === "title.missing");
    expect(row).toEqual({ id: "title.missing", status: "fail" });
  });

  it("marks an out-of-range title length as warning with the actual char count", () => {
    const checks = buildBasicSeoChecks(extract({ title: "short" }));
    const row = checks.find((c) => c.id === "title.length");
    expect(row).toEqual({ id: "title.length", status: "warning", detail: 5 });
  });

  it("marks a good title length as pass with the actual char count", () => {
    const title = "A perfectly reasonable page title for SEO";
    const checks = buildBasicSeoChecks(extract({ title }));
    const row = checks.find((c) => c.id === "title.length");
    expect(row).toEqual({
      id: "title.length",
      status: "pass",
      detail: title.length,
    });
  });

  it("marks a missing description as warning with id desc.missing (no detail)", () => {
    const checks = buildBasicSeoChecks(extract({ description: undefined }));
    const row = checks.find((c) => c.id === "desc.missing");
    expect(row).toEqual({ id: "desc.missing", status: "warning" });
  });

  it("marks an out-of-range description length as warning with the actual char count", () => {
    const description = "too short";
    const checks = buildBasicSeoChecks(extract({ description }));
    const row = checks.find((c) => c.id === "desc.length");
    expect(row).toEqual({
      id: "desc.length",
      status: "warning",
      detail: description.length,
    });
  });

  it("marks keywords.deprecated as info when a non-empty keywords meta is present", () => {
    const checks = buildBasicSeoChecks(extract({ keywords: "seo, meta, scan" }));
    const row = checks.find((c) => c.id === "keywords.deprecated");
    expect(row).toEqual({ id: "keywords.deprecated", status: "info" });
  });

  it("marks keywords.deprecated as pass when the keywords meta content is empty", () => {
    const checks = buildBasicSeoChecks(extract({ keywords: "" }));
    const row = checks.find((c) => c.id === "keywords.deprecated");
    expect(row).toEqual({ id: "keywords.deprecated", status: "pass" });
  });

  it("marks keywords.deprecated as pass when there is no keywords meta at all", () => {
    const checks = buildBasicSeoChecks(extract({ keywords: undefined }));
    const row = checks.find((c) => c.id === "keywords.deprecated");
    expect(row).toEqual({ id: "keywords.deprecated", status: "pass" });
  });

  it("counts missing-alt images (including alt=\"\") as warning with the count as detail", () => {
    const checks = buildBasicSeoChecks(
      extract({ images: { total: 4, altMissing: 2 } })
    );
    const row = checks.find((c) => c.id === "img.altMissing");
    expect(row).toEqual({ id: "img.altMissing", status: "warning", detail: 2 });
  });

  it("marks img.altMissing as pass with detail 0 when nothing is missing", () => {
    const checks = buildBasicSeoChecks(
      extract({ images: { total: 4, altMissing: 0 } })
    );
    const row = checks.find((c) => c.id === "img.altMissing");
    expect(row).toEqual({ id: "img.altMissing", status: "pass", detail: 0 });
  });

  it("marks meta.duplicate as info with the total duplicate count when duplicates exist", () => {
    const checks = buildBasicSeoChecks(
      extract({
        duplicates: { metaName: ["description"], metaProperty: ["og:title"] },
      })
    );
    const row = checks.find((c) => c.id === "meta.duplicate");
    expect(row).toEqual({ id: "meta.duplicate", status: "info", detail: 2 });
  });

  it("marks meta.duplicate as pass with detail 0 when there are no duplicates", () => {
    const checks = buildBasicSeoChecks(extract());
    const row = checks.find((c) => c.id === "meta.duplicate");
    expect(row).toEqual({ id: "meta.duplicate", status: "pass", detail: 0 });
  });
});
