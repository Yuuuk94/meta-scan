# 기능 정의서 (확정) — 스캔 결과 파이프 연결 (걷기 골격)

> `spec.md` 검토 완료. 이 파일이 최종 스펙입니다. 검토 과정의 Q&A는 맨 아래 "검토 결정 로그" 참고.

## 기능 개요
- 상태: 미구현 | 패키지: front | PRD §2,§4,§6.1,§6.3,§6.4,§6.5 | ADR-003
- 의존성: robots-gating과 같은 파일(`ProcessScreen.tsx`) — robots-gating이 먼저 `dev`에 병합된 뒤
  분기. 이 기능 완료 후에야 나머지 체크리스트 카드들이 실제 화면에서 확인 가능해짐.
- `ProcessScreen`이 이미 4개 API를 병렬 호출하지만 응답 바디를 버리고, `/scan`은 mock을 렌더링하는
  상태를 실데이터로 연결한다. "API 응답이 실제로 화면까지 흘러가는가"만 증명하는 걷기 골격.
- **결과는 `/scan/:id`로 라우팅**(id는 랜덤 UUID) — 공유/북마크 가능한 결과 링크를 위해 URL 기반
  암묵 조회 대신 명시적 id 기반 조회로 설계(사용자 추가 지시).

## 기능 요구사항

1. Given robots-gating을 통과, When sitemap/crawling/lighthouse 3개가 각각 응답하면,
   Then `ProcessScreen`이 각 응답 본문을 저장하고 해당 스텝 아이콘을 실시간 '완료'로 반영한다
2. Given 취합이 끝남, When 결과를 저장하면, Then `crypto.randomUUID()`로 새 `id`를 생성하고
   `useScanStore`(zustand `persist` 미들웨어, localStorage)에 `{ [id]: { url, raw, combined,
   scannedAt } }` 형태로 저장한다(`scannedAt`은 저장 시각 타임스탬프) — 같은 URL을 다시 스캔해도
   매번 새 id가 생겨 이전 결과의 공유 링크 내용이 바뀌지 않는다
3. Given 저장된 항목, When `scannedAt`로부터 10분이 지나면, Then 그 항목은 만료로 간주해 더 이상
   유효한 결과로 쓰지 않는다(스토어 읽기 시점 필터링 또는 쓰기 시점 정리 — 구현 단계에서 확정)
4. Given sitemap/crawling/lighthouse 3개 모두 실패, When 결과를 취합하면,
   Then `/scan/:id`로 이동하지 않고 `ErrorScreen`으로 전환한다
5. Given 3개 중 하나 이상 성공, When 결과를 취합하면, Then 성공한 API에 해당하는 카드는 정상
   표시하고, 실패한 API에 해당하는 카드는 "확인 불가" 상태로 표시한다(체크리스트 4값 배지와는
   구분되는 별도 표시 — 회색 플레이스홀더 등)
6. Given `combineScanResults` 유틸 호출, When 4개(robots 포함) 원본 응답이 모두 모이면,
   Then 이미 판정된 값만 그룹별로 merge한다(계산 아님). 이 시점엔 기존에 이미 있는 필드(title/
   description/og/twitter/h1 등)만 취합 대상이어도 되고, 그룹 구조(`checks.basicSeo` 등)는 이
   기능에서 강제하지 않는다(각 체크리스트 슬라이스가 구현되며 채워감)
7. Given 저장이 끝남(id 발급됨), When 결과 화면으로 이동하면, Then `/scan/:id`로 이동하고
   mock 대신 스토어의 실제 값을 렌더링한다(최소 하나 이상의 카드가 실데이터로 채워지면 완료로 봄)
8. Given `topIssues`(fail 우선, 모자라면 warning으로 채움)가 완전히 비어있음(fail도 warning도
   없음), When Hero를 렌더하면, Then "지금까지 확인한 항목에서 심각한 문제가 없습니다" 류의
   긍정적 문구로 대체한다
9. Given `/scan/:id`에 진입, When 스토어에서 해당 `id`를 조회했는데 없거나 `scannedAt`이 10분
   초과(만료), Then "표시할 결과가 없습니다" 안내 화면 + 홈 이동 버튼을 보여준다(말없이 리다이렉트
   하지 않음). `id` 없는 bare `/scan` 진입도 동일하게 처리한다.
10. Given Lighthouse 호출, When `lsRunApi`가 요청을 보내면, Then `onlyCategories`가 4개
    (performance/seo/best-practices/accessibility) 전부를 포함한다(현재 2개만 요청하는 버그 수정)

## 라우팅/스토어 구조 변경

- `app/[lang]/scan/page.tsx` → `app/[lang]/scan/[id]/page.tsx`(동적 라우트)로 변경
- 스토어 키는 URL이 아니라 `id`(UUID) — `url` 필드는 각 엔트리 안에 부가 정보로만 유지(필요하면
  "이 URL의 최근 결과" 보조 조회에 순회로 사용 가능하나, 이번 스코프의 필수 기능은 아님)

## Hero 교체

- 중앙 "AI Preparedness Score" 큰 숫자 카드 제거, `topIssues`(fail 상위 N개, 기본 3개)로 교체
- `dictionaries`의 `scan.aiPreparednessScore` 키 제거, Hero용 신규 문구(빈 상태 문구 포함) 추가

## 비고

- 이전 초안의 `scan-result-shell`(PRD §6.3)은 별도 슬라이스로 두지 않고 여기 흡수함
- 스코프 아님: 그룹별 `checks{}` 응답 재구성(각 체크리스트 슬라이스가 담당), 개별 카드 콘텐츠 완성,
  스캔 히스토리를 사용자에게 보여주는 UI(지금은 내부 저장 구조만 id별 — 목록 조회 UI는 없음)
- TTL 만료 판단 시점(읽기 vs 쓰기)은 구현 단계에서 확정 — 스펙은 "10분 지나면 무효"라는 정책만 고정
- 공유된 `/scan/:id` 링크를 다른 사람이 열었을 때도 10분 TTL이 그대로 적용됨(로컬 브라우저의
  localStorage 기준이라, 애초에 다른 브라우저/기기에서는 열리지 않음 — 진짜 "공유"가 되려면 서버
  저장이 필요하나 이번 스코프에서는 로컬 전용으로 충분하다고 봄)

## 검토 결정 로그

| # | 질문 | 결정 | 이유 |
|---|---|---|---|
| 1 | 결과를 localStorage에 영속화? 메모리만? | localStorage 영속화 | 새로고침/재방문 자연스러움, 비용 큰 재스캔 방지 |
| 2 | 최신 1건? URL별 히스토리? | URL별 히스토리 + 10분 TTL(사용자 추가 지시) | 여러 URL 결과 보존하되 용량/신선도 문제 방지 |
| 3 | 일부 API만 실패하면? | 3개 다 실패해야 ErrorScreen, 아니면 부분 표시 | 부분 성공도 유용한 정보 |
| 4 | fail/warning 없을 때 Hero는? | 긍정적 문구로 대체 | 파이프 연결 시점엔 이 케이스가 흔함 |
| 5 | 결과 없음/만료 시 처리는? | 안내 화면 + 홈 버튼(말없는 리다이렉트 금지) | TTL로 "결과가 사라지는" 상황이 생겨 설명 필요 |
| 6 | id 기반 라우팅(`/scan/:id`)으로 전환, id는 어떻게? | 랜덤 UUID(사용자 추가 지시) | 가장 간단, url은 store 엔트리 안 부가 필드로 유지 |
