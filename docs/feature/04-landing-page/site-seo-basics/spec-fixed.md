# 기능 정의서 (확정) — 메타스캔 자체 sitemap.xml / robots.txt

> `spec.md` 검토 완료(빠른 검토 — 크리티컬 항목 1개만).

## 기능 개요
- 상태: 미구현 | 패키지: front
- meta-scan 자기 자신의 사이트를 위한 `sitemap.xml`/`robots.txt` (Next.js 라우트 핸들러). 스캔
  대상 사이트의 robots.txt/sitemap을 다루는 카테고리 1의 체커 기능과는 다른, 이 사이트 자신의
  SEO 기반 설정.

## 기능 요구사항

1. Given 검색엔진이 메타스캔 사이트를 크롤링, When `/sitemap.xml`을 요청하면, Then ko/en
   로케일별로 실제 라우트(`/`, `/request-scan`, `/scan`, `/privacy`, `/terms`)를 각각 포함한
   전체 URL 목록을 반환한다(예: `/ko`, `/ko/request-scan`, `/en`, `/en/request-scan` ...) —
   검색엔진이 언어별 페이지를 각각 색인할 수 있게 함
2. Given 검색엔진이 메타스캔 사이트를 크롤링, When `/robots.txt`를 요청하면, Then 크롤링 허용
   정책과 sitemap 위치를 반환한다

## 비고
- 코드에 현재 관련 라우트 파일이 전혀 없음(확인 완료) — 완전 신규
- `/scan/:id`(pipe-connection 결정)는 개인화된 결과 페이지라 sitemap에 포함하지 않는다

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | sitemap에 로케일별 URL을 각각 넣을지? | 로케일별로 모두 포함 | 검색엔진이 언어별 페이지를 각각 색인하게 함 |
