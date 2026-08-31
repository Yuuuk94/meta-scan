import React from "react";

import { buildBasicSeoMessage } from "@/services/buildBasicSeoMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge } from "@/ui/molecules/StatusBadge";

// "기본 SEO" checklist card (issue #3 basic-seo-checklist req #6) — always 5
// rows (title/desc/keywords/img-alt/meta-duplicate, see
// packages/meta-scan-api/src/domain/checks/basicSeoChecks.ts), one
// <StatusBadge> + assembled sentence per row (req #3). Row layout mirrors
// <ScanHero>'s topIssues list (hairline-divided rows, badge + text) for
// visual consistency across the results screen.
interface BasicSeoCardProps extends DefaultPageProps {
  checks: BasicSeoCheckItem[];
}

export const BasicSeoCard = ({ t, checks }: BasicSeoCardProps) => {
  // No crawling data (that call failed, or hasn't happened) — nothing to
  // show. The raw-results tile above already surfaces "확인 불가"/Unavailable
  // for a failed crawling call, so this card just stays absent rather than
  // rendering an empty shell.
  if (checks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.basicSeo}</CardTitle>
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
                {buildBasicSeoMessage(t, check)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
