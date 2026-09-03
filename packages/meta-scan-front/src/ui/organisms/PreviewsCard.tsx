import React, { useState } from "react";

import { buildPreviewsMessage } from "@/services/buildPreviewsMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/molecules/Card";
import { StatusBadge, statusLabel } from "@/ui/molecules/StatusBadge";

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
}: PreviewsCardProps) => {
  // Issue #24 req #3/#5: prefer a real <img> from og:image over the solid
  // placeholder block, but fall back to the placeholder if the URL 404s or
  // otherwise fails to load (broken-image icon is worse than no image).
  // Declared before the early return below — Rules of Hooks forbids
  // calling useState conditionally / after a conditional return.
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // No crawling data (that call failed, or hasn't happened) — every row and
  // the mockup are sourced from crawling alone, so there's nothing to show.
  // Same "stay absent rather than render an empty shell" rule as
  // <BasicSeoCard>/<IndexingCard>.
  if (checks.length === 0) return null;

  const hostname = getHostname(url);

  const ogTitle = openGraph?.["og:title"] || title;
  const ogDescription = openGraph?.["og:description"] || description;
  const ogImage = openGraph?.["og:image"];
  const showImage = Boolean(ogImage) && !imageLoadFailed;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.previews}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Vertical stacked rows — same hairline-divider/label+badge pattern
         * as <IndexingCard> (2026-09-02 user request: "indexing 카드처럼
         * 텍스트 보여주고"), replacing the earlier 4-across grid. */}
        <div className="flex flex-col divide-y divide-border">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start justify-between gap-4 py-3.5"
            >
              <span className="text-sm font-medium text-foreground">
                {buildPreviewsMessage(t, check)}
              </span>
              <StatusBadge status={check.status}>
                {statusLabel(check.status)}
              </StatusBadge>
            </div>
          ))}
        </div>

        {/* Single Google-style mockup — the Twitter-style card was dropped
         * (2026-09-02 user request: "아래 카드하나로 통일 왼쪽껄로", also
         * issue #24's confirmed direction). Image area is a solid
         * placeholder block (--border token) — no "이미지 없음" text. */}
        <div className="mt-6 border-[1.5px] border-foreground bg-card">
          {showImage ? (
            // og:image is an arbitrary external URL supplied by the scanned
            // site, not a static/known-domain asset, so next/image's
            // remotePatterns allowlist doesn't fit here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ogImage}
              alt={ogTitle || hostname || ""}
              className="aspect-[4/3] w-full object-contain"
              onError={() => setImageLoadFailed(true)}
            />
          ) : (
            <div
              aria-label={t.previewsImagePlaceholderLabel as string}
              className="aspect-[4/3] w-full bg-border"
            />
          )}
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
      </CardContent>
    </Card>
  );
};
