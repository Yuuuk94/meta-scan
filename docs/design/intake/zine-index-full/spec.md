# Design Intake Spec — meta-scan Wireframes (Zine Index, final)

- **소스**: `https://claude.ai/code/artifact/43c00b5f-73e5-4720-b77f-265dffe7e71c` (아티팩트 제목: "meta-scan Wireframes")
- **추출 방식**: `WebFetch`가 저장한 원본 HTML(`.../tool-results/artifact-43c00b5f-*.html`)에서 `<script id="appifact-doc">` JSON을 파싱해 34개 `.dc.html` 아트보드 + `canvas.json`을 복원.
- **슬러그**: `zine-index-full`
- **레퍼런스 스크린샷**: `docs/design/intake/zine-index-full/reference/*.png` (Puppeteer로 각 `.dc.html`을 headless 렌더 후 `fullPage` 스크린샷, 18장 — 데스크톱 9 + 모바일 9)

---

## 0. 파일 패밀리 선택 (어떤 걸 쓰고 어떤 걸 버렸는지)

`canvas.json`의 `pages` 배열이 3단계 작업 이력을 명시적으로 구분하고 있어 모호함 없이 판단 가능했다:

| 페이지 | 파일들 | 판정 |
|---|---|---|
| `wireframes`(기본, `page` 필드 없음) | `Main.dc.html`, `RequestScanProcess.dc.html`, `RequestScanError.dc.html`, `RequestScanBlocked.dc.html`, `Scan.dc.html`, `Privacy.dc.html`, `Terms.dc.html`, `NotFound.dc.html`, `ErrorBoundary.dc.html` | **폐기** — 회색조 로우파이 와이어프레임. 구조 참고용으로만 훑어봄(아래 1장 참고, 여기 안에 구현 지시 문구가 섞여 있었음) |
| `explore` | `DirectionsIntro.dc.html`, `ConceptLabReport.dc.html`, `ConceptNeonScanner.dc.html`, `ConceptZineIndex.dc.html`, `ConceptZineIndexBlue/Yellow/Pink.dc.html` | **폐기** — 3가지 톤 탐색(①인쇄 랩 리포트 ②다크 네온 스캐너 ③진 인덱스) + 진 인덱스의 포인트컬러 4색 실험. `canvas.json`의 `color-note` 주석("3번 진 인덱스 — 포인트 컬러 3안 ... → 오렌지로 확정")이 명시적으로 오렌지 확정을 기록. `docs/design/design-system.md`(ADR-008)도 오렌지 단일 액센트를 못박고 있어 결정과 일치 |
| `final` | `MainZine`, `RequestScanProcessZine`, `RequestScanErrorZine`, `RequestScanBlockedZine`, `ScanZine`, `PrivacyZine`, `TermsZine`, `NotFoundZine`, `ErrorBoundaryZine` (데스크톱 9) + 각각의 `*Mobile.dc.html` (모바일 9) | **채택** — `canvas.json`의 `final-note` 주석이 "최종 디자인 — 진 인덱스 + 오렌지(ADR-008, docs/design/design-system.md)"라고 명시. 토큰·타이포·컴포넌트 스타일링이 `docs/design/design-system.md`와 실측 일치(4장 참고) |

총 **18개 아트보드**(데스크톱 9 + 모바일 9)를 스펙에 포함.

---

## 1. 구현/프레임워크 지시 문구 — 발견 위치와 제외 처리

지시대로 아래 문구들은 **스펙에서 전부 제외**했다. 전부 **폐기한 `wireframes` 패밀리에만** 있었고(채택한 `final`/`ScanZine` 등에는 없음), 회색조 톤에서 각 섹션이 실제 코드베이스의 어느 컴포넌트/라우트에 대응하는지 적어둔 "각주" 성격의 라벨(`.wf-label` 클래스, 옅은 회색 캡션)이었다:

| 파일 | 위치 | 원문 |
|---|---|---|
| `Main.dc.html` | 40행 | `HERO SECTION — HeroSection.tsx` |
| `Main.dc.html` | 56행 | `PROCESS SECTION — ProcessSection.tsx` |
| `Main.dc.html` | 87행 | `FAQ SECTION — FAQSection.tsx` |
| `RequestScanProcess.dc.html` | 36행 | `PROCESS SCREEN — templates/request-scan/ProcessScreen.tsx` |
| `RequestScanError.dc.html` | 34행 | `ERROR SCREEN — templates/request-scan/ErrorScreen.tsx` |
| `RequestScanBlocked.dc.html` | 33행 | `차단 화면 — templates/request-scan/BlockedScreen.tsx (신규, ADR-006)` |
| `Scan.dc.html` | 34행 | `/scan — app/[lang]/scan/page.tsx (재설계 대상, PRD 3–6절 기준)` |
| `Privacy.dc.html` | 33행 | `/privacy — app/[lang]/privacy/page.tsx (긴 텍스트형 약관 페이지)` |
| `Terms.dc.html` | 33행 | `/terms — app/[lang]/terms/page.tsx (긴 텍스트형 약관 페이지)` |
| `NotFound.dc.html` | 18행 | `404 — app/[lang]/not-found.tsx (헤더/푸터 없음, 독립 화면)` |
| `ErrorBoundary.dc.html` | 20행 | `에러 바운더리 — app/[lang]/error.tsx (헤더/푸터 없음, 독립 화면)` |

이 라벨들은 파일 경로(`HeroSection.tsx`, `templates/request-scan/BlockedScreen.tsx` 등)와 구현 관련 메모(ADR 번호, PRD 절 번호)를 직접 지시하고 있어 "디자인이 아닌 내용"에 해당한다. 채택한 `final` 패밀리(`MainZine.dc.html` 등)에는 이 클래스/문구가 전혀 없음을 `grep`으로 확인했다 — 즉 실제로 채택한 스펙 내용에는 섞여 들어가지 않았지만, 요청대로 발견 사실을 보고한다.

