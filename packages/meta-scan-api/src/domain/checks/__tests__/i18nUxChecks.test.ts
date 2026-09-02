import { describe, expect, it } from "vitest";
import {
  buildHreflangCheck,
  buildI18nUxChecksFromCrawling,
  buildViewportCheck,
} from "@/domain/checks/i18nUxChecks.js";

describe("buildHreflangCheck", () => {
  it("marks pass when at least one hreflang alternate link is present", () => {
    expect(buildHreflangCheck(true)).toEqual({ id: "hreflang", status: "pass" });
  });

  it("marks info (not a deduction) when no hreflang alternate link is found", () => {
    expect(buildHreflangCheck(false)).toEqual({ id: "hreflang", status: "info" });
  });
});

describe("buildViewportCheck", () => {
  it("marks pass when a viewport meta tag is present", () => {
    expect(buildViewportCheck(true)).toEqual({ id: "viewport", status: "pass" });
  });

  it("marks warning when no viewport meta tag is found", () => {
    expect(buildViewportCheck(false)).toEqual({ id: "viewport", status: "warning" });
  });
});

describe("buildI18nUxChecksFromCrawling", () => {
  it("composes exactly 2 rows in order: hreflang, viewport", () => {
    const checks = buildI18nUxChecksFromCrawling({
      hasHreflang: true,
      hasViewport: false,
    });
    expect(checks).toEqual([
      { id: "hreflang", status: "pass" },
      { id: "viewport", status: "warning" },
    ]);
  });
});
