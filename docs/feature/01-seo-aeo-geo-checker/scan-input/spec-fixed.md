# 기능 정의서 (확정) — URL 입력 (Scan Input)

> `spec.md` 검토 완료 — 이미 구현된 기능, 특이사항 없이 그대로 확정.

## 기능 개요
- 상태: 구현 완료 | 패키지: front | PRD §2

## 기능 요구사항

1. Given 사용자가 메인 페이지에 있음, When URL을 입력하고 "분석하기"를 누르면, Then 정규식
   검증 통과 시 `crrUrl` 쿠키에 저장하고 `/request-scan`으로 이동한다
2. Given URL 형식이 잘못됨, When "분석하기"를 누르면, Then 인라인 에러 메시지를 표시하고
   이동하지 않는다

## 비고
- 관련 코드: `ui/organisms/HeroSection.tsx`, `utils/cookies.ts`
