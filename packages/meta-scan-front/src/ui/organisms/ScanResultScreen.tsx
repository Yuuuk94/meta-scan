"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useScanStore } from "@/stores/scanStore";
import { Button } from "@/ui/atoms/Button";
import { StatusBadge } from "@/ui/molecules/StatusBadge";
import { BasicSeoCard } from "@/ui/organisms/BasicSeoCard";
import { IndexingCard } from "@/ui/organisms/IndexingCard";
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

      {/* Checklist card group — design-system.md §5: "체크리스트 카드 그룹은
       * 4열 균등 그리드(기본 SEO/Indexing/Content Stats/국제화·UX)", §4:
       * cells share 1px rule-lines instead of a real gap (same
       * gap-px + bg-foreground container trick as the raw-results grid
       * below and ProcessScreen's step grid) — so the cards themselves
       * render border-less (see <BasicSeoCard>/<IndexingCard>).
       *
       * Column count is deliberately `sm:grid-cols-2` (not `lg:grid-cols-4`
       * yet) — only 2 of the 4 planned cards exist (content-stats/i18n-ux
       * are separate, not-yet-built issues #7/#8). Sizing the grid for 4
       * before 4 exist left the other half of the row as a huge solid
       * `bg-foreground` block (user feedback — looked like a stray dark
       * panel, not empty grid space). Bump to `lg:grid-cols-4` once both
       * land. This doesn't handle a card going empty at *runtime* (its
       * source API failed) leaving a gap either — same accepted limitation
       * as the raw-results tiles below, just smaller in scope now. */}
      <div className="mt-8 grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-2">
        <BasicSeoCard
          lang={lang}
          theme={theme}
          t={t}
          checks={combined.checks.basicSeo}
        />
        <IndexingCard
          lang={lang}
          theme={theme}
          t={t}
          checks={combined.checks.indexing}
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
