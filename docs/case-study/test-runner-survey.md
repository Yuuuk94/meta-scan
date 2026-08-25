# Test Runner Survey — meta-scan monorepo

> **상태**: 2026-08-24에 결정 완료 — **`meta-scan-front`는 Jest, `meta-scan-api`는 Vitest**로
> 패키지별로 다르게 도입하기로 확정했습니다. 아래 "2. 추천"은 리소스/마찰 관점에서는 여전히
> "두 패키지 다 Vitest"가 더 효율적이라고 판단한 근거이고, 사용자도 그 근거에 동의했지만, 이
> 프로젝트를 **학습을 겸해 진행 중이라 프론트/백엔드에서 서로 다른 러너를 각각 경험해보는 쪽을
> 의도적으로 선택**했습니다 — 즉 "어느 게 더 나은가"가 아니라 "무엇을 배우고 싶은가"가 최종
> 결정 기준이었습니다. 다른 서베이 문서(`backend-architecture-survey.md`)와 달리 이 문서는 후보를
> 중립적으로만 나열하지 않고 추천 순위와 근거를 명시적으로 담았지만, 최종 채택은 그 추천과
> 다르게 정리됐다는 점을 이 상태 배지에 남겨둡니다.

## 0. 이 저장소에서 고려해야 할 제약

후보를 나열하기 전에, 일반론이 아니라 이 모노레포에 실제로 적용될 때 영향을 주는 사실들:

