# Intake Spec: zine-index

> Source: Claude Design canvas artifact `43c00b5f-73e5-4720-b77f-265dffe7e71c` ("meta-scan
> Wireframes"). Extracted from the locally-saved raw HTML
> (`tool-results/artifact-43c00b5f-1787043587-4f6f.html`, saved by an earlier session today),
> parsing the `<script id="appifact-doc">` JSON payload.

> **Amendment (2026-08-19)**: re-audited the raw `.dc.html` sources against every shipped copy string for wireframe-author meta-commentary (design/dev notes about the design itself) that got extracted as if it were literal product copy. See **§5 Leaked design-note corrections** below — 5 instances found across 3 screens, all already corrected inline in the per-screen sections and listed with proposed rewrites in §5.

## 0. Methodology / file family used

The artifact contains four artboard families sharing the same 9 screen names (Main /
RequestScanProcess / RequestScanError / RequestScanBlocked / Scan / Privacy / Terms / NotFound /
ErrorBoundary):

| Family | Files | Status |
|---|---|---|
| Plain low-fi wireframe | `Main.dc.html` … `ErrorBoundary.dc.html` | **Discarded** — grayscale scaffolding, superseded |
| **Zine (desktop, finished)** | `MainZine.dc.html` … `ErrorBoundaryZine.dc.html` (`canvas.json` tags these `"page": "final"`, width 1200) | **Used** — this is ADR-008's committed "Zine Index" tone, already implemented in `packages/meta-scan-front` earlier today |
| **Mobile (responsive variant)** | `MainMobile.dc.html` … `ErrorBoundaryMobile.dc.html` (also tagged `"page": "final"`, width 390) | **Used** — this is the primary new-work focus of this intake; not implemented at all yet |
| Concept explorations | `ConceptLabReport`, `ConceptNeonScanner`, `ConceptZineIndex(+Blue/Yellow/Pink)`, `DirectionsIntro` | **Discarded** — early direction exploration, abandoned in favor of the Zine family |

All 9 screens exist in both the Zine and Mobile families — full coverage, no ambiguity requiring
a stop-and-ask on family selection.

Docs cross-checked: `docs/design/design-system.md` (ADR-008) and `docs/case-study/frontend-component-architecture.md`
(ADR-009, decided but not yet reflected in the actual folder structure — code still lives in
`src/templates/*` + `src/components/ui/*`, not `shared/`/`features/`).

## 1. Reference screenshots

Rendered via headless Chromium (Puppeteer) directly from the extracted `.dc.html` files, at the
artboards' own declared widths from `canvas.json` (desktop 1200px viewport, mobile 390px
viewport), `fullPage: true` screenshots. All 18 saved under
`docs/design/intake/zine-index/reference/`:

`Main-Zine.png`, `Main-Mobile.png`, `RequestScanProcess-Zine.png`, `RequestScanProcess-Mobile.png`,
`RequestScanError-Zine.png`, `RequestScanError-Mobile.png`, `RequestScanBlocked-Zine.png`,
`RequestScanBlocked-Mobile.png`, `Scan-Zine.png`, `Scan-Mobile.png`, `Privacy-Zine.png`,
`Privacy-Mobile.png`, `Terms-Zine.png`, `Terms-Mobile.png`, `NotFound-Zine.png`,
`NotFound-Mobile.png`, `ErrorBoundary-Zine.png`, `ErrorBoundary-Mobile.png`.

Fonts (Big Shoulders Display / IBM Plex Sans, loaded from Google Fonts `<link>` in each
`.dc.html`) rendered correctly in all screenshots — verified visually on a sample (Main, both
widths). The `<script src="./support.js">` reference 404s harmlessly (support runtime for the
canvas editor itself, irrelevant to static visual output).

## 2. Cross-cutting findings (apply to multiple/all screens — read this before the per-screen detail)

These are systemic, not per-screen quirks, so listing once up front:

### 2.1 `content-frame` utility has no mobile step-down — likely root cause of "desktop-only" state
`src/css/globals.css` `@utility content-frame` is fixed at `padding-inline: 56px` with no
responsive variant. Every one of the 9 Mobile artboards uses **20px** side padding consistently
(`Main/RequestScanProcess/RequestScanError/RequestScanBlocked/Scan/Privacy/Terms` all use
`padding:… 20px` on their outer containers; `NotFound`/`ErrorBoundary` use `padding:20px` on the
centered flex column). At a 390px viewport, 56px padding on both sides leaves only ~278px of
content width vs. the design's ~350px — this single fixed value is likely the biggest blocker to
any of the Mobile layouts rendering correctly. **Gap**: `docs/design/design-system.md` §5 documents only
the desktop 56px margin figure; the mobile 20px figure is not written down anywhere in the design
system docs. Recommend `content-frame` gain a `max-sm:px-5` (20px) override, and that
`docs/design/design-system.md` §5 be updated to record both values — flagging both the code gap and the
doc gap.

### 2.2 Header height/content shrinks at mobile, nav link drops (no hamburger)
- Header height: 80px desktop → **64px** mobile (border-bottom stays 4px in both — the design
  never thins that rule).
- Avatar circle: 32px desktop → **26px** mobile.
- On `Main` only, the desktop header has a `문서` ("Docs") nav link next to the avatar. On
  `MainMobile`, that link is **removed entirely** — not moved into a hamburger/menu, just dropped.
  No other screen's header has a nav link to begin with (all others are logo + avatar only,
  unchanged desktop/mobile).
- **Gap**: `docs/design/design-system.md` doesn't document a mobile header pattern or a hamburger-menu
  component at all — this design doesn't introduce one either (it just drops the link), so
  publish-front should do the same (hide the link at mobile width) rather than inventing a menu
  component that isn't in either the design or the docs.
- Current `RootHeader.tsx` has no responsive classes at all (fixed `h-9 w-9` logo box, no header
  height utility beyond `py-5`, and the "문서" link doesn't exist in the current implementation
  in the first place — the real header only has theme/lang toggle + service-status pill, which
  the wireframes don't depict at all. See §2.5.

### 2.3 Footer: mobile is left-aligned two-row stack in the design, current code centers it
Every Mobile artboard's footer is `flex-direction:column` with **no `align-items` set** (→ default
`stretch`/left-aligned text), holding `© meta-scan` on its own line, then a links row
(`개인정보처리방침` / `이용약관`) below it — consistently across all 9 screens that have a footer.

Current `RootFooter.tsx`: `className="flex flex-col items-center gap-4 py-8 sm:flex-row
sm:justify-between"` — **centers** the stacked content at mobile widths (`items-center`), which
conflicts with the design's left-aligned mobile footer. This is a real, repeatable conflict
(applies everywhere `RootFooter` renders, i.e. every page), not a one-off.

### 2.4 Button order reversed vs. design on both error-style screens
Design order in `RequestScanErrorZine`/`Mobile` and `ErrorBoundaryZine`/`Mobile` is consistently
**primary/filled "다시 시도" (retry) first, outline "홈으로" (home) second**.

