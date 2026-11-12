import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "ai-search-citation",
  lang: "ko",
  title: "ChatGPT·AI 검색에 내 사이트가 인용되게 하려면",
  description:
    "ChatGPT 검색, Perplexity, 구글 AI 개요가 내 사이트를 출처로 쓰게 하려면 무엇이 필요할까요. 크롤러 허용, 색인, 답이 되는 문단, 신뢰 신호까지 확인 순서대로 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "aiSignals",
  isHub: true,
  summary: [
    "AI 검색이 내 사이트를 인용하려면 먼저 **읽을 수 있어야** 하고(크롤러 허용, HTML 본문), 그다음 **고를 이유가 있어야** 합니다(질문에 바로 답하는 문단, 근거, 작성자 정보).",
    "특별한 비법 태그는 없습니다. 구글은 AI 개요에 노출되기 위해 별도의 마크업이 필요 없다고 밝혔고, 다른 AI 검색도 결국 웹페이지를 읽어 답을 만듭니다. 기본기를 빠짐없이 갖추는 것이 가장 확실한 방법입니다.",
  ],
  sections: [
    {
      heading: "AI 검색은 어떻게 출처를 고르나",
      blocks: [
        {
          type: "p",
          text: "AI 검색 서비스는 대체로 비슷한 흐름으로 동작합니다. 사용자의 질문을 받으면 자체 크롤러나 검색 색인에서 관련 페이지를 찾고, 그 내용을 읽어 답을 요약한 뒤 근거가 된 페이지를 출처 링크로 붙입니다.",
        },
        {
          type: "table",
          head: ["서비스", "페이지를 가져오는 방식", "내가 확인할 것"],
          rows: [
            ["구글 AI 개요·AI 모드", "구글 검색 색인", "구글에 색인되어 있고 스니펫 표시가 허용되는가"],
            ["ChatGPT 검색", "OAI-SearchBot 크롤링 + 외부 검색 결과", "OAI-SearchBot을 막지 않는가, 빙에도 색인되어 있는가"],
            ["Perplexity", "PerplexityBot 크롤링", "PerplexityBot을 막지 않는가"],
            ["Claude 웹 검색", "Claude-SearchBot 등", "Anthropic 검색용 크롤러를 막지 않는가"],
          ],
        },
        {
          type: "p",
          text: "공통점은 분명합니다. 크롤러가 들어올 수 있고, 검색 색인에 올라가 있어야 후보가 됩니다. 후보가 된 다음에야 \"이 페이지가 질문에 대한 좋은 답인가\"를 따집니다.",
        },
      ],
    },
    {
      heading: "1단계: 읽을 수 있게 하기",
      blocks: [
        {
          type: "list",
          items: [
            "**검색·답변용 AI 크롤러 허용**: robots.txt에서 OAI-SearchBot, PerplexityBot, Claude-SearchBot을 막고 있지 않은지 확인합니다. 학습용(GPTBot, ClaudeBot)과는 별개입니다. 자세한 설정은 [AI 크롤러 허용·차단 설정](/ko/blog/ai-crawlers) 글에 있습니다.",
            "**CDN·방화벽 확인**: robots.txt는 열려 있는데 Cloudflare 같은 CDN의 봇 차단 기능이 AI 크롤러를 막는 경우가 있습니다. 보안 설정의 봇 관리 항목을 확인하세요.",
            "**본문이 HTML에 있기**: 자바스크립트를 실행해야만 본문이 그려지는 페이지는 크롤러에 따라 빈 페이지로 보일 수 있습니다. 서버 렌더링이나 정적 생성으로 본문을 HTML에 넣어 두는 것이 안전합니다.",
            "**스니펫 허용**: `nosnippet`이나 너무 짧은 `max-snippet`을 걸면 구글은 그 페이지를 AI 개요의 근거로 쓰지 않습니다.",
          ],
        },
        {
          type: "callout",
          label: "확인 방법",
          text: "터미널에서 `curl -s 내주소 | grep '본문 첫 문장'`을 실행해 보세요. 본문이 나오지 않는다면 크롤러가 받는 HTML에는 내용이 없는 것입니다.",
        },
      ],
    },
    {
      heading: "2단계: 색인되게 하기",
      blocks: [
        {
          type: "p",
          text: "AI 검색의 상당수는 일반 검색 색인을 출발점으로 씁니다. 그래서 구글·빙 색인이 0인 사이트는 AI 답변에도 등장하기 어렵습니다. 아직 색인이 안 됐다면 [구글에 안 나올 때 확인할 7가지](/ko/blog/site-not-on-google)부터 해결하세요.",
        },
        {
          type: "list",
          items: [
            "구글 서치콘솔과 네이버 서치어드바이저에 사이트맵 제출",
            "빙 웹마스터 도구에도 사이트 등록 (서치콘솔 계정을 가져와 몇 분이면 끝납니다)",
            "얇은 페이지는 noindex로 빼서 사이트 전체 품질 유지",
          ],
        },
      ],
    },
    {
      heading: "3단계: 답이 되는 문단 쓰기",
      blocks: [
        {
          type: "p",
          text: "AI는 질문에 맞는 부분을 페이지에서 잘라 와 요약합니다. 답이 글 중간 어딘가에 흩어져 있으면 고르기 어렵고, 첫 문단에 정리되어 있으면 고르기 쉽습니다.",
        },
        {
          type: "list",
          items: [
            "**결론부터**: 글 첫머리에 질문에 대한 답을 두세 문장으로 씁니다. 이 블로그의 모든 글이 맨 위에 요약을 두는 이유입니다.",
            "**질문형 소제목**: 사람들이 실제로 묻는 문장을 소제목으로 씁니다. \"OG 이미지 크기는?\"처럼요.",
            "**구체적인 값**: \"적당한 크기\" 대신 \"1200×630 픽셀\", \"빠르게\" 대신 \"2.5초 이내\"처럼 숫자로 씁니다.",
            "**표와 목록**: 비교와 절차는 문단보다 표와 번호 목록이 잘라 쓰기 좋습니다.",
            "**FAQ**: 본문에서 다루지 못한 짧은 질문을 끝에 모아 둡니다.",
          ],
        },
      ],
    },
    {
      heading: "4단계: 믿을 만하게 보이기",
      blocks: [
        {
          type: "p",
          text: "같은 답을 주는 페이지가 여러 개라면 AI는 더 믿을 만한 쪽을 출처로 고르려 합니다. 구글이 말하는 '유용하고 신뢰할 수 있는 콘텐츠' 기준과 거의 같습니다.",
        },
        {
          type: "list",
          items: [
            "누가 썼는지: 작성자 이름, 소개 페이지, 연락처",
            "무엇에 근거했는지: 공식 문서 링크, 수치의 출처",
            "언제 썼는지: 작성일과 수정일 표시",
            "사이트가 무엇인지: Organization·Article 구조화 데이터, 일관된 사이트 이름과 설명",
          ],
        },
        {
          type: "p",
          text: "구조화 데이터 자체가 인용을 보장하지는 않지만, 페이지의 작성자·날짜·종류를 기계가 오해 없이 읽게 해 줍니다. 기본 사용법은 [JSON-LD 기초](/ko/blog/json-ld-basics) 글에 정리했습니다.",
        },
      ],
    },
    {
      heading: "인용됐는지 확인하는 법",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "ChatGPT 검색, Perplexity에 내 글이 답할 만한 질문을 직접 입력하고 출처 목록을 봅니다.",
            "GA4 같은 분석 도구에서 `chatgpt.com`, `perplexity.ai` 리퍼러로 들어온 방문을 확인합니다.",
            "서버 로그나 CDN 로그에서 OAI-SearchBot, PerplexityBot의 방문 기록을 찾습니다. 크롤러가 오지 않는다면 1단계 문제입니다.",
            "구글 서치콘솔 실적 보고서에는 AI 개요 노출도 일반 검색 노출에 합산되어 표시됩니다.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN의 'AI 신호' 카드는 이 중 사이트 쪽에서 확인 가능한 항목, 즉 AI 크롤러 차단 여부, 구조화 데이터, FAQ, 자바스크립트 렌더링 의존도를 한 번에 보여줍니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "AI 검색에 인용되면 방문자가 늘어나나요?",
      a: "출처 링크를 누르는 사용자가 생기므로 방문으로 이어지기는 합니다. 다만 답을 이미 받은 사용자는 클릭하지 않는 경우도 많아서, 방문 수보다 브랜드가 언급되는 효과가 더 크다는 시각도 있습니다.",
    },
    {
      q: "GPTBot을 막으면 ChatGPT 검색에도 안 나오나요?",
      a: "OpenAI는 GPTBot(학습용)과 OAI-SearchBot(검색용)을 따로 운영합니다. GPTBot만 막고 OAI-SearchBot을 허용하면 학습에는 쓰이지 않으면서 검색 결과에는 나올 수 있습니다.",
    },
    {
      q: "AI 검색용으로 글을 따로 써야 하나요?",
      a: "아니요. 사람이 읽기에 결론이 분명하고 근거가 있는 글이 AI에게도 좋은 글입니다. AI만을 위해 키워드를 반복하거나 숨긴 텍스트를 넣는 방식은 검색엔진 정책 위반이 될 수 있습니다.",
    },
  ],
  related: ["seo-aeo-geo", "ai-crawlers", "json-ld-basics", "llms-txt"],
  references: [
    {
      title: "Google Search Central: AI 기능과 웹사이트",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Google Search Central: 유용하고 신뢰할 수 있는 사용자 중심 콘텐츠 만들기",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
    { title: "Perplexity: Perplexity Crawlers", url: "https://docs.perplexity.ai/guides/bots" },
    { title: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters" },
  ],
};
