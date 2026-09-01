const TOP_N = 5;
const SCORE_THRESHOLD = 0.9;

// Issue #9 lighthouse-suggestions req #1: `score !== null && score < 0.9`
// audits, lowest score first, top 5 — reusing Lighthouse's own
// opportunity/diagnostic scoring, not our checks[] pass/warning/fail/info
// vocabulary (ADR-007, "스코프 아님: 재분류"). `score === null` covers
// not-applicable/manual/informative audits, which Lighthouse itself never
// treats as a deduction — excluded here for the same reason.
export function buildLighthouseSuggestions(
  lighthouse: LighthouseData | null | undefined
): LighthouseSuggestion[] {
  const audits = lighthouse?.audits ?? {};

  return Object.values(audits)
    .filter(
      (audit): audit is LighthouseAuditResult & { score: number } =>
        audit.score !== null && audit.score < SCORE_THRESHOLD
    )
    .sort((a, b) => a.score - b.score)
    .slice(0, TOP_N)
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
    }));
}