(참고로 `canvas.json`의 `annotations` 배열에도 비슷한 성격의 캔버스 메모— 예: `"메인 유저 플로우: 메인 → /request-scan → /scan\n체크리스트 PRD(docs/prd/meta-scan-plus-prd.md) 기준 재설계 대상은..."` — 가 있지만, 이건 아트보드 본문이 아니라 캔버스 도구의 별도 주석 레이어라 애초에 화면 카피로 오인될 여지가 없어 별도 처리 없이 무시했다.)

---

## 2. 카피 말투 전환 — 방법

- 대상: 문장 종결형이 해요체(`-요`, `-세요`, `-가요`, `-나요`) 또는 합쇼체 존댓말(`-습니다`, `-ㅂ니다`, `-해주세요`)인 모든 UI 카피.
- 규칙: 평서형은 `-다`로, 청유/명령 뉘앙스가 강한 문장은 `-다`(평서 전환) 또는 `-라`(명령형) 중 더 자연스러운 쪽으로 — 예시가 갈리는 경우 두 옵션을 함께 적어 사용자가 고르게 했다.
- 라벨성 텍스트(버튼 라벨 단어, 섹션 제목 명사구, 배지 텍스트, 타임스탬프, 데이터 값)는애초에 종결어미가 없어 전환 대상이 아님 — 아래 표에서 "전환 없음"으로 표시.
- 주어 존대 선어말어미(`-시-`, 예: "요청하신")는 이번 규칙(문장 종결 톤)의 범위 밖이라 손대지 않았다 — 필요하면 별도로 검토 요청.

전체 원문→전환 카피는 아래 3장 아트보드별 섹션에 나란히 표기했다.

---

## 3. 아트보드별 스펙

### 3.1 Main / MainZine → `app/[lang]/page.tsx` (+ `templates/main/HeroSection.tsx`, `ProcessSection.tsx`, `FAQSection.tsx`)

레퍼런스: `reference/Main.png`(데스크톱), `reference/Main-Mobile.png`(모바일)

**레이아웃(위→아래)**
1. 헤더 — `META—SCAN` 워드마크(좌) + `문서` 텍스트 링크·원형 아바타 placeholder(우), 하단 4px 검정 룰
2. Hero — 눈썹 라벨 + 헤드라인(오렌지 하이라이트 블록 포함) + 서브카피 + URL 입력 필드 + CTA 버튼. 우상단에 반투명 도트 패턴 장식(`radial-gradient` 텍스처, 4장 참고)
3. "어떻게 동작하나요" 섹션 — 4열 균등 그리드, 셀 사이 1px 검정 룰(갭 아님), 각 셀 `01~04` 오렌지 넘버 + 소제목 + 설명. 배경 `#FFF9F0`, 상하 4px 룰로 섹션 구획
4. FAQ 섹션 — 아코디언 6문항, 첫 번째와 세 번째 항목만 펼쳐진 상태로 목업(배경 `#FFF9F0`, `−` 표시), 나머지는 접힌 `+` 상태
5. 푸터 — `© meta-scan` + `개인정보처리방침`/`이용약관` 링크, 상단 1.5px 헤어라인

**카피(원문 → 전환)**

| 위치 | 원문 | 전환 |
|---|---|---|
| 눈썹 라벨 | `무료 · 가입 불필요 · SEO/AEO/GEO 체크리스트` | 전환 없음(라벨) |
| 헤드라인 | `URL 하나로 SEO/AEO/GEO 체크리스트를 확인하세요` | `URL 하나로 SEO/AEO/GEO 체크리스트를 확인한다` |
| 서브카피 | `Lighthouse가 다루지 않는 구조화 데이터·AI 신호까지, 항목별로 pass/warning/fail/info로 점검합니다.` | `Lighthouse가 다루지 않는 구조화 데이터·AI 신호까지, 항목별로 pass/warning/fail/info로 점검한다.` |
| URL 입력 placeholder | `https://example.com` | 전환 없음 |
| CTA 버튼 | `스캔 시작 →` | 전환 없음(라벨) |
| 섹션 제목 | `어떻게 동작하나요` | `어떻게 동작하는가` |
| 스텝 01 제목/설명 | `URL 입력` / `분석할 페이지 주소를 붙여넣습니다` | `URL 입력`(전환 없음) / `분석할 페이지 주소를 붙여넣는다` |
| 스텝 02 제목/설명 | `크롤링` / `robots.txt 확인 후 페이지를 실제로 로드합니다` | `크롤링` / `robots.txt 확인 후 페이지를 실제로 로드한다` |
| 스텝 03 제목/설명 | `항목별 판정` / `pass/warning/fail/info 네 가지로 판정합니다` | `항목별 판정` / `pass/warning/fail/info 네 가지로 판정한다` |
| 스텝 04 제목/설명 | `체크리스트 확인` / `그룹별 카드로 결과를 확인합니다` | `체크리스트 확인` / `그룹별 카드로 결과를 확인한다` |
| FAQ 섹션 제목 | `자주 묻는 질문` | 전환 없음(명사구) |
| FAQ Q1 | `SEO·AEO·GEO가 뭔가요?` | `SEO·AEO·GEO란 무엇인가` |
| FAQ A1 | `SEO(검색엔진 최적화)는 구글 같은 전통 검색엔진에서 발견되기 위한 기본기, AEO(답변엔진 최적화)는 ChatGPT·Perplexity 같은 AI 답변엔진이 이 페이지를 답변에 인용하기 좋은 형태인지, GEO(생성엔진 최적화)는 생성형 AI가 콘텐츠를 정확히 이해·인용할 수 있는지를 다룹니다. meta-scan은 이 세 가지를 각각 다른 체크리스트 그룹으로 나눠 한 번에 점검합니다.` | `...를 다룬다. meta-scan은 이 세 가지를 각각 다른 체크리스트 그룹으로 나눠 한 번에 점검한다.`(나머지 동일) |
| FAQ Q2(접힘, 답변 없음) | `정말 무료인가요?` | `정말 무료인가` |
| FAQ Q3 | `무엇을 확인해야 하나요?` | `무엇을 확인해야 하는가` |
| FAQ A3 | `SEO — 기본 SEO(title·description·이미지 alt), 색인(sitemap·canonical·noindex), 미리보기(OG·Twitter 카드)를 점검합니다.` / `AEO·GEO — AI Signals 카드에서 구조화 데이터, prompts.txt, FAQ 섹션, JS 렌더링 의존도를 점검합니다.` / `이 밖에 콘텐츠 품질(본문 분량·헤딩 구조)과 국제화·UX(hreflang·viewport)까지 총 6개 그룹, 항목마다 pass/warning/fail/info 네 가지로 판정합니다.` | `...점검한다.` / `...점검한다.` / `...판정한다.`(각 문장 끝만 전환, 나머지 동일) |
| FAQ Q4(접힘) | `AEO·GEO를 위해 어떤 문서가 필요한가요?` | `AEO·GEO를 위해 어떤 문서가 필요한가` |
| FAQ Q5(접힘) | `얼마나 걸리나요?` | `얼마나 걸리는가` |
| FAQ Q6(접힘) | `결과가 저장되나요?` | `결과가 저장되는가` |
| 푸터 | `© meta-scan` / `개인정보처리방침` / `이용약관` | 전환 없음 |

