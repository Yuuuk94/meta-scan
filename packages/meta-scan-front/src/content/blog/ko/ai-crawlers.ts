import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "ai-crawlers",
  lang: "ko",
  title: "AI 크롤러(GPTBot 등) 허용·차단 설정 가이드",
  description:
    "GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended는 각각 무엇이고 어떻게 막거나 허용할까요. 학습용과 검색용을 나눠 설정하는 robots.txt 예시와 주의점을 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "aiSignals",
  summary: [
    "AI 회사들은 용도별로 크롤러를 나눠 운영합니다. 크게 **모델 학습용**, **AI 검색·답변용**, **사용자 요청 시 방문용** 세 가지입니다. 이 구분을 알면 \"학습에는 안 쓰이고 검색에는 나오게\" 같은 설정이 가능합니다.",
    "설정은 robots.txt로 합니다. 다만 robots.txt는 크롤러가 자발적으로 따르는 규칙이라, 확실한 차단이 필요하면 서버나 CDN 단에서 막아야 합니다.",
  ],
  sections: [
    {
      heading: "주요 AI 크롤러 정리",
      blocks: [
        {
          type: "table",
          head: ["User-agent", "회사", "용도"],
          rows: [
            ["GPTBot", "OpenAI", "모델 학습용 수집"],
            ["OAI-SearchBot", "OpenAI", "ChatGPT 검색 결과 노출"],
            ["ChatGPT-User", "OpenAI", "사용자가 ChatGPT에서 요청할 때 방문"],
            ["ClaudeBot", "Anthropic", "모델 학습용 수집"],
            ["Claude-SearchBot", "Anthropic", "검색 품질 향상용 수집"],
            ["Claude-User", "Anthropic", "사용자 요청 시 방문"],
            ["PerplexityBot", "Perplexity", "Perplexity 검색 결과 노출"],
            ["Perplexity-User", "Perplexity", "사용자 요청 시 방문"],
            ["Google-Extended", "Google", "Gemini 등의 학습·그라운딩 사용 여부 제어 토큰"],
            ["Applebot-Extended", "Apple", "Apple 생성형 모델 학습 사용 여부 제어 토큰"],
            ["CCBot", "Common Crawl", "공개 웹 아카이브 수집 (많은 AI 학습 데이터의 출처)"],
          ],
        },
        {
          type: "p",
          text: "Google-Extended와 Applebot-Extended는 별도의 크롤러가 아니라 robots.txt에서 쓰는 '제어 토큰'입니다. 실제 수집은 Googlebot, Applebot이 하고, 이 토큰으로 수집한 데이터를 생성형 AI에 쓸지 여부만 정합니다. 그래서 Google-Extended를 막아도 구글 검색 노출과 순위에는 영향이 없습니다.",
        },
      ],
    },
    {
      heading: "어떤 정책을 고를까",
      blocks: [
        {
          type: "table",
          head: ["목표", "학습용", "검색·답변용"],
          rows: [
            ["AI 검색에 최대한 노출", "허용", "허용"],
            ["노출은 원하지만 학습은 거부", "차단", "허용"],
            ["AI와 완전히 거리 두기", "차단", "차단"],
          ],
        },
        {
          type: "p",
          text: "META_SCAN처럼 발견 가능성이 중요한 무료 도구나 블로그라면 첫 번째나 두 번째가 일반적입니다. 유료 콘텐츠나 저작권이 중요한 매체라면 학습용 차단을 고려할 만합니다. 검색·답변용까지 막으면 AI 답변에서 출처로 언급될 기회도 함께 사라진다는 점을 감안하세요.",
        },
      ],
    },
    {
      heading: "robots.txt 예시",
      blocks: [
        { type: "h3", text: "학습은 거부, 검색 노출은 허용" },
        {
          type: "code",
          text: "User-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: https://내도메인.com/sitemap.xml",
        },
        { type: "h3", text: "특정 폴더만 막기" },
        {
          type: "code",
          text: "User-agent: GPTBot\nDisallow: /premium/\nDisallow: /members/",
        },
        {
          type: "p",
          text: "크롤러는 자기 이름과 일치하는 그룹이 있으면 그 그룹만 따르고 `User-agent: *` 그룹은 보지 않습니다. 그래서 `*`에 넣은 공통 차단 규칙(예: `/admin/`)을 특정 봇 그룹에도 함께 적어 줘야 합니다. 흔히 놓치는 부분입니다.",
        },
      ],
    },
    {
      heading: "robots.txt만으로 부족한 경우",
      blocks: [
        {
          type: "list",
          items: [
            "**사용자 요청형 에이전트**: ChatGPT-User처럼 사용자가 직접 링크를 열어 달라고 요청해 방문하는 에이전트는 robots.txt 적용 방식이 일반 크롤러와 다를 수 있다고 각 회사가 안내하고 있습니다. 최신 정책은 공식 문서를 확인하세요.",
            "**규칙을 따르지 않는 봇**: 이름을 숨기거나 규칙을 무시하는 수집기는 robots.txt로 막을 수 없습니다. 서버 방화벽이나 CDN의 봇 관리 기능으로 차단해야 합니다.",
            "**이름을 사칭하는 봇**: User-agent는 누구나 흉내 낼 수 있습니다. OpenAI 등은 크롤러의 IP 대역을 공개하고 있으니, 로그를 분석할 때는 IP까지 대조하는 것이 정확합니다.",
          ],
        },
        {
          type: "callout",
          label: "주의",
          text: "반대로 원치 않게 막히는 경우도 있습니다. Cloudflare 같은 CDN은 AI 크롤러를 일괄 차단하는 옵션을 제공하고, 새로 추가한 도메인에 기본으로 켜 두기도 합니다. robots.txt에서 허용했는데 AI 검색에 안 나온다면 CDN 설정을 확인하세요.",
        },
      ],
    },
    {
      heading: "설정 후 확인하기",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "브라우저에서 `/robots.txt`를 열어 배포된 내용이 의도대로인지 봅니다.",
            "서버나 CDN 로그에서 각 User-agent의 요청과 응답 코드를 확인합니다. 허용한 봇이 403을 받고 있다면 방화벽이 막고 있는 것입니다.",
            "구글 서치콘솔 robots.txt 보고서에서 문법 오류가 없는지 확인합니다.",
            "META_SCAN으로 사이트를 스캔하면 'AI 신호' 카드에서 주요 AI 검색 크롤러가 robots.txt로 막혀 있는지 바로 볼 수 있습니다.",
          ],
        },
        {
          type: "p",
          text: "크롤러 이름은 회사 정책에 따라 추가되거나 바뀝니다. 이 글의 목록도 작성 시점 기준이므로, 설정 전에 아래 공식 문서에서 최신 이름을 확인하는 것을 권합니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "GPTBot을 막으면 이미 학습된 데이터도 지워지나요?",
      a: "아니요. robots.txt는 앞으로의 수집에만 적용됩니다. 이미 수집된 데이터의 처리는 각 회사의 정책을 따릅니다.",
    },
    {
      q: "Google-Extended를 막으면 구글 검색 순위가 떨어지나요?",
      a: "아니요. 구글은 Google-Extended가 구글 검색 노출이나 순위에 영향을 주지 않는다고 밝히고 있습니다. 다만 구글 검색의 AI 개요는 일반 검색 색인을 쓰므로 Google-Extended와는 별개로 동작합니다.",
    },
    {
      q: "모든 AI 봇을 한 줄로 막을 수는 없나요?",
      a: "robots.txt에는 'AI 봇 전체'를 뜻하는 지시어가 없습니다. 이름을 하나씩 적어야 합니다. 일괄 차단이 필요하면 CDN의 봇 관리 기능을 쓰는 편이 관리하기 쉽습니다.",
    },
  ],
  related: ["ai-search-citation", "robots-txt", "llms-txt"],
  references: [
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
    {
      title: "Anthropic: Does Anthropic crawl data from the web?",
      url: "https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    { title: "Perplexity: Perplexity Crawlers", url: "https://docs.perplexity.ai/guides/bots" },
    {
      title: "Google Search Central: Google 크롤러 목록(Google-Extended 포함)",
      url: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers",
    },
    { title: "Apple: About Applebot", url: "https://support.apple.com/en-us/119829" },
  ],
};
