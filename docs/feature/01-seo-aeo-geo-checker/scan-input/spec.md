# 기능 정의서 — URL 입력 (Scan Input)

## 기능 개요
- 상태: 구현 완료 | 패키지: front | PRD §2 | 의존성: 없음(체커 흐름의 시작점)
- 메인 페이지 Hero의 URL 입력창. 정규식으로 형식을 검증하고, 통과하면 `crrUrl` 쿠키에 저장한 뒤
  `/request-scan`으로 이동한다.

## 기능 요구사항
- Given 사용자가 메인 페이지에 있음, When URL을 입력하고 "분석하기"를 누르면,
  Then 정규식 검증 통과 시 `crrUrl` 쿠키에 저장하고 `/request-scan`으로 이동한다
- Given URL 형식이 잘못됨, When "분석하기"를 누르면, Then 인라인 에러 메시지를 표시하고 이동하지 않는다

## 비고
- 관련 코드: `ui/organisms/HeroSection.tsx`, `utils/cookies.ts`
- 화면 위치는 메인/랜딩 페이지(04)지만 기능적으로는 체커(01)의 시작점이라 이 카테고리에 둠
