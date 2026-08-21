# CLAUDE.md

이 파일은 이 패키지에서 작업할 때 Claude Code(claude.ai/code)에게 제공하는 가이드입니다.
`meta-scan` pnpm workspace의 일부입니다 — 모노레포 전체 명령어/컨텍스트는 레포 루트의
`CLAUDE.md`를 참고하세요.

## 명령어

별도 언급이 없으면 (pnpm workspace 스크립트이므로) 이 디렉토리가 아니라 **레포 루트**에서
실행하세요:

```bash
pnpm dev:api                              # tsx watch src/app.ts, :8080
pnpm --filter meta-scan-api build         # tsc -p tsconfig.json && tsc-alias -p tsconfig.json -> dist/
pnpm --filter meta-scan-api start         # node dist/app.js (빌드 결과물 실행)
pnpm --filter meta-scan-api lint          # eslint .
pnpm --filter meta-scan-api typecheck     # tsc --noEmit
pnpm --filter meta-scan-api build:docker  # Docker 이미지 빌드 (아래 "Docker 빌드" 참고)
```

테스트 스크립트는 없습니다 — 테스트 러너가 있다고 가정하지 마세요.

## 아키텍처

**2026-08-21, [ADR-011](../../docs/adr/index.html#adr-011)에 따라 Hexagonal(Ports & Adapters)
3계층으로 마이그레이션했습니다** — 원문은
`docs/case-study/backend-hexagonal-architecture.md`. 이전의 `src/modules/*` 레이어드 구조(router→
controller→service)는 대체됐습니다. 경로 별칭은 `@/*` → `src/*` 하나입니다(`tsconfig.json`,
`meta-scan-front`와 동일 스타일). 빌드 시 `tsc-alias`가 해석합니다 — 계층 경계를 넘나들 때는
상대경로가 아니라 별칭으로 import하세요.

```
domain/
  ports/                        순수 인터페이스 — infra를 모름
    BrowserAutomationPort.ts      launch()/close(proc?) — Puppeteer의 최소 계약
    LighthouseRunnerPort.ts       launch()/safeKill(proc?) — ChromeLauncher의 최소 계약

application/
  ScanService.ts                 포트(BrowserAutomationPort)에 의존, ping/robotsTxt/siteMap/
                                  crawling + runChecks 전부 담은 단일 클래스(아직 안 쪼갬 — 아래 참고)
  LighthouseService.ts           포트(LighthouseRunnerPort)에 의존

adapters/
  outbound/
    PuppeteerAdapter.ts           BrowserAutomationPort 구현 (구 infra/Puppeteer.ts)
    ChromeLauncherAdapter.ts       LighthouseRunnerPort 구현 (구 infra/ChromeLauncher.ts)
  inbound/http/
    scan/        scanController.ts, scan.router.ts, dto.ts
    lighthouse/  LighthouseController.ts, lighthouse.router.ts, dto.ts
    health/      HealthController.ts, health.router.ts

core/, constant/, config/, types/   그대로 유지 (계층 밖 공통 유틸)
```

**이번 마이그레이션은 "순수 이동" 범위였습니다**(프론트 ADR-010 때와 동일한 원칙) — `ScanService`가
God 서비스인 것도, `runChecks`가 그 안에 묻혀 있는 것도, DTO 타입을 `application/`이 인바운드
어댑터에서 그대로 `import`하는 것(순수한 Hexagonal이라면 어색한 지점)도 이번엔 안 건드렸습니다.
각 파일 위에 `// NOTE(ADR-011): ...` 주석으로 이 알려진 불순물들을 표시해뒀습니다. 실제 유스케이스
분리(`ScanUrlUseCase` 등)는 다음 작업.

- `src/app.ts` — 엔트리포인트. `routers` 맵을 기반으로 `/api/v1/<key>`에
  `adapters/inbound/http/**/**.router.ts`를 마운트하고, `/api/docs`에 Swagger UI를 붙이며,
  `FRONT_URL`/`FRONT_TEST_URL`/`PUBLIC_URL`로 CORS 허용 목록을 구성합니다.
- `src/core/http/` — `BaseController`(응답 헬퍼 + 에러를 `next`로 넘기는 async 핸들러 래퍼),
  `ApiError`(static factory가 있는 타입 있는 HTTP 에러), 전역 `errorHandler`/`notFound` 미들웨어.
  Hexagonal 계층 밖의 공통 유틸이라 이동하지 않았습니다.
- `src/core/validation/validator.ts` — 얇은 Zod 래퍼; 각 인바운드 어댑터의 `dto.ts`가 요청
  타입/스키마의 소스 오브 트루스입니다.
- `src/adapters/outbound/` — 생명주기가 서로 다른 두 개의 브라우저 자동화 어댑터이니 혼동하지
  마세요:
  - `PuppeteerAdapter.ts` — 완전한 `puppeteer` 브라우저(번들 Chromium), `ScanService`가 페이지를
    로드해 DOM/메타 데이터를 추출할 때 사용. `launch()`가 `--no-sandbox`를 넘기는 이유는 배포
    대상인 Cloud Run 컨테이너에 샌드박스가 없기 때문입니다.
  - `ChromeLauncherAdapter.ts` — `chrome-launcher`, `lighthouse`가 DevTools 프로토콜로 제어할
    디버그 가능한 *시스템* Chrome 인스턴스(`CHROME_PATH`)를 띄움. Lighthouse는 Puppeteer
    `Browser`가 아니라 순수 Chrome 프로세스 + 포트가 필요합니다.
  scan/lighthouse 호출은 매번 새 프로세스를 `launch()`하고 `finally` 블록에서 닫거나 kill합니다 —
  브라우저 풀링은 없습니다. 두 어댑터 다 각자의 포트 인터페이스(`domain/ports/*`)를 구현하며,
  `application/`은 이 구체 클래스가 아니라 포트 타입에만 의존합니다.
- `src/application/ScanService.ts` — 핵심 스캔 로직이자 가장 복잡한 클래스: `ping`(HEAD 요청),
  `robotsTxt`(외부 라이브러리 없이 직접 만든 robots.txt 파서/매처로 fetch), `siteMap`(sitemap.xml
  HEAD 체크), `crawling`(원본 HTML을 먼저 fetch한 뒤 같은 URL을 `BrowserAutomationPort`로 로드해
  JS 실행 후 HTML을 얻고, 둘을 비교(diff)하고, `page.evaluate`로 meta/OG/Twitter 태그와 이미지 alt
  커버리지를 추출하고, 고정된 SEO `checks` 세트를 실행 — `runChecks` 참고, 아직 이 클래스 내부
  private 메서드).
- `src/config/swagger.ts` — 라우트/DTO에서 자동 생성되지 않는, 손으로 작성한 OpenAPI 3.1 스펙
  객체이며 `/api/docs`에서 서빙됩니다; 라우트를 추가/변경할 때 수동으로 함께 갱신해야 합니다.

## 구현 패턴

- **라우터의 수동 DI**: `adapters/inbound/http/*/*.router.ts`는 프레임워크 없이
  `new XxxAdapter() → new XxxService(adapter) → new XxxController(service)` 순으로 직접
  인스턴스를 만들어 엮습니다(`scan.router.ts`, `lighthouse.router.ts` 참고). `XxxService`
  생성자는 구체 어댑터 클래스가 아니라 `domain/ports/*`의 포트 타입으로 선언돼 있지만, 실제
  주입은 여전히 라우터가 구체 어댑터(`PuppeteerAdapter`/`ChromeLauncherAdapter`)를 `new`해서
  넘깁니다 — DI 컨테이너는 없고, "포트에만 의존"은 타입 레벨에서만 강제됩니다. 컨트롤러 클래스는
  여기서만 생성되고 폴더 밖으로 export되지 않습니다.
- **컨트롤러 메서드 = 클래스 필드 화살표 함수**: `ping = this.handle(async (req, res, _next) =>
  {...})`처럼 화살표 함수를 클래스 필드로 선언합니다. 이렇게 하면 `this`가 인스턴스에 자동 바인딩돼
  `router.post("/ping", controller.ping)`처럼 메서드 참조를 그대로 넘겨도 `bind(controller)`가
  필요 없습니다. 일반 메서드 문법(`ping() {}`)으로 바꾸면 이 바인딩이 깨지니 유지하세요.
- **DTO/검증 패턴**: 각 인바운드 어댑터의 `dto.ts`는 항상 `export const XxxBodySchema = z.object({...})` +
  `export type XxxBody = z.infer<typeof XxxBodySchema>` 쌍으로 스키마와 타입을 함께 선언합니다.
  컨트롤러는 `const body = validate(XxxBodySchema, req.body)`로 파싱한 뒤 `as XxxBody`로 다시
  캐스팅하는데(`validate`가 이미 검증된 `T`를 반환하므로 이 캐스팅은 사실 불필요한 중복입니다 —
  기존 코드의 관성일 뿐이니 새 코드에서 굳이 따라 할 필요는 없습니다).
- **에러 처리**: 서비스 메서드는 거의 전부 `try { ... } catch (e) { throw ApiError.internal(); }`
  형태로, 원본 에러(`e`)를 로깅하지 않고 그대로 삼켜 500으로 뭉갭니다. 원인 문자열이 유실되므로 실제
  장애 조사 시엔 임시로 `console.error(e)`를 넣어보는 게 유용합니다 — 이게 기본값처럼 보이지만 실제로는
  디버깅 정보 손실이라는 트레이드오프가 있다는 점을 인지하세요.
- **응답 스프레드 규약과 예외**: `scan`/`health` 어댑터는 성공 응답을 `this.ok(res, { ...statusOk,
  ...result })` 형태로 `{ status: "ok", ... }`를 항상 스프레드해서 내려줍니다. 반면 `lighthouse`
  의 `run`은 이 규약을 따르지 않습니다 — `format === "html"`이면 `this.html()`로 원본 HTML
  리포트를 그대로 돌려주고, 아니면 `result?.lhr`(Lighthouse 원본 결과 객체)을 `statusOk` 없이 그대로
  반환합니다. 새 엔드포인트를 추가할 때 클라이언트가 `status` 필드를 기대하는지 여부를 먼저 정하세요.
  (Hexagonal 마이그레이션과 무관한 기존 이슈 — 이번에 손대지 않았습니다.)
- **파일명 케이싱은 이번에 통일됐습니다**: 마이그레이션 전엔 `scanController.ts`/`scanService.ts`만
  소문자로 시작해 `HealthController.ts`/`LighthouseController.ts`/`LighthouseService.ts`(파스칼
  케이스)와 불일치했는데, `application/`으로 옮기며 `ScanService.ts`로 바뀐 김에
  `ScanController.ts`도 같이 맞췄습니다(2026-08-21) — 지금은 컨트롤러/서비스 파일명이 전부 파스칼
  케이스로 통일돼 있습니다.
- **전역 타입은 export 없는 ambient `.d.ts`**: `src/types/*.d.ts`(`meta.d.ts`, `robots.d.ts`)는
  `export` 없이 `type`/`interface`를 선언하는 전역 앰비언트 파일입니다(`MetaScanResult`,
  `ParsedRobots`, `CheckLevel` 등). 그래서 `application/ScanService.ts`에서 이 타입들을 어디서도
  `import`하지 않고 바로 씁니다. 새 전역 타입을 추가할 때도 이 컨벤션(디렉토리에 `.d.ts`로 두고
  export하지 않기)을 따르세요 — `export`를 붙이면 그 순간부터 모듈 파일이 되어 다른 곳에서 자동으로
  보이지 않게 됩니다.
- **매직 넘버/문자열은 `@/constant/*`로 분리**: `TITLE_MIN`/`TITLE_MAX`/`DESC_MIN`/`DESC_MAX`
  (`constant/meta.ts`), `statusOk`(`constant/status.ts`)처럼 UPPER_SNAKE_CASE 상수나 공유 응답
  조각을 코드에 인라인하지 않고 `@/constant/*`로 뺍니다.

## Docker 빌드

`dockerfile`은 워크스페이스를 인식하도록 되어 있습니다: **빌드 컨텍스트는 반드시 레포 루트**여야
하고(이 디렉토리가 아니라, 루트의 `pnpm-workspace.yaml`/`pnpm-lock.yaml`이 필요하기 때문), 항상
`pnpm --filter meta-scan-api build:docker`(이 디렉토리에서 `../..`를 컨텍스트로 전달)나 루트에서
`pnpm docker:build:api`로 빌드하세요 — 여기서 그냥 `docker build .`을 실행하면 안 됩니다.

내부적으로 Dockerfile은 `pnpm --filter meta-scan-api build`를 실행한 뒤
`pnpm --filter meta-scan-api deploy --prod --legacy /deploy/meta-scan-api`로 독립 실행 가능한
`node_modules`를 만들고(pnpm 워크스페이스의 `node_modules`는 심볼릭 링크 기반이라 그대로 복사하면
안전하지 않습니다) 그 결과만 런타임 스테이지로 복사합니다. 이 과정은 `package.json`의
`"files": ["dist"]`에 의존합니다 — 이게 없으면 `pnpm deploy`가 git 추적 파일 규칙을 따라
(gitignore된) `dist/`를 조용히 빼버립니다. `--legacy`가 필요한 이유는 이 패키지가 주입할 워크스페이스
내부 의존성이 없기 때문입니다(pnpm 10의 순정 `pnpm deploy`는 inject 대상이 없는 워크스페이스를
거부합니다).

런타임 이미지는 `apt-get`으로 시스템 Chromium도 설치하고 `chrome-launcher`/Lighthouse용
`CHROME_PATH`를 설정합니다 — Puppeteer 자체의 번들 Chromium과는 별개입니다.

## 환경 변수

`PORT`(기본 8080), `FRONT_URL`, `FRONT_TEST_URL`, `PUBLIC_URL`(CORS 허용 목록 + Swagger 서버 URL),
`CHROME_PATH`(`chrome-launcher`용 Chromium 바이너리 경로, 컨테이너 이미지에서는 `dockerfile`에서
설정).
