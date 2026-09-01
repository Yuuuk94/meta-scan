import React from "react";

import { getAiSignalsDetailSuffix, getAiSignalsLabel } from "@/services/buildAiSignalsMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge } from "@/ui/molecules/StatusBadge";

// "AI 신호(AI Signals/AEO)" checklist card (issue #6 ai-signals-checklist req
// #5) — 5 rows sourced from `combined.checks.aiSignals` (a straight
// passthrough of the crawling response, see combineScanResults.ts's
// comment): promptsTxt/promptObject/structuredData/faqSection/
// jsRenderDelta, in that backend-composed order (aiSignalsChecks.ts's
// `buildAiSignalsChecksFromCrawling`).
//
// 2026-08-31 redefinition (issue #6 comment "판정 기준 재정의"): absence of
// an AI signal is now `warning` (filled box, same visual weight as the
// other checklist cards' warnings), not `info` — the previous "absence
// isn't a deduction" framing is gone, so this card doesn't suppress
// anything for absent rows anymore. `info` still exists in this group, but
// only for `promptsTxt` when it's present yet essentially empty (<10
// bytes) — that's the one case <StatusBadge>'s outline-only `info` variant
// (design-system.md §2/§8) still renders here.
//
// Like <PreviewsCard> (and unlike <BasicSeoCard>/<IndexingCard>, which are
// cells inside <ScanResultScreen>'s shared 4-column checklist grid), this
// renders as its own full hardline <Card> — the design intake spec
// (ScanZine.dc.html) places "AI Signals" as a standalone block, and
// specifically *before* the "지금 고쳐야 할 것" fix-now section (<ScanHero>),
// not grouped with the other checklist cards.
interface AiSignalsCardProps extends DefaultPageProps {
  checks: AiSignalsCheckItem[];
  /** Raw passthrough of extract.structuredDataTypes (combineScanResults —
   * no judgement here, just display). Shown as a muted suffix next to the
   * "구조화 데이터" row's label when non-empty, matching ScanZine.dc.html
   * ("구조화 데이터 WebPage, FAQPage"). */
  structuredDataTypes?: string[];
}

export const AiSignalsCard = ({
  t,
  checks,
  structuredDataTypes,
}: AiSignalsCardProps) => {
  // No crawling data (that call failed, or hasn't happened) — every row is
  // sourced from crawling alone, so there's nothing to show. Same "stay
  // absent rather than render an empty shell" rule as
  // <BasicSeoCard>/<IndexingCard>/<PreviewsCard>.
  if (checks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[11.5px] font-bold tracking-[.04em] text-muted-foreground">
              {t.aiSignalsEyebrow}
            </span>
            <CardTitle className="mt-1 text-xl">{t.aiSignals}</CardTitle>
          </div>
          {/* Hint is dropped entirely on mobile, not just repositioned
           * (design intake: ScanMobile.dc.html has no right-aligned hint
           * text at all) — `hidden sm:block` matches that, same pattern as
           * <PreviewsCard>'s desktop-only elements. */}
          <span className="hidden shrink-0 pt-1 text-xs text-muted-foreground sm:block">
            {t.aiSignalsHint}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Short raw label + muted detail text next to it ("없음"/"1%"/
         * "발견됨"), badge shows only the plain status word — same pattern
         * <BasicSeoCard>/<IndexingCard> use, and the same treatment
         * ScanZine.dc.html itself uses for the structuredData row
         * specifically ("구조화 데이터 WebPage, FAQPage" + a bare "PASS"
         * badge), just applied to every row here instead of just that one
         * (user feedback — wanted the detail out of the badge). */}
        <div className="flex flex-col divide-y divide-border">
          {checks.map((check) => {
            // Gated on the backend's own "pass" judgement, not on
            // `structuredDataTypes` existing/being non-empty — deciding
            // "present" from the raw array ourselves would be the frontend
            // quietly re-judging, which this app never does (PRD §4: 판정은
            // 백엔드, 프론트는 취합만). If the two ever disagreed, following
            // status keeps the badge and this suffix from contradicting
            // each other.
            const detail =
              check.id === "structuredData" &&
              check.status === "pass" &&
              structuredDataTypes?.length
                ? structuredDataTypes.join(", ")
                : getAiSignalsDetailSuffix(t, check);

            return (
              <div
                key={check.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <span className="text-sm font-medium text-foreground">
                  {getAiSignalsLabel(t, check.id)}
                  {detail ? (
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      {detail}
                    </span>
                  ) : null}
                </span>
                <StatusBadge status={check.status}>
                  {check.status.toUpperCase()}
                </StatusBadge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
