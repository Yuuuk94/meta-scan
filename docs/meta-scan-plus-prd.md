# PRD — Meta-Scan "Plus" (Lighthouse+ / AI Preparedness)

> 이 문서는 최초 기획안("3-Day Plus" PRD)을 **현재 저장소에 실제로 구현된 코드** 기준으로 다시 정리한
> 최종 기획안입니다. 원본 아이디어/스코어링 규칙은 유지하되, "이미 있는 것 / 새로 만들 것 /
> 어느 파일을 고쳐야 하는지"를 명확히 했습니다.

## 0. 요약: 지금 뭐가 있고 뭐가 없나

| 영역 | 상태 | 비고 |
|---|---|---|
| 크롤링 인프라 (Puppeteer 페이지 로드 + DOM 추출) | ✅ 구현됨 | `scanService.getOnloadHtml` |
| 기본 메타 추출 (title/description/keywords/canonical/h1/og/twitter/img alt) | ✅ 구현됨 | `scanService.crawling` → `runChecks` |
| robots.txt 파싱 + allow 판정 | ✅ 구현됨 | `scanService.robotsTxt` (자체 파서) |
| sitemap.xml 존재 확인(HEAD) | ✅ 구현됨 (URL 개수 카운트는 미구현) | `scanService.siteMap` |
| Lighthouse 점수 (performance/seo/best-practices/accessibility) | ✅ 구현됨 | `LighthouseService` + `chrome-launcher` |
| **AI 친화도(AEO) 점수·구조화 데이터·prompts.txt·hreflang/viewport 등** | ❌ 미구현 | 백엔드에 관련 코드 없음 |
| **스코어링 엔진(0–100 가중합산)** | ❌ 미구현 | 어디에도 점수 계산 로직 없음 |
| 결과 통합 API (`/api/analyze` 성격) | ❌ 미구현 | 프런트가 4개 API를 개별 호출만 함 |
| 결과 리포트 UI (배지/탭/카드) | ✅ **UI는 이미 100% 완성**, ❌ **데이터는 전부 `Math.random()` 목업** | `app/[lang]/scan/page.tsx` |
| 다국어 카피(한/영) | ✅ 이미 전부 존재 | `dictionaries/{ko,en}.json`의 `scan.*` 키 |
| 분석 진행 화면 | ✅ UI 구현됨, ⚠️ **API 응답을 버림** | `ProcessScreen.tsx` |

**가장 중요한 발견**: `/scan` 결과 페이지는 이 기획서가 요구하는 화면(AI Preparedness 배지, AI Signals
카드, Indexing 카드, Content Stats 카드, Raw JSON 탭)을 **이미 그대로 구현해뒀고 다국어 카피도 이미
있습니다.** 그런데 실데이터를 넣는 배관이 하나도 없습니다 — `ProcessScreen`은 4개 API(robots/sitemap/
crawling/lighthouse)를 병렬 호출하지만 응답을 성공 여부(`status === "ok"`)만 보고 버리고,
`/scan` 페이지는 서버 컴포넌트에서 매번 `Math.random()`으로 데이터를 만들어 보여줍니다.

즉 이번 작업의 본질은 **"새 UI를 만드는 일"이 아니라 "이미 그려둔 UI에 진짜 파이프를 연결하는 일"**이고,
그 사이에 **AI 친화도 신호를 실제로 계산하는 백엔드 로직**을 새로 채워 넣는 일입니다.

---

## 1. 목표

* 기존 Lighthouse 결과 + **AI 친화도(AEO 준비도) 0–100** 점수 제공
* **구조화 데이터·프롬프트 신호·인용 친화성** 등 Lighthouse가 다루지 않는 영역을 룰 기반으로 보강
* 이미 만들어진 `/scan` 리포트 화면에 **실제 분석 결과를 연결**
* 외부 ML/유료 API 없이, 기존에 이미 쓰고 있는 **Puppeteer + 자체 파싱**만으로 구현 (신규 라이브러리
  추가 없음 — `cheerio`/`linkedom` 등은 도입하지 않고, 이미 페이지를 로드해둔 Puppeteer의
  `page.evaluate` 안에서 함께 추출한다)

## 2. 사용자 시나리오 (실제 라우팅 기준)

1. 메인 페이지에서 URL 입력 → `crrUrl` 쿠키 저장 후 `/request-scan` 이동
2. `/request-scan` (서버 컴포넌트) — `sitePingApi`로 사이트 생존 확인 → `ProcessScreen` 렌더
3. `ProcessScreen` (클라이언트 컴포넌트) — **[변경 대상]** 현재는 robots/sitemap/crawling/lighthouse
   4개를 병렬 호출 후 결과를 버리고 `/scan`으로 이동함. 이를 **단일 분석 결과를 확보하고 저장한 뒷 이동**으로
   바꿔야 함.
