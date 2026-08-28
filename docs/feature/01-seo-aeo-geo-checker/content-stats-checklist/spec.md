# 기능 정의서 — 콘텐츠 품질(Content Stats) 체크리스트 카드

## 기능 개요
- 상태: h1만 구현 | 패키지: both | PRD §3.1(h1 흡수분),§3.5
- 의존성: pipe-connection 완료 후, basic-seo-checklist 이후 권장(h1 판정 이관)
- 단어 수/헤딩(h2·h3)/TL;DR 신규 추출·판정, 기존 h1 판정을 이 그룹으로 흡수.

## 기능 요구사항
- Given `crawling`의 DOM 파싱, When h2/h3를 h1과 함께 수집하면,
  Then `wordCount`(600~2,000자=pass, 범위 밖=warning), `headings`(h1 1개+h2/h3 존재=pass,
  h1 0개/2개 이상=warning — 기존 h1 판정을 이 id로 흡수·이관), `tldr`(존재=pass, 없음=info)를
  `checks.content`에 추가한다
- Given basic-seo-checklist가 이미 배포된 상태, When 이 기능을 구현하면,
  Then `basicSeo` 그룹에서 h1 판정을 제거하는 회귀 없는 마이그레이션이 되어야 한다
- Given `checks.content`, When `/scan`을 렌더하면, Then 기존 Content Stats 카드가 3개 항목을
  실데이터 배지로 표시한다

## 비고
- basic-seo-checklist와 겹치는 유일한 지점(h1 이관) — 순서 주의
