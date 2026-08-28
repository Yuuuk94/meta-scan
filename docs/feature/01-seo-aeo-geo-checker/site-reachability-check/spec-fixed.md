# 기능 정의서 (확정) — 사이트 생존 확인

> `spec.md` 검토 완료 — 이미 구현된 기능, 특이사항 없이 그대로 확정.

## 기능 개요
- 상태: 구현 완료 | 패키지: both | PRD §2

## 기능 요구사항

1. Given 사용자가 `/request-scan`에 진입, When 서버 컴포넌트가 `sitePingApi`를 호출하면,
   Then 200 응답이면 `ProcessScreen`을 렌더한다
2. Given ping이 실패(네트워크 오류, 타임아웃 등), When 응답을 받으면, Then `ErrorScreen`을
   렌더한다

## 비고
- 관련 코드: `app/[lang]/request-scan/page.tsx`, `ui/organisms/ErrorScreen.tsx`, `ScanService.ping`