**모바일 차이(`MainMobile.dc.html`)**: 구조 동일, 카피는 축약된 버전 사용 — 서브카피가 `구조화 데이터·AI 신호까지 pass/warning/fail/info로 점검합니다.` (짧은 버전, 동일하게 `점검한다`로 전환), 스텝 설명도 `주소를 붙여넣습니다`/`robots.txt 확인 후 로드`/`pass/warning/fail/info`/`그룹별 카드로 확인` 식으로 축약(전환: `주소를 붙여넣는다`/`robots.txt 확인 후 로드한다`/`그룹별 카드로 확인한다`). FAQ A1/A3 답변도 축약문이며 동일 규칙으로 종결어미만 전환.

**토큰**: 배경 `--background`(`#FAF6ED`), 카드/섹션 배경 `--card`(`#FFF9F0`), 텍스트 `--foreground`(`#141311`), 서브카피 색 `#4A473F`(**미매핑 토큰 — 4장 참고**), 메타 라벨 색 `--muted-foreground`(`#8A8577`), 룰 라인 `--border`(`#E4DECB`), 브랜드 액센트 `--accent`(`#FF4B1F`), 헤드라인 `Big Shoulders Display` 900, 본문 `IBM Plex Sans`.

---

### 3.2 RequestScanProcess / RequestScanProcessZine → `templates/request-scan/ProcessScreen.tsx` (`/request-scan`)

레퍼런스: `reference/RequestScanProcess.png`, `reference/RequestScanProcess-Mobile.png`

**레이아웃**: 헤더 → 중앙 정렬 컬럼(URL + "생존 확인 완료" 배지pill → 헤딩/서브카피 → 4열 스텝 상태 그리드(완료✓/진행중···/대기– 3가지 아이콘 상태, 갭 없이 1px 룰로 셀 구분) → 진행률 바(55% 채움, 오렌지) → 캡션) → 푸터.

**카피**

| 위치 | 원문 | 전환 |
|---|---|---|
| 상태 배지(pass 색 채움) | `생존 확인 완료` | 전환 없음(라벨, 완료형 명사구) |
| 헤딩 | `체크리스트 항목을 수집하고 있어요` | `체크리스트 항목을 수집하고 있다` |
| 서브카피 | `사이트를 분석하는 동안 잠시만 기다려주세요` | `사이트를 분석하는 동안 잠시 기다린다` (대안: `사이트를 분석하는 동안 잠시 대기하라`) |
| 스텝 라벨 | `robots.txt` / `sitemap.xml` / `페이지 크롤링 + AI 신호` / `Lighthouse` | 전환 없음(라벨) |
| 스텝 상태 | `완료` / `진행 중` / `대기` | 전환 없음(라벨) |
| 하단 캡션 | `각 스텝은 실제 API 완료 시점에 반응합니다` | `각 스텝은 실제 API 완료 시점에 반응한다` |

모바일은 동일 구조/카피, 폭만 390px로 축소(레이아웃만 세로 스택). 헤딩 줄바꿈만 다름(`체크리스트 항목을<br/>수집하고 있어요` / 서브카피 `잠시만 기다려주세요`만 남고 "사이트를 분석하는 동안"이 생략됨 → 전환: `체크리스트 항목을 수집하고 있다` / `잠시 기다린다`).

**토큰**: 완료 아이콘 배경 `--success`(`#3E7D4F`), 진행중 테두리/텍스트 `--accent`(`#FF4B1F`), 대기 테두리/텍스트 `--muted-foreground`(`#8A8577`, opacity .45), 진행률 바 트랙 `--border`(`#E4DECB`) / 채움 `--accent`.

---

### 3.3 RequestScanError / RequestScanErrorZine → `templates/request-scan/ErrorScreen.tsx`

레퍼런스: `reference/RequestScanError.png`, `reference/RequestScanError-Mobile.png`

