# 기능 정의서 — robots.txt 차단 게이팅

## 기능 개요
- 상태: 미구현 | 패키지: front | PRD §3.0,§6.2 | ADR-006
- 의존성: pipe-connection과 같은 파일(`ProcessScreen.tsx`) — 병합 순서 조율 필요
- robots.txt가 스캔을 비허용하는 사이트는 나머지 3개 API(sitemap/crawling/lighthouse)를 아예
  호출하지 않고 차단 화면만 보여준다. 비용 절감·크롤링 윤리 목적.

## 기능 요구사항
- Given 사용자가 `/request-scan`에 진입, When `ProcessScreen`이 스캔을 시작하면,
  Then `robotsTxt` API를 가장 먼저 단독으로 `await` 호출하고 그 결과가 오기 전엔
  sitemap/crawling/lighthouse를 호출하지 않는다
- Given `robotsTxt` 응답의 `allow["*"]`가 false, When 판정 결과를 받으면,
  Then 나머지 3개를 호출하지 않고 즉시 `BlockedScreen`을 렌더한다(하드 차단, 진행 옵션 없음)
- Given `allow["*"]`가 true, When 판정 결과를 받으면, Then 기존처럼 나머지 3개를 병렬 호출한다
  (이 흐름 자체는 pipe-connection 스코프)
- Given `robotsTxt` API 자체가 실패(네트워크 오류 등), When 에러를 받으면,
  Then 기존 `ErrorScreen`으로 처리한다 — `BlockedScreen`(명시적 비허용 전용)과 혼동하지 않는다

## 비고
- 스코프 아님: robots.txt 파싱/판정 로직 자체(이미 `ScanService.robotsTxt`에 구현됨),
  와일드카드 외 특정 봇 이름별 규칙 반영(v0.2 후보), Indexing 카드에 "robots.txt 허용" 배지
  표시(PRD가 명시적으로 뺌 — `/scan`에 도달했다는 것 자체가 이미 허용됐다는 뜻)
- `BlockedScreen.tsx`는 이미 파일이 존재(ADR-010 마이그레이션 때 자리만 옮겨둠) — 새로 만드는 게
  아니라 실제 게이팅 로직과 연결하는 작업. 다국어 카피(`dictionaries/{ko,en}.json`)도 필요.
