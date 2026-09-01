// Issue #9 lighthouse-suggestions req #3: Lighthouse's 4 category scores are
// Google's own grading — passed through as-is, never re-judged/summed
// (PRD §3.7, ADR-007). This function's only job is picking the 4 fixed
// categories out of `lhr.categories` (a `Record<string, ...>` keyed by
// Lighthouse's own category ids) and normalizing the one id that doesn't
// match our field name (`best-practices` -> `bestPractices`) — no scoring
// logic.
const CATEGORY_KEYS: Record<string, keyof CombinedLighthouse["scores"]> = {
  performance: "performance",
  seo: "seo",
  accessibility: "accessibility",
  "best-practices": "bestPractices",
};

export function buildLighthouseScores(
  lighthouse: LighthouseData | null | undefined
): CombinedLighthouse["scores"] {
  const categories = lighthouse?.categories ?? {};

  const scores: CombinedLighthouse["scores"] = {
    performance: null,
    seo: null,
    accessibility: null,
    bestPractices: null,
  };

  for (const [lhCategoryId, field] of Object.entries(CATEGORY_KEYS)) {
    scores[field] = categories[lhCategoryId]?.score ?? null;
  }

  return scores;
}
