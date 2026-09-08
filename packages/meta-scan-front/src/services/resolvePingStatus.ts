import { pingApi } from "@/api/statusApi";
import { okStatus } from "@/constans";

// 이슈 #44 root-ping-cold-start — meta-scan-api가 Cloud Run에서 콜드스타트
// 상태일 때 RootLayout의 무제한 `await pingApi()`가 사이트 전체 첫 로딩을
// 지연시키던 문제. SSR pingApi 호출을 이 타임아웃과 race시켜, 응답이 늦으면
// 기다리지 않고 "pending"으로 즉시 렌더한다(스펙 확정 인터뷰: 하드코딩,
// 환경변수로 빼지 않음).
export const pingTimeoutMs = 300;

type PingResponse = { data: OkStatus };
type Ping = () => Promise<PingResponse>;

/**
 * `ping()`을 `timeoutMs` 타임아웃과 경합시킨다.
 * - 타임아웃 전에 resolve됨 → status "ok"면 "online", 아니면 "off".
 * - 타임아웃 전에 reject됨(예: connection refused) → 확정 실패이므로
 *   "pending"이 아니라 바로 "off" (스펙 확정 AC6 — 이 경로는 CSR 재시도를
 *   트리거하지 않는다).
 * - 타임아웃 전에 settle되지 않음 → "pending". 이후 ping이 실제로
 *   resolve/reject되어도 이미 확정된 "pending" 결과는 바뀌지 않는다(호출부인
 *   RootLayout이 그 결과로 이미 렌더를 마쳤으므로) — 대신 `<ServiceStatus>`가
 *   CSR에서 1회 재시도한다.
 */
export const resolvePingStatus = (
  ping: Ping = pingApi,
  timeoutMs: number = pingTimeoutMs,
): Promise<ServiceReadyStatus> =>
  new Promise((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve("pending");
    }, timeoutMs);

    ping()
      .then((res) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(res.data.status === okStatus ? "online" : "off");
      })
      .catch(() => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve("off");
      });
  });
