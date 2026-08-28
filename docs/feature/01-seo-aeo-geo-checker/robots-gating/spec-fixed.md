# 기능 정의서 (확정) — robots.txt 차단 게이팅

> `spec.md` 검토 완료. 이 파일이 최종 스펙입니다. 검토 과정의 Q&A는 맨 아래 "검토 결정 로그" 참고.

## 기능 개요
- 상태: 미구현 | 패키지: front | PRD §3.0,§6.2 | ADR-006
- 이슈 분할: **별도 이슈**(robots-gating 먼저, pipe-connection 나중) — 같은 파일(`ProcessScreen.tsx`)을
  건드리지만 각자 독립 검증 가능한 단위로 유지
- robots.txt가 스캔을 비허용하는 사이트는 나머지 3개 API(sitemap/crawling/lighthouse)를 아예
  호출하지 않고 차단 화면만 보여준다. 비용 절감·크롤링 윤리 목적.

## 기능 요구사항

1. Given 사용자가 `/request-scan`에 진입, When `ProcessScreen`이 스캔을 시작하면,
   Then `robotsTxt` API를 가장 먼저 단독으로 `await` 호출하고 그 결과가 오기 전엔
   sitemap/crawling/lighthouse를 호출하지 않는다
2. Given `robotsTxt` 응답의 `allow["*"]`가 `false`, When 판정 결과를 받으면,
   Then 나머지 3개를 호출하지 않고 즉시 `BlockedScreen`을 렌더한다(하드 차단, 진행 옵션 없음)
3. Given `robotsTxt` 응답의 `has`가 `false`(robots.txt 자체가 없음), When 판정 결과를 받으면,
   Then `allow["*"] === true`와 동일하게 처리해 나머지 3개를 정상 호출한다
4. Given `allow["*"]`가 `true`, When 판정 결과를 받으면, Then 기존처럼 나머지 3개를 병렬 호출한다
   (이 흐름 자체는 pipe-connection 스코프)
5. Given `robotsTxt` API 자체가 실패(네트워크 오류 등), When 에러를 받으면,
   Then 기존 `ErrorScreen`으로 처리한다 — `BlockedScreen`(명시적 비허용 전용)과 혼동하지 않는다
6. Given `ProcessScreen`이 마운트됨, When robots.txt 응답을 기다리는 동안,
   Then 기존 4개 스텝 타일을 그대로 렌더한다(신규 로딩 UI 없음)
7. Given robots.txt 판정이 차단으로 확정, When 그 결과를 받으면,
   Then 스텝 타일 화면 전체를 `BlockedScreen`으로 교체(unmount)한다
8. Given robots.txt가 비허용 판정, When `BlockedScreen`을 렌더하면,
   Then `disallowRule` prop 없이(생략) 렌더한다 — "이 사이트는 robots.txt가 스캔을 차단하고
   있습니다" 수준의 일반 문구만 표시
9. Given `BlockedScreen`을 새로 연결, When 카피가 필요하면,
   Then `dictionaries/{ko,en}.json`에 전용 키를 추가하고 컴포넌트 내부 하드코딩 삼항을 제거,
   `t.xxx` 패턴으로 교체한다

## 비고

- 스코프 아님: robots.txt 파싱/판정 로직 자체(이미 `ScanService.robotsTxt`에 구현됨),
  와일드카드 외 특정 봇 이름별 규칙 반영(v0.2 후보), 차단 규칙 텍스트(`disallowRule`) 노출(후속
  스코프 후보 — 백엔드가 매칭된 규칙을 반환하도록 확장해야 함), Indexing 카드에 "robots.txt 허용"
  배지 표시(PRD가 명시적으로 뺌)
- `BlockedScreen.tsx`는 이미 파일이 존재(ADR-010 마이그레이션 때 자리만 옮겨둠) — 새로 만드는 게
  아니라 실제 게이팅 로직과 연결 + 카피를 dictionaries로 이관하는 작업
- pipe-connection과 이슈를 분리하되, pipe-connection PR은 이 기능이 `dev`에 먼저 병합된 뒤 그 위에서
  분기해야 충돌이 없음

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | robots.txt 자체가 없는 사이트는? | 허용으로 간주, 정상 진행 | 표준 관행과 일치, 대다수 사이트가 robots.txt 없음 |
| 2 | 차단 규칙 텍스트는 어디서? | 이번엔 텍스트 없이 차단 사실만 표시 | 백엔드 확장 없이 진행 가능, 최소 변경 |
| 3 | robots.txt 대기 중 UI는? | 기존 4개 스텝 타일 그대로, 차단 시 BlockedScreen 전환 | 최소 변경, 기존 로딩 UX 재사용 |
| 4 | BlockedScreen 카피 위치는? | dictionaries로 이관 | 신규 화면이므로 처음부터 정식 패턴 |
| 5 | 이슈 몇 개로 등록? | 별도 2개, robots-gating 먼저 | TDD 루프의 수직 슬라이싱 원칙 유지 |
