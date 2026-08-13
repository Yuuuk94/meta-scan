# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에게 제공하는 가이드입니다.

## 프로젝트 목적과 현재 상태

**제품 의도**: URL 하나를 입력받아 메타 태그/robots.txt/sitemap/Lighthouse(성능·SEO·접근성·모범사례)를
스캔해 결과를 보여주는 사이트 진단 서비스. 여기서 한 걸음 더 나아가 "Lighthouse가 다루지 않는 AI 시대의
발견 가능성"(구조화 데이터, `prompts.txt` 같은 AI 신호, 인용 친화성/GEO, AEO 준비도 등)까지 0–100점
스코어로 합산해 보여주는 **"Lighthouse+/AI Preparedness"** 제품으로 확장하는 중입니다. 기획 배경/스코어링
규칙/무엇이 이미 있고 무엇이 없는지는 `docs/meta-scan-plus-prd.md`에 정리되어 있습니다 — 스캔/스코어링
관련 작업을 시작하기 전에 먼저 읽으세요.

**현재 상태(중요, 착각하기 쉬운 지점)**: 백엔드의 개별 스캔 엔드포인트(`ping`/`robotsTxt`/`siteMap`/
`crawling`/`lighthouse run`)는 각각 정상 동작하지만, 이를 합산해 하나의 점수로 반환하는
`/api/v1/scan/analyze` 같은 통합 엔드포인트는 아직 없습니다. 프런트의 `/scan` 결과 페이지 UI(배지, AI
Signals 카드, Indexing 카드, 탭 등)는 이미 다 그려져 있지만, 그 화면이 렌더링하는 데이터는 서버 컴포넌트
안에서 `Math.random()`으로 만든 목업이고(`packages/meta-scan-front/src/app/[lang]/scan/page.tsx`),
직전 단계인 `ProcessScreen`은 4개 스캔 API를 병렬 호출하긴 하지만 응답 바디를 저장하지 않고
성공 여부(`status === "ok"`)만 확인한 뒤 버립니다. 즉 "새 UI를 만드는 일"이 아니라
**"이미 있는 UI/API 사이에 파이프를 연결하고, 그 사이에서 점수를 계산하는 로직을 채우는 일"**이 현재
남은 작업의 본질입니다.

## 저장소 구조

두 패키지를 `git subtree`로 합친 pnpm workspace 모노레포입니다 (각 패키지는 원본 커밋 히스토리를
그대로 보존하고 있습니다 — 방법/이유는 `docs/monorepo-dependency-management.md` 참고):

- `packages/meta-scan-api` — Express + TypeScript 백엔드. URL을 크롤링/스캔하고(메타 태그,
  robots.txt, sitemap) 헤드리스 Chrome으로 Lighthouse 감사를 실행합니다.
- `packages/meta-scan-front` — API를 호출해 스캔 결과를 렌더링하는 Next.js 15(App Router) 프론트엔드.

pnpm workspaces를 (Yarn Berry 대신) 선택한 이유와 마이그레이션 적용 과정은
`docs/monorepo-dependency-management.md`를 참고하세요.

## 명령어

별도 언급이 없으면 레포 루트에서 실행합니다. 패키지 매니저는 pnpm입니다 (루트 `package.json`에
`packageManager`로 고정).

```bash
pnpm install                              # 워크스페이스 전체 의존성 설치 (최초 1회)

pnpm dev:api                              # meta-scan-api dev 서버 (tsx watch, :8080)
pnpm dev:front                            # meta-scan-front dev 서버 (next dev, :3000)

pnpm -r build                             # 모든 패키지 빌드
pnpm --filter meta-scan-api build         # tsc + tsc-alias -> dist/
pnpm --filter meta-scan-front build       # next build

pnpm -r lint                              # 모든 패키지 lint
pnpm --filter meta-scan-front lint        # eslint (next/core-web-vitals, next/typescript)
pnpm --filter meta-scan-api typecheck     # tsc --noEmit
```

