# 기능 정의서 (확정) — 색인/크롤링(Indexing) 체크리스트 카드

> `spec.md` 검토 완료. 이 파일이 최종 스펙입니다. 검토 과정의 Q&A는 맨 아래 "검토 결정 로그" 참고.

## 기능 개요
- 상태: 절반 구현 | 패키지: both | PRD §3.2,§5.2
- 의존성: pipe-connection 완료 후, robots-gating이 먼저 받아둔 `robotsTxt` 응답을 재사용

## 기능 요구사항

1. Given `/sitemap.xml` HEAD 체크, When 200이면, Then `sitemapExists: pass`. 실패하면,
   `robotsTxt().sitemap`(robots-gating이 이미 받아둔 응답에서 추출)을 프론트가 `candidateSitemaps`
   파라미터로 `siteMap` API에 함께 전달하고, 백엔드가 그 URL들을 순차 HEAD 체크해 하나라도
   200이면 pass, 전부 실패하면 warning으로 판정한다
   (`POST /api/v1/scan/siteMap` 요청 바디에 `candidateSitemaps?: string[]` 옵셔널 필드 추가 —
   백엔드가 robots.txt를 중복 재조회하지 않도록 프론트가 전달)
2. Given `crawling`의 DOM 파싱, When canonical 태그를 확인하면, Then `canonical`(정상/자기참조=
   pass, 없음/상대경로=**info** — PRD 문서와 다르지만 코드 현행 유지, PRD §3.2는 별도로 수정 필요)와
   `canonicalMultiple`(1개=pass, 2개 이상=fail — href 값이 같든 다르든 개수만으로 판정)을
   `checks.indexing`에 추가한다
3. Given `crawling`의 DOM 파싱, When `<meta name="robots">`를 확인하면, Then `content`를 콤마/공백
   기준으로 분리해 토큰이 정확히 `"noindex"`인지 확인한다(단순 문자열 포함 검사 아님 — `"max-snippet:
   noindex-example"` 같은 오탐 방지). 있으면 fail(치명), 없으면 pass.
4. Given robots.txt 응답, When sitemap 선언 여부를 확인하면, Then `sitemapDeclaredInRobots`
   (선언됨=pass, 없음=info)를 `checks.indexing`에 추가한다(sitemap.xml 직접 체크와는 별개 신호로
   둘 다 표시)
5. Given `checks.indexing` 배열, When `/scan/:id`를 렌더하면, Then 기존 Indexing 카드가 위
   항목들을 실데이터 배지로 표시한다

## 비고

- robots.txt 상세 내용(규칙 원문, User-agent별 목록 등) 노출은 이번 스코프에서 제외 — 다음
  스코프로 이월. 지금은 "선언 여부" 수준 배지만.
- "robots.txt 허용" 배지는 이 카드에 넣지 않음 — robots-gating으로 이동(여기 도달했다는 것 자체가
  이미 허용됐다는 뜻이라 중복 배지 제거, PRD §3.2)
- 스코프 아님: sitemap.xml 내 URL 개수 카운트(v0.2), 봇별 세부 규칙(v0.2)
- **후속 작업(별도)**: `docs/prd/meta-scan-plus-prd.md` §3.2 표의 "canonical 없음/상대경로=warning"을
  "info"로 수정 필요(실제 코드/이 스펙과 일치시키기 위함)

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | canonical 없음/상대경로 — 코드 info vs PRD warning | 코드(info) 유지, PRD 문서를 수정 | 사용자 선택 |
| 2 | `/sitemap.xml` 404 시 robots.txt 선언 경로도 체크? | 포함(보완 로직 추가) | 실제 다른 경로 쓰는 사이트가 많아 오판 방지 |
| 3 | robots.txt sitemap 목록을 siteMap에 어떻게 전달? | 프론트가 `candidateSitemaps` 파라미터로 전달 | 백엔드 중복 조회 없이 ADR-003 4-API 독립성 유지 |
| 4 | canonical 다중 — 같은 URL/다른 URL 구분? | 구분 안 함(개수만) | PRD 기준 단순, 표준 가이드와도 일치 |
| 5 | noindex — 문자열 포함? 토큰 정확 매칭? | 토큰 정확 매칭(콤마 분리) | 오탐 방지, 실제 파서 관행과 일치 |
