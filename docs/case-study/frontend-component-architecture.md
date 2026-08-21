# Frontend Component Architecture: FSD-lite

> [ADR-009](../adr/index.html#adr-009)의 원문입니다. 이 문서는 아직 **결정만 된 상태**이고
> `meta-scan-front` 코드에는 반영되지 않았습니다 — 실제 컴포넌트/폴더 구현은 별도 작업입니다.

## 1. 배경

`docs/design/design-system.md`(ADR-008, 진 인덱스 톤)로 확정된 와이어프레임을 실제
`meta-scan-front` 코드로 옮기기에 앞서, "UI 컴포넌트"와 "기능(데이터 페칭·판정 취합·상태)"을
어떻게 분리할지 아키텍처를 정했습니다. 지금 남은 진짜 작업(`ProcessScreen`이 4개 API 응답을
버리는 것, `/scan`이 `Math.random()` 목업인 것, `combineScanResults` 취합 로직이 없는 것 —
`CLAUDE.md` 참고)이 전부 "기능" 쪽에 몰려 있어서, 이 경계를 어디에 어떻게 그을지가 핵심
질문이었습니다.

## 2. 현재 폴더와 새 레이어 이름의 충돌 지점

FSD(Feature-Sliced Design) 채택 시 기존 폴더와 이름이 겹치는 곳이 있어 먼저 정리합니다:

| 기존 | FSD 상당 레이어 | 처리 방침 |
|---|---|---|
| `src/apis/` | `shared/api`(axios 인스턴스) + 각 feature의 `api` 세그먼트 | 공유 axios 인스턴스는 `shared/api`로, 도메인별 호출 함수는 각 feature 슬라이스 내부로 이동 |
| `src/stores/scanStore.ts` | `entities/scan-request/model/` (도메인이 얕으면 `shared/`) | 얕은 도메인이라 우선 `shared/`에 두고, 필요해지면 승격 |
| `src/templates/` | `widgets/` + `pages/` | FSD의 `features`와 통합해 사용(아래 3장 참고) — 이름은 유지 |
| `src/app/[lang]/` | FSD 최상위 `app` 레이어 | Next.js App Router가 이미 이 이름을 쓰고 있어 충돌 — FSD `app` 레이어 역할(프로바이더·전역 스타일)은 `layout.tsx` + `src/providers/`로 흡수, 별도 `app/` 레이어 폴더는 만들지 않음 |

## 3. 결정: FSD-lite (4계층)

정석 FSD의 6계층(`app`/`pages`/`widgets`/`features`/`entities`/`shared`)을 전부 쓰지 않고,
`features`와 `widgets`를 통합한 4계층만 사용합니다. 이유는 5장 참고.

```
shared/          — 순수 프리미티브(Badge, RuleDivider, NumberLabel, HardlineCard 등),
                    axios 인스턴스, 범용 유틸. API/스토어를 모름.

entities/        — 도메인 얕음(스캔 도메인 1~2개: scan-check, scan-report 정도) → 필요해질 때만 생성.
                    당장은 생략 가능.

features/        — UI + 로직을 함께 갖는 기능 슬라이스. 슬라이스 내부를 세그먼트로 나눔:
                    features/run-scan/
                      ui/      ProcessStepBar.tsx, BlockedScreen.tsx 등 (화면 조각)
                      model/   combineScanResults.ts, ADR-006 게이팅 로직
                      api/     scanApi.ts (ping/robotsTxt/siteMap/crawling/lighthouse 호출)
                    features/request-scan/   — URL 입력 + 제출
                    features/toggle-checklist-item/ — 아코디언 펼침/접힘

pages/            — Next.js `app/[lang]/**/page.tsx`가 담당. features의 슬라이스를 조립만 함.
```

**핵심 규칙(=이번 질문 "UI vs 기능 분리"에 대한 답)**:
- `shared/`는 어떤 도메인 로직도, API 호출도 모른다 — props만 받는다.
- API 호출·판정 취합(`combineScanResults`)·ADR-006 게이팅은 반드시 해당 feature 슬라이스의
  `model/` 또는 `api/` 세그먼트 안에만 존재한다. `ui/` 세그먼트나 `shared/`로 새지 않는다.
- 슬라이스 간에는 서로의 내부(`model/`, `api/`)를 직접 import하지 않고, 슬라이스 루트의
  공개 인터페이스(`index.ts`)로만 접근한다.

## 4. 고려한 대안

지금까지 순서대로 검토하고 기각한 대안들입니다(자세한 비교는 이 논의의 히스토리를
참고하되, 표로 요약):

| 대안 | 요약 | 기각/보류 사유 |
|---|---|---|
| 기존 2계층 그대로 확장 (`components/ui/` + `templates/`) | Zine 프리미티브를 `ui/`에, 취합 로직을 `templates/`에 | 컨벤션일 뿐 강제력이 없음 — `templates/`가 계속 커지면서 UI와 기능이 다시 섞일 위험 |
| 훅(hooks) 계층 분리 (`useProcessScan()` 등) | 데이터 페칭/취합을 커스텀 훅으로 캡슐화 | 방향 자체는 FSD의 `model`/`api` 세그먼트와 사실상 같은 목적 — FSD 채택으로 흡수됨 |
| `design-system/` 폴더 + ESLint import-boundary 강제 | 물리적 격리 + 컴파일타임 강제 | 강제력은 매력적이나 지금 단계(디자인 시스템이 막 확정된 시점)엔 폴더 구조까지 못 박기엔 이름 |
| Atomic Design 정석 5단계 (atoms/molecules/organisms/templates/pages) | UI 복잡도 레벨로 계층화 | 이 앱은 단일 스캔 플로우라 atom/molecule 경계 논쟁이 잦고, `templates/`라는 이름이 기존 의미와 충돌 |
| Atomic-lite (ui=atom+molecule, blocks=organism) | 계층을 축약한 절충 | 형태(계층) 축은 맞지만 "기능이 어디 사는가"라는 경계를 정의하지 않음 — FSD가 이 부분을 더 명확히 풂 |
| FSD 정석 6계층 | `app`/`pages`/`widgets`/`features`/`entities`/`shared` 전부 사용 | 도메인이 얕아(entities 1~2개) 계층 일부가 형식적 껍데기만 남음 |
| Atomic(형태) + FSD(경계) 하이브리드 | UI 계층은 atomic 이름, 기능 경계는 FSD 세그먼트 | 자체 조합이라 팀 온보딩 설명 비용이 가장 큼 |

## 5. 이 결정을 고른 이유

1. 지금 남은 작업이 "4개 API 호출 + ADR-006 게이팅 + `combineScanResults` 취합"이라는
   뚜렷한 **기능 단위** 하나를 코드로 옮기는 것인데, FSD의 슬라이스(`features/run-scan`
   안의 `ui`/`model`/`api` 세그먼트)가 이 작업 단위와 정확히 대응합니다.
2. 정석 6계층은 도메인이 얕은 이 앱엔 과합니다 — `entities`가 채워질 만큼 도메인이
   많지 않습니다.
3. Atomic 계열(정석·축약·하이브리드)은 "UI를 얼마나 잘게 쪼갤까"엔 강하지만 "기능이
   어디 살아야 하는가"라는 이번 질문의 핵심 경계를 FSD만큼 명시적으로 정의하지 않습니다.

## 6. 결과 / 아직 안 정한 것

- 아직 구현하지 않았습니다 — 이 문서와 [ADR-009](../adr/index.html#adr-009)는 방향 결정만
  기록합니다.
- 슬라이스 경계(예: `run-scan` 안에 `toggle-checklist-item`을 포함시킬지, 별도 슬라이스로
  뺄지)는 실제 컴포넌트를 만들면서 확정할 예정입니다.
- `entities` 레이어를 나중에 승격할 기준(도메인이 몇 개 이상 되면 분리할지)은 이번에
  정하지 않았습니다.
- 기존 `src/components/ui/`(shadcn 프리미티브)와 새 `shared/`의 관계 — 완전히 대체할지,
  당분간 공존시킬지도 구현 착수 시점에 결정합니다.
