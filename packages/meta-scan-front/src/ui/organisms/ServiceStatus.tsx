"use client";

import { useEffect, useRef, useState } from "react";
import { pingApi } from "@/api/statusApi";
import { okStatus } from "@/constans";

// Judgement colors reused verbatim (bg-success/warning/destructive), but this
// is server-health telemetry, not a checklist verdict — deliberately not the
// <StatusBadge> primitive, which is reserved for checks[] pass/warning/fail/info
// (design-system.md §8).
const statusOptions = {
  online: {
    dot: "bg-success",
    text: "text-success",
    label: "ONLINE",
    fullLabel: "SYSTEM ONLINE",
  },
  warn: {
    dot: "bg-warning",
    text: "text-warning",
    label: "WARNING",
    fullLabel: "SYSTEM WARNING",
  },
  off: {
    dot: "bg-destructive",
    text: "text-destructive",
    label: "OFFLINE",
    fullLabel: "SYSTEM OFFLINE",
  },
};

interface ServiceStatusProps {
  ready: ServiceReadyStatus;
  fullLabel?: boolean;
}

// 이슈 #44 root-ping-cold-start — RootLayout이 SSR pingApi를 300ms 타임아웃과
// race시킨 결과("online" | "off" | "pending")를 그대로 초기값으로 받는다.
// "pending"으로 mount되면 클라이언트에서 pingApi를 정확히 1회 재호출해
// online/off로 확정한다(AC3/AC5). 헤더/푸터 두 인스턴스는 공유 context 없이
// 각자 독립적으로 이 로직을 수행한다(AC4, 컨벤션상 Context 없이 prop-drilling).
export const ServiceStatus = ({
  ready,
  fullLabel = false,
}: ServiceStatusProps) => {
  const [status, setStatus] = useState<ServiceReadyStatus>(ready);
  const retried = useRef(false);

  useEffect(() => {
    if (ready !== "pending" || retried.current) return;
    retried.current = true;

    let cancelled = false;

    pingApi()
      .then((res) => {
        if (cancelled) return;
        setStatus(res.data.status === okStatus ? "online" : "off");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("off");
      });

    return () => {
      cancelled = true;
    };
  }, [ready]);

  // "pending"은 새 시각 상태가 아니라 기존 WARNING을 재사용한 임시 표시일 뿐
  // (스펙 확정 결정 #2) — statusOptions 키는 그대로 online/warn/off 3개.
  const visual = status === "pending" ? "warn" : status;
  const currentStatus = statusOptions[visual];

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${currentStatus.dot}`} />
      {/* No monospace — design-system.md §3 reserves numeric weight for
       * Big Shoulders Display, not a terminal-style mono face. */}
      <span
        className={`text-xs font-bold tracking-[.04em] ${currentStatus.text}`}
      >
        {fullLabel ? currentStatus.fullLabel : currentStatus.label}
      </span>
    </div>
  );
};
