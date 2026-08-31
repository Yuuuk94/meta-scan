import { describe, expect, it } from "vitest";
import {
  buildFaviconCheck,
  buildOgImageDimensionsCheck,
  buildOgRequiredTagsCheck,
  buildPreviewsChecksFromCrawling,
  buildTwitterCardCheck,
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

describe("buildOgRequiredTagsCheck", () => {
  it("marks ogRequiredTags as pass when og:title/og:description/og:image are all present", () => {
    expect(
      buildOgRequiredTagsCheck({
        "og:title": "Title",
        "og:description": "Desc",
        "og:image": "https://example.com/og.png",
      })
    ).toEqual({ id: "ogRequiredTags", status: "pass" });
  });

  it("marks ogRequiredTags as warning when og:image is missing", () => {
    expect(
      buildOgRequiredTagsCheck({
        "og:title": "Title",
        "og:description": "Desc",
      })
    ).toEqual({ id: "ogRequiredTags", status: "warning" });
  });

  it("marks ogRequiredTags as warning when none of the required tags are present", () => {
    expect(buildOgRequiredTagsCheck({})).toEqual({
      id: "ogRequiredTags",
      status: "warning",
    });
  });

  it("treats an empty string value the same as missing", () => {
    expect(
      buildOgRequiredTagsCheck({
        "og:title": "",
        "og:description": "Desc",
        "og:image": "https://example.com/og.png",
      })
    ).toEqual({ id: "ogRequiredTags", status: "warning" });
  });
});

describe("buildTwitterCardCheck", () => {
  it("marks twitterCard as pass when twitter:card is present", () => {
    expect(buildTwitterCardCheck({ "twitter:card": "summary_large_image" })).toEqual(
      { id: "twitterCard", status: "pass" }
    );
  });

  it("marks twitterCard as warning when twitter:card is missing", () => {
    expect(buildTwitterCardCheck({})).toEqual({
      id: "twitterCard",
      status: "warning",
    });
  });

  it("treats an empty string twitter:card the same as missing", () => {
    expect(buildTwitterCardCheck({ "twitter:card": "" })).toEqual({
      id: "twitterCard",
      status: "warning",
    });
  });
});

describe("buildPreviewsChecksFromCrawling", () => {
  it("returns exactly the 4 previews checks, in ogImageDimensions/favicon/ogRequiredTags/twitterCard order", () => {
    const checks = buildPreviewsChecksFromCrawling({
      ogImage: "https://example.com/og.png",
      hasIconLink: true,
      faviconFallbackOk: false,
      openGraph: {
        "og:title": "Title",
        "og:description": "Desc",
        "og:image": "https://example.com/og.png",
      },
      twitter: { "twitter:card": "summary" },
    });

    expect(checks.map((c) => c.id)).toEqual([
      "ogImageDimensions",
      "favicon",
      "ogRequiredTags",
      "twitterCard",
    ]);
  });

  it("combines the four underlying judgements for a page missing every signal", () => {
    const checks = buildPreviewsChecksFromCrawling({
      ogImage: undefined,
      hasIconLink: false,
      faviconFallbackOk: false,
      openGraph: {},
      twitter: {},
    });

    expect(checks).toEqual([
      { id: "ogImageDimensions", status: "warning" },
      { id: "favicon", status: "warning" },
      { id: "ogRequiredTags", status: "warning" },
      { id: "twitterCard", status: "warning" },
    ]);
  });
});
