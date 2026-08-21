# 컬러 — meta-scan 디자인 시스템

> `packages/meta-scan-front/src/css/globals.css`에 정의된 실제 토큰 기준. 개요/배경은
> [`docs/design/design.md`](./design.md), 시각화는
> [`docs/design/index.html`](./index.html) 참고.

## 원칙

- **포인트 컬러는 인디고 하나** — 화면·카드마다 다른 강조색을 쓰지 않습니다.
- **상태 색은 의미로만 매핑** — `success`/`warning`/`destructive`는 항상 좋음/보통/나쁨에
  고정되고, 장식 목적으로 쓰지 않습니다.
- **라이트/다크는 같은 변수명, 다른 값** — 컴포넌트 코드는 `bg-primary`, `text-success`처럼
  토큰만 참조하고 라이트/다크 값 자체를 분기하지 않습니다. 라이트는 `:root`, 다크는
  `:root[data-theme="dark"]`에서 재정의됩니다.

## 의미별 매핑

| 역할 | 토큰 | 사용처 |
|---|---|---|
| **Primary** | `--primary` / `--primary-foreground` | 기본 버튼, 액티브 탭/스텝, 강조 아이콘, 포커스 링(`--ring`) |
| **Secondary** | `--secondary` / `--secondary-foreground` | 배지 등 포인트 컬러의 은은한 배경 톤 |
| **Surface** | `--background`, `--card`, `--popover`, `--muted` | 페이지 배경, 카드 표면, 팝오버, 저강조 배경 영역 |
| **Text** | `--foreground`, `--card-foreground`, `--muted-foreground` | 기본 텍스트, 카드 안 텍스트, 저강조/보조 텍스트 |
| **State** | `--success`, `--warning`, `--destructive` (+ 각 `-foreground`) | 점수 등급, 상태 배지(present/missing, detected/not detected), 폼 유효성 에러 |
| **Border/Input** | `--border`, `--input`, `--input-background` | 카드/구분선 테두리, 인풋 테두리·배경 |
| **Chart** | `--chart-1` ~ `--chart-5` | recharts 도입 시를 대비한 시퀀스 컬러(현재 `recharts`는 import돼 있으나 주석 처리돼 미사용) |
| **Sidebar** | `--sidebar*` | 현재 사이드바 컴포넌트 자체가 화면에 없어 미사용 — shadcn 스캐폴드 잔존 토큰 |

## 전체 토큰 값

### Surface / Text

| 토큰 | 라이트 | 다크 |
|---|---|---|
| `--background` | `#ffffff` | `#0b0c10` |
| `--foreground` | `#16181d` | `#eceef1` |
| `--card` | `#ffffff` | `#131419` |
| `--card-foreground` | `#16181d` | `#eceef1` |
| `--popover` | `#ffffff` | `#131419` |
| `--popover-foreground` | `#16181d` | `#eceef1` |
| `--muted` | `#f4f5f7` | `#1a1c22` |
| `--muted-foreground` | `#686e79` | `#9a9fab` |
| `--border` | `#e6e8ec` | `#24262e` |
| `--input` | `#e6e8ec` | `#24262e` |
| `--input-background` | `#f7f8fa` | `#1a1c22` |

다크에서 `--card`(`#131419`)가 `--background`(`#0b0c10`)보다 한 단 밝습니다 — 배경 위에 카드가
뜨는 elevation을 명도 차이로만 표현하고, 별도 그림자/보더 색을 새로 만들지 않습니다.

### Primary / Secondary

| 토큰 | 라이트 | 다크 |
|---|---|---|
| `--primary` | `#4f46e5` (인디고 600) | `#6366f1` (인디고 500 — 어두운 배경에서 대비를 위해 한 단 밝게) |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--secondary` | `#eef0ff` | `#1c1b3a` |
| `--secondary-foreground` | `#362f9e` | `#c7d2fe` |
| `--accent` | `#eef0ff` | `#1c1b3a` |
| `--accent-foreground` | `#362f9e` | `#c7d2fe` |
| `--ring` | `#4f46e5` | `#6366f1` |

### State

| 토큰 | 라이트 | 다크 | 의미 |
|---|---|---|---|
| `--success` / `-foreground` | `#16803c` / `#ffffff` | `#34a260` / `#05170c` | 점수 ≥ 80, present/detected |
| `--warning` / `-foreground` | `#b45309` / `#ffffff` | `#d69433` / `#1a1103` | 점수 60–79 |
| `--destructive` / `-foreground` | `#d1293d` / `#ffffff` | `#e35267` / `#1a0407` | 점수 < 60, missing/not detected, 폼 에러 |

### 그림자 (색이 있는 토큰)

그림자도 무채색이 아니라 인디고 색조로 틴트돼 있습니다 — 순수 검정 대신 브랜드 색과 어우러지게
하기 위함입니다.

| 토큰 | 값 |
|---|---|
| `--elevation-sm` | `0 1px 2px rgba(30, 27, 75, 0.05)` (다크: `rgba(0,0,0,0.3)`) |
| `--elevation-md` | `0 6px 16px -4px rgba(45, 39, 130, 0.1)` (다크: `rgba(0,0,0,0.45)`) |
| `--elevation-lg` | `0 20px 40px -12px rgba(45, 39, 130, 0.18)` (다크: `rgba(0,0,0,0.55)`) |

`@theme inline`에서 Tailwind의 `shadow-sm`/`shadow-md`/`shadow-lg` 유틸리티로 매핑되므로,
컴포넌트 코드에서는 그냥 `shadow-md`처럼 씁니다.

## 점수/상태 → 색 매핑 규칙 (실제 구현)

`app/[lang]/scan/page.tsx`의 `scoreBand()` 함수 기준:

```ts
const scoreBand = (score: number) =>
  score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";
```

`StatusBadge`(present/missing, detected/not detected류의 boolean 상태)는 `condition`이 참이면
`success`, 거짓이면 `destructive` — 중간 상태(`warning`)는 boolean 상태에는 쓰지 않고 점수(0~100)
같은 3단계 값에만 씁니다.

## 하지 말 것

- `from-cyan-*`/`from-purple-*`/`from-pink-*` 같은 임의 그라디언트 조합 재도입
- `--success`/`--warning`/`--destructive`를 의미(등급) 없이 장식용으로 사용
- 컴포넌트 안에서 라이트/다크 값을 직접 하드코딩(`theme === "dark" ? "#..." : "#..."`) — 항상
  토큰 클래스를 통해서만 색을 참조
