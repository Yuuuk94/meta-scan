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

// robots.txt (index 0) is always awaited alone first (ADR-006 pre-check
// gating) — the remaining 3 only fire once its verdict is known to be
// non-blocking. Index stays aligned with `stepIds`/`t.steps` below.
const remainingApiList = [scanSiteMapApi, scanCrawlingApi, lsRunApi];

// The design's step grid has exactly 4 tiles, one per real scan API
// (robots.txt/sitemap.xml/crawling+AI/lighthouse) — the "site is reachable"
// ping result is shown only via the URL-chip badge above the grid, not
// duplicated as a 5th tile (zine-index intake §3.2 decision).
const stepIds = ["ai", "meta", "analysis", "gen"];

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

  const [progress, setProgress] = useState(10);
  const [currentProcess, setCurrentProcess] = useState<Array<null | boolean>>(
    Array(stepIds.length).fill(null)
  );
  // "processing" = existing step-tile grid, "blocked" = ADR-006 hard block
  // (BlockedScreen), "error" = robotsTxt call itself failed (ErrorScreen,
  // distinct from an explicit disallow verdict — issue #1 requirement #5).
  const [screenState, setScreenState] = useState<
    "processing" | "blocked" | "error"
  >("processing");
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return; // 두 번째 실행 막기
    didRunRef.current = true;

    if (siteStatus.status !== okStatus) return;

    const data = { url: siteStatus.url };
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
        processCallback(robotsTxtResult?.status === okStatus, 0);
      } catch (e) {
        console.error(e);
        setScreenState("error");
        return;
      }

      if (shouldBlockScan(robotsTxtResult)) {
        setScreenState("blocked");
        return;
      }

      await Promise.allSettled(
        remainingApiList.map((promise, idx) =>
          promise(data)
            .then((res) => {
              processCallback(
                (res.data as OkStatus)?.status &&
                  (res.data as OkStatus).status === okStatus
                  ? true
                  : false,
                idx + 1
              );
              return res;
            })
            .catch((e) => {
              console.error(e);
              processFinished();
            })
        )
      ).then(() => {
        setProgress(100);
        setCurrentProcess((state) =>
          state.map((v) => (v === null ? false : v))
        );
        router.replace("/scan");
      });
    };

    process();
  }, []);

  if (screenState === "error") {
    return <ErrorScreen theme={theme} lang={lang} t={t} />;
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
          {lang === "ko" ? "생존 확인 완료" : "SITE REACHABLE"}
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

      <span className="text-[11px] text-muted-foreground">{t.stepsHint}</span>
    </div>
  );
}
