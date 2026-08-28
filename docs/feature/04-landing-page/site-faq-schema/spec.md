# 기능 정의서 — 메타스캔 자체 FAQ 스키마

## 기능 개요
- 상태: 미구현 | 패키지: front
- meta-scan 자기 자신의 FAQ 섹션(faq-section)에 `FAQPage` JSON-LD를 추가한다. 카테고리 2의
  "FAQ 스키마 생성기"(스캔 대상 사이트를 위한 도구)와는 다른 기능 — 이쪽은 자기 자신의 SEO.

## 기능 요구사항
- Given 메인 페이지의 FAQ 섹션 데이터(6개 질문/답변), When 페이지가 렌더되면,
  Then `<script type="application/ld+json">`로 `FAQPage` 스키마를 출력한다

## 비고
- faq-section의 질문/답변 데이터를 그대로 재사용
