import React from "react";

import { buildPreviewsMessage } from "@/services/buildPreviewsMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge } from "@/ui/molecules/StatusBadge";

// "미리보기(Previews) — OG · Twitter" card (issue #5 previews-checklist req
// #4) — 4 badge rows sourced from `combined.checks.previews` (a straight
// passthrough of the crawling response, see combineScanResults.ts's
// comment), plus 2 card-preview mockups (Google/Twitter-style) rendered
// from the raw og:*/twitter:* values that were already exposed via
// `combined.openGraph`/`combined.twitter` (req #3 — no new field needed,
// see scan.d.ts's CombinedScanResult comment).
//
// Unlike <BasicSeoCard>/<IndexingCard> (which are cells inside
// <ScanResultScreen>'s shared 4-column rule-line grid), this renders as its
// own full hardline <Card> — the design intake spec's layout (§3.5 item 6)
// places "Previews" as a standalone block *after* that 4-card grid, not a
// 5th cell inside it.
function getHostname(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

interface PreviewsCardProps extends DefaultPageProps {
  checks: PreviewsCheckItem[];
  url?: string;
  title?: string;
  description?: string;
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
}

export const PreviewsCard = ({
  t,
  checks,
  url,
  title,
  description,
  openGraph,
  twitter,
}: PreviewsCardProps) => {
  // No crawling data (that call failed, or hasn't happened) — every row and
  // both mockups are sourced from crawling alone, so there's nothing to
  // show. Same "stay absent rather than render an empty shell" rule as
  // <BasicSeoCard>/<IndexingCard>.
  if (checks.length === 0) return null;

  const hostname = getHostname(url);

  const ogTitle = openGraph?.["og:title"] || title;
  const ogDescription = openGraph?.["og:description"] || description;
  const twitterTitle = twitter?.["twitter:title"] || ogTitle;
  const twitterDescription = twitter?.["twitter:description"] || ogDescription;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.previews}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 4 badges in one row (ScanZine.dc.html: grid-template-columns:
         * repeat(4,1fr), real 14px gap — this specific grid was never
         * flagged in the design-intake's gap-vs-rule-line conflict, unlike
         * the checklist card grid and the mockup grid below, so it keeps
         * its literal gap). Muted label + badge, justify-between per cell.
         * 2 columns under sm since 4-across is cramped on a phone. */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {checks.map((check) => (
            <div key={check.id} className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] text-muted-foreground">
                {buildPreviewsMessage(t, check)}
              </span>
              <StatusBadge status={check.status}>
                {check.status.toUpperCase()}
              </StatusBadge>
            </div>
          ))}
        </div>

        {/* 2 card-preview mockups (Google/Twitter-style) — 20px gap ->
         * 1px rule-line per the design intake's conflict resolution
         * (spec.md §6 decision #2: same "gap 대신 룰 라인" treatment as the
         * checklist card grid above, applied here too). Image area is a
         * solid placeholder block (--border token, matches the mockup's
         * literal #E4DECB fill) — no "이미지 없음" text, no visible
         * "Google/Twitter" label; the mockup itself doesn't have either,
         * it relies on field order alone (domain-first = Google-style,
         * title-first = Twitter-style) to read as two different previews. */}
        <div className="mt-6 grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-2">
          <div className="flex flex-col bg-card">
            <div aria-label={t.previewsImagePlaceholderLabel as string} className="h-[140px] w-full bg-border" />
            <div className="flex flex-col gap-1 p-3.5">
              <span className="text-[10px] tracking-[.04em] text-muted-foreground">
                {hostname?.toUpperCase()}
              </span>
              <span className="text-sm font-bold text-foreground">
                {ogTitle}
              </span>
              {ogDescription ? (
                <span className="text-xs text-muted-foreground">
                  {ogDescription}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col bg-card">
            <div aria-label={t.previewsImagePlaceholderLabel as string} className="h-[140px] w-full bg-border" />
            <div className="flex flex-col gap-1 p-3.5">
              <span className="text-sm font-bold text-foreground">
                {twitterTitle}
              </span>
              {twitterDescription ? (
                <span className="text-xs text-muted-foreground">
                  {twitterDescription}
                </span>
              ) : null}
              <span className="text-[10px] text-muted-foreground">
                {hostname}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
