import React from "react";

import { buildBasicSeoMessage } from "@/services/buildBasicSeoMessage";
import { CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge, statusLabel } from "@/ui/molecules/StatusBadge";

// "기본 SEO" checklist card (issue #3 basic-seo-checklist req #6) — always 5
// rows (title/desc/keywords/img-alt/meta-duplicate, see
// packages/meta-scan-api/src/domain/checks/basicSeoChecks.ts), one
// <StatusBadge> + assembled sentence per row (req #3). Row layout mirrors
// <ScanHero>'s topIssues list (hairline-divided rows, badge + text) for
// visual consistency across the results screen.
//
// Deliberately doesn't use <Card> (which adds its own full hardline
// border) — this renders as one cell inside <ScanResultScreen>'s shared
// 4-column checklist grid, where the grid container itself supplies the
// 1px rule-lines between cells (design-system.md §4 "갭 대신 룰 라인" /
// §5 "체크리스트 카드 그룹은 4열 균등 그리드") instead of each card
// having its own border.
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
    <div data-slot="card" className="flex flex-col bg-card">
      <CardHeader>
        <CardTitle>{t.basicSeo}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Row divider is the light "hairline" token (--border, #E4DECB —
         * design-system.md §3 "Hairline"), not the dark card-to-card rule
         * (--foreground) the grid above uses — reusing the black rule here
         * inverted badly in dark theme and read as "wrong background"
         * (ScanZine.dc.html's `.row` uses `border-bottom:1.5px solid
         * #EFE9D8`, the same hairline family). Text first then badge,
         * `justify-between` pushes the badge to the row's right edge
         * (matches the mockup's `.row` exactly), `items-start` instead of
         * the mockup's `items-center` — a deliberate deviation: these
         * sentences are assembled from dictionaries and can wrap to 2
         * lines, where center-aligning the badge against wrapped text
         * looks off (user feedback). */}
        <div className="flex flex-col divide-y divide-border">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start justify-between gap-4 py-3.5"
            >
              <span className="text-sm font-medium text-foreground">
                {buildBasicSeoMessage(t, check)}
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
