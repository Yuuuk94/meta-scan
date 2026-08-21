# PRD — Meta-Scan "Plus" (SEO/AEO 체크리스트)

> 이 문서는 v1(점수 합산형 "AI Preparedness Index") PRD를 대체합니다. v1의 스코어링 엔진(0–100
> 가중합산)은 사용자 본인이 낸 기획이 아니라 이전 세션에서 AI가 덧붙인 것으로 확인되어 폐기했습니다
> ([ADR-005](../adr/index.html#adr-005)). 원래 기획 의도는 **크롤링 결과를 SEO/AEO 체크리스트로
> 보여주는 수동적 진단 도구**이며, 수익 모델은 **Google 애드센스**(무료 도구 + 광고 트래픽)입니다 —
> 점수를 매겨 유료화하는 방향이 아닙니다. 이 전제가 이번 문서 전체를 관통합니다.
>
> 이 문서는 다음 두 ADR의 아키텍처 결정을 그대로 따릅니다:
> * [ADR-003](../adr/index.html#adr-003) — 백엔드 통합 엔드포인트(`/api/v1/scan/analyze`)는 만들지
>   않고 기존 4개 API(robots/sitemap/crawling/lighthouse) 호출을 유지합니다. `ProcessScreen`의
>   단계별 진행 UI가 각 API의 실제 완료 시점에 반응하게 하려는 목적입니다. **판정(pass/warning/
>   fail/info)은 백엔드가 전부 수행**하고, 프런트는 4개 응답이 다 모이면 이미 판정된 결과를
>   그룹별로 합치기만 합니다(계산이 아니라 취합 — 최초 초안에서 "프론트가 판정까지 한다"로 잘못
>   갔다가 대화 중 정정됨).
> * [ADR-006](../adr/index.html#adr-006) — `robotsTxt`를 먼저 단독 실행해 비허용(disallow)이면
>   나머지 3개(sitemap/crawling/lighthouse)를 아예 호출하지 않고 차단 화면만 보여줍니다(비용 절감,
>   크롤링 윤리).

## 0. 요약: 지금 뭐가 있고 뭐가 없나

| 영역 | 상태 | 비고 |
|---|---|---|
| 크롤링 인프라 (Puppeteer 페이지 로드 + DOM 추출) | ✅ 구현됨 | `scanService.getOnloadHtml` |
| 기본 메타 추출 + 판정 (title/description/keywords/h1/img alt/중복 meta) | ✅ 구현됨(판정까지 포함) | `scanService.crawling` → `runChecks` — 이 패턴을 신규 항목에도 그대로 확장 |
| robots.txt 파싱 + allow 판정 | ✅ 구현됨 | `scanService.robotsTxt` (자체 파서) |
| **robots.txt 선검사 게이팅(비허용 시 하드 차단)** | ❌ 미구현 | [ADR-006](../adr/index.html#adr-006) — `ProcessScreen`이 아직 4개를 무조건 병렬 호출 |
| sitemap.xml 존재 확인(HEAD) | ✅ 구현됨 (URL 개수 카운트는 미구현) | `scanService.siteMap` |
| Lighthouse 점수 (performance/seo/best-practices/accessibility) | ⚠️ 구현됐지만 **프런트가 2개만 요청 중** | `LighthouseService`는 4개 지원, `apis/scan.ts`의 `lsRunApi`가 `onlyCategories: ["seo","performance"]`만 넘겨서 accessibility/best-practices 누락 — 수정 필요 |
| **AI 신호(AEO)·구조화 데이터·prompts.txt·hreflang/viewport 등 체크 항목 및 판정** | ❌ 미구현 | 백엔드에 관련 코드 없음. 판정까지 백엔드에서 함께 구현 |
| **기존에 추출/계산은 되지만 어느 체크리스트 그룹에도 안 걸린 데이터** | ⚠️ 방치 중 | `html.deltaRatio`(JS 렌더링 전후 HTML 차이 비율), `robotsTxt().sitemap`(robots.txt 안에 선언된 sitemap URL 목록) — 3절에서 그룹 배정 |
| ~~스코어링 엔진(0–100 가중합산)~~ | 폐기 | [ADR-005](../adr/index.html#adr-005) |
| 결과 통합 API (`/api/analyze` 성격) | 계획 취소 ([ADR-003](../adr/index.html#adr-003)) | 신규 엔드포인트는 만들지 않음 — 기존 4개 API 유지 + 각 엔드포인트가 판정까지 포함해 확장 |
| 결과 리포트 UI (배지/카드) | ✅ **카드 구조는 이미 체크리스트에 가까움**, ❌ **데이터는 전부 `Math.random()` 목업**, 중앙 Hero는 합산 점수라 교체 필요 | `app/[lang]/scan/page.tsx` |
| 다국어 카피(한/영) | ✅ 대부분 존재, `aiPreparednessScore` 등 일부는 재정의 필요 | `dictionaries/{ko,en}.json`의 `scan.*` 키 |
| 분석 진행 화면 | ✅ UI 구현됨, ⚠️ **API 응답을 버림**, ⚠️ **robots.txt 게이팅 없음** | `ProcessScreen.tsx` |
| robots.txt 차단 화면 | ❌ 미구현 | 신규 컴포넌트(가칭 `BlockedScreen.tsx`) 필요 |

**가장 중요한 발견**: `/scan` 결과 페이지는 필요한 화면 골격(AI Signals 카드, Indexing 카드,
Content Stats 카드)을 이미 갖고 있고, 각 항목이 이미 `StatusBadge`(pass/fail)로 표시되고 있습니다 —
즉 **카드 레벨 구조는 이미 체크리스트 형태**입니다. 그리고 `crawling`의 기존 `runChecks()`가 이미
"백엔드에서 원본을 추출하고 그 자리에서 판정까지 끝내는" 정확히 우리가 원하는 패턴으로 짜여 있습니다 —
이번 작업은 이 패턴을 신규 항목들로 넓히고, robots.txt 게이팅을 앞단에 끼워 넣고, 프런트가 버리는 응답을
저장해 목업 대신 실데이터를 흘려보내는 것입니다.

### 왜 스코어링 엔진을 걷어냈는가

* 사용자의 원래 기획은 "체크리스트를 점검해주는" **수동적 진단 도구**였지, "AI 친화도를 하나의 점수로
  평가하는" **능동적 스코어링 제품**이 아니었습니다.
* 수익 모델이 **애드센스**(무료·고트래픽·광고 기반)라서, 점수 합산·가중치·등급 같은 프리미엄 진단
  제품의 문법과 방향이 안 맞습니다.
* 부수 효과: 가장 복잡하고 주관적이었던 부분(가중치 합산 규칙, `topFixes` 생성 로직)이 통째로
  없어지므로 구현 범위가 단순해집니다. 각 체크 항목은 **점수가 아니라 pass/warning/fail/info** 넷
  중 하나로만 판정하면 됩니다.

## 1. 목표

* 기존 Lighthouse 4개 점수(성능/SEO/접근성/모범사례)는 그대로 유지 — 단, 실제로 4개 다 요청하도록
  프런트 버그 수정 필요(0절 참고)
* Lighthouse가 다루지 않는 SEO/AEO 항목(기본 SEO, 구조화 데이터, AI 신호, 색인 제약, 미리보기,
  콘텐츠 품질, 국제화/UX)을 **개별 체크리스트 항목**으로 pass/warning/fail/info 판정해 보여줌 —
  합산 점수 없음, **판정은 전부 백엔드**
* robots.txt가 스캔을 비허용하는 사이트는 **나머지 검사를 아예 실행하지 않고 즉시 차단 안내** —
  비용 절감
* 이미 만들어진 `/scan` 리포트 화면에 **실제 분석 결과를 연결**, 합산 점수 Hero는 "가장 심각한 실패
  항목 N개" 강조 영역으로 교체
* 외부 ML/유료 API 없이, 기존에 이미 쓰고 있는 **Puppeteer + 자체 파싱**만으로 구현 (신규 라이브러리
  추가 없음 — 이미 페이지를 로드해둔 Puppeteer의 `page.evaluate` 안에서 함께 추출)
* Lighthouse 자체 감사(viewport/hreflang/canonical/is-crawlable/robots-txt/image-alt 등)는
  **재사용하지 않고 Puppeteer로 독자 추출** — `crawling`이 Lighthouse 성공 여부와 무관하게 항상
  독립적으로 완결되도록 함(ADR-003의 "4개 API 독립성" 원칙 유지)
* 애드센스 승인/운영을 염두에 둠 — 결과 화면은 로그인 없이 접근 가능해야 하고, 원본 콘텐츠(체크 결과
  설명)가 페이지마다 충분히 있어야 함 (자세한 내용은 8절)

## 2. 사용자 시나리오 (실제 라우팅 기준)

1. 메인 페이지에서 URL 입력 → `crrUrl` 쿠키 저장 후 `/request-scan` 이동
2. `/request-scan` (서버 컴포넌트) — `sitePingApi`로 사이트 생존 확인 → `ProcessScreen` 렌더
3. `ProcessScreen` (클라이언트 컴포넌트) — **[변경 대상]**
   1. **robots.txt를 먼저 단독 호출**하고 `await` (ADR-006)
   2. **비허용이면 즉시 중단** — sitemap/crawling/lighthouse는 호출하지 않고 `BlockedScreen` 렌더
   3. 허용이면 나머지 3개(sitemap/crawling/lighthouse)를 `Promise.allSettled`로 병렬 호출(기존과
      동일), 각 응답을 저장하고 해당 스텝을 실시간 '완료'로 반영
   4. 4개(robots 포함) 응답이 다 모이면 `combineScanResults`로 **취합**(판정 아님 — 이미 각
      엔드포인트가 판정해서 내려줌) 후 스토어에 저장, `/scan`으로 이동
4. `/scan` — **[변경 대상]** 현재는 서버 컴포넌트에서 mock 데이터만 렌더링. 실제 체크리스트 결과를
   받아 기존 카드 구조에 바인딩하고, Hero만 교체.

## 3. 체크리스트 항목 명세 (그룹별)

각 항목에 **어디서 추출·판정할지 / 판정 기준(pass·warning·fail·info)**을 명시했습니다. **추출과
판정 모두 백엔드**이며(4절), 새 파일을 늘리기보다 `scanService.getOnloadHtml`의 `page.evaluate`
추출 로직과 `runChecks`류 판정 로직을 확장하는 쪽을 기본값으로 합니다(같은 페이지를 다시 fetch/파싱
하지 않기 위함).

### 3.0 robots.txt 게이팅 (체크리스트 항목 아님 — 흐름 제어)

`robotsTxt().allow["*"]`가 `false`면(와일드카드 `*` 규칙 기준) 여기서 전체 스캔을 중단합니다. 이건
pass/warning/fail 판정 대상이 아니라 진행 여부를 가르는 게이트라 3.1 이하 표에는 포함하지 않습니다.
자세한 내용은 [ADR-006](../adr/index.html#adr-006). 허용된 경우엔 이 사실 자체를 굳이 배지로 보여줄
필요가 없습니다 — `/scan`에 도달했다는 것 자체가 이미 허용됐다는 뜻이기 때문에, 기존 계획에 있던
"Indexing 카드의 robots.txt 허용 배지"는 뺍니다(3.2 참고).

### 3.1 기본 SEO (신규 그룹 — 기존 `runChecks()` 그대로 재사용)

`scanService.crawling`이 이미 판정까지 끝내서 반환하던 항목들입니다. 새 그룹으로 카드만 신설하면 됨
(백엔드 변경 없음).

| 항목 | 판정 | 출처 |
|---|---|---|
| title 존재/길이 | 정상=pass, 없음=fail, 길이 초과/미달=warning | 이미 있음(`runChecks` `title.missing`/`title.length`) |
| description 존재/길이 | 정상=pass, 없음=warning, 길이 초과/미달=warning | 이미 있음(`desc.missing`/`desc.length`) |
| keywords 태그 사용 | 미사용=pass, 사용=info(비권장이지만 감점 아님) | 이미 있음(`keywords.deprecated`) |
| 이미지 alt 누락 | 0개=pass, 1개 이상=warning | 이미 있음(`img.alt_missing`) |
| 중복 meta 태그(name/property) | 없음=pass, 있음=info | 이미 있음(`meta.duplicate`) |

h1 개수 판정(`h1.none`/`h1.multiple`)은 여기 넣지 않고 3.5 Content Stats의 헤딩 구조 항목에 흡수
합니다(같은 정보를 두 그룹에 중복 표시하지 않기 위함).

### 3.2 색인/크롤링 (Indexing) — 기존 카드 확장

| 항목 | 판정 | 출처 |
|---|---|---|
| sitemap.xml 존재 (직접 HEAD 체크) | 존재=pass, 없음=warning | 이미 있음(`scanService.siteMap`) |
| robots.txt에 sitemap 선언 | 선언됨=pass, 없음=info | 이미 파싱은 됨(`robotsTxt().sitemap`), 그룹 배정만 신규 — `/sitemap.xml` 직접 체크와는 별개 신호로 둘 다 표시 |
| canonical 존재/자기참조 | 정상=pass, 없음/상대경로=warning | 이미 있음(`extract.canonical`, `runChecks`) |
| canonical 다중 태그 | 1개=pass, 2개 이상=fail | 신규 — DOM 추출에 카운트 추가 |
| `<meta name="robots">` noindex | 없음=pass, 있음=fail(치명) | 신규 — DOM 추출에 추가 |

("robots.txt 허용" 항목은 3.0 게이팅으로 이동 — 여기 도달했다는 것 자체가 이미 허용됐다는 뜻이라
중복 배지 제거)

### 3.3 미리보기 (Previews) — 기존 카드 확장 + 실제 카드 미리보기

| 항목 | 판정 | 출처 |
|---|---|---|
| OG 필수 태그 | 충족=pass, 누락=warning | 이미 있음(`og.missing_core`) |
| Twitter Card | 충족=pass, 누락=warning | 이미 있음(`twitter.missing_card`) |
| og:image width/height 메타 | 있음=pass, 없음=warning | 신규 — 실제 이미지 다운로드 없이 메타 태그 존재만 확인(9절 참고, 실측은 v0.2) |
| favicon / touch icon | 있음=pass, 없음=warning | 신규 — `link[rel~="icon"]` DOM 추출 |

체크리스트 배지 외에, **실제 `og:title`/`og:description`/`og:image`와 `twitter:*` 값으로 렌더링한
카드 미리보기**(공유했을 때 실제로 어떻게 보이는지)도 함께 노출합니다 — 와이어프레임에 이미 반영.

### 3.4 AI 신호 (AI Signals / AEO) — 신규 카드 데이터

| 항목 | 판정 | 출처 |
|---|---|---|
| `/.well-known/prompts.txt` 존재 | 존재=pass, 없음=info(감점 아님, 권장) | 신규 `promptsTxt()` — `robotsTxt()`와 동일 패턴, fetch만 |
| `PromptObject` 타입 JSON-LD | 존재=pass, 없음=info | 구조화 데이터 탐지 재사용 |
| FAQ 섹션(`FAQPage` schema 또는 Q&A 패턴) | 존재=pass, 없음=info | DOM 추출에 추가 |
| 구조화 데이터 타입 목록 + JSON-LD 파싱 에러 | 목록 그대로 노출, 파싱 에러 1개 이상=warning | `page.evaluate` 확장: `script[type="application/ld+json"]`의 `@type` 수집 |
| JS 렌더링 의존도 (`html.deltaRatio`) | <15%=pass, 15~40%=warning, 40%+=fail | 이미 계산됨(`crawling`의 `html.deltaRatio`), 그룹 배정만 신규 — JS 미실행 크롤러(AI 봇 다수 포함)가 실제로 보는 콘텐츠량 추정치라 AEO 신호로 여기 배정 |

이 그룹은 "없다고 감점"이 아니라 "있으면 좋은 신호"로 표시(`info`)하는 항목이 많습니다 — 애드센스형
무료 진단 도구에서는 사용자를 겁주기보다 "이런 것도 있다"를 알려주는 쪽이 톤에 맞습니다. (단
`deltaRatio`는 실제 크롤러 접근성 문제라 warning/fail까지 감)

### 3.5 콘텐츠 품질 (Content Stats) — 기존 카드 확장

| 항목 | 판정 | 출처 |
|---|---|---|
| 본문 단어 수 | 600–2,000자=pass, 범위 밖=warning | DOM 추출에 h2/h3 수집과 함께 추가 |
| 헤딩 계층 (h1 1개, h2/h3 존재) | 정상=pass, h1 0개/2개 이상=warning | 이미 있는 h1 외 h2/h3도 수집, 기존 `h1.none`/`h1.multiple` 판정 흡수(3.1 참고) |
| TL;DR/요약 블록 | 존재=pass, 없음=info | `[role="doc-abstract"]` 또는 "TL;DR" 텍스트 매칭 |

### 3.6 국제화/검색 UX — 신규 카드

| 항목 | 판정 | 출처 |
|---|---|---|
| hreflang | 존재=pass, 없음=info | DOM 추출에 추가 |
| `<meta name="viewport">` | 존재=pass, 없음=warning | DOM 추출에 추가 |

### 3.7 Lighthouse — 4개 점수 유지 + 개별 감사(`lhr.audits`) 하단 카드로 재사용 ([ADR-007](../adr/index.html#adr-007))

Performance / SEO / Accessibility / Best Practices 4개 숫자 점수 그대로 유지. 구글 자체 채점
기준이므로 우리 체크리스트의 pass/warning/fail/info 판정 대상에는 포함하지 않습니다.

다만 결과 화면 하단 "Lighthouse 개선 제안" 카드는 개별 감사(`lhr.audits`)를 재사용합니다 — Hero("지금
고쳐야 할 것")가 우리 자체 `checks[]`(pass/warning/fail/info) 기반인 것과 출처가 다름을 명확히
구분합니다. `LighthouseController`가 이미 `lhr` 전체(`audits` 포함)를 그대로 반환하고 있어 **백엔드
변경 없이** 프런트가 `lhr.audits` 중 점수 낮은 opportunity/diagnostic 항목만 추려 렌더링합니다.
(이전 버전은 "개별 감사도 재사용하지 않는다"였으나 [ADR-007](../adr/index.html#adr-007)로 뒤집힘 —
4-API 오케스트레이션 구조 자체(ADR-003)는 안 바뀜, "이미 받은 응답 중 무엇을 화면에 쓰는가"만
넓어진 것.)

## 4. 판정 규칙: 백엔드가 판정, 프런트는 취합만

각 항목은 **가중치 없이** 위 3절 표의 기준대로 `pass` / `warning` / `fail` / `info` 넷 중 하나로만
판정합니다. 합산 점수, 등급, 가중치는 없습니다.

**판정은 전부 백엔드**입니다. 기존 `crawling`의 `runChecks()`가 이미 이 패턴(추출 직후 그 자리에서
판정)으로 짜여 있고, 3절의 신규 항목들도 전부 같은 패턴으로 백엔드에서 판정까지 끝냅니다. 각
엔드포인트(`robotsTxt`/`siteMap`/`crawling`)는 자기 몫의 `checks[]`(`{ id, group, label, status,
detail? }` 형태)를 응답에 포함해 반환합니다.

**프런트는 취합(merge)만** 합니다. 4개 API 응답(robots 게이팅 통과 후 나머지 3개 포함)이 다 모이면,
`combineScanResults` 유틸이:

```
checks: { basicSeo: CheckItem[], indexing: CheckItem[], previews: CheckItem[],
          aiSignals: CheckItem[], content: CheckItem[], i18nUx: CheckItem[] }
summary: { pass: number, warning: number, fail: number, info: number }
topIssues: CheckItem[]  // fail 우선, 모자라면 warning으로 채움 (기본 3개)
```

를 만듭니다. 이건 이미 판정된 값을 그룹별로 합치고, 개수를 세고, `fail`을 우선으로 정렬하는 것뿐이라
"계산"이 아니라 "취합"입니다 — 도메인 임계치 판단(예: "본문 600단어 미만이면 warning")은 전부
백엔드에 있습니다. Hero 영역에는 `summary` 대신 `topIssues`를 그대로 노출합니다("지금 고쳐야 할
것").

> 이 절은 최초 초안에서 "프런트가 판정까지 계산한다"([ADR-003](../adr/index.html#adr-003) 원문의
> "프론트 스코어링" 조항을 체크리스트 모델에 그대로 옮긴 것)로 잘못 갔다가, 대화 중 "판정은 백엔드,
> 프론트는 결과 취합"으로 정정됐습니다 — [ADR-006](../adr/index.html#adr-006) 이전에 발생한 정정이며
> ADR-003 본문에도 이 정정이 직접 반영돼 있습니다(ADR은 append-only가 원칙이지만, 결정 며칠 안에
> 발견된 오독은 예외적으로 직접 수정 — ADR 페이지의 "ADR 작성 규칙" 카드 참고).

## 5. API 설계

### 5.1 기존 엔드포인트 (신규 엔드포인트 없음 — ADR-003)

새 엔드포인트는 만들지 않습니다. 기존 4개를 그대로 유지하고, 각 엔드포인트가 자기 몫의 판정을 포함해
응답을 확장합니다.

| 메서드/경로 | 설명 | 파일 | 변경 |
|---|---|---|---|
| `POST /api/v1/scan/ping` | 사이트 생존 확인 | `scan.router.ts` | 없음 |
| `POST /api/v1/scan/robotsTxt` | robots.txt 파싱/allow 판정 | 〃 | 없음 (게이팅은 프런트 로직, 응답 자체는 변경 없음) |
| `POST /api/v1/scan/siteMap` | sitemap.xml 존재 확인 | 〃 | **소폭 확장** — `checks: [{ id: "sitemapExists", status: "pass"|"warning" }]` 추가 |
| `POST /api/v1/scan/crawling` | 메타/OG/Twitter/h1/이미지 alt + 판정 | 〃 | **대폭 확장** (아래 5.2) |
| `POST /api/v1/lighthouse/run` | Lighthouse 실행 | `lighthouse.router.ts` | 없음 |

### 5.2 `crawling` 응답 확장 — 판정까지 포함

`scanService.getOnloadHtml`의 `page.evaluate` 안에서 3절의 신규 항목들을 함께 추출하고, 기존
`runChecks()`를 확장해 신규 항목까지 판정합니다. 같은 페이지를 두 번 열지 않기 위해 **이미 로드해둔
Puppeteer 페이지에서 한 번에** 뽑습니다. `prompts.txt`만 예외로, DOM이 필요 없는 순수 fetch라
`crawling`이 원본 HTML을 가져올 때 쓰는 것과 같은 방식으로 같은 호출 안에서 병렬 fetch합니다(별도
API로 빼면 5번째 호출이 생겨 `ProcessScreen`의 4단계 구성이 깨짐 — ADR-003이 기각한 대안과 같은
이유).

```json
// POST /api/v1/scan/crawling 응답 (신규 필드만 표기, 기존 title/description/og/twitter 등은 유지)
{
  "...": "기존 필드 그대로",
  "html": { "deltaRatio": 0.12 },
  "checks": {
    "basicSeo": [
      { "id": "title.missing", "status": "pass" },
      { "id": "img.altMissing", "status": "warning", "detail": 2 }
    ],
    "indexing": [
      { "id": "sitemapDeclaredInRobots", "status": "pass" },
      { "id": "canonicalMultiple", "status": "fail" },
      { "id": "noindex", "status": "fail" }
    ],
    "previews": [
      { "id": "ogImageDimensions", "status": "warning" },
      { "id": "favicon", "status": "pass" }
    ],
    "aiSignals": [
      { "id": "promptsTxt", "status": "info", "detail": "없음 — 추가를 권장합니다" },
      { "id": "faqSection", "status": "pass" },
      { "id": "structuredData", "status": "pass", "detail": ["WebPage", "FAQPage"] },
      { "id": "jsRenderDelta", "status": "pass", "detail": 0.12 }
    ],
    "content": [
      { "id": "wordCount", "status": "pass", "detail": 1340 },
      { "id": "headings", "status": "pass", "detail": { "h1": 1, "h2": 6, "h3": 12 } },
      { "id": "tldr", "status": "info" }
    ],
    "i18nUx": [
      { "id": "hreflang", "status": "info" },
      { "id": "viewport", "status": "pass" }
    ]
  }
}
```

원본 신호 추출 로직과 판정 로직 모두 `scanService` 내부에 유지합니다(`runChecks`를 그대로 확장하는
쪽이 새 파일을 만드는 것보다 기존 패턴과 일관적). 프런트가 소비할 `checks` 그룹/필드 이름과 1:1로
맞춰 `dto.ts`에 타입을 정의합니다.

## 6. 프런트 통합 계획 (ADR-003 유지: 4개 API 호출, 판정은 백엔드)

### 6.1 `ProcessScreen.tsx`

* **robots.txt 먼저, 단독 호출** — `await scanRobotsTxtApi(...)`로 결과를 받고, `allow["*"]`가
  `false`면 나머지 3개를 호출하지 않고 `BlockedScreen`을 렌더 (ADR-006)
* 허용이면 기존처럼 `Promise.allSettled([sitemap, crawling, lighthouse])` — 각 API가 끝날 때마다
  응답 본문을 저장하고 해당 스텝 아이콘을 실시간 '완료'로 반영 (더 이상 가짜 progress 아님)
* 4개(robots 포함)가 모두 모이면 `combineScanResults(results)` 프론트 유틸을 호출해 이미 판정된
  `checks`를 그룹별로 합치고 `summary`/`topIssues`를 취합 (계산 아님 — 4절 참고)
* 원본 4개 응답 + 취합 결과를 스토어에 저장(6.3) 후 `/scan`으로 이동 (쿼리 파라미터 없이, 스토어에서
  최신 결과를 읽음)

### 6.2 신규 컴포넌트: `BlockedScreen.tsx`

* `templates/request-scan/ErrorScreen.tsx`와 나란히 배치, 같은 레이아웃 패턴(아이콘 + 헤딩 + 설명 +
  액션 버튼)을 따르되 문구는 "이 사이트는 robots.txt에서 스캔을 차단하고 있어 검사할 수 없습니다" —
  "사이트 접속 실패"(ErrorScreen)와는 원인이 다르므로 컴포넌트 분리 (ADR-006)
* 경고 후 진행 옵션 없음 — 하드 차단, 액션은 "다른 URL 시도"뿐

### 6.3 `app/[lang]/scan/page.tsx`

* **Hero 교체**: 중앙 "AI Preparedness Score" 큰 숫자 카드를 없애고, `topIssues`(fail 상위 N개)를
  강조하는 카드로 교체 — 카피 톤은 "점수가 낮습니다"가 아니라 "지금 고쳐야 할 것"
* 기존 AI Signals / Indexing / Content Stats 카드는 **구조 그대로 유지**, 데이터만 `StatusBadge`의
  `condition`을 pass/fail 불리언 대신 `status` 4값(pass/warning/fail/info)에 맞게 확장 (info는
  기존 success/destructive 2색 배지에 중립색 하나 추가 필요)
* 신규 카드: **기본 SEO**, **국제화/UX**(hreflang, viewport) 카드 추가
* **Previews 카드**: 체크리스트 배지 외에 실제 OG/Twitter 카드 미리보기 렌더링 추가 (3.3 참고)
* **Lighthouse 개선 제안 카드(하단)**: 자체 `checks[]` 재노출이 아니라 `lighthouse run` 응답의
  `lhr.audits`에서 점수 낮은 opportunity/diagnostic 항목을 추려 보여줌([ADR-007](../adr/index.html#adr-007)).
  Hero(자체 판정)와 출처가 다름을 화면에서 구분. 신규 API 필드·백엔드 변경 없음 — `lhr`가 이미
  `audits`를 포함해 응답되고 있음(`LighthouseController`)
* `interface AnalysisResult`를 스토어가 들고 있는 "4개 원본 응답 + `combineScanResults` 결과" 형태로
  교체, `aiPreparednessScore` 필드 제거
* 현재 async 서버 컴포넌트 + 하드코딩 mock 구조를 클라이언트 컴포넌트로 전환하거나, 서버 컴포넌트는
  얇은 쉘만 두고 결과 렌더링은 클라이언트 하위 컴포넌트로 분리
* 결과가 없을 때(직접 `/scan` 진입 등) 안내 화면 또는 `/`로 리다이렉트 처리 추가

### 6.4 스토어 (`stores/scanStore.ts`)

* 현재 `useBearStore`는 zustand 공식 예제 보일러플레이트가 그대로 남은 미사용 죽은 코드 — 도메인에
  맞게 이름부터 고침(예: `useScanStore`)
* `url → { raw: { robots, sitemap, crawling, lighthouse }, combined: CombinedScanResult }` 형태로
  최근 분석 결과 저장
* `combineScanResults` 로직 자체는 이 스토어 파일이 아니라 별도 유틸(예: `src/utils/scanResults.ts`)
  에 두고, 저장 시점에 호출

### 6.5 `src/apis/scan.ts`

* 신규 API 클라이언트 없음 — 기존 4개(`sitePingApi`/`scanRobotsTxtApi`/`scanSiteMapApi`/
  `scanCrawlingApi`/`lsRunApi`) 그대로 사용, 응답 타입만 5절에 맞게 갱신
* **버그 수정**: `lsRunApi`의 `onlyCategories`가 현재 `["seo","performance"]`뿐 —
  `["performance","seo","best-practices","accessibility"]` 4개로 수정 (0절 참고)

### 6.6 다국어 카피

* `dictionaries/{ko,en}.json`의 `scan.aiPreparednessScore` 키는 제거하고, Hero용 문구
  (`scan.topIssues` 등)와 `info` 상태 배지 문구, 기본 SEO/i18n/UX 카드 문구, `BlockedScreen` 문구를
  새로 추가

## 7. 실행 체크리스트

### Day 1 — 백엔드: 게이팅 대상 확인 + `crawling` 확장(추출+판정)

* [ ] `scanService.getOnloadHtml`의 `page.evaluate` 함수에 구조화 데이터/hreflang/viewport/
  favicon/noindex/FAQ 섹션/TL;DR/canonical 다중/h2·h3/og:image 크기메타 추출 추가
* [ ] `scanService.crawling`에서 원본 HTML을 fetch하는 지점에 `/.well-known/prompts.txt` fetch를
  병렬로 추가 (`robotsTxt()`와 같은 존재/바이트 수 판정 로직을 내부 함수로 재사용, 별도 API 라우트는
  만들지 않음 — ADR-003이 5번째 API 호출을 기각한 이유와 동일)
* [ ] `runChecks()`를 확장해 신규 항목까지 판정(pass/warning/fail/info)해서 그룹별 `checks` 객체로
  반환하도록 재구성
* [ ] `scanService.siteMap`에 `checks: [{ id: "sitemapExists", status }]` 추가
* [ ] `dto.ts`에 5.2의 `crawling` 응답 확장 필드(원본 값 + `checks` 그룹) 타입 정의
* [ ] `swagger.ts`의 기존 `/api/v1/scan/crawling`/`siteMap` 응답 스키마에 신규 필드 반영

### Day 2 — 프런트: robots.txt 게이팅 + 취합 유틸 + 스토어

* [ ] `ProcessScreen.tsx`에 robots.txt 선검사 로직 추가 — `await` 후 `allow["*"] === false`면
  `BlockedScreen` 렌더, 나머지 3개 호출 안 함
* [ ] `templates/request-scan/BlockedScreen.tsx` 신규 (6.2)
* [ ] `src/utils/scanResults.ts`(프론트) 신규 — `combineScanResults`: 4개 API 응답에서 이미 판정된
  `checks`를 그룹별로 merge, `summary`/`topIssues` 취합 (판정 로직 없음, 순수 함수)
* [ ] `stores/scanStore.ts`의 `useBearStore`를 도메인에 맞게 재구현(`useScanStore`), 원본 4개 응답 +
  `combineScanResults` 결과 저장
* [ ] `apis/scan.ts`의 `lsRunApi` `onlyCategories`를 4개로 수정, `scanCrawlingApi`/`scanSiteMapApi`
  응답 타입을 5절 확장 스키마로 갱신

### Day 3 — 프런트 연결 + 검증

* [ ] `ProcessScreen.tsx`: 나머지 3개 호출부는 기존처럼 완료 시점마다 응답 저장 + 스텝 아이콘 실시간
  반영, 4개 완료 후 `combineScanResults` 호출 → 스토어 저장 → `/scan` 이동
* [ ] `app/[lang]/scan/page.tsx`: mock 제거, Hero 교체, 기본 SEO/i18n·UX 카드 신설, Previews 카드에
  OG/Twitter 미리보기 렌더링 추가, `info` 상태 배지 스타일 추가, 카드별 데이터 바인딩
* [ ] `dictionaries/{ko,en}.json` 카피 정리 (`BlockedScreen` 문구 포함)
* [ ] 테스트 URL 세트로 수동 검증 (FAQ 있는 페이지 / 뉴스 기사 / noindex 페이지 / SPA / robots.txt
  전체 차단 사이트)
* [ ] `pnpm -r typecheck && pnpm -r lint && pnpm -r build`로 최종 확인

## 8. 애드센스 운영 고려사항

* 결과 페이지(`/scan`)는 로그인/페이월 없이 공개 접근 가능해야 함 (현재도 그렇지만, 이후 인증 기능이
  생기더라도 이 페이지만은 예외로 유지)
* 각 체크 항목에는 `detail` 텍스트를 충분히 채워 페이지당 원본 콘텐츠 양을 확보 (애드센스는 얇은/자동
  생성 콘텐츠 페이지에 불리)
* 향후 광고 슬롯을 넣을 자리를 카드 사이에 미리 고려 — 이번 스코프의 구현 대상은 아니지만 레이아웃
  설계 시 염두

## 9. 이번 스코프에서 의도적으로 뺀 것 (v0.2 후보)

* og:image 실제 픽셀 크기 측정(이미지 다운로드/디코딩) — 지금은 메타 태그 존재 여부만 확인
* sitemap.xml 내 URL 개수 카운트(GET + XML 파싱) — 지금은 존재 여부만
* robots.txt 게이팅에서 와일드카드(`*`) 외 특정 봇 이름별 규칙 반영 — 이번엔 `*` 규칙만 기준
* 애드센스 실제 슬롯 삽입, 광고 정책 준수 세부 작업

## 10. 다음 단계 (이 PRD 범위 밖)

체크리스트 도구가 완성된 뒤, **FAQ 스키마 생성 도구**를 이어서 만들 계획입니다 — 이번 체크리스트가
"이 사이트엔 FAQ/PromptObject 신호가 없다"고 진단해주면, 후속 도구는 실제 페이지
콘텐츠를 기반으로 `FAQPage` JSON-LD(`@type: "FAQPage"`, `mainEntity: [{ "@type": "Question",
"name": ..., "acceptedAnswer": { "@type": "Answer", "text": ... } }]`)를 생성해 처방까지 이어주는
도구입니다. 이번 문서에서는 다루지 않지만, 3.4절의 체크 항목(구조화 데이터 타입, FAQ 섹션 감지
로직)이 그대로 입력 데이터로 재사용될 가능성이 높으므로 해당 부분 구현 시 재사용을 염두에 둡니다.

## 11. 참고: 이번 계획과 무관하게 별도로 논의된 사항

같은 세션에서 "TubeBuddy를 레퍼런스로 한 YouTube SEO SaaS 피벗" 기획이 제안되었으나 사용자 요청으로
중단되었습니다. 본 문서는 YouTube 피벗과 무관하게, **현재 meta-scan의 웹사이트 SEO/AEO 체크리스트
방향을 그대로 이어가는** 계획입니다.
