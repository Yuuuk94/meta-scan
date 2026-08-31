import { describe, expect, it } from "vitest";
import {
  buildFaviconCheck,
  buildOgImageDimensionsCheck,
  buildPreviewsChecksFromCrawling,
} from "@/domain/checks/previewsChecks.js";

describe("buildOgImageDimensionsCheck", () => {
  it("marks ogImageDimensions as pass when og:image is present (existence only, not measured)", () => {
    expect(
      buildOgImageDimensionsCheck("https://example.com/og.png")
    ).toEqual({ id: "ogImageDimensions", status: "pass" });
  });

  it("marks ogImageDimensions as warning when og:image is missing", () => {
    expect(buildOgImageDimensionsCheck(undefined)).toEqual({
      id: "ogImageDimensions",
      status: "warning",
    });
  });

  it("treats an empty string og:image the same as missing", () => {
    expect(buildOgImageDimensionsCheck("")).toEqual({
      id: "ogImageDimensions",
      status: "warning",
    });
  });
});

describe("buildFaviconCheck", () => {
  it("marks favicon as pass when a link[rel~=icon] tag was found in the DOM", () => {
    expect(buildFaviconCheck(true, false)).toEqual({
      id: "favicon",
      status: "pass",
    });
  });

  it("marks favicon as pass when there's no <link> tag but /favicon.ico fallback resolves 200 (spec decision log #1)", () => {
    expect(buildFaviconCheck(false, true)).toEqual({
      id: "favicon",
      status: "pass",
    });
  });

  it("marks favicon as warning when neither the <link> tag nor the /favicon.ico fallback exist", () => {
    expect(buildFaviconCheck(false, false)).toEqual({
      id: "favicon",
      status: "warning",
    });
  });

  it("marks favicon as pass when both signals are present", () => {
    expect(buildFaviconCheck(true, true)).toEqual({
      id: "favicon",
      status: "pass",
    });
  });
});

describe("buildPreviewsChecksFromCrawling", () => {
  it("returns exactly the 2 previews checks, in ogImageDimensions/favicon order", () => {
    const checks = buildPreviewsChecksFromCrawling({
      ogImage: "https://example.com/og.png",
      hasIconLink: true,
      faviconFallbackOk: false,
    });

    expect(checks.map((c) => c.id)).toEqual(["ogImageDimensions", "favicon"]);
  });

  it("combines the two underlying judgements for a page missing both signals", () => {
    const checks = buildPreviewsChecksFromCrawling({
      ogImage: undefined,
      hasIconLink: false,
      faviconFallbackOk: false,
    });

    expect(checks).toEqual([
      { id: "ogImageDimensions", status: "warning" },
      { id: "favicon", status: "warning" },
    ]);
  });
});
