"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/ui/atoms/Button";

// Presentational counterpart to ADR-006's robots.txt pre-check gating
// (docs/adr/index.html#adr-006): when robots.txt disallows the target, the
// other 3 scans (sitemap/crawling/lighthouse) are never called and this hard
// block renders instead, per RequestScanBlockedZine.
//
// Wired into ProcessScreen (issue #1) — ProcessScreen calls scanRobotsTxtApi
// first, branches on `shouldBlockScan`'s verdict (@/services/scanGating)
// before firing the remaining 3 calls, and renders this in place of the step
// grid when blocked. `disallowRule` is intentionally left unset by that
// caller for now (issue #1 decision log #2) — the backend doesn't return the
// matched rule text yet, so only the generic "blocked" copy below is shown.
interface BlockedScreenProps {
  t: DefaultPageProps["t"];
  url: string;
  /** The robots.txt rule that disallowed the scan, e.g. "Disallow: /". */
  disallowRule?: string;
}

export function BlockedScreen({ t, url, disallowRule }: BlockedScreenProps) {
  const router = useRouter();

  const copy = {
    title: t.blockedTitle,
    description: t.blockedDescription,
    descriptionMobile: t.blockedDescriptionMobile,
    targetLabel: t.blockedTargetLabel,
    action: t.blockedAction,
    caption: t.blockedCaption,
    captionMobile: t.blockedCaptionMobile,
  };

  return (
    <div className="content-frame flex flex-col items-center justify-center gap-4 py-16 text-center sm:py-24">
      <div className="flex h-14 w-14 items-center justify-center border-[2.5px] border-destructive sm:h-16 sm:w-16">
        <span className="font-display text-xl font-black text-destructive sm:text-2xl">
          X
        </span>
      </div>

      <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
        {copy.title}
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
        <span className="sm:hidden">{copy.descriptionMobile}</span>
        <span className="hidden sm:inline">{copy.description}</span>
      </p>

      {/* Desktop keeps the "대상 URL:" label; mobile centers just the disallow rule with
       * no label prefix (zine-index intake §3.4). */}
      <div className="w-full max-w-md border-[1.5px] border-foreground bg-card px-5 py-3 text-xs text-muted-foreground">
        <span className="hidden sm:inline">
          {copy.targetLabel}: {url}
          {disallowRule ? ` — robots.txt ${disallowRule}` : ""}
        </span>
        <span className="sm:hidden">
          {disallowRule ? `robots.txt ${disallowRule}` : url}
        </span>
      </div>

      <Button
        onClick={() => router.push("/")}
        className="mt-2 w-full max-w-xs px-8 sm:w-auto sm:max-w-none"
      >
        {copy.action}
      </Button>

      <span className="text-[11px] text-muted-foreground">
        <span className="sm:hidden">{copy.captionMobile}</span>
        <span className="hidden sm:inline">{copy.caption}</span>
      </span>
    </div>
  );
}