두 패키지 모두 테스트 스크립트가 없습니다 — 테스트 러너가 있다고 가정하지 마세요.

```bash
pnpm --filter meta-scan-api build:docker  # Docker 이미지 빌드 (컨텍스트 = 레포 루트,
                                           # 아래 "Docker 빌드" 참고)
```

네이티브/설치 스크립트가 있는 의존성(`puppeteer`, `esbuild`, `sharp` 등)은 루트 `package.json`의
`pnpm.onlyBuiltDependencies`에 명시적으로 허용 목록으로 올려져 있습니다 — pnpm은 기본적으로 install
script를 차단하므로, 새 네이티브 의존성을 추가할 때는 여기에도 등록해야 postinstall(예: puppeteer의
Chromium 다운로드)이 조용히 스킵되지 않습니다.

## Git 훅 & 커밋 컨벤션

`pnpm install` 시 루트 `package.json`의 `prepare` 스크립트가 `husky`를 실행해 `.husky/`의 훅을
활성화합니다 (별도 설정 불필요, 클론 후 `pnpm install`만 하면 적용됩니다).

- **pre-commit** — `lint-staged`가 스테이지된 파일만 골라 패키지별 ESLint를 `--fix`로 실행합니다
  (`pnpm --filter meta-scan-api exec eslint --fix` / `pnpm --filter meta-scan-front exec eslint
  --fix`, 대상 glob은 루트 `package.json`의 `lint-staged` 필드에 정의). 두 패키지가 공유하는
  ESLint 규칙은 `eslint.config.base.mjs`에 있고, 각 패키지 `eslint.config.js`/`.mjs`가 이를
  import해서 프레임워크별 규칙 위에 합성합니다.
