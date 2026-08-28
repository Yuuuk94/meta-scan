# 기능 정의서 (확정) — 미리보기(Previews) 체크리스트 카드

> `spec.md` 검토 완료(빠른 검토 — 크리티컬 항목 1개만).

## 기능 개요
- 상태: OG/Twitter만 구현 | 패키지: both | PRD §3.3
- 의존성: pipe-connection 완료 후

## 기능 요구사항

1. Given `crawling`의 DOM 파싱, When og:image 메타를 확인하면, Then `ogImageDimensions`(있음=pass,
   없음=warning, 실측 아님 메타 존재만 확인)를 `checks.previews`에 추가한다
2. Given `crawling`의 DOM 파싱, When favicon을 확인하면, Then `link[rel~="icon"]`이 있으면
   pass, 없으면 `/favicon.ico`를 HEAD로 추가 체크해 200이면 pass, 둘 다 없으면 warning으로
   `favicon`을 `checks.previews`에 추가한다(관례적 `/favicon.ico` 폴백을 인정 — `<link>` 태그가
   없는 사이트가 실제로 많음)
3. Given OG/Twitter 원본 값(og:title/og:description/og:image, twitter:*), When 추출하면,
   Then 판정용이 아니라 프론트 미리보기 렌더링용으로 응답에 포함한다(`ScanService.crawling`이
   이미 `openGraph`/`twitter` 객체로 추출 중 — 재사용)
4. Given `checks.previews` + 원본 값, When `/scan/:id`를 렌더하면, Then 기존 Previews 카드가
   배지 4개(OG 필수 태그/Twitter Card/og:image 크기/favicon)를 표시하고, 그 아래 실제 카드
   미리보기 UI(구글/트위터 스타일)를 렌더링한다

## 비고

- 스코프 아님: og:image 실제 픽셀 크기 측정(이미지 다운로드/디코딩, v0.2 후보)

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | `<link rel="icon">` 없이 `/favicon.ico` 관례만 있는 경우? | `/favicon.ico` 폴백도 확인 | 실제로 많은 사이트가 이 방식만 씀, 안 하면 오판 |