**레이아웃**: 헤더 → 중앙 정렬(64px 정사각 `!` 아이콘 박스 → 헤딩 → 서브카피 → 버튼 2개: 다시 시도(채움)/홈으로(아웃라인)) → 푸터.

**카피**

| 위치 | 원문 | 전환 |
|---|---|---|
| 헤딩 | `사이트에 접속할 수 없습니다` | `사이트에 접속할 수 없다` |
| 서브카피 | `URL을 다시 확인하거나 잠시 후 다시 시도해주세요` | `URL을 다시 확인하거나 잠시 후 다시 시도한다` (대안: `...다시 시도하라`) |
| 버튼 | `다시 시도` / `홈으로` | 전환 없음(라벨) |

모바일 동일(구조·카피 완전 동일, 폭만 390px).

**토큰**: 아이콘 박스 테두리 `--foreground`(`#141311`), 헤딩 `Big Shoulders Display` 800.

---

### 3.4 RequestScanBlocked / RequestScanBlockedZine → `templates/request-scan/BlockedScreen.tsx` (ADR-006 게이팅 결과 화면)

레퍼런스: `reference/RequestScanBlocked.png`, `reference/RequestScanBlocked-Mobile.png`

**레이아웃**: 헤더 → 중앙 정렬(64px 정사각 `X` 아이콘 박스, fail 색 테두리 → 헤딩 → 서브카피 → URL/차단 사유 정보 박스(하드라인 테두리) → 버튼 1개(다른 URL 시도) → 캡션) → 푸터.

**카피**

| 위치 | 원문 | 전환 |
|---|---|---|
| 헤딩 | `이 사이트는 검사할 수 없습니다` | `이 사이트는 검사할 수 없다` |
| 서브카피 | `robots.txt가 이 사이트의 스캔을 차단하고 있어요. 사이트 소유자의 의사를 존중해 나머지 검사(크롤링·Lighthouse)는 실행하지 않았습니다.` | `robots.txt가 이 사이트의 스캔을 차단하고 있다. 사이트 소유자의 의사를 존중해 나머지 검사(크롤링·Lighthouse)는 실행하지 않았다.` |
| 정보 박스 | `대상 URL: https://example.com — robots.txt Disallow: /` | 전환 없음(데이터 표시) |
| 버튼 | `다른 URL 시도` | 전환 없음(라벨) |
| 하단 캡션 | `경고 후 계속 진행 옵션 없음 — 하드 차단, 비용 절감 목적` | **메타 노트 — 5장 참고, 카피 아님** |

모바일(`RequestScanBlockedMobile.dc.html`) 서브카피는 "사이트 소유자의 의사를 존중해" 절이 빠진 축약형: `robots.txt가 이 사이트의 스캔을 차단하고 있어요. 나머지 검사(크롤링·Lighthouse)는 실행하지 않았습니다.` → 전환: `robots.txt가 이 사이트의 스캔을 차단하고 있다. 나머지 검사(크롤링·Lighthouse)는 실행하지 않았다.` 하단 캡션도 축약형 `경고 후 계속 진행 옵션 없음`(뒤 절 없음) — 이 역시 메타 노트로 5장 참고.

**토큰**: 아이콘 박스 테두리/텍스트 `--destructive`(`#C81E3A`), 정보 박스 하드라인 `--foreground`.

---

### 3.5 Scan / ScanZine → `app/[lang]/scan/page.tsx` (재설계 대상 핵심 화면)

레퍼런스: `reference/Scan.png`, `reference/Scan-Mobile.png`

**레이아웃(위→아래)**
1. 헤더
2. URL + 분석 시각 메타 라인
3. **AI Signals 카드**(하드라인 카드, 그림자 없음) — 상단에 눈썹 라벨 + `AI SIGNALS` 제목(좌), 우측에 캡션. 내부 5행: `prompts.txt`(INFO)/`PromptObject`(INFO)/`FAQ 섹션`(PASS)/`구조화 데이터 WebPage, FAQPage`(PASS)/`JS 렌더링 의존도`(PASS·12%)
4. **"지금 고쳐야 할 것"** — fail/warn 항목만 모은 리스트(각 행 배경이 fail=연한 레드 틴트, warn=연한 옐로 틴트), 갭 없이 1px 룰로 행 구분. FAIL 2건 + WARN 1건
5. **체크리스트 4카드 그리드** — 기본 SEO(5행) / Indexing(5행) / Content Stats(3행, 배지 대신 숫자·텍스트 값) / 국제화·UX(2행). **이 4개는 개별 하드라인 카드 + 20px 실제 갭**(4장 conflict 참고)
6. **Previews — OG · Twitter** 카드 — 상단에 4개 메타 판정(OG 필수 태그/Twitter Card/og:image 크기/favicon), 하단에 2개 미리보기 목업 카드(이미지 placeholder + 타이틀/설명/도메인). 이 2개 목업 카드도 20px 실제 갭(같은 conflict)
7. 굵은 4px 룰로 섹션 구획 후 **Lighthouse 점수 4up**(88/92/76/93, 갭 없이 1px 룰) + **Lighthouse 개선 제안 카드**(3행: 한글 설명 + 영문 원문 감사명)
8. 푸터

**카피**

