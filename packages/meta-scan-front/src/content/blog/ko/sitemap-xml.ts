import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "sitemap-xml",
  lang: "ko",
  title: "sitemap.xml 만들고 제출하는 법",
  description:
    "사이트맵은 검색엔진에 내 사이트의 페이지 목록을 알려주는 파일입니다. 형식, 넣어야 할 페이지와 빼야 할 페이지, 구글 서치콘솔과 네이버 서치어드바이저 제출 방법을 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "indexing",
  summary: [
    "sitemap.xml은 \"우리 사이트에는 이런 주소들이 있다\"고 검색엔진에 알려주는 XML 파일입니다. 사이트맵이 없어도 구글은 링크를 따라 페이지를 찾지만, 외부 링크가 적은 새 사이트나 페이지가 많은 사이트는 발견이 늦어집니다.",
    "중요한 건 파일을 만드는 것보다 **무엇을 넣느냐**입니다. 사이트맵에는 검색 결과에 나오길 원하는 대표 주소만 넣고, noindex 페이지나 리디렉션되는 주소, 중복 주소는 빼야 합니다.",
  ],
  sections: [
    {
      heading: "기본 형식",
      blocks: [
        {
          type: "p",
          text: "사이트맵은 sitemaps.org에서 정한 프로토콜을 따릅니다. 가장 단순한 형태는 아래처럼 `<url>` 안에 `<loc>`(주소) 하나만 있는 것입니다. `<lastmod>`(마지막 수정일)는 선택이지만 정확하게 넣으면 도움이 됩니다.",
        },
        {
          type: "code",
          text: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://내도메인.com/</loc>\n    <lastmod>2026-11-01</lastmod>\n  </url>\n  <url>\n    <loc>https://내도메인.com/blog/first-post</loc>\n    <lastmod>2026-11-10</lastmod>\n  </url>\n</urlset>',
        },
        {
          type: "table",
          head: ["태그", "필수", "구글이 쓰는가"],
          rows: [
            ["loc", "필수", "사용. 반드시 `https://`로 시작하는 전체 주소"],
            ["lastmod", "선택", "꾸준히 정확하다고 판단되면 사용"],
            ["changefreq", "선택", "무시"],
            ["priority", "선택", "무시"],
          ],
        },
        {
          type: "p",
          text: "`changefreq`와 `priority`는 많은 생성기가 기본으로 넣지만 구글은 쓰지 않는다고 밝히고 있습니다. 넣어도 해는 없지만 공들일 필요는 없습니다. 반대로 `lastmod`는 모든 페이지에 빌드 시각을 똑같이 찍어 버리면 신뢰를 잃으니, 실제로 내용이 바뀐 날짜를 넣어야 합니다.",
        },
      ],
    },
    {
      heading: "무엇을 넣고 무엇을 뺄까",
      blocks: [
        {
          type: "p",
          text: "사이트맵은 검색엔진에게 보내는 \"이 주소들을 색인해 주세요\"라는 목록입니다. 그래서 색인되길 원하지 않는 주소가 섞여 있으면 신호가 서로 부딪힙니다. 서치콘솔에서 \"제출된 URL에 noindex 태그가 있음\" 같은 경고가 뜨는 이유입니다.",
        },
        {
          type: "table",
          head: ["넣을 주소", "뺄 주소"],
          rows: [
            ["홈, 주요 기능 소개, 블로그 글", "noindex가 걸린 페이지"],
            ["canonical이 자기 자신인 대표 주소", "다른 주소로 리디렉션되는 주소"],
            ["다국어라면 언어별 대표 주소", "검색 결과·필터·정렬 같은 파라미터 주소"],
            ["로그인 없이 볼 수 있는 페이지", "로그인 화면, 마이페이지, 결제 단계"],
          ],
        },
        {
          type: "callout",
          label: "실제 사례",
          text: "META_SCAN도 처음에는 스캔 진행 화면과 결과 화면 주소가 사이트맵에 들어 있었습니다. 이 페이지들은 URL을 넣어야 의미가 있는 도구 화면이라 그 자체로는 읽을 내용이 거의 없습니다. 지금은 noindex를 걸고 사이트맵에서도 뺐습니다.",
        },
      ],
    },
    {
      heading: "크기 제한과 사이트맵 인덱스",
      blocks: [
        {
          type: "p",
          text: "사이트맵 파일 하나에는 URL 50,000개, 압축하지 않은 크기 50MB까지 넣을 수 있습니다. 이보다 크면 여러 파일로 나누고, 그 파일들을 묶는 사이트맵 인덱스를 만들어 인덱스 주소 하나만 제출하면 됩니다.",
        },
        {
          type: "code",
          text: '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>https://내도메인.com/sitemap-pages.xml</loc>\n  </sitemap>\n  <sitemap>\n    <loc>https://내도메인.com/sitemap-blog.xml</loc>\n  </sitemap>\n</sitemapindex>',
        },
        {
          type: "p",
          text: "페이지가 많지 않더라도 성격별로 나눠 두면 서치콘솔에서 \"블로그 글 중 몇 개가 색인됐는지\"처럼 묶음별 상태를 따로 볼 수 있어 편합니다.",
        },
      ],
    },
    {
      heading: "프레임워크별로 만드는 방법",
      blocks: [
        {
          type: "p",
          text: "사이트맵을 손으로 관리하면 새 글을 쓸 때마다 잊어버리기 쉽습니다. 대부분의 프레임워크는 빌드하거나 요청할 때 자동으로 만드는 방법을 제공합니다.",
        },
        {
          type: "table",
          head: ["환경", "방법"],
          rows: [
            ["Next.js(App Router)", "`app/sitemap.ts`에서 주소 배열을 반환하면 `/sitemap.xml`로 서빙됩니다. 글 목록을 읽어 lastModified를 넣을 수 있습니다."],
            ["워드프레스", "5.5 버전부터 `/wp-sitemap.xml`이 기본 제공되고, SEO 플러그인을 쓰면 플러그인의 사이트맵으로 대체됩니다."],
            ["정적 사이트 생성기", "Gatsby, Astro, Hugo 등은 공식 사이트맵 플러그인이나 내장 기능이 있습니다."],
            ["직접 만든 서버", "DB에서 공개 페이지 목록을 읽어 XML을 응답하는 라우트를 하나 둡니다."],
          ],
        },
      ],
    },
    {
      heading: "제출하는 방법",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "**robots.txt에 위치 적기**: 맨 아래에 `Sitemap: https://내도메인.com/sitemap.xml`을 추가합니다. 구글, 네이버, 빙 모두 이 줄을 읽습니다.",
            "**구글 서치콘솔**: 색인 > Sitemaps 메뉴에서 사이트맵 주소를 입력하고 제출합니다. 처리 상태와 발견된 URL 수가 표시됩니다.",
            "**네이버 서치어드바이저**: 사이트 소유 확인 후 요청 > 사이트맵 제출에서 같은 주소를 넣습니다.",
            "**빙 웹마스터 도구**: 서치콘솔 계정을 연동해 가져올 수 있습니다. 빙 색인은 일부 AI 검색 서비스에서도 활용됩니다.",
          ],
        },
        {
          type: "p",
          text: "예전에는 `google.com/ping?sitemap=...` 주소로 사이트맵 갱신을 알리는 방법이 있었지만 구글은 2023년에 이 기능을 종료했습니다. 지금은 robots.txt와 서치콘솔 제출, 그리고 정확한 lastmod가 공식 방법입니다.",
        },
      ],
    },
    {
      heading: "제출 후 확인할 것",
      blocks: [
        {
          type: "list",
          items: [
            "서치콘솔 Sitemaps 화면의 상태가 \"성공\"인지. \"가져올 수 없음\"이면 주소가 404이거나 robots.txt로 막힌 경우가 많습니다.",
            "\"발견된 페이지\" 수가 내가 넣은 주소 수와 비슷한지.",
            "색인 > 페이지 보고서에서 사이트맵으로 필터링했을 때 색인 안 된 이유가 무엇인지.",
            "사이트맵 안의 주소가 http, 다른 도메인, 개발 서버 주소로 들어가 있지 않은지.",
          ],
        },
        {
          type: "p",
          text: "사이트맵을 제출했다고 모든 주소가 색인되는 것은 아닙니다. 사이트맵은 발견을 돕는 도구일 뿐이고, 색인 여부는 페이지 품질과 중복 여부로 결정됩니다. 색인이 안 되는 이유를 단계별로 보려면 [구글에 안 나올 때 확인할 7가지](/ko/blog/site-not-on-google)를 참고하세요.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "페이지가 10개뿐인 작은 사이트도 사이트맵이 필요한가요?",
      a: "꼭 필요하지는 않습니다. 내부 링크가 잘 연결된 작은 사이트는 구글이 알아서 찾습니다. 다만 만드는 비용이 거의 없고 서치콘솔에서 색인 상태를 보기 편해지므로 두는 것을 권합니다.",
    },
    {
      q: "사이트맵을 고치면 다시 제출해야 하나요?",
      a: "같은 주소라면 다시 제출할 필요는 없습니다. 구글은 제출된 사이트맵을 주기적으로 다시 읽습니다. 급하다면 서치콘솔에서 같은 주소를 다시 제출해 재처리를 요청할 수 있습니다.",
    },
    {
      q: "이미지나 동영상도 사이트맵에 넣을 수 있나요?",
      a: "네. 이미지·동영상·뉴스용 확장 태그가 있습니다. 다만 일반적인 서비스 사이트라면 페이지 주소만 정확히 넣어도 충분합니다.",
    },
  ],
  related: ["site-not-on-google", "robots-txt", "noindex-check"],
  references: [
    { title: "sitemaps.org: Sitemap 프로토콜", url: "https://www.sitemaps.org/protocol.html" },
    {
      title: "Google Search Central: 사이트맵 만들기 및 제출",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
    {
      title: "Google Search Central: 대규모 사이트맵 관리(사이트맵 색인)",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps",
    },
    {
      title: "Google Search Central Blog: Sitemaps ping endpoint is going away",
      url: "https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping",
    },
    { title: "네이버 서치어드바이저", url: "https://searchadvisor.naver.com/" },
  ],
};
