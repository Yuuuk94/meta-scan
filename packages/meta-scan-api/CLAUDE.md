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

`src/modules/*` 아래 기능별 모듈로 나뉜 레이어드 Express 앱. 각 모듈은
`*.router.ts`(라우트 연결) → `*Controller.ts`(`BaseController` 상속, 요청/응답만 담당) →
`*Service.ts`(비즈니스 로직) 구조입니다. 경로 별칭(`@core/*`, `@constant/*`, `@config/*`,
`@infra/*`, `@modules/*`, `tsconfig.json`에 정의)은 빌드 시 `tsc-alias`가 해석합니다 —
모듈 경계를 넘나들 때는 상대경로가 아니라 별칭으로 import하세요.

- `src/app.ts` — 엔트리포인트. `routers` 맵을 기반으로 `/api/v1/<key>`에 라우터를 마운트하고,
  `/api/docs`에 Swagger UI를 붙이며, `FRONT_URL`/`FRONT_TEST_URL`/`PUBLIC_URL`로 CORS 허용
  목록을 구성합니다.
- `src/core/http/` — `BaseController`(응답 헬퍼 + 에러를 `next`로 넘기는 async 핸들러 래퍼),
  `ApiError`(static factory가 있는 타입 있는 HTTP 에러), 전역 `errorHandler`/`notFound` 미들웨어.
- `src/core/validation/validator.ts` — 얇은 Zod 래퍼; 각 모듈 `dto.ts`의 DTO가 요청 타입/스키마의
  소스 오브 트루스입니다.
- `src/infra/` — 생명주기가 서로 다른 두 개의 브라우저 자동화 래퍼이니 혼동하지 마세요:
  - `Puppeteer.ts` — 완전한 `puppeteer` 브라우저(번들 Chromium), `scan`이 페이지를 로드해 DOM/메타
    데이터를 추출할 때 사용. `launch()`가 `--no-sandbox`를 넘기는 이유는 배포 대상인 Cloud Run
    컨테이너에 샌드박스가 없기 때문입니다.
  - `ChromeLauncher.ts` — `chrome-launcher`, `lighthouse`가 DevTools 프로토콜로 제어할 디버그 가능한
    *시스템* Chrome 인스턴스(`CHROME_PATH`)를 띄움. Lighthouse는 Puppeteer `Browser`가 아니라
    순수 Chrome 프로세스 + 포트가 필요합니다.
  scan/lighthouse 호출은 매번 새 프로세스를 `launch()`하고 `finally` 블록에서 닫거나 kill합니다 —
  브라우저 풀링은 없습니다.
- `src/modules/scan/scanService.ts` — 핵심 스캔 로직이자 가장 복잡한 모듈: `ping`(HEAD 요청),
  `robotsTxt`(외부 라이브러리 없이 직접 만든 robots.txt 파서/매처로 fetch), `siteMap`(sitemap.xml
  HEAD 체크), `crawling`(원본 HTML을 먼저 fetch한 뒤 같은 URL을 Puppeteer로 로드해 JS 실행 후 HTML을
  얻고, 둘을 비교(diff)하고, `page.evaluate`로 meta/OG/Twitter 태그와 이미지 alt 커버리지를 추출하고,
  고정된 SEO `checks` 세트를 실행 — `runChecks` 참고).
- `src/config/swagger.ts` — 라우트/DTO에서 자동 생성되지 않는, 손으로 작성한 OpenAPI 3.1 스펙
  객체이며 `/api/docs`에서 서빙됩니다; 라우트를 추가/변경할 때 수동으로 함께 갱신해야 합니다.

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
