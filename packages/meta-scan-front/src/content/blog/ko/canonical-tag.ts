import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "canonical-tag",
  lang: "ko",
  title: "canonical 태그: 중복 페이지 정리하는 법",
  description:
    "같은 내용이 여러 주소로 열리면 구글은 그중 하나만 대표로 고릅니다. canonical 태그로 대표 주소를 알려주는 법, 자주 하는 실수, 리디렉션과 무엇이 다른지 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "indexing",
  summary: [
    "canonical은 \"이 페이지의 대표 주소는 여기다\"라고 검색엔진에 알려주는 태그입니다. `<head>`에 `<link rel=\"canonical\" href=\"전체 주소\">` 한 줄로 넣습니다.",
    "생각보다 많은 사이트에 중복 주소가 있습니다. http와 https, www 유무, 끝 슬래시, 추적 파라미터만 달라도 구글에게는 다른 주소입니다. canonical은 이 중 어느 것을 색인할지 정해 주는 가장 쉬운 방법입니다.",
  ],
  sections: [
    {
      heading: "왜 중복 주소가 생기나",
      blocks: [
        {
          type: "p",
          text: "사람 눈에는 같은 페이지지만 주소 문자열이 다르면 검색엔진은 별개의 페이지로 봅니다. 아래 주소들은 대부분의 사이트에서 같은 내용을 보여줍니다.",
        },
        {
          type: "code",
          text: "https://example.com/shoes\nhttps://www.example.com/shoes\nhttp://example.com/shoes\nhttps://example.com/shoes/\nhttps://example.com/shoes?utm_source=kakao\nhttps://example.com/shoes?sort=price",
        },
        {
          type: "p",
          text: "구글은 이런 중복 묶음을 발견하면 하나를 대표(표준, canonical)로 골라 검색 결과에 보여주고 나머지는 숨깁니다. 문제는 사이트 운영자가 원하지 않는 주소가 대표로 뽑힐 수 있고, 링크와 평가 신호가 여러 주소로 흩어진다는 점입니다.",
        },
      ],
    },
    {
      heading: "canonical 쓰는 법",
      blocks: [
        { type: "code", text: '<link rel="canonical" href="https://example.com/shoes" />' },
        {
          type: "list",
          items: [
            "**전체 주소로 쓰기**: `/shoes` 같은 상대 경로도 동작은 하지만, 도메인이 잘못 해석될 여지를 없애려면 `https://`부터 전부 씁니다.",
            "**자기 자신을 가리키기**: 중복이 없는 페이지도 자기 주소를 canonical로 넣어 두면 파라미터가 붙은 주소로 공유돼도 대표 주소가 분명해집니다.",
            "**한 페이지에 하나만**: canonical이 두 개 이상이면 구글은 둘 다 무시할 수 있습니다. 테마와 플러그인이 각자 넣는 경우를 확인하세요.",
            "**`<head>` 안에 넣기**: `<body>`에 들어간 canonical은 무시됩니다.",
          ],
        },
        {
          type: "callout",
          label: "핵심",
          text: "canonical은 명령이 아니라 힌트입니다. 구글은 canonical, 리디렉션, 내부 링크, 사이트맵을 함께 보고 대표 주소를 정합니다. 이 신호들이 서로 같은 주소를 가리키게 맞추는 것이 중요합니다.",
        },
      ],
    },
    {
      heading: "리디렉션과 canonical, 무엇을 쓸까",
      blocks: [
        {
          type: "table",
          head: ["방법", "강도", "언제 쓰나"],
          rows: [
            ["301 리디렉션", "강함", "옛 주소를 더 이상 쓰지 않을 때 (http→https, www 통일, 주소 변경)"],
            ["rel=canonical", "중간", "두 주소 모두 사용자에게 열려 있어야 할 때 (정렬·필터 파라미터, 인쇄용 페이지)"],
            ["사이트맵에 대표 주소만 넣기", "약함", "다른 방법과 함께 보조로"],
          ],
        },
        {
          type: "p",
          text: "http/https나 www 유무처럼 사용자가 굳이 옛 주소에 머물 이유가 없다면 리디렉션이 정답입니다. 사람도 검색엔진도 한 주소로 모입니다. 반면 정렬 순서만 다른 상품 목록처럼 사용자에게는 필요한 주소라면 리디렉션할 수 없으니 canonical로 대표를 알려 줍니다.",
        },
      ],
    },
    {
      heading: "자주 하는 실수",
      blocks: [
        { type: "h3", text: "모든 페이지가 홈을 가리킴" },
        {
          type: "p",
          text: "레이아웃 공통 영역에 canonical을 한 번만 넣으면 모든 페이지가 같은 주소를 대표로 선언하게 됩니다. 그러면 구글은 나머지 페이지를 홈의 중복으로 보고 색인하지 않습니다. canonical은 반드시 페이지마다 다르게 계산되어야 합니다.",
        },
        { type: "h3", text: "개발 도메인이 그대로 들어감" },
        {
          type: "p",
          text: "사이트 주소를 환경 변수로 받는 경우, 운영 배포에 스테이징 도메인이나 `localhost`가 들어가는 사고가 납니다. 배포 직후 페이지 소스에서 `canonical`을 검색해 운영 도메인인지 확인하세요.",
        },
        { type: "h3", text: "canonical과 noindex를 같이 씀" },
        {
          type: "p",
          text: "\"다른 주소가 대표다\"(canonical)와 \"이 페이지는 색인하지 마라\"(noindex)는 서로 다른 말입니다. 함께 쓰면 신호가 엇갈려 의도와 다르게 처리될 수 있습니다. 중복 정리는 canonical로, 검색에서 완전히 빼는 건 noindex로 하나만 고르세요.",
        },
        { type: "h3", text: "다국어 페이지가 한 언어를 가리킴" },
        {
          type: "p",
          text: "영어 페이지의 canonical이 한국어 페이지를 가리키면 영어 페이지는 색인에서 빠집니다. 언어별 페이지는 각자 자기 주소를 canonical로 두고, 서로의 관계는 hreflang으로 알려야 합니다. 자세한 내용은 [hreflang 설정](/ko/blog/hreflang) 글에 정리했습니다.",
        },
      ],
    },
    {
      heading: "구글이 무엇을 대표로 골랐는지 확인하기",
      blocks: [
        {
          type: "p",
          text: "서치콘솔의 URL 검사에 주소를 넣으면 \"사용자가 선언한 표준 URL\"과 \"Google이 선택한 표준 URL\"이 나란히 나옵니다. 둘이 다르다면 구글이 내 canonical을 받아들이지 않은 것입니다.",
        },
        {
          type: "list",
          items: [
            "내부 링크가 canonical과 다른 주소(예: 끝 슬래시 있는 버전)를 가리키고 있지 않은가",
            "사이트맵에 canonical이 아닌 주소가 들어 있지 않은가",
            "canonical이 가리키는 주소가 404, 리디렉션, noindex 상태는 아닌가",
            "두 페이지의 내용이 실제로 거의 같은가 (내용이 많이 다르면 구글이 canonical을 무시하기도 합니다)",
          ],
        },
        {
          type: "p",
          text: "META_SCAN의 '색인' 카드는 페이지에 canonical이 설정되어 있는지 확인합니다. 구글이 실제로 고른 대표 주소는 서치콘솔에서만 볼 수 있으니 함께 확인하세요.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "canonical이 없으면 불이익이 있나요?",
      a: "직접적인 불이익은 없습니다. 구글이 알아서 대표를 고릅니다. 다만 원하지 않는 주소가 대표로 뽑히거나 평가가 분산될 수 있어서, 자기 참조 canonical을 넣어 두는 것을 권합니다.",
    },
    {
      q: "다른 도메인을 canonical로 지정해도 되나요?",
      a: "됩니다. 같은 글을 여러 사이트에 게시할 때 원본 주소를 canonical로 지정하는 방식이 흔합니다. 단, 게시처가 그 canonical을 실제로 넣어 주는지 확인해야 합니다.",
    },
    {
      q: "페이지네이션된 목록은 모두 1페이지를 canonical로 둬야 하나요?",
      a: "아니요. 2페이지, 3페이지는 내용이 다르므로 각자 자기 주소를 canonical로 둡니다. 모두 1페이지를 가리키면 뒤쪽 페이지에 있는 글들이 발견되기 어려워집니다.",
    },
  ],
  related: ["site-not-on-google", "noindex-check", "sitemap-xml"],
  references: [
    {
      title: "Google Search Central: 중복 URL 통합",
      url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    },
    {
      title: "Google Search Central: 표준화란 무엇인가요",
      url: "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
    },
    {
      title: "Google Search Central: 리디렉션과 Google 검색",
      url: "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
    },
    { title: "RFC 6596: The Canonical Link Relation", url: "https://www.rfc-editor.org/rfc/rfc6596" },
  ],
};
