import React from "react";

import { NumberLabel } from "@/ui/atoms/NumberLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { cn } from "@/utils/cn";

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

// Lighthouse's own official score bands (chrome DevTools/CLI/report all use
// this exact 90/50 split) — reusing *its* convention, not inventing a new
// pass/warning/fail judgement of our own, so this doesn't conflict with req
// #3's "no re-judging". Mapped onto this app's own color tokens per user
// direction: >=90 our pass green, 50-89 plain ink (no special color), <50
// our warning orange.
function scoreColorClass(score: number | null): string | undefined {
  if (score === null) return undefined;
  const percent = Math.round(score * 100);
  if (percent >= 90) return "text-success";
  if (percent < 50) return "text-warning";
  return undefined;
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
    <>
      {/* Score grid is its own block, not inside the suggestions Card below
       * — matches ScanZine.dc.html (separate "Lighthouse 점수" section
       * above a standalone "Lighthouse 개선 제안" card, not one combined
       * card) and reinforces req #2 (visually distinct from our own
       * judgement) with a thick top rule marking a real section break,
       * same weight as the header/footer rules (design-system.md §5).
       * Cells are literal white regardless of theme — this is Lighthouse's
       * own visual identity being surfaced as-is (req #3: no re-judging),
       * not this app's card/popover tokens, which are identical to each
       * other in dark mode and wouldn't read as "a different source." */}
      <div className="mt-8 border-t-[5px] border-foreground pt-8">
        <h3 className="font-display text-[15px] font-extrabold text-foreground">
          {t.lighthouseScores}
        </h3>
        {/* One shared dark border + rule-line grid (gap-px + bg-foreground
         * trick, same as everywhere else in this app), not a border per
         * cell — cells are just bg-white panes inside it, matching the
         * mockup's single grid border rather than 4 separately-outlined
         * boxes. Number first (large), label below (small, muted) — was
         * reversed before. */}
        <div className="mt-2 grid grid-cols-2 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-4">
          {CATEGORY_ORDER.map(({ key, labelKey }) => {
            const percent = toPercent(scores[key]);
            return (
              <div key={key} className="bg-white px-3.5 py-3 text-[#141311]">
                <NumberLabel
                  value={percent ?? "—"}
                  className={cn("text-2xl", scoreColorClass(scores[key]))}
                />
                <div className="mt-1 text-[11px] text-[#8a8577]">
                  {t[labelKey]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {suggestions.length > 0 ? (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.lighthouseSuggestions}</CardTitle>
              <p className="text-xs text-muted-foreground">
                <span className="sm:hidden">{t.lighthouseSuggestionsHintMobile}</span>
                <span className="hidden sm:inline">{t.lighthouseSuggestionsHint}</span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-px border-[1.5px] border-foreground bg-foreground">
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
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
};
