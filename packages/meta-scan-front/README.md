# meta-scan-front

`meta-scan`(모노레포 루트 [`README.md`](../../README.md) 참고)의 프론트엔드. Next.js 15
(App Router)로 `meta-scan-api`를 호출해 스캔 결과를 pass/warning/fail/info 체크리스트로
렌더링합니다.

## 아키텍처

`src/app/[lang]/` 아래 로케일 프리픽스 라우팅 + Atomic Design 5계층
(`src/ui/atoms|molecules|organisms|templates`) + `api/services/hooks` 기능 분리
([ADR-010](../../docs/adr/index.html#adr-010)). 상세는 [`CLAUDE.md`](CLAUDE.md)와
[`docs/case-study/frontend-atomic-architecture.md`](../../docs/case-study/frontend-atomic-architecture.md)
참고.

## 개발

레포 루트에서 실행하세요 (pnpm workspace):

```bash
pnpm install
pnpm dev:front                # next dev, :3000
pnpm --filter meta-scan-front build
pnpm --filter meta-scan-front lint
pnpm test:front                # Jest
```

로컬 개발 시 `packages/meta-scan-front/.env.local`에
`NEXT_PUBLIC_META_SCAN_API=http://localhost:8080`(또는 `meta-scan-api`가 실행 중인 위치)이
필요합니다 — gitignore 대상이며 자동으로 생성되지 않습니다.

환경 변수 전체 목록, 배포(Vercel) 관련 사항은 [`CLAUDE.md`](CLAUDE.md)와 레포 루트
[`CLAUDE.md`](../../CLAUDE.md)를 참고하세요.