Current code has this **backwards** in both places:
- `ErrorScreen.tsx`: `<Button variant="outline">{t.goBack}</Button>` rendered first, then
  `<Button>{t.retryButton}</Button>` (primary) second.
- `error.tsx` (ErrorBoundary): `<Button variant="outline">{t.home}</Button>` first, then
  `<Button onClick={reset}>{t.retry}</Button>` (primary) second.

Flag as a conflict to fix in both files, plus (new work) neither currently stacks the two buttons
to full-width column on mobile — the Mobile artboards for both screens show the buttons stacked
vertically at 100% width (`flex-direction:column;gap:10px;width:100%`), not side-by-side at any
width.

### 2.5 The wireframes don't depict some things the real header already has
`RootHeader.tsx`'s real implementation includes a dark/light `ToggleSetting` and a `ServiceStatus`
pill next to the avatar slot — neither appears in any `.dc.html` (all headers just show a plain
avatar-colored circle placeholder). This isn't a conflict to "fix" — the wireframe simply didn't
model this control — but it means the header's *exact* mobile treatment for those two live
controls (do they shrink, stack, hide behind the avatar circle, etc.) is **not specified by this
design** and needs a decision separate from this intake.

## 3. Per-screen detail

### 3.1 Main → `src/app/[lang]/page.tsx` (+ `HeroSection.tsx`, `ProcessSection.tsx`, `FAQSection.tsx`)

**Desktop (`MainZine.dc.html`, 1200×1420)** — top to bottom:
1. Header (80px, 4px bottom rule): `META—SCAN` display-face logo left; right side: `문서` link +
   32px circular avatar placeholder.
2. Hero (padding 88px/56px/72px): eyebrow label, display headline with an orange highlight-block
   span, subtitle paragraph, URL input (440px fixed width, 56px tall, 2px hard border) + `스캔
   시작 →` button inline to its right. A faint decorative dot-grid circle sits absolute-positioned
   top-right of this section (radial-gradient dot pattern, opacity .4) — purely decorative, not
   in current implementation.
3. "어떻게 동작하나요" section (Card Paper bg `#FFF9F0`, 4px top+bottom rules): headline, then a
   **4-column** hardline grid (1px black rule between cells) of numbered steps `01`–`04`: URL
   입력 / 크롤링 / 항목별 판정 / 체크리스트 확인.
4. "자주 묻는 질문" (FAQ) section: headline + subtitle-less accordion of **6 items** (2 shown
   expanded in the mock: item 1 and item 3), each `+`/`−` toggle.
5. Footer (1.5px top rule): `© meta-scan` left, `개인정보처리방침` / `이용약관` links right,
   same row.

**Mobile (`MainMobile.dc.html`, 390×1620) — deltas from desktop:**
- Header: 64px tall, 26px avatar, **no `문서` link** (see §2.2).
- Hero: eyebrow copy is **shortened** (see exact copy below); headline switches to a 4-line
  `<br/>` break pattern at 36px (vs. desktop's 3-line break at 58px); the decorative dot-grid is
  **removed entirely**; subtitle copy is also **shortened**; URL input + button switch from an
  inline row to a **stacked full-width column** (input then button, both 100% width, 10px gap) —
  this part already matches current `HeroSection.tsx` (`flex-col items-stretch gap-3
  sm:flex-row`).
- "어떻게 동작하나요": the 4-column grid becomes a **single-column stack of 4 rows**, but each
  row's *internal* layout also changes shape — desktop tiles are vertical (number on top, title,
  then description stacked below), mobile rows are **horizontal** (number-badge fixed at 34px
  width on the left, title+description stacked to its right) — this is not just a grid column
  collapse, the tile's internal flex direction changes too.
- FAQ: same accordion pattern, but **expanded items bleed edge-to-edge**: `margin:0
  -20px;padding:0 20px` on expanded item wrappers pushes the `#FFF9F0` highlight background past
  the page's 20px gutters to the viewport edge, while collapsed items don't get this treatment.
  Number of FAQ items: still 6 in the mobile family.
- Footer: 20px padding, column layout, `© meta-scan` on its own row then links row below,
  **left-aligned** (no `items-center`) — see §2.3.

**Exact copy (Korean, verbatim):**
- Eyebrow (desktop): `무료 · 가입 불필요 · SEO/AEO/GEO 체크리스트`
- Eyebrow (mobile): `무료 · 가입 불필요` (shortened — drops the `· SEO/AEO/GEO 체크리스트` suffix)
- Headline: `URL 하나로` + orange-highlighted `SEO/AEO/GEO` + ` 체크리스트를 확인하세요` (desktop
  wraps as `URL 하나로<br/>[SEO/AEO/GEO] 체크리스트를<br/>확인하세요`; mobile wraps as `URL
  하나로<br/>[SEO/AEO/GEO]<br/>체크리스트를<br/>확인하세요`)
- Subtitle (desktop): `Lighthouse가 다루지 않는 구조화 데이터·AI 신호까지, 항목별로
  pass/warning/fail/info로 점검합니다.`
- Subtitle (mobile): `구조화 데이터·AI 신호까지 pass/warning/fail/info로 점검합니다.` (drops the
  "Lighthouse가 다루지 않는" lead-in)
- Input placeholder: `https://example.com`
- CTA button: `스캔 시작 →`
- Section headline: `어떻게 동작하나요`
- Steps: `01 URL 입력` / `분석할 페이지 주소를 붙여넣습니다` (mobile: `주소를 붙여넣습니다`) ·
  `02 크롤링` / `robots.txt 확인 후 페이지를 실제로 로드합니다` (mobile: `robots.txt 확인 후
  로드`) · `03 항목별 판정` / `pass/warning/fail/info 네 가지로 판정합니다` (mobile:
  `pass/warning/fail/info`) · `04 체크리스트 확인` / `그룹별 카드로 결과를 확인합니다` (mobile:
  `그룹별 카드로 확인`)
- FAQ headline: `자주 묻는 질문`
- FAQ Q1 (expanded): `SEO·AEO·GEO가 뭔가요?` — A: `SEO(검색엔진 최적화)는 구글 같은 전통
  검색엔진에서 발견되기 위한 기본기, AEO(답변엔진 최적화)는 ChatGPT·Perplexity 같은 AI
  답변엔진이 이 페이지를 답변에 인용하기 좋은 형태인지, GEO(생성엔진 최적화)는 생성형 AI가
  콘텐츠를 정확히 이해·인용할 수 있는지를 다룹니다. meta-scan은 이 세 가지를 각각 다른
  체크리스트 그룹으로 나눠 한 번에 점검합니다.` (mobile A is a condensed single sentence: `SEO는
  전통 검색엔진 기본기, AEO는 AI 답변엔진 인용 준비도, GEO는 생성형 AI의 콘텐츠 이해·인용도를
  말합니다. meta-scan은 이 셋을 각각 체크리스트 그룹으로 나눠 함께 점검합니다.`)
