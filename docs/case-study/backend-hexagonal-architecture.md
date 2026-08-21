# Backend Architecture: Hexagonal (Ports & Adapters)

> [ADR-011](../adr/index.html#adr-011)의 원문입니다. 전체 후보 비교는
> `docs/case-study/backend-architecture-survey.md`(7개 패턴 조사) 참고 — 이 문서는 그중 최종 채택된
> Hexagonal만 상세히 다룹니다. **결정만 확정된 상태이고 `meta-scan-api` 코드에는 아직
> 반영되지 않았습니다** — 실제 마이그레이션은 별도 실행 단계입니다(프론트 ADR-010과 동일한
> 순서: 방향 확정 → 사용자 승인 → 코드 이동).

## 1. 배경

`docs/case-study/backend-architecture-survey.md`에서 정리한 대로, 지금 구조(레이어드
router→controller→service)의 실제 아픈 지점은:

- `scanService.ts`가 ping/robotsTxt/siteMap/crawling/checks를 전부 떠안은 "God 서비스"
- `scanService`가 `Puppeteer`/`ChromeLauncher` 구체 클래스에 직접 의존 — infra 교체·단위테스트
  목킹이 어려움
- 파일명 케이싱 불일치, `lighthouse` 모듈만 응답 규약을 깨는 것, 에러 원본을 삼키는 `catch`,
  라우터마다 반복되는 수동 DI

## 2. 결정 과정 (요약)

프론트 ADR-010 때와 같은 원칙 — **"지금 도메인이 얕아 보인다는 이유로 계층을 미리 압축하지
않는다"** — 을 지키며 진행했습니다:

1. 경로 별칭 스타일부터 정리 — `@core/*`/`@constant/*`/`@config/*`/`@infra/*`/`@modules/*` 5개를
   `meta-scan-front`와 동일한 `@/*` 하나로 통일(별도 커밋, 아키텍처 결정과 무관한 선행 정리).
2. 7개 아키텍처 패턴(NestJS 기본, Clean/Onion, Hexagonal, DDD 모듈러 모놀리스, CQRS, Vertical
   Slice, 마이크로서비스)을 압축 없이 전부 조사 — `docs/case-study/backend-architecture-survey.md`.
3. 큰 축 4개(계층/의존성 역전 축 · 기능 슬라이스 축 · 읽기/쓰기 축 · 현행 유지) 중
   **계층/의존성 역전 축**으로 확정 — CQRS(쓰기 경로 없음)와 DDD 모듈러 모놀리스(바운디드
   컨텍스트가 사실상 1개)는 이 시점에 배제.
4. 같은 축 안의 Clean/Onion(4계층) vs Hexagonal(3계층)을 실제 코드 예시(`scanService.ts` →
   각 패턴으로 옮기면 어떤 모양이 되는지)로 구체 비교.
5. **"entities 계층이 얕아 보인다"는 이유로 미리 기각하지 않고**, PRD
   (`docs/prd/meta-scan-plus-prd.md` 3~4장)의 체크리스트 명세를 실제로 읽어 사실관계를 확인 —
   모든 체크 항목이 `{id, group, label, status, detail?}` 형태의 **독립적·무상태 분류
   결과**이며, 항목 간 관계 규칙이나 상태 변화, 지켜야 할 불변식이 명세 어디에도 없음을 확인
   (4장: 프론트의 `combineScanResults`도 "계산이 아니라 취합"이라고 명시).
6. 이 사실을 근거로 Hexagonal 채택 — Clean의 `entities` 계층이 보호할 대상(관계/불변식/상태)이
   현재 명세상 존재하지 않아, 지금 만들면 기존 ambient `.d.ts` 타입을 클래스 셸로 한 번 더
   감싸는 것 이상의 실익이 없다고 판단.

## 3. 결정: Hexagonal 3계층

```
domain/
  ports/                      순수 인터페이스 — infra를 모름
    BrowserAutomationPort.ts    loadPage(url) → { rawHtml, renderedHtml, ... }
    LighthouseRunnerPort.ts      runAudit(url) → LighthouseResult
  scanRules.ts                 순수 함수 — runChecks(html, meta) → CheckResult[] (기존 로직 이동)

application/
  ScanUrlUseCase.ts             포트 호출 → scanRules 실행 → 조합해서 반환
  PingUseCase.ts / RobotsTxtUseCase.ts / SiteMapUseCase.ts / CrawlingUseCase.ts / LighthouseUseCase.ts

adapters/
  inbound/http/                기존 *.router.ts / *Controller.ts (위치는 유지 가능, 세부는 실행 시 확정)
  outbound/
    PuppeteerAdapter.ts          BrowserAutomationPort 구현, 기존 infra/Puppeteer.ts를 감쌈
    ChromeLauncherAdapter.ts      LighthouseRunnerPort 구현, 기존 infra/ChromeLauncher.ts를 감쌈
```

**핵심 규칙**:
- `domain/`은 Express도, Puppeteer도, `chrome-launcher`도 모른다 — 포트 인터페이스와 순수 함수만.
- infra(Puppeteer/ChromeLauncher) 구체 클래스는 오직 `adapters/outbound/`에서만 `import`된다.
  `application/`은 포트 인터페이스만 의존하고 구체 어댑터를 직접 `new`하지 않는다(주입받음).
- entities 계층은 별도로 만들지 않는다 — 2장 5번 근거. 도메인 데이터 모양은 기존처럼
  `types/*.d.ts` ambient 타입으로 충분하다고 판단(재검토 트리거는 6장 참고).

## 4. 고려한 대안 요약

전체 비교는 `docs/case-study/backend-architecture-survey.md` 참고. 최종 좁혀진 두 후보만 요약:

| | Hexagonal (채택) | Clean/Onion (기각) |
|---|---|---|
| 계층 수 | 3 (도메인+포트 / 애플리케이션 / 어댑터) | 4 (entities / use cases / interface adapters / frameworks) |
| entities 계층 | 없음 — 포트 인터페이스가 도메인의 핵심 | 있음 — 정식 계층, 원칙상 불변식을 가져야 함 |
| 기각/채택 근거 | PRD 3~4장 확인 결과 체크 항목에 관계/불변식/상태변화가 없어, Clean의 entities 계층을 만들어도 타입 셸 이상의 실익이 없음 | 위와 동일한 이유로 기각 — "도메인이 얕다"는 지레짐작이 아니라 PRD 명세를 실제로 읽고 확인한 사실 |

그 밖에 CQRS(쓰기 경로 없음 — 존재 이유 자체가 성립 안 함), DDD 모듈러 모놀리스(바운디드
컨텍스트 사실상 1개), Vertical Slice(현재 모듈 폴더링과 방향은 겹치나 "레이어를 없앤다"는
핵심 주장과 다름), 마이크로서비스(단일 배포 대상 구조와 별개 논의), NestJS 기본 구조(아키텍처가
아니라 프레임워크 교체 문제)는 전부 축 선택 단계에서 배제 — 상세 사유는 survey 문서.

## 5. 결과 / 아직 안 정한 것

- 아직 구현하지 않았습니다 — 방향만 확정.
- 포트를 얼마나 세분화할지(예: `BrowserAutomationPort` 하나로 Puppeteer의 여러 메서드를 다
  덮을지, 메서드별로 쪼갤지)는 실제 코드 작성 시점에 확정합니다.
- `adapters/inbound/http/`가 기존 `modules/*` 구조를 어떻게 흡수할지(모듈별 폴더를 유지한 채
  그 안에 inbound만 둘지, 전역 `adapters/inbound/http/`로 다 모을지)는 이번에 정하지 않았습니다.
- 에러 처리(원본 에러를 삼키는 `catch`), 파일명 케이싱 통일, 응답 규약(`lighthouse` 모듈 예외)
  정리는 이 아키텍처 결정과 별개 이슈로, 마이그레이션 실행 시점에 스코프를 따로 정합니다.
- entities 계층을 나중에 도입할 기준: PRD에 체크 항목 간 관계 규칙이나 상태 변화, 불변식이
  실제로 추가되면(예: "그룹 A가 fail이면 그룹 B 체크를 건너뛴다" 같은 규칙) 그때 재검토합니다.
