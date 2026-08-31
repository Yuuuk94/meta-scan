import { describe, expect, it } from "vitest";
import {
  buildCanonicalCheck,
  buildCanonicalMultipleCheck,
  buildMetaRobotsNoindexCheck,
  buildSitemapDeclaredInRobotsCheck,
  buildSitemapExistsCheck,
} from "@/domain/checks/indexingChecks.js";

describe("buildSitemapExistsCheck", () => {
  it("marks sitemapExists as pass when a sitemap was found (primary or candidate)", () => {
    expect(buildSitemapExistsCheck(true)).toEqual({
      id: "sitemapExists",
      status: "pass",
    });
  });

  it("marks sitemapExists as warning when nothing was found", () => {
    expect(buildSitemapExistsCheck(false)).toEqual({
      id: "sitemapExists",
      status: "warning",
    });
  });
});

describe("buildSitemapDeclaredInRobotsCheck", () => {
  it("marks sitemapDeclaredInRobots as pass when robots.txt declares at least one sitemap", () => {
    expect(
      buildSitemapDeclaredInRobotsCheck(["https://example.com/sitemap.xml"])
    ).toEqual({ id: "sitemapDeclaredInRobots", status: "pass" });
  });

  it("marks sitemapDeclaredInRobots as info when robots.txt declares no sitemap", () => {
    expect(buildSitemapDeclaredInRobotsCheck([])).toEqual({
      id: "sitemapDeclaredInRobots",
      status: "info",
    });
  });
});

describe("buildCanonicalCheck", () => {
  it("marks canonical as info when there is no canonical link at all", () => {
    expect(buildCanonicalCheck([])).toEqual({ id: "canonical", status: "info" });
  });

  it("marks canonical as info when the first canonical href is a relative path", () => {
    expect(buildCanonicalCheck(["/page"])).toEqual({
      id: "canonical",
      status: "info",
    });
  });

  it("marks canonical as pass when the first canonical href is an absolute URL (self-referencing)", () => {
    expect(
      buildCanonicalCheck(["https://example.com/page"])
    ).toEqual({ id: "canonical", status: "pass" });
  });

  it("marks canonical as pass when the first canonical href is an absolute URL pointing elsewhere", () => {
    expect(
      buildCanonicalCheck(["https://example.com/other-page"])
    ).toEqual({ id: "canonical", status: "pass" });
  });

  it("does not treat a protocol-relative href (//host/path) as a relative path", () => {
    expect(buildCanonicalCheck(["//example.com/page"])).toEqual({
      id: "canonical",
      status: "pass",
    });
  });
});

describe("buildCanonicalMultipleCheck", () => {
  it("marks canonicalMultiple as pass when there is no canonical tag", () => {
    expect(buildCanonicalMultipleCheck([])).toEqual({
      id: "canonicalMultiple",
      status: "pass",
    });
  });

  it("marks canonicalMultiple as pass when there is exactly one canonical tag", () => {
    expect(
      buildCanonicalMultipleCheck(["https://example.com/page"])
    ).toEqual({ id: "canonicalMultiple", status: "pass" });
  });

  it("marks canonicalMultiple as fail when there are two or more canonical tags, regardless of value equality", () => {
    expect(
      buildCanonicalMultipleCheck([
        "https://example.com/page",
        "https://example.com/page",
      ])
    ).toEqual({ id: "canonicalMultiple", status: "fail" });

    expect(
      buildCanonicalMultipleCheck([
        "https://example.com/page",
        "https://example.com/other",
      ])
    ).toEqual({ id: "canonicalMultiple", status: "fail" });
  });
});

describe("buildMetaRobotsNoindexCheck", () => {
  it("marks metaRobotsNoindex as pass when there is no meta robots tag", () => {
    expect(buildMetaRobotsNoindexCheck(undefined)).toEqual({
      id: "metaRobotsNoindex",
      status: "pass",
    });
  });

  it("marks metaRobotsNoindex as pass when content has unrelated directives", () => {
    expect(buildMetaRobotsNoindexCheck("index, follow")).toEqual({
      id: "metaRobotsNoindex",
      status: "pass",
    });
  });

  it("marks metaRobotsNoindex as fail when the noindex token is present (comma-separated)", () => {
    expect(buildMetaRobotsNoindexCheck("noindex, follow")).toEqual({
      id: "metaRobotsNoindex",
      status: "fail",
    });
  });

  it("marks metaRobotsNoindex as fail when the noindex token is present (space-separated)", () => {
    expect(buildMetaRobotsNoindexCheck("noindex follow")).toEqual({
      id: "metaRobotsNoindex",
      status: "fail",
    });
  });

  it("does not false-positive on a token that merely contains the substring noindex", () => {
    expect(buildMetaRobotsNoindexCheck("max-snippet: noindex-example")).toEqual({
      id: "metaRobotsNoindex",
      status: "pass",
    });
  });

  it("is case-insensitive", () => {
    expect(buildMetaRobotsNoindexCheck("NOINDEX")).toEqual({
      id: "metaRobotsNoindex",
      status: "fail",
    });
  });
});