| 사실 | 왜 중요한가 |
|---|---|
| `meta-scan-api`가 `"type": "module"` — **순수 ESM**, `tsx watch`로 개발 | Babel/CJS 트랜스파일 없이 네이티브 ESM을 그대로 도는 러너가 마찰이 적음. Jest의 ESM 지원은 여전히 `--experimental-vm-modules` 플래그 + 설정이 필요한 준-공식 상태. |
| `meta-scan-front`는 Next.js 15.5.7 + React 19.1.0 | 최신 버전이라 각 러너의 Next/React 19 지원 성숙도가 실사용에 영향을 줌. |
| 두 패키지 다 **테스트 스크립트가 아예 없음** (`package.json`에 `test` 필드 없음) | 어느 러너를 골라도 처음부터 설정해야 함 — "기존 설정과의 마찰" 같은 레거시 제약이 없어 러너 자체의 적합성만 보고 고르면 됨. |
| pnpm workspace 모노레포, 패키지별 성격이 다름 (front=React 컴포넌트, api=Express 서비스) | 러너가 **패키지별로 다른 테스트 환경**(jsdom/browser vs plain Node)을 하나의 설정 체계 안에서 지원하는지가 중요. |
| `ScanService`가 이미 [ADR-011](../adr/index.html#adr-011)로 `BrowserAutomationPort`/`LighthouseRunnerPort` 뒤에 Puppeteer/chrome-launcher를 숨겨둠 | **어느 러너를 쓰든 목킹 난이도는 동일** — 포트 인터페이스를 구현한 페이크 어댑터를 주입하면 되므로, "이 러너가 모킹이 쉽다"는 이번 비교에서 차별화 포인트가 아님. |
| 저장소 전반이 공유 설정으로 도구를 통일하는 관행(`eslint.config.base.mjs`를 두 패키지가 import) | 패키지마다 완전히 다른 러너를 쓰면 이 관행과 어긋남 — 가능하면 같은 러너를 두 패키지 모두에 쓰는 쪽이 저장소 컨벤션과 맞음. |
| Docker 런타임(`dockerfile`)은 `node dist/app.js`만 실행, 별도 런타임 없음 | 배포 이미지에 Bun 같은 별도 런타임을 얹는 선택은 CI/배포 파이프라인에 새 의존성을 추가하는 셈 — 테스트 러너가 개발/CI 전용이라도 팀 전체가 새 런타임을 설치해야 하는 비용은 남음. |

## 1. 후보 목록

### 1.1 Vitest

**핵심**: Vite 생태계의 테스트 러너지만 Vite 자체 없이도 독립 실행 가능. esbuild 기반이라
TS/ESM을 트랜스파일 없이 거의 그대로 실행. `describe`/`it`/`expect` API가 Jest와 거의 동일해
마이그레이션 문서·예제가 Jest 습관 그대로 통함.

| | 내용 |
|---|---|
| 장점 | 네이티브 ESM·TS를 별도 트랜스파일 설정 없이 실행(이 저장소의 `"type": "module"` + `tsx` 개발 방식과 결이 같음), 워치 모드가 Jest보다 체감상 빠름(esbuild), `vitest.workspace.ts`로 **패키지마다 다른 테스트 환경**(front=`jsdom`, api=`node`)을 하나의 워크스페이스 설정에서 지원, `@testing-library/react` + React 19를 문제없이 지원, `vi.mock`/`vi.fn` 등 목킹 API가 Jest와 거의 1:1 대응돼 학습 비용이 낮음 |
| 단점 | Jest보다 생태계 연식이 짧아 일부 서드파티 플러그인(스냅샷 직렬화 등)의 커버리지가 Jest보다 좁을 수 있음, Vite 생태계 용어(`transformMode`, plugin 시스템)에 익숙하지 않으면 설정 문서를 읽을 때 approached가 다르게 느껴짐 |
| 이 저장소 적합성 | `tsx`가 이미 esbuild 기반이라 팀이 이 트랜스파일 방식에 익숙함, `dev-lifecycle-harness.md`가 이미 "front/api 둘 다 Vitest"를 1순위로 제안해둔 상태와도 일치 |

### 1.2 Jest (+ `next/jest`)

**핵심**: 업계 표준, Next.js가 `next/jest`로 공식 프리셋을 제공(SWC 트랜스파일, CSS 모듈/이미지
자동 목, `next.config.js` 자동 반영). Node/Express 백엔드에서도 여전히 가장 널리 쓰이는 선택.

| | 내용 |
|---|---|
| 장점 | 압도적으로 큰 생태계·레퍼런스·Stack Overflow 답변, `next/jest`가 Next 특화 설정(이미지/폰트/CSS 모듈 목킹)을 대신 해줘서 프론트 쪽 설정 자체는 오히려 더 적을 수 있음, 스냅샷 테스트·커버리지 리포터 등 부가 기능이 성숙 |
| 단점 | (정정: 바벨/웹팩이 필수라서가 아님 — 웹팩은 애초에 테스트 러너와 무관하고, `ts-jest`/`@swc/jest`로 바벨 없이도 갈 수 있음) **진짜 마찰은 Jest "런타임" 자체가 네이티브 ESM을 아직 준실험 상태로 지원한다는 것**: `--experimental-vm-modules` Node 플래그가 여전히 필요(공식 문서도 "실험적"이라 명시), ESM의 live binding 특성 때문에 `jest.mock()`으로 모듈을 목킹하는 게 CJS 때보다 까다로움, 워치 모드/실행 속도가 Vitest보다 느림, 프론트(`next/jest`, SWC 기반)와 백엔드(`ts-jest`/`@swc/jest` + 위 ESM 플래그)가 서로 다른 설정 체계를 갖게 돼 "두 패키지가 같은 도구를 쓴다"는 이점이 옅어짐 |
| 이 저장소 적합성 | 프론트만 놓고 보면 나쁘지 않지만, `meta-scan-api`의 `"type": "module"` 순수 ESM과 맞물리면 Jest 런타임의 실험적 ESM 지원 + 모킹 마찰이 가장 큰 후보 |

### 1.3 Node.js 내장 테스트 러너 (`node:test`)

**핵심**: Node 18+에 기본 내장. 외부 의존성 없이 `node --test`로 바로 실행. `node:assert`와
결합해 쓰는 게 기본 패턴.

| | 내용 |
|---|---|
| 장점 | 의존성 0개(설치·버전 관리 부담 없음), Node가 이미 깔려 있으면 바로 동작, 실행 속도가 매우 빠름, `tsx`로 TS를 그대로 실행 가능(`node --import tsx --test`) |
| 단점 | React 컴포넌트 테스트에 필요한 jsdom/브라우저 환경·`@testing-library` 통합이 1급 지원이 아님(직접 배선해야 함), 목킹 API(`node:test`의 `mock`)가 Jest/Vitest보다 기능이 얕음(예: 모듈 목킹이 덜 성숙), 커버리지·리포터 등 부가 도구 생태계가 훨씬 작음 |
| 이 저장소 적합성 | `meta-scan-api`(Express, DOM 불필요) 단독이라면 매력적인 선택이지만, **`meta-scan-front`(React 컴포넌트)에는 부적합**해서 두 패키지에 각각 다른 러너를 써야 함 — 저장소가 지금까지 지켜온 "두 패키지가 공유 설정 위에서 같은 도구를 쓴다" 관행과 어긋남 |

### 1.4 Bun test

**핵심**: Bun 런타임에 내장된 테스트 러너, Jest 호환 API, 매우 빠름.

| | 내용 |
|---|---|
| 장점 | 셋업 없이 즉시 빠름, Jest 스타일 API라 학습 비용 낮음 |
| 단점 | **Bun이라는 별도 런타임을 팀 전체·CI·(잠재적으로) Docker 이미지에 새로 들여야 함** — 지금 `pnpm`/`tsx`/`node dist/app.js` 기반 배포 파이프라인과 완전히 다른 런타임 스택, `puppeteer`/`chrome-launcher`처럼 네이티브 바이너리를 다운로드하는 무거운 의존성들이 Bun 환경에서 얼마나 안정적으로 동작하는지 검증 필요 |
| 이 저장소 적합성 | 테스트만을 위해 런타임 하나를 통째로 새로 들이는 비용이 이득보다 커 보임 — 우선순위 낮음 |

### 1.5 (참고, 이번 비교 대상 아님) Playwright / supertest

`docs/case-study/dev-lifecycle-harness.md`가 별도 계층(E2E/통합 QA, `qa-front`/`qa-backend`)으로
이미 짚어둔 도구들. 이 문서가 다루는 건 **단위 테스트 러너**(`interview → dev → test` 루프의
red-green-refactor 단계에서 쓸 도구)이고, Playwright(브라우저 E2E)/supertest(HTTP 통합)는 그
바깥에 있는 별개 계층이라 이번 선택과는 독립적입니다.

## 2. 추천

**Vitest를 두 패키지(`meta-scan-front`, `meta-scan-api`) 모두에 도입하는 걸 추천합니다.**

근거를 다시 정리하면:

1. **ESM 마찰이 가장 적음** — `meta-scan-api`가 이미 순수 ESM(`"type": "module"`)이고 개발
   서버도 esbuild 기반 `tsx`로 돈다는 사실이 결정적입니다. Jest는 이 조합에서 여전히 실험적
   플래그가 필요하고, `node:test`는 순수 ESM엔 잘 맞지만 React 쪽을 못 커버합니다.
2. **한 러너로 두 패키지를 다 커버** — `vitest.workspace.ts`로 패키지마다 다른 테스트 환경
   (front=`jsdom`, api=`node`)을 설정할 수 있어서, "패키지마다 다른 도구" 문제(Jest+node:test
   조합의 단점) 없이 저장소의 "공유 설정 위에서 같은 도구" 관행을 유지할 수 있습니다.
3. **React 19 지원이 실사용 수준** — `@testing-library/react`와 조합해 최신 React 버전에서도
   무리 없이 쓰입니다.
4. **기존 로드맵과 이미 일치** — `dev-lifecycle-harness.md`가 "시작 순서 1순위"로 제안해둔
   내용과 같아서, 이 문서가 나중에 그 로드맵과 합쳐지더라도 재작업이 없습니다.

차선책은 **`meta-scan-api`만 `node:test`**로 가는 조합입니다(의존성 0개, 가장 빠름) — 다만 이
경우 프론트는 결국 Vitest든 Jest든 별도로 골라야 해서 "패키지마다 다른 러너"가 되고, 두 러너의
설정/CI 스크립트를 각각 유지보수해야 하는 비용이 생깁니다. 지금 저장소 규모(테스트 0개에서
시작)에서는 이 비용을 감수할 이유가 약하다고 판단해 1순위로 추천하진 않습니다.

## 3. 최종 결정 및 다음 단계

**최종 채택**: `meta-scan-front` = **Jest**(`next/jest` 프리셋), `meta-scan-api` = **Vitest**.
"2. 추천"의 근거(리소스 효율, 마찰 최소화)는 유효하다고 합의됐지만, 이 프로젝트가 학습을 겸하고
있어 프론트/백엔드에서 서로 다른 러너를 실제로 다뤄보는 쪽을 우선했습니다. 이 선택에 따라
"2절 추천"에서 짚었던 단점들이 실제로 어떻게 나타나는지도 함께 관찰 대상입니다:

- 프론트(Jest)와 백엔드(Vitest)가 서로 다른 설정 체계·목킹 API(`jest.mock` vs `vi.mock`)를 쓰게
  됨 — 저장소의 "공유 설정 위에서 같은 도구" 관행과는 의도적으로 어긋나는 지점이니, 두 패키지
  CI 스크립트/문서를 각각 유지보수해야 한다는 점을 인지하고 진행.
- `meta-scan-api`가 순수 ESM이라 Jest를 안 쓰기로 한 것과 별개로, 프론트는 Next.js 15 +
  React 19 조합에서 `next/jest`가 실제로 얼마나 매끄러운지 이번 도입에서 검증하게 됨.

다음 단계:

1. **`meta-scan-front`**: `jest`, `jest-environment-jsdom`, `@testing-library/react`,
   `@testing-library/jest-dom` devDependency 추가, `next/jest`로 `jest.config.ts` 작성,
   `"test": "jest"`, `"test:watch": "jest --watch"` 스크립트 추가
2. **`meta-scan-api`**: `vitest` devDependency 추가, `environment: "node"`로 `vitest.config.ts`
   작성, `"test": "vitest run"`, `"test:watch": "vitest"` 스크립트 추가. 루트
   `pnpm.onlyBuiltDependencies`에 새로 추가되는 패키지 중 네이티브 설치 스크립트가 있는 게
   있는지 확인
3. `docs/harness/tdd-issue-loop.md`의 "테스트 러너: 미정" 항목을 이 결정으로 갱신 (완료 —
   아래 참고)
4. `docs/harness/tdd-issue-loop.md`의 dev/test agent 프롬프트에 패키지별 실제 테스트 실행
   커맨드(front: `pnpm --filter meta-scan-front test`, api: `pnpm --filter meta-scan-api test`)를
   명시 — 두 패키지가 다른 러너를 쓰므로 agent가 이슈의 `pkg:*` 라벨을 보고 커맨드를 분기해야 함
