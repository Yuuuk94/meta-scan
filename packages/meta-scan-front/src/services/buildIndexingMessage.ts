// Assembles the display sentence for one `checks.indexing[]` row from
// `dictionaries/{ko,en}.json` templates (issue #4 indexing-checklist req #5)
// — mirrors buildBasicSeoMessage.ts's id/status-keyed template lookup. The
// backend only ever returns a structured `{ id, status, detail? }` (see
// packages/meta-scan-api/src/domain/checks/indexingChecks.ts), never a
// rendered sentence.
//
// Keyed by `${id}:${status}` since every current indexing id has more than
// one possible status/message (sitemapExists pass/warning,
// sitemapDeclaredInRobots pass/info, canonical pass/info,
// canonicalMultiple pass/fail, metaRobotsNoindex pass/fail) — unlike
// buildBasicSeoMessage, there's no single-status id here that would need the
// plain-`id` fallback key, but the fallback lookup is kept for parity/safety
// against a future id that only ever appears in one status.
const TEMPLATE_KEY_BY_ID_STATUS: Record<string, string> = {
  "sitemapExists:pass": "indexingSitemapExistsPass",
  "sitemapExists:warning": "indexingSitemapExistsWarning",
  "sitemapDeclaredInRobots:pass": "indexingSitemapDeclaredPass",
  "sitemapDeclaredInRobots:info": "indexingSitemapDeclaredInfo",
  "canonical:pass": "indexingCanonicalPass",
  "canonical:info": "indexingCanonicalInfo",
  "canonicalMultiple:pass": "indexingCanonicalMultiplePass",
  "canonicalMultiple:fail": "indexingCanonicalMultipleFail",
  "metaRobotsNoindex:pass": "indexingMetaRobotsNoindexPass",
  "metaRobotsNoindex:fail": "indexingMetaRobotsNoindexFail",
};

export function buildIndexingMessage(
  t: Record<string, string | string[]>,
  item: IndexingCheckItem
): string {
  const key =
    TEMPLATE_KEY_BY_ID_STATUS[`${item.id}:${item.status}`] ??
    TEMPLATE_KEY_BY_ID_STATUS[item.id];
  const template = key ? t[key] : undefined;

  // Unknown id/status combo (e.g. a future backend-side indexing id this
  // function hasn't been taught yet) — fall back to the raw id rather than
  // throwing, so the results screen degrades to an ugly-but-visible label
  // instead of crashing.
  if (typeof template !== "string") return item.id;

  return item.detail === undefined
    ? template
    : template.replace("{count}", String(item.detail));
}
