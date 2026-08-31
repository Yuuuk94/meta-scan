// Assembles the display sentence for one `checks.previews[]` row from
// `dictionaries/{ko,en}.json` templates (issue #5 previews-checklist req #4)
// — mirrors buildBasicSeoMessage.ts/buildIndexingMessage.ts's id/status-keyed
// template lookup. The backend only ever returns a structured
// `{ id, status, detail? }` (see
// packages/meta-scan-api/src/domain/checks/previewsChecks.ts), never a
// rendered sentence.
//
// Keyed by `${id}:${status}` since every current previews id has 2 possible
// statuses (pass/warning — this checklist doesn't use fail/info at all, per
// the coordinator decision recorded in previewsChecks.ts's doc comment).
const TEMPLATE_KEY_BY_ID_STATUS: Record<string, string> = {
  "ogImageDimensions:pass": "previewsOgImageDimensionsPass",
  "ogImageDimensions:warning": "previewsOgImageDimensionsWarning",
  "favicon:pass": "previewsFaviconPass",
  "favicon:warning": "previewsFaviconWarning",
  "ogRequiredTags:pass": "previewsOgRequiredTagsPass",
  "ogRequiredTags:warning": "previewsOgRequiredTagsWarning",
  "twitterCard:pass": "previewsTwitterCardPass",
  "twitterCard:warning": "previewsTwitterCardWarning",
};

export function buildPreviewsMessage(
  t: Record<string, string | string[]>,
  item: PreviewsCheckItem
): string {
  const key =
    TEMPLATE_KEY_BY_ID_STATUS[`${item.id}:${item.status}`] ??
    TEMPLATE_KEY_BY_ID_STATUS[item.id];
  const template = key ? t[key] : undefined;

  // Unknown id/status combo (e.g. a future backend-side previews id this
  // function hasn't been taught yet) — fall back to the raw id rather than
  // throwing, so the results screen degrades to an ugly-but-visible label
  // instead of crashing.
  if (typeof template !== "string") return item.id;

  return item.detail === undefined
    ? template
    : template.replace("{count}", String(item.detail));
}
