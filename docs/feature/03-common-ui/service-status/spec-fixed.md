# 기능 정의서 (확정) — 서비스 상태 표시

> `spec.md` 검토 완료 — 이미 구현된 기능, 특이사항 없이 그대로 확정.

## 기능 개요
- 상태: 구현 완료 | 패키지: front/api
- 루트 레이아웃에서 API `ping`을 호출해 API 서버 생존 여부를 헤더/푸터에 뱃지로 표시한다.

## 기능 요구사항

1. Given 페이지가 로드됨, When 루트 레이아웃이 `pingApi`를 호출하면, Then 성공 시 ONLINE, 실패 시 WARNING 뱃지를 헤더/푸터에 표시한다

## 비고
- 관련 코드: `ui/organisms/ServiceStatus.tsx`, `RootLayout`