| 위치 | 원문 | 전환 |
|---|---|---|
| 메타 라인 | `example.com` / `분석 시각 2026-08-18 14:32` | 전환 없음(데이터) |
| AI Signals 눈썹 라벨 | `핵심 차별화 영역 — Lighthouse가 안 보는 것` | **메타 노트 — 5장** |
| AI Signals 제목 | `AI SIGNALS` | 전환 없음(섹션명) |
| AI Signals 우측 캡션 | `없어도 감점 아님 — info 톤` | **메타 노트 — 5장** |
| AI Signals 행 라벨 | `prompts.txt` / `PromptObject` / `FAQ 섹션` / `구조화 데이터 WebPage, FAQPage` / `JS 렌더링 의존도` | 전환 없음(라벨) |
| 배지 텍스트 | `INFO · 없음` / `PASS · 발견됨` / `PASS` / `PASS · 12%` | 전환 없음(상태 라벨) |
| 섹션 제목 | `지금 고쳐야 할 것` | 전환 없음(명사구, 이미 문어체) |
| FAIL 항목 1 | `meta robots에 noindex가 설정돼 있어 색인되지 않습니다` | `meta robots에 noindex가 설정돼 있어 색인되지 않는다` |
| FAIL 항목 2 | `canonical 태그가 2개 이상 발견됐습니다` | `canonical 태그가 2개 이상 발견됐다` |
| WARN 항목 | `og:image 크기 메타가 없습니다` | `og:image 크기 메타가 없다` |
| 카드 제목들 | `기본 SEO` / `Indexing` / `Content Stats` / `국제화·UX` | 전환 없음 |
| 기본 SEO 행 | `title`/`description`/`keywords 태그`/`이미지 alt 누락`/`중복 meta` (+배지) | 전환 없음(라벨) |
| Indexing 행 | `sitemap.xml 존재`/`robots.txt에 sitemap`/`canonical 존재`/`canonical 다중`/`noindex` (+배지) | 전환 없음 |
| Content Stats 행 | `본문 단어 수` `1,340` / `헤딩 구조` `H1:1 H2:6 H3:12` / `TL;DR`(INFO) | 전환 없음(데이터/라벨) |
| 국제화·UX 행 | `hreflang`(INFO) / `viewport`(PASS) | 전환 없음 |
| Previews 제목 | `Previews — OG · Twitter` | 전환 없음 |
| Previews 메타 판정 라벨 | `OG 필수 태그`/`Twitter Card`/`og:image 크기`/`favicon` | 전환 없음 |
| 미리보기 목업 1(OG형) | 도메인 `EXAMPLE.COM`, 타이틀 `meta-scan — 무료 SEO/AEO 체크리스트`, 설명 `URL 하나로 항목별로 점검하세요` | 도메인/타이틀 전환 없음(라벨), 설명 `URL 하나로 항목별로 점검한다` |
| 미리보기 목업 2(Twitter형) | 타이틀 동일, 설명 동일, 도메인 `example.com` | 설명 `URL 하나로 항목별로 점검한다` |
| Lighthouse 점수 제목 | `Lighthouse 점수` | 전환 없음 |
| 점수 라벨 | `Performance`/`SEO`/`Accessibility`/`Best Practices` + 숫자 | 전환 없음(영문 라벨/데이터) |
| 개선 제안 제목 | `Lighthouse 개선 제안` | 전환 없음 |
| 개선 제안 캡션 | `Hero(위, 자체 판정)와 출처가 다름 — lhr.audits 기반` | **메타 노트 — 5장** |
| 개선 제안 행 | `이미지 크기 최적화` / `Properly size images`, `렌더링 차단 리소스 제거` / `Eliminate render-blocking`, `차세대 이미지 포맷` / `Next-gen formats` | 전환 없음(한글 의역 라벨 + 영문 Lighthouse 원문 감사명) |

**모바일 차이(`ScanMobile.dc.html`)**:
- AI Signals 눈썹 라벨이 `핵심 차별화 영역 —` 접두 없이 `Lighthouse가 안 보는 것`만 남음(메타 노트 축약형, 5장 참고). 우측 캡션(`없어도 감점 아님 — info 톤`)은 **모바일에서 아예 삭제됨** — 데스크톱에만 있던 문구.
- FAIL 항목 1은 풀 문장 유지(`noindex 설정으로 색인되지 않습니다` → `noindex 설정으로 색인되지 않는다`), FAIL 항목 2·WARN 항목은 명사구 축약형(`canonical 태그 2개 이상 발견`, `og:image 크기 메타 없음`) — 이미 종결어미가 없는 조각이라 전환 대상 아님.
- Previews는 2열(모바일 폭 제약)로 축소, 미리보기 목업 카드가 1개만(OG형), 타이틀 `meta-scan — 무료 SEO/AEO/GEO 체크리스트`(데스크톱과 GEO 포함 여부 살짝 다름), 설명 문구 없이 도메인/타이틀만.
- Lighthouse 개선 제안 캡션이 `lhr.audits 기반, Hero와 출처 다름`으로 어순만 바뀐 축약형(동일 메타 노트, 5장). 각 개선 제안 행에서 영문 원문 라벨(`Properly size images` 등)이 아예 빠짐(한글 라벨만).

**토큰**: 카드 `border:1.5px solid --foreground`, 배경 `--popover`(`#FFFFFF`) 또는 `--card`. 배지 — pass `--success`/`--success-foreground`, warn `--warning`/`--warning-foreground`, fail `--destructive`/`--destructive-foreground`, info `--info` + `--info-border` 아웃라인만(채움 없음, 문서 규칙과 정확히 일치). fail 행 배경 `--fail-tint`(`#FFF1EC`), warn 행 배경 `--warning-tint`(`#FFFAEE`) — 둘 다 기존 토큰과 정확히 일치.

---

### 3.6 Privacy / PrivacyZine → `app/[lang]/privacy/page.tsx`

레퍼런스: `reference/Privacy.png`, `reference/Privacy-Mobile.png`