4. `/scan` — **[변경 대상]** 현재는 서버 컴포넌트에서 mock 데이터만 렌더링. 실제 분석 결과를 받아 기존
   UI 그대로에 바인딩해야 함.

## 3. 신규 기능 명세 (Lighthouse 대비 "플러스")

각 항목에 **어디서 계산할지**를 명시했습니다. 새 파일을 늘리기보다, 이미 페이지를 한 번 로드해두는
`scanService.getOnloadHtml`의 `page.evaluate` 추출 로직을 확장하는 쪽을 기본값으로 합니다
(같은 페이지를 다시 fetch/파싱하지 않기 위함).

* **구조화 데이터 탐지** — `page.evaluate` 확장: `script[type="application/ld+json"]`의 `@type`
  수집(WebPage/Article/FAQPage/LocalBusiness/BreadcrumbList), `JSON.parse` 실패 카운트
* **AI 신호 감지(AEO)**
  * `/.well-known/prompts.txt` 존재/바이트 수 — `robotsTxt`/`siteMap`과 동일한 패턴으로 신규
    `promptsTxt()` 메서드 추가 (fetch만, Puppeteer 불필요)
  * `PromptObject` 타입의 JSON-LD 존재 — 구조화 데이터 탐지 로직 재사용
  * FAQ 섹션(`FAQPage` schema 또는 `<details>`/Q&A 패턴) — DOM 추출에 추가
* **인용 친화성(GEO 프록시)** — DOM 추출에 추가: 본문 단어 수, 헤딩 개수(h1/h2/h3),
  TL;DR/요약 블록 후보(`[role="doc-abstract"]`, "TL;DR" 텍스트 매칭)
* **크롤링/색인 제약**
  * `robots.txt` allow 판정 — **이미 있음** (`scanService.robotsTxt`) 그대로 재사용
  * `<meta name="robots">` noindex/nofollow — DOM 추출에 추가
  * canonical 유무/자기참조 — **이미 있음**(`extract.canonical`, `runChecks`의
    `canonical.missing`/`canonical.relative`)에 "다중 canonical 태그" 벌점만 추가
* **미디어/미리보기 신호**
  * OG/Twitter 누락 — **이미 있음** (`og.missing_core`, `twitter.missing_card`)
  * og:image 해상도 — ⚠️ **스코프 조정**: 실제 이미지 바이트를 받아 픽셀 크기를 재는 대신,
    `og:image:width`/`og:image:height` 메타 태그 존재 여부로 대체 (3일 내 범위, 이미지 다운로드
    지연·실패 리스크 회피). 실측 다운로드는 v0.2로 이연.
  * Favicon / Touch icon — DOM 추출에 추가 (`link[rel~="icon"]`)
* **국제화/검색 UX** — `hreflang`, `<meta viewport>` — DOM 추출에 추가
* **Sitemap 연결** — `siteMap()`이 현재 존재만 확인(HEAD). ⚠️ **스코프 조정**: URL 개수 카운트는
  sitemap 본문을 GET해서 파싱해야 하므로 3일 범위에서는 "존재 여부"만 점수에 반영하고, URL 카운트는
  v0.2로 이연.

> 모든 항목은 가중치 합산으로 **AI 친화도 점수(Preparedness Index)** 산출 (아래 스코어링 규칙 참조)

## 4. 스코어링 규칙

* 구조화 데이터(최대 35점)
  * WebPage/Article/FAQPage/LocalBusiness(각 6점, 최대 24)
  * JSON-LD 파싱 성공 6, FAQPage 포함 +5
* AI 신호(최대 25점)
  * prompts.txt 10(존재) + 3(100–5,000자 범위)
  * PromptObject 8 / FAQ 섹션 감지 +4
* 인용 친화성(최대 20점)
  * 본문 600–2,000단어 +8, 문장 중위 길이 8–24 +4, 헤딩 계층 적정 +4, TL;DR/요약 감지 +4
* 색인/미리보기/기타(최대 20점)
  * robots 허용 +5, canonical 적정 +5, og/twitter 충돌 無 +5, hreflang/viewport +5

벌점:

* noindex −10, canonical 다중/순환 −8, `og:image:width/height` 미기재 또는 600px 미만 −4,
  JSON-LD 파싱 에러 −6

