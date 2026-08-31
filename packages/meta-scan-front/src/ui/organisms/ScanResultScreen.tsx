"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useScanStore } from "@/stores/scanStore";
import { Button } from "@/ui/atoms/Button";
import { StatusBadge } from "@/ui/molecules/StatusBadge";
import { BasicSeoCard } from "@/ui/organisms/BasicSeoCard";
import { ScanHero } from "@/ui/organisms/ScanHero";

// Screen transition unit for /scan/:id and bare /scan (spec-fixed.md req #9)
// — same function-declaration convention as ProcessScreen/ErrorScreen (front
// CLAUDE.md "컴포넌트 구현 패턴"). `id` undefined covers bare /scan, which
// gets the exact same not-found treatment as an unknown/expired id — no
// silent redirect either way.
interface ScanResultScreenProps extends DefaultPageProps {
  id?: string;
}

const rawTiles: Array<{ key: FailedScanApi; labelKey: string }> = [
  { key: "siteMap", labelKey: "rawSiteMapLabel" },
  { key: "crawling", labelKey: "rawCrawlingLabel" },
  { key: "lighthouse", labelKey: "rawLighthouseLabel" },
];

export function ScanResultScreen({
  lang,
  theme,
  t,
  id,
}: ScanResultScreenProps) {
  const router = useRouter();
  const getScanResult = useScanStore((state) => state.getScanResult);

  // undefined = "haven't looked yet" (avoids a not-found flash before
  // zustand's persist middleware finishes hydrating from localStorage on
  // mount); null = "looked, nothing valid found".
  const [entry, setEntry] = useState<ScanResultEntry | null | undefined>(
    undefined
  );

  useEffect(() => {
    setEntry(id ? (getScanResult(id) ?? null) : null);
  }, [id, getScanResult]);

  if (entry === undefined) return null;

  if (!entry) {
    return (
      <div className="content-frame flex flex-col items-center justify-center gap-4 py-16 text-center sm:py-28">
        <div className="flex h-14 w-14 items-center justify-center border-[2.5px] border-foreground sm:h-16 sm:w-16">
          <span className="font-display text-2xl font-black text-foreground sm:text-3xl">
            ?
          </span>
        </div>
        <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
          {t.notFoundTitle}
        </h2>
        <p className="max-w-sm text-foreground-secondary">
          {t.notFoundDescription}
        </p>
        <Button onClick={() => router.push("/")} className="mt-2">
          {t.notFoundAction}
        </Button>
      </div>
    );
  }

  const { url, combined, scannedAt } = entry;
  const timestamp = new Date(scannedAt).toLocaleString(
    lang === "ko" ? "ko-KR" : "en-US"
  );

  return (
    <div className="content-frame py-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
        <span className="text-[15px] font-bold text-foreground">{url}</span>
        <span className="mt-0.5 text-xs text-muted-foreground sm:mt-0">
          {t.analyzedAt} {timestamp}
        </span>
      </div>

      <div className="mt-6">
        <ScanHero
          lang={lang}
          theme={theme}
          t={t}
          topIssues={combined.topIssues}
        />
      </div>

      {/* "기본 SEO" checklist card (issue #3 basic-seo-checklist) — renders
       * nothing itself when checks.basicSeo is empty (crawling failed).
       * Other grouped checklist cards (indexing/content-stats/previews)
       * aren't built yet — out of scope for this pass. */}
      <div className="mt-8">
        <BasicSeoCard
          lang={lang}
          theme={theme}
          t={t}
          checks={combined.checks.basicSeo}
        />
      </div>

      {/* Per-API availability — sitemap/crawling/lighthouse only (robots.txt's
       * own gating verdict is issue #1's slice). Failed calls render a gray
       * outline placeholder, deliberately distinct from the pass/warning/
       * fail/info StatusBadge vocabulary (design-system.md §8,
       * spec-fixed.md req #5). */}
      <div className="mt-8">
        <h3 className="font-display text-[15px] font-extrabold text-foreground">
          {t.rawResultsTitle}
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-3">
          {rawTiles.map(({ key, labelKey }) => {
            const isUnavailable = combined.failedApis.includes(key);
            return (
              <div key={key} className="bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {t[labelKey as keyof typeof t]}
                  </span>
                  {isUnavailable ? (
                    <span className="border-[1.5px] border-muted-foreground px-[9px] py-[3px] text-xs font-bold tracking-[.04em] text-muted-foreground">
                      {t.unavailable}
                    </span>
                  ) : (
                    <StatusBadge status="pass">OK</StatusBadge>
                  )}
                </div>
                {key === "crawling" && !isUnavailable ? (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <div className="text-sm font-medium text-foreground">
                      {combined.title}
                    </div>
                    {combined.description ? (
                      <div className="mt-1">{combined.description}</div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