**레이아웃**: 헤더 → 타이틀 `개인정보처리방침` + 최종 수정일 → 01~06 번호가 매겨진 6개 섹션(각 섹션 제목 + 회색 라인바 3~1줄로 본문 자리표시, 실제 약관 텍스트 없음 — placeholder) → 푸터.

**카피**

| 위치 | 원문 | 전환 |
|---|---|---|
| 타이틀 | `개인정보처리방침` | 전환 없음 |
| 날짜 | `최종 수정일: 2026-08-01` | 전환 없음 |
| 섹션 제목 01~06 | `수집하는 개인정보 항목` / `개인정보 수집 및 이용 목적` / `개인정보 보유 및 이용 기간` / `제3자 제공` / `이용자의 권리` / `문의처` | 전환 없음(법률 문서 제목, 명사구) |

본문은 전부 회색 바 placeholder(`[ ]` 자리표시조차 아닌 순수 회색 사각형)라 실제 카피 없음 — **실제 약관 본문 작성은 이 스펙 범위 밖**(퍼블리셔가 만들 내용이 아니라 법무/운영 쪽에서 채워야 할 텍스트).

모바일 동일 구조, 섹션 제목 일부 축약(`개인정보 수집 및 이용 목적`→`수집·이용 목적`, `개인정보 보유 및 이용 기간`→`보유 및 이용 기간`) — 명사구라 전환 대상 아님.

---

### 3.7 Terms / TermsZine → `app/[lang]/terms/page.tsx`

레퍼런스: `reference/Terms.png`, `reference/Terms-Mobile.png`

Privacy와 동일 레이아웃 패턴. 섹션 제목 01~06: `목적` / `정의` / `서비스의 제공 및 변경` / `이용자의 의무` / `면책조항` / `문의처` — 전환 없음(명사구). 본문 역시 placeholder 라인바뿐, 실제 약관 텍스트 없음.

---

### 3.8 NotFound / NotFoundZine → `app/[lang]/not-found.tsx`

레퍼런스: `reference/NotFound.png`, `reference/NotFound-Mobile.png`

**레이아웃**: 헤더/푸터 없는 독립 화면. 중앙 정렬 — 대형 `404`(오렌지, `Big Shoulders Display` 900) → 헤딩 → 서브카피 → 버튼 1개(홈으로 돌아가기).

**카피**

| 위치 | 원문 | 전환 |
|---|---|---|
| 숫자 | `404` | 전환 없음 |
| 헤딩 | `페이지를 찾을 수 없습니다` | `페이지를 찾을 수 없다` |
| 서브카피 | `요청하신 페이지가 존재하지 않거나 이동되었습니다` | `요청하신 페이지가 존재하지 않거나 이동되었다`(※ "요청하신"의 `-시-` 주어존대는 2장 규칙 범위 밖이라 유지 — 필요시 별도 확인) |
| 버튼 | `홈으로 돌아가기` | 전환 없음(라벨) |

모바일 동일 카피, 크기만 축소.

**구현 상태 참고**(스펙이 아니라 팀 메모): 현재 `app/[lang]/not-found.tsx`는 이미 존재하고 헤더/푸터 없이 중앙 정렬 구조로 구현돼 있어 이 아트보드와 구조가 일치한다. 다만 저장소 최상위(`app/not-found.tsx`, `[lang]` 밖)는 확인 결과 존재하지 않는다 — 로케일 프리픽스 없는 404 처리가 비는 부분일 수 있으니 publish-front가 참고.

---

### 3.9 ErrorBoundary / ErrorBoundaryZine → `app/[lang]/error.tsx`

레퍼런스: `reference/ErrorBoundary.png`, `reference/ErrorBoundary-Mobile.png`

**레이아웃**: 헤더/푸터 없는 독립 화면. 중앙 정렬 — `!` 아이콘 박스 → 헤딩 → 서브카피 → 버튼 2개(다시 시도/홈으로).

**카피**

| 위치 | 원문 | 전환 |
|---|---|---|
| 헤딩 | `문제가 발생했습니다` | `문제가 발생했다` |
| 서브카피 | `일시적인 오류일 수 있습니다. 다시 시도해주세요` | `일시적인 오류일 수 있다. 다시 시도한다`(대안 두 번째 문장: `다시 시도하라`) |
| 버튼 | `다시 시도` / `홈으로` | 전환 없음(라벨) |

모바일 동일.

---

## 4. 디자인 시스템 크로스체크 — 확인/충돌/공백

### 4.1 확인(문서와 정확히 일치, 참고용)
- 카드: 그림자 없음, `1.5px solid #141311` 하드라인, 모서리 없음 — 전 아트보드 일관.
- 배지: pass/warn/fail 동일 무게 채움 박스, info만 얇은 아웃라인 — `docs/design/design-system.md` §8 규칙과 정확히 일치.
- 번호 라벨(01~04): `Big Shoulders Display` + 오렌지 — 반복 모티프 규칙과 일치.
- 헤더 하단 4px / 푸터 상단 1.5px 룰, 컨테이너 좌우 여백 56px(데스크톱) — 문서 §5 수치와 정확히 일치.
- 프로세스 스텝 4up·Lighthouse 점수 4up·"지금 고쳐야 할 것" 리스트는 갭 없이 1px 룰로 셀 구분 — §4 "갭 대신 룰 라인" 규칙 준수.
- 타이포: 헤드라인/숫자 `Big Shoulders Display`, 본문 `IBM Plex Sans` — 세리프·Inter 없음, 규칙 준수.

