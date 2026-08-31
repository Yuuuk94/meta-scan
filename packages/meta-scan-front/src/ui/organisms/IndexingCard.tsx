import React from "react";

import { buildIndexingMessage } from "@/services/buildIndexingMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge } from "@/ui/molecules/StatusBadge";

// "색인/크롤링(Indexing)" checklist card (issue #4 indexing-checklist req
// #5) — up to 5 rows sourced from 3 different responses and already merged
// by combineScanResults into `combined.checks.indexing` (sitemapExists from
// siteMap, sitemapDeclaredInRobots from robotsTxt, canonical/
// canonicalMultiple/metaRobotsNoindex from crawling — see that service's
// comment). Row layout/behavior mirrors <BasicSeoCard> exactly for visual
// consistency across the results screen's checklist cards.
interface IndexingCardProps extends DefaultPageProps {
  checks: IndexingCheckItem[];
}

export const IndexingCard = ({ t, checks }: IndexingCardProps) => {
  // Empty means every source call that could have contributed a row failed
  // (siteMap/robotsTxt/crawling all null) — nothing to show, same
  // "stay absent rather than render an empty shell" rule as <BasicSeoCard>.
  if (checks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.indexing}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-px border-[1.5px] border-foreground bg-foreground">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-center gap-4 bg-card px-5 py-3.5"
            >
              <StatusBadge status={check.status}>
                {check.status.toUpperCase()}
              </StatusBadge>
              <span className="text-sm font-medium text-foreground">
                {buildIndexingMessage(t, check)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
