# 기능 정의서 (확정) — 메타스캔 자체 FAQ 스키마

> `spec.md` 검토 완료 — 크리티컬 이슈 없음, 질문 없이 확정.

## 기능 개요
- 상태: 미구현 | 패키지: front
- meta-scan 자기 자신의 FAQ 섹션(faq-section)에 `FAQPage` JSON-LD를 추가한다. 카테고리 2의
  "FAQ 스키마 생성기"(스캔 대상 사이트를 위한 도구)와는 다른 기능 — 이쪽은 자기 자신의 SEO.

## 기능 요구사항

1. Given 메인 페이지의 FAQ 섹션 데이터(`dictionaries/{ko,en}.json`의 `faq1Q~faq6Q`/`faq1A~faq6A`,
   6개 질문/답변), When 페이지가 렌더되면, Then 현재 로케일에 맞는 질문/답변으로
   `<script type="application/ld+json">`에 `FAQPage` 스키마를 출력한다
2. FAQ 하단 CTA(문의 버튼)는 Q&A가 아니므로 스키마에 포함하지 않는다
3. `HomePage`(서버 컴포넌트)에서만 렌더한다 — FAQ 섹션이 없는 다른 페이지에는 넣지 않는다

## 비고
- faq-section의 질문/답변 데이터를 그대로 재사용(신규 콘텐츠 작성 없음)
