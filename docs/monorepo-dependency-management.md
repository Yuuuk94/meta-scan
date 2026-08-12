# 모노레포 의존성 관리 도구 선정

## 배경

`meta-scan-api`(Express + TypeScript, npm)와 `meta-scan-front`(Next.js, pnpm)를 `git subtree`로
`packages/*` 하위에 합쳐 모노레포(`meta-scan`)로 구성했다. 두 패키지가 서로 다른 패키지 매니저를
쓰고 있었기 때문에, 모노레포 전체를 단일 도구로 통합할 필요가 있었다.

후보는 **pnpm workspaces**와 **Yarn Berry(Yarn 2+, PnP)** 두 가지였다.

## 비교

| 항목 | pnpm workspaces | Yarn Berry (PnP) |
|---|---|---|
| 설치 방식 | content-addressable store + 하드링크/심볼릭 링크. `node_modules` 유지 | PnP가 기본값. `node_modules` 대신 `.pnp.cjs`로 모듈 해석 (node-modules 모드로 되돌릴 수도 있음) |
| 디스크 사용량 | 전역 store 공유로 매우 적음 | PnP면 더 적음, node-modules 모드면 pnpm과 비슷 |
| phantom dependency 방지 | 기본적으로 엄격 (미선언 패키지 import 시 에러) | PnP 모드에서 동일 수준으로 엄격 |
| 생태계 호환성 | 매우 높음. Next.js, ESLint, 대부분 툴체인에서 문제 없음. Vite/Turborepo/Vue 등 공식 예제가 pnpm을 채택 | PnP는 Next.js·네이티브 addon·일부 ESLint 플러그인과 호환성 이슈 이력 있음 → 실무에서 `nodeLinker: node-modules`로 우회하는 경우가 많음 |
| Next.js 호환성 | 공식 지원, 이슈 적음 | PnP 모드에서 과거 이슈 다수 리포트됨 |
| 학습/마이그레이션 비용 | 낮음. npm/yarn과 사용법 거의 동일, `pnpm-workspace.yaml`만 추가하면 됨 | 상대적으로 높음. `.yarnrc.yml`, zero-install, PnP 개념 학습 필요 |
| 기존 상태와의 정합성 | front가 이미 pnpm 사용 중 → 마이그레이션 최소 | front(pnpm→yarn), api(npm→yarn) 둘 다 전환 필요 |
| CI 캐싱/속도 | 빠름, 캐시 전략 단순 | zero-install(`.yarn/cache` 커밋) 시 CI는 매우 빠르지만 레포 용량 증가 |

## 결정: pnpm workspaces

- `meta-scan-front`가 이미 pnpm(`pnpm-lock.yaml`)을 쓰고 있어 마이그레이션 비용이 가장 적음
- `meta-scan-api`가 puppeteer, lighthouse 등 네이티브 바이너리/설치 스크립트에 의존하는데,
  Yarn PnP는 이런 패키지들과의 호환성 이슈 이력이 있어 리스크가 큼
- Next.js(front)에 대한 공식 지원과 생태계 사례가 pnpm 쪽이 압도적으로 많음

## 적용 방법

1. **워크스페이스 정의** — 루트에 `pnpm-workspace.yaml` 추가

   ```yaml
   packages:
     - "packages/*"
   ```

2. **루트 `package.json` 생성** — 패키지 매니저 버전 고정 및 공통 스크립트 정의

   ```json
   {
     "name": "meta-scan",
     "private": true,
     "packageManager": "pnpm@10.15.0",
     "scripts": {
       "dev:api": "pnpm --filter meta-scan-api dev",
       "dev:front": "pnpm --filter meta-scan-front dev",
       "build": "pnpm -r build",
       "lint": "pnpm -r lint",
       "typecheck": "pnpm -r --if-present typecheck"
     }
   }
   ```

3. **패키지 이름 충돌 정리** — `packages/meta-scan-front/package.json`의 `name`이 루트와 동일하게
   `"meta-scan"`으로 되어 있어 `--filter` 대상이 모호해짐. `"meta-scan-front"`로 변경해
   `meta-scan-api`와 네이밍 컨벤션을 맞추고 충돌을 제거.

4. **개별 lockfile 제거, 단일 lockfile로 통합**
   - `packages/meta-scan-api/package-lock.json` 삭제 (기존 npm)
   - `packages/meta-scan-front/pnpm-lock.yaml` 삭제 (패키지 단위 lockfile)
   - 루트에서 `pnpm install` 실행 → 루트 `pnpm-lock.yaml` 하나로 전체 워크스페이스 의존성 관리

5. **네이티브/설치 스크립트 허용 목록 지정** — pnpm은 기본적으로 서드파티 패키지의
   install script(postinstall 등)를 차단한다. `meta-scan-api`가 실제로 필요로 하는
   puppeteer(Chromium 다운로드), esbuild, sharp 등을 루트 `package.json`에 명시적으로 허용:

   ```json
   {
     "pnpm": {
       "onlyBuiltDependencies": [
         "@scarf/scarf",
         "esbuild",
         "puppeteer",
         "sharp",
         "unrs-resolver"
       ]
     }
   }
   ```

   허용 후 `pnpm install`을 재실행하면 해당 스크립트가 정상 실행된다 (puppeteer의
   Chromium이 `~/.cache/puppeteer`에 내려받아지는 것으로 확인).

6. **검증** — 각 패키지에서 타입체크 통과 확인
   ```bash
   pnpm --filter meta-scan-api typecheck
   pnpm --filter meta-scan-front exec tsc --noEmit
   ```

## 사용법 요약

```bash
pnpm install                              # 루트에서 전체 워크스페이스 의존성 설치
pnpm dev:api                              # api dev 서버 실행
pnpm dev:front                            # front(Next.js) dev 서버 실행
pnpm --filter <package-name> <script>     # 특정 패키지만 타겟팅
pnpm -r build                             # 전체 패키지 일괄 빌드
pnpm -r lint                              # 전체 패키지 일괄 린트
```

## 향후 고려 사항

- 빌드 캐싱/파이프라인이 필요해지면 Turborepo 또는 Nx 도입 검토
- 루트 레벨 공용 ESLint/TypeScript 설정 통합 검토
