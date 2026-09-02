import React from "react";

import { Badge } from "@/ui/atoms/Badge";
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
// this exact 90/50 split) — reusing *its* thresholds, not inventing a new
// pass/warning/fail judgement of our own (req #3's "no re-judging"), but
// mapped onto this app's own color tokens rather than Lighthouse's literal
// green/orange/red: >=90 our pass green, <50 our destructive red, and
// 50-89 our info tone (text-info — 2026-09-02, "중간 인포라고": the middle
// band reuses the same muted gray this app already uses for "info" status
// elsewhere, not a 3rd distinct hue).
function scoreColorClass(score: number | null): string | undefined {
  if (score === null) return undefined;
  const percent = Math.round(score * 100);
  if (percent >= 90) return "text-success";
  if (percent < 50) return "text-destructive";
  return "text-info";
}

// Same bands/colors as scoreColorClass, reused for the suggestion rows'
// score chip too — matches <StatusBadge>'s own pass/fail/info treatment
// exactly (2026-09-02): ≥90 filled green, <50 filled red, 50-89 the same
// outline-only info style (border-info-border + text-info, no fill) as
// <StatusBadge status="info">, not a filled box.
function suggestionScoreBoxClass(score: number | null): string {
  if (score === null) return "border-[1.5px] border-info-border text-info";
  const percent = Math.round(score * 100);
  if (percent >= 90) return "bg-success text-success-foreground";
  if (percent < 50) return "bg-destructive text-destructive-foreground";
  return "border-[1.5px] border-info-border text-info";
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
      {/* The thick rule itself is full-bleed (edge-to-edge of the viewport),
       * split out from the content below it (which stays inside
       * content-frame like everything else) — `border-t-[5px]` on a div
       * that's still constrained to content-frame's max-width read as
       * "cut off" rather than a real section break (2026-09-02 user
       * review). `w-screen` + the left-1/2/-translate-x-1/2 pair is the
       * standard Tailwind full-bleed-inside-a-centered-container trick. */}
      <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 border-t-[5px] border-foreground" />
      <div className="pt-8">
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
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-px border-[1.5px] border-foreground bg-foreground">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-start gap-4 bg-card px-5 py-3.5"
                  >
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
                    {/* Reuses the generic <Badge> atom (not a hand-rolled
                     * span, not <StatusBadge> — req #2 keeps this visually
                     * distinct from our own pass/warning/fail/info
                     * vocabulary) with its fill overridden per Lighthouse's
                     * own 90/50 score bands (scoreColorClass/
                     * suggestionScoreBoxClass). */}
                    <Badge
                      variant="outline"
                      className={cn(
                        // Same fixed width as <StatusBadge> (62px) — 2026-09-02
                        // user request to keep every badge on this page the
                        // same size regardless of its text length.
                        "w-[62px] shrink-0 border-transparent",
                        suggestionScoreBoxClass(suggestion.score)
                      )}
                    >
                      {toPercent(suggestion.score)}
                    </Badge>
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
