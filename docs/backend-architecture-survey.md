# Backend Architecture Survey — meta-scan-api

> **상태**: 2026-08-21에 사용자와 순차 인터뷰를 거쳐 **Hexagonal (Ports & Adapters)**로
> 결정됐습니다 — [ADR-011](adr/index.html#adr-011) + `docs/backend-hexagonal-architecture.md`
> 참고. 이 문서 자체는 append-only 규칙(ADR 전용) 대상이 아니라, 결정에 이르기까지 압축 없이
> 검토한 전체 후보 목록으로 계속 남겨두는 조사 자료입니다.

## 0. 왜 이 문서가 필요한가

프론트엔드 컴포넌트 아키텍처를 [ADR-010](adr/index.html#adr-010)(Atomic Design 5계층 +
api/services/hooks)로 재정리한 것과 같은 맥락으로, `meta-scan-api`도 아키텍처를 다시 볼 시점이
됐습니다. 단, 프론트 작업 중 확인된 원칙 — **"지금 도메인이 얕아 보인다는 이유로 계층을 미리
압축하지 않는다"** — 을 그대로 따릅니다. 이 문서는 그 원칙에 따라 특정 패턴을 미리 추천하거나
기각하지 않고, 요즘 Node/NestJS 진영에서 실제로 쓰이는 아키텍처 패턴을 압축 없이 넓게 펼쳐
놓은 자료입니다.

## 1. 현재 구조 (baseline)

`src/modules/*` 아래 기능별로 나뉜 레이어드 Express 앱입니다.

```
*.router.ts        라우트 연결, 수동 DI (new Infra() → new XxxService(infra) → new XxxController(service))
*Controller.ts      BaseController 상속, 요청/응답만 담당
*Service.ts         비즈니스 로직

core/http/          BaseController, ApiError, 전역 errorHandler/notFound
core/validation/     Zod 래퍼 (validator.ts)
infra/               Puppeteer.ts, ChromeLauncher.ts — 생명주기가 다른 두 브라우저 자동화 래퍼
constant/            매직 넘버/문자열
config/swagger.ts    손으로 쓴 OpenAPI 3.1 스펙
types/*.d.ts         export 없는 ambient 전역 타입
```

### 알려진 아픈 지점 (패키지 `CLAUDE.md`에 이미 기록된 것들 — 새 아키텍처가 풀어야 할 문제)

- `scanService.ts`가 ping/robotsTxt/siteMap/crawling/checks를 전부 떠안은 "God 서비스"
- `scanService`가 `Puppeteer`/`ChromeLauncher` 구체 클래스에 직접 의존 — infra 교체·단위테스트
  목킹이 어려움 (`docs/dev-lifecycle-harness.md`가 1순위로 둔 테스트 인프라 작업과 직결)
- 파일명 케이싱 불일치(`scanController.ts` vs `HealthController.ts`)
- `lighthouse` 모듈만 응답 스프레드 규약(`{ ...statusOk, ...result }`)을 깨는 것
- `catch (e) { throw ApiError.internal() }`이 원본 에러를 삼킴 — 디버깅 정보 손실
- 라우터마다 수동 DI 코드가 복붙됨

## 2. 아키텍처 패턴 전체 목록

### 2.1 NestJS 기본(바닐라) 구조 — Module–Controller–Provider

**핵심 아이디어**: `@Module()`/`@Controller()`/`@Injectable()` 데코레이터 + 내장 DI 컨테이너로
라우터-컨트롤러-서비스를 프레임워크가 자동 배선. 현재 구조의 `router→controller→service`와 개념은
거의 동일 — 차이는 DI를 수동으로 짜느냐(현재) 프레임워크 컨테이너가 자동으로 해주느냐뿐.

| | 내용 |
|---|---|
| 장점 | 학습 자료 압도적으로 많음, 데코레이터로 보일러플레이트 최소화, 모듈 의존성 그래프를 프레임워크가 강제(순환 의존 감지 등), `@nestjs/swagger`로 OpenAPI 자동 생성 가능(현재 손으로 쓰는 `config/swagger.ts` 대체 가능) |
| 단점 | 프레임워크 자체 교체가 필요(Express→NestJS는 아키텍처가 아니라 프레임워크 마이그레이션), 데코레이터·리플렉션 메타데이터 기반이라 "왜 동작하는지" 마법처럼 느껴지는 학습 곡선, Express 대비 부팅/콜드스타트가 무거움 |
| 적합성 팩트 | 현재 코드가 이미 이 패턴의 정신을 손으로 구현한 상태(수동 DI만 다름) — "아키텍처"보다 "프레임워크 채택 여부" 문제라 다른 패턴들과 층위가 다름 |

### 2.2 Clean Architecture (Onion Architecture)

**핵심 아이디어**: 동심원 4겹 — `entities`(도메인 규칙) → `use cases`(애플리케이션 로직) →
`interface adapters`(컨트롤러/프레젠터/게이트웨이) → `frameworks & drivers`(Express, DB, 외부
API). **의존성 규칙**: 안쪽 원은 바깥 원을 절대 모른다.

| | 내용 |
|---|---|
| 장점 | 도메인 규칙이 프레임워크/인프라 변경에 완전히 무관(Express→Fastify, Puppeteer→Playwright 교체해도 use case 코드는 안 건드림), 단위테스트가 인프라 목킹 없이 가능, 의존성 방향이 컴파일 타임에 명확 |
| 단점 | 계층이 4개라 기능 하나 추가에도 파일 4개를 오가야 함, "entity"라 부를 도메인 객체가 빈약하면 그 계층이 형식적 껍데기가 되기 쉬움, DTO↔Entity 매핑 보일러플레이트가 계층마다 발생 |
| 적합성 팩트 | 현재 DB 없음, 영속 엔티티 없음. "도메인 규칙"에 해당하는 건 `runChecks`의 판정 로직 정도. PRD상 체크 그룹이 늘어날 계획은 있으나, "엔티티가 여러 개이고 서로 관계 맺는" DDD식 도메인이라는 근거는 현재 문서상 없음 |

### 2.3 Hexagonal Architecture (Ports & Adapters)

**핵심 아이디어**: 도메인 코어가 "포트"(인터페이스)만 정의하고, 실제 구현(HTTP 컨트롤러 =
inbound adapter, Puppeteer/ChromeLauncher/외부 fetch = outbound adapter)은 바깥에서 그 포트를
구현해 주입. Clean Architecture와 철학은 거의 동일(의존성 역전) — 원이 아니라 "육각형"으로
그리는 시각화 차이가 크고, 업계에서 둘을 사실상 동의어처럼 섞어 쓰는 경우도 많음.

| | 내용 |
|---|---|
| 장점 | Clean Architecture와 동일한 이점(테스트 목킹 용이, infra 교체 용이) + 계층이 보통 3개(도메인/포트, 애플리케이션, 어댑터)로 Clean보다 단순하게 그려지는 경우가 많음 |
| 단점 | "포트를 얼마나 잘게 쪼갤지"에 정답이 없어 설계자 재량에 크게 좌우됨, 어댑터 인터페이스를 잘못 설계하면 간접 계층만 하나 늘어난 것처럼 느껴짐 |
| 적합성 팩트 | 지금 `Puppeteer.ts`/`ChromeLauncher.ts` 두 개를 나란히 쓰는 상황(서로 다른 생명주기의 브라우저 자동화 도구)이 "포트 하나, 어댑터 여러 개"로 모델링하기 좋은 사례. `scanService`가 이 둘을 직접 `new`해서 쓰는 지금 구조와 대비됨 |

### 2.4 DDD 모듈러 모놀리스 (Bounded Context)

**핵심 아이디어**: 앱을 여러 "바운디드 컨텍스트"(예: `scan-context`, `reporting-context`)로
나누고, 각 컨텍스트 안에 Aggregate/Value Object/Domain Event/Repository/Application Service를
온전히 갖춤. 컨텍스트 사이는 직접 참조 대신 이벤트나 안티코럽션 레이어로만 통신. 최근 NestJS
커뮤니티(컨퍼런스 발표, 블로그)에서 "모듈러 모놀리스" 키워드로 자주 언급되는 트렌드 — 마이크로
서비스로 쪼개기 전 중간 단계로 인기.

| | 내용 |
|---|---|
| 장점 | 컨텍스트 경계가 곧 향후 마이크로서비스 분리 경계가 됨(성장 경로가 명확), 팀이 커져도 컨텍스트별로 독립 작업 가능 |
| 단점 | 바운디드 컨텍스트가 사실상 1개(스캔 도메인 하나)인 앱에는 "컨텍스트 간 통신" 개념 자체가 성립하지 않아 프레임워크만 무거워짐, Aggregate/Value Object 같은 DDD 전술 패턴은 상태 변경·불변식이 있는 도메인에서 빛나는데 지금은 대부분 조회+판정(읽기 위주) |
| 적합성 팩트 | PRD에 여러 체크 그룹이 있지만, 전부 "URL 하나 스캔"이라는 단일 바운디드 컨텍스트 안의 하위 항목들로 보이며 별개 컨텍스트로 쪼갤 근거는 현재 문서상 없음 |

### 2.5 CQRS (+ 선택적 Event Sourcing)

**핵심 아이디어**: 쓰기(Command)와 읽기(Query) 경로를 완전히 분리 — `CommandHandler`/
`QueryHandler`로 나눠 각자 최적화. NestJS는 `@nestjs/cqrs` 공식 패키지로 1급 지원
(`CommandBus`/`QueryBus`/`EventBus`). Event Sourcing과 묶이면 상태를 이벤트 로그의 재생으로
관리.

| | 내용 |
|---|---|
| 장점 | 읽기/쓰기 부하 패턴이 다른 앱에서 각각 독립적으로 스케일·최적화 가능, 감사 로그가 이벤트 로그로 자연히 남음(Event Sourcing 결합 시) |
| 단점 | 러닝커브가 가장 가파른 축, Command/Query/Handler/Bus 보일러플레이트가 상당함, 쓰기 경로가 없는 앱엔 "쓰기 최적화"라는 존재 이유 자체가 성립 안 함 |
| 적합성 팩트 | meta-scan-api는 DB도 없고 상태 변경(write) 엔드포인트가 사실상 없음(전부 "스캔해서 결과 반환"류 조회성 호출) — CQRS가 풀려는 문제(읽기/쓰기 분리) 자체가 지금 이 앱엔 존재하지 않음 |

### 2.6 Vertical Slice Architecture (Screaming Architecture)

**핵심 아이디어**: 계층(controller/service/repository)이 아니라 **기능(유스케이스) 단위**로
폴더를 구성 — 슬라이스마다 자기 요청 처리 코드를 전부 갖고, 슬라이스 간 공유 서비스 레이어를
최소화. .NET 커뮤니티(Jimmy Bogard)에서 시작해 최근 Node/TS 블로그에서도 "레이어드 아키텍처의
대안"으로 자주 언급됨. 폴더 최상위를 열었을 때 "이 프로젝트가 뭘 하는지"가 바로 보여야 한다는
뜻에서 "Screaming Architecture"라고도 불림.

| | 내용 |
|---|---|
| 장점 | 기능 하나 추가/삭제할 때 건드릴 파일이 한 폴더에 몰림, 슬라이스 간 우발적 결합(어쩌다 서비스 레이어를 공유하게 되는 것)을 원천 차단 |
| 단점 | 슬라이스 간 진짜 공통 로직(예: 여러 스캔 항목이 공유하는 URL 정규화 로직)을 어디 둘지 규칙이 없으면 중복이 쉽게 생김, "얼마나 얇게 슬라이스를 쪼갤지" 기준이 팀마다 제각각 |
| 적합성 팩트 | `src/modules/*`가 이미 기능 단위 폴더링이라 방향이 겹침 — 다만 지금은 모듈 안에서 다시 controller/service로 계층을 나누고 있어 "레이어를 없앤다"는 이 패턴의 핵심 주장과는 다름 |

### 2.7 마이크로서비스 / 이벤트 기반 (참고용)

NestJS는 TCP/Redis/gRPC/Kafka/RabbitMQ 트랜스포터를 1급 지원해서 "모놀리스로 시작 → 나중에
서비스 경계를 그대로 분리"가 트렌드로 자주 언급됨. Lighthouse/Puppeteer처럼 무거운 작업을 별도
워커 프로세스/큐로 빼는 식의 부분 적용은 가능하지만, 전체를 마이크로서비스로 쪼개는 건 지금
단일 API·단일 배포 대상(Cloud Run 컨테이너 하나) 구조와는 별개 논의.

## 3. "아키텍처"라기보다 부품 단위로 얹는 보조 패턴

위 1~7번 아무거나와 조합 가능한 더 작은 단위 패턴들:

- **Repository 패턴**: DB 접근을 인터페이스 뒤로 숨김. 지금 DB가 없어 당장은 해당 없음.
- **Result/Either 타입 에러 처리**(`neverthrow`, `fp-ts` 등): `try/catch`로 예외를 던지는 대신
  성공/실패를 값으로 반환. 지금 `catch(e) { throw ApiError.internal() }`이 원본 에러를 삼키는
  문제를 구조적으로 막아줌.
- **Functional Core, Imperative Shell**: 순수 로직(판정 규칙)은 함수형으로 부작용 없이, I/O
  (fetch/Puppeteer)는 가장자리로 밀어냄. Hexagonal과 자주 같이 언급됨.
- **tRPC류 타입-세이프 RPC**: REST/OpenAPI 대신 프론트-백엔드가 TS 타입을 직접 공유. 프론트도
  TS/Next.js라 궁합은 좋지만, 이건 "내부 아키텍처"가 아니라 "API 계약 방식" 교체라 층위가 다름.

## 4. 다음 단계

2026-08-21에 사용자와 순차 인터뷰(`AskUserQuestion`, 한 번에 하나씩)를 거쳐 **Hexagonal
(Ports & Adapters)**로 결정됐습니다 — 결정 내용/과정/근거는
[ADR-011](adr/index.html#adr-011) + `docs/backend-hexagonal-architecture.md` 참고. 이 survey
문서는 그 결정에 이르기까지 압축 없이 검토한 전체 후보 목록으로 계속 남겨둡니다.

실제 코드 마이그레이션은 아직 안 했습니다 — 프론트 ADR-010 때와 동일하게 "순수 이동/정리
범위"부터 확인하고 시작할 예정입니다.