- FAQ Q2 (collapsed): `정말 무료인가요?`
- FAQ Q3 (expanded): `무엇을 확인해야 하나요?` — A: `SEO — 기본 SEO(title·description·이미지
  alt), 색인(sitemap·canonical·noindex), 미리보기(OG·Twitter 카드)를 점검합니다. AEO·GEO — AI
  Signals 카드에서 구조화 데이터, prompts.txt, FAQ 섹션, JS 렌더링 의존도를 점검합니다. 이 밖에
  콘텐츠 품질(본문 분량·헤딩 구조)과 국제화·UX(hreflang·viewport)까지 총 6개 그룹, 항목마다
  pass/warning/fail/info 네 가지로 판정합니다.` (mobile A condensed: `SEO — 기본
  SEO·색인·미리보기. AEO·GEO — AI Signals(구조화 데이터·prompts.txt·FAQ·JS 렌더링 의존도).
  콘텐츠·국제화까지 총 6개 그룹을 pass/warning/fail/info로 판정합니다.`)
- FAQ Q4 (collapsed, desktop only): `AEO·GEO를 위해 어떤 문서가 필요한가요?` — **note: this
  question does not appear in the Mobile family's visible FAQ list** (mobile only shows 6 rows
  total but the 4th one differs — verify against the mobile screenshot directly, question set
  order may differ slightly; treat desktop's 6-question list as canonical copy source and confirm
  final order against `Main-Mobile.png`).
- FAQ Q5: `얼마나 걸리나요?`
- FAQ Q6: `결과가 저장되나요?`
- Footer: `© meta-scan` / `개인정보처리방침` / `이용약관`

**Tokens**: `#FAF6ED` background = `--background`, `#FFF9F0` card section = `--card`, `#141311`
ink = `--foreground`, `#FF4B1F` accent = `--accent`, `#8A8577` = `--muted-foreground`, `#4A473F` =
close to `--foreground`-tinted secondary text (design-system.md's "Ink Secondary" role — not
currently a named CSS var; implementation collapses this into `text-muted-foreground` in places).
Big Shoulders Display = `font-display`, IBM Plex Sans = `font-sans`. Sharp corners, 1.5px hard
borders — all match existing tokens, no new/unmapped values here.

**Conflicts/gaps (design-system rules):**
- **Conflict (content, not styling) — step count**: design shows **4** process steps; current
  `ProcessSection.tsx` + `ko.json`/`en.json` `main` dictionary only define **3**
  (`step1Title`..`step3Title`). This is a real content gap, not just a visual polish item — a
  4th step (`체크리스트 확인` / "Check the results") needs a dictionary entry and a 4th `steps`
  array item, and the grid needs to go from `sm:grid-cols-3` to `sm:grid-cols-4` (or the new
  mobile row layout per above).
