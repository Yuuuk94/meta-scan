// Assembles the display sentence for one `checks.content[]` row from
// `dictionaries/{ko,en}.json` templates (issue #7 content-stats-checklist
// req #4) — same "backend only returns a structured { id, status, detail? },
// frontend assembles the translatable sentence" pattern as
// buildBasicSeoMessage/buildIndexingMessage.
//
// Keyed by `${id}:${status}` (same convention as buildBasicSeoMessage) since
// every id here has more than one possible message depending on status.
const TEMPLATE_KEY_BY_ID_STATUS: Record<string, string> = {
  "charCount:pass": "contentCharCountPass",
  "charCount:warning": "contentCharCountWarning",
  "headings:pass": "contentHeadingsPass",
  "headings:warning": "contentHeadingsWarning",
  "tldr:pass": "contentTldrPass",
  "tldr:info": "contentTldrInfo",
};

// `headings`'s `detail` is the raw `ContentHeadingCounts` object
// ({ h1, h2, h3 }), not a plain number like every other content check id's
// `detail` — the h1 count is the only piece the (currently single) headings
// template needs, so this formats it the same way buildAiSignalsMessage's
// jsRenderDelta formatDetail handles its own non-natural detail shape.
function formatDetail(item: ContentCheckItem): string {
  if (
    item.id === "headings" &&
    item.detail !== undefined &&
    typeof item.detail === "object"
  ) {
    return String(item.detail.h1);
  }
  return String(item.detail);
}

export function buildContentMessage(
  t: Record<string, string | string[]>,
  item: ContentCheckItem
): string {
  const key = TEMPLATE_KEY_BY_ID_STATUS[`${item.id}:${item.status}`];
  const template = key ? t[key] : undefined;

  // Unknown id/status combo — fall back to the raw id rather than throwing,
  // same "degrade to an ugly-but-visible label" rule as buildBasicSeoMessage.
  if (typeof template !== "string") return item.id;

  return item.detail === undefined
    ? template
    : template.replace("{count}", formatDetail(item));
}