## 5. API 설계

### 5.1 기존 엔드포인트 (변경 없음, 그대로 재사용)

| 메서드/경로 | 설명 | 파일 |
|---|---|---|
| `POST /api/v1/scan/ping` | 사이트 생존 확인 | `scan.router.ts` |
| `POST /api/v1/scan/robotsTxt` | robots.txt 파싱/allow 판정 | 〃 |
| `POST /api/v1/scan/siteMap` | sitemap.xml 존재 확인 | 〃 |
| `POST /api/v1/scan/crawling` | 메타/OG/Twitter/h1/이미지 alt + `checks[]` | 〃 |
| `POST /api/v1/lighthouse/run` | Lighthouse 실행 | `lighthouse.router.ts` |

### 5.2 신규 엔드포인트: `POST /api/v1/scan/analyze`

원본 기획의 `/api/analyze`에 대응. 프런트가 4개 API를 각각 부르고 결과를 버리는 대신, **서버가 한 번에
robots/sitemap/crawling(+AI 신호 확장)/lighthouse를 병렬 실행하고 점수까지 합산해서 하나의 JSON으로
반환**한다. `ProcessScreen`은 이 엔드포인트 하나만 호출하면 됨.

```json
// POST /api/v1/scan/analyze  { "url": "https://example.com" }
{
  "status": "ok",
  "finalUrl": "https://example.com/",
  "lighthouse": { "performance": 88, "accessibility": 92, "bestPractices": 93, "seo": 90 },
  "aiPreparedness": 72,
  "sections": {
    "structuredData": { "types": ["WebPage", "FAQPage"], "parseErrors": 0 },
    "aiSignals": {
      "promptsTxt": { "exists": true, "bytes": 1432 },
      "promptObject": true,
      "faqSection": true
    },
    "indexing": {
      "robotsAllowed": true,
      "noindex": false,
      "canonical": { "href": "https://example.com/", "ok": true }
    },
    "previews": {
      "og": { "ok": true, "image": { "url": "...", "hasDimensions": true } },
      "twitter": { "ok": true },
      "favicon": true
    },
    "i18nUx": { "hreflang": ["en", "ko"], "viewport": true },
    "content": { "wordCount": 1340, "headings": { "h1": 1, "h2": 6, "h3": 12 }, "hasTldr": false },
    "sitemap": { "exists": true }
  },
  "topFixes": [
    "FAQPage 스키마에 acceptedAnswer 추가",
    "og:image에 width/height 메타 태그 추가",
    "prompts.txt에 대표 Q/A 3개 이상 추가"
  ]
}
```

구현은 새 컨트롤러/서비스를 만들지 않고, **기존 `ScanController`/`ScanService`에 `analyze` 액션을
추가**하는 쪽을 권장 (기존 `BaseController.handle`, `ApiError`, `validate(UrlBodySchema, …)` 패턴
그대로 재사용). Lighthouse 호출만 다른 모듈(`LighthouseService`) 의존성이 필요하므로, `scan.router.ts`
에서 두 서비스를 함께 주입해 구성한다.

## 6. 프런트 통합 계획 (핵심 변경 지점)

### 6.1 `ProcessScreen.tsx`

* `Promise.allSettled([robots, sitemap, crawling, lighthouse])` 호출부를
  `scanAnalyzeApi({ url })` 단일 호출로 교체
* 응답을 **버리지 말고** 저장:
  * `useBearStore`(zustand, `localStorage` persist)에 `reqScanUrls`뿐 아니라 최근 분석 결과
    (`url → AnalysisResult`)를 함께 저장하도록 스토어 확장
  * 저장 후 `/scan`으로 이동 (쿼리 파라미터 없이, 스토어에서 최신 결과를 읽음 — 기존 `crrUrl` 쿠키
    패턴과 일관되게 유지)
* 5단계 스텝 아이콘(`ping/ai/meta/analysis/gen`)은 UI만 유지하고, 실제로는 단일 API 호출의 진행률을
  임의 애니메이션으로 보여주는 현재 방식 그대로 둬도 무방 (백엔드가 스트리밍을 제공하지 않는 한)

### 6.2 `app/[lang]/scan/page.tsx`

* 현재 async **서버 컴포넌트 + 하드코딩 mock** 구조를 클라이언트 컴포넌트로 전환하거나, 서버 컴포넌트는
  얇은 쉘만 두고 결과 렌더링은 클라이언트 하위 컴포넌트로 분리
