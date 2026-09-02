"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { okStatus } from "@/constans";
import {
  lsRunApi,
  scanCrawlingApi,
  scanRobotsTxtApi,
  scanSiteMapApi,
} from "@/api/scanApi";
import { shouldBlockScan } from "@/services/scanGating";
import { BlockedScreen } from "@/ui/organisms/BlockedScreen";
import { ErrorScreen } from "@/ui/organisms/ErrorScreen";
import { ProcessStep } from "@/ui/molecules/ProcessStep";
import { combineScanResults } from "@/services/combineScanResults";
import { useScanStore } from "@/stores/scanStore";

// Order-matched to promistList — which raw-response key each call's body
// gets stored under.
const rawKeys: (keyof RawScanResponses)[] = [
  "robotsTxt",
  "siteMap",
  "crawling",
  "lighthouse",
];

// The design's step grid has exactly 4 tiles, one per real scan API
// (robots.txt/sitemap.xml/crawling+AI/lighthouse) — the "site is reachable"
// ping result is shown only via the URL-chip badge above the grid, not
// duplicated as a 5th tile (zine-index intake §3.2 decision).
const stepIds = ["ai", "meta", "analysis", "gen"];

// `crawling` alone failing is fatal — nearly every checklist card
// (basicSeo/indexing/previews/aiSignals/content/i18nUx) is sourced from its
// `checks.*`, so losing it leaves /scan/:id showing an almost-empty page
// with no visible indication anything went wrong (2026-09-02, found via a
// real manual scan after removing the raw-results "확인 불가" fallback
// tiles that used to at least surface a failed API). siteMap/lighthouse
// failing alone still isn't fatal — their cards degrade gracefully
// (IndexingCard still has crawling's checks, LighthouseCard renders
// nothing for a missing `combined.lighthouse`).
const fatalIndices = ["crawling"] as const;

