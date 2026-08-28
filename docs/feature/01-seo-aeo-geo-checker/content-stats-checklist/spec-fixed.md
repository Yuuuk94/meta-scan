# 기능 정의서 (확정) — 콘텐츠 품질(Content Stats) 체크리스트 카드

> `spec.md` 검토 완료(빠른 검토 — 크리티컬 항목 1개만).

## 기능 개요
- 상태: h1만 구현 | 패키지: both | PRD §3.1(h1 흡수분),§3.5
- 의존성: pipe-connection 완료 후, basic-seo-checklist 이후 권장(h1 판정 이관)

## 기능 요구사항

1. 본문 길이 판정은 **글자 수(character count)**로 한다 — PRD 원문의 "본문 단어 수"라는 항목명은
   부정확한 표기였음(임계값 자체가 "600–2,000자"로 이미 글자 수 단위였음). 항목명을
   `wordCount`가 아니라 `charCount`(또는 "본문 길이")로 정정한다.
2. Given `crawling`의 DOM 파싱, When h2/h3를 h1과 함께 수집하면, Then `charCount`(600~2,000자
   범위=pass, 범위 밖=warning), `headings`(h1 1개+h2/h3 존재=pass, h1 0개/2개 이상=warning —
   기존 h1 판정을 이 id로 흡수·이관), `tldr`(존재=pass, 없음=info)를 `checks.content`에 추가한다
3. Given basic-seo-checklist가 이미 배포된 상태, When 이 기능을 구현하면, Then `basicSeo` 그룹에서
   h1 판정을 제거하는 회귀 없는 마이그레이션이 되어야 한다
4. Given `checks.content`, When `/scan/:id`를 렌더하면, Then 기존 Content Stats 카드가 3개 항목을
   실데이터 배지로 표시한다

## 비고

- basic-seo-checklist와 겹치는 유일한 지점(h1 이관) — 순서 주의
- **후속 작업(별도)**: `docs/prd/meta-scan-plus-prd.md` §3.5의 "본문 단어 수" 표기를 "본문 길이(글자
  수)"로 정정 필요

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | 본문 길이 — 글자 수? 단어 수? (PRD 표기 모순) | 글자 수(character count) | PRD의 임계값(600~2,000)이 이미 "자" 단위, 한/영 혼용에도 구현 단순 |
