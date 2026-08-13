"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Search, Globe, Zap, Scan, Check } from "lucide-react";
import { okStatus } from "@/constans";
import {
  lsRunApi,
  scanCrawlingApi,
  scanRobotsTxtApi,
  scanSiteMapApi,
} from "@/apis/scan";
import { ProcessStep } from "./ProcessStep";

const promistList = [
  scanRobotsTxtApi,
  scanSiteMapApi,
  scanCrawlingApi,
  lsRunApi,
];

const steps = [
  { id: "ping", icon: Search },
  { id: "ai", icon: Bot },
  { id: "meta", icon: Globe },
  { id: "analysis", icon: Zap },
  { id: "gen", icon: Check },
];

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
  const [currentProcess, setCurrentProcess] = useState<Array<null | boolean>>([
    siteStatus.status === okStatus,
    ...Array(steps.length - 1).fill(null),
  ]);
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
    const process = async () =>
      await Promise.allSettled(
        promistList.map((promise, idx) =>
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

    process();
  }, []);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="mx-auto max-w-xl px-4 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <Scan className="h-11 w-11 animate-spin text-primary" />
        </div>

        <h2 className="mb-3 text-3xl font-semibold text-foreground">
          {t.analyzingText}
        </h2>
        <p className="mb-12 text-muted-foreground">{t.analyzingSubtext}</p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentProcess[index] === null;
            const isCompleted = currentProcess[index] === true;
            return (
              <ProcessStep
                key={step.id}
                isCompleted={isCompleted}
                isActive={isActive}
                IconComponent={IconComponent}
                txt={t.steps[index]}
                lang={lang}
                theme={theme}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
