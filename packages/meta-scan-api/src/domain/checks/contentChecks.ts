import { CHAR_COUNT_MAX, CHAR_COUNT_MIN } from "@/constant/content.js";

/**
 * Pure judgement logic for the "콘텐츠 품질(Content Stats)" checklist card (issue #7
 * content-stats-checklist). Like buildBasicSeoChecks (issue #3) and
 * buildPreviewsChecksFromCrawling (issue #5), all 3 checks come entirely from `crawling`'s own DOM
 * extraction (body character count, h1/h2/h3 counts, TL;DR/summary block detection) — no
 * cross-API merge needed.
 *
 * `headings` was specced ("비고") as "absorbing" basicSeo's existing h1 judgement (legacy
 * `h1.none`/`h1.multiple`) — checked against `basicSeoChecks.ts`/`ScanService.ts` directly rather
 * than assumed, and as of this issue there was no h1 check actually wired anywhere (`extract.h1`
 * was collected but never judged). So there's no migration to perform here — `headings` is a new
 * judgement, not a moved one, but it does *replace* the intent that h1.none/h1.multiple would have
 * covered, using the same id vocabulary style as the checklist's decision log describes.
 */

export function buildCharCountCheck(charCount: number): ContentCheckItem {
  const inRange = charCount >= CHAR_COUNT_MIN && charCount <= CHAR_COUNT_MAX;
  return { id: "charCount", status: inRange ? "pass" : "warning", detail: charCount };
}

// Pass requires exactly one h1 *and* at least one h2/h3 beneath it — zero or multiple h1s is
// always a warning (spec req #1), and a lone h1 with no sub-headings at all doesn't get a pass
// either (no heading structure to speak of). `detail` always carries the raw counts regardless of
// status so the frontend can render the actual numbers either way.
export function buildHeadingsCheck(headings: ContentHeadingCounts): ContentCheckItem {
  const hasSubHeadings = headings.h2 > 0 || headings.h3 > 0;
  const pass = headings.h1 === 1 && hasSubHeadings;
  return { id: "headings", status: pass ? "pass" : "warning", detail: headings };
}

// Presence is a nice-to-have, not a deduction (spec req #1: "없음=info").
export function buildTldrCheck(hasTldr: boolean): ContentCheckItem {
  return { id: "tldr", status: hasTldr ? "pass" : "info" };
}

/** Composes all 3 content checks — `ScanService.crawling` calls this once (after the DOM
 * extraction) and assigns the result straight to `checks.content`. Order is headings (제목) then
 * charCount (본문) then tldr — title-level structure read before body-length, per user review of
 * PR #31 (2026-09-02: "제목 먼저 본문 다음 순서"). */
export function buildContentChecksFromCrawling(input: {
  charCount: number;
  headings: ContentHeadingCounts;
  hasTldr: boolean;
}): ContentCheckItem[] {
  return [
    buildHeadingsCheck(input.headings),
    buildCharCountCheck(input.charCount),
    buildTldrCheck(input.hasTldr),
  ];
}