### 4.2 충돌(사용자/publish-front 판단 필요)
1. **체크리스트 4카드 그리드 + Previews 2카드 그리드가 "갭 대신 룰 라인" 규칙을 어김.** `ScanZine.dc.html`의 기본 SEO/Indexing/Content Stats/국제화·UX 4카드(67행)와 Previews 안의 OG/Twitter 미리보기 2카드(106행)는 개별 하드라인 카드(`.card`)를 **20px 실제 `gap`** 으로 띄워 배치한다 — `docs/design/design-system.md` §4의 "카드 그룹(그리드) 사이는 1px 검정 룰로 셀을 구분... 갭 대신 룰 라인"과 정면으로 다르다. 같은 화면 안에서 프로세스 스텝/Lighthouse 점수/"지금 고쳐야 할 것"은 전부 룰 라인 패턴을 쓰는데 이 두 그리드만 다르다 — 의도적 예외인지, 그냥 놓친 것인지 결정 필요.
2. **도트 패턴 장식(halftone 텍스처).** `MainZine.dc.html`(34행)의 Hero 우상단 `radial-gradient(#141311 22%, transparent 23%) 0 0/10px 10px` 반복 텍스처 — CSS 속성명이 `radial-gradient`라 §7 "그라디언트 배경... 전부 금지" 문구를 문자 그대로 적용하면 위반처럼 보이지만, 실제로는 색 블렌드가 아니라 인쇄 하프톤 도트 텍스처를 만드는 용도다("진 인덱스"의 인쇄물 모티프와는 잘 맞음). 금지 규칙이 "부드러운 색 그라디언트"를 겨냥한 것인지 "`radial-gradient` 함수 사용 자체"를 겨냥한 것인지 문서에 명시가 없어 판단이 필요하다.
3. **헤더 원형 아바타 placeholder.** 전 아트보드 헤더 우측의 `border-radius:50%` 원형 배지(`#E4DECB`) — §7은 "카드에 둥근 모서리 금지"라고 카드에 한정해 말하지만, 이 원형 요소가 무엇을 나타내는지(테마 토글? 다국어 스위치? 아바타?) 디자인 파일 안에 라벨이 전혀 없다. 프로젝트에 이미 `templates/root/ToggleSetting.tsx`/`ServiceStatus.tsx`가 있어 그 자리로 추정되지만 확정은 아니다 — 아래 4.3 공백과 함께 확인 필요.

### 4.3 공백(문서에 없는 것 — 임의로 채우지 않음)
1. **Ink Secondary(`#4A473F`) 토큰이 코드에 없다.** `docs/design/design-system.md` §2에 "서브 카피, 본문 설명" 색으로 정의돼 있고 이번 디자인의 거의 모든 서브카피(Hero 서브카피, FAQ 답변 본문, 에러 화면 서브카피 등)에 실제로 쓰이는데, `packages/meta-scan-front/src/css/globals.css`의 CSS 변수 목록(`--background`~`--sidebar-ring`)에는 대응 변수가 없다(`grep`으로 미검출 확인). `--muted-foreground`(`#8A8577`, Ink Tertiary)와는 다른 색이라 대체 불가 — 새 토큰(예: `--foreground-secondary`)을 추가해야 하는지 publish-front가 확인 필요.
2. **헤더 원형 요소의 정체.** 위 4.2-③과 동일 — 컴포넌트 패턴으로 문서화된 적이 없다.
3. **URL 입력 필드에 아이콘/버튼 결합 여부.** 문서 §4는 "라벨 없이 플레이스홀더만"이라고만 규정하고, 이 디자인처럼 입력창과 CTA 버튼을 나란히 배치하는 조합 패턴 자체는 문서에 없다(단일 필드 스타일만 규정). 이번 배치가 그대로 컴포넌트 패턴이 되는 것인지 확인 필요.

---

## 5. 메타 코멘터리가 카피에 섞여 들어간 사례 — 전부 카피 제외, 재작성안 제시

아래 4곳은 디자인/개발 개념(내부 섹션명, API/감사 출처, 배지 톤 이름, 비용 절감 같은 비즈니스 이유)을 사용자에게 설명하듯 화면에 그대로 박아 넣은 문장이다. "디자인 파일을 본 적 없는 사람이 이 문장만 보고 이해할 수 있는가?"를 기준으로 판단했고, 넷 다 실패한다 — **그대로는 카피로 채택하지 않는다.** 정보 자체(사용자에게 실제로 유용한 부분)는 보존하는 선에서 재작성안을 제안하니 확정은 사용자가 한다.

| # | 원문 | 위치 | 문제 | 재작성안(user-facing) |
|---|---|---|---|---|
| 1 | `없어도 감점 아님 — info 톤` | `ScanZine.dc.html` 46행(AI Signals 카드 우측 캡션). 모바일에서는 아예 삭제됨 | "info 톤"은 배지 시각적 무게를 가리키는 디자인 용어 — 사용자는 "톤"이 뭔지 모른다 | `없어도 감점되지 않는다` (또는 info 배지 자체 옆에 짧게 `없어도 무방` 정도로 축약해 배지 라벨화하는 방법도 고려) |
| 2 | `핵심 차별화 영역 — Lighthouse가 안 보는 것` | `ScanZine.dc.html` 43행(AI Signals 카드 눈썹 라벨). 모바일은 `Lighthouse가 안 보는 것`만 남긴 축약형 | "핵심 차별화 영역"은 제품 포지셔닝 메모지 사용자에게 하는 말이 아님 | `Lighthouse에는 없는 점검 항목` (Lighthouse와 다르다는 사실 자체는 사용자에게 유용한 정보라 유지, "차별화" 표현만 제거) |
| 3 | `Hero(위, 자체 판정)와 출처가 다름 — lhr.audits 기반` | `ScanZine.dc.html` 132행(Lighthouse 개선 제안 캡션). 모바일은 `lhr.audits 기반, Hero와 출처 다름`(어순만 다른 축약형) | "Hero"는 화면 섹션의 내부 명칭, "lhr.audits"는 Lighthouse 결과 객체의 API 필드명 — 둘 다 코드베이스를 본 사람만 이해 가능 | `Lighthouse가 직접 제안하는 개선 항목이다`(위 "지금 고쳐야 할 것" 섹션과는 판정 근거가 다르다는 사실만 평이하게 전달, "Hero"/"lhr.audits" 같은 내부 용어 제거) |
| 4 | `경고 후 계속 진행 옵션 없음 — 하드 차단, 비용 절감 목적` | `RequestScanBlockedZine.dc.html` 33행. 모바일은 `경고 후 계속 진행 옵션 없음`(뒷절 없는 축약형) | "비용 절감 목적"은 사업적 이유를 사용자에게 설명하는 문장 — 방문자 입장에선 알 필요도, 알고 싶지도 않은 내부 사정 | 이 화면은 애초에 "다른 URL 시도" 버튼 하나뿐이라 "우회 옵션이 없다"는 사실이 UI 구조로 이미 드러난다 — **문구 자체를 없애는 것도 옵션.** 굳이 남긴다면: `robots.txt가 차단한 사이트는 추가 검사 없이 여기서 멈춘다` 정도로, 비용 이유는 빼고 사실만 전달 |

