import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "hreflang",
  lang: "ko",
  title: "hreflang 설정과 다국어 사이트 SEO",
  description:
    "한국어·영어 페이지가 따로 있다면 hreflang으로 서로를 연결해야 검색엔진이 언어에 맞는 페이지를 보여줍니다. 작성법, x-default, 돌려받는 링크, 쿠키로 언어를 바꾸는 사이트의 함정을 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "i18n",
  isHub: true,
  summary: [
    "hreflang은 \"이 페이지의 한국어 버전은 여기, 영어 버전은 여기\"라고 검색엔진에 알려주는 표시입니다. 구글은 이를 보고 한국어 사용자에게는 한국어 페이지를, 영어 사용자에게는 영어 페이지를 보여줍니다.",
    "가장 큰 전제는 **언어마다 주소가 달라야 한다**는 것입니다. 같은 주소에서 쿠키나 브라우저 설정에 따라 언어만 바뀌는 사이트는 검색엔진이 한 언어만 보게 되어 hreflang이 의미가 없습니다.",
  ],
  sections: [
    {
      heading: "작성법",
      blocks: [
        {
          type: "p",
          text: "가장 흔한 방법은 각 페이지의 `<head>`에 `link` 태그로 넣는 것입니다. 모든 언어 버전이 **자기 자신을 포함해** 전체 목록을 똑같이 가지고 있어야 합니다.",
        },
        {
          type: "code",
          text: '<!-- /ko/blog/robots-txt 와 /en/blog/robots-txt 양쪽에 똑같이 -->\n<link rel="alternate" hreflang="ko" href="https://example.com/ko/blog/robots-txt" />\n<link rel="alternate" hreflang="en" href="https://example.com/en/blog/robots-txt" />\n<link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/robots-txt" />',
        },
        {
          type: "table",
          head: ["방법", "장점", "적합한 경우"],
          rows: [
            ["HTML link 태그", "가장 단순, 페이지 소스로 확인 쉬움", "대부분의 웹사이트"],
            ["HTTP 헤더(Link)", "HTML이 아닌 파일에도 가능", "PDF 등 문서 파일"],
            ["사이트맵 xhtml:link", "페이지 HTML을 건드리지 않음", "페이지가 매우 많은 사이트"],
          ],
        },
        {
          type: "p",
          text: "세 방법 중 하나만 쓰면 됩니다. 섞어 쓰면 관리가 어려워지고 서로 다른 정보가 들어가기 쉽습니다.",
        },
      ],
    },
    {
      heading: "언어·지역 코드 규칙",
      blocks: [
        {
          type: "list",
          items: [
            "언어는 ISO 639-1 두 글자 코드: `ko`, `en`, `ja`",
            "지역을 구분해야 하면 ISO 3166-1 두 글자 국가 코드를 붙임: `en-US`, `en-GB`, `zh-TW`",
            "국가 코드만 단독으로 쓸 수는 없음: `kr`(X), `ko-KR`(O)",
            "흔한 오타: 한국어는 `kr`이 아니라 `ko`, 영국은 `en-UK`가 아니라 `en-GB`",
          ],
        },
        {
          type: "p",
          text: "`x-default`는 \"사용자 언어에 맞는 버전이 없을 때 보여줄 페이지\"입니다. 언어 선택 화면이나 가장 범용적인 언어(보통 영어) 페이지를 지정합니다. 필수는 아니지만 넣어 두면 의도가 분명해집니다.",
        },
      ],
    },
    {
      heading: "가장 흔한 실수: 돌려받는 링크가 없음",
      blocks: [
        {
          type: "p",
          text: "한국어 페이지가 영어 페이지를 가리키면, 영어 페이지도 한국어 페이지를 가리켜야 합니다. 한쪽에만 있으면 구글은 그 hreflang을 무시합니다. 다른 사이트가 마음대로 내 페이지를 자기 번역본이라고 주장하지 못하게 하는 장치입니다.",
        },
        {
          type: "table",
          head: ["실수", "결과"],
          rows: [
            ["한쪽 방향만 연결", "연결 전체가 무시됨"],
            ["자기 자신을 목록에서 뺌", "일부 도구에서 오류로 표시, 권장 형식 위반"],
            ["hreflang 주소가 리디렉션·404", "해당 언어 연결 무시"],
            ["모든 언어 페이지의 canonical이 한 언어를 가리킴", "다른 언어 페이지가 색인에서 빠짐"],
          ],
        },
        {
          type: "callout",
          label: "핵심",
          text: "언어별 페이지는 각자 자기 주소를 canonical로 둡니다. canonical은 '같은 내용의 대표 주소'이고, 번역본은 다른 내용이기 때문입니다. 자세한 내용은 [canonical 태그](/ko/blog/canonical-tag) 글에 있습니다.",
        },
      ],
    },
    {
      heading: "쿠키·자동 리디렉션의 함정",
      blocks: [
        {
          type: "p",
          text: "방문자의 IP나 브라우저 언어(Accept-Language), 쿠키를 보고 언어를 자동으로 바꾸는 사이트가 많습니다. 사용자에게는 편하지만 검색엔진에게는 문제가 됩니다. 구글 크롤러는 대부분 미국에서, 언어 설정 없이, 쿠키 없이 방문하기 때문입니다.",
        },
        {
          type: "callout",
          label: "실제 사례",
          text: "META_SCAN도 처음에는 언어를 URL이 아니라 쿠키로 정했습니다. 그래서 `/en` 주소로 들어가도 쿠키가 한국어면 한국어가 나왔고, 검색엔진 입장에서는 `/ko`와 `/en`이 같은 내용의 중복 페이지였습니다. 지금은 URL의 언어 경로가 항상 우선하고, 쿠키는 처음 방문했을 때 어느 언어로 보낼지만 정합니다.",
        },
        {
          type: "list",
          items: [
            "언어별 주소에서는 항상 그 언어 내용을 보여줍니다. 주소가 언어를 결정해야 합니다.",
            "자동 리디렉션은 언어가 없는 루트(`/`)에서만 하고, 이미 언어가 붙은 주소에서는 하지 않습니다.",
            "대신 페이지 상단에 \"English version available\" 같은 안내 배너나 언어 전환 링크를 둡니다.",
          ],
        },
      ],
    },
    {
      heading: "번역 품질과 얇은 페이지",
      blocks: [
        {
          type: "p",
          text: "hreflang은 번역본을 연결할 뿐, 번역본이 색인될 가치가 있는지는 별개입니다. 기계 번역을 손보지 않고 그대로 올린 페이지는 품질이 낮다고 판단될 수 있습니다. 또 한 언어에만 있는 글을 다른 언어 목록에 빈 페이지로 노출하는 것도 피해야 합니다.",
        },
        {
          type: "p",
          text: "META_SCAN 블로그도 아직 한국어 글만 있어서 영어 블로그 목록은 noindex로 두고, 글별 hreflang은 실제로 존재하는 언어만 연결합니다. 번역본이 생기면 그때 양쪽을 연결하는 방식입니다.",
        },
      ],
    },
    {
      heading: "확인하는 방법",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "각 언어 페이지의 소스에서 `hreflang`을 검색해 모든 언어 목록이 똑같이 들어 있는지 봅니다.",
            "목록의 주소를 하나씩 열어 200으로 열리고 해당 언어 내용이 나오는지 확인합니다. 쿠키를 지운 시크릿 창에서 해야 정확합니다.",
            "서치콘솔 URL 검사에서 영어 페이지를 넣어 구글이 선택한 표준 URL이 영어 페이지 자신인지 확인합니다.",
            "META_SCAN의 '국제화·UX' 카드는 hreflang이 있는지와 모바일 viewport 설정을 함께 확인합니다.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "html 태그의 lang 속성으로 충분하지 않나요?",
      a: "구글은 `<html lang>`을 언어 판단에 거의 쓰지 않고 본문 내용으로 언어를 판단합니다. 번역본 사이의 연결은 hreflang으로만 알릴 수 있습니다. 다만 lang 속성은 화면 낭독기와 브라우저 번역에 쓰이므로 정확히 넣어야 합니다.",
    },
    {
      q: "한국어 사이트 하나뿐인데 hreflang이 필요한가요?",
      a: "필요 없습니다. hreflang은 같은 내용의 다른 언어·지역 버전이 있을 때만 의미가 있습니다.",
    },
    {
      q: "네이버도 hreflang을 보나요?",
      a: "네이버는 한국어 검색이 중심이라 hreflang의 영향이 작습니다. 다국어 사이트의 언어 연결은 주로 구글과 빙을 기준으로 설정합니다.",
    },
  ],
  related: ["canonical-tag", "sitemap-xml", "title-description"],
  references: [
    {
      title: "Google Search Central: 페이지의 현지화된 버전에 관해 Google에 알리기",
      url: "https://developers.google.com/search/docs/specialty/international/localized-versions",
    },
    {
      title: "Google Search Central: 다국어 및 다지역 사이트 관리",
      url: "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
    },
    {
      title: "Google Search Central: 언어 적응형 페이지의 크롤링 방식",
      url: "https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages",
    },
    { title: "ISO 639 언어 코드 (Library of Congress)", url: "https://www.loc.gov/standards/iso639-2/php/code_list.php" },
  ],
};
