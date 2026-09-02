import React from "react";

import { buildIndexingMessage } from "@/services/buildIndexingMessage";
import { CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge, statusLabel } from "@/ui/molecules/StatusBadge";

// "색인/크롤링(Indexing)" checklist card (issue #4 indexing-checklist req
// #5) — up to 5 rows sourced from 3 different responses and already merged
// by combineScanResults into `combined.checks.indexing` (sitemapExists from
// siteMap, sitemapDeclaredInRobots from robotsTxt, canonical/
// canonicalMultiple/metaRobotsNoindex from crawling — see that service's
// comment). Row layout/behavior mirrors <BasicSeoCard> exactly for visual
// consistency across the results screen's checklist cards.
//
// Same as <BasicSeoCard>: no <Card> wrapper here — it's a cell in
// <ScanResultScreen>'s shared 4-column checklist grid, which supplies the
// rule-line borders between cells itself (design-system.md §4/§5).
interface IndexingCardProps extends DefaultPageProps {
  checks: IndexingCheckItem[];
}

export const IndexingCard = ({ t, checks }: IndexingCardProps) => {
  // Empty means every source call that could have contributed a row failed
  // (siteMap/robotsTxt/crawling all null) — nothing to show, same
  // "stay absent rather than render an empty shell" rule as <BasicSeoCard>.
  if (checks.length === 0) return null;

  return (
    <div data-slot="card" className="flex flex-col bg-card">
      <CardHeader>
        <CardTitle>{t.indexing}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* See <BasicSeoCard> for why: hairline (--border) row dividers
         * instead of the dark card-to-card rule, text-then-badge with
         * justify-between (badge on the right, matches ScanZine.dc.html's
         * `.row`), items-start instead of the mockup's items-center since
         * these sentences can wrap. */}
        <div className="flex flex-col divide-y divide-border">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start justify-between gap-4 py-3.5"
            >
              <span className="text-sm font-medium text-foreground">
                {buildIndexingMessage(t, check)}
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
