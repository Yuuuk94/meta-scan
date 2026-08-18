# PRD — Meta-Scan "Plus" (SEO/AEO 체크리스트)

> 이 문서는 v1(점수 합산형 "AI Preparedness Index") PRD를 대체합니다. v1의 스코어링 엔진(0–100
> 가중합산)은 사용자 본인이 낸 기획이 아니라 이전 세션에서 AI가 덧붙인 것으로 확인되어 폐기했습니다.
> 원래 기획 의도는 **크롤링 결과를 SEO/AEO 체크리스트로 보여주는 수동적 진단 도구**이며, 수익 모델은
> **Google 애드센스**(무료 도구 + 광고 트래픽)입니다 — 점수를 매겨 유료화하는 방향이 아닙니다. 이
> 전제가 이번 문서 전체를 관통합니다.
>
> 또한 이 문서는 [ADR-003](adr/index.html#adr-003)(2026-08-13 기획 인터뷰로 확정)의 아키텍처 결정을
> 그대로 따릅니다: **백엔드 통합 엔드포인트(`/api/v1/scan/analyze`)는 만들지 않고, 기존 4개 API
> (robots/sitemap/crawling/lighthouse) 호출을 유지**합니다. 이유는 `ProcessScreen`의 5단계 진행
> UI가 각 API의 실제 완료 시점에 반응하게 하기 위해서입니다 — 단일 엔드포인트로 합치면 완료 시점이
> 하나뿐이라 진행률 UI가 다시 가짜가 됩니다. v1 PRD와 이번 문서의 초안 리비전에서 이 엔드포인트를
> 되살렸던 적이 있는데, 그건 ADR-003을 모르고 되돌아간 실수였습니다 — 최종 결정은 ADR-003 유지입니다.

## 0. 요약: 지금 뭐가 있고 뭐가 없나

| 영역 | 상태 | 비고 |
|---|---|---|
| 크롤링 인프라 (Puppeteer 페이지 로드 + DOM 추출) | ✅ 구현됨 | `scanService.getOnloadHtml` |
| 기본 메타 추출 (title/description/keywords/canonical/h1/og/twitter/img alt) | ✅ 구현됨 | `scanService.crawling` → `runChecks` |
| robots.txt 파싱 + allow 판정 | ✅ 구현됨 | `scanService.robotsTxt` (자체 파서) |
| sitemap.xml 존재 확인(HEAD) | ✅ 구현됨 (URL 개수 카운트는 미구현) | `scanService.siteMap` |
| Lighthouse 점수 (performance/seo/best-practices/accessibility) | ✅ 구현됨, **그대로 유지** | `LighthouseService` — 구글 자체 점수라 우리 체크리스트와 별도 취급 |
| **AI 신호(AEO)·구조화 데이터·prompts.txt·hreflang/viewport 등 체크 항목** | ❌ 미구현 | 백엔드에 관련 코드 없음 |
| ~~스코어링 엔진(0–100 가중합산)~~ | 폐기 | v1에서 있었으나 이번 문서에서 제거 — 아래 "왜 걷어냈는가" 참고 |
| 결과 통합 API (`/api/analyze` 성격) | 계획 취소 (ADR-003) | 신규 엔드포인트는 만들지 않음 — 기존 4개 API 유지 + `crawling` 응답 확장 + 프론트 판정 |
| 결과 리포트 UI (배지/탭/카드) | ✅ **카드 구조는 이미 체크리스트에 가까움**, ❌ **데이터는 전부 `Math.random()` 목업**, 중앙 Hero는 합산 점수라 교체 필요 | `app/[lang]/scan/page.tsx` |
| 다국어 카피(한/영) | ✅ 대부분 존재, `aiPreparednessScore` 등 일부는 재정의 필요 | `dictionaries/{ko,en}.json`의 `scan.*` 키 |
| 분석 진행 화면 | ✅ UI 구현됨, ⚠️ **API 응답을 버림** | `ProcessScreen.tsx` |

**가장 중요한 발견(v1과 동일)**: `/scan` 결과 페이지는 필요한 화면 골격(AI Signals 카드, Indexing
카드, Content Stats 카드, 탭)을 이미 갖고 있고, 각 항목이 이미 `StatusBadge`(pass/fail)로 표시되고
있습니다 — 즉 **카드 레벨 구조는 이미 체크리스트 형태**입니다. 바뀌어야 하는 건 두 가지뿐입니다:
① 중앙의 "AI Preparedness Score" 합산 숫자 Hero를 없애고, ② `ProcessScreen`이 버리는 API 응답을
저장해 목업 대신 실데이터를 흘려보내는 것.

### 왜 스코어링 엔진을 걷어냈는가

* 사용자의 원래 기획은 "체크리스트를 점검해주는" **수동적 진단 도구**였지, "AI 친화도를 하나의 점수로
  평가하는" **능동적 스코어링 제품**이 아니었습니다.
* 수익 모델이 **애드센스**(무료·고트래픽·광고 기반)라서, 점수 합산·가중치·등급 같은 프리미엄 진단
  제품의 문법과 방향이 안 맞습니다.
* 부수 효과: 가장 복잡하고 주관적이었던 부분(가중치 합산 규칙, `topFixes` 생성 로직)이 통째로
  없어지므로 구현 범위가 단순해집니다. 각 체크 항목은 **점수가 아니라 pass/warning/fail** 셋 중
  하나로만 판정하면 됩니다.

## 1. 목표

* 기존 Lighthouse 4개 점수(성능/SEO/접근성/모범사례)는 그대로 유지
* Lighthouse가 다루지 않는 SEO/AEO 항목(구조화 데이터, AI 신호, 색인 제약, 미리보기, 콘텐츠 품질,
  국제화/UX)을 **개별 체크리스트 항목**으로 pass/warning/fail 판정해 보여줌 — 합산 점수 없음
* 이미 만들어진 `/scan` 리포트 화면에 **실제 분석 결과를 연결**, 합산 점수 Hero는 "가장 심각한 실패
  항목 N개" 강조 영역으로 교체
* 외부 ML/유료 API 없이, 기존에 이미 쓰고 있는 **Puppeteer + 자체 파싱**만으로 구현 (신규 라이브러리
  추가 없음 — 이미 페이지를 로드해둔 Puppeteer의 `page.evaluate` 안에서 함께 추출)
* 애드센스 승인/운영을 염두에 둠 — 결과 화면은 로그인 없이 접근 가능해야 하고, 원본 콘텐츠(체크 결과
  설명)가 페이지마다 충분히 있어야 함 (자세한 내용은 8절)

## 2. 사용자 시나리오 (실제 라우팅 기준, v1과 동일)

1. 메인 페이지에서 URL 입력 → `crrUrl` 쿠키 저장 후 `/request-scan` 이동
2. `/request-scan` (서버 컴포넌트) — `sitePingApi`로 사이트 생존 확인 → `ProcessScreen` 렌더
3. `ProcessScreen` (클라이언트 컴포넌트) — **[변경 대상]** 현재는 robots/sitemap/crawling/lighthouse
   4개를 병렬 호출 후 결과를 버리고 `/scan`으로 이동함. 4개 호출 구조 자체는 유지하되(ADR-003), **각
   응답을 저장하고 4개가 다 모이면 프론트에서 체크리스트를 계산해 저장한 뒤 이동**으로 바꿔야 함.
4. `/scan` — **[변경 대상]** 현재는 서버 컴포넌트에서 mock 데이터만 렌더링. 실제 체크리스트 결과를
   받아 기존 카드 구조에 바인딩하고, Hero만 교체.

## 3. 체크리스트 항목 명세 (그룹별)

각 항목에 **어디서 계산할지 / 판정 기준(pass·warning·fail)**을 명시했습니다. 새 파일을 늘리기보다,
`scanService.getOnloadHtml`의 `page.evaluate` 추출 로직을 확장하는 쪽을 기본값으로 합니다(같은
페이지를 다시 fetch/파싱하지 않기 위함).

### 3.1 색인/크롤링 (Indexing) — 기존 카드 확장

| 항목 | 판정 | 출처 |
|---|---|---|
| robots.txt 허용 여부 | 허용=pass, 차단=fail | 이미 있음(`scanService.robotsTxt`) |
| sitemap.xml 존재 | 존재=pass, 없음=warning | 이미 있음(`scanService.siteMap`) |
| canonical 존재/자기참조 | 정상=pass, 없음/상대경로=warning | 이미 있음(`extract.canonical`, `runChecks`) |
| canonical 다중 태그 | 1개=pass, 2개 이상=fail | 신규 — DOM 추출에 카운트 추가 |
| `<meta name="robots">` noindex | 없음=pass, 있음=fail(치명) | 신규 — DOM 추출에 추가 |

### 3.2 미리보기 (Previews) — 기존 카드 확장

| 항목 | 판정 | 출처 |
|---|---|---|
| OG 필수 태그 | 충족=pass, 누락=warning | 이미 있음(`og.missing_core`) |
| Twitter Card | 충족=pass, 누락=warning | 이미 있음(`twitter.missing_card`) |
| og:image width/height 메타 | 있음=pass, 없음=warning | 신규 — 실제 이미지 다운로드 없이 메타 태그 존재만 확인(3일 범위 조정, 실측은 9절 참고) |
| favicon / touch icon | 있음=pass, 없음=warning | 신규 — `link[rel~="icon"]` DOM 추출 |

### 3.3 AI 신호 (AI Signals / AEO) — 신규 카드 데이터

| 항목 | 판정 | 출처 |
|---|---|---|
| `/.well-known/prompts.txt` 존재 | 존재=pass, 없음=info(감점 아님, 권장) | 신규 `promptsTxt()` — `robotsTxt()`와 동일 패턴, fetch만 |
| `PromptObject` 타입 JSON-LD | 존재=pass, 없음=info | 구조화 데이터 탐지 재사용 |
| FAQ 섹션(`FAQPage` schema 또는 Q&A 패턴) | 존재=pass, 없음=info | DOM 추출에 추가 |
| 구조화 데이터 타입 목록 + JSON-LD 파싱 에러 | 목록 그대로 노출, 파싱 에러 1개 이상=warning | `page.evaluate` 확장: `script[type="application/ld+json"]`의 `@type` 수집 |

이 그룹은 "없다고 감점"이 아니라 "있으면 좋은 신호"로 표시(`info`)하는 항목이 많습니다 — 애드센스형
무료 진단 도구에서는 사용자를 겁주기보다 "이런 것도 있다"를 알려주는 쪽이 톤에 맞습니다.

### 3.4 콘텐츠 품질 (Content Stats) — 기존 카드 확장

| 항목 | 판정 | 출처 |
|---|---|---|
| 본문 단어 수 | 600–2,000자=pass, 범위 밖=warning | DOM 추출에 h2/h3 수집과 함께 추가 |
| 헤딩 계층 (h1 1개, h2/h3 존재) | 정상=pass, h1 0개/2개 이상=warning | 이미 있는 h1 외 h2/h3도 수집 |
| TL;DR/요약 블록 | 존재=pass, 없음=info | `[role="doc-abstract"]` 또는 "TL;DR" 텍스트 매칭 |

### 3.5 국제화/검색 UX — 신규 카드

| 항목 | 판정 | 출처 |
|---|---|---|
| hreflang | 존재=pass, 없음=info | DOM 추출에 추가 |
| `<meta name="viewport">` | 존재=pass, 없음=warning | DOM 추출에 추가 |

### 3.6 Lighthouse — 변경 없음

Performance / SEO / Accessibility / Best Practices 4개 숫자 점수 그대로 유지. 구글 자체 채점
기준이므로 우리 체크리스트의 pass/warning/fail 판정 대상에 포함하지 않습니다.

## 4. 판정 규칙 (스코어링 아님, ADR-003에 따라 프론트에서 계산)

각 항목은 **가중치 없이** 위 3절 표의 기준대로 `pass` / `warning` / `fail` / `info` 넷 중 하나로만
판정합니다. 합산 점수, 등급, 가중치는 없습니다. [ADR-003](adr/index.html#adr-003) 결정에 따라 이
판정은 **백엔드가 아니라 프론트 유틸**(`computeChecklist`, v1의 `computeAiPreparedness` 자리를
대체)이 4개 API 응답을 다 모은 뒤 클라이언트 사이드에서 수행합니다. 출력은 개수 요약과 상위 이슈만
포함합니다:

```
summary: { pass: number, warning: number, fail: number, info: number }
topIssues: CheckItem[]  // fail 우선, 모자라면 warning으로 채움 (기본 3개)
```

Hero 영역에는 `summary` 대신 이 `topIssues`를 그대로 노출합니다("지금 고쳐야 할 것"). 판정에 필요한
**원본 신호(구조화 데이터, prompts.txt, hreflang 등)는 여전히 백엔드에서 추출**해야 합니다 — "프론트
계산"은 가중치/합산 로직만 프론트로 가져온다는 뜻이지, DOM 접근이 필요한 원본 데이터 추출까지
프론트가 할 수 있다는 뜻이 아닙니다.

## 5. API 설계

### 5.1 기존 엔드포인트 (신규 엔드포인트 없음 — ADR-003)

새 엔드포인트는 만들지 않습니다. 기존 4개를 그대로 유지하고, `crawling` 하나만 응답을 확장합니다.

| 메서드/경로 | 설명 | 파일 | 변경 |
|---|---|---|---|
| `POST /api/v1/scan/ping` | 사이트 생존 확인 | `scan.router.ts` | 없음 |
| `POST /api/v1/scan/robotsTxt` | robots.txt 파싱/allow 판정 | 〃 | 없음 |
| `POST /api/v1/scan/siteMap` | sitemap.xml 존재 확인 | 〃 | 없음 |
| `POST /api/v1/scan/crawling` | 메타/OG/Twitter/h1/이미지 alt + `checks[]` | 〃 | **확장** (아래 5.2) |
| `POST /api/v1/lighthouse/run` | Lighthouse 실행 | `lighthouse.router.ts` | 없음 |

### 5.2 `crawling` 응답 확장 (신규 필드만 추가, 기존 필드는 유지)

`scanService.getOnloadHtml`의 `page.evaluate` 안에서 3절의 신규 항목들을 함께 추출해 `crawling`
응답에 필드를 추가합니다. 같은 페이지를 두 번 열지 않기 위해 **이미 로드해둔 Puppeteer 페이지에서
한 번에** 뽑습니다. `prompts.txt`만 예외로, DOM이 필요 없는 순수 fetch라 `crawling`이 원본 HTML을
가져올 때 쓰는 것과 같은 방식으로 같은 호출 안에서 병렬 fetch합니다(별도 API로 빼면 5번째 호출이
생겨 `ProcessScreen`의 4단계 구성이 깨짐 — ADR-003이 기각한 대안과 같은 이유).

```json
// POST /api/v1/scan/crawling 응답에 추가되는 필드 (기존 필드는 생략 표기)
{
  "...": "기존 title/description/og/twitter/h1/alt 등 그대로",
  "aiSignals": {
    "promptsTxt": { "exists": true, "bytes": 1432 },
    "promptObject": true,
    "faqSection": true,
    "structuredData": { "types": ["WebPage", "FAQPage"], "parseErrors": 0 }
  },
  "indexing": {
    "noindex": false,
    "canonicalCount": 1
  },
  "previews": {
    "ogImageHasDimensions": true,
    "favicon": true
  },
  "content": {
    "wordCount": 1340,
    "headings": { "h1": 1, "h2": 6, "h3": 12 },
    "hasTldr": false
  },
  "i18nUx": {
    "hreflang": ["en", "ko"],
    "viewport": true
  }
}
```

원본 신호 추출 로직은 `scanService` 내부에 유지하되(v1의 별도 `checklist.ts` 계획은 취소 — 판정
로직 자체가 프론트로 이동했으므로 백엔드에는 "추출"만 남습니다), 프론트의 `computeChecklist`가
소비할 필드 이름과 1:1로 맞춰 `dto.ts`에 타입을 정의합니다.

## 6. 프런트 통합 계획 (ADR-003 유지: 4개 API 호출 그대로)

### 6.1 `ProcessScreen.tsx`

* `Promise.allSettled([robots, sitemap, crawling, lighthouse])` 호출 구조는 **그대로 유지** —
  더 이상 "성공 여부만 보고 버리는" 대신, 각 API가 끝날 때마다 응답 본문을 저장하고 해당 스텝
  아이콘을 실시간 '완료'로 반영 (더 이상 가짜 progress 아님)
* 4개가 모두 모이면 `computeChecklist(results)` 프론트 유틸을 호출해 `checks`/`summary`/
  `topIssues`를 계산
* 원본 4개 응답 + 계산 결과를 스토어에 저장(6.3) 후 `/scan`으로 이동 (쿼리 파라미터 없이, 스토어에서
  최신 결과를 읽음)

### 6.2 `app/[lang]/scan/page.tsx`

* **Hero 교체**: 중앙 "AI Preparedness Score" 큰 숫자 카드를 없애고, `topIssues`(fail 상위 N개)를
  강조하는 카드로 교체 — 카피 톤은 "점수가 낮습니다"가 아니라 "지금 고쳐야 할 것"
* 기존 AI Signals / Indexing / Content Stats 카드는 **구조 그대로 유지**, 데이터만 `StatusBadge`의
  `condition`을 pass/fail 불리언 대신 `status` 3~4값(pass/warning/fail/info)에 맞게 확장 (info는
  기존 success/destructive 2색 배지에 중립색 하나 추가 필요)
* 신규 카드: **국제화/UX**(hreflang, viewport) 카드 추가
* `interface AnalysisResult`를 스토어가 들고 있는 "4개 원본 응답 + `computeChecklist` 결과" 형태로
  교체, `aiPreparednessScore` 필드 제거
* 현재 async 서버 컴포넌트 + 하드코딩 mock 구조를 클라이언트 컴포넌트로 전환하거나, 서버 컴포넌트는
  얇은 쉘만 두고 결과 렌더링은 클라이언트 하위 컴포넌트로 분리
* 결과가 없을 때(직접 `/scan` 진입 등) 안내 화면 또는 `/`로 리다이렉트 처리 추가

### 6.3 스토어 (`stores/scanStore.ts`)

* 현재 `useBearStore`는 zustand 공식 예제 보일러플레이트가 그대로 남은 미사용 죽은 코드 — 도메인에
  맞게 이름부터 고침(예: `useScanStore`)
* `url → { raw: { robots, sitemap, crawling, lighthouse }, checklist: ChecklistResult }` 형태로
  최근 분석 결과 저장
* `computeChecklist` 로직 자체는 이 스토어 파일이 아니라 별도 유틸(예: `src/utils/checklist.ts`)에
  두고, 저장 시점에 호출

### 6.4 `src/apis/scan.ts`

* 신규 API 클라이언트 없음 — 기존 4개(`sitePingApi`/`scanRobotsTxtApi`/`scanSiteMapApi`/
  `scanCrawlingApi`/`lsRunApi`) 그대로 사용, `scanCrawlingApi`의 응답 타입만 5.2에 맞게 갱신

### 6.5 다국어 카피

* `dictionaries/{ko,en}.json`의 `scan.aiPreparednessScore` 키는 제거하고, Hero용 문구
  (`scan.topIssues` 등)와 `info` 상태 배지 문구, i18n/UX 카드 문구를 새로 추가

## 7. 3일 실행 체크리스트

### Day 1 — 백엔드: `crawling` 응답 확장 (신규 엔드포인트 없음)

* [ ] `scanService.getOnloadHtml`의 `page.evaluate` 함수에 구조화 데이터/hreflang/viewport/
  favicon/noindex/FAQ 섹션/TL;DR/canonical 다중/h2·h3/og:image 크기메타 추출 추가
* [ ] `scanService.crawling`에서 원본 HTML을 fetch하는 지점에 `/.well-known/prompts.txt` fetch를
  병렬로 추가 (`robotsTxt()`와 같은 존재/바이트 수 판정 로직을 내부 함수로 재사용, 별도 API 라우트는
  만들지 않음 — ADR-003이 5번째 API 호출을 기각한 이유와 동일)
* [ ] `dto.ts`에 5.2의 `crawling` 응답 확장 필드 타입 정의 (`AiSignals`/`Indexing`/`Previews`/
  `Content`/`I18nUx`)
* [ ] `swagger.ts`의 기존 `/api/v1/scan/crawling` 응답 스키마에 신규 필드 반영

### Day 2 — 프런트: 판정 유틸 + 스토어

* [ ] `src/utils/checklist.ts`(프론트) 신규 — 3~4절 규칙대로 4개 API 응답을 입력받아 각 항목
  pass/warning/fail/info 판정 + `summary`/`topIssues` 생성 (가중합산 없음, 순수 함수)
* [ ] `stores/scanStore.ts`의 `useBearStore`를 도메인에 맞게 재구현(`useScanStore`), 원본 4개 응답 +
  `computeChecklist` 결과 저장
* [ ] `apis/scan.ts`의 `scanCrawlingApi` 응답 타입을 5.2 확장 스키마로 갱신 (신규 API 클라이언트는
  추가하지 않음)

### Day 3 — 프런트 연결 + 검증

* [ ] `ProcessScreen.tsx`: 4개 API 호출 구조는 유지한 채, 각 완료 시점에 응답 저장 + 스텝 아이콘 실시간
  반영, 4개 완료 후 `computeChecklist` 호출 → 스토어 저장 → `/scan` 이동
* [ ] `app/[lang]/scan/page.tsx`: mock 제거, Hero 교체, 카드별 데이터 바인딩, `info` 상태 배지 스타일
  추가, i18n/UX 카드 신설
* [ ] `dictionaries/{ko,en}.json` 카피 정리
* [ ] 테스트 URL 세트로 수동 검증 (FAQ 있는 페이지 / 뉴스 기사 / noindex 페이지 / SPA)
* [ ] `pnpm -r typecheck && pnpm -r lint && pnpm -r build`로 최종 확인

## 8. 애드센스 운영 고려사항

* 결과 페이지(`/scan`)는 로그인/페이월 없이 공개 접근 가능해야 함 (현재도 그렇지만, 이후 인증 기능이
  생기더라도 이 페이지만은 예외로 유지)
* 각 체크 항목에는 `detail` 텍스트를 충분히 채워 페이지당 원본 콘텐츠 양을 확보 (애드센스는 얇은/자동
  생성 콘텐츠 페이지에 불리)
* 향후 광고 슬롯을 넣을 자리를 카드 사이(Overview/Details 탭 전환부 등)에 미리 고려 — 이번 스코프의
  구현 대상은 아니지만 레이아웃 설계 시 염두

## 9. 이번 스코프에서 의도적으로 뺀 것 (v0.2 후보)

* og:image 실제 픽셀 크기 측정(이미지 다운로드/디코딩) — 지금은 메타 태그 존재 여부만 확인
* sitemap.xml 내 URL 개수 카운트(GET + XML 파싱) — 지금은 존재 여부만
* 애드센스 실제 슬롯 삽입, 광고 정책 준수 세부 작업

## 10. 다음 단계 (이 PRD 범위 밖)

체크리스트 도구가 완성된 뒤, **`qna.json` 생성 도구**를 이어서 만들 계획입니다 — 이번 체크리스트가
"이 사이트엔 FAQ/PromptObject 신호가 없다"고 진단(진단)해주면, 후속 도구는 실제 페이지 콘텐츠를
기반으로 `qna.json`(질문-답변 쌍, prompts.txt/FAQPage 계열 포맷)을 생성해 처방까지 이어주는 도구입니다.
이번 문서에서는 다루지 않지만, 3.3절의 체크 항목(구조화 데이터 타입, FAQ 섹션 감지 로직)이 그대로
입력 데이터로 재사용될 가능성이 높으므로 해당 부분 구현 시 재사용을 염두에 둡니다.

## 11. 참고: 이번 계획과 무관하게 별도로 논의된 사항

같은 세션에서 "TubeBuddy를 레퍼런스로 한 YouTube SEO SaaS 피벗" 기획이 제안되었으나 사용자 요청으로
중단되었습니다. 본 문서는 YouTube 피벗과 무관하게, **현재 meta-scan의 웹사이트 SEO/AEO 체크리스트
방향을 그대로 이어가는** 계획입니다.