interface ProcessScreenProps extends DefaultPageProps {
  siteStatus: SiteStatusData;
}
export function ProcessScreen({
  lang,
  theme,
  t,
  siteStatus,
}: ProcessScreenProps) {
  const router = useRouter();
  const saveScanResult = useScanStore((state) => state.saveScanResult);

  const [progress, setProgress] = useState(10);
  const [currentProcess, setCurrentProcess] = useState<Array<null | boolean>>(
    Array(stepIds.length).fill(null)
  );
  // Bumping this re-runs the main effect below (it's in that effect's
  // dependency array) — the only way "다시 시도" on <ErrorScreen> actually
  // retries the scan, instead of a no-op `router.refresh()` that a client
  // component's local state never notices (see handleRetry / ErrorScreen's
  // onRetry comment).
  const [retryKey, setRetryKey] = useState(0);
  // "processing" = existing step-tile grid, "blocked" = ADR-006 hard block
  // (BlockedScreen), "error" = robotsTxt call itself failed, or all 3
  // remaining calls failed (both render ErrorScreen — distinct from an
  // explicit disallow verdict, issue #1 requirement #5 / pipe-connection
  // requirement #4).
  const [screenState, setScreenState] = useState<
    "processing" | "blocked" | "error"
  >("processing");
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return; // 두 번째 실행 막기
    didRunRef.current = true;

    if (siteStatus.status !== okStatus) return;

    const data = { url: siteStatus.url };
    // Response bodies for each of the 4 calls, keyed by rawKeys — filled in
    // as each settles, then handed to combineScanResults once all 4 are
    // done (spec-fixed.md req #1/#6). Plain object (not state): only read
    // after Promise.allSettled resolves, doesn't drive any render. Typed
    // loosely (promistList's calls each return a different response shape)
    // and narrowed back to RawScanResponses once fully populated below.
    const raw: Record<keyof RawScanResponses, unknown> = {
      robotsTxt: null,
      siteMap: null,
      crawling: null,
      lighthouse: null,
    };

    const processFinished = () => {
      setProgress((state) => (state < 100 ? state + 20 : state));
    };
    const processCallback = (value: boolean, idx: number) => {
      processFinished();
      setCurrentProcess((state) =>
        state.map((v, i) => (i === idx ? value : v))
      );
    };

    const process = async () => {
      let robotsTxtResult: RobotsTxtData;
      try {
        const res = await scanRobotsTxtApi(data);
        robotsTxtResult = res.data;
        if (!robotsTxtResult) {
          // A 2xx with an empty/null body (malformed proxy, unexpected
          // content-type) — treat the same as a network failure rather
          // than let shouldBlockScan dereference an undefined value.
          throw new Error("robotsTxt API returned an empty response");
        }
        raw.robotsTxt = robotsTxtResult;
        processCallback(robotsTxtResult.status === okStatus, 0);
      } catch (e) {
        console.error(e);
        setScreenState("error");
        return;
      }

      if (shouldBlockScan(robotsTxtResult)) {
        setScreenState("blocked");
        return;
      }

      // siteMap gets its own call (not just `data`) so it can carry
      // robots.txt's already-fetched declared sitemap URLs as
      // `candidateSitemaps` (issue #4 indexing-checklist req #1) — robots.txt
      // is always awaited alone first (ADR-006 pre-check gating), so
      // `robotsTxtResult.sitemap` is available by the time these 3 fire.
      // Index stays aligned with `stepIds`/`t.steps`/`rawKeys.slice(1)`.
      const remainingCalls = [
        () =>
          scanSiteMapApi({
            url: data.url,
            candidateSitemaps: robotsTxtResult.sitemap,
          }),
        () => scanCrawlingApi(data),
        () => lsRunApi(data),
      ];

      // siteMap/crawling both wrap success as `{ status: "ok", ... }`
      // (meta-scan-api CLAUDE.md "응답 스프레드 규약과 예외"), but
      // `lighthouse run` doesn't — it returns `lhr` directly with no
      // `status` field at all, so a `status === "ok"` check would always
      // read a real success response as failed. Index-aligned with
      // `remainingCalls`/`rawKeys.slice(1)`.
      const isOkPredicates: Array<(data: unknown) => boolean> = [
        (data) =>
          !!(data as OkStatus)?.status &&
          (data as OkStatus).status === okStatus,
        (data) =>
          !!(data as OkStatus)?.status &&
          (data as OkStatus).status === okStatus,
        (data) => !!data && typeof data === "object",
      ];

      await Promise.allSettled(
        remainingCalls.map((call, idx) =>
          call()
            .then((res) => {
              const isOk = isOkPredicates[idx](res.data);
              raw[rawKeys[idx + 1]] = isOk ? res.data : null;
              processCallback(isOk, idx + 1);
              return res;
            })
            .catch((e) => {
              console.error(e);
              raw[rawKeys[idx + 1]] = null;
              processFinished();
            })
        )
      ).then(() => {
        setProgress(100);
        setCurrentProcess((state) =>
          state.map((v) => (v === null ? false : v))
        );

        const isFatal = fatalIndices.some((key) => raw[key] == null);
        if (isFatal) {
          setScreenState("error");
          return;
        }

        const rawResponses = raw as unknown as RawScanResponses;
        const combined = combineScanResults(siteStatus.url, rawResponses);
        const id = saveScanResult({
          url: siteStatus.url,
          raw: rawResponses,
          combined,
        });
        router.replace(`/scan/${id}`);
      });
    };

    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  const handleRetry = () => {
    didRunRef.current = false;
    setProgress(10);
    setCurrentProcess(Array(stepIds.length).fill(null));
    setScreenState("processing");
    setRetryKey((k) => k + 1);
  };

  if (screenState === "error") {
    return (
      <ErrorScreen theme={theme} lang={lang} t={t} onRetry={handleRetry} />
    );
  }

  if (screenState === "blocked") {
    return <BlockedScreen t={t} url={siteStatus.url} />;
  }

  return (
    <div className="content-frame flex flex-col items-center gap-7 py-16 text-center">
      {/* URL chip + live status, mirrors RequestScanProcessZine's header row */}
      <div className="flex items-center gap-3 border-[1.5px] border-foreground bg-card px-5 py-3">
        <span className="text-[13px] font-semibold text-foreground">
          {siteStatus.url}
        </span>
        <span className="bg-success px-[9px] py-[3px] text-[10.5px] font-extrabold tracking-[.04em] text-success-foreground">
          {lang === "ko" ? "접속 확인 완료" : "SITE REACHABLE"}
        </span>
      </div>

      <div>
        <h2 className="font-display text-3xl font-extrabold text-foreground">
          {t.analyzingText}
        </h2>
        <p className="mt-2 text-sm text-foreground-secondary">
          {t.analyzingSubtext}
        </p>
      </div>

      {/* Step grid — hardline rule between tiles instead of gaps
       * (design-system.md §4). */}
      <div className="grid w-full max-w-3xl grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-4">
        {stepIds.map((id, index) => (
          <ProcessStep
            key={id}
            isCompleted={currentProcess[index] === true}
            isActive={currentProcess[index] === null}
            txt={t.steps[index]}
            lang={lang}
            theme={theme}
          />
        ))}
      </div>

      <div className="h-2 w-full max-w-3xl bg-muted">
        <div
          className="h-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
