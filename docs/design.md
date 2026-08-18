# 디자인 시스템 — meta-scan-front

> 2026-08-13, `packages/meta-scan-front`의 시각적 디자인을 전면 재작업하며 정립한 토큰/컴포넌트
> 규칙을 정리한 문서입니다. `docs/architecture/index.html`("아키텍처")과는 다른 주제입니다 — 그
> 문서는 저장소 구조/스택/구현 패턴 같은 **기술 설계**를 다루고, 이 문서는 색상·타이포·다크모드
> 같은 **UI/UX 디자인 시스템**을 다룹니다.

## 0. 이전 상태와 무엇이 바뀌었나

작업 전 전 화면(헤더/푸터/히어로/프로세스/FAQ/스캔 진행화면/`/scan` 결과 페이지)은 다음과 같은 상태였습니다:

- shadcn 기본 스캐폴드 토큰(oklch 보라 계열 `--primary: #030213`)이 그대로 남아있었음
- 실제 화면은 그 토큰을 쓰지 않고 `theme === "dark" ? "..." : "..."` 삼항 연산자로 요소마다
  cyan→purple→pink 그라디언트, `backdrop-blur`, glow 섀도우를 직접 나열
- 점수/상태 표시가 등급과 무관하게 cyan/purple/pink 3색을 장식적으로만 사용(의미 매핑 없음)
- `components/ui/*`(button/badge/tabs)는 이미 Tailwind `dark:` 클래스로 작성돼 있었지만, 이를
  앱의 테마 쿠키와 연결하는 `@custom-variant dark` 선언이 **주석 처리된 채 방치**돼 있어 OS의
  `prefers-color-scheme`을 따르는 실제 버그였음
- 푸터에 `SCANS: 247,891` 같은 조작된 통계, 에러 화면이 "사이트 분석 중입니다..." 문구를 잘못
  재사용하는 등 콘텐츠 버그도 동반

지금은 화이트/차콜 중립 + 인디고 단일 포인트 컬러 토큰 체계로 전체를 재작업했고, 다크모드는
`data-theme` 쿠키 하나로 `components/ui/*`와 나머지 화면이 동일하게 반응합니다.

이 문서는 전체 개요입니다. 영역별 상세는 아래 문서로 분리돼 있습니다(모두 `docs/design/`):

- [`colors.md`](./design/colors.md) — 컬러 팔레트, 의미별 매핑(primary/secondary/surface/text/state)
- [`typography.md`](./design/typography.md) — 폰트 패밀리, 크기 스케일, 굵기, 줄 간격
- [`spacing.md`](./design/spacing.md) — 스페이싱 스케일, 컨테이너/그리드 패턴
- [`components.md`](./design/components.md) — 재사용 컴포넌트 패턴(버튼/카드/인풋/모달 + 화면 레벨 합성 패턴)

## 1. 토큰 (`src/css/globals.css`)

### 1.1 컬러

| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--background` / `--foreground` | `#ffffff` / `#16181d` | `#0b0c10` / `#eceef1` | 페이지 배경/기본 텍스트 |
| `--card` / `--card-foreground` | `#ffffff` / `#16181d` | `#131419` / `#eceef1` | 카드 표면 (다크에서 배경보다 한 단 밝게 — 계단식 elevation) |
| `--muted` / `--muted-foreground` | `#f4f5f7` / `#686e79` | `#1a1c22` / `#9a9fab` | 보조 배경, 저강조 텍스트 |
| `--border` / `--input` | `#e6e8ec` | `#24262e` | 테두리, 인풋 보더 |
| `--primary` / `--primary-foreground` | `#4f46e5` / `#ffffff` | `#6366f1` / `#ffffff` | 단일 포인트 컬러(인디고) — 버튼, 액티브 상태, 강조 아이콘 |
| `--secondary` / `--secondary-foreground` | `#eef0ff` / `#362f9e` | `#1c1b3a` / `#c7d2fe` | 포인트 컬러의 은은한 배경 톤(배지 등) |
| `--success` / `--warning` / `--destructive` | `#16803c` / `#b45309` / `#d1293d` | `#34a260` / `#d69433` / `#e35267` | **점수/상태의 의미 색** — 등급별 무지개색이 아니라 좋음/보통/나쁨에 고정 매핑 |

라이트는 `:root`에, 다크는 `:root[data-theme="dark"]`에 같은 이름으로 재정의합니다. 화면 코드는
`bg-primary`/`text-success`처럼 토큰만 참조하고, 라이트/다크 값 자체를 알 필요가 없습니다.

### 1.2 그림자

