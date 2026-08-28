# 기능 정의서 (확정) — 기본 SEO 체크리스트 카드

> `spec.md` 검토 완료. 이 파일이 최종 스펙입니다. 검토 과정의 Q&A는 맨 아래 "검토 결정 로그" 참고.

## 기능 개요
- 상태: 판정 로직 구현 완료, 카드 연결 미구현 | 패키지: both | PRD §3.1,§5.2
- 의존성: pipe-connection 완료 후
- title/description/keywords/이미지 alt/중복 meta는 이미 `ScanService.crawling`의 `runChecks()`가
  판정 로직을 갖고 있지만, 문제 있을 때만 push하는 방식이라 항상 5개를 명시적으로 반환하도록
  바꾸고, 응답을 그룹 객체(`checks.basicSeo[]`)로 감싸 카드를 신설한다.

## 기능 요구사항

1. Given `crawling`이 5개 항목을 판정, When 응답을 만들면, Then 문제 여부와 무관하게 5개 항목
   (`title.missing`/`title.length`/`desc.missing`/`desc.length`/`keywords.deprecated`/
   `img.altMissing`/`meta.duplicate` — 실질적으로 title/desc는 각각 존재+길이 판정이 상호배타적
   이므로 5개 카드 행)이 모두 `checks.basicSeo` 배열에 `{ id, status, detail? }`로 포함된다
   (h1 판정은 여기 넣지 않고 content-stats-checklist로 흡수)
2. `detail`은 옵셔널(`detail?: number`)이며 숫자가 자연스러운 항목만 채운다: `title.length`→실제
   글자 수, `desc.length`→실제 글자 수, `img.altMissing`→누락 개수, `meta.duplicate`→중복 개수.
   존재 여부만 따지는 항목(`title.missing`, `desc.missing`, `keywords.deprecated`)은 생략.
3. Given 프론트가 `detail`(숫자)을 받으면, When 카드에 렌더하면, Then `dictionaries/{ko,en}.json`의
   문구 템플릿에 값을 채워 문장을 조립한다(백엔드는 문장을 직접 반환하지 않음, 다국어 대응)
4. `img.altMissing`은 `alt` 속성이 없는 경우와 `alt=""`(빈 문자열, 장식용 이미지 표기)를 모두
   "누락"으로 카운트한다(기존 로직 유지 — 접근성 모범 사례를 따르는 사이트가 오판받는 한계를
   인지하고 진행, 후속 개선 후보)
5. `keywords.deprecated`는 `<meta name="keywords">`의 `content`가 비어있으면(`content=""`)
   "미사용"(pass)으로 판정한다(태그 존재 자체가 아니라 실질적 내용 유무 기준, 기존 로직 유지)
6. Given `checks.basicSeo` 배열, When `/scan/:id`를 렌더하면, Then "기본 SEO" 카드가 5개 항목을
   `StatusBadge`(pass/warning/fail/info)로 표시한다

## 비고

- 스코프 아님: h1 개수 판정(content-stats-checklist), `info` 배지 스타일 신설(디자인 시스템에
  이미 정의돼 있는지 먼저 확인)
- pipe-connection의 id 기반 라우팅(`/scan/:id`) 결정을 그대로 따름

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | pass 항목도 백엔드가 명시? 프론트가 추론? | 백엔드가 5개 전부 명시적으로 반환 | 스키마 드리프트에 강건, 다른 체크리스트도 같은 패턴 |
| 2 | detail은 문장? 구조화된 값? | 구조화된 값(숫자)만, 문장은 프론트가 dictionaries로 조립 | 다국어 대응 자연스러움 |
| 3 | detail 필수? 옵션? | 옵션 필드 | 억지로 숫자를 만들 필요 없음 |
| 4 | alt="" 와 alt 속성 없음 구분? | 현행 유지(둘 다 누락) | 단순함 우선(사용자 선택), 한계는 인지 |
| 5 | 빈 content의 keywords 태그는 "사용"? | 미사용(pass)으로 유지 | 실질적 내용 없는 태그를 굳이 경고할 실익 없음 |
