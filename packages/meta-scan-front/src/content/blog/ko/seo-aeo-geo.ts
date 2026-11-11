import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "seo-aeo-geo",
  lang: "ko",
  title: "SEO·AEO·GEO 차이 한 번에 정리",
  description:
    "SEO는 검색 결과에 나오기, AEO는 AI 답변에 인용되기, GEO는 생성형 AI가 내 콘텐츠를 정확히 이해하고 추천하게 만들기입니다. 세 가지의 차이와 겹치는 부분, 우선순위를 정리했습니다.",
  publishedAt: "2026-11-10",
  hub: "basics",
  summary: [
    "SEO(검색엔진 최적화)는 구글·네이버 검색 결과에 내 페이지가 나오게 하는 일입니다. AEO(답변엔진 최적화)와 GEO(생성형 엔진 최적화)는 ChatGPT, Perplexity, 구글 AI 개요처럼 **답을 직접 만들어 주는** 서비스에 내 사이트가 인용되게 하는 일입니다.",
    "세 가지는 따로 노는 게 아니라 겹겹이 쌓입니다. AI 검색도 결국 웹을 크롤링하고 검색 색인을 활용하기 때문에, SEO 기본기가 없으면 AEO·GEO도 성립하지 않습니다.",
  ],
  sections: [
    {
      heading: "세 가지를 한 표로",
      blocks: [
        {
          type: "table",
          head: ["구분", "목표", "결과물이 보이는 곳", "핵심 질문"],
          rows: [
            ["SEO", "검색 결과 상위 노출과 클릭", "구글·네이버 검색 결과 목록", "검색엔진이 내 페이지를 찾고 이해하는가?"],
            ["AEO", "질문에 대한 답으로 채택", "추천 스니펫, AI 답변, 음성 비서", "내 페이지가 질문에 바로 답하는가?"],
            ["GEO", "생성형 AI 답변에 인용·추천", "ChatGPT, Perplexity, AI 개요", "AI가 내 콘텐츠를 믿고 출처로 쓸 만한가?"],
          ],
        },
        {
          type: "p",
          text: "AEO와 GEO는 경계가 흐릿해서 업계에서도 섞어 씁니다. 대략 AEO는 \"질문-답 구조\"에, GEO는 \"생성형 AI가 출처로 고르는 기준\"에 무게를 둔다고 보면 됩니다.",
        },
      ],
    },
    {
      heading: "SEO: 여전히 모든 것의 바닥",
      blocks: [
        {
          type: "p",
          text: "AI 검색 서비스들도 답변을 만들 때 웹페이지를 크롤링하거나 검색 색인을 활용합니다. 크롤러가 막혀 있거나, 페이지가 색인되지 않았거나, 본문이 자바스크립트를 실행해야만 보이는 사이트는 AI도 읽기 어렵습니다.",
        },
        {
          type: "list",
          items: [
            "크롤링: robots.txt가 막고 있지 않은가, 서버가 정상 응답하는가",
            "색인: noindex·canonical이 의도대로인가, 사이트맵이 있는가",
            "이해: 페이지마다 고유한 title과 description, 의미 있는 헤딩 구조",
            "경험: 모바일 대응, 속도(Lighthouse 성능 점수)",
          ],
        },
        {
          type: "p",
          text: "제가 예전에 SEO 작업과 Lighthouse 지표를 기준으로 서비스를 개선했을 때도 효과가 컸던 건 이런 기본기를 하나씩 정리하는 일이었습니다. 화려한 기법보다 \"검색엔진이 못 읽고 있던 것\"을 읽게 해 주는 것이 먼저입니다.",
        },
      ],
    },
    {
      heading: "AEO: 질문에 바로 답하는 구조",
      blocks: [
        {
          type: "p",
          text: "사람들은 AI에게 문장으로 묻습니다. \"robots.txt 확인하는 법\", \"OG 이미지 크기 몇이야\" 같은 질문에 내 페이지가 첫 문단에서 바로 답하고 있다면 인용될 가능성이 높아집니다.",
        },
        {
          type: "list",
          items: [
            "글 첫머리에 결론부터 쓰기 (요약 문단)",
            "질문형 소제목과 FAQ 섹션 두기",
            "FAQPage, HowTo 같은 구조화 데이터로 질문-답 관계를 명시하기",
            "표와 목록으로 비교·절차를 정리하기",
          ],
        },
        {
          type: "callout",
          label: "핵심",
          text: "AEO는 새로운 기술이라기보다 '읽는 사람 입장에서 바로 답을 주는 글쓰기'에 가깝습니다. 사람에게 좋은 글이 AI에게도 좋은 글입니다.",
        },
      ],
    },
    {
      heading: "GEO: AI가 믿고 인용할 만한가",
      blocks: [
        {
          type: "p",
          text: "생성형 AI는 여러 출처를 읽고 종합해서 답을 만듭니다. 이때 출처로 고르기 좋은 페이지에는 공통점이 있습니다.",
        },
        {
          type: "list",
          items: [
            "누가 썼는지 분명하다 (작성자, 소개 페이지, 연락처)",
            "근거가 있다 (공식 문서 링크, 출처가 명시된 수치)",
            "사이트·브랜드 정보가 일관된다 (Organization 구조화 데이터, 같은 이름과 설명)",
            "본문이 HTML에 바로 들어 있다 (자바스크립트 의존도가 낮다)",
            "AI 검색용 크롤러(OAI-SearchBot, PerplexityBot 등)를 막지 않는다",
          ],
        },
        {
          type: "p",
          text: "llms.txt처럼 AI를 위한 안내 파일도 있지만, 아직 효과가 검증된 단계는 아닙니다. 위 다섯 가지를 먼저 챙기는 게 순서입니다.",
        },
      ],
    },
    {
      heading: "같은 질문, 세 가지 관점",
      blocks: [
        {
          type: "p",
          text: "\"OG 이미지 크기\"라는 질문 하나로 비교해 보면 차이가 분명해집니다. SEO 관점에서는 이 검색어로 구글 결과 첫 페이지에 내 글이 나오는지가 중요합니다. AEO 관점에서는 내 글이 \"1200×630 픽셀\"이라는 답을 첫 문단에서 바로 주는지가 중요합니다. GEO 관점에서는 ChatGPT가 이 질문에 답하면서 내 글을 출처 링크로 달아 주는지가 중요합니다.",
        },
        {
          type: "p",
          text: "세 가지 모두 결국 같은 글에서 출발합니다. 검색엔진이 읽을 수 있고, 질문에 바로 답하고, 믿을 만한 근거가 있는 글입니다.",
        },
      ],
    },
    {
      heading: "무엇부터 할까: 우선순위",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "**SEO 설정 점검**: 크롤링·색인 차단이 없는지 확인합니다. 여기가 막혀 있으면 나머지는 의미가 없습니다.",
            "**페이지별 메타 정보**: title, description, OG 태그를 페이지마다 다르게 씁니다.",
            "**질문에 답하는 콘텐츠**: 사용자가 실제로 묻는 질문 단위로 글을 쓰고 FAQ를 붙입니다.",
            "**신뢰 신호**: 작성자 정보, 출처, 구조화 데이터를 갖춥니다.",
            "**AI 크롤러 정책**: AI 검색용 크롤러를 허용하고, 원한다면 학습용만 차단합니다.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN은 이 순서대로 기본 SEO, 색인, 미리보기, AI 신호, 콘텐츠, 국제화 카드로 나눠 항목마다 통과·경고·실패·정보로 보여줍니다. 점수 하나로 뭉뚱그리지 않아서 무엇부터 고칠지 바로 보입니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "SEO를 잘하면 AEO·GEO는 따로 안 해도 되나요?",
      a: "기본은 상당 부분 겹치지만 완전히 같지는 않습니다. 질문에 바로 답하는 구조, 작성자와 출처 같은 신뢰 신호, AI 크롤러 허용 여부는 따로 챙겨야 합니다.",
    },
    {
      q: "AI 검색에 내 사이트가 인용됐는지 어떻게 알 수 있나요?",
      a: "ChatGPT나 Perplexity에 내 분야의 질문을 직접 해 보고 출처 링크를 확인하는 것이 가장 간단합니다. 서버 로그에서 OAI-SearchBot, PerplexityBot 같은 크롤러의 방문 기록을 보는 방법도 있습니다.",
    },
    {
      q: "GEO는 새로운 마케팅 용어일 뿐인가요?",
      a: "용어는 새롭지만 다루는 문제는 실제입니다. 답을 직접 받는 사용자가 늘면서, 검색 결과 순위뿐 아니라 AI 답변 안에 들어가는지가 중요해졌습니다.",
    },
  ],
  related: ["site-not-on-google", "llms-txt", "og-tags-preview"],
  references: [
    {
      title: "Google Search Central: 검색엔진 최적화(SEO) 기본 가이드",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    {
      title: "Google Search Central: AI 기능과 웹사이트",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Google Search Central: 유용하고 신뢰할 수 있는 사용자 중심 콘텐츠 만들기",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
  ],
};
