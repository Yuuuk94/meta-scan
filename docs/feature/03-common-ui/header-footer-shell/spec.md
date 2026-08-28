# 기능 정의서 — 헤더/푸터 조립

## 기능 개요
- 상태: 구현 완료 | 패키지: front
- 모든 페이지 상단/하단에 고정되는 헤더(워드마크+토글+상태)와 푸터(카피라이트+정책링크+상태) 조립.

## 기능 요구사항
- Given 임의의 페이지, When 렌더되면, Then 헤더/푸터가 공통으로 표시된다

## 비고
- 관련 코드: `ui/organisms/RootHeader.tsx`, `ui/organisms/RootFooter.tsx`
