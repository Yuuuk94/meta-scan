import React from "react";

import { NumberLabel } from "@/ui/atoms/NumberLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";

// "Lighthouse 개선 제안" card (issue #9 lighthouse-suggestions, ADR-007) —
// the last card on `/scan/:id`, standalone like <PreviewsCard> rather than a
// cell in the checklist grid (Lighthouse's scores/audits aren't a checks[]
// group).
//
// Deliberately does NOT reuse <StatusBadge> (pass/warning/fail/info is this
// app's own judgement vocabulary, docs/design-system.md §8) — everything
// here is Lighthouse's own scoring, reused as-is (req #3, no re-judging),
// and ADR-007's whole point is keeping this visually distinct from
// <ScanHero>'s topIssues so the two sources of judgement don't get confused
// (req #2). Score numbers use the same Big Shoulders Display treatment as
// <NumberLabel> elsewhere, and suggestion rows render score as a plain
// hairline-outlined number chip instead of a colored badge.
const CATEGORY_ORDER: Array<{
  key: keyof CombinedLighthouse["scores"];
  labelKey: "performance" | "seo" | "accessibility" | "bestPractices";
}> = [
  { key: "performance", labelKey: "performance" },
  { key: "seo", labelKey: "seo" },
  { key: "accessibility", labelKey: "accessibility" },
  { key: "bestPractices", labelKey: "bestPractices" },
];

// Lighthouse itself displays 0–1 scores as 0–100 (its own CLI/report/HTML
// convention) — rounding for display isn't the same as re-judging into our
// pass/warning/fail/info vocabulary (req #3 only forbids the latter).
function toPercent(score: number | null): string | null {
  if (score === null) return null;
  return String(Math.round(score * 100));
}

interface LighthouseCardProps extends DefaultPageProps {
  lighthouse: CombinedLighthouse;
}

export const LighthouseCard = ({ t, lighthouse }: LighthouseCardProps) => {
  const { scores, suggestions } = lighthouse;

  const hasAnyScore = CATEGORY_ORDER.some(
    ({ key }) => scores[key] !== null
  );

  // Same "stay absent rather than render an empty shell" rule as
  // <BasicSeoCard>/<IndexingCard>/<PreviewsCard> — nothing to show when the
  // lighthouse call never came back with usable data.
  if (!hasAnyScore && suggestions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.lighthouseSuggestions}</CardTitle>
        <p className="text-xs text-muted-foreground">
          <span className="sm:hidden">{t.lighthouseSuggestionsHintMobile}</span>
          <span className="hidden sm:inline">{t.lighthouseSuggestionsHint}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div>
          <span className="text-[11.5px] font-bold tracking-[.04em] text-muted-foreground">
            {t.lighthouseScores}
          </span>
          <div className="mt-2 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {CATEGORY_ORDER.map(({ key, labelKey }) => {
              const percent = toPercent(scores[key]);
              return (
                <div
                  key={key}
                  className="flex flex-col gap-1 border-[1.5px] border-border px-3.5 py-3"
                >
                  <span className="text-[11px] text-muted-foreground">
                    {t[labelKey]}
                  </span>
                  <NumberLabel
                    value={percent ?? "—"}
                    className="text-2xl"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {suggestions.length > 0 ? (
          <div className="mt-6 flex flex-col gap-px border-[1.5px] border-foreground bg-foreground">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="flex items-start gap-4 bg-card px-5 py-3.5"
              >
                <NumberLabel value={index + 1} className="text-sm" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {suggestion.title}
                  </span>
                  {suggestion.description ? (
                    <span className="text-xs text-muted-foreground">
                      {suggestion.description}
                    </span>
                  ) : null}
                </div>
                {/* Hairline outline number, not a colored StatusBadge —
                 * Lighthouse's own score, not our pass/warning/fail/info
                 * verdict (req #2). */}
                <span className="shrink-0 border-[1.5px] border-info-border px-[9px] py-[3px] text-xs font-bold tracking-[.04em] text-info">
                  {toPercent(suggestion.score)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
