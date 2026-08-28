# 기능 정의서 — Lighthouse 개선 제안 카드

## 기능 개요
- 상태: 부분 구현 | 패키지: front | PRD §3.7 | ADR-007
- 의존성: pipe-connection 완료 후(Lighthouse 응답이 스토어에 저장돼 있어야 함)
- 4개 점수는 그대로 유지(체크리스트 판정 대상 아님, 구글 자체 채점). 결과 화면 하단에
  `lhr.audits`를 재사용하는 개선 제안 카드를 추가한다. 백엔드 변경 없음(`LighthouseController`가
  이미 `lhr` 전체를 반환).

## 기능 요구사항
- Given `lighthouse run` 응답의 `lhr.audits`, When `/scan`을 렌더하면,
  Then 점수 낮은 opportunity/diagnostic 항목만 추려 하단 카드에 표시한다
- Given 이 카드와 Hero, When 사용자가 화면을 보면,
  Then 두 영역의 출처가 다르다는 게 시각적으로 구분된다(자체 판정과 혼동 방지)
- Given Lighthouse 4개 점수, When `/scan`을 렌더하면, Then 숫자 그대로 노출한다(합산/재판정 없음)
  — pipe-connection의 카테고리 버그 수정이 선행돼야 4개 다 표시 가능

## 비고
- 스코프 아님: Lighthouse 감사 항목을 우리 checks[] 체계로 재분류(있는 그대로 노출만 함)
