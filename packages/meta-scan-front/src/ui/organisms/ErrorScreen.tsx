"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/ui/atoms/Button";

interface ErrorScreenProps extends DefaultPageProps {
  // Optional override for the "다시 시도" button. Defaults to
  // `router.refresh()`, which is only a real retry when this screen is
  // rendered from a Server Component (request-scan/page.tsx re-runs its
  // ping fetch on refresh) — inside <ProcessScreen>, this screen renders
  // from client-side `screenState`, which a server refresh never touches,
  // so the button did nothing there (2026-09-02, user review: "에러 화면에
  // 다시시도 동작해?"). <ProcessScreen> now passes its own retry handler
  // that actually resets state and re-runs the scan.
  onRetry?: () => void;
}

export function ErrorScreen({ t, onRetry }: ErrorScreenProps) {
  const router = useRouter();

  return (
    <div className="content-frame flex flex-col items-center justify-center gap-4 py-16 text-center sm:py-28">
      <div className="flex h-14 w-14 items-center justify-center border-[2.5px] border-foreground sm:h-16 sm:w-16">
        <span className="font-display text-2xl font-black text-foreground sm:text-3xl">
          !
        </span>
      </div>

      <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
        {t.errorTitle}
      </h2>
      <p className="max-w-sm text-foreground-secondary">{t.errorSubtitle}</p>

      {/* Design order is filled "다시 시도" (retry) first, outline "홈으로" (home)
       * second — full-width stacked column at mobile, side-by-side row at desktop
       * (zine-index intake §2.4). */}
      <div className="mt-3 flex w-full max-w-xs flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3">
        <Button
          onClick={onRetry ?? (() => router.refresh())}
          className="w-full sm:w-auto"
        >
          {t.retryButton}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="w-full sm:w-auto"
        >
          {t.goBack}
        </Button>
      </div>
    </div>
  );
}
