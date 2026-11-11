import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "llms-txt",
  lang: "ko",
  title: "llms.txt란? 만드는 법과 기대해도 되는 것",
  description:
    "llms.txt는 AI가 사이트를 빠르게 이해하도록 핵심 페이지를 마크다운으로 정리한 파일입니다. 형식, 작성 예시, 흔한 실수, 그리고 아직 표준이 아니라는 점까지 과장 없이 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "aiSignals",
  summary: [
    "llms.txt는 사이트 루트(`/llms.txt`)에 두는 마크다운 파일로, AI 모델에게 \"이 사이트는 무엇이고 중요한 페이지는 여기 있다\"고 요약해 주는 안내문입니다. 2024년 9월 Answer.AI의 제러미 하워드가 제안했습니다.",
    "만드는 데 10분이면 충분하고 손해 볼 것도 없습니다. 다만 아직 공식 표준이 아니고, 주요 AI 검색이 이 파일을 순위나 인용에 쓴다고 공식적으로 밝힌 곳은 드뭅니다. 기대치를 정확히 알고 만드는 게 좋습니다.",
  ],
  sections: [
    {
      heading: "왜 이런 파일이 나왔나",
      blocks: [
        {
          type: "p",
          text: "웹페이지에는 내비게이션, 광고, 스크립트처럼 본문과 상관없는 요소가 많습니다. AI 모델이 답변을 만들 때 쓸 수 있는 문맥의 양은 한정되어 있어서, 사이트 전체를 HTML 그대로 읽는 것은 비효율적입니다.",
        },
        {
          type: "p",
          text: "llms.txt의 아이디어는 간단합니다. 사람이 읽는 HTML과 별도로, AI가 읽기 좋은 짧은 요약과 핵심 링크 목록을 마크다운으로 제공하자는 것입니다. 개발 문서처럼 구조가 분명한 사이트에서 특히 쓸모가 있습니다.",
        },
      ],
    },
    {
      heading: "형식: 정해진 순서가 있다",
      blocks: [
        {
          type: "p",
          text: "llmstxt.org의 제안 형식은 아래 순서를 따릅니다. 필수는 첫 줄의 H1 하나뿐이지만, 나머지를 갖춰야 실제로 쓸모가 있습니다.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "`# 사이트 이름` (H1, 필수)",
            "`> 한두 문장 요약` (인용 블록)",
            "사이트에 대한 추가 설명 문단 (선택)",
            "`## 섹션 이름` 아래에 `- [링크 제목](URL): 설명` 형식의 목록",
            "`## Optional` 섹션: 문맥이 부족할 때 건너뛰어도 되는 링크",
          ],
        },
        {
          type: "code",
          text: "# META_SCAN.BIZ\n\n> 무료 SEO/AEO/GEO 분석기. URL 하나로 메타 태그, robots.txt,\n> 사이트맵, 구조화 데이터, AI 신호, Lighthouse 점수를 확인합니다.\n\n## Tool\n\n- [META_SCAN.BIZ](https://meta-scan.biz/ko): 분석기 홈\n\n## Blog\n\n- [robots.txt 확인하는 법](https://meta-scan.biz/ko/blog/robots-txt): 문법과 흔한 실수\n\n## Optional\n\n- [이용약관](https://meta-scan.biz/ko/terms)",
        },
      ],
    },
    {
      heading: "만들 때 흔한 실수",
      blocks: [
        {
          type: "table",
          head: ["실수", "문제", "해결"],
          rows: [
            ["`/llms.txt`가 홈페이지 HTML을 반환", "파일이 있는 것처럼 보이지만 실제로는 없음(소프트 404)", "`text/plain`으로 실제 파일을 응답하는지 확인"],
            ["모든 페이지를 다 나열", "요약의 의미가 사라짐", "핵심 페이지 10~30개로 추리기"],
            ["링크 설명 없음", "AI가 어떤 페이지를 볼지 판단 못 함", "`: 설명` 한 줄씩 붙이기"],
            ["내용이 오래됨", "없어진 페이지를 안내", "사이트맵처럼 빌드 때 자동 생성"],
          ],
        },
        {
          type: "callout",
          label: "실제 사례",
          text: "META_SCAN도 처음에는 `/llms.txt`로 들어가면 홈 화면이 200으로 떴습니다. 파일이 없는데 라우터가 모든 경로를 받아서 생긴 문제입니다. 주소창에 직접 열어 보고, 응답의 content-type이 `text/plain`인지 확인하세요.",
        },
      ],
    },
    {
      heading: "프레임워크별로 만드는 방법",
      blocks: [
        {
          type: "p",
          text: "가장 간단한 방법은 정적 파일로 두는 것입니다. 다만 글이 계속 늘어나는 사이트라면 손으로 관리하다 금방 낡기 때문에, 사이트맵처럼 빌드할 때 자동으로 만드는 편이 좋습니다.",
        },
        {
          type: "table",
          head: ["환경", "방법"],
          rows: [
            ["정적 사이트·일반 호스팅", "`public/` 같은 정적 폴더에 `llms.txt` 파일을 두면 루트 주소로 서빙됩니다."],
            ["Next.js(App Router)", "`app/llms.txt/route.ts`에서 `text/plain`으로 응답하는 GET 핸들러를 만들고, 글 목록을 읽어 링크를 생성합니다."],
            ["워드프레스", "llms.txt를 생성해 주는 플러그인을 쓰거나, 루트에 파일을 직접 업로드합니다."],
          ],
        },
        {
          type: "p",
          text: "어떤 방법이든 배포 후에는 주소창에서 직접 열어 보고, 응답 헤더의 content-type이 `text/plain`인지, 내용이 마크다운 그대로 보이는지 확인하세요.",
        },
      ],
    },
    {
      heading: "어디까지 기대해도 되나",
      blocks: [
        {
          type: "p",
          text: "솔직하게 말하면, llms.txt를 둔다고 AI 검색 노출이 올라간다는 근거는 아직 약합니다. 구글은 AI 기능(AI 개요 등)에 노출되기 위해 별도의 AI용 텍스트 파일이나 특별한 마크업이 필요하지 않다고 안내하고 있습니다.",
        },
        {
          type: "p",
          text: "그럼에도 만들 이유는 있습니다. 개발 도구나 에이전트처럼 사이트 문서를 직접 읽어 가는 AI 도구들이 이 파일을 활용하는 사례가 늘고 있고, 만드는 비용이 거의 없습니다. 무엇보다 이 파일을 쓰다 보면 \"우리 사이트의 핵심 페이지가 무엇인가\"를 정리하게 되는데, 이건 SEO에도 그대로 도움이 됩니다.",
        },
        {
          type: "p",
          text: "AI 검색 노출에 실제로 더 큰 영향을 주는 것은 따로 있습니다. AI 크롤러를 robots.txt에서 막지 않는 것, 본문이 자바스크립트 없이도 HTML에 들어 있는 것, 질문에 바로 답하는 문단과 FAQ, 구조화 데이터입니다. META_SCAN의 'AI 신호' 카드는 이 항목들을 함께 확인합니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "llms.txt가 없으면 AI 검색에 안 나오나요?",
      a: "아니요. 대부분의 AI 검색은 일반 웹페이지를 크롤링해 답변을 만듭니다. llms.txt는 있으면 도움이 될 수 있는 보조 신호이고, 없다고 불이익이 있다는 근거는 없습니다.",
    },
    {
      q: "robots.txt와 무엇이 다른가요?",
      a: "robots.txt는 크롤러에게 접근 허용·차단을 알려주는 규칙 파일이고, llms.txt는 AI에게 사이트 내용을 요약해 안내하는 문서입니다. llms.txt에는 차단 기능이 없습니다.",
    },
    {
      q: "llms-full.txt는 무엇인가요?",
      a: "링크 대신 핵심 문서의 본문 전체를 한 파일에 합쳐 둔 변형입니다. 문서가 많은 개발 도구 사이트에서 주로 씁니다. 일반 서비스 사이트라면 llms.txt 하나로 충분합니다.",
    },
  ],
  related: ["robots-txt", "seo-aeo-geo"],
  references: [
    { title: "llmstxt.org: The /llms.txt file (제안 원문)", url: "https://llmstxt.org/" },
    {
      title: "Google Search Central: AI 기능과 웹사이트",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
  ],
};
