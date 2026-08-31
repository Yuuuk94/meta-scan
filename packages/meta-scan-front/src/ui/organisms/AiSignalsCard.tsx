import React from "react";

import { buildAiSignalsMessage } from "@/services/buildAiSignalsMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge } from "@/ui/molecules/StatusBadge";

// "AI 신호(AI Signals/AEO)" checklist card (issue #6 ai-signals-checklist req
// #5) — 5 rows sourced from `combined.checks.aiSignals` (a straight
// passthrough of the crawling response, see combineScanResults.ts's
// comment): promptsTxt/promptObject/structuredData/faqSection/
// jsRenderDelta, in that backend-composed order (aiSignalsChecks.ts's
// `buildAiSignalsChecksFromCrawling`).
//
// `info` never carries less visual weight *by suppressing anything* here —
// <StatusBadge>'s own `info` variant already renders outline-only instead of
// a filled box (design-system.md §2/§8's "info is the one deliberate
// exception" rule), which is what keeps an absent AI signal from reading as
// a deduction. This card doesn't need its own extra styling on top of that.
//
// Like <PreviewsCard> (and unlike <BasicSeoCard>/<IndexingCard>, which are
// cells inside <ScanResultScreen>'s shared 4-column checklist grid), this
// renders as its own full hardline <Card> — the design intake spec
// (ScanZine.dc.html) places "AI Signals" as a standalone block, and
// specifically *before* the "지금 고쳐야 할 것" fix-now section (<ScanHero>),
// not grouped with the other checklist cards.
interface AiSignalsCardProps extends DefaultPageProps {
  checks: AiSignalsCheckItem[];
}

export const AiSignalsCard = ({ t, checks }: AiSignalsCardProps) => {
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
        {/* Hairline row dividers, text-then-badge with justify-between —
         * same row treatment as <BasicSeoCard>/<IndexingCard> for visual
         * consistency across the results screen's checklist cards. */}
        <div className="flex flex-col divide-y divide-border">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start justify-between gap-4 py-3.5"
            >
              <span className="text-sm font-medium text-foreground">
                {buildAiSignalsMessage(t, check)}
              </span>
              <StatusBadge status={check.status}>
                {check.status.toUpperCase()}
              </StatusBadge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
