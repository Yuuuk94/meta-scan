// Assembles the display sentence for one `checks.i18nUx[]` row from
// `dictionaries/{ko,en}.json` templates (issue #8 i18n-ux-checklist req #3)
// — mirrors buildPreviewsMessage.ts's id/status-keyed template lookup. The
// backend only ever returns a structured `{ id, status }` (see
// packages/meta-scan-api/src/domain/checks/i18nUxChecks.ts), never a
// rendered sentence, and neither id (hreflang/viewport) ever carries
// `detail` — existence-only checks, same as previews.
const TEMPLATE_KEY_BY_ID_STATUS: Record<string, string> = {
  "hreflang:pass": "i18nUxHreflangPass",
  "hreflang:info": "i18nUxHreflangInfo",
  "viewport:pass": "i18nUxViewportPass",
  "viewport:warning": "i18nUxViewportWarning",
};

export function buildI18nUxMessage(
  t: Record<string, string | string[]>,
  item: I18nUxCheckItem
): string {
  const key = TEMPLATE_KEY_BY_ID_STATUS[`${item.id}:${item.status}`];
  const template = key ? t[key] : undefined;

  // Unknown id/status combo — fall back to the raw id rather than throwing,
  // same "degrade to an ugly-but-visible label" rule as
  // buildPreviewsMessage/buildContentMessage.
  if (typeof template !== "string") return item.id;

  return template;
}