- **Conflict (content) — FAQ count**: design shows **6** FAQ items; current `FAQSection.tsx` +
  dictionary only define **5** (`faq1`..`faq5`). A 6th FAQ (the "AEO·GEO를 위해 어떤 문서가
  필요한가요?" question) is missing from the implementation.
- No design-system anti-pattern violations found on this screen (no gradients, no
  emoji-as-icon, no rounded corners, dot-grid decoration is a pure geometric SVG-equivalent
  pattern not an icon/emoji).

**Reference**: `docs/design/intake/zine-index/reference/Main-Zine.png`,
`docs/design/intake/zine-index/reference/Main-Mobile.png`

---

### 3.2 RequestScanProcess → `src/app/[lang]/request-scan/page.tsx` (success path) → `ProcessScreen.tsx` / `ProcessStep.tsx`

**Desktop (`RequestScanProcessZine.dc.html`, 1200×950):**
1. Header (80px, no nav link, just logo + 32px avatar).
2. Centered column: URL chip (hard-bordered pill showing the scanned URL + a green
   `생존 확인 완료` filled status pill).
3. Headline `체크리스트 항목을 수집하고 있어요` + subtext `사이트를 분석하는 동안 잠시만
   기다려주세요`.
4. **4-column** hardline step grid (max-width 920px): `robots.txt` (done, green check) /
   `sitemap.xml` (done, green check) / `페이지 크롤링 + AI 신호` (active, orange dotted `···`
   glyph, card tinted `#FFF9F0`) / `Lighthouse` (idle, gray dash `–`, `opacity:.45`).
5. Progress bar (8px tall, `#E4DECB` track, orange `#FF4B1F` fill, 55% in the mock).
6. Caption: `각 스텝은 실제 API 완료 시점에 반응합니다`.
7. Footer, same row layout as Main.

**Mobile (`RequestScanProcessMobile.dc.html`, 390×720) — deltas:**
- Header 64px/26px avatar as elsewhere.
- The 4-column grid becomes a **single-column stack of 4 rows**; each row is horizontal
  (24px glyph box left, label `flex:1` center, status text right) — i.e. this screen's rows were
  already horizontal-icon+label+status even on desktop (unlike Main's step tiles), so the mobile
  change here is purely "4 columns → 4 stacked rows", no internal layout reshuffle needed.
- Progress bar and caption otherwise unchanged in structure, just full 390px width.

**Exact copy:**
- URL chip status pill: `생존 확인 완료`
- Headline: `체크리스트 항목을 수집하고 있어요`
- Subtext (desktop): `사이트를 분석하는 동안 잠시만 기다려주세요`; (mobile, shortened):
  `잠시만 기다려주세요`
- Step labels: `robots.txt` / `sitemap.xml` / `페이지 크롤링 + AI 신호` / `Lighthouse`
- Step statuses: `완료` (×2) / `진행 중` / `대기`
- Caption — **leaked design note, see §5.5**: the wireframe's literal string `각 스텝은 실제 API 완료 시점에 반응합니다` describes the UI's internal wiring (reacts to real API completion), not something a visitor needs to know, and is already shipped verbatim in `ProcessScreen.tsx` (hardcoded ko/en ternary, not a dictionary key). Corrected copy to use instead: KO `각 단계는 실제 진행 상황에 맞춰 순서대로 표시됩니다` / EN `Each step updates as it actually completes.`

**Tokens**: green `#3E7D4F` = `--success` (matches "done" glyph fill), orange `#FF4B1F` =
`--accent` (matches "active" glyph border/text and progress fill — **not** a status color, this
is brand accent used for "in progress," which is consistent with design-system.md's rule that
accent ≠ status semantics since "in progress" isn't one of pass/warning/fail/info), gray
`#8A8577` = `--muted-foreground` (idle state).

**Conflicts/gaps:**
- **Leaked design note (see §5.5)** — the caption copy extracted from the wireframe is wireframe-author commentary, not product copy; already shipped verbatim in `ProcessScreen.tsx`. Needs the corrected copy above applied.
- **Conflict — step count/composition**: the wireframe's grid has exactly **4** tiles, one per
  real scan API (`robots.txt`/`sitemap.xml`/crawling+AI/`lighthouse`), with the "site is
  reachable" ping check shown *only* as the header chip above the grid, not duplicated inside it.
  Current `ProcessScreen.tsx` defines **5** `stepIds` (`["ping", "ai", "meta", "analysis",
  "gen"]`) and renders **5** grid tiles (`grid-cols-2 sm:grid-cols-5`) — it re-shows the ping
  result as a redundant first grid tile in addition to the header chip. This is a real content/
  layout conflict: the design intentionally doesn't repeat the ping status inside the grid.
  Flagging for a decision — either the grid should drop back to 4 items (matching design) or this
  is an intentional product change from the design that the design intake doesn't get to
  override; needs to be resolved as a decision before wiring up mobile layout for this screen,
  since a 4-step vs 5-step grid changes the intended `grid-cols` breakpoints throughout.
- `ProcessStep.tsx`'s glyph choices (`✓` / `···` / `–`) already match the wireframe's glyphs
  exactly — no icon-library/emoji violation, correctly follows design-system.md §7.

**Reference**: `docs/design/intake/zine-index/reference/RequestScanProcess-Zine.png`,
`docs/design/intake/zine-index/reference/RequestScanProcess-Mobile.png`

---

### 3.3 RequestScanError → `src/app/[lang]/request-scan/page.tsx` (ping-failure path) → `ErrorScreen.tsx`

**Desktop (`RequestScanErrorZine.dc.html`, 1200×750):** Header, then a vertically+horizontally
centered block: 64px square outlined icon box with `!`, headline `사이트에 접속할 수 없습니다`,
subtext `URL을 다시 확인하거나 잠시 후 다시 시도해주세요`, then two buttons **side by side**:
filled `다시 시도` first, outline `홈으로` second. Footer as elsewhere.

**Mobile (`RequestScanErrorMobile.dc.html`, 390×700) — deltas:** icon box shrinks to 56px, text
sizes step down (headline 21px vs 26px), buttons switch from a side-by-side row to a **stacked
full-width column** (`flex-direction:column;gap:10px;width:100%`), same order (retry first, home
second). Outer container gets `padding:24px` around the centered block (desktop has no extra
padding beyond the centering itself).

**Exact copy:**
- Icon: `!`
- Headline: `사이트에 접속할 수 없습니다`
- Subtext: `URL을 다시 확인하거나 잠시 후 다시 시도해주세요`
- Buttons: `다시 시도` (filled, first) / `홈으로` (outline, second)

**Tokens**: all neutral ink/paper tokens, no status colors used on this screen (a generic network
error, not a robots.txt block — correctly *not* using the destructive/fail red, which matches
design-system.md's distinction that fail-red is reserved for checklist judgement fail states, and
`RequestScanBlocked`'s robots.txt-block screen below *does* use it).

**Conflicts:**
- **Conflict — button order (see §2.4)**: current `ErrorScreen.tsx` renders outline `홈으로`
  first, filled `다시 시도` second — reversed from the design.
- **Gap — no mobile stacking**: `ErrorScreen.tsx`'s button row (`flex items-center
  justify-center gap-3`) has no responsive variant to stack full-width at mobile widths.
- **Gap — no side padding at narrow widths**: `ErrorScreen.tsx` isn't wrapped in `content-frame`
  or any padded container, so at narrow viewports it currently runs edge-to-edge with no gutter,
  unlike the mobile artboard's explicit 24px padding.

**Reference**: `docs/design/intake/zine-index/reference/RequestScanError-Zine.png`,
`docs/design/intake/zine-index/reference/RequestScanError-Mobile.png`

---

### 3.4 RequestScanBlocked → `src/templates/request-scan/BlockedScreen.tsx` (standalone, **not wired into the live flow**)

**Desktop (`RequestScanBlockedZine.dc.html`, 1200×820):** Header, then centered block: 64px
square icon box outlined in **destructive red** `#C81E3A` with an `X` glyph, headline `이 사이트는
검사할 수 없습니다`, description paragraph, a hard-bordered white chip showing `대상 URL:
https://example.com — robots.txt Disallow: /`, a single filled CTA `다른 URL 시도`, and a small
caption `경고 후 계속 진행 옵션 없음 — 하드 차단, 비용 절감 목적`. Footer as elsewhere.

**Mobile (`RequestScanBlockedMobile.dc.html`, 390×760) — deltas:** icon box 56px, description
text shortened (drops the "사이트 소유자의 의사를 존중해" clause), target-URL chip becomes
**centered text, no "대상 URL:" label prefix** (just `robots.txt Disallow: /`), CTA button becomes
**full-width**, caption shortened (drops "하드 차단, 비용 절감 목적" clause).

**Exact copy:**
- Icon: `X`
- Headline: `이 사이트는 검사할 수 없습니다`
- Description (desktop): `robots.txt가 이 사이트의 스캔을 차단하고 있어요. 사이트 소유자의
  의사를 존중해 나머지 검사(크롤링·Lighthouse)는 실행하지 않았습니다.`
- Description (mobile, shortened): `robots.txt가 이 사이트의 스캔을 차단하고 있어요. 나머지
  검사(크롤링·Lighthouse)는 실행하지 않았습니다.`
- URL chip (desktop): `대상 URL: https://example.com — robots.txt Disallow: /`
- URL chip (mobile): `robots.txt Disallow: /`
- CTA: `다른 URL 시도`
- Caption — **leaked design note, see §5.4**: both the desktop string `경고 후 계속 진행 옵션 없음 — 하드 차단, 비용 절감 목적` and the mobile-shortened `경고 후 계속 진행 옵션 없음` are wireframe-author rationale (the cost-control reasoning behind ADR-006's hard block is an internal product decision, not the visitor's business), already shipped verbatim as `BlockedScreen.tsx`'s `copy.note`/`copy.noteMobile` (ko **and** en). See §5.4 for the proposed rewrite (recommendation: drop the caption, since the description above it already states the scan didn't run and the CTA already offers the only next step).

**Tokens**: `#C81E3A` = `--destructive` — correctly the checklist-fail color, and correctly
distinct from `--accent` orange (design-system.md §7 explicitly forbids reusing brand orange for
a fail state; this screen already gets that right in both the design and the existing
`BlockedScreen.tsx` implementation, which uses `border-destructive`/`text-destructive`).

**Leaked design note already shipped (see §5.4)**: `BlockedScreen.tsx`'s `copy.note`/`copy.noteMobile` (both `ko` and `en` branches) ship the wireframe's literal rationale text verbatim, not user-facing copy — needs the §5.4 rewrite applied.

**Verification vs. existing `BlockedScreen.tsx`**: copy, icon, chip, and single-CTA structure all
match the desktop Zine design closely (component already correctly implements the desktop
version per its own code comment). Gaps only appear at mobile: current implementation isn't
responsive (CTA uses fixed `px-8` padding, not full-width; no responsive stacking needed since
this screen was already single-column, but the URL chip's "대상 URL:" label vs. mobile's
label-less centered text is unaddressed) and copy is only wired for the desktop-length strings
(no shortened mobile copy variant exists in `BlockedScreen.tsx`'s inline `copy` object).

**Open decision point (explicitly not decided here, per task instructions)**: `BlockedScreen.tsx`
exists and is styled correctly for desktop, but **nothing calls it** — ADR-006's robots.txt
pre-check gating logic (call `scanRobotsTxtApi` first, branch before firing the other 3 calls)
isn't implemented in `ProcessScreen.tsx` yet. This intake pass does not decide whether wiring that
gating logic into the live flow is now in scope for the next publish-front pass, or whether this
pass should only verify `BlockedScreen.tsx` as a correctly-styled standalone component (already
true) and defer the actual wiring to later. **Needs a decision from the user before publish-front
proceeds on this screen.**

**Reference**: `docs/design/intake/zine-index/reference/RequestScanBlocked-Zine.png`,
`docs/design/intake/zine-index/reference/RequestScanBlocked-Mobile.png`

---

### 3.5 Scan → `src/app/[lang]/scan/page.tsx`

**Desktop (`ScanZine.dc.html`, 1200×1500)** — top to bottom:
1. Header.
2. URL + timestamp row: `example.com` (bold) + `분석 시각 2026-08-18 14:32` (muted), same
   baseline, inline.
3. **AI Signals card** (hardline-bordered, white bg, padding 28/32): eyebrow `핵심 차별화 영역
   — Lighthouse가 안 보는 것`, headline `AI SIGNALS`, right-aligned hint `없어도 감점 아님 —
   info 톤`; 5 rows: `prompts.txt` (info/없음), `PromptObject` (info/없음), `FAQ 섹션`
   (pass/발견됨), `구조화 데이터 WebPage, FAQPage` (pass), `JS 렌더링 의존도` (pass/12%).
4. `지금 고쳐야 할 것` section: 3-row hardline list, tinted rows (`#FFF1EC` for fail rows,
   `#FFFAEE` for warn rows) each with a status badge + one-line description.
5. **4-column** grid of grouped checklist cards (`기본 SEO`, `Indexing`, `Content Stats`,
   `국제화·UX`), each its own hardline-bordered card with label/status or label/value rows.
6. Previews card (`Previews — OG · Twitter`): a row of 4 label+badge pills
   (`OG 필수 태그`/`Twitter Card`/`og:image 크기`/`favicon`), then **2 side-by-side** mock
   preview cards (a Google-result-style card with eyebrow above title, and a Twitter-card-style
   card with eyebrow below title) — each with a placeholder gray image block.
7. `border-top:4px` section break → Lighthouse block: **4-column** score tile grid
   (Performance 88 / SEO 92 / Accessibility 76 / Best Practices 93, each a large numeral +
   label), then a `Lighthouse 개선 제안` card with hint text `Hero(위, 자체 판정)와 출처가 다름 —
   lhr.audits 기반` and 3 rows of `label` + right-aligned `source` (the literal English Lighthouse
   audit id/name).
8. Footer.

**Mobile (`ScanMobile.dc.html`, 390×2100) — deltas:**
- URL/timestamp: switches from an inline baseline row to **two stacked block-level lines**
  (title, then timestamp below with `margin-top:2px`), not a flex row that happens to wrap.
- AI Signals card: same 5 rows, smaller paddings/fonts, eyebrow text wraps
  (`Lighthouse가 안 보는 것`, shortened from desktop's "핵심 차별화 영역 — Lighthouse가 안 보는
  것" — drops the "핵심 차별화 영역 —" prefix), no right-aligned hint text at all (dropped
  entirely, not just repositioned).
- Fix-now list: same 3 rows, smaller.
- Checklist groups: **single-column stack** of all 4 cards, same order, same content.
- Previews: pill row becomes **2×2 grid** (`grid-template-columns:repeat(2,...)` vs desktop's
  4-across); and critically, the **2 side-by-side preview cards collapse to just ONE preview
  card** on mobile — not both cards stacked, the second (Twitter-style) card is dropped entirely,
  leaving a single generic preview block with just eyebrow+title (no description line).
- Lighthouse scores: **2×2 grid** (vs desktop 4-across) — tile content otherwise unchanged.
- Lighthouse suggestions: each row **drops the right-aligned `source` text entirely** — mobile
  rows show only the `label`, no English audit-id column.

**Exact copy:**
- URL/time label: `example.com` / `분석 시각 2026-08-18 14:32`
- AI Signals eyebrow — **leaked design note, see §5.1**: wireframe copy is `핵심 차별화 영역 — Lighthouse가 안 보는 것` (desktop) / `Lighthouse가 안 보는 것` (mobile, shortened). Shipped verbatim (desktop-length string only, used at all breakpoints, no responsive split) as `scan.aiSignalsEyebrow` in both `ko.json`/`en.json`. Corrected copy: see §5.1.
- AI Signals headline: `AI SIGNALS`
- AI Signals hint (desktop only) — **leaked design note, see §5.2**: wireframe copy is `없어도 감점 아님 — info 톤`, shipped verbatim as `scan.aiSignalsHint` (ko/en). Corrected copy: see §5.2.
- AI Signals rows: `prompts.txt` / `PromptObject` / `FAQ 섹션` / `구조화 데이터` (desktop shows
  detail suffix `WebPage, FAQPage`, mobile drops it) / `JS 렌더링 의존도`
- Fix-now headline: `지금 고쳐야 할 것`
- Fix-now rows (desktop): `meta robots에 noindex가 설정돼 있어 색인되지 않습니다` /
  `canonical 태그가 2개 이상 발견됐습니다` / `og:image 크기 메타가 없습니다`; (mobile,
  shortened): `noindex 설정으로 색인되지 않습니다` / `canonical 태그 2개 이상 발견` /
  `og:image 크기 메타 없음`
- Group titles: `기본 SEO`, `Indexing`, `Content Stats`, `국제화·UX`
- 기본 SEO rows: `title` / `description` / `keywords 태그` (mobile: `keywords`) / `이미지 alt
  누락` (mobile: `이미지 alt`) / `중복 meta`
- Indexing rows (desktop, 5): `sitemap.xml 존재` / `robots.txt에 sitemap` / `canonical 존재` /
  `canonical 다중` / `noindex`; (mobile, 4 — **drops `robots.txt에 sitemap` entirely**):
  `sitemap.xml` / `canonical 존재` / `canonical 다중` / `noindex`
- Content Stats rows: `본문 단어 수` (mobile: `단어 수`) `1,340` / `헤딩 구조` `H1:1 H2:6 H3:12`
  / `TL;DR`
- 국제화·UX rows: `hreflang` / `viewport`
- Previews headline: `Previews — OG · Twitter`
- Preview pills: `OG 필수 태그` (mobile: `OG`) / `Twitter Card` (mobile: `Twitter`) /
  `og:image 크기` / `favicon`
- Preview card 1 copy: `example.com` / `meta-scan — 무료 SEO/AEO 체크리스트` /
  `URL 하나로 항목별로 점검하세요` (mobile's single remaining card uses `meta-scan — 무료
  SEO/AEO/GEO 체크리스트` — note the mobile copy adds "GEO" that desktop's card 1 doesn't have,
  and drops the description line)
- Lighthouse headline: `Lighthouse 점수`
- Lighthouse labels: `Performance` `88`, `SEO` `92`, `Accessibility` `76`, `Best Practices` `93`
- Suggestions headline: `Lighthouse 개선 제안`
- Suggestions hint — **leaked design note, see §5.3**: wireframe copy is `Hero(위, 자체 판정)와 출처가 다름 — lhr.audits 기반` (desktop) / `lhr.audits 기반, Hero와 출처 다름` (mobile, reordered/shortened) — both reference an internal component name ("Hero") and a Lighthouse API field name (`lhr.audits`) no visitor would recognize. Shipped verbatim (desktop-length string only, no responsive split) as `scan.lighthouseSuggestionsHint` in both `ko.json`/`en.json`. Corrected copy: see §5.3.
- Suggestions rows: `이미지 크기 최적화` / `Properly size images` · `렌더링 차단 리소스 제거` /
  `Eliminate render-blocking` · `차세대 이미지 포맷` / `Next-gen formats` (mobile drops the
  right-hand English source string on all 3 rows)

**Tokens**: `.b-pass`→`--success`/`--success-foreground`, `.b-warn`→`--warning`/
`--warning-foreground`, `.b-fail`→`--destructive`/`--destructive-foreground`, `.b-info`→
`--info`/`--info-border` (outline only) — all match `StatusBadge`'s existing `cva` variants
exactly, including the "info is outline, the other three are equal-weight fills" rule from
design-system.md §2/§8. Fail/warn tint rows `#FFF1EC`/`#FFFAEE` match `--fail-tint`/
`--warning-tint` exactly (already documented in `globals.css` as sourced from this exact
wireframe).

**Conflicts/gaps:**
- **Leaked design notes already shipped (see §5.1–§5.3)** — `scan.aiSignalsEyebrow`, `scan.aiSignalsHint`, and `scan.lighthouseSuggestionsHint` (ko **and** en) all ship the wireframe author's own commentary about the design/product verbatim instead of user-facing copy. Highest-priority fix on this screen since it's live in production right now.
- **Gap — Indexing row count**: desktop shows 5 Indexing rows including `robots.txt에 sitemap`;
  mobile drops that row to 4. Current `scan/page.tsx` mock data only has one (desktop-shaped,
  5-row) `groups` array reused at all breakpoints — no mobile-specific row-dropping logic exists
  or is trivial to add without breakpoint-aware data, since this is static mock data today, not
  live checks. Needs a decision on whether this row-drop is worth replicating given it's minor
  content, or whether Scan's mobile groups should just reuse the same 5 rows as desktop (simpler,
  arguably fine since this data will come from a real API eventually and this specific 4-vs-5
  trim looks more like the mockup's own space-saving edit than a hard rule).
- **Conflict — Previews card count on mobile**: design intentionally shows only **1** preview
  card on mobile (not both OG and Twitter mocks stacked). Current code's `grid-cols-1
  sm:grid-cols-2` for `previewCards` would stack **both** cards vertically at mobile widths
  instead of showing just one — a real layout conflict to resolve before mobile styling ships.
- **Conflict — Lighthouse suggestions source text on mobile**: design drops the English
  `source` string entirely at mobile widths; current code always renders `s.source` with no
  responsive hide.
- No anti-pattern violations (no gradients/shadows/rounded corners/emoji-icons); the Lighthouse
  score block correctly keeps Google's raw 0-100 numbers per ADR-005's exception (this product's
  own checklist groups above it use pass/warning/fail/info, not scores — consistent with the
  scoring-engine-scrapped decision).

**Reference**: `docs/design/intake/zine-index/reference/Scan-Zine.png`,
`docs/design/intake/zine-index/reference/Scan-Mobile.png`

---

### 3.6 Privacy → `src/app/[lang]/privacy/page.tsx`

**Desktop (`PrivacyZine.dc.html`, 1200×950):** Header, then headline `개인정보처리방침` +
`최종 수정일: 2026-08-01`, then a numbered list (`01`–`06`, orange `Big Shoulders Display`
numerals, 42px column width) of sections, each a heading + several placeholder gray bars standing
in for body-copy lines (the design does not specify real body copy here — see note below).
Section headings in the design: `01 수집하는 개인정보 항목`, `02 개인정보 수집 및 이용 목적`,
`03 개인정보 보유 및 이용 기간`, `04 제3자 제공`, `05 이용자의 권리`, `06 문의처`. 1.5px
hairline rule between sections. Footer.

**Mobile (`PrivacyMobile.dc.html`, 390×720) — deltas:** number column shrinks to 30px width/20px
font (vs. desktop's 42px/26px), gaps/padding shrink throughout, section body switches from
3-line placeholder bars to 1–2 lines (design just has fewer filler bars, not meaningful content).

**Exact copy**: Title `개인정보처리방침`, date label `최종 수정일: 2026-08-01`, the 6 section
headings above. **No body copy is specified by the design** — every body line is a plain
`#E4DECB` gray bar (`<div class="line">`) at varying widths, standing in for lorem-style
placeholder text, not real copy.

**Tokens**: matches `NumberLabel` component's existing orange-numeral-with-fixed-width pattern
(`docs/design/design-system.md` §4's "번호 라벨" motif) — no new tokens.

**Verification vs. existing `privacy/page.tsx`**: the real implementation already ships full,
real Korean/English privacy copy (7 sections: 수집하는 정보 / 정보 보관 기간 / 제3자 제공 / 쿠키
/ 이용자의 권리 / 문의 / 정책 변경) rather than the wireframe's 6 generic section labels. **This
is not a conflict** — the wireframe never specified real copy to check against (just placeholder
bars), so the implementation's actual legal copy supersedes it. Flagging only as a **gap**: the
wireframe's 6 headings don't 1:1 match the shipped 7 headings, so if the intent was for the real
copy to literally follow this wireframe's section list, that alignment was never done — worth a
one-line confirmation from the user that the current real copy (not the wireframe's placeholder
headings) is what should stay canonical (my assumption: yes, since it's actual legal content and
the wireframe was clearly just structural scaffolding).
- **Minor gap**: `NumberLabel` in `privacy/page.tsx`/`terms/page.tsx` is rendered at a fixed
  `w-11 text-2xl` regardless of breakpoint; the design scales it down at mobile (30px/20px vs.
  42px/26px) — low-priority polish item.

**Reference**: `docs/design/intake/zine-index/reference/Privacy-Zine.png`,
`docs/design/intake/zine-index/reference/Privacy-Mobile.png`

---

### 3.7 Terms → `src/app/[lang]/terms/page.tsx`

Structurally identical pattern to Privacy (numbered sections, hairline rules, same mobile deltas
as §3.6). Design section headings: `01 목적`, `02 정의`, `03 서비스의 제공 및 변경`, `04 이용자의
의무`, `05 면책조항`, `06 문의처` — again just placeholder gray bars for body copy, no real copy
specified.

**Verification vs. existing `terms/page.tsx`**: real implementation ships 7 real sections (서비스
소개 / 허용되는 이용 / 면책 조항 / 서비스 변경 및 중단 / 책임의 제한 / 약관 변경 / 문의) — same
"not a conflict, wireframe was structural-only" situation as Privacy, same gap note about heading
count/wording not 1:1 matching (6 vs 7).

**Tokens/mobile deltas**: identical to §3.6.

**Reference**: `docs/design/intake/zine-index/reference/Terms-Zine.png`,
`docs/design/intake/zine-index/reference/Terms-Mobile.png`

---

### 3.8 NotFound → `src/app/[lang]/not-found.tsx`

**Desktop (`NotFoundZine.dc.html`, 1200×750):** No header/footer in the artboard itself (this is
just the centered content block — in the real app it still renders inside `RootLayout`'s
header/footer chrome). Centered column: giant `404` in orange (120px `Big Shoulders Display`
weight 900), headline `페이지를 찾을 수 없습니다`, subtext `요청하신 페이지가 존재하지 않거나
이동되었습니다`, single filled CTA `홈으로 돌아가기`.

**Mobile (`NotFoundMobile.dc.html`, 390×640) — deltas:** `404` shrinks to 76px, headline to 19px,
20px padding added around the centered block (desktop's artboard has no such padding, relying on
its own centering).

**Exact copy**: `404`, `페이지를 찾을 수 없습니다`, `요청하신 페이지가 존재하지 않거나
이동되었습니다`, `홈으로 돌아가기`.

**Tokens**: `#FF4B1F` accent for the `404` numeral — matches `text-accent` already used in
`not-found.tsx`.

**Verification vs. existing `not-found.tsx`**: copy matches exactly. One numeric discrepancy:
design specifies 120px for the `404` glyph; current code uses `text-[7rem]` (112px) — close but
not exact, low-priority. No mobile responsive sizing exists yet in `not-found.tsx` (fixed
`text-[7rem]` at all widths) — needs a step-down to roughly 76px (`text-[4.75rem]`) at mobile per
the Mobile artboard, plus the container isn't wrapped in any padded frame so it currently runs
edge-to-edge at narrow widths (same gap as ErrorScreen, §3.3).

**Reference**: `docs/design/intake/zine-index/reference/NotFound-Zine.png`,
`docs/design/intake/zine-index/reference/NotFound-Mobile.png`

---

### 3.9 ErrorBoundary → `src/app/[lang]/error.tsx`

**Desktop (`ErrorBoundaryZine.dc.html`, 1200×750):** Same centered-column pattern as
RequestScanError (§3.3): 64px outlined icon box with `!`, headline `문제가 발생했습니다`, subtext
`일시적인 오류일 수 있습니다. 다시 시도해주세요`, two buttons side by side — filled `다시 시도`
first, outline `홈으로` second.

**Mobile (`ErrorBoundaryMobile.dc.html`, 390×640) — deltas:** icon box 56px, headline 19px,
buttons stack to a full-width column (same button order preserved: retry first, home second),
20px padding around the centered block.

**Exact copy**: `!`, `문제가 발생했습니다`, `일시적인 오류일 수 있습니다. 다시 시도해주세요`,
`다시 시도` / `홈으로`.

**Tokens**: neutral ink/paper only, matches existing `error.tsx` implementation's token usage.

**Conflicts**: identical button-order conflict to §3.3/§2.4 — `error.tsx` currently renders
outline `홈으로` (home) first, filled `다시 시도` (retry) second, reversed from the design. Same
missing mobile full-width stacking and missing side-padding-at-narrow-widths gaps as
`ErrorScreen.tsx`.

**Reference**: `docs/design/intake/zine-index/reference/ErrorBoundary-Zine.png`,
`docs/design/intake/zine-index/reference/ErrorBoundary-Mobile.png`

---

## 4. Summary of open decision points (for the user, before publish-front runs)

1. **RequestScanBlocked wiring** (§3.4): is wiring ADR-006's robots.txt gating logic into the live
   `/request-scan` flow now in scope for the next pass, or does this pass stop at "verify
   `BlockedScreen.tsx` is correctly styled" (already true) and defer the actual `model/`-layer
   gating logic to a separate feature pass?
2. **RequestScanProcess step count** (§3.2): design's grid has 4 tiles (ping shown only in the
   header chip); current code renders 5 tiles (ping duplicated into the grid). Confirm whether to
   match the design's 4-tile grid or keep the current 5-tile behavior as an intentional deviation.
3. **Main screen content gaps** (§3.1): confirm adding the 4th process step and 6th FAQ item (both
   currently missing from the dictionaries) is in scope for this pass, since dictionary content
   changes touch both `en.json`/`ko.json`, not just component styling.
4. **Scan screen mobile data shape** (§3.5): confirm whether the Indexing group's mobile row-count
   trim (5→4, dropping `robots.txt에 sitemap`) and the Lighthouse-suggestions source-text drop are
   worth replicating in the mock data / eventual API-driven render, or are acceptable to leave
   unified across breakpoints given this is mock data that will be replaced by live API results
   later anyway.
5. **Legal pages copy provenance** (§3.6/§3.7): confirm the already-shipped real Privacy/Terms
   copy (7 sections each) is intended to stay canonical over the wireframe's 6 generic
   placeholder-only section headings (assumed yes, flagged for explicit confirmation only because
   the section counts/headings don't 1:1 match).
6. **Leaked design-note rewrites** (§5): confirm the proposed KO/EN rewrites in §5 before they're
   applied — in particular whether §5.4's cost-control rationale caption should be dropped
   entirely (recommended) or kept in a reworded, visitor-appropriate form, and whether §5.1's
   AI Signals eyebrow should keep the single desktop-length string at all breakpoints (as shipped
   today) or gain a genuinely shorter mobile variant like the wireframe has.

---

## 5. Leaked design-note corrections

**What happened**: the Claude Design canvas artboards annotate several UI elements with the wireframe author's own commentary/rationale about the design or its implementation — written in the same visual style (small, muted-gray, `#8A8577`) as legitimate hint/caption copy elsewhere on the same screens, with no visual distinction marking it as "author's note" rather than "text to ship." A prior intake pass extracted this text as literal UI copy instead of recognizing it as meta-commentary, and it has since been implemented into `dictionaries/en.json` + `ko.json` and two components. This section is a full retroactive audit of **every** copy string across all 9 screens/18 artboards (re-reading the raw `.dc.html` sources directly, not just this spec's prior transcription) against the test: *"would this sentence make sense to someone who has never seen the design file or the codebase?"* Five instances failed that test, all on 3 screens (RequestScanProcess, RequestScanBlocked, Scan) — no other screen (Main, RequestScanError, Privacy, Terms, NotFound, ErrorBoundary) had any.

Search method: grepped every in-scope `.dc.html` for the em dash (`—`), which turned out to be the wireframe author's consistent formatting convention for appending a parenthetical note after the "real" copy (`<real copy> — <note>`), then cross-checked every muted-gray (`#8A8577`) hint/caption span across all 18 files by hand (dumped and read every one — see table below) to make sure nothing without an em dash was missed. Also grepped the live `meta-scan-front` source (`app/`, `templates/`, `dictionaries/`) for the same markers to confirm which instances are already shipped vs. only present in this spec's prior draft.

### 5.1 `scan.aiSignalsEyebrow` (ko.json + en.json) — shipped
- **Shipped now**: KO `"핵심 차별화 영역 — Lighthouse가 안 보는 것"`, EN `"The gap Lighthouse doesn't cover"`. Rendered unconditionally (no responsive split) in `app/[lang]/scan/page.tsx` as the AI Signals card's eyebrow label.
- **Why it's a design note**: `핵심 차별화 영역` ("core differentiation area") is internal product-positioning language — the kind of phrase a designer writes on a wireframe to explain *to the team* why this card exists, not something you'd say to a site owner running a scan. The design's own mobile-shortened variant (`Lighthouse가 안 보는 것`, dropping the differentiation-area prefix) independently arrives at something much closer to acceptable copy, which is itself a signal that the dropped prefix was the note part, not the message.
- **Proposed rewrite** (single string, no breakpoint split needed):
  - KO: `Lighthouse가 다루지 않는 항목`
  - EN: `What Lighthouse doesn't check`

### 5.2 `scan.aiSignalsHint` (ko.json + en.json) — shipped
- **Shipped now**: KO `"없어도 감점 아님 — info 톤"`, EN `"Absence isn't a deduction — shown as info"`. Rendered only at `sm:` and up (`hidden ... sm:block`), matching the design's mobile-drop.
- **Why it's a design note**: `info 톤` ("info tone") names an internal design-token/badge-variant concept (the `b-info` / `StatusBadge` "info" variant) rather than describing the idea in plain language a visitor would understand.
- **Proposed rewrite** — say plainly what "info tone" implies (optional signal, not scored against you):
  - KO: `없어도 감점되지 않는 참고 정보예요`
  - EN: `Missing items aren't penalized — just shown for reference`

### 5.3 `scan.lighthouseSuggestionsHint` (ko.json + en.json) — shipped
- **Shipped now**: KO `"Hero(위, 자체 판정)와 출처가 다름 — lhr.audits 기반"`, EN `"Different source from the verdicts above — based on lhr.audits"`. Rendered unconditionally under the "Lighthouse 개선 제안" / "Lighthouse suggestions" heading.
- **Why it's a design note**: `Hero(위, 자체 판정)` names an internal component (`HeroSection`, which doesn't even render on this screen — this is leftover cross-screen wireframe shorthand) and `lhr.audits` is the literal property name Lighthouse's own report JSON uses internally (`LighthouseResult.audits`) — neither means anything to a visitor.
- **Proposed rewrite** — say plainly what "lhr.audits 기반" implies (these suggestions come straight from Lighthouse, not from meta-scan's own judgement):
  - KO: `Lighthouse 리포트에서 그대로 가져온 제안입니다`
  - EN: `Pulled directly from your Lighthouse report`

### 5.4 `BlockedScreen.tsx`'s `copy.note` / `copy.noteMobile` (ko + en) — shipped
- **Shipped now**: KO note `"경고 후 계속 진행 옵션 없음 — 하드 차단, 비용 절감 목적"` / noteMobile `"경고 후 계속 진행 옵션 없음"`; EN note `"No override option after the warning — this is a hard block to control cost."` / noteMobile `"No override option after the warning."` Hardcoded inline in `BlockedScreen.tsx`'s `copy` object (not a dictionary key).
- **Why it's a design note**: `하드 차단, 비용 절감 목적` ("hard block, for the purpose of cost savings") states ADR-006's *business rationale* for why the gating logic exists at all — that meta-scan skips the other 3 paid-compute scans to avoid wasting Lighthouse/Puppeteer runs on a site that already said no. That's an internal cost-engineering decision, not something the visitor needs or wants to know when they hit a block screen.
- **Proposed rewrite**: the cost-control rationale isn't the visitor's business in any form — recommend **dropping the caption entirely**. The description text above it (`robots.txt가 이 사이트의 스캔을 차단하고 있어요...`) already explains *why* the scan didn't run, and the single CTA (`다른 URL 시도` / `Try another URL`) already implies there's no "continue anyway" path — the caption adds no information the visitor doesn't already have. If a caption is still wanted (e.g. to explicitly reassure the visitor there's no hidden bypass they're missing), a minimal honest version would be:
  - KO: `이 차단은 예외 없이 적용됩니다`
  - EN: `This block applies with no exceptions`

  ...but dropping it outright is the cleaner fix given it doesn't survive the "say anything new" test either way — **flagging both options for the user to pick, per task instructions.**

### 5.5 `ProcessScreen.tsx`'s inline caption (ko + en) — shipped
- **Shipped now**: KO `"각 스텝은 실제 API 완료 시점에 반응합니다"`, EN `"Each step reacts to the real API's completion."` Hardcoded `lang === "ko" ? ... : ...` ternary at the bottom of `ProcessScreen.tsx` (not a dictionary key).
- **Why it's a design note**: this literally restates ADR-003's design goal for this screen as documented in the repo's own root `CLAUDE.md` ("`ProcessScreen`의 단계별 진행 UI가 각 API의 실제 완료 시점에 반응하게 하려는 목적") — it's a note the wireframe author left for whoever implements this screen ("build this so it reacts to real completion, not a fake timer"), not something a visitor scanning their site needs explained to them in those terms. A visitor doesn't know or care what "the real API's completion" means; at most they care that the progress shown is honest/real rather than fake.
- **Proposed rewrite**: reword to say the same reassurance (this isn't a fake progress animation) in plain terms, or consider dropping it as low-value given the step grid + progress bar already visually communicate real progress without needing a caption to say so:
  - KO: `각 단계는 실제 진행 상황에 맞춰 순서대로 표시됩니다`
  - EN: `Each step updates as it actually completes`

### Summary table

| # | Screen | Where (shipped) | Extracted-as-copy string (KO) | Reads as |
|---|---|---|---|---|
| 5.1 | Scan | `dictionaries/{ko,en}.json` → `scan.aiSignalsEyebrow` | `핵심 차별화 영역 — Lighthouse가 안 보는 것` | Internal positioning language |
| 5.2 | Scan | `dictionaries/{ko,en}.json` → `scan.aiSignalsHint` | `없어도 감점 아님 — info 톤` | Names an internal badge-variant token |
| 5.3 | Scan | `dictionaries/{ko,en}.json` → `scan.lighthouseSuggestionsHint` | `Hero(위, 자체 판정)와 출처가 다름 — lhr.audits 기반` | Names an internal component + a Lighthouse API field |
| 5.4 | RequestScanBlocked | `BlockedScreen.tsx` `copy.note`/`copy.noteMobile` (ko+en) | `경고 후 계속 진행 옵션 없음 — 하드 차단, 비용 절감 목적` | States an internal cost-engineering rationale (ADR-006) |
| 5.5 | RequestScanProcess | `ProcessScreen.tsx` inline ternary (ko+en, not a dictionary key) | `각 스텝은 실제 API 완료 시점에 반응합니다` | Restates the screen's own implementation goal (ADR-003) |

**Not flagged, reviewed and judged acceptable**: `main.faq4A`'s answer text ("둘 다 없어도 감점되지 않는 info 등급 신호입니다...") uses similar "info-grade" language but does so inside a full, self-contained FAQ answer sentence explaining the concept to the reader from scratch — that's what turning a design note into real copy is supposed to look like, not another instance of the bug (also: the wireframe's FAQ Q4 was shown collapsed with no visible answer text to have leaked from in the first place, so this paragraph was authored fresh, not extracted).
