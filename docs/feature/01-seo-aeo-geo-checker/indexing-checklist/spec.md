# 기능 정의서 — 색인/크롤링(Indexing) 체크리스트 카드

## 기능 개요
- 상태: 절반 구현 | 패키지: both | PRD §3.2,§5.2
- 의존성: pipe-connection 완료 후
- sitemap 존재 확인은 이미 있고, canonical/noindex 판정 신규 추가 + robots.txt 관련 항목 확장이
  필요하다.

## 기능 요구사항
- Given `siteMap` 엔드포인트, When sitemap.xml HEAD 체크가 끝나면,
  Then `checks: [{ id: "sitemapExists", status }]`을 응답에 포함한다(존재=pass, 없음=warning)
- Given `crawling`의 DOM 파싱, When canonical 태그를 확인하면,
  Then `canonical`(정상/자기참조=pass, 없음/상대경로=warning)과
  `canonicalMultiple`(1개=pass, 2개 이상=fail, 신규)을 `checks.indexing`에 추가한다
- Given `crawling`의 DOM 파싱, When `<meta name="robots">`를 확인하면,
  Then `noindex`(없음=pass, 있음=fail, 신규)를 `checks.indexing`에 추가한다
- Given robots.txt 응답, When sitemap 선언 여부를 확인하면,
  Then `sitemapDeclaredInRobots`(선언됨=pass, 없음=info)를 `checks.indexing`에 추가한다
  (이미 파싱된 `robotsTxt().sitemap` 재사용, sitemap.xml 직접 체크와는 별개 신호로 둘 다 표시)
- Given `checks.indexing` 배열, When `/scan`을 렌더하면, Then 기존 Indexing 카드가 위 항목들을
  실데이터 배지로 표시한다

## 비고
- robots.txt 상세 내용(규칙 원문, User-agent별 목록 등) 노출은 이번 스코프에서 제외 — 다음
  스코프로 이월. 지금은 "선언 여부" 수준 배지만.
- "robots.txt 허용" 배지는 이 카드에 넣지 않음 — robots-gating으로 이동(여기 도달했다는 것 자체가
  이미 허용됐다는 뜻이라 중복 배지 제거, PRD §3.2)
- 스코프 아님: sitemap.xml 내 URL 개수 카운트(v0.2), 봇별 세부 규칙(v0.2)
