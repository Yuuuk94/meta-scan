# CLAUDE.md

이 파일은 이 패키지에서 작업할 때 Claude Code(claude.ai/code)에게 제공하는 가이드입니다.
`meta-scan` pnpm workspace의 일부입니다 — 모노레포 전체 명령어/컨텍스트는 레포 루트의
`CLAUDE.md`를 참고하세요.

## 명령어

별도 언급이 없으면 (pnpm workspace 스크립트이므로) 이 디렉토리가 아니라 **레포 루트**에서
실행하세요:

```bash
pnpm dev:front                              # next dev, :3000
pnpm --filter meta-scan-front build         # next build
pnpm --filter meta-scan-front start         # next start (프로덕션 빌드 서빙)
pnpm --filter meta-scan-front lint          # eslint (next/core-web-vitals, next/typescript)
```

테스트 스크립트는 없습니다 — 테스트 러너가 있다고 가정하지 마세요.

로컬 개발 시 `packages/meta-scan-front/.env.local`에
`NEXT_PUBLIC_META_SCAN_API=http://localhost:8080`(또는 `meta-scan-api`가 실행 중인 위치)이
필요합니다 — gitignore 대상이며 자동으로 생성되지 않습니다.

## 아키텍처

`src/app/[lang]/` 아래 로케일 프리픽스 라우팅을 쓰는 Next.js App Router.

- `src/middleware.ts` — 정적/API가 아닌 모든 요청에서 `theme`/`lang` 쿠키를 읽고(최초 방문 시
  `Accept-Language`로 기본값 설정), URL에 로케일 프리픽스가 없으면 로케일 프리픽스 경로로
  리다이렉트합니다(`/` → `/ko/` 또는 `/en/`). 허용 로케일/쿠키 키/기본값은 `src/constans/index.ts`에
  있습니다.
- `src/dictionaries/` — `en.json`/`ko.json`을 `getDictionary(locale)`로 로케일별 지연 로딩
  (`src/dictionaries/index.ts`, `"server-only"` — 클라이언트 컴포넌트가 아니라 서버 컴포넌트/레이아웃에서
  호출하세요).
- `src/apis/` — `index.ts`가 `NEXT_PUBLIC_META_SCAN_API`를 `baseURL`로 하는 공유 `axios` 인스턴스를
  만들고, 도메인별 호출 파일(예: `scan.ts`)이 `meta-scan-api` 엔드포인트를 감쌉니다. **주의할 불일치
  지점**: 일부 호출은 공유 `instance`의 `baseURL`만 사용하고(`sitePingApi`), 다른 일부는 같은
  인스턴스 위에 `NEXT_PUBLIC_META_SCAN_API`를 경로 앞에 명시적으로 다시 붙입니다(`scanRobotsTxtApi`
  등) — 새 호출을 추가하기 전에 기존 호출이 어떤 패턴을 따르는지 확인하고, `baseURL`만으로 충분하다고
  가정하지 마세요.
- `src/stores/scanStore.ts` — 이전에 요청한 스캔 URL을 `localStorage`에 영속화하는 Zustand 스토어.
- `src/templates/` — 페이지/기능별로 묶은 페이지 섹션 컴포넌트(`main/`, `request-scan/`, `root/`)이며,
  `src/components/ui/`의 범용적이고 대체로 shadcn 스타일인 프리미티브와는 구분됩니다.
- 경로 별칭 `@/*` → `src/*` (`tsconfig.json` 참고).

## 환경 변수

`NEXT_PUBLIC_META_SCAN_API` — `meta-scan-api`의 base URL. 로컬 개발 시 `.env.local`에 설정해야
하고(위 명령어 섹션 참고), 프로덕션(Vercel)에서는 빌드/배포 시점 환경변수로 설정합니다.
