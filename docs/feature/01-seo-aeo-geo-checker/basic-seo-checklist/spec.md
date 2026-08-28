# 기능 정의서 — 기본 SEO 체크리스트 카드

## 기능 개요
- 상태: 판정 로직 구현 완료, 카드 연결 미구현 | 패키지: both | PRD §3.1,§5.2
- 의존성: pipe-connection 완료 후
- title/description/keywords/이미지 alt/중복 meta는 이미 `ScanService.crawling`의 `runChecks()`가
  판정까지 끝내서 반환 중. 새 판정 로직이 아니라 응답을 그룹 객체(`checks.basicSeo[]`)로 감싸고
  프론트에 카드를 신설하는 작업.

## 기능 요구사항
- Given `crawling` 응답, When 클라이언트가 받으면, Then title/desc/keywords/img alt/중복meta
  5개 판정이 `checks.basicSeo` 배열에 `{ id, status, detail? }` 형태로 포함된다
  (h1 판정은 여기 넣지 않고 content-stats-checklist로 흡수)
- Given `checks.basicSeo` 배열, When `/scan`을 렌더하면, Then 신규 "기본 SEO" 카드가 5개 항목을
  `StatusBadge`(pass/warning/fail/info)로 표시한다
- Given 각 항목, When 사용자가 보면, Then 판정 배지 옆에 `detail` 기반 설명 텍스트가 충분히
  채워져 있다(애드센스 운영 고려, PRD §8)

## 비고
- 스코프 아님: h1 개수 판정(content-stats-checklist), `info` 배지 스타일 신설(디자인 시스템에
  이미 정의돼 있는지 먼저 확인)
