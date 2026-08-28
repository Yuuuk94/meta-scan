# 기능 정의서 — 스캔 결과 파이프 연결 (걷기 골격)

## 기능 개요
- 상태: 미구현 | 패키지: front | PRD §2,§4,§6.1,§6.3,§6.4,§6.5 | ADR-003
- 의존성: robots-gating과 같은 파일(`ProcessScreen.tsx`) — 병합 순서 조율 필요.
  이 기능 완료 후에야 나머지 체크리스트 카드들이 실제 화면에서 확인 가능해짐.
- `ProcessScreen`이 이미 4개 API를 병렬 호출하지만 응답 바디를 버리고, `/scan`은 mock을
  렌더링하는 상태를 실데이터로 연결한다. 그룹별 `checks{}` 재구성이나 개별 카드 완성은 이 기능
  스코프가 아니다 — "API 응답이 실제로 화면까지 흘러가는가"만 증명하는 걷기 골격이다.

## 기능 요구사항
- Given robots-gating을 통과, When sitemap/crawling/lighthouse 3개가 각각 응답하면,
  Then `ProcessScreen`이 각 응답 본문을 저장하고 해당 스텝 아이콘을 실시간 '완료'로 반영한다
- Given 4개(robots 포함) 응답이 모두 모임, When `combineScanResults` 유틸을 호출하면,
  Then 4개 원본 응답을 하나의 결과 객체로 취합한다(계산 아님 — 이미 판정된 값만 모음)
- Given 취합이 끝남, When 결과를 저장하면, Then `stores/scanStore.ts`의 죽은 `useBearStore`를
  도메인에 맞는 이름(예: `useScanStore`)으로 교체하고 4개 원본 + 취합 결과를 저장한다
- Given 저장이 끝남, When `/scan`으로 이동하면, Then mock 대신 스토어의 실제 값을 렌더링한다
  (최소 하나 이상의 카드가 실데이터로 채워지면 완료로 봄)
- Given `/scan`에 결과 없이 직접 진입, When 스토어가 비어있으면, Then 안내 화면 또는 `/`로
  리다이렉트한다
- Given Lighthouse 호출, When `lsRunApi`가 요청을 보내면, Then `onlyCategories`가 4개
  (performance/seo/best-practices/accessibility) 전부를 포함한다(현재 2개만 요청하는 버그 수정)

## 비고
- Hero 교체 포함: 중앙 점수 카드를 없애고 `topIssues`(fail 상위 N개, 기본 3개)로 교체.
  `dictionaries`의 `scan.aiPreparednessScore` 키 제거.
- 이전 초안의 `scan-result-shell`(PRD §6.3)은 별도 슬라이스로 두지 않고 여기 흡수함
- 스코프 아님: 그룹별 `checks{}` 응답 재구성(각 체크리스트 슬라이스가 담당), 개별 카드 콘텐츠 완성
