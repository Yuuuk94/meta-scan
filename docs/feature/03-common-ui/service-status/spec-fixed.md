# 기능 정의서 (확정) — 서비스 상태 표시

> `spec.md` 검토 완료 — 최초엔 이미 구현된 기능으로 특이사항 없이 확정됐으나, 이슈 #44에서
> SSR 블로킹/타임아웃 정책이 명세돼 있지 않던 갭이 발견돼 재확정(append) — 2026-09-08.

## 기능 개요
- 상태: 구현 완료 | 패키지: front/api
- 루트 레이아웃에서 API `ping`을 호출해 API 서버 생존 여부를 헤더/푸터에 뱃지로 표시한다.
- (이슈 #44, 2026-09-08) 콜드스타트 시 SSR `pingApi` await이 무제한으로 늘어나 전체 페이지
  로딩을 지연시키던 문제 — 300ms 타임아웃과 race, pending은 CSR에서 1회 재시도.

## 상태 모델 (이슈 #44에서 boolean → 3-state로 변경)
- `online` — `pingApi` 성공(status "ok") 확정.
- `off`(OFFLINE) — 확정된 실패. SSR에서 300ms 이전에 즉시 reject되었거나, CSR 재시도가
  실패(non-ok status)/reject된 경우.
- `pending` — 아직 확인 중. SSR이 300ms 안에 성공/실패를 확정하지 못한 경우에만 발생하며,
  새 시각 상태를 만들지 않고 기존 WARNING 뱃지를 재사용한다. 이 상태로 렌더된 직후 각
  `ServiceStatus`가 CSR에서 `pingApi`를 1회 재호출해 online/off로 갱신한다.

## 기능 요구사항

1. Given `pingApi`가 RootLayout의 SSR 요청 시작 후 300ms 이내에 status "ok"로 resolve됨,
   When RootLayout이 렌더링되면, Then 전달되는 상태는 `online`이고 헤더/푸터
   `ServiceStatus` 모두 ONLINE으로 렌더되며 클라이언트 재시도는 발생하지 않는다.
2. Given `pingApi`가 300ms 이내에 성공도 실패도 확정하지 못함, When RootLayout이
   렌더링되면, Then RootLayout은 더 기다리지 않고 즉시 렌더하며, 헤더/푸터
   `ServiceStatus` 모두 초기값으로 기존 WARNING 시각(신규 상태 아님)을 표시한다.
3. Given `ServiceStatus`가 pending 초기 신호를 받음, When 클라이언트에서 mount되면, Then
   스스로 `pingApi`를 정확히 1회 호출하고: 성공(status "ok")이면 ONLINE으로, 실패(non-ok
   status 또는 reject)면 OFFLINE으로 갱신한다.
4. Given 헤더 `ServiceStatus`와 푸터 `ServiceStatus`가 둘 다 pending 신호를 받음, When 각각
   mount되면, Then 서로 상태를 공유하는 context/wrapper 없이 각자 독립적으로 `pingApi`를
   호출한다(중복 호출 2회는 의도된 동작).
5. Given 클라이언트 재시도 `pingApi` 호출이 완료됨(성공이든 실패든), When 그 1회 시도가
   끝나면, Then 이후 추가 재시도/폴링은 발생하지 않는다 — 배지는 그 1회 결과로 고정된다.
6. Given SSR의 `pingApi`가 300ms가 지나기 전에 즉시 reject됨(예: connection refused), When
   RootLayout이 race 결과를 평가하면, Then 이는 pending이 아니라 확정 실패로 취급되어
   `off`로 바로 렌더되고, 이 경로에서는 클라이언트 재시도가 트리거되지 않는다.

## 스코프 제외
- 백엔드(`meta-scan-api`) 변경 없음 — `healthz` 엔드포인트 자체는 그대로.
- pending 전용의 새로운 시각적 상태(로딩 스피너 등) 도입 없음 — 기존 WARNING 재사용.
- 헤더/푸터 상태를 공유하는 새 Context/wrapper 아키텍처 도입 없음.
- 재시도 폴링/backoff 없음(1회 한정).
- 타임아웃 값을 환경변수로 노출하지 않음(하드코딩 300ms).

## 비고
- 관련 코드: `ui/organisms/ServiceStatus.tsx`, `RootLayout`,
  `services/resolvePingStatus.ts`(이슈 #44)
