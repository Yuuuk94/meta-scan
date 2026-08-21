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
- **컴포넌트는 Atomic Design 5계층**([ADR-010](../../docs/adr/index.html#adr-010),
  `docs/frontend-atomic-architecture.md`) — `src/ui/atoms/`(더 못 쪼개는 프리미티브: Button/Input/
  Badge/Rule/NumberLabel/Loading) → `src/ui/molecules/`(atoms 조합, 도메인 지식 없음: Card/Tabs/
  Accordion/StatusBadge/ToggleSetting/ProcessStep) → `src/ui/organisms/`(자기완결적 조립 섹션,
  데이터 페칭 훅 사용 가능: RootHeader/RootFooter/ServiceStatus/HeroSection/ProcessSection/
  FAQSection/ProcessScreen/ErrorScreen/BlockedScreen) → `src/ui/templates/`(organisms를 배치만
  하는 라우트별 뼈대 — **아직 빈 폴더**, 후속 작업) → `pages`는 Next.js
  `app/[lang]/**/page.tsx`가 겸함(별도 폴더 없음, 라우팅 규칙상 이름을 못 바꿈).
- `src/api/` — `instance.ts`가 `NEXT_PUBLIC_META_SCAN_API`를 `baseURL`로 하는 공유 `axios`
  인스턴스를 만들고, 도메인별 호출 파일(`scanApi.ts`, `statusApi.ts`)이 `meta-scan-api` 엔드포인트를
  감쌉니다. **주의할 불일치 지점**: 일부 호출은 공유 `instance`의 `baseURL`만 사용하고
  (`sitePingApi`), 다른 일부는 같은 인스턴스 위에 `NEXT_PUBLIC_META_SCAN_API`를 경로 앞에 명시적으로
  다시 붙입니다(`scanRobotsTxtApi` 등) — 새 호출을 추가하기 전에 기존 호출이 어떤 패턴을 따르는지
  확인하고, `baseURL`만으로 충분하다고 가정하지 마세요.
- `src/services/` — 순수 판정/취합 로직 자리(`combineScanResults.ts`, `scanGating.ts`). **둘 다
  아직 TODO 스텁**입니다 — 4-API 취합과 ADR-006 게이팅 로직은 구현되지 않았습니다.
- `src/hooks/` — 클라이언트 컴포넌트 전용 React Query 훅 자리. **아직 빈 폴더**입니다 —
  React Query가 설치돼 있지 않고(`@tanstack/react-query` 의존성 없음), `ProcessScreen.tsx`는
  여전히 수작업 `useEffect`/`Promise.allSettled`로 fetch합니다. 서버 컴포넌트
  (`app/[lang]/**/page.tsx`)는 애초에 훅을 못 쓰므로 `src/hooks/`를 거치지 않고 `src/api/`를
  직접 호출합니다.
- `zustand`는 `package.json` 의존성으로 남아있지만 실제 스토어 파일은 저장소에 존재하지 않습니다 —
  "이전 요청 URL 저장"은 쿠키(`crrUrlKey`, 아래 상태관리 절 참고)로 이미 구현되어 있습니다. 이
  의존성을 실제로 쓰려면 스토어를 새로 만들어야 합니다.
- 경로 별칭 `@/*` → `src/*` (`tsconfig.json` 참고).

## 구현 패턴

### 컴포넌트 구현 패턴

- **선언 방식이 계층별로 갈립니다**: `ui/organisms/`의 프레젠테이션 컴포넌트(`HeroSection`,
  `FAQSection`, `ProcessSection`, `RootHeader`, `RootFooter`, `ServiceStatus`)와
  `ui/molecules/ToggleSetting.tsx`, `ui/molecules/ProcessStep.tsx`, `ui/atoms/Loading.tsx`는 전부
  `export const Xxx = (props) => {...}` 화살표 함수 상수입니다. 반면 페이지급 컴포넌트
  (`RootLayout`, `RequestScanPage`, `ScanPage`)와 `ui/organisms/ProcessScreen`/
  `ui/organisms/ErrorScreen`(화면 전환 단위)은 `export function Xxx(props) {...}` function
  선언을 씁니다. 새 컴포넌트를 추가할 때 "섹션/프리젠테이션"이면 화살표 상수, "페이지 또는
  화면 전환 단위"면 function 선언을 따르세요.
- **`theme`/`lang`을 props로 계속 내려주는 프롭 드릴링**: 전역 테마 Context/Provider가 없고, 서버
  컴포넌트(`RootLayout`)에서 쿠키로 읽은 `theme`/`lang`을 모든 하위 컴포넌트에 `DefaultProps`
  (`theme`, `lang`) 또는 `DefaultPageProps`(`+ t`: 사전 객체)로 계속 전달합니다. 새 컴포넌트도 이
  프롭을 받아쓰는 쪽으로 맞추세요 — `useContext`로 테마를 읽는 코드는 없습니다.
- **다크/라이트 분기는 매 엘리먼트에서 인라인 삼항 연산자**: 디자인 토큰이나 CSS 변수로 추상화하지
  않고 `` className={`... ${theme === "dark" ? "bg-x" : "bg-y"}`} ``를 요소마다 반복합니다
  (`HeroSection`, `ProcessScreen`, `scan/page.tsx` 등 전 영역에서 지배적인 스타일). 기존 파일을
  고칠 때는 이 패턴을 따라야 일관됩니다.
- **`ui/atoms/`·`ui/molecules/`의 shadcn 계열 컴포넌트는 shadcn 골격**: `cva`로 variant/size 정의 →
  `cn()`(`clsx` + `tailwind-merge`, `utils/cn.ts`)으로 className 병합 → `data-slot` 속성 →
  named export(`export { Button, buttonVariants }`). 새 범용 프리미티브를 추가할 때 이 뼈대를
  그대로 복제하세요.
- **다국어 카피가 두 갈래**: 정식 카피는 `t.xxx`(사전에서 로드)를 쓰지만, 일부 화면(`HeroSection`의
  URL 유효성 에러 문구, `RootFooter`의 카피라이트, `FAQSection`의 CTA 문구)은 사전에 없는 임시 문구를
  `lang === "en" ? "..." : "..."` 하드코딩 삼항으로 처리합니다. 새 문구는 가능하면
  `dictionaries/{en,ko}.json`에 키를 추가하는 쪽이 원칙이며, 하드코딩 삼항은 기존에 새어나간 예외로
  취급하세요.

### 상태관리 방식

- **로컬 UI 상태는 `useState`/`useEffect`/`useRef` + `"use client"`**가 기본입니다. 전역 상태
  라이브러리 사용은 사실상 없습니다.
- **`stores/scanStore.ts`(Zustand)는 어디서도 import되지 않는 죽은 코드**입니다. 스토어 이름도
  `useBearStore`/`persist` 키 `"food-storage"`로, zustand 공식 예제 보일러플레이트를 그대로 복사해둔
  상태라 실제 도메인과 무관합니다 — "이전 요청 URL 저장"이라는 의도된 기능은 대신 쿠키
  (`crrUrlKey`)로 이미 구현되어 있습니다(`utils/cookies.ts`의 `setDocumentCookies` +
  `utils/siteSetting.ts`의 `getSiteSetting`). 이 스토어를 실제로 쓰려면 이름부터 도메인에 맞게 고쳐야
  하고, 그전까지는 신규 상태를 여기 추가하지 마세요.
- **서버/공유 상태는 쿠키로 서버 컴포넌트와 미들웨어 사이를 오갑니다**: `theme`/`lang`/`crrUrl`을
  클라이언트에서 쓸 때는 `document.cookie`를 직접 다루는 `setDocumentCookies`만 쓰고, 읽을 때는
  서버 컴포넌트에서 `next/headers`의 `cookies()`를 감싼 `getSiteSetting()`만 씁니다 — 클라이언트
  컴포넌트에서 쿠키를 직접 파싱해 읽는 코드는 없습니다(읽기는 항상 서버, 쓰기는 항상 클라이언트).

### API 호출 패턴

- `src/api/<domain>Api.ts`(예: `scanApi.ts`, `statusApi.ts`)에 `export const xxxApi = async (data) =>
  await instance.post<ResponseType>(path, data)` 형태의 얇은 axios 래퍼 함수를 나열합니다. 함수
  내부에 `try/catch`가 없고 프로미스를 그대로 반환하므로, 에러 처리는 항상 호출부(페이지/컴포넌트)의
  책임입니다. `instance`는 `src/api/instance.ts`에서 가져옵니다.
- 응답 제네릭은 `src/types/*.d.ts`의 전역 인터페이스(`SiteStatusData`, `RobotsTxtData`,
  `SiteMapData`, `OkStatus`)를 그대로 사용합니다. 다만 백엔드 반환 타입이 아직 안정되지 않은
  `scanCrawlingApi`/`lsRunApi`는 응답 타입을 `unknown`으로 열어둡니다 — 위 "현재 상태"에서 설명한
  `/scan` 목업 상태와 맞물려 있는 지점이니, 실제 타입을 채우는 작업을 할 때 함께 손보세요.
- **호출 컨텍스트별로 실행 방식이 다릅니다**: 서버 컴포넌트(`RootLayout`의 `pingApi`,
  `RequestScanPage`의 `sitePingApi`)는 단건 `await`으로 직접 호출합니다. 클라이언트 컴포넌트
  (`ProcessScreen`)는 여러 API를 `Promise.allSettled`로 병렬 실행한 뒤 `.then()/.catch()`로 각각
  처리합니다.
- baseURL 사용이 API 함수마다 다른 불일치는 위 "아키텍처" 절에 이미 설명되어 있습니다 — 새 호출을
  추가하기 전에 반드시 확인하세요.

### 네이밍 패턴

- **컴포넌트 파일명은 PascalCase = 컴포넌트 이름과 1:1** (`HeroSection.tsx` → `HeroSection`,
  `ui/atoms/Button.tsx` → `Button`). ADR-010 마이그레이션 이전엔 `components/ui/*`가 shadcn CLI
  기본값인 kebab-case(`button.tsx`)를 예외로 유지했었지만, `ui/atoms/`·`ui/molecules/`로 옮기면서 이
  예외를 없애고 나머지 컴포넌트와 동일하게 PascalCase로 통일했습니다.
- **API 함수명은 `<도메인><동사>Api`**가 원칙입니다(`sitePingApi`, `scanRobotsTxtApi`,
  `scanSiteMapApi`, `scanCrawlingApi`). 유일한 예외는 `lsRunApi`(Lighthouse 실행) — 다른 함수들처럼
  `scan`/`site` 접두어를 쓰지 않고 `ls`(lighthouse 축약)를 씁니다. 새 lighthouse 관련 API를 추가할
  때 이 접두어를 따를지, 나머지 다수 패턴(`scanXxxApi`)에 맞출지 먼저 정하세요.
- **Props 타입**: 컴포넌트 전용 프롭은 `XxxProps` interface로 선언하고, 여러 컴포넌트가 공유하는
  `theme`/`lang`(`+t`)은 전역 `DefaultProps`/`DefaultPageProps`를 `extends`합니다.
- **쿠키/스토리지 키 상수는 `xxxKey` 접미사**로 표기합니다(`themeKey`, `langKey`, `crrUrlKey`,
  전부 `src/constans/index.ts`).
- **기존 오타가 컨벤션처럼 굳어 있는 지점**: 디렉토리명 `constans/`(constants의 오타),
  `ProcessScreen.tsx`의 지역 변수 `promistList`(promise의 오타). 새 코드에서 따라 하지 말고, 기존
  것을 고칠 땐 이름 변경이 import 경로 등 다른 곳에 영향을 주는 리네임 범위인지 먼저 확인하세요.

## 환경 변수

`NEXT_PUBLIC_META_SCAN_API` — `meta-scan-api`의 base URL. 로컬 개발 시 `.env.local`에 설정해야
하고(위 명령어 섹션 참고), 프로덕션(Vercel)에서는 빌드/배포 시점 환경변수로 설정합니다.
