# meta-scan

URL 하나만 넣으면 메타 태그, `robots.txt`, `sitemap.xml`, Lighthouse(성능·SEO·접근성·모범사례) 스캔
결과를 보여주고, 여기서 한 걸음 더 나아가 **Lighthouse가 다루지 않는 "AI 시대의 발견 가능성"**
(구조화 데이터, `prompts.txt` 같은 AI 신호, 인용 친화성/GEO, AEO 준비도 등)까지 항목별로 점검해주는
사이트 진단 도구입니다.

## 왜 만들었나

Google Lighthouse는 성능·접근성·SEO를 잘 봐주지만, 요즘 사이트가 실제로 궁금한 건 그것만이
아닙니다 — ChatGPT/Perplexity 같은 AI 검색·에이전트가 내 사이트를 얼마나 잘 이해하고 인용할 수
있는지, `prompts.txt`나 구조화 데이터 같은 신호를 갖추고 있는지는 Lighthouse 점수에 안 잡힙니다.
meta-scan은 이 빈틈을 채우는 **수동적 진단 체크리스트**입니다.

## 만드는 방식 — Claude Code와 함께, 하네스 엔지니어링

이 프로젝트는 기능 개발 자체뿐 아니라, **Claude Code로 개발하는 방법 자체를 실험하는 프로젝트**이기도
합니다. 매번 "이렇게 해줘"라고 지시하는 대신, 결정이 필요한 지점마다 사용자와 순차 인터뷰
(`AskUserQuestion`)를 거쳐 근거를 남기고, 그 결과를 [ADR](docs/adr/index.html)과 케이스 스터디
문서(`docs/case-study/`)로 기록하는 방식으로 진행 중입니다 — 나중에 "왜 이렇게 만들었더라"를
git blame 없이도 코드 밖 문서에서 바로 찾을 수 있게 하는 게 목적입니다.

최근에는 GitHub Issues 기반으로 **인터뷰 → TDD 개발 → 테스트**를 순차 처리하는 에이전트 파이프라인도
설계 중입니다(`docs/harness/`). 그리고 이 과정 자체가 기술 효율만이 아니라 **학습**을 겸하고
있어서(예: 프론트/백엔드에 일부러 다른 테스트 러너를 도입하는 등), 항상 "가장 효율적인 선택"만
하지는 않는다는 점도 이 저장소의 특징입니다 — 이유는 늘 ADR/케이스 스터디에 남아있습니다.

## 지금 상태

아직 완성된 제품이 아니라 **진행 중인 프로젝트**입니다. 개별 스캔 API(ping/robots.txt/sitemap/
crawling/Lighthouse)는 각각 정상 동작하고, 결과 화면(`/scan`) UI도 이미 그려져 있지만, 아직
그 화면이 실제 스캔 결과가 아니라 목업 데이터를 보여주는 상태입니다 — 지금은 그 파이프를 실제로
연결하고, AI 신호/AEO 체크 항목을 백엔드에 채워 넣는 작업을 진행 중입니다. 자세한 현황은
[`docs/prd/index.html`](docs/prd/index.html)의 "지금 뭐가 있고 뭐가 없나" 표를 참고하세요.

## 기술 스택

| | |
|---|---|
| **프론트엔드** | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind |
| **백엔드** | Express · TypeScript · Puppeteer(크롤링) · Lighthouse + chrome-launcher(감사) |
| **아키텍처** | 프론트 — Atomic Design 5계층 + api/services/hooks, 백엔드 — Hexagonal(Ports & Adapters) 3계층 |
| **모노레포** | pnpm workspaces, 두 패키지를 `git subtree`로 합쳐 각자 커밋 히스토리 보존 |
| **배포(예정/구성)** | 프론트 — Vercel, 백엔드 — GCP Cloud Run(Docker) |

## 저장소 구조

```
packages/
  meta-scan-api/     Express + TypeScript 백엔드 — URL 크롤링/스캔, robots.txt·sitemap 파싱,
                      헤드리스 Chrome으로 Lighthouse 감사
  meta-scan-front/    Next.js 15 프론트엔드 — API를 호출해 스캔 결과를 렌더링
docs/
  prd/                제품 기획/체크리스트 판정 규칙
  design/             UI/UX 디자인 시스템
  architecture/        기술 설계, 저장소 구조
  adr/                 설계 결정 기록(ADR)
  case-study/          결정에 이르기까지의 조사/비교 자료, 블로그 초안
  harness/             Claude Code 개발 하네스(에이전트/스킬) 설계 문서
```

각 패키지에는 별도 `CLAUDE.md`가 있고, 저장소 전체 컨벤션(커밋 규칙, Git 훅, 환경 변수 등)은 루트
[`CLAUDE.md`](CLAUDE.md)에 정리돼 있습니다.

## 시작하기

```bash
pnpm install                # 워크스페이스 전체 의존성 설치 (최초 1회)

pnpm dev:api                 # meta-scan-api 개발 서버 (:8080)
pnpm dev:front                # meta-scan-front 개발 서버 (:3000)
```

`meta-scan-front`를 로컬에서 실행하려면 `packages/meta-scan-front/.env.local`에
`NEXT_PUBLIC_META_SCAN_API=http://localhost:8080`이 필요합니다(gitignore 대상, 자동 생성 안 됨).

```bash
pnpm -r build                 # 전체 빌드
pnpm -r lint                  # 전체 lint
pnpm --filter meta-scan-api typecheck
```

더 자세한 명령어와 환경 변수는 [`CLAUDE.md`](CLAUDE.md)를 참고하세요.

## 더 읽어보기

- [`docs/index.html`](docs/index.html) — 문서 허브(기획/디자인/아키텍처/ADR 전체 링크)
- [`docs/prd/index.html`](docs/prd/index.html) — 제품 기획, 체크리스트 판정 규칙, 현재 구현 상태
- [`docs/adr/index.html`](docs/adr/index.html) — 왜 이렇게 만들었는지에 대한 결정 기록