`--elevation-sm/md/lg`를 인디고 색조로 살짝 틴트해서(`rgba(45, 39, 130, ...)`) 순수 검정 그림자보다
배경과 어우러지게 했고, `@theme inline`에서 Tailwind의 `shadow-sm/md/lg` 유틸리티에 매핑했습니다.

### 1.3 다크모드 배선 (`@custom-variant dark`)

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

`<html data-theme={theme}>`(테마 쿠키 값)에 걸리는 변형입니다. 이걸 켜기 전에는 `components/ui/*`의
`dark:` 클래스가 OS `prefers-color-scheme`을 따르고 있어서, 브라우저 설정이 다크인데 앱 테마 토글은
라이트인 경우 컴포넌트마다 다르게 보이는 실제 버그가 있었습니다. 지금은 앱 전체가 `data-theme`
하나로 통일됩니다.

## 2. 컬러 사용 원칙

- **포인트 컬러는 하나(인디고)** — 예전처럼 화면마다/카드마다 다른 그라디언트 색을 쓰지 않습니다.
- **점수·상태는 항상 success/warning/destructive로 매핑** — `/scan` 결과 페이지의 점수 배지, 프로세스
  스텝의 완료/진행 상태 등은 임의 색이 아니라 `score >= 80 ? success : score >= 60 ? warning :
  destructive` 같은 고정 규칙을 따릅니다.
- **그라디언트/blur/glow 금지** — 배경이나 텍스트에 `bg-gradient-to-r`, `backdrop-blur-xl`,
  `shadow-*-500/20` 같은 장식 효과를 다시 넣지 않습니다. 강조가 필요하면 `--primary` 색상 자체를
  쓰거나 그림자 토큰(`shadow-sm/md/lg`)을 씁니다.
- **다크 분기는 `dark:` 변형으로, 삼항 연산자로 반복하지 않음** — `theme === "dark" ? "bg-x" :
  "bg-y"`를 요소마다 나열하는 대신, 토큰 클래스(`bg-card`, `text-muted-foreground` 등)를 쓰면 라이트/
  다크가 CSS 변수 레벨에서 자동으로 갈립니다. `theme`/`lang` prop 자체는 여전히 컴포넌트 트리를 따라
  내려가지만(테마 토글 로직, `lang` 분기 카피 등에 필요), 순수 스타일링 목적의 삼항 분기는 새로 만들지
  않습니다.

## 3. 컴포넌트 패턴

`components/ui/*`(shadcn 골격: `cva` variant → `cn()` 클래스 병합 → `data-slot`)는 이번에 구조를
바꾸지 않았습니다 — 이미 토큰을 참조하고 있었고, 문제는 토큰 값과 `dark:` 배선 쪽이었기 때문입니다.
새 프리미티브를 추가할 때도 이 골격을 그대로 따르세요(`docs/architecture/index.html` "컴포넌트 구현
패턴" 참고).

`templates/*`의 화면별 컴포넌트는 계속 `theme`/`lang`/`t`를 props로 받는 구조를 유지하되(프롭
드릴링 자체는 이번 작업 범위 밖), 스타일링에 한해서만 토큰 + `dark:` 변형으로 옮겼습니다.

## 4. 이번에 다루지 않은 것

- **아이콘/모션/카피 톤** — `redesign-existing-projects` 스킬 감사 기준으로 보면 Lucide 아이콘
  전량 사용, 정적 트랜지션 등도 "AI 생성 티"의 일부로 지적될 수 있지만, 이번 라운드는 색상·그라디언트
  ·다크모드 배선에 집중했습니다.
- **`/scan` 결과 데이터** — 여전히 `Math.random()` 목업입니다. 실데이터 연결(`crawling` 응답 확장 +
  프론트 `computeChecklist` 판정, ADR-003/ADR-005 결정에 따라 신규 `/analyze` 엔드포인트는 만들지
  않음)은 `docs/meta-scan-plus-prd.md` 스코프이며 이번 디자인 작업과 분리해서 진행하기로 확정했습니다.
- **완전 커스텀 루트 404** — `/ko/asdf`처럼 라우트 자체가 없는 경로는 여전히 Next.js 기본 404가
  뜹니다. 이 저장소에 진짜 루트 `app/layout.tsx`가 없어서(`app/[lang]/layout.tsx`가 사실상 루트
  역할) 루트 `app/not-found.tsx`를 추가하려면 레이아웃 구조 자체를 바꿔야 합니다 — 별도 작업으로
  분리했습니다.

## 5. 관련 결정 기록

이 재작업의 배경/대안 검토는 `docs/adr/index.html`의 **ADR-004**에 기록돼 있습니다.
