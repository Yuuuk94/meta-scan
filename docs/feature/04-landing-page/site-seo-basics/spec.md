# 기능 정의서 — 메타스캔 자체 sitemap.xml / robots.txt

## 기능 개요
- 상태: 미구현 | 패키지: front
- meta-scan 자기 자신의 사이트를 위한 `sitemap.xml`/`robots.txt` (Next.js 라우트 핸들러).
  스캔 대상 사이트의 robots.txt/sitemap을 다루는 카테고리 1의 체커 기능과는 다른, 이 사이트
  자신의 SEO 기반 설정.

## 기능 요구사항
- Given 검색엔진이 메타스캔 사이트를 크롤링, When `/sitemap.xml`을 요청하면,
  Then 실제 라우트(`/`, `/request-scan`, `/scan`, `/privacy`, `/terms`) 목록을 반환한다
- Given 검색엔진이 메타스캔 사이트를 크롤링, When `/robots.txt`를 요청하면,
  Then 크롤링 허용 정책과 sitemap 위치를 반환한다

## 비고
- 코드에 현재 관련 라우트 파일이 전혀 없음(확인 완료) — 완전 신규
