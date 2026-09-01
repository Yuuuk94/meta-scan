// Row copy for the "AI 신호(AI Signals/AEO)" card (issue #6
// ai-signals-checklist req #5). Reworked 2026-09-01 twice:
// 1. Short static label (`getAiSignalsLabel`) instead of a full sentence
//    per row (user feedback: "멘트가 간결했음 좋겠네").
// 2. Detail text ("없음"/"1%"/"발견됨") renders as muted text next to the
//    label (`getAiSignalsDetailSuffix`), not packed inside the badge —
//    same treatment <AiSignalsCard> already used for structuredData's type
//    list, now applied to every row; the badge itself only ever shows the
//    plain status word (PASS/WARNING/INFO/FAIL), same as every other
//    checklist card's <StatusBadge> in this app.

const LABEL_KEY_BY_ID: Record<string, string> = {
  promptsTxt: "aiSignalsPromptsTxtLabel",
  promptObject: "aiSignalsPromptObjectLabel",
  structuredData: "aiSignalsStructuredDataLabel",
  faqSection: "aiSignalsFaqSectionLabel",
  jsRenderDelta: "aiSignalsJsRenderDeltaLabel",
};

export function getAiSignalsLabel(
  t: Record<string, string | string[]>,
  id: string
): string {
  const key = LABEL_KEY_BY_ID[id];
  const label = key ? t[key] : undefined;
  return typeof label === "string" ? label : id;
}

// 2026-08-31 redefinition (issue #6 comment "판정 기준 재정의"): absence is
// `warning`, not `info` — see aiSignalsChecks.ts's doc comment. `promptsTxt`
// keeps a 3rd status (`info`) for "exists but essentially empty (<10
// bytes)" — the one id where `detail` (byteCount) backs that distinction.
const SUFFIX_KEY_BY_ID_STATUS: Record<string, string> = {
  "promptsTxt:pass": "aiSignalsPromptsTxtPassSuffix",
  "promptsTxt:info": "aiSignalsPromptsTxtInfoSuffix",
  "promptsTxt:warning": "aiSignalsPromptsTxtWarningSuffix",
  "promptObject:pass": "aiSignalsPromptObjectPassSuffix",
  "promptObject:warning": "aiSignalsPromptObjectWarningSuffix",
  "structuredData:pass": "aiSignalsStructuredDataPassSuffix",
  "structuredData:warning": "aiSignalsStructuredDataWarningSuffix",
  "faqSection:pass": "aiSignalsFaqSectionPassSuffix",
  "faqSection:warning": "aiSignalsFaqSectionWarningSuffix",
  "jsRenderDelta:pass": "aiSignalsJsRenderDeltaPassSuffix",
  "jsRenderDelta:warning": "aiSignalsJsRenderDeltaWarningSuffix",
  "jsRenderDelta:fail": "aiSignalsJsRenderDeltaFailSuffix",
};

// jsRenderDelta's `detail` is `html.deltaRatio` — a raw signed fraction
// (e.g. 0.05 = 5%), not a natural count like every other id's `detail` — so
// it needs percentage formatting instead of the raw `String(item.detail)`.
// Sign is kept (not `Math.abs`'d) since the judgement is magnitude-based
// but the displayed number should still match what a visitor could verify.
function formatDetail(item: AiSignalsCheckItem): string {
  if (item.id === "jsRenderDelta" && item.detail !== undefined) {
    return String(Math.round(item.detail * 100));
  }
  return String(item.detail);
}

/** "없음" / "1%" / "발견됨" — muted detail text next to the row's label.
 * Returns `undefined` (render nothing) for an unknown id/status combo,
 * rather than falling back to a raw key or empty string. */
export function getAiSignalsDetailSuffix(
  t: Record<string, string | string[]>,
  item: AiSignalsCheckItem
): string | undefined {
  const key = SUFFIX_KEY_BY_ID_STATUS[`${item.id}:${item.status}`];
  const template = key ? t[key] : undefined;

  if (typeof template !== "string") return undefined;

  return item.detail === undefined
    ? template
    : template.replace("{count}", formatDetail(item));
}
