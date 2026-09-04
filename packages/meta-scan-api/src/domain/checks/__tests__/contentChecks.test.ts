import { describe, expect, it } from "vitest";
import {
  buildCharCountCheck,
  buildContentChecksFromCrawling,
  buildHeadingsCheck,
  buildTldrCheck,
} from "@/domain/checks/contentChecks.js";

describe("buildCharCountCheck", () => {
  it("marks in-range (600~2000 chars) body length as pass with the actual char count", () => {
    expect(buildCharCountCheck(1340)).toEqual({
      id: "charCount",
      status: "pass",
      detail: 1340,
    });
  });

  it("marks the lower boundary (600) as pass", () => {
    expect(buildCharCountCheck(600)).toEqual({
      id: "charCount",
      status: "pass",
      detail: 600,
    });
  });

  it("marks the upper boundary (2000) as pass", () => {
    expect(buildCharCountCheck(2000)).toEqual({
      id: "charCount",
      status: "pass",
      detail: 2000,
    });
  });

  it("marks too-short body length as warning", () => {
    expect(buildCharCountCheck(120)).toEqual({
      id: "charCount",
      status: "warning",
      detail: 120,
    });
  });

  it("marks too-long body length as warning", () => {
    expect(buildCharCountCheck(2500)).toEqual({
      id: "charCount",
      status: "warning",
      detail: 2500,
    });
  });
});

describe("buildHeadingsCheck", () => {
  it("marks exactly one h1 plus at least one h2/h3 as pass, with the raw counts as detail", () => {
    expect(buildHeadingsCheck({ h1: 1, h2: 6, h3: 12 })).toEqual({
      id: "headings",
      status: "pass",
      detail: { h1: 1, h2: 6, h3: 12 },
    });
  });

  it("marks zero h1 as warning", () => {
    expect(buildHeadingsCheck({ h1: 0, h2: 2, h3: 0 })).toEqual({
      id: "headings",
      status: "warning",
      detail: { h1: 0, h2: 2, h3: 0 },
    });
  });

  it("marks two or more h1 as warning", () => {
    expect(buildHeadingsCheck({ h1: 2, h2: 2, h3: 0 })).toEqual({
      id: "headings",
      status: "warning",
      detail: { h1: 2, h2: 2, h3: 0 },
    });
  });

  it("marks one h1 with no h2/h3 at all as warning (no heading structure beneath h1)", () => {
    expect(buildHeadingsCheck({ h1: 1, h2: 0, h3: 0 })).toEqual({
      id: "headings",
      status: "warning",
      detail: { h1: 1, h2: 0, h3: 0 },
    });
  });
});

describe("buildTldrCheck", () => {
  it("marks pass when a TL;DR/summary block is present", () => {
    expect(buildTldrCheck(true)).toEqual({ id: "tldr", status: "pass" });
  });

  it("marks info (not a deduction) when no TL;DR/summary block is found", () => {
    expect(buildTldrCheck(false)).toEqual({ id: "tldr", status: "info" });
  });
});

describe("buildContentChecksFromCrawling", () => {
  it("composes exactly 3 rows in order: headings, charCount, tldr", () => {
    const checks = buildContentChecksFromCrawling({
      charCount: 1340,
      headings: { h1: 1, h2: 6, h3: 12 },
      hasTldr: true,
    });
    expect(checks).toEqual([
      { id: "headings", status: "pass", detail: { h1: 1, h2: 6, h3: 12 } },
      { id: "charCount", status: "pass", detail: 1340 },
      { id: "tldr", status: "pass" },
    ]);
  });
});
