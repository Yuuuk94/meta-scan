import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "json-ld-basics",
  lang: "ko",
  title: "구조화 데이터(JSON-LD) 기초: Article·FAQ·Organization",
  description:
    "JSON-LD는 페이지의 종류, 작성자, 날짜 같은 정보를 검색엔진과 AI가 오해 없이 읽도록 적어 두는 형식입니다. 자주 쓰는 타입별 예시와 검증 방법, 리치 결과에 대한 현실적인 기대치를 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "aiSignals",
  summary: [
    "구조화 데이터는 \"이 페이지는 글이고, 작성자는 누구이고, 언제 쓰였다\" 같은 정보를 정해진 어휘(Schema.org)로 적어 두는 것입니다. 구글은 여러 형식 중 `<script type=\"application/ld+json\">`으로 넣는 JSON-LD를 권장합니다.",
    "구조화 데이터를 넣는다고 순위가 오르지는 않습니다. 대신 리치 결과(별점, 이동 경로 등) 자격을 얻고, 검색엔진과 AI가 페이지를 정확히 해석하도록 돕습니다.",
  ],
  sections: [
    {
      heading: "JSON-LD 기본 모양",
      blocks: [
        {
          type: "p",
          text: "JSON-LD는 HTML 어디에 넣어도 되지만 보통 `<head>`나 본문 끝에 둡니다. `@context`는 어휘의 출처(Schema.org), `@type`은 이 데이터가 무엇인지를 뜻합니다.",
        },
        {
          type: "code",
          text: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "robots.txt 확인하는 법과 흔한 실수 5가지",\n  "datePublished": "2026-11-11",\n  "dateModified": "2026-11-11",\n  "author": { "@type": "Person", "name": "작성자 이름" },\n  "publisher": { "@type": "Organization", "name": "META_SCAN.BIZ" }\n}\n</script>',
        },
        {
          type: "p",
          text: "마이크로데이터나 RDFa처럼 HTML 태그 속성에 섞어 쓰는 방식도 있지만, JSON-LD는 화면 마크업과 분리되어 있어 관리와 수정이 쉽습니다. 프레임워크에서 데이터를 받아 JSON으로 출력하기만 하면 됩니다.",
        },
      ],
    },
    {
      heading: "자주 쓰는 타입",
      blocks: [
        {
          type: "table",
          head: ["타입", "어디에", "핵심 속성"],
          rows: [
            ["Organization", "홈페이지", "name, url, logo, sameAs(공식 SNS)"],
            ["WebSite", "홈페이지", "name, url"],
            ["Article / BlogPosting", "블로그 글, 뉴스", "headline, datePublished, dateModified, author"],
            ["BreadcrumbList", "계층이 있는 페이지", "itemListElement(순서, 이름, 주소)"],
            ["FAQPage", "질문-답 목록이 보이는 페이지", "mainEntity(Question, acceptedAnswer)"],
            ["Product", "상품 상세", "name, offers(가격), aggregateRating"],
            ["SoftwareApplication / WebApplication", "도구·앱 소개", "name, applicationCategory, offers"],
          ],
        },
        {
          type: "p",
          text: "META_SCAN의 블로그 글에는 Article, BreadcrumbList, FAQPage 세 가지가 들어가 있고, 홈에는 WebApplication, WebSite, Organization이 들어가 있습니다. 페이지 성격에 맞는 것만 고르면 되고 많이 넣을수록 좋은 것은 아닙니다.",
        },
      ],
    },
    {
      heading: "리치 결과, 어디까지 기대할까",
      blocks: [
        {
          type: "p",
          text: "구조화 데이터는 한때 \"넣으면 검색 결과가 화려해진다\"고 알려졌지만, 구글은 몇 년 사이 리치 결과 범위를 많이 줄였습니다.",
        },
        {
          type: "list",
          items: [
            "**FAQ 리치 결과**: 2023년부터 정부·보건 분야의 권위 있는 사이트에만 표시됩니다. 일반 사이트는 FAQPage를 넣어도 검색 결과에 질문 목록이 펼쳐지지 않습니다.",
            "**HowTo 리치 결과**: 2023년에 표시가 중단됐습니다.",
            "**여전히 유효한 것**: 이동 경로(BreadcrumbList), 상품 가격·리뷰(Product), 이벤트, 레시피, 채용 공고 등은 지금도 리치 결과로 표시됩니다.",
          ],
        },
        {
          type: "callout",
          label: "그래도 넣는 이유",
          text: "FAQ 리치 결과가 안 나와도 FAQPage는 \"이 페이지에 이런 질문과 답이 있다\"는 구조를 기계에 명확히 알려 줍니다. AI 답변 엔진이 페이지에서 질문-답 쌍을 찾는 데 도움이 될 수 있어, 화면에 실제 FAQ가 있다면 넣어 두는 편이 낫습니다.",
        },
      ],
    },
    {
      heading: "지켜야 할 규칙",
      blocks: [
        {
          type: "list",
          items: [
            "**화면에 보이는 내용과 일치**: 구조화 데이터에만 있고 화면에는 없는 리뷰나 FAQ를 넣으면 구글 정책 위반입니다. 수동 조치를 받을 수 있습니다.",
            "**페이지마다 다르게**: 모든 글에 같은 headline이나 날짜를 넣는 실수가 흔합니다. 페이지 데이터에서 생성하세요.",
            "**필수 속성 채우기**: 타입마다 구글이 요구하는 필수 속성이 있습니다. 빠지면 리치 결과 자격이 없습니다.",
            "**날짜 형식**: `2026-11-11`이나 `2026-11-11T09:00:00+09:00` 같은 ISO 8601 형식을 씁니다.",
            "**주소는 전체 URL**: url, logo, image에는 `https://`부터 쓴 전체 주소를 넣습니다.",
          ],
        },
      ],
    },
    {
      heading: "검증하는 방법",
      blocks: [
        {
          type: "table",
          head: ["도구", "용도"],
          rows: [
            ["구글 리치 결과 테스트", "구글이 지원하는 리치 결과 자격이 있는지, 필수 속성 누락이 없는지"],
            ["Schema Markup Validator", "Schema.org 문법 전체를 기준으로 오류 확인 (구글 지원 여부와 무관)"],
            ["서치콘솔 > 개선사항", "사이트 전체에서 타입별 유효·오류 항목 수 추적"],
          ],
        },
        {
          type: "p",
          text: "배포 전에는 리치 결과 테스트에 코드나 주소를 넣어 확인하고, 배포 후에는 서치콘솔 개선사항 보고서에서 오류가 늘지 않는지 지켜보면 됩니다. META_SCAN의 'AI 신호' 카드도 페이지에 JSON-LD가 있는지, 어떤 타입이 들어 있는지를 보여줍니다.",
        },
      ],
    },
    {
      heading: "프레임워크에서 넣는 법",
      blocks: [
        {
          type: "p",
          text: "Next.js(App Router)에서는 페이지 컴포넌트에서 `<script type=\"application/ld+json\" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`를 렌더링하는 방식이 공식 문서에 안내되어 있습니다. 글 데이터에서 객체를 만드는 함수를 따로 두면 테스트하기도 쉽습니다. 워드프레스는 대부분의 SEO 플러그인이 Article, Organization, BreadcrumbList를 자동으로 넣어 줍니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "구조화 데이터를 넣으면 순위가 오르나요?",
      a: "구글은 구조화 데이터가 순위 요소가 아니라고 밝히고 있습니다. 리치 결과로 표시되어 클릭률이 오르는 간접 효과는 있을 수 있습니다.",
    },
    {
      q: "JSON-LD를 여러 개 넣어도 되나요?",
      a: "됩니다. 타입별로 script 태그를 나눠도 되고 `@graph`로 한 번에 묶어도 됩니다. 같은 정보를 서로 다르게 중복 선언하지 않도록만 주의하세요.",
    },
    {
      q: "네이버도 구조화 데이터를 읽나요?",
      a: "네이버도 JSON-LD를 포함한 구조화 데이터를 지원한다고 안내하고 있습니다. 다만 표시 방식과 지원 타입은 구글과 다르니 네이버 서치어드바이저 문서를 함께 확인하세요.",
    },
  ],
  related: ["ai-search-citation", "seo-aeo-geo", "title-description"],
  references: [
    {
      title: "Google Search Central: 구조화된 데이터 마크업 이해하기",
      url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    },
    {
      title: "Google Search Central: 구조화된 데이터 일반 가이드라인",
      url: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
    },
    {
      title: "Google Search Central Blog: HowTo·FAQ 리치 결과 변경 (2023)",
      url: "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
    },
    { title: "Schema.org", url: "https://schema.org/" },
    { title: "Google 리치 결과 테스트", url: "https://search.google.com/test/rich-results" },
    { title: "Schema Markup Validator", url: "https://validator.schema.org/" },
  ],
};
