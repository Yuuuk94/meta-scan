// Assembles the display sentence for one `checks.aiSignals[]` row from
// `dictionaries/{ko,en}.json` templates (issue #6 ai-signals-checklist req
// #5) — mirrors buildBasicSeoMessage.ts/buildIndexingMessage.ts/
// buildPreviewsMessage.ts's id/status-keyed template lookup. The backend
// only ever returns a structured `{ id, status, detail? }` (see
// packages/meta-scan-api/src/domain/checks/aiSignalsChecks.ts), never a
// rendered sentence.
//
// 2026-08-31 redefinition (issue #6 comment "판정 기준 재정의"): absence is
// now `warning`, not `info` — see aiSignalsChecks.ts's doc comment for the
// full rationale. `promptsTxt` keeps a 3rd status (`info`) for "exists but
// essentially empty (<10 bytes)", the one id where `detail` (byteCount) can
// back that distinction; `promptObject`/`structuredData`/`faqSection` are
// binary (warning/pass). `jsRenderDelta` is unchanged (pass/warning/fail on
// magnitude — the one id in this group that was never a "presence" signal).
const TEMPLATE_KEY_BY_ID_STATUS: Record<string, string> = {
  "promptsTxt:pass": "aiSignalsPromptsTxtPass",
  "promptsTxt:info": "aiSignalsPromptsTxtInfo",
  "promptsTxt:warning": "aiSignalsPromptsTxtWarning",
  "promptObject:pass": "aiSignalsPromptObjectPass",
  "promptObject:warning": "aiSignalsPromptObjectWarning",
  "structuredData:pass": "aiSignalsStructuredDataPass",
  "structuredData:warning": "aiSignalsStructuredDataWarning",
  "faqSection:pass": "aiSignalsFaqSectionPass",
  "faqSection:warning": "aiSignalsFaqSectionWarning",
  "jsRenderDelta:pass": "aiSignalsJsRenderDeltaPass",
  "jsRenderDelta:warning": "aiSignalsJsRenderDeltaWarning",
  "jsRenderDelta:fail": "aiSignalsJsRenderDeltaFail",
};

// jsRenderDelta's `detail` is `html.deltaRatio` — a raw signed fraction
// (e.g. 0.05 = 5%), not a natural count like every other id's `detail` — so
// it needs percentage formatting instead of the raw
// `String(item.detail)` every other build*Message function uses. Sign is
// kept (not `Math.abs`'d) since the backend's own judgement is
// magnitude-based but the displayed number should still match what a
// visitor could verify (aiSignalsChecks.ts's doc comment).
function formatDetail(item: AiSignalsCheckItem): string {
  if (item.id === "jsRenderDelta" && item.detail !== undefined) {
    return String(Math.round(item.detail * 100));
  }
  return String(item.detail);
}

export function buildAiSignalsMessage(
  t: Record<string, string | string[]>,
  item: AiSignalsCheckItem
): string {
  const key = TEMPLATE_KEY_BY_ID_STATUS[`${item.id}:${item.status}`];
  const template = key ? t[key] : undefined;

  // Unknown id/status combo (e.g. a future backend-side aiSignals id this
  // function hasn't been taught yet) — fall back to the raw id rather than
  // throwing, so the results screen degrades to an ugly-but-visible label
  // instead of crashing.
  if (typeof template !== "string") return item.id;

  return item.detail === undefined
    ? template
    : template.replace("{count}", formatDetail(item));
}
