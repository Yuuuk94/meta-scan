# META_SCAN.BIZ — 이력서·포트폴리오용 정리

> 전부 저장소/GitHub에서 확인되는 사실 기준. `[ ]` 표시는 본인이 채워야 하는 수치.

## 한 줄 소개

URL 하나로 SEO·AEO·GEO 체크리스트(메타 태그, robots.txt, sitemap, 구조화 데이터, AI 크롤러/llms.txt, Lighthouse)를 판정해 주는 무료 웹 서비스를 기획·설계·개발·운영 (1인, 2025.08 ~ 현재) — https://meta-scan.biz

## 기술 스택

- **Front**: Next.js 15 (App Router, SSG/서버 컴포넌트), TypeScript, Tailwind, Jest + Testing Library, Vercel
- **API**: Node.js, Express, TypeScript, Zod, Puppeteer, Lighthouse(chrome-launcher), Vitest, Docker, Google Cloud Run / Cloud Build
- **공통**: pnpm workspace 모노레포, GitHub Actions CI, husky + lint-staged + commitlint, Google AdSense, GA4

## 이력서 bullet (골라 쓰기)

### 설계·아키텍처
- 별도 저장소였던 프론트/백엔드를 `git subtree`로 **커밋 히스토리를 보존한 채 pnpm workspace 모노레포로 통합**, Yarn Berry와 비교한 근거를 ADR로 기록
- 백엔드를 레이어드 구조에서 **Hexagonal(Ports & Adapters) 3계층으로 전환** — 브라우저 자동화(Puppeteer)와 Lighthouse 실행기를 포트로 분리해 테스트 가능하게 만듦
- 프론트를 **Atomic Design 5계층 + api/services/hooks 분리** 구조로 재편, 판정·취합 로직을 순수 함수(services)로 빼 단위 테스트
- 단일 `/analyze` 엔드포인트 대신 **4개 스캔 API 병렬 오케스트레이션**을 택해 단계별 진행 UI가 실제 완료 시점에 반응하도록 설계, robots.txt 선검사로 차단 사이트는 나머지 스캔을 생략해 **Cloud Run 비용 절감**
- 설계 결정 12건을 **ADR**(대안 비교·결과·변경 이력)로 문서화

### 품질·자동화
- **테스트 830개**(front Jest 729 / api Vitest 101) 작성, GitHub Actions CI에서 lint·typecheck·test 자동 실행
- Conventional Commits + 브랜치 전략(feat→dev→release→main, hotfix) 정립, 릴리스 버전 관리(현재 0.5.4)
- **AI 코딩 에이전트(Claude Code) 하네스 직접 설계**: 이슈 인터뷰 → TDD 구현 → QA → PR까지 이어지는 에이전트 9종·스킬 5종을 구성해 1인 개발 파이프라인 자동화

### SEO·성능 (실무 경험과 연결)
- 다국어 라우팅 버그(쿠키가 URL 언어를 덮어써 `/en`이 한국어로 노출 → 중복 콘텐츠) 진단·수정, **hreflang·canonical·페이지별 메타데이터·JSON-LD**(WebApplication/Organization/Article/FAQ/Breadcrumb) 적용
- 동적 sitemap·robots·llms.txt 생성, 결과 셸 페이지 noindex 등 **색인 품질 관리**
- 한/영 **기술 블로그 30편**을 사이트 내 정적 생성 콘텐츠로 구축(품질 기준을 테스트로 강제: 분량·title·description 길이·언어쌍)
- 이전 직장: 프론트엔드 개발자로 SEO·Lighthouse 기준 개선 작업을 주도해 **MAU 350% 상승** — [회사/기간/본인 역할 채우기]

## 수치 (2026-11-13 기준)

| 항목 | 값 |
|---|---|
| 커밋 | 314 |
| 머지된 PR | 54 |
| 처리한 이슈(close) | 31 |
| 테스트 | 830 (front 729 / api 101) |
| ADR | 12건 |
| 블로그 | 30편 (ko 15 / en 15) |
| 월 방문자·검색 노출 | [GA4·Search Console에서 채우기] |

## 면접에서 이야기할 거리

1. **스코어링 엔진을 왜 버렸나** — 0–100 합산 점수 기획을 폐기하고 pass/warning/fail/info 체크리스트로 전환(ADR-005). 근거 없는 가중치보다 항목별 판정이 사용자에게 행동 가능하다는 판단.
2. **Cloud Run에서 Puppeteer가 500 나던 문제** — 빌드 스테이지에만 있던 번들 Chromium을 런타임에서 찾던 문제를 실제 컨테이너 기동 테스트로 찾아 시스템 Chromium 공유로 해결.
3. **테스트 러너를 패키지별로 다르게 고른 이유** — 기술적으론 둘 다 Vitest가 유리했지만 학습 목적으로 Jest/Vitest를 의도적으로 나눔(ADR-012). 트레이드오프를 알고 선택했다는 점.
4. **애드센스 '가치 없는 콘텐츠' 반려 대응** — 도구만 있는 사이트의 한계를 콘텐츠·색인 구조로 해결한 과정.
