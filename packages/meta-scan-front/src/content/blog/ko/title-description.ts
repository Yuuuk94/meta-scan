import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "title-description",
  lang: "ko",
  title: "title·description 잘 쓰는 법: 길이, 규칙, 실수",
  description:
    "title과 meta description은 검색 결과에서 사용자가 가장 먼저 보는 문장입니다. 적당한 길이, 구글이 제목을 바꿔 쓰는 이유, 페이지마다 다르게 쓰는 방법과 흔한 실수를 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "basicSeo",
  isHub: true,
  summary: [
    "`<title>`은 검색 결과의 파란 제목과 브라우저 탭에, `<meta name=\"description\">`은 제목 아래 설명 문장에 쓰입니다. 둘 다 페이지마다 달라야 하고, 그 페이지에서 무엇을 얻을 수 있는지 분명히 말해야 합니다.",
    "길이는 \"몇 글자\"로 딱 정해져 있지 않습니다. 구글은 화면 폭에 맞춰 자르기 때문에, 한국어 기준 제목은 30자 안팎, 설명은 80~120자 정도를 목표로 하고 핵심은 앞쪽에 두는 것이 안전합니다.",
  ],
  sections: [
    {
      heading: "title: 검색 결과의 제목",
      blocks: [
        {
          type: "p",
          text: "title은 구글이 페이지 주제를 판단하는 강한 신호이자, 사용자가 클릭할지 정하는 첫 문장입니다. 좋은 title에는 공통점이 있습니다.",
        },
        {
          type: "list",
          items: [
            "**페이지의 고유한 주제를 앞에**: \"브랜드명 - 페이지 주제\"보다 \"페이지 주제 - 브랜드명\"이 잘리더라도 핵심이 남습니다.",
            "**사람들이 실제로 검색하는 말**: 내부 용어 대신 사용자가 쓰는 단어로 씁니다. \"색인 생성 불가 대응\"보다 \"구글에 안 나올 때\"가 검색됩니다.",
            "**H1과 같은 내용**: 제목과 본문 첫 제목(H1)이 다르면 구글이 제목을 바꿔 쓸 가능성이 높아집니다.",
            "**키워드 나열 금지**: \"SEO, SEO 분석, SEO 검사, 무료 SEO\"처럼 반복하면 스팸 신호가 되고 구글이 제목을 대체합니다.",
          ],
        },
        {
          type: "table",
          head: ["나쁜 예", "좋은 예"],
          rows: [
            ["홈", "무료 SEO/AEO/GEO 분석기 - META_SCAN.BIZ"],
            ["블로그", "robots.txt 확인하는 법과 흔한 실수 5가지"],
            ["상품 상세 | 쇼핑몰 | 신발 | 운동화 | 최저가", "가벼운 러닝화 OO 270mm - 브랜드명"],
          ],
        },
      ],
    },
    {
      heading: "구글이 제목을 바꿔 쓰는 이유",
      blocks: [
        {
          type: "p",
          text: "구글은 검색 결과의 제목(공식 명칭은 '제목 링크')을 만들 때 title을 우선 쓰지만, 적절하지 않다고 판단하면 H1, 본문 제목, 링크 텍스트 등을 대신 씁니다. 대체가 일어나는 대표적인 경우는 다음과 같습니다.",
        },
        {
          type: "list",
          items: [
            "title이 비어 있거나 \"Untitled\", \"홈\"처럼 의미가 없는 경우",
            "사이트의 여러 페이지가 같은 title을 쓰는 경우",
            "title이 지나치게 길거나 키워드가 반복된 경우",
            "title과 페이지 내용(H1)이 서로 다른 말을 하는 경우",
          ],
        },
        {
          type: "callout",
          label: "실제 사례",
          text: "META_SCAN도 한동안 모든 페이지의 title이 \"META_SCAN.BIZ\" 하나였고 description도 전부 같았습니다. 레이아웃에만 메타데이터를 둔 탓입니다. 지금은 페이지마다 `META_SCAN.BIZ - 페이지 주제` 형식으로 따로 만듭니다.",
        },
      ],
    },
    {
      heading: "description: 클릭을 부르는 설명",
      blocks: [
        {
          type: "p",
          text: "meta description은 순위 요소가 아닙니다. 그래도 검색 결과에서 제목 아래에 표시되어 클릭 여부에 영향을 줍니다. 구글은 검색어에 더 맞는 문장이 본문에 있으면 description 대신 본문 일부를 보여주기도 합니다.",
        },
        {
          type: "list",
          items: [
            "페이지에서 무엇을 얻을 수 있는지 구체적으로 씁니다. \"다양한 정보를 제공합니다\" 같은 문장은 아무것도 말하지 않습니다.",
            "숫자와 범위를 넣습니다. \"7가지\", \"5분 만에\", \"무료\" 같은 정보는 판단을 돕습니다.",
            "페이지마다 다르게 씁니다. 같은 description이 반복되면 구글은 대부분 무시하고 본문에서 뽑아 씁니다.",
            "따옴표(\")를 쓰면 HTML 속성이 끊길 수 있으니 이스케이프되는지 확인합니다.",
          ],
        },
      ],
    },
    {
      heading: "길이는 얼마가 적당한가",
      blocks: [
        {
          type: "p",
          text: "구글은 글자 수가 아니라 화면 폭(픽셀)에 맞춰 자릅니다. 한글은 영문보다 폭이 넓어서 같은 글자 수라도 먼저 잘립니다. 공식 상한선은 없지만 실무에서 쓰는 기준은 다음과 같습니다.",
        },
        {
          type: "table",
          head: ["항목", "한국어 권장", "영어 권장", "넘으면"],
          rows: [
            ["title", "약 25~35자", "약 50~60자", "뒷부분이 …로 잘림"],
            ["description", "약 80~120자", "약 120~160자", "잘리거나 본문 문장으로 대체"],
          ],
        },
        {
          type: "p",
          text: "길이보다 중요한 건 순서입니다. 잘려도 의미가 통하도록 가장 중요한 말을 앞에 둡니다. META_SCAN의 '기본 SEO' 카드는 title과 description의 존재 여부와 길이를 확인하고, '미리보기' 카드에서 실제 검색 결과 모양을 보여줍니다.",
        },
      ],
    },
    {
      heading: "페이지마다 다르게 만드는 방법",
      blocks: [
        {
          type: "table",
          head: ["환경", "방법"],
          rows: [
            ["Next.js(App Router)", "페이지별 `generateMetadata`에서 title과 description을 반환합니다. 레이아웃에는 `title.template`만 두면 \"%s - 브랜드\" 형식을 공통으로 쓸 수 있습니다."],
            ["워드프레스", "SEO 플러그인의 글 편집 화면에서 제목·설명 필드를 채웁니다. 비워 두면 글 제목과 본문 앞부분으로 자동 생성됩니다."],
            ["쇼핑몰·대량 페이지", "상품명, 카테고리, 핵심 속성을 조합하는 템플릿을 만들고, 주요 페이지만 손으로 다듬습니다."],
          ],
        },
        {
          type: "p",
          text: "배포 후에는 서치콘솔 실적 보고서에서 노출은 많은데 클릭률이 낮은 페이지를 찾아 title과 description을 고쳐 보세요. 순위를 바꾸지 않고도 방문을 늘릴 수 있는 가장 빠른 방법입니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "title에 브랜드명은 꼭 넣어야 하나요?",
      a: "필수는 아니지만 넣는 것이 일반적입니다. 구글은 검색 결과에 사이트 이름을 따로 표시하기도 하므로, 브랜드명은 짧게 뒤쪽에 두고 앞에는 페이지 주제를 쓰는 것이 좋습니다.",
    },
    {
      q: "description을 비워 두면 어떻게 되나요?",
      a: "구글이 본문에서 적당한 문장을 골라 보여줍니다. 다만 의도와 다른 문장이 나올 수 있고, 카카오톡 등 공유 미리보기에서는 설명이 빈칸이 되기도 합니다.",
    },
    {
      q: "meta keywords 태그는 써야 하나요?",
      a: "구글은 meta keywords를 검색에 사용하지 않는다고 오래전부터 밝혀 왔습니다. 넣어도 효과가 없으니 시간을 쓸 필요가 없습니다.",
    },
  ],
  related: ["og-tags-preview", "heading-structure", "site-not-on-google"],
  references: [
    {
      title: "Google Search Central: 검색 결과의 제목 링크 관리",
      url: "https://developers.google.com/search/docs/appearance/title-link",
    },
    {
      title: "Google Search Central: 검색 결과 스니펫 관리",
      url: "https://developers.google.com/search/docs/appearance/snippet",
    },
    {
      title: "Google Search Central: SEO 기본 가이드",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    {
      title: "Next.js Docs: generateMetadata",
      url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata",
    },
  ],
};
