# 기능 정의서 — 국제화/검색 UX 체크리스트 카드

## 기능 개요
- 상태: 전부 미구현 | 패키지: both | PRD §3.6
- 의존성: pipe-connection 완료 후
- 완전 신규, 가장 작은 그룹(2항목). hreflang/viewport 신규 추출·판정.

## 기능 요구사항
- Given `crawling`의 DOM 파싱, When hreflang을 확인하면,
  Then `hreflang`(존재=pass, 없음=info)을 `checks.i18nUx`에 추가한다
- Given `crawling`의 DOM 파싱, When viewport 메타를 확인하면,
  Then `viewport`(존재=pass, 없음=warning)를 `checks.i18nUx`에 추가한다
- Given `checks.i18nUx`, When `/scan`을 렌더하면, Then 신규 "국제화/UX" 카드가 2개 항목을
  실데이터 배지로 표시한다

## 비고
- 항목 수가 적다고 다른 카드에 합치지 않음 — PRD가 별도 카드로 명시
