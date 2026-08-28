# 기능 정의서 (확정) — 정책 정적 페이지

> `spec.md` 검토 완료 — 이미 구현된 기능, 특이사항 없이 그대로 확정.

## 기능 개요
- 상태: 구현 완료 | 패키지: front
- 개인정보처리방침(`/privacy`), 이용약관(`/terms`) 정적 콘텐츠 페이지.

## 기능 요구사항

1. Given 사용자가 푸터의 정책 링크를 클릭, When 이동하면, Then 해당 정적 페이지가 렌더된다

## 비고
- 관련 코드: `app/[lang]/privacy/page.tsx`, `app/[lang]/terms/page.tsx`