- **commit-msg** — `commitlint`가 [Conventional Commits](https://www.conventionalcommits.org/)
  형식(`<type>(<scope>)?: <subject>`)을 강제합니다. 허용 `type`은
  `build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test`이며 규칙은
  `commitlint.config.mjs`(`@commitlint/config-conventional` 그대로 사용). `scope`는 필수는
  아니지만, 모노레포 특성상 어느 패키지를 건드렸는지 표시하고 싶으면 `feat(api): ...`,
  `fix(front): ...`처럼 패키지명을 scope로 쓰는 걸 권장합니다. 예: `chore: add commitlint`,
  `fix(api): handle empty robots.txt response`.

이 컨벤션은 이 훅이 도입된 시점(2026-08) 이후 커밋부터 적용됩니다 — 그 이전 히스토리는 형식이
자유롭습니다.

## 아키텍처

### meta-scan-api

`src/modules/*` 아래 기능별 모듈로 나뉜 레이어드 Express 앱. 각 모듈은
`*.router.ts`(라우트 연결) → `*Controller.ts`(`BaseController` 상속, 요청/응답만 담당) →
`*Service.ts`(비즈니스 로직) 구조입니다. 경로 별칭(`@core/*`, `@constant/*`, `@config/*`,
`@infra/*`, `@modules/*`)은 `tsconfig.json`에 정의되고 빌드 시 `tsc-alias`가 해석합니다 —
모듈 경계를 넘나들 때는 상대경로가 아니라 항상 별칭으로 import하세요.

- `src/app.ts` — 앱 엔트리포인트. `routers` 맵을 기반으로 `/api/v1/<key>`에 라우터를 마운트하고,
  `/api/docs`에 Swagger UI를 붙이며, `FRONT_URL`/`FRONT_TEST_URL`/`PUBLIC_URL`로 CORS 허용
  목록을 구성합니다.
- `src/core/http/` — `BaseController`(응답 헬퍼 + 에러를 `next`로 넘기는 async 핸들러 래퍼),
  `ApiError`(static factory가 있는 타입 있는 HTTP 에러), 전역 `errorHandler`/`notFound` 미들웨어.
- `src/core/validation/validator.ts` — 얇은 Zod 래퍼; 각 모듈 `dto.ts`의 DTO가 요청 타입의
  소스 오브 트루스입니다.
- `src/infra/` — 생명주기가 서로 다른 두 개의 브라우저 자동화 래퍼:
  `Puppeteer.ts`(완전한 `puppeteer` 브라우저, `scan` 모듈이 페이지를 로드해 DOM/메타 데이터를
  추출할 때 사용)와 `ChromeLauncher.ts`(`chrome-launcher`, `lighthouse`가 DevTools 프로토콜로
  제어할 디버그 가능한 Chrome 인스턴스를 띄움). 이 둘을 혼동하지 마세요 — Lighthouse는 Puppeteer
  `Browser`가 아니라 순수 Chrome 프로세스 + 포트가 필요합니다.
  `Puppeteer.launch()`가 `--no-sandbox`를 넘기는 이유는 배포 대상인 Cloud Run(`dockerfile` 참고)
  컨테이너에 샌드박스가 없기 때문입니다.
  scan/lighthouse 호출은 매번 새 프로세스를 `launch()`하고 `finally` 블록에서 닫거나 kill합니다 —
  브라우저 풀링은 없습니다.
- `src/modules/scan/scanService.ts` — 핵심 스캔 로직: `ping`(HEAD 요청), `robotsTxt`(외부 라이브러리
  없이 직접 만든 robots.txt 파서/매처로 fetch), `siteMap`(sitemap.xml HEAD 체크), `crawling`(원본
  HTML을 먼저 fetch한 뒤 같은 URL을 Puppeteer로 로드해 JS 실행 후 HTML을 얻고, 둘을 비교(diff)하고,
  `page.evaluate`로 meta/OG/Twitter 태그와 이미지 alt 커버리지를 추출하고, 고정된 SEO `checks` 세트를
  실행 — `runChecks` 참고). API에서 가장 복잡한 모듈입니다.
- `src/config/swagger.ts` — 라우트/DTO에서 자동 생성되지 않는, 손으로 작성한 OpenAPI 3.1 스펙
  객체이며 `/api/docs`에서 서빙됩니다; 라우트를 추가/변경할 때 수동으로 함께 갱신해야 합니다.
- Cloud Run에 컨테이너로 배포됩니다(`dockerfile`); `lighthouse`의 `chrome-launcher`가 브라우저
  바이너리를 필요로 하므로(런타임 이미지에 `apt-get install chromium`으로 설치) 런타임 이미지에
  `CHROME_PATH`가 필요하며, 이는 Puppeteer 자체의 번들 Chromium과는 별개입니다.

#### Docker 빌드

`dockerfile`은 워크스페이스를 인식하도록 되어 있습니다: **빌드 컨텍스트는 반드시 레포 루트**여야
하고(패키지 디렉토리가 아님, `pnpm-workspace.yaml`/`pnpm-lock.yaml`이 필요하기 때문), 항상
`pnpm --filter meta-scan-api build:docker`(`../..`를 컨텍스트로 전달)나 루트에서
`pnpm docker:build:api`로 빌드하세요 — 패키지 디렉토리 안에서 그냥 `docker build .`을 실행하면
안 됩니다.
내부적으로는 `pnpm --filter meta-scan-api build`를 실행한 뒤
`pnpm --filter meta-scan-api deploy --prod --legacy /deploy/meta-scan-api`로 독립 실행 가능한
`node_modules`를 만들고(pnpm 워크스페이스의 `node_modules`는 심볼릭 링크 기반이라 그대로 복사하면
안전하지 않습니다) 그 결과만 런타임 스테이지로 복사합니다. 이 과정은 `package.json`의
`"files": ["dist"]`에 의존합니다 — 이게 없으면 `pnpm deploy`가 git 추적 파일 규칙을 따라
(gitignore된) `dist/`를 조용히 빼버립니다. `--legacy`가 필요한 이유는 이 패키지가 주입할 워크스페이스
내부 의존성이 없기 때문입니다(pnpm 10의 순정 `pnpm deploy`는 inject 대상이 없는 워크스페이스를
거부합니다).

### meta-scan-front

`src/app/[lang]/` 아래 로케일 프리픽스 라우팅을 쓰는 Next.js App Router.

- `src/middleware.ts` — 정적/API가 아닌 모든 요청에서 `theme`/`lang` 쿠키를 읽고(최초 방문 시
  `Accept-Language`로 기본값 설정), URL에 로케일 프리픽스가 없으면 로케일 프리픽스 경로로
  리다이렉트합니다(`/` → `/ko/` 또는 `/en/`). 허용 로케일/쿠키 키/기본값은 `src/constans/index.ts`에
  있습니다.
- `src/dictionaries/` — `en.json`/`ko.json`을 `getDictionary(locale)`로 로케일별 지연 로딩
  (`src/dictionaries/index.ts`, `"server-only"` — 클라이언트 컴포넌트가 아니라 서버 컴포넌트/레이아웃에서
  호출하세요).
- `src/apis/` — `index.ts`가 `NEXT_PUBLIC_META_SCAN_API`를 `baseURL`로 하는 공유 `axios` 인스턴스를
  만들고, 도메인별 호출 파일(예: `scan.ts`)이 `meta-scan-api` 엔드포인트를 감쌉니다. 일관성이 없는
  부분에 주의: 일부 호출은 공유 `instance`의 `baseURL`만 사용하고(`sitePingApi`), 다른 일부는 같은
  인스턴스 위에 `NEXT_PUBLIC_META_SCAN_API`를 경로 앞에 명시적으로 다시 붙입니다(`scanRobotsTxtApi`
  등) — 새 호출을 추가하기 전에 기존 호출이 어떤 패턴을 따르는지 확인하고, `baseURL`만으로 충분하다고
  가정하지 마세요.
- `src/stores/scanStore.ts` — 이전에 요청한 스캔 URL을 `localStorage`에 영속화하는 Zustand 스토어.
- `src/templates/` — 페이지/기능별로 묶은 페이지 섹션 컴포넌트(`main/`, `request-scan/`, `root/`)이며,
  `src/components/ui/`의 범용적이고 대체로 shadcn 스타일인 프리미티브와는 구분됩니다.
- 경로 별칭 `@/*` → `src/*` (`tsconfig.json` 참고).

## 환경 변수

- `meta-scan-api`: `PORT`(기본 8080), `FRONT_URL`, `FRONT_TEST_URL`, `PUBLIC_URL`(CORS 허용 목록 +
  Swagger 서버 URL), `CHROME_PATH`(`chrome-launcher`용 Chromium 바이너리, 컨테이너 이미지에서는
  `dockerfile`에서 설정).
- `meta-scan-front`: `NEXT_PUBLIC_META_SCAN_API`(`meta-scan-api`의 base URL).

로컬 개발 시 `meta-scan-front`는 로컬에서 실행 중인 `meta-scan-api`(`pnpm dev:api`)에 접속하기 위해
`packages/meta-scan-front/.env.local`에 `NEXT_PUBLIC_META_SCAN_API=http://localhost:8080`이
필요합니다. 이 파일은 gitignore 대상이며 자동으로 생성되지 않습니다.

## 패키지별 가이드

`packages/meta-scan-api/CLAUDE.md`와 `packages/meta-scan-front/CLAUDE.md`에는 패키지 범위의
상세 내용이 있습니다(해당 디렉토리에서 작업할 때 자동으로 로드됨); 이 파일은 모노레포 전체의
진입점이므로 패키지 간/워크스페이스 명령어를 다룰 때는 이 파일을 우선하세요.
