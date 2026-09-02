"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useScanStore } from "@/stores/scanStore";
import { Button } from "@/ui/atoms/Button";
import { AiSignalsCard } from "@/ui/organisms/AiSignalsCard";
import { BasicSeoCard } from "@/ui/organisms/BasicSeoCard";
import { ContentStatsCard } from "@/ui/organisms/ContentStatsCard";
import { I18nUxCard } from "@/ui/organisms/I18nUxCard";
import { IndexingCard } from "@/ui/organisms/IndexingCard";
import { LighthouseCard } from "@/ui/organisms/LighthouseCard";
import { PreviewsCard } from "@/ui/organisms/PreviewsCard";
import { ScanHero } from "@/ui/organisms/ScanHero";
import { mockScanResultEntry } from "@/mocks/mockScanResult";

// Dev convenience only — never true in a deployed build (a real domain is
// never "localhost", and these 2 ids are reserved fixtures, not something a
// real scan would ever produce). Only these exact /scan/:id values render
// `mockScanResultEntry` instead of the not-found screen when there's no
// real store entry — narrowed from "any id" so a typo'd/expired real id
// still correctly shows not-found instead of silently masking it.
const MOCK_SCAN_IDS = ["6f31d40e-9f8e-4553-b1cf-4800841fa784", "test"];
function isMockableLocalDev(id?: string) {
  return (
    !!id &&
    MOCK_SCAN_IDS.includes(id) &&
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  );
}

// Screen transition unit for /scan/:id and bare /scan (spec-fixed.md req #9)
// — same function-declaration convention as ProcessScreen/ErrorScreen (front
// CLAUDE.md "컴포넌트 구현 패턴"). `id` undefined covers bare /scan, which
// gets the exact same not-found treatment as an unknown/expired id — no
// silent redirect either way.
interface ScanResultScreenProps extends DefaultPageProps {
  id?: string;
}

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
    const found = id ? (getScanResult(id) ?? null) : null;
    if (!found && isMockableLocalDev(id)) {
      setEntry({ ...mockScanResultEntry, scannedAt: Date.now() });
      return;
    }
    setEntry(found);
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

      {/* "AI 신호(AI Signals/AEO)" (issue #6 ai-signals-checklist) — placed
       * *before* <ScanHero> ("지금 고쳐야 할 것"), matching ScanZine.dc.html's
       * top-to-bottom order (item 3 AI Signals card, then item 4 fix-now
       * section) — this is the product's core differentiation area, so it
       * leads even before the fix-now list. */}
      <div className="mt-6">
        <AiSignalsCard
          lang={lang}
          theme={theme}
          t={t}
          checks={combined.checks.aiSignals}
          structuredDataTypes={combined.structuredDataTypes}
        />
      </div>

      <div className="mt-6">
        <ScanHero
          lang={lang}
          theme={theme}
          t={t}
          topIssues={combined.topIssues}
        />
      </div>

      {/* Checklist card group — cells share 1px rule-lines instead of a real
       * gap (same gap-px + bg-foreground container trick as the
       * raw-results grid below and ProcessScreen's step grid) — so the
       * cards themselves render border-less (see
       * <BasicSeoCard>/<IndexingCard>).
       *
       * 2x2 (`sm:grid-cols-2`, never bumped to `lg:grid-cols-4`) — issue #8
       * i18n-ux-checklist landed the 4th card and briefly went to
       * `lg:grid-cols-4`, but a single row of 4 read as too cramped once all
       * 4 were real content (user feedback, 2026-09-02) — reverted to 2
       * columns / 2 rows, which design-system.md §5 needs updating to
       * reflect (still describes "4열 균등 그리드"). This doesn't handle a
       * card going empty at *runtime* (its source API failed) leaving a gap
       * either — same accepted limitation as the raw-results tiles below. */}
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
        {/* "콘텐츠 품질(Content Stats)" (issue #7 content-stats-checklist) —
         * 3rd cell in this 4-card checklist grid. */}
        <ContentStatsCard
          lang={lang}
          theme={theme}
          t={t}
          checks={combined.checks.content}
        />
        {/* "국제화/UX(i18n/UX)" (issue #8 i18n-ux-checklist) — 4th and final
         * cell in this checklist grid. */}
        <I18nUxCard
          lang={lang}
          theme={theme}
          t={t}
          checks={combined.checks.i18nUx}
        />
      </div>

      {/* "Previews — OG · Twitter" (issue #5 previews-checklist) — a
       * standalone card *after* the 4-col checklist grid, not a cell inside
       * it (design intake spec §3.5 item 6 lists it as its own layout
       * block, distinct from item 5's checklist grid; see <PreviewsCard>'s
       * comment for why it renders its own full <Card> border instead of
       * the grid's shared rule-lines). */}
      <div className="mt-8">
        <PreviewsCard
          lang={lang}
          theme={theme}
          t={t}
          checks={combined.checks.previews}
          url={combined.url}
          title={combined.title}
          description={combined.description}
          openGraph={combined.openGraph}
          twitter={combined.twitter}
        />
      </div>

      {/* "Lighthouse 점수" + "Lighthouse 개선 제안" (issue #9
       * lighthouse-suggestions, ADR-007) — two sibling blocks (score grid,
       * then a standalone suggestions card), matching ScanZine.dc.html's
       * layout rather than one combined card. No wrapping mt-8 div here —
       * <LighthouseCard> owns its own top spacing via a thick section rule
       * (design-system.md §5), since that rule (not a plain margin) is
       * what's supposed to mark this as a new section.
       * `combined.lighthouse` is optional on the type (older/hand-built
       * fixtures may not have it) — falls back to an empty shape rather
       * than crashing; <LighthouseCard> itself renders nothing for that
       * case. */}
      <LighthouseCard
        lang={lang}
        theme={theme}
        t={t}
        lighthouse={
          combined.lighthouse ?? {
            scores: {
              performance: null,
              seo: null,
              accessibility: null,
              bestPractices: null,
            },
            suggestions: [],
          }
        }
      />

    </div>
  );
}
