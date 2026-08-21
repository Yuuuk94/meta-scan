"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/ui/atoms/Button";

// Presentational counterpart to ADR-006's robots.txt pre-check gating
// (docs/adr/index.html#adr-006): when robots.txt disallows the target, the
// other 3 scans (sitemap/crawling/lighthouse) are never called and this hard
// block renders instead, per RequestScanBlockedZine.
//
// Not wired into ProcessScreen yet — that requires the actual gating logic
// (call scanRobotsTxtApi first, branch on its checks[] verdict before firing
// the remaining 3 calls), which is feature/model work tracked separately
// from this styling pass (see CLAUDE.md "현재 상태").
interface BlockedScreenProps {
  lang: Language;
  url: string;
  /** The robots.txt rule that disallowed the scan, e.g. "Disallow: /". */
  disallowRule?: string;
}

export function BlockedScreen({ lang, url, disallowRule }: BlockedScreenProps) {
  const router = useRouter();

  const copy =
    lang === "ko"
      ? {
          title: "이 사이트는 검사할 수 없다",
          description:
            "robots.txt가 이 사이트의 스캔을 차단하고 있다. 사이트 소유자의 의사를 존중해 나머지 검사(크롤링·Lighthouse)는 실행하지 않았다.",
          // Mobile drops the "사이트 소유자의 의사를 존중해" clause (zine-index intake §3.4).
          descriptionMobile:
            "robots.txt가 이 사이트의 스캔을 차단하고 있다. 나머지 검사(크롤링·Lighthouse)는 실행하지 않았다.",
          targetLabel: "대상 URL",
          action: "다른 URL 시도",
          // zine-index intake §5 item 4 재작성 — 내부 사유(비용 절감)를 노출하는 대신
          // 사용자 입장에서 실제로 유용한 사실만 전달한다. UX 카피 재작업(2026-08-19)로 갱신.
          caption: "robots.txt가 차단한 사이트는 추가 검사 없이 여기서 멈춘다",
          captionMobile: "robots.txt가 차단한 사이트는 추가 검사 없이 멈춘다",
        }
      : {
          title: "This site can't be scanned",
          description:
            "robots.txt disallows scanning this site. Out of respect for the site owner's choice, the remaining checks (crawling, Lighthouse) were not run.",
          descriptionMobile:
            "robots.txt disallows scanning this site. The remaining checks (crawling, Lighthouse) were not run.",
          targetLabel: "Target URL",
          action: "Try another URL",
          caption: "A site blocked by robots.txt stops here — no further checks are run",
          captionMobile: "A site blocked by robots.txt stops here",
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
