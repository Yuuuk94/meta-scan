# 타이포그래피 — meta-scan 디자인 시스템

> 실제 코드(`packages/meta-scan-front/src`) 스캔 기준. 확신이 없거나 코드로 확인되지 않는 부분은
> ⚠️로 표시했습니다.

## 폰트 패밀리

| 용도 | 선언 | 로딩 방식 |
|---|---|---|
| Sans (본문 기본) | Roboto | `next/font/google`, `app/[lang]/layout.tsx`에서 `variable: "--font-geist-sans"`로 로드 |
| Mono | Geist Mono | `next/font/google`, 같은 파일에서 `variable: "--font-geist-mono"`로 로드 |

⚠️ **확인된 배선 누락** — 두 변수(`--font-geist-sans`/`--font-geist-mono`)는 `<body>`의
`className`에 붙긴 하지만(`${RobotoSans.variable} ${geistMono.variable}`), `globals.css`의
`@theme inline` 블록에 `--font-sans: var(--font-geist-sans)` 같은 매핑이 없고 `body`에
`font-sans` 유틸리티도 적용돼 있지 않습니다. 즉 **현재 실제로 렌더링되는 폰트는 Roboto가 아니라
Tailwind Preflight의 기본 시스템 폰트 스택**입니다 — 선언은 했는데 배선이 안 된 상태입니다.
`font-mono` 유틸리티(아래 참고)도
마찬가지로 Geist Mono가 아니라 Tailwind 기본 모노스페이스 스택(`ui-monospace, SFMono-Regular,
Menlo, Monaco, Consolas, ...`)으로 렌더링됩니다.

이 문서는 "고쳐야 한다"를 주장하지 않고 현재 사실만 기록합니다 — 고칠지 여부는 별도로 결정하세요.

## 기준 크기

```css
:root { --font-size: 15px; }
html { font-size: var(--font-size); }
```

루트 폰트 크기가 15px로 고정돼 있어(보통의 브라우저 기본값 16px이 아님), Tailwind의 모든 `rem` 기반
크기 유틸리티(`text-base` = `1rem` 등)가 이 15px를 기준으로 스케일됩니다.

## 실제 사용 중인 스케일

코드에서 실제로 쓰인 `text-*` 유틸리티 빈도(2026-08-13 기준, `grep` 집계):

| 클래스 | rem (15px 기준 px) | 빈도 | 주 용도 |
|---|---|---|---|
| `text-xs` | 0.75rem (11px) | 8 | 배지, 타임스탬프, 캡션 |
| `text-sm` | 0.875rem (13px) | 37 (최다) | 본문 텍스트, 라벨, 카드 설명 — 사실상 기본 body 크기 |
| `text-base` | 1rem (15px) | 10 | 인풋 텍스트, 강조 문단 |
| `text-lg` | 1.125rem (17px) | 7 | 서브헤딩, 리드 문단 |
| `text-2xl` | 1.5rem (23px) | 1 | (단독 사용처 있음) |
| `text-3xl` | 1.875rem (28px) | 8 | 섹션/페이지 타이틀(h1~h2급) |
| `text-5xl` | 3rem (45px) | 1 | 히어로 타이틀(`HeroSection`) |
| `text-6xl` | 3.75rem (56px) | 1 | AI 준비도 점수 숫자(`/scan` 히어로 카드) |

**패턴**: 본문/라벨은 `text-sm`이 압도적 기본값이고, `text-base`는 눈에 띄어야 하는 인풋/문단에만
씁니다. 큰 사이즈(`text-5xl`/`text-6xl`)는 페이지당 한 곳(히어로 타이틀, 점수 숫자)에만 예외적으로
씁니다 — 남발하지 않습니다.

## 굵기 (Weight)

`globals.css`에 `--font-weight-normal: 400`/`--font-weight-medium: 500` 커스텀 프로퍼티가
정의돼 있지만 ⚠️ **현재 어떤 컴포넌트에서도 참조되지 않습니다** — shadcn 스캐폴드에서 넘어온 잔존
토큰입니다(원래 이 값들을 쓰던 `@layer base`의 h1~h6/label/button 기본 스타일 블록은 주석 처리돼
있다가 이번 디자인 시스템 작업에서 제거됨).

실제로는 Tailwind의 표준 `font-*` 유틸리티를 그때그때 씁니다:

| 클래스 | 빈도 | 용도 |
|---|---|---|
| `font-semibold` (600) | 18 (최다) | 헤딩, 타이틀, 강조 텍스트 |
| `font-medium` (500) | 14 | 버튼, 라벨, 배지 텍스트 |
| `font-normal` (400) | 1 | 명시적으로 지정하는 경우는 드묾(기본값이라 보통 생략) |
| `font-bold` (700) | 0 | 현재 사용처 없음 |

**규칙**: 헤딩은 `font-semibold`, 인터랙티브 요소(버튼/라벨/배지)는 `font-medium`. `font-bold`는
쓰지 않습니다 — 위계는 크기(`text-*`)로 만들고 굵기는 두 단계(medium/semibold)로 충분히
표현합니다.

## 줄 간격 / 자간

명시적 `leading-*`/`tracking-*` 유틸리티는 최소한으로만 씁니다(대부분 각 크기의 Tailwind 기본
line-height를 그대로 사용):

| 클래스 | 빈도 | 용도 |
|---|---|---|
| `leading-relaxed` | 4 | 긴 본문 문단(개인정보처리방침/이용약관, FAQ 답변) |
| `leading-none` | 2 | 로고 타이틀처럼 줄 간격이 없어야 붙어 보이는 짧은 텍스트 |
| `tracking-tight` | 2 | 히어로 타이틀처럼 큰 사이즈에서 자간을 좁혀 무거운 인상을 줄 때 |

## 숫자 표기

`body`에 `font-feature-settings: "tnum" 1;`을 지정해 고정폭 숫자(tabular figures)를 켰습니다 —
점수(88, 92 같은 두 자리 숫자)가 나란히 놓일 때 자리가 흔들리지 않도록 하기 위함입니다. 별도
모노스페이스 폰트 없이 가변폭 폰트에서도 숫자만 고정폭으로 렌더링됩니다.

## 모노스페이스 사용처

`font-mono` 유틸리티(위 "확인된 배선 누락" 참고 — 실제로는 Tailwind 기본 모노 스택)를 쓰는 곳:

- `RootHeader`의 서브타이틀("AI 친화 AEO & SEO 분석기")
- `ServiceStatus`의 상태 라벨(`ONLINE`/`SYSTEM_ONLINE`)
- `ProcessSection`의 스텝 번호(`01`/`02`/`03`)
- `privacy`/`terms`/`not-found` 페이지의 날짜·코드 라벨("최종 수정일", "404")

**패턴**: 모노스페이스는 본문이 아니라 "시스템/메타 정보"처럼 보여야 하는 짧은 라벨에만 씁니다.
