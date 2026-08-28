# 기능 정의서 — 미리보기(Previews) 체크리스트 카드

## 기능 개요
- 상태: OG/Twitter만 구현 | 패키지: both | PRD §3.3
- 의존성: pipe-connection 완료 후
- OG/Twitter 판정은 이미 있음. og:image 크기·favicon 신규 판정 + 실제 카드 미리보기 렌더링 추가.

## 기능 요구사항
- Given `crawling`의 DOM 파싱, When og:image 메타를 확인하면,
  Then `ogImageDimensions`(있음=pass, 없음=warning, 신규 — 실측 아님, 메타 태그 존재만 확인)를
  `checks.previews`에 추가한다
- Given `crawling`의 DOM 파싱, When favicon을 확인하면,
  Then `favicon`(`link[rel~="icon"]` 존재=pass, 없음=warning, 신규)을 추가한다
- Given OG/Twitter 원본 값(og:title/og:description/og:image, twitter:*), When 추출하면,
  Then 판정용이 아니라 프론트 미리보기 렌더링용으로 응답에 포함한다
- Given `checks.previews` + 원본 값, When `/scan`을 렌더하면, Then 기존 Previews 카드가 배지
  4개를 표시하고, 그 아래 실제 카드 미리보기 UI(구글/트위터 스타일)를 렌더링한다

## 비고
- 스코프 아님: og:image 실제 픽셀 크기 측정(이미지 다운로드/디코딩, v0.2 후보)
