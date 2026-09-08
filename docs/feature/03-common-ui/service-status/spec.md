# 기능 정의서 — 서비스 상태 표시

## 기능 개요
- 상태: 구현 완료 | 패키지: both
- 루트 레이아웃에서 API `ping`을 호출해 API 서버 생존 여부를 헤더/푸터에 뱃지로 표시한다.
- (이슈 #44) `pingApi`의 SSR `await`을 300ms 타임아웃과 경합(race)시켜, 콜드스타트로
  응답이 늦어도 전체 페이지 첫 로딩을 막지 않는다. 못 받으면 "pending" 신호로 즉시
  렌더하고, 헤더/푸터 `ServiceStatus`가 각자 클라이언트에서 1회 재시도해 확정한다.

## 기능 요구사항
- Given 페이지가 로드됨, When 루트 레이아웃이 `pingApi`를 300ms 이내에 성공/실패로
  확정 받으면, Then 성공 시 ONLINE, 실패 시 OFFLINE 뱃지를 헤더/푸터에 표시한다
- Given 루트 레이아웃의 `pingApi`가 300ms 이내에 성공도 실패도 확정하지 못하면, When
  렌더링되면, Then 대기하지 않고 즉시 렌더하며 헤더/푸터에 기존 WARNING 시각(신규 상태
  아님, "확인 중"을 의미)을 표시한다
- Given 헤더/푸터가 WARNING(pending)으로 렌더됨, When 클라이언트에서 각 `ServiceStatus`가
  mount되면, Then 각자 독립적으로 `pingApi`를 정확히 1회 재호출해 ONLINE 또는 OFFLINE으로
  갱신한다(헤더/푸터 간 상태 공유 없음, 중복 호출 2회는 의도된 동작, 추가 재시도/폴링 없음)
- Given SSR의 `pingApi`가 300ms 이전에 즉시 reject됨(예: connection refused), When 루트
  레이아웃이 race 결과를 평가하면, Then pending이 아니라 확정 실패로 취급해 OFFLINE으로
  바로 렌더하고 클라이언트 재시도는 트리거하지 않는다

## 비고
- 관련 코드: `ui/organisms/ServiceStatus.tsx`, `RootLayout`,
  `services/resolvePingStatus.ts`(이슈 #44)
- 타임아웃 값(300ms)은 하드코딩 상수이며 환경변수로 노출하지 않는다.
