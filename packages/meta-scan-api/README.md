# meta-scan-api

`meta-scan`(모노레포 루트 [`README.md`](../../README.md) 참고)의 백엔드. URL 하나를 받아
ping/robots.txt/sitemap.xml을 확인하고, 헤드리스 Chrome으로 페이지를 직접 크롤링해 메타 태그·
OG·이미지 alt 등을 추출하고 SEO 체크를 돌리고, Lighthouse 감사(성능·SEO·접근성·모범사례)를
실행합니다.

## 아키텍처

Hexagonal(Ports & Adapters) 3계층 — `domain/`(포트 인터페이스 + 도메인 로직) /
`application/`(유스케이스) / `adapters/`(inbound: HTTP 컨트롤러·라우터, outbound:
`PuppeteerAdapter`/`ChromeLauncherAdapter`). 상세는 [`CLAUDE.md`](CLAUDE.md)와
[`docs/case-study/backend-hexagonal-architecture.md`](../../docs/case-study/backend-hexagonal-architecture.md)
참고.

## 엔드포인트

의도적으로 개별 스캔 엔드포인트만 있고, 이를 하나로 합치는 통합 엔드포인트는 없습니다
([ADR-003](../../docs/adr/index.html#adr-003)) — 프런트가 4개를 병렬 호출해 단계별 진행을
보여주기 위함입니다.

| 메서드/경로 | 설명 |
|---|---|
| `POST /api/v1/scan/ping` | 대상 URL이 살아있는지 HEAD 요청으로 확인 |
| `POST /api/v1/scan/robotsTxt` | robots.txt 파싱 + 매칭 (비허용 시 나머지 호출 게이팅용, [ADR-006](../../docs/adr/index.html#adr-006)) |
| `POST /api/v1/scan/siteMap` | sitemap.xml 존재 확인 |
| `POST /api/v1/scan/crawling` | 원본/렌더링 HTML 비교, 메타/OG/이미지 alt 추출, SEO 체크 판정 |
| `POST /api/v1/lighthouse/run` | Lighthouse 감사 실행 |
| `GET /api/v1/healthz` | API 서버 자체 헬스체크 |
| `GET /api/docs` | Swagger UI |

전체 스펙은 `/api/docs`(로컬: `http://localhost:8080/api/docs`)에서 확인하세요.

## 개발

레포 루트에서 실행하세요 (pnpm workspace):

```bash
pnpm install
pnpm dev:api                 # tsx watch, :8080
pnpm --filter meta-scan-api build
pnpm --filter meta-scan-api lint
pnpm --filter meta-scan-api typecheck
pnpm test:api                 # Vitest
```

환경 변수, Docker 빌드 방법 등은 [`CLAUDE.md`](CLAUDE.md)와 레포 루트
[`CLAUDE.md`](../../CLAUDE.md)를 참고하세요.
