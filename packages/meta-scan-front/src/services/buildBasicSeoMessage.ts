// Assembles the display sentence for one `checks.basicSeo[]` row from
// `dictionaries/{ko,en}.json` templates (issue #3 basic-seo-checklist req
// #3) — the backend only ever returns a structured `{ id, status, detail? }`
// (packages/meta-scan-api/src/domain/checks/basicSeoChecks.ts), never a
// rendered sentence, so this stays translatable and doesn't get baked into
// whatever locale was active at scan time (localStorage-persisted results,
// see stores/scanStore.ts).
//
// Keyed by `${id}:${status}` where a check id has more than one possible
// message (e.g. title.length reads very differently at warning vs pass);
// ids that only ever appear in one status (title.missing is always fail,
// desc.missing is always warning) fall back to a plain `id` lookup instead
// of duplicating the same template under two keys.
const TEMPLATE_KEY_BY_ID_STATUS: Record<string, string> = {
  "title.missing": "basicSeoTitleMissing",
  "title.length:warning": "basicSeoTitleLengthWarning",
  "title.length:pass": "basicSeoTitleLengthPass",
  "desc.missing": "basicSeoDescMissing",
  "desc.length:warning": "basicSeoDescLengthWarning",
  "desc.length:pass": "basicSeoDescLengthPass",
  "keywords.deprecated:info": "basicSeoKeywordsInfo",
  "keywords.deprecated:pass": "basicSeoKeywordsPass",
  "img.altMissing:warning": "basicSeoImgAltWarning",
  "img.altMissing:pass": "basicSeoImgAltPass",
  "meta.duplicate:info": "basicSeoMetaDuplicateInfo",
  "meta.duplicate:pass": "basicSeoMetaDuplicatePass",
};

export function buildBasicSeoMessage(
  t: Record<string, string | string[]>,
  item: BasicSeoCheckItem
): string {
  const key =
    TEMPLATE_KEY_BY_ID_STATUS[`${item.id}:${item.status}`] ??
    TEMPLATE_KEY_BY_ID_STATUS[item.id];
  const template = key ? t[key] : undefined;

  // Unknown id/status combo (e.g. a future basicSeo id this function hasn't
  // been taught yet) — fall back to the raw id rather than throwing, so a
  // backend-side addition degrades to an ugly-but-visible label instead of
  // crashing the results screen.
  if (typeof template !== "string") return item.id;

  return item.detail === undefined
    ? template
    : template.replace("{count}", String(item.detail));
}
