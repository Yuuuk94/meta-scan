# 컴포넌트 패턴 — meta-scan 디자인 시스템

> `packages/meta-scan-front/src/components/ui/*`(shadcn 골격 프리미티브)와 화면 코드에서 반복되는
> 합성 패턴을 실제 사용 빈도와 함께 정리했습니다. 프리미티브 자체의 뼈대(`cva`/`cn`/`data-slot`)는
> 이번 디자인 시스템 작업에서 바꾸지 않았습니다 — 바뀐 건 참조하는 토큰 값뿐입니다
> ([`colors.md`](./colors.md) 참고).

## 공통 골격

`components/ui/*`는 전부 같은 뼈대를 따릅니다:

```tsx
const xxxVariants = cva("base classes...", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" },
});

function Xxx({ className, variant, size, ...props }) {
  return <div data-slot="xxx" className={cn(xxxVariants({ variant, size, className }))} {...props} />;
}

export { Xxx, xxxVariants };
```

새 프리미티브를 추가할 때는 이 구조를 그대로 복제하세요 — `cva`로 variant/size를 정의하고,
`cn()`(`clsx` + `tailwind-merge`)으로 className을 병합하고, `data-slot` 속성을 붙이고,
named export합니다.

## Button

`components/ui/button.tsx`. 실사용처 6곳(전체 primitives 중 최다).

| Variant | 스타일 | 용도 |
|---|---|---|
| `default` | `bg-primary text-primary-foreground` | 기본 CTA(URL 분석하기, 확인 등) |
| `outline` | 테두리만, `bg-background` | 보조 액션(에러 화면의 "홈으로") |
| `secondary` | `bg-secondary` | 낮은 강조 액션 |
| `ghost` | 배경 없음, hover 시에만 `bg-accent` | 헤더의 테마/언어 토글처럼 아이콘 버튼 |
| `link` | 밑줄 텍스트 | 인라인 링크형 액션(현재 사용처 없음) |
| `destructive` | `bg-destructive` | 파괴적 액션(현재 사용처 없음) |

크기는 `default`/`sm`/`lg`/`icon` 4단계. `asChild` prop으로 `<Link>` 등 다른 엘리먼트에 버튼
스타일만 씌울 수 있습니다(예: 404 페이지의 "홈으로 돌아가기" 버튼이 `<Link>`를 감쌈).

```tsx
<Button asChild size="lg" className="rounded-xl px-8">
  <Link href={`/${lang}`}>{t.action}</Link>
</Button>
```

## Card

`components/ui/card.tsx`. `Card` / `CardHeader` / `CardTitle` / `CardDescription` /
`CardAction` / `CardContent` / `CardFooter`로 조립합니다. 기본 스타일은 `bg-card
text-card-foreground rounded-xl border`뿐이고 — **그림자는 기본으로 붙지 않습니다**, 필요한
곳에서만 `shadow-sm`/`shadow-md`를 추가로 붙입니다(예: 히어로 URL 입력 박스).

`/scan` 결과 페이지는 Card를 가장 밀도 있게 씁니다 — 점수 카드, AI 신호 카드, 인덱싱/콘텐츠 통계
카드, Raw JSON 카드가 전부 같은 `Card` 조합으로 만들어집니다. 새로운 결과 섹션을 추가할 때도 이
조합을 그대로 재사용하세요.

## Input

`components/ui/input.tsx`. 현재 실사용처는 히어로 섹션의 URL 입력창 하나뿐이지만, 패턴은
분명합니다: 테두리 없는 `border-0 bg-transparent` 상태로 부모 컨테이너(`rounded-2xl border
bg-card`) 안에 넣어서, 인풋 자체가 아니라 **감싸는 카드가 테두리/포커스 스타일을 책임지는** 구조입니다.

```tsx
<div className="rounded-2xl border border-border bg-card p-2 shadow-md focus-within:border-ring focus-within:shadow-lg">
  <Globe className="h-5 w-5 text-muted-foreground" />
  <Input className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
  <Button>...</Button>
</div>
```

