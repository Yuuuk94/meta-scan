# Frontend Component Architecture: Atomic Design + api/services/hooks

> [ADR-010](adr/index.html#adr-010)의 원문입니다. [ADR-009](adr/index.html#adr-009)(FSD-lite)를
> 대체합니다 — ADR-009는 사용자 인터뷰 없이 AI 세션이 일방적으로 작성한 결정이었던 것으로
> 확인되어 무효화됐습니다(2026-08-21). 이 문서는 사용자와 단계별 확인(`AskUserQuestion`)을
> 거쳐 다시 결정한 내용이며, 2026-08-21에 `meta-scan-front` 코드에 실제로 반영됐습니다
> (6장 "변경 이력" 참고 — 이동 도중 `ui/` 재중첩 등 소폭 조정 있었음).

## 1. 배경

`docs/design-system.md`(ADR-008, 진 인덱스 톤)로 확정된 와이어프레임을 실제
`meta-scan-front` 코드로 옮기기에 앞서, "UI 컴포넌트"와 "기능(데이터 페칭·판정 취합·상태)"을
어떻게 분리할지 아키텍처를 정했습니다. 지금 남은 진짜 작업(`ProcessScreen`이 4개 API 응답을
버리는 것, `/scan`이 `Math.random()` 목업인 것, `combineScanResults` 취합 로직이 없는 것 —
`CLAUDE.md` 참고)이 전부 "기능" 쪽에 몰려 있어서, 이 경계를 어디에 어떻게 그을지가 핵심
질문이었습니다. ADR-009와 문제의식은 같지만, 이번엔 계층을 압축하지 않고 정석 Atomic Design
5계층을 그대로 쓰기로 방향이 바뀌었습니다 — 압축판(FSD-lite)에서 실제로 "이 컴포넌트가 어느
계층인지" 애매함이 반복 발생했기 때문입니다(3장 참고).

## 2. 결정: Atomic Design 5계층 + api/services/hooks 기능 분리

정석 Atomic Design 5계층(atoms/molecules/organisms/templates/pages)을 압축 없이 그대로
사용합니다. Atomic Design은 "UI를 얼마나 잘게 쪼갤지"만 정의하고 "기능 코드가 어디 사는지"는
정의하지 않으므로, 별도로 `api/`/`services/`/`hooks/` 3계층을 얹습니다.

```
ui/          Atomic Design 4계층을 전부 담는 상위 폴더(2026-08-21 추가) — "기능"(api/services/
             hooks)과 최상위에서 시각적으로 분리하기 위해 atoms/molecules/organisms/templates를
             ui/ 밑으로 묶음. ADR-010 원 결정(계층 자체)은 안 바뀌고 물리적 위치만 한 단계 더
             중첩됨 — 상세는 6장 "변경 이력" 참고.

ui/atoms/       가장 작은 단위, 더 쪼갤 수 없는 프리미티브 (Button, Input, Badge, Rule,
                NumberLabel, Loading)

ui/molecules/   atoms를 조합한 작은 단위, 도메인 지식 없음 (Card, Tabs, Accordion, StatusBadge,
                ToggleSetting, ProcessStep)

ui/organisms/   자기완결적인 조립 섹션. 데이터 페칭 훅을 쓸 수 있음 (RootHeader, RootFooter,
                ServiceStatus, HeroSection, ProcessSection, FAQSection, ProcessScreen, ErrorScreen,
                BlockedScreen)

ui/templates/   organisms를 배치만 하는 라우트별 뼈대(실제 데이터 없는 레이아웃). 이번 마이그레이션
                패스에서는 빈 폴더로만 만들고 채우지 않음 — 후속 작업

pages/          Next.js App Router의 app/[lang]/**/page.tsx가 이 역할을 겸함. 별도 폴더를 만들지
                않음 — Next.js가 이미 라우팅 규칙으로 이 이름을 강제하기 때문

api/         axios로 실제 네트워크 I/O를 하는 함수 (scanApi, statusApi, 공유 axios 인스턴스).
             목킹이 필요한 계층

services/    순수 함수 — combineScanResults, ADR-006 게이팅 로직. React도 네트워크도 모름,
             목킹 없이 단위테스트 가능

hooks/       클라이언트 컴포넌트 전용 데이터 연결/상태 계층. React Query(useQuery/useMutation)를
             감싸는 자리로 예약 — 이번 패스에서는 폴더만 만들고 비워둠(설치는 후속 작업)
```

**핵심 규칙**:
- 계층을 압축하지 않는다 — atoms/molecules/organisms/templates 경계가 애매해 보여도 "이건 A면서
  B" 식으로 합치지 않고, 실제 복잡도 기준으로 명확히 분류한다.
- `api/`(I/O) / `services/`(순수 로직) / `hooks/`(React 상태) 는 성격이 다른 코드다 — 셋을 한
  폴더에 섞지 않는다.
- **서버 컴포넌트**(`app/[lang]/**/page.tsx`)는 React 훅을 쓸 수 없으므로 `hooks/`를 거치지
  않고 `api/`를 직접 호출한다 — Next.js App Router의 관용 패턴이며, 별도 로더 계층을
  만들지 않는다. `hooks/`는 `"use client"` 컴포넌트 전용이다.

## 3. 이 결정에 이르게 된 과정 (ADR-009와의 차이)

사용자와 순차 인터뷰(한 번에 하나씩 확인)로 다음 순서로 확정했습니다:

1. **압축 vs 정석**: FSD-lite 시도 중 "`RootHeader`/`HeroSection`처럼 로직 없는 조립 블록을
   어디 둘지" 3개 옵션을 놓고도 애매함이 남았던 것이, `features`와 `widgets`를 억지로 합친
   압축 자체의 부작용이라는 문제의식이 나옴 → 계층을 압축하지 않는 정석 Atomic Design 5계층
   채택.
2. **기능 코드 위치**: Container/Presentational, 커스텀 훅 단일 계층, `services+hooks` 분리,
   얕은 `features/` 폴더 혼용 4개 옵션 비교 → 테스트 전략이 계층별로 명확히 갈리는
   `services`(순수, 목킹 불필요) + `hooks`(React, 목킹 필요) 분리 채택. (`docs/dev-lifecycle-harness.md`가
   "테스트 러너 인프라 구축"을 1순위로 두고 있어 이 방향과 맞음)
3. **네트워크 I/O 위치**: `services/`와 별개로 `api/` 폴더를 분리 — I/O가 있는 코드와 순수
   함수를 한 폴더에 섞으면 "services는 목킹 없이 테스트 가능"이라는 전제가 깨지기 때문.
4. **서버 컴포넌트 데이터 로딩**: `ProcessScreen.tsx`는 클라이언트 컴포넌트(`"use client"`)라
   훅을 쓸 수 있지만, `request-scan/page.tsx`·`scan/page.tsx`는 서버 컴포넌트라 애초에 훅을
   못 쓴다는 게 확인됨 → `loaders/` 같은 대칭 폴더를 새로 만들지 않고, 서버 컴포넌트는 지금처럼
   `api/`를 직접 호출하는 Next.js 관용 패턴 유지.
5. **React Query 도입 시점**: 클라이언트 데이터 페칭에 React Query를 쓰기로 방향은 정했지만,
   실제 설치 + `QueryClientProvider` 배선은 새 인프라 작업이라 이번 "순수 이동" 스코프를
   넘어선다고 판단 → `hooks/` 폴더 자리만 예약, 설치는 후속 작업.
6. **이번 마이그레이션 패스의 범위**: `ProcessScreen.tsx`처럼 UI와 API 호출이 이미 섞여 있는
   기존 파일을 쪼갤지 여부 → 이번 패스는 "순수 이동"으로 한정, 쪼개지 않고 통째로 이동.
   같은 이유로 `templates/` 계층(organisms를 배치만 하는 신규 조립 파일)도 이번엔 만들지 않고
   빈 폴더로만 남김.

## 4. 파일 이동 매핑 (이번 마이그레이션 패스)

```
ui/atoms/       Button, Input, Badge, Rule, NumberLabel  ← components/ui/*
                Loading                                    ← components/Loading.tsx

ui/molecules/   Card, Tabs, Accordion, StatusBadge         ← components/ui/*
                ToggleSetting                               ← templates/root/ToggleSetting.tsx
                ProcessStep                                 ← templates/request-scan/ProcessStep.tsx

ui/organisms/   RootHeader, RootFooter, ServiceStatus       ← templates/root/*
                HeroSection, ProcessSection, FAQSection     ← templates/main/*
                ProcessScreen, ErrorScreen, BlockedScreen   ← templates/request-scan/*
                (ProcessScreen은 "use client" + API 호출 그대로, 통째 이동)

ui/templates/   (빈 폴더 + TODO 주석만 — HomeTemplate 등은 후속 작업)

pages/          app/[lang]/**/page.tsx 그대로 (Next.js 라우팅 강제, 이름 변경 불가)

api/         instance   ← apis/index.ts (axios 공유 인스턴스)
             scanApi    ← apis/scan.ts
             statusApi  ← apis/status.ts

services/    combineScanResults.ts  (신규 TODO 스텁)
             scanGating.ts          (ADR-006 게이팅, 신규 TODO 스텁)

hooks/       (빈 폴더 + TODO 주석 — React Query 훅 자리, 후속 작업)

그대로 유지: utils/(cn.ts 추가), constans/, css/, dictionaries/, types/, middleware.ts
```

`api/`, `services/`, `hooks/`는 `ui/`와 형제 레벨로 `src/` 최상위에 남습니다 — "기능"과 "UI"의
분리를 최상위 폴더에서 바로 드러내는 게 목적입니다(6장 참고).

이동 후 비는 `components/`, 구 `templates/`, `apis/` 폴더는 삭제합니다. `@/templates/...`,
`@/apis/...`, `@/components/...` 경로를 참조하는 모든 import를 새 경로로 갱신해야 하며,
`pnpm --filter meta-scan-front lint`(+ typecheck가 있다면)로 누락 여부를 확인합니다.

## 5. 결과 / 아직 안 정한 것

- 2026-08-21에 실제로 이동 완료했습니다(`pnpm --filter meta-scan-front lint`/`build` 통과,
  로컬 `pnpm dev:api`+`pnpm dev:front`로 전 라우트 200 확인).
- `ui/templates/`(Atomic) 계층의 실제 내용(`HomeTemplate` 등)과 `hooks/`의 React Query 배선은
  의도적으로 이번 범위 밖 — 후속 작업으로 남습니다.
- `services/combineScanResults.ts`, `services/scanGating.ts`의 실제 판정 로직은 TODO 스텁만
  만들고 채우지 않습니다 — 이번은 폴더 구조 이동이지 기능 구현이 아닙니다.

## 6. 변경 이력

- 2026-08-21 — 이동 실행 중 사용자 제안으로 `atoms/molecules/organisms/templates` 4개를
  `ui/` 하위로 재중첩(`ui/atoms/`, `ui/molecules/`, `ui/organisms/`, `ui/templates/`) —
  "UI vs 기능" 분리를 `src/` 최상위에서 바로 드러내기 위함. `api/`/`services/`/`hooks/`는
  `ui/`와 형제 레벨로 최상위에 그대로 둠. ADR-010의 핵심 결정(계층 자체, 기능 3분리)은
  안 바뀌었고 물리적 중첩 위치만 조정됨.
