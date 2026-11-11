import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "heading-structure",
  lang: "ko",
  title: "헤딩 구조와 본문 분량: 검색엔진이 읽기 좋은 페이지",
  description:
    "H1부터 H3까지 헤딩은 페이지의 목차 역할을 합니다. 헤딩을 쓰는 규칙, 본문 분량에 대한 오해, 자바스크립트로만 그려지는 본문의 문제와 얇은 페이지를 피하는 방법을 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "content",
  isHub: true,
  summary: [
    "헤딩(H1~H6)은 글자 크기를 키우는 태그가 아니라 페이지의 목차입니다. 검색엔진, AI, 화면 낭독기 모두 헤딩으로 페이지 구조를 파악합니다.",
    "본문 분량에는 정해진 최소 기준이 없습니다. 중요한 건 길이가 아니라 \"이 페이지에서만 얻을 수 있는 내용이 충분한가\"입니다. 다만 도구 화면처럼 읽을 내용이 거의 없는 페이지만 있는 사이트는 품질 평가에서 불리합니다.",
  ],
  sections: [
    {
      heading: "헤딩은 목차다",
      blocks: [
        {
          type: "code",
          text: "H1  robots.txt 확인하는 법과 흔한 실수 5가지\n  H2  robots.txt의 기본 문법\n  H2  지금 내 robots.txt 확인하는 방법\n  H2  흔한 실수 5가지\n    H3  1. 배포 후에도 남아 있는 Disallow: /\n    H3  2. 색인을 막으려고 robots.txt를 쓰는 경우\n  H2  AI 크롤러는 어떻게 다루나",
        },
        {
          type: "p",
          text: "헤딩만 뽑아 읽어도 페이지 내용이 그려져야 합니다. 이렇게 되어 있으면 검색엔진은 페이지 주제와 각 부분의 역할을 쉽게 파악하고, AI는 질문에 맞는 부분을 정확히 잘라 갈 수 있습니다. 화면 낭독기 사용자는 헤딩 단위로 건너뛰며 원하는 부분을 찾습니다.",
        },
      ],
    },
    {
      heading: "헤딩 규칙",
      blocks: [
        {
          type: "list",
          items: [
            "**H1은 페이지 주제 하나**: 글 제목이나 페이지 이름을 H1으로 둡니다. 구글은 H1이 여러 개여도 문제 삼지 않는다고 밝혔지만, 하나로 두면 주제가 분명해지고 접근성 도구의 경고도 피할 수 있습니다.",
            "**단계 건너뛰지 않기**: H2 다음에 바로 H4가 오면 구조가 끊깁니다. 크기가 작은 제목이 필요하면 CSS로 크기를 줄이고 단계는 지킵니다.",
            "**스타일용으로 쓰지 않기**: 글자를 크게 보이려고 헤딩을 쓰거나, 반대로 실제 제목을 `<div>`에 굵은 글씨로만 표시하면 구조가 사라집니다.",
            "**설명적인 문장**: \"개요\", \"기타\"보다 \"robots.txt의 기본 문법\"처럼 내용을 말해 주는 헤딩이 검색과 AI 인용 모두에 유리합니다.",
            "**title과 H1 맞추기**: 둘이 다른 말을 하면 구글이 검색 결과 제목을 바꿔 쓸 가능성이 높아집니다.",
          ],
        },
        {
          type: "callout",
          label: "확인 방법",
          text: "브라우저 개발자 도구 콘솔에 `[...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ' ' + h.textContent.trim())`를 입력하면 페이지의 헤딩 목록이 순서대로 나옵니다.",
        },
      ],
    },
    {
      heading: "본문 분량에 대한 오해",
      blocks: [
        {
          type: "p",
          text: "\"구글은 최소 몇 자 이상의 글을 좋아한다\"는 말이 많지만, 구글은 단어 수를 순위 요소로 쓰지 않는다고 여러 차례 밝혔습니다. 짧은 질문에는 짧은 답이 최선일 수 있습니다.",
        },
        {
          type: "p",
          text: "그렇다고 분량이 무의미하지는 않습니다. 문제는 길이 자체가 아니라 **내용이 얇은 것**입니다. 구글과 애드센스가 품질이 낮다고 보는 페이지에는 공통점이 있습니다.",
        },
        {
          type: "table",
          head: ["얇은 페이지 유형", "예시", "대응"],
          rows: [
            ["도구 화면만 있는 페이지", "입력창 하나와 버튼뿐인 화면", "사용법, 결과 해석, 관련 가이드를 함께 제공"],
            ["다른 페이지와 거의 같은 페이지", "지역명만 바꾼 페이지 수십 개", "통합하거나 각 페이지에 고유 정보 추가"],
            ["다른 곳에서 가져온 내용", "공식 문서 번역·요약만 한 글", "직접 경험, 비교, 예시 추가"],
            ["빈 목록·검색 결과 페이지", "글이 없는 카테고리", "noindex로 색인에서 제외"],
          ],
        },
        {
          type: "callout",
          label: "실제 사례",
          text: "META_SCAN도 처음에는 URL 입력창과 짧은 소개만 있는 도구 사이트였고, 애드센스 심사에서 '가치가 낮은 콘텐츠'로 여러 번 거절됐습니다. 이 블로그와 소개 페이지, 홈의 검사 항목 설명은 그 문제를 해결하려고 만든 것입니다.",
        },
      ],
    },
    {
      heading: "본문이 HTML에 있어야 하는 이유",
      blocks: [
        {
          type: "p",
          text: "구글은 자바스크립트를 실행해 페이지를 렌더링할 수 있지만, 렌더링은 크롤링보다 늦게 처리되고 실패할 수도 있습니다. 미리보기 크롤러와 일부 AI 크롤러는 자바스크립트를 아예 실행하지 않습니다.",
        },
        {
          type: "list",
          items: [
            "핵심 본문과 헤딩은 서버 렌더링이나 정적 생성으로 첫 HTML에 넣습니다.",
            "탭이나 아코디언 안의 내용도 HTML에는 들어 있어야 합니다. 클릭할 때 서버에서 불러오는 내용은 크롤러가 보지 못할 수 있습니다.",
            "\"더 보기\" 버튼으로만 열리는 목록은 일반 링크(`<a href>`)로 다음 페이지에 접근할 수 있게 둡니다.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN은 서버가 처음 보낸 HTML과 브라우저가 자바스크립트를 실행한 뒤의 HTML을 비교해, 본문이 자바스크립트에 얼마나 의존하는지를 'AI 신호' 카드에서 보여줍니다.",
        },
      ],
    },
    {
      heading: "읽기 좋은 본문 만들기",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "첫 문단에 결론을 씁니다. 검색으로 들어온 사람은 답을 찾으러 왔습니다.",
            "한 문단에는 한 가지 이야기만 담습니다.",
            "비교는 표로, 절차는 번호 목록으로 정리합니다.",
            "주장에는 근거를 붙입니다. 공식 문서 링크나 직접 해 본 결과가 가장 강한 근거입니다.",
            "관련 글을 본문 안에서 링크로 연결해 독자가 다음에 읽을 것을 제안합니다.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "H1이 두 개면 SEO에 불이익이 있나요?",
      a: "구글은 H1 개수로 불이익을 주지 않는다고 밝혔습니다. 다만 접근성과 구조 명확성 측면에서는 페이지 주제를 담은 H1 하나를 두는 것이 권장됩니다.",
    },
    {
      q: "글이 몇 자 이상이어야 검색에 잘 나오나요?",
      a: "정해진 기준은 없습니다. 검색한 사람의 질문에 충분히 답하는지가 중요합니다. 같은 주제를 다룬 상위 결과들이 어떤 내용을 담고 있는지 보고, 그보다 더 도움이 되는 정보를 더하는 것이 현실적인 기준입니다.",
    },
    {
      q: "이미지 안의 글자도 본문으로 인정되나요?",
      a: "이미지 속 글자는 검색엔진이 본문으로 읽기 어렵습니다. 중요한 내용은 텍스트로 쓰고, 이미지에는 내용을 설명하는 alt 텍스트를 넣으세요.",
    },
  ],
  related: ["title-description", "ai-search-citation", "site-not-on-google"],
  references: [
    {
      title: "Google Search Central: 유용하고 신뢰할 수 있는 사용자 중심 콘텐츠 만들기",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "Google Search Central: JavaScript SEO 기본사항",
      url: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
    },
    {
      title: "Google Search Central: SEO 기본 가이드",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    { title: "W3C WAI: Headings tutorial", url: "https://www.w3.org/WAI/tutorials/page-structure/headings/" },
    {
      title: "Google AdSense 고객센터: 가치가 낮은 콘텐츠",
      url: "https://support.google.com/adsense/answer/10015918",
    },
  ],
};
