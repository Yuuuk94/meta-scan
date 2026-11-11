import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "robots-txt",
  lang: "ko",
  title: "robots.txt 확인하는 법과 흔한 실수 5가지",
  description:
    "robots.txt 한 줄 때문에 사이트 전체가 검색에서 사라지기도 합니다. 기본 문법, 확인 방법, 배포 후에도 남아 있는 Disallow 같은 흔한 실수와 AI 크롤러 설정까지 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "indexing",
  summary: [
    "robots.txt는 사이트 루트에 두는 텍스트 파일로, 검색엔진 크롤러에게 \"이 경로는 가져가도 되고 이 경로는 가져가지 말라\"고 알려줍니다.",
    "가장 흔한 사고는 개발 중에 넣은 `Disallow: /`가 배포 후에도 남아 있는 경우입니다. 또 robots.txt는 크롤링을 막을 뿐 색인을 막는 도구가 아니라는 점을 자주 헷갈립니다.",
  ],
  sections: [
    {
      heading: "robots.txt의 기본 문법",
      blocks: [
        {
          type: "p",
          text: "robots.txt는 반드시 `https://내도메인.com/robots.txt`처럼 도메인 루트에 있어야 합니다. 하위 폴더에 두면 무시됩니다. 서브도메인(`blog.내도메인.com`)과 프로토콜(http/https)마다 각자의 robots.txt를 따로 읽습니다.",
        },
        {
          type: "code",
          text: "User-agent: *\nDisallow: /admin/\nAllow: /admin/public/\n\nSitemap: https://내도메인.com/sitemap.xml",
        },
        {
          type: "table",
          head: ["지시어", "뜻", "예시"],
          rows: [
            ["User-agent", "규칙을 적용할 크롤러 이름. `*`는 전체", "`User-agent: Googlebot`"],
            ["Disallow", "크롤링하지 말아야 할 경로", "`Disallow: /admin/`"],
            ["Allow", "Disallow 안에서 예외로 허용할 경로", "`Allow: /admin/public/`"],
            ["Sitemap", "사이트맵의 전체 주소", "`Sitemap: https://.../sitemap.xml`"],
          ],
        },
        {
          type: "p",
          text: "경로는 대소문자를 구분합니다. `Disallow: /Admin/`은 `/admin/`을 막지 못합니다. 구글은 규칙이 여러 개 겹치면 가장 구체적인(경로가 긴) 규칙을 따릅니다.",
        },
      ],
    },
    {
      heading: "지금 내 robots.txt 확인하는 방법",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "브라우저 주소창에 `내도메인.com/robots.txt`를 직접 입력해 내용을 봅니다. 404가 나오면 파일이 없는 것이고, 이 경우 구글은 제한 없이 크롤링합니다.",
            "구글 서치콘솔 > 설정 > robots.txt 보고서에서 구글이 마지막으로 가져간 버전과 가져온 시각, 오류 여부를 확인합니다.",
            "특정 페이지가 막혔는지 궁금하다면 서치콘솔의 URL 검사에서 '크롤링 허용 여부'를 봅니다.",
          ],
        },
        {
          type: "callout",
          label: "핵심",
          text: "robots.txt 주소가 404면 괜찮지만, 500 같은 서버 오류를 내면 구글은 사이트 전체 크롤링을 일시적으로 멈출 수 있습니다. 파일이 없다면 없는 대로, 있다면 200으로 정상 응답해야 합니다.",
        },
      ],
    },
    {
      heading: "흔한 실수 5가지",
      blocks: [
        { type: "h3", text: "1. 배포 후에도 남아 있는 Disallow: /" },
        {
          type: "p",
          text: "스테이징 서버가 검색에 노출되지 않게 넣어 둔 `Disallow: /`가 운영 배포에도 그대로 들어가는 경우입니다. 운영과 개발 환경의 robots.txt를 환경 변수로 분리했다면, 운영 환경 변수가 제대로 들어갔는지 배포 직후 한 번 열어 보는 습관이 가장 확실합니다.",
        },
        { type: "h3", text: "2. 색인을 막으려고 robots.txt를 쓰는 경우" },
        {
          type: "p",
          text: "robots.txt로 막은 페이지도 다른 사이트에서 링크되어 있으면 주소만 검색 결과에 나올 수 있습니다. 구글이 내용을 읽지 못해 설명 없이 주소만 뜨는 형태입니다. 검색 결과에서 확실히 빼고 싶다면 robots.txt는 열어 두고 페이지에 `noindex`를 넣어야 합니다.",
        },
        { type: "h3", text: "3. CSS·자바스크립트 폴더를 막는 경우" },
        {
          type: "p",
          text: "`Disallow: /static/`처럼 리소스 폴더를 막으면 구글이 페이지를 제대로 렌더링하지 못해, 모바일 친화성이나 본문 내용을 잘못 판단할 수 있습니다. 리소스 파일은 막지 않는 것이 원칙입니다.",
        },
        { type: "h3", text: "4. 슬래시 하나 차이" },
        {
          type: "p",
          text: "`Disallow: /blog`는 `/blog`, `/blog/`, `/blog-old`, `/blogger`까지 모두 막습니다. 특정 폴더만 막고 싶다면 `Disallow: /blog/`처럼 끝에 슬래시를 붙이세요.",
        },
        { type: "h3", text: "5. 지원되지 않는 지시어에 기대는 경우" },
        {
          type: "p",
          text: "`Crawl-delay`는 구글이 지원하지 않고, `Noindex:` 같은 지시어도 robots.txt에서는 동작하지 않습니다. 구글 기준으로 의미 있는 지시어는 `User-agent`, `Disallow`, `Allow`, `Sitemap` 네 가지입니다.",
        },
      ],
    },
    {
      heading: "AI 크롤러는 어떻게 다루나",
      blocks: [
        {
          type: "p",
          text: "AI 서비스들도 각자의 이름으로 크롤러를 운영하고, 대부분 robots.txt를 따른다고 밝히고 있습니다. 중요한 점은 같은 회사라도 **학습용**과 **검색·답변용** 크롤러가 나뉘어 있다는 것입니다.",
        },
        {
          type: "table",
          head: ["이름", "회사", "용도"],
          rows: [
            ["GPTBot", "OpenAI", "모델 학습용 수집"],
            ["OAI-SearchBot", "OpenAI", "ChatGPT 검색 결과에 노출"],
            ["ClaudeBot", "Anthropic", "모델 학습용 수집"],
            ["PerplexityBot", "Perplexity", "Perplexity 검색 결과에 노출"],
            ["Google-Extended", "Google", "Gemini 학습 사용 여부 제어 (구글 검색 노출과는 무관)"],
          ],
        },
        {
          type: "p",
          text: "AI 답변에 내 사이트가 인용되기를 원한다면 최소한 검색·답변용 크롤러는 막지 않아야 합니다. 학습에는 쓰이고 싶지 않다면 학습용만 골라 막는 방법이 있습니다.",
        },
        {
          type: "code",
          text: "# 학습용만 차단하고 검색·답변용은 허용\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /",
        },
        {
          type: "p",
          text: "크롤러 이름과 정책은 바뀔 수 있으니 각 회사의 공식 문서를 기준으로 확인하세요. META_SCAN의 'AI 신호' 카드에서는 이 설정이 AI 검색 노출을 막고 있지 않은지 함께 봅니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "robots.txt가 없으면 문제가 되나요?",
      a: "아니요. robots.txt가 없으면(404) 구글은 제한이 없다고 보고 모든 페이지를 크롤링합니다. 다만 사이트맵 위치를 알려주는 용도로라도 두는 것을 권합니다.",
    },
    {
      q: "robots.txt를 고쳤는데 언제 반영되나요?",
      a: "구글은 robots.txt를 보통 하루 정도 캐시합니다. 급하다면 서치콘솔의 robots.txt 보고서에서 다시 가져오기를 요청할 수 있습니다.",
    },
    {
      q: "특정 페이지만 검색에서 빼고 싶어요.",
      a: "그 페이지에 `<meta name=\"robots\" content=\"noindex\">`를 넣고 robots.txt에서는 막지 마세요. 구글이 페이지를 읽어야 noindex를 확인할 수 있습니다.",
    },
  ],
  related: ["site-not-on-google", "llms-txt"],
  references: [
    {
      title: "Google Search Central: robots.txt 소개",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
    },
    {
      title: "Google Search Central: robots.txt 작성 및 제출",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt",
    },
    {
      title: "Google Search Central: Google이 robots.txt 사양을 해석하는 방식",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt",
    },
    { title: "RFC 9309: Robots Exclusion Protocol", url: "https://www.rfc-editor.org/rfc/rfc9309" },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
  ],
};
