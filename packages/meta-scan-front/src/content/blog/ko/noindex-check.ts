import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "noindex-check",
  lang: "ko",
  title: "noindex가 실수로 들어갔는지 확인하는 법",
  description:
    "페이지가 검색에서 사라졌다면 noindex를 먼저 의심하세요. 메타 태그와 X-Robots-Tag 헤더를 확인하는 방법, 워드프레스·Next.js·Vercel에서 흔히 생기는 원인과 해제 후 할 일을 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "indexing",
  summary: [
    "noindex는 \"이 페이지를 검색 결과에 넣지 마라\"는 지시입니다. 구글은 noindex를 발견하면 그 페이지를 색인에서 빼고, 이미 색인된 페이지라도 다음 크롤링 때 제거합니다.",
    "noindex는 HTML 메타 태그와 HTTP 응답 헤더 두 곳에 들어갈 수 있습니다. 소스 보기로는 헤더 쪽이 보이지 않기 때문에, 둘 다 확인해야 원인을 놓치지 않습니다.",
  ],
  sections: [
    {
      heading: "noindex가 들어가는 두 곳",
      blocks: [
        {
          type: "table",
          head: ["위치", "형태", "확인 방법"],
          rows: [
            ["HTML 메타 태그", '`<meta name="robots" content="noindex">`', "페이지 소스 보기(Ctrl+U)에서 noindex 검색"],
            ["HTTP 응답 헤더", "`X-Robots-Tag: noindex`", "개발자 도구 네트워크 탭 > 문서 요청 > 응답 헤더"],
          ],
        },
        {
          type: "p",
          text: "메타 태그는 `name=\"robots\"`(모든 검색엔진) 대신 `name=\"googlebot\"`처럼 특정 크롤러만 지정할 수도 있습니다. 소스에서 검색할 때는 `robots`가 아니라 `noindex`라는 단어로 찾아야 이런 경우까지 잡힙니다.",
        },
        {
          type: "p",
          text: "X-Robots-Tag 헤더는 PDF나 이미지처럼 HTML이 아닌 파일에도 쓸 수 있어서 서버나 CDN 설정에서 일괄로 넣는 경우가 많습니다. 그만큼 의도치 않게 사이트 전체에 걸리기도 쉽습니다.",
        },
      ],
    },
    {
      heading: "터미널로 한 번에 확인하기",
      blocks: [
        {
          type: "p",
          text: "브라우저 확장 프로그램이나 로그인 상태에 따라 결과가 달라질 수 있으니, 검색엔진처럼 깨끗한 요청으로 확인하는 것이 정확합니다.",
        },
        {
          type: "code",
          text: "# 응답 헤더에 X-Robots-Tag가 있는지\ncurl -sI https://내도메인.com/page | grep -i x-robots\n\n# HTML 안에 noindex가 있는지\ncurl -s https://내도메인.com/page | grep -io '<meta[^>]*noindex[^>]*>'",
        },
        {
          type: "p",
          text: "둘 다 아무것도 출력되지 않으면 서버가 보내는 응답에는 noindex가 없는 것입니다. 다만 자바스크립트가 나중에 메타 태그를 바꾸는 경우도 있으니, 확실하게 하려면 서치콘솔 URL 검사의 \"실제 URL 테스트\"로 구글이 렌더링한 결과를 보세요.",
        },
      ],
    },
    {
      heading: "흔한 원인",
      blocks: [
        { type: "h3", text: "워드프레스의 검색엔진 차단 옵션" },
        {
          type: "p",
          text: "설정 > 읽기의 \"검색 엔진이 이 사이트를 색인하지 않도록 합니다\"에 체크되어 있으면 모든 페이지에 noindex가 들어갑니다. 사이트를 만드는 동안 켜 두었다가 공개 후 끄는 것을 잊는 경우가 가장 흔합니다.",
        },
        { type: "h3", text: "스테이징 설정이 운영에 섞임" },
        {
          type: "p",
          text: "개발 서버가 검색에 노출되지 않도록 환경 변수로 noindex를 켜 두는 구조라면, 운영 배포에서 그 변수가 잘못 들어가는 순간 사이트 전체가 사라집니다. 운영 배포 체크리스트에 \"홈 소스에서 noindex 검색\"을 넣어 두세요.",
        },
        { type: "h3", text: "호스팅의 미리보기 배포" },
        {
          type: "p",
          text: "Vercel 같은 호스팅은 미리보기(preview) 배포 주소에 자동으로 `X-Robots-Tag: noindex`를 붙입니다. 이건 의도된 동작이라 문제가 아니지만, 운영 도메인을 미리보기 배포에 연결해 두면 운영 사이트에도 noindex가 붙습니다. 운영 도메인이 프로덕션 배포에 연결됐는지 확인하세요.",
        },
        { type: "h3", text: "프레임워크 메타데이터 상속" },
        {
          type: "p",
          text: "Next.js처럼 레이아웃의 메타데이터가 하위 페이지로 상속되는 구조에서는, 어떤 레이아웃에 `robots: { index: false }`를 넣으면 그 아래 모든 페이지가 noindex가 됩니다. 얇은 페이지 하나를 빼려다 섹션 전체를 빼는 실수가 여기서 생깁니다.",
        },
      ],
    },
    {
      heading: "robots.txt와 함께 쓰면 안 되는 이유",
      blocks: [
        {
          type: "p",
          text: "검색에서 확실히 빼려고 robots.txt로 막고 noindex도 넣는 경우가 있는데, 이러면 오히려 noindex가 동작하지 않습니다. robots.txt로 막힌 페이지는 구글이 읽지 못하므로 그 안의 noindex도 보지 못합니다. 그 결과 외부 링크가 있는 페이지는 설명 없이 주소만 검색 결과에 남을 수 있습니다.",
        },
        {
          type: "callout",
          label: "핵심",
          text: "검색 결과에서 빼고 싶은 페이지는 robots.txt로 막지 말고 noindex만 거세요. 구글이 페이지를 읽어야 noindex를 확인할 수 있습니다.",
        },
      ],
    },
    {
      heading: "의도적으로 noindex를 걸어야 하는 페이지",
      blocks: [
        {
          type: "p",
          text: "noindex는 실수만 일으키는 태그가 아닙니다. 검색 결과로 보여줄 가치가 없는 페이지를 빼 두면 사이트 전체에서 색인된 페이지의 평균 품질이 올라갑니다.",
        },
        {
          type: "list",
          items: [
            "사이트 내 검색 결과 페이지",
            "로그인, 회원가입, 비밀번호 찾기 화면",
            "장바구니, 결제 단계, 마이페이지",
            "입력값이 있어야 의미가 생기는 도구 화면 (META_SCAN의 스캔 진행·결과 화면이 여기에 해당합니다)",
            "내용이 거의 없는 태그·카테고리 목록",
          ],
        },
        {
          type: "p",
          text: "이런 페이지에는 `noindex, follow`를 쓰면 페이지 자체는 색인하지 않되, 그 안의 링크는 따라가 다른 페이지를 발견하게 할 수 있습니다.",
        },
      ],
    },
    {
      heading: "noindex를 지운 뒤 할 일",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "운영 주소에서 위의 curl 명령으로 메타 태그와 헤더 모두 사라졌는지 확인합니다.",
            "서치콘솔 URL 검사에서 \"실제 URL 테스트\"를 실행해 \"색인 생성 허용됨\"이 나오는지 봅니다.",
            "\"색인 생성 요청\"을 눌러 재크롤링을 요청합니다. 주요 페이지 몇 개만 요청하면 나머지는 사이트맵과 링크를 따라 다시 처리됩니다.",
            "색인 > 페이지 보고서의 \"'noindex' 태그에 의해 제외됨\" 항목이 며칠~몇 주에 걸쳐 줄어드는지 지켜봅니다.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "noindex를 지우면 바로 다시 검색에 나오나요?",
      a: "구글이 페이지를 다시 크롤링해야 반영됩니다. 색인 생성 요청을 하면 보통 며칠 안에 처리되지만, 사이트 전체가 빠졌던 경우는 몇 주가 걸리기도 합니다.",
    },
    {
      q: "noindex와 nofollow는 무엇이 다른가요?",
      a: "noindex는 이 페이지를 검색 결과에 넣지 말라는 뜻이고, nofollow는 이 페이지의 링크를 따라가지 말라는 뜻입니다. 둘은 독립적이라 필요한 것만 골라 씁니다.",
    },
    {
      q: "네이버도 noindex를 따르나요?",
      a: "네. 네이버도 robots 메타 태그의 noindex를 지원합니다. 네이버 서치어드바이저의 웹페이지 수집 도구로 네이버가 본 상태를 확인할 수 있습니다.",
    },
  ],
  related: ["site-not-on-google", "robots-txt", "canonical-tag"],
  references: [
    {
      title: "Google Search Central: noindex로 검색 색인 생성 차단",
      url: "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    },
    {
      title: "Google Search Central: robots 메타 태그, data-nosnippet, X-Robots-Tag 사양",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
    },
    {
      title: "Search Console 고객센터: URL 검사 도구",
      url: "https://support.google.com/webmasters/answer/9012289",
    },
    {
      title: "Vercel Docs: Preview deployments",
      url: "https://vercel.com/docs/deployments/environments",
    },
  ],
};
