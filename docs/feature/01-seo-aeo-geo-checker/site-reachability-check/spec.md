# 기능 정의서 — 사이트 생존 확인

## 기능 개요
- 상태: 구현 완료 | 패키지: both | PRD §2 | 의존성: scan-input 이후, robots-gating 이전
- `/request-scan` 서버 컴포넌트가 ping API로 사이트 생존을 확인하고, 성공하면 진행 화면,
  실패하면 에러 화면을 렌더한다.

## 기능 요구사항
- Given 사용자가 `/request-scan`에 진입, When 서버 컴포넌트가 `sitePingApi`를 호출하면,
  Then 200 응답이면 `ProcessScreen`을 렌더한다
- Given ping이 실패(네트워크 오류, 타임아웃 등), When 응답을 받으면, Then `ErrorScreen`을 렌더한다

## 비고
- 관련 코드: `app/[lang]/request-scan/page.tsx`, `ui/organisms/ErrorScreen.tsx`, `ScanService.ping`
- 진행 화면 자체의 4단계 API 호출/취합 로직은 pipe-connection 스코프