`focus-within:`을 부모에 걸어서, 내부 인풋이 포커스되면 카드 전체 테두리/그림자가 반응하도록
합니다.

## Modal (AlertDialog)

`components/ui/alert-dialog.tsx` (Radix `AlertDialog` 래핑). ⚠️ **현재 앱 어디에서도 실제로
쓰이지 않습니다** — shadcn CLI로 설치만 돼 있는 상태입니다. 필요해지면 아래 골격을 그대로
씁니다: `AlertDialog` → `AlertDialogTrigger` → `AlertDialogContent`(내부에 `AlertDialogHeader`/
`AlertDialogTitle`/`AlertDialogDescription`/`AlertDialogFooter`). `AlertDialogContent`는 이미
오버레이(`bg-black/50`)와 중앙 정렬, 열림/닫힘 애니메이션(`data-[state=open]:animate-in` 등)까지
갖춰져 있어 새로 스타일링할 필요는 없습니다.

`redesign-existing-projects` 감사 기준으로는 "모달을 단순 액션에 남용하지 말 것"을 권장합니다 —
실제로 쓸 때는 되돌릴 수 없는 액션의 확인용으로만 쓰고, 단순 정보 표시에는 인라인 확장/슬라이드
패널을 우선 고려하세요.

## Badge

`components/ui/badge.tsx`. Variant는 `default`/`secondary`/`destructive`/`outline` 4개지만,
화면 코드에서는 variant를 쓰는 대신 **상태 색을 직접 className으로 오버라이드**하는 패턴이
더 흔합니다(`/scan` 결과 페이지의 `StatusBadge` 참고, 아래).

## 화면 레벨 합성 패턴 (프리미티브가 아닌, 반복되는 조합)

프리미티브 자체보다 화면 코드에서 반복되는 아래 세 패턴이 실질적인 "컴포넌트 시스템"에 가깝습니다.

### StatusBadge (boolean 상태 → 색)

`app/[lang]/scan/page.tsx`에 로컬로 정의된 헬퍼 컴포넌트. present/missing, detected/not
detected처럼 이분법적 상태를 배지 색으로 표현합니다.

```tsx
const StatusBadge = ({ condition, trueText, falseText }) => (
  <Badge className={condition
    ? "border-success/30 bg-success/10 text-success"
    : "border-destructive/30 bg-destructive/10 text-destructive"}>
    {condition ? trueText : falseText}
  </Badge>
);
```

`bg-{color}/10` + `border-{color}/30` + `text-{color}` 조합(옅은 배경 + 옅은 테두리 + 진한
텍스트)이 상태 배지의 기본 공식입니다. 새 상태 배지를 추가할 때도 이 3중 조합을 따르세요 — 배경을
진하게 채우지 않습니다.

### ScoreCard (0~100 점수 → 등급 색 + 진행바)

같은 파일의 `ScoreCard` 헬퍼. 아이콘 + 점수 숫자 + 얇은 진행바로 구성되고, 색은 항상
`scoreBand()`(`>= 80 success`, `>= 60 warning`, 그 외 `destructive`)를 통해서만 정해집니다.
Lighthouse 점수 3개, AI 준비도 히어로 점수가 전부 이 패턴을 씁니다.

### ProcessStep (3단계 상태: 대기 / 진행 중 / 완료)

`templates/request-scan/ProcessStep.tsx`. boolean 두 개(`isActive`/`isCompleted`)를 3단계
상태(`active`/`done`/`idle`)로 정규화한 뒤, 상태별 스타일을 객체 매핑으로 한 번에 정의합니다:

```tsx
const state = isActive ? "active" : isCompleted ? "done" : "idle";
const rowClass = {
  active: "border-primary/30 bg-primary/5",
  done: "border-success/30 bg-success/5",
  idle: "border-border bg-muted/30",
}[state];
```

불리언 두 개를 각 렌더 지점에서 매번 삼항으로 풀어쓰는 대신, **상태를 하나의 문자열로 정규화하고
스타일을 객체 매핑으로 한 번에 정의**하는 이 패턴을 다단계 상태 UI(3단계 이상)에 재사용하세요.
