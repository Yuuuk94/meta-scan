import { describe, expect, it } from "vitest";
import {
  buildAiSignalsChecksFromCrawling,
  buildFaqSectionCheck,
  buildJsRenderDeltaCheck,
  buildPromptObjectCheck,
  buildPromptsTxtCheck,
  buildStructuredDataCheck,
} from "@/domain/checks/aiSignalsChecks.js";

describe("buildPromptsTxtCheck", () => {
  it("marks promptsTxt as pass with byte count when /.well-known/prompts.txt exists", () => {
    expect(
      buildPromptsTxtCheck({ exists: true, byteCount: 512 })
    ).toEqual({ id: "promptsTxt", status: "pass", detail: 512 });
  });

  it("marks promptsTxt as info (not a deduction) when it doesn't exist", () => {
    expect(buildPromptsTxtCheck({ exists: false })).toEqual({
      id: "promptsTxt",
      status: "info",
    });
  });
});

describe("buildPromptObjectCheck", () => {
  it("marks promptObject as pass when a PromptObject JSON-LD @type is present", () => {
    expect(buildPromptObjectCheck(["WebPage", "PromptObject"])).toEqual({
      id: "promptObject",
      status: "pass",
    });
  });

  it("marks promptObject as info when no PromptObject @type is present", () => {
    expect(buildPromptObjectCheck(["WebPage"])).toEqual({
      id: "promptObject",
      status: "info",
    });
  });

  it("marks promptObject as info when there's no structured data at all", () => {
    expect(buildPromptObjectCheck([])).toEqual({
      id: "promptObject",
      status: "info",
    });
  });
});

describe("buildStructuredDataCheck", () => {
  it("marks structuredData as pass when at least one JSON-LD @type was found", () => {
    expect(buildStructuredDataCheck(["WebPage"])).toEqual({
      id: "structuredData",
      status: "pass",
    });
  });

  it("marks structuredData as info when no JSON-LD was found", () => {
    expect(buildStructuredDataCheck([])).toEqual({
      id: "structuredData",
      status: "info",
    });
  });
});

describe("buildFaqSectionCheck", () => {
  it("marks faqSection as pass when a FAQPage JSON-LD @type is present (schema-only, no DOM Q&A heuristic this scope)", () => {
    expect(buildFaqSectionCheck(["FAQPage"])).toEqual({
      id: "faqSection",
      status: "pass",
    });
  });

  it("marks faqSection as info when no FAQPage @type is present", () => {
    expect(buildFaqSectionCheck(["WebPage"])).toEqual({
      id: "faqSection",
      status: "info",
    });
  });
});

describe("buildJsRenderDeltaCheck", () => {
  it("marks jsRenderDelta as pass when deltaRatio is under 15%", () => {
    expect(buildJsRenderDeltaCheck(0.1)).toEqual({
      id: "jsRenderDelta",
      status: "pass",
      detail: 0.1,
    });
  });

  it("marks jsRenderDelta as warning at exactly the 15% boundary", () => {
    expect(buildJsRenderDeltaCheck(0.15)).toEqual({
      id: "jsRenderDelta",
      status: "warning",
      detail: 0.15,
    });
  });

  it("marks jsRenderDelta as warning between 15% and 40%", () => {
    expect(buildJsRenderDeltaCheck(0.3)).toEqual({
      id: "jsRenderDelta",
      status: "warning",
      detail: 0.3,
    });
  });

  it("marks jsRenderDelta as fail at exactly the 40% boundary", () => {
    expect(buildJsRenderDeltaCheck(0.4)).toEqual({
      id: "jsRenderDelta",
      status: "fail",
      detail: 0.4,
    });
  });

  it("marks jsRenderDelta as fail when deltaRatio is 40% or more", () => {
    expect(buildJsRenderDeltaCheck(0.6)).toEqual({
      id: "jsRenderDelta",
      status: "fail",
      detail: 0.6,
    });
  });

  it("judges on the magnitude of a negative deltaRatio the same as its positive counterpart", () => {
    expect(buildJsRenderDeltaCheck(-0.5)).toEqual({
      id: "jsRenderDelta",
      status: "fail",
      detail: -0.5,
    });
  });
});

describe("buildAiSignalsChecksFromCrawling", () => {
  it("returns exactly the 5 aiSignals checks, in promptsTxt/promptObject/structuredData/faqSection/jsRenderDelta order", () => {
    const checks = buildAiSignalsChecksFromCrawling({
      promptsTxt: { exists: true, byteCount: 128 },
      structuredDataTypes: ["WebPage", "FAQPage", "PromptObject"],
      deltaRatio: 0.05,
    });

    expect(checks.map((c) => c.id)).toEqual([
      "promptsTxt",
      "promptObject",
      "structuredData",
      "faqSection",
      "jsRenderDelta",
    ]);
  });

  it("combines the five underlying judgements for a page with no AI signals at all", () => {
    const checks = buildAiSignalsChecksFromCrawling({
      promptsTxt: { exists: false },
      structuredDataTypes: [],
      deltaRatio: 0.5,
    });

    expect(checks).toEqual([
      { id: "promptsTxt", status: "info" },
      { id: "promptObject", status: "info" },
      { id: "structuredData", status: "info" },
      { id: "faqSection", status: "info" },
      { id: "jsRenderDelta", status: "fail", detail: 0.5 },
    ]);
  });
});