* `useBearStore`에서 최근 분석 결과를 읽어 기존 `result` 객체 자리에 바인딩 — **JSX/카드/배지/탭 구조는
  변경 불필요**, `interface AnalysisResult`를 5.2의 실제 응답 스키마에 맞게 갱신만 하면 됨
* 결과가 없을 때(직접 `/scan` 진입 등) 안내 화면 또는 `/`로 리다이렉트 처리 추가

### 6.3 `src/apis/scan.ts`

* `scanAnalyzeApi` 추가 (기존 `lsRunApi`/`scanCrawlingApi`와 동일한 axios 패턴)
* 기존 4개 API 클라이언트는 유지하되 `ProcessScreen`에서의 사용은 제거 (다른 화면에서 개별 재사용 가능성
  있으므로 삭제하지 않음)

## 7. 3일 실행 체크리스트

### Day 1 — 백엔드: AI 신호 추출 + robots.txt 스타일 prompts.txt 체크

* [ ] `scanService.getOnloadHtml`의 `page.evaluate` 함수(`fs`)에 구조화 데이터/hreflang/viewport/
  favicon/noindex/FAQ 섹션/TL;DR 추출 추가
* [ ] `scanService`에 `promptsTxt()` 메서드 추가 (`robotsTxt()`와 동일 패턴: fetch → 존재/바이트 수)
* [ ] 단어 수/헤딩 개수는 이미 있는 `extracted.h1` 외 h2/h3도 함께 수집하도록 DOM 추출 확장
* [ ] `dto.ts`에 `AnalyzeResult` 관련 타입 정의 (zod 스키마는 요청 바디만 있으면 되므로 응답 타입은
  일반 TS 인터페이스로 충분)

### Day 2 — 스코어링 + `/analyze` 엔드포인트

* [ ] `src/modules/scan/score.ts` 신규 — 4절 규칙대로 가중합산 + `topFixes` 생성
* [ ] `ScanController`/`ScanService`에 `analyze` 추가, `scan.router.ts`에 `POST /analyze` 라우트 등록,
  `LighthouseService` 의존성 주입
* [ ] `swagger.ts`에 `/api/v1/scan/analyze` 경로 추가 (기존 항목과 동일한 형식으로 수기 작성)
* [ ] 캐시(선택): 동일 URL 1시간 내 재요청 시 메모리 캐시 재사용 (도메인 단위 아님, URL 단위로 충분)

### Day 3 — 프런트 연결 + 검증

* [ ] `apis/scan.ts`에 `scanAnalyzeApi` 추가
* [ ] `stores/scanStore.ts`에 분석 결과 저장 기능 추가
* [ ] `ProcessScreen.tsx`를 신규 API 단일 호출로 교체
* [ ] `app/[lang]/scan/page.tsx`의 mock 데이터 제거, 스토어 값 바인딩, `AnalysisResult` 타입을
  5.2 응답 스키마에 맞게 갱신
* [ ] 테스트 URL 세트로 수동 검증 (FAQ 있는 페이지 / 뉴스 기사 / noindex 페이지 / SPA)
* [ ] `pnpm -r typecheck && pnpm -r lint && pnpm -r build`로 최종 확인

## 8. QA 시나리오 (필수 통과)

* noindex 페이지 → 점수 벌점 반영, 경고 표시
* FAQPage 스키마 추가 시 점수 상승 체감
* prompts.txt 유무에 따른 점수 차등
* canonical 다중 태그 시 벌점 노출
* og:image에 width/height 메타 없을 시 경고 노출
* `/scan`에 분석 결과 없이 직접 진입 시 정상적으로 안내/리다이렉트

## 9. 이번 스코프에서 의도적으로 뺀 것 (v0.2 후보)

* og:image 실제 픽셀 크기 측정(이미지 다운로드/디코딩)
* sitemap.xml 내 URL 개수 카운트(GET + XML 파싱)
* 결과 캐시의 영속화(현재는 무상태 API이므로 재시작 시 캐시 소실 — 문제 없다고 판단, DB 도입 시점에 재검토)
* PDF 리포트, 경쟁 URL 비교(최대 3개) — 원본 기획의 롤아웃 계획대로 다음 버전에서 진행

## 10. 참고: 이번 계획과 무관하게 별도로 논의된 사항

같은 세션에서 "TubeBuddy를 레퍼런스로 한 YouTube SEO SaaS 피벗" 기획이 제안되었으나 사용자 요청으로
중단되었습니다. 본 문서는 YouTube 피벗과 무관하게, **현재 meta-scan의 웹사이트 SEO/AEO 스캐너 방향을
그대로 이어가는** "Lighthouse+" 확장 계획입니다.
