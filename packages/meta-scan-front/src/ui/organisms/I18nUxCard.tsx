import React from "react";

import { buildI18nUxMessage } from "@/services/buildI18nUxMessage";
import { CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge } from "@/ui/molecules/StatusBadge";

// "국제화/UX(i18n/UX)" checklist card (issue #8 i18n-ux-checklist req #3) —
// always 2 rows (hreflang/viewport, see
// packages/meta-scan-api/src/domain/checks/i18nUxChecks.ts), one
// <StatusBadge> + assembled sentence per row. Row layout/behavior mirrors
// <BasicSeoCard>/<IndexingCard>/<ContentStatsCard> exactly for visual
// consistency across the results screen's checklist cards — the spec's
// "비고" explicitly calls out keeping this as its own card rather than
// merging it into an existing one despite the small row count.
//
// Same as <BasicSeoCard>/<IndexingCard>/<ContentStatsCard>: no <Card>
// wrapper here — it's a cell in <ScanResultScreen>'s shared checklist grid,
// which supplies the rule-line borders between cells itself
// (design-system.md §4/§5).
//
// Title copy uses `t.intlUx` (not `t.i18nUx`) — `dictionaries/{ko,en}.json`
// already had an `intlUx` key ("국제화·UX"/"Intl & UX") sitting unused since
// an earlier design pass anticipated this card; reused it here rather than
// adding a second, near-duplicate title key. Row templates below are keyed
// `i18nUx*`, matching the backend's `checks.i18nUx` group id (same "title
// key can diverge from the row-template prefix" pattern as
// <ContentStatsCard> — title `contentStats`, rows `content*`).
interface I18nUxCardProps extends DefaultPageProps {
  checks: I18nUxCheckItem[];
}

export const I18nUxCard = ({ t, checks }: I18nUxCardProps) => {
  // No crawling data (that call failed, or hasn't happened) — nothing to
  // show, same "stay absent rather than render an empty shell" rule as the
  // other checklist cards.
  if (checks.length === 0) return null;

  return (
    <div data-slot="card" className="flex flex-col bg-card">
      <CardHeader>
        <CardTitle>{t.intlUx}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* See <BasicSeoCard> for why: hairline (--border) row dividers
         * instead of the dark card-to-card rule, text-then-badge with
         * justify-between (badge on the right), items-start instead of
         * items-center since these sentences can wrap. */}
        <div className="flex flex-col divide-y divide-border">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start justify-between gap-4 py-3.5"
            >
              <span className="text-sm font-medium text-foreground">
                {buildI18nUxMessage(t, check)}
              </span>
              <StatusBadge status={check.status}>
                {check.status.toUpperCase()}
              </StatusBadge>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};
