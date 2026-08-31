/**
 * Pure judgement logic for the "AI 신호(AI Signals/AEO)" checklist card (issue #6
 * ai-signals-checklist). Like buildBasicSeoChecks (issue #3) and buildPreviewsChecksFromCrawling
 * (issue #5), all 5 checks come entirely from `crawling`'s own extraction — `promptsTxt` from a
 * plain fetch run in parallel with the original-HTML fetch (ADR-003 — no 5th API route),
 * `promptObject`/`structuredData`/`faqSection` from JSON-LD `@type` values collected during the
 * same `page.evaluate` DOM pass as the rest of the extraction, and `jsRenderDelta` from
 * `html.deltaRatio` (already computed by `ScanService.crawling`, no re-fetch needed).
 *
 * This scope's `faqSection` judges *only* `FAQPage` JSON-LD presence — the "Q&A DOM pattern"
 * heuristic PRD §3.4 also mentions is explicitly deferred (spec-fixed.md decision log #1: high
 * false-positive rate, separate-scale design work).
 *
 * Most of this group is "presence is a nice-to-have signal, not a deduction" (PRD §3.4) — hence
 * `info` rather than `warning`/`fail` on absence for everything except `jsRenderDelta`, which is a
 * real crawler-accessibility concern (a large gap between the first-fetched HTML and the
 * JS-rendered HTML means non-JS crawlers — including most AI bots today — miss real content).
 */

export function buildPromptsTxtCheck(promptsTxt: {
  exists: boolean;
  byteCount?: number;
}): AiSignalsCheckItem {
  return {
    id: "promptsTxt",
    status: promptsTxt.exists ? "pass" : "info",
    ...(promptsTxt.exists && promptsTxt.byteCount !== undefined
      ? { detail: promptsTxt.byteCount }
      : {}),
  };
}

// `PromptObject` is a proposed schema.org-style JSON-LD type surfaced as an emerging AEO signal —
// detection just reuses the same @type list `buildStructuredDataCheck`/`buildFaqSectionCheck` do.
export function buildPromptObjectCheck(
  structuredDataTypes: string[]
): AiSignalsCheckItem {
  return {
    id: "promptObject",
    status: structuredDataTypes.includes("PromptObject") ? "pass" : "info",
  };
}

export function buildStructuredDataCheck(
  structuredDataTypes: string[]
): AiSignalsCheckItem {
  return {
    id: "structuredData",
    status: structuredDataTypes.length > 0 ? "pass" : "info",
  };
}

// Schema-existence-only this scope (spec-fixed.md req #3) — no DOM Q&A pattern heuristic.
export function buildFaqSectionCheck(
  structuredDataTypes: string[]
): AiSignalsCheckItem {
  return {
    id: "faqSection",
    status: structuredDataTypes.includes("FAQPage") ? "pass" : "info",
  };
}

// <15%=pass, 15~40%=warning, 40%+=fail (spec-fixed.md req #4). Judged on magnitude, not sign —
// `deltaRatio` can go negative if the rendered HTML ends up *smaller* than the first-fetched HTML
// (e.g. a loading skeleton removed post-render); that's still a large first-vs-onload gap and the
// same crawler-visibility concern either direction. `detail` keeps the raw signed ratio, not the
// magnitude, so the frontend can still show the real number.
export function buildJsRenderDeltaCheck(deltaRatio: number): AiSignalsCheckItem {
  const magnitude = Math.abs(deltaRatio);
  const status = magnitude < 0.15 ? "pass" : magnitude < 0.4 ? "warning" : "fail";
  return { id: "jsRenderDelta", status, detail: deltaRatio };
}

/** Composes all 5 aiSignals checks — `ScanService.crawling` calls this once (after resolving the
 * parallel prompts.txt fetch and the JSON-LD @type extraction) and assigns the result straight to
 * `checks.aiSignals`. */
export function buildAiSignalsChecksFromCrawling(input: {
  promptsTxt: { exists: boolean; byteCount?: number };
  structuredDataTypes: string[];
  deltaRatio: number;
}): AiSignalsCheckItem[] {
  return [
    buildPromptsTxtCheck(input.promptsTxt),
    buildPromptObjectCheck(input.structuredDataTypes),
    buildStructuredDataCheck(input.structuredDataTypes),
    buildFaqSectionCheck(input.structuredDataTypes),
    buildJsRenderDeltaCheck(input.deltaRatio),
  ];
}
