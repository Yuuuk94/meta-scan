# 기능 정의서 — 테마 전환

## 기능 개요
- 상태: 구현 완료 | 패키지: front
- 헤더의 토글로 다크/라이트 테마를 즉시 전환한다.

## 기능 요구사항
- Given 사용자가 헤더의 테마 토글을 봄, When 클릭하면, Then 테마가 즉시 전환되고 쿠키에 저장된다

## 비고
- 관련 코드: `ui/molecules/ToggleSetting.tsx`, `src/middleware.ts`(최초 방문 시 기본값 설정)
