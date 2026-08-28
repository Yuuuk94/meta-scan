# 기능 정의서 (확정) — Lighthouse 개선 제안 카드

> `spec.md` 검토 완료(빠른 검토 — 크리티컬 항목 1개만).

## 기능 개요
- 상태: 부분 구현 | 패키지: front | PRD §3.7 | ADR-007
- 의존성: pipe-connection 완료 후(Lighthouse 응답이 스토어에 저장돼 있어야 함, 카테고리 버그
  수정도 pipe-connection에서 선행)

## 기능 요구사항

1. Given `lighthouse run` 응답의 `lhr.audits`, When `/scan/:id`를 렌더하면, Then `score !== null
   && score < 0.9`인 audit만 필터링해 점수 낮은 순으로 정렬, 상위 5개까지 하단 카드에 표시한다
2. Given 이 카드와 Hero, When 사용자가 화면을 보면, Then 두 영역의 출처가 다르다는 게 시각적으로
   구분된다(자체 판정과 혼동 방지)
3. Given Lighthouse 4개 점수, When `/scan/:id`를 렌더하면, Then 숫자 그대로 노출한다(합산/재판정
   없음)

## 비고

- 스코프 아님: Lighthouse 감사 항목을 우리 checks[] 체계로 재분류(있는 그대로 노출만 함)

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | 개선 제안 항목 선정 기준? | `score < 0.9` 필터 + 낮은 순 상위 5개 | Lighthouse 자체 관례와 일치, 개수 상한 필요 |
