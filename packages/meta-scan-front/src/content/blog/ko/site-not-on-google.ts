import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "site-not-on-google",
  lang: "ko",
  title: "내 사이트가 구글에 안 나올 때 확인할 7가지",
  description:
    "사이트를 만들었는데 구글 검색에 전혀 나오지 않는다면 robots.txt, noindex, 사이트맵, canonical, 서치콘솔 색인 상태 순서로 확인하세요. 원인별 확인 방법과 해결책을 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "indexing",
  isHub: true,
  summary: [
    "검색에 안 나오는 이유는 크게 두 가지입니다. 구글이 페이지를 **못 가져갔거나**(크롤링 차단, 서버 오류), 가져갔지만 **색인하지 않기로 했거나**(noindex, 중복, 품질)입니다.",
    "아래 7가지를 순서대로 보면 대부분 원인을 찾을 수 있습니다. 앞의 4개는 설정 실수라 몇 분이면 고칠 수 있고, 뒤의 3개는 시간과 콘텐츠가 필요한 문제입니다.",
  ],
  sections: [
    {
      heading: "먼저 정말 안 나오는지 확인하기",
      blocks: [
        {
          type: "p",
          text: "구글 검색창에 `site:내도메인.com`을 입력하면 구글이 색인한 페이지를 대략 볼 수 있습니다. 결과가 하나도 없다면 색인이 0인 상태이고, 몇 개라도 나온다면 \"색인은 됐지만 순위가 낮은\" 문제일 가능성이 큽니다. 두 경우는 해결 방법이 완전히 다릅니다.",
        },
        {
          type: "p",
          text: "다만 `site:` 결과는 대략적인 숫자라서 정확한 판단은 구글 서치콘솔에서 해야 합니다. 서치콘솔의 **URL 검사** 도구에 주소를 넣으면 \"URL이 Google에 등록되어 있음\" 또는 \"등록되지 않음\"과 함께 그 이유가 나옵니다. 아직 서치콘솔에 사이트를 등록하지 않았다면 이것부터 하세요.",
        },
        {
          type: "callout",
          label: "핵심",
          text: "새로 만든 사이트는 문제가 없어도 색인까지 며칠에서 몇 주가 걸립니다. 다만 한 달이 지나도 0이라면 아래 항목 중 하나가 걸려 있을 가능성이 높습니다.",
        },
      ],
    },
    {
      heading: "robots.txt가 크롤러를 막고 있지 않은가",
      blocks: [
        {
          type: "p",
          text: "`https://내도메인.com/robots.txt`를 브라우저로 열어 보세요. 아래처럼 되어 있다면 모든 검색엔진의 크롤링을 막고 있는 상태입니다. 개발 중에 넣어 둔 설정을 배포 후에도 그대로 둔 경우가 정말 많습니다.",
        },
        { type: "code", text: "User-agent: *\nDisallow: /" },
        {
          type: "p",
          text: "robots.txt 파일이 아예 없는 것은 문제가 아닙니다. 없으면 구글은 제한이 없다고 보고 크롤링합니다. 반대로 robots.txt 주소가 서버 오류(5xx)를 내면 구글은 사이트 전체 크롤링을 일시적으로 멈출 수 있으니 주의하세요. 자세한 문법과 흔한 실수는 [robots.txt 확인하는 법](/ko/blog/robots-txt) 글에 정리했습니다.",
        },
      ],
    },
    {
      heading: "noindex가 실수로 들어가 있지 않은가",
      blocks: [
        {
          type: "p",
          text: "페이지 소스(Ctrl+U)에서 `noindex`를 검색해 보세요. `<meta name=\"robots\" content=\"noindex\">`가 있으면 구글은 그 페이지를 크롤링하더라도 검색 결과에 넣지 않습니다. 워드프레스의 \"검색엔진이 사이트를 색인하지 않도록 합니다\" 옵션, 스테이징용 설정, 일부 SEO 플러그인이 흔한 원인입니다.",
        },
        {
          type: "p",
          text: "HTML에는 없는데 HTTP 응답 헤더에 `X-Robots-Tag: noindex`로 들어가는 경우도 있습니다. 개발자 도구의 네트워크 탭에서 문서 요청의 응답 헤더를 확인하세요.",
        },
        {
          type: "callout",
          label: "주의",
          text: "robots.txt로 막힌 페이지는 구글이 아예 읽지 못하므로 noindex도 볼 수 없습니다. 색인에서 빼고 싶은 페이지는 robots.txt로 막지 말고 noindex를 써야 합니다.",
        },
      ],
    },
    {
      heading: "사이트맵을 만들고 제출했는가",
      blocks: [
        {
          type: "p",
          text: "사이트맵(`sitemap.xml`)은 \"우리 사이트에는 이런 페이지들이 있다\"고 검색엔진에 알려주는 목록입니다. 없어도 링크를 따라 찾아오긴 하지만, 외부 링크가 거의 없는 새 사이트는 구글이 페이지를 발견하는 것 자체가 느립니다.",
        },
        {
          type: "list",
          items: [
            "robots.txt 맨 아래에 `Sitemap: https://내도메인.com/sitemap.xml` 한 줄을 추가합니다.",
            "서치콘솔 > 색인 > Sitemaps에서 사이트맵 주소를 제출합니다.",
            "네이버도 노리고 있다면 네이버 서치어드바이저에도 같은 주소를 제출합니다.",
          ],
          ordered: true,
        },
      ],
    },
    {
      heading: "canonical이 다른 주소를 가리키고 있지 않은가",
      blocks: [
        {
          type: "p",
          text: "`<link rel=\"canonical\" href=\"...\">`는 \"이 페이지의 대표 주소는 여기다\"라는 선언입니다. 모든 페이지의 canonical이 홈페이지를 가리키거나, 개발 서버 주소(`localhost`, 스테이징 도메인)를 가리키고 있으면 구글은 정작 그 페이지를 색인하지 않습니다.",
        },
        {
          type: "table",
          head: ["상황", "증상", "조치"],
          rows: [
            ["모든 페이지 canonical이 홈", "홈만 색인되고 나머지는 '중복' 처리", "페이지마다 자기 주소로 설정"],
            ["canonical이 개발 도메인", "색인 0, 서치콘솔에 '다른 표준 페이지'", "배포 환경 변수 확인"],
            ["http/https, www 혼용", "같은 페이지가 여러 주소로 분산", "한 주소로 리디렉션 + canonical 통일"],
          ],
        },
      ],
    },
    {
      heading: "서치콘솔이 말하는 색인 상태 읽기",
      blocks: [
        {
          type: "p",
          text: "서치콘솔 > 색인 > 페이지 보고서에는 색인되지 않은 이유가 분류되어 나옵니다. 위 설정 문제가 없다면 대부분 아래 두 상태 중 하나입니다.",
        },
        {
          type: "table",
          head: ["상태", "의미", "할 일"],
          rows: [
            ["발견됨 - 현재 색인이 생성되지 않음", "주소는 알지만 아직 크롤링하지 않음", "내부 링크·외부 링크를 늘리고 기다리기"],
            ["크롤링됨 - 현재 색인이 생성되지 않음", "읽었지만 색인할 가치가 낮다고 판단", "본문을 보강하고 중복·얇은 페이지 정리"],
          ],
        },
        {
          type: "p",
          text: "설정을 고친 뒤에는 URL 검사에서 **색인 생성 요청**을 누르면 재크롤링을 앞당길 수 있습니다. 요청이 곧바로 색인을 보장하지는 않지만, 고친 내용을 빨리 반영하는 데는 도움이 됩니다.",
        },
      ],
    },
    {
      heading: "콘텐츠와 외부 링크: 시간이 필요한 두 가지",
      blocks: [
        {
          type: "p",
          text: "설정이 모두 정상인데도 색인이 안 된다면, 구글 입장에서 이 사이트를 굳이 색인할 이유가 부족한 것입니다. 도구 화면만 있고 읽을 글이 거의 없는 사이트, 다른 페이지와 내용이 거의 같은 페이지가 대표적입니다.",
        },
        {
          type: "list",
          items: [
            "페이지마다 그 페이지에서만 얻을 수 있는 설명을 충분히 씁니다. 제목과 설명(description)도 페이지마다 다르게 씁니다.",
            "검색 결과로 보여줄 필요가 없는 페이지(검색 결과 페이지, 빈 목록, 로그인 화면)는 noindex로 빼서 사이트 전체의 품질 신호를 지킵니다.",
            "GitHub README, 커뮤니티 소개 글, 개인 블로그처럼 사람이 실제로 클릭할 만한 곳에 사이트 링크를 남깁니다. 외부 링크는 구글이 새 사이트를 발견하는 가장 빠른 길입니다.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN의 '색인' 카드는 위 항목 중 robots.txt, 사이트맵, canonical, noindex를 한 번에 확인합니다. 나머지(서치콘솔 상태, 콘텐츠 품질)는 직접 봐야 하는 영역입니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "사이트를 만들고 얼마나 기다려야 구글에 나오나요?",
      a: "정해진 기간은 없습니다. 보통 며칠에서 몇 주 걸리고, 외부 링크가 없는 새 도메인은 더 오래 걸립니다. 서치콘솔에 사이트맵을 제출하고 URL 검사로 색인을 요청하면 발견 속도를 앞당길 수 있습니다.",
    },
    {
      q: "site: 검색에 아무것도 안 나오면 사이트가 차단된 건가요?",
      a: "반드시 그렇지는 않습니다. 아직 크롤링되지 않았을 수도 있습니다. 서치콘솔의 URL 검사로 정확한 상태와 이유를 확인하세요. 수동 조치(페널티)를 받은 경우에는 서치콘솔의 '보안 및 직접 조치' 메뉴에 표시됩니다.",
    },
    {
      q: "구글에는 나오는데 네이버에는 안 나와요.",
      a: "네이버는 별도로 등록해야 합니다. 네이버 서치어드바이저에서 사이트 소유를 확인하고 사이트맵을 제출하세요. robots.txt에서 네이버 크롤러(Yeti)를 막고 있지 않은지도 확인하세요.",
    },
  ],
  related: ["robots-txt", "seo-aeo-geo"],
  references: [
    {
      title: "Google Search Central: Google 검색의 작동 방식",
      url: "https://developers.google.com/search/docs/fundamentals/how-search-works",
    },
    {
      title: "Google Search Central: noindex로 검색 색인 생성 차단",
      url: "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    },
    {
      title: "Google Search Central: 사이트맵 만들기 및 제출",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
    {
      title: "Google Search Central: 중복 URL 통합(canonical)",
      url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    },
    {
      title: "Search Console 고객센터: 페이지 색인 생성 보고서",
      url: "https://support.google.com/webmasters/answer/7440203",
    },
  ],
};
