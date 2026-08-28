# 기능 정의서 — 언어 전환

## 기능 개요
- 상태: 구현 완료 | 패키지: front
- 헤더의 토글로 ko/en 사전을 전환한다.

## 기능 요구사항
- Given 사용자가 헤더의 언어 토글을 봄, When 클릭하면, Then 언어가 즉시 전환되고 쿠키에 저장되며
  URL 로케일 프리픽스도 갱신된다

## 비고
- 관련 코드: `ui/molecules/ToggleSetting.tsx`, `src/middleware.ts`, `dictionaries/`
