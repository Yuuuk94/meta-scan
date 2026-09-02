import React from "react";

import { buildContentMessage } from "@/services/buildContentMessage";
import { CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge, statusLabel } from "@/ui/molecules/StatusBadge";

// "콘텐츠 품질(Content Stats)" checklist card (issue #7 content-stats-checklist
// req #4) — always 3 rows (charCount/headings/tldr, see
// packages/meta-scan-api/src/domain/checks/contentChecks.ts), one
// <StatusBadge> + assembled sentence per row. Row layout/behavior mirrors
// <BasicSeoCard>/<IndexingCard> exactly for visual consistency across the
// results screen's checklist cards.
//
// Same as <BasicSeoCard>/<IndexingCard>: no <Card> wrapper here — it's a
// cell in <ScanResultScreen>'s shared checklist grid, which supplies the
// rule-line borders between cells itself (design-system.md §4/§5).
interface ContentStatsCardProps extends DefaultPageProps {
  checks: ContentCheckItem[];
}

export const ContentStatsCard = ({ t, checks }: ContentStatsCardProps) => {
  // No crawling data (that call failed, or hasn't happened) — nothing to
  // show, same "stay absent rather than render an empty shell" rule as
  // <BasicSeoCard>/<IndexingCard>.
  if (checks.length === 0) return null;

  return (
    <div data-slot="card" className="flex flex-col bg-card">
      <CardHeader>
        <CardTitle>{t.contentStats}</CardTitle>
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
                {buildContentMessage(t, check)}
              </span>
              <StatusBadge status={check.status}>
                {statusLabel(check.status)}
              </StatusBadge>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};
