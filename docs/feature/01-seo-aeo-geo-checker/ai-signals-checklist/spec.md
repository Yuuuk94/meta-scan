# 기능 정의서 — AI 신호(AI Signals/AEO) 체크리스트 카드

## 기능 개요
- 상태: 전부 미구현 | 패키지: both | PRD §3.4
- 의존성: pipe-connection 완료 후
- 이 제품의 핵심 차별화 지점. prompts.txt/구조화 데이터/FAQ 섹션/JS 렌더링 의존도를 새로 판정한다.
  대부분 "없다고 감점"이 아니라 "있으면 좋은 신호"(info)로 표시.

## 기능 요구사항
- Given `crawling`이 원본 HTML을 fetch하는 지점, When 이 fetch가 실행되면,
  Then `/.well-known/prompts.txt`도 같은 방식(존재/바이트 수 판정)으로 병렬 fetch한다
  (별도 API 라우트 없음 — 5번째 API 호출이 생기면 4단계 구성이 깨짐, ADR-003)
- Given DOM/JSON-LD 파싱, When 처리하면, Then `promptsTxt`/`promptObject`/`faqSection`/
  `structuredData`(존재=pass, 없음=info) 판정을 `checks.aiSignals`에 추가한다
- Given `html.deltaRatio`(이미 계산됨), When 그룹을 배정하면,
  Then `jsRenderDelta`(15% 미만=pass, 15~40%=warning, 40%+=fail)로 `checks.aiSignals`에 추가한다
- Given `checks.aiSignals`, When `/scan`을 렌더하면, Then 신규 "AI 신호" 카드가 5개 항목을
  표시하되 `info` 판정은 시각적으로 낮은 무게로 렌더링한다(감점처럼 보이지 않게)

## 비고
- 스코프 아님: 후속 "FAQ 스키마 생성기"(카테고리 2) — 이 기능은 진단(감지)까지만