---

## 요약

- **아트보드 수**: 18개(데스크톱 9 + 모바일 9), 전부 `final` 페이지(진 인덱스 + 오렌지) 채택.
- **버린 패밀리**: `wireframes`(회색조 로우파이, 구조 참고만) / `explore`(랩 리포트·네온 스캐너·진 인덱스 컬러 4안 탐색 — 진 인덱스+오렌지로 이미 확정됨).
- **레퍼런스 스크린샷**: `docs/design/intake/zine-index-full/reference/`에 18장.
- **결정 필요(진행 전에)**:
  1. §4.2-① 체크리스트/Previews 그리드의 20px 갭 vs 문서 규정 "룰 라인" — 어느 쪽이 맞는지.
  2. §4.2-② Hero 도트 텍스처가 §7 그라디언트 금지 규칙 위반인지(문자 그대로 vs 취지).
  3. §4.2-③/4.3-② 헤더 원형 placeholder가 실제로 뭘 나타내는지(테마 토글 등으로 추정만 함).
  4. §4.3-① `#4A473F`(Ink Secondary) 토큰이 코드에 없음 — 추가 필요.
  5. §5의 메타 노트 4건 재작성안 확정(또는 문구 자체 삭제, 특히 #4).
  6. §2 톤 전환 중 두 갈래로 제시한 곳(예: "잠시 기다린다" vs "잠시 대기하라")은 평서형/명령형 중 하나로 통일 확정.
- publish-front는 이 스펙과 함께 `docs/design/design-system.md`(ADR-008), `docs/case-study/frontend-component-architecture.md`(ADR-009, FSD-lite)를 그대로 따르되, 위 6가지는 구현 착수 전에 사용자 확인을 받을 것.

---

## 6. 결정 사항 (사용자 확인 완료, 2026-08-19)

1. **§5 메타 코멘터리 카피 4건** → **원본 그대로 퍼블리시.** 재작성안(§5 표 마지막 열)은 적용하지 않는다. `없어도 감점 아님 — info 톤` / `핵심 차별화 영역 — Lighthouse가 안 보는 것` / `Hero(위, 자체 판정)와 출처가 다름 — lhr.audits 기반` / `경고 후 계속 진행 옵션 없음 — 하드 차단, 비용 절감 목적`(+ 각 모바일 축약형) — 아트보드에 적힌 원문(톤 전환만 적용된 버전)을 그대로 화면에 노출한다.
2. **§4.2-① 그리드 gap 충돌** → **문서 규칙(rule-line)으로 통일.** `ScanZine`의 체크리스트 4카드 그리드, Previews OG/Twitter 2카드 그리드 모두 20px `gap` 대신 1px 룰 라인으로 구현한다.
3. **§4.2-② halftone-dot 텍스처** → **규칙 문자 그대로 적용해 제거/대체.** Hero의 `radial-gradient()` 도트 텍스처는 구현하지 않는다(§7 그라디언트 금지 규칙 준수). 대체 장식이 필요하면 그라디언트가 아닌 방식(예: 반복 아이콘, 솔리드 패턴)으로 publish-front가 판단.
4. **§4.2-③/4.3-② 헤더 원형 placeholder + §4.3-③ Hero input+CTA 조합** → **최선 추정으로 구현, 문서화는 추후.** 원형 placeholder는 기존 `templates/root/ToggleSetting.tsx`/`ServiceStatus.tsx` 자리로 추정해 연결하고, input+CTA는 기존 버튼/인풋 토큰 조합으로 추정 구현한다. 정확한 용도가 코드베이스에서 다르게 확인되면 그쪽을 우선한다.
5. **§4.3-① Ink Secondary(`#4A473F`) 토큰 부재** → publish-front가 `globals.css`에 신규 CSS 변수로 추가(기계적 작업, 별도 확인 불필요).
6. **§2 톤 전환 중 평서/명령 두 갈래로 제시된 3곳** (ProcessScreen 서브카피, ErrorScreen 서브카피, ErrorBoundary 서브카피) → **`-다`/`-라`를 문맥마다 자연스럽게 섞어 쓴다. 존댓말(요체)은 어떤 경우에도 쓰지 않는다.** 한쪽으로 기계적으로 통일하지 말고, 너무 명령조로 몰아붙이거나 과하게 격식체로 뻣뻣하지 않게(간드러지는 표현 금지) 자연스러운 문어체 톤을 유지한다. publish-front가 이 기준으로 최종 문구를 확정.
