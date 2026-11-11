import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "og-tags-preview",
  lang: "ko",
  title: "카톡·슬랙 링크 미리보기가 안 뜰 때 (OG 태그 정리)",
  description:
    "링크를 공유했는데 이미지가 안 나오거나 예전 제목이 뜬다면 Open Graph 태그와 캐시 문제입니다. 필수 태그, 이미지 규격, 카카오톡 캐시 초기화 방법까지 순서대로 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "previews",
  isHub: true,
  summary: [
    "카카오톡, 슬랙, 페이스북, X 같은 서비스는 링크가 공유되면 그 페이지의 Open Graph(OG) 태그를 읽어 제목·설명·이미지 카드를 만듭니다. 태그가 없거나 틀리면 카드가 비어 보입니다.",
    "가장 흔한 원인은 세 가지입니다. og:image가 상대 경로이거나, 이미지가 너무 크거나 접근할 수 없거나, 고친 뒤에도 서비스가 예전 결과를 캐시하고 있는 경우입니다.",
  ],
  sections: [
    {
      heading: "꼭 있어야 하는 태그",
      blocks: [
        {
          type: "p",
          text: "OG 태그는 HTML `<head>` 안에 `meta property` 형식으로 넣습니다. 아래 다섯 개면 대부분의 서비스에서 카드가 제대로 만들어집니다.",
        },
        {
          type: "code",
          text: '<meta property="og:title" content="페이지 제목" />\n<meta property="og:description" content="한두 문장 설명" />\n<meta property="og:image" content="https://내도메인.com/og.png" />\n<meta property="og:url" content="https://내도메인.com/page" />\n<meta property="og:type" content="website" />',
        },
        {
          type: "table",
          head: ["태그", "역할", "자주 하는 실수"],
          rows: [
            ["og:title", "카드 제목", "모든 페이지가 같은 제목"],
            ["og:description", "카드 설명", "비워 두거나 너무 길게 씀"],
            ["og:image", "카드 이미지", "`/og.png` 같은 상대 경로"],
            ["og:url", "대표 주소", "개발 서버 주소가 들어감"],
            ["og:type", "콘텐츠 종류", "글 페이지인데 website로 둠(article 권장)"],
          ],
        },
      ],
    },
    {
      heading: "이미지가 안 뜨는 이유",
      blocks: [
        {
          type: "list",
          items: [
            "**상대 경로**: `og:image`는 반드시 `https://`로 시작하는 전체 주소여야 합니다. 크롤러는 페이지 주소를 기준으로 경로를 풀어 주지 않는 경우가 많습니다.",
            "**접근 불가**: 로그인이 필요한 경로, 핫링크 차단, robots.txt로 막힌 이미지 폴더는 미리보기 크롤러도 가져갈 수 없습니다. 시크릿 창에서 이미지 주소를 직접 열어 보세요.",
            "**크기와 비율**: 가로로 긴 1200×630 픽셀(약 1.91:1)이 가장 무난합니다. 너무 작으면 작은 썸네일로 나오고, 용량이 너무 크면 가져오다 실패하기도 합니다.",
            "**자바스크립트로 넣은 태그**: 미리보기 크롤러는 대부분 자바스크립트를 실행하지 않습니다. 클라이언트에서 나중에 `<head>`에 넣는 태그는 보이지 않으니, 서버에서 렌더링된 HTML에 들어 있어야 합니다.",
          ],
        },
        {
          type: "callout",
          label: "확인 방법",
          text: "브라우저에서 페이지 소스 보기(Ctrl+U)로 `og:image`를 검색하세요. 소스에 없고 개발자 도구의 Elements 탭에만 보인다면 자바스크립트로 넣고 있는 것입니다.",
        },
      ],
    },
    {
      heading: "고쳤는데도 예전 미리보기가 뜰 때",
      blocks: [
        {
          type: "p",
          text: "미리보기 카드는 서비스마다 캐시됩니다. 태그를 고쳐도 이미 한 번 공유된 링크는 한동안 예전 카드가 그대로 나옵니다. 각 서비스의 디버거 도구로 캐시를 지우고 다시 가져오게 할 수 있습니다.",
        },
        {
          type: "table",
          head: ["서비스", "도구", "방법"],
          rows: [
            ["카카오톡", "카카오 공유 디버거", "URL 입력 후 '캐시 초기화'"],
            ["페이스북·인스타그램", "Meta 공유 디버거", "URL 입력 후 '다시 스크랩'"],
            ["링크드인", "Post Inspector", "URL 입력하면 새로 가져옴"],
            ["슬랙", "별도 도구 없음", "주소 뒤에 `?v=2` 같은 쿼리를 붙여 새 링크로 공유"],
          ],
        },
      ],
    },
    {
      heading: "X(트위터) 카드는 따로 챙겨야 하나",
      blocks: [
        {
          type: "p",
          text: "X는 `twitter:` 태그를 먼저 보고, 없으면 OG 태그로 대체합니다. 그래서 OG 태그만 제대로 있어도 기본 카드는 나옵니다. 다만 큰 이미지 카드로 보이게 하려면 아래 한 줄을 추가해야 합니다.",
        },
        { type: "code", text: '<meta name="twitter:card" content="summary_large_image" />' },
        {
          type: "p",
          text: "이 태그가 없으면 작은 정사각형 썸네일 카드(`summary`)로 나옵니다. 랜딩 페이지나 블로그 글처럼 공유가 중요한 페이지라면 큰 카드가 클릭률 면에서 유리합니다.",
        },
      ],
    },
    {
      heading: "배포 전 체크리스트",
      blocks: [
        {
          type: "list",
          items: [
            "페이지 소스에 og:title, og:description, og:image, og:url이 모두 있다",
            "og:image 주소를 시크릿 창에서 열면 이미지가 바로 보인다",
            "이미지가 1200×630 근처이고 용량이 수 MB를 넘지 않는다",
            "twitter:card가 summary_large_image로 설정되어 있다",
            "공유가 잦은 페이지는 카카오·Meta 디버거로 한 번씩 미리 확인했다",
          ],
        },
      ],
    },
    {
      heading: "페이지마다 다르게 만들기",
      blocks: [
        {
          type: "p",
          text: "사이트 전체에 같은 OG 태그 하나만 넣어 두는 경우가 많습니다. 그러면 어떤 글을 공유해도 홈페이지 카드가 나와서, 받는 사람은 무슨 내용인지 알 수 없습니다. 최소한 제목과 설명은 페이지마다 그 페이지의 title, description과 같게 맞추세요.",
        },
        {
          type: "p",
          text: "Next.js라면 페이지별 `generateMetadata`에서 `openGraph`를 반환하면 되고, 워드프레스라면 SEO 플러그인이 글 제목과 요약으로 자동 생성해 줍니다. META_SCAN의 '미리보기' 카드에서는 실제로 카카오톡·구글·X에서 어떻게 보일지 모형으로 보여주고, 태그 누락과 이미지 크기를 함께 확인합니다.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "og:image 크기는 정확히 얼마로 해야 하나요?",
      a: "1200×630 픽셀이 가장 널리 쓰입니다. 서비스마다 잘라 보여주는 방식이 달라서, 중요한 글자나 로고는 가운데에 두고 가장자리에는 여백을 두는 것이 안전합니다.",
    },
    {
      q: "카카오톡에서만 미리보기가 안 나와요.",
      a: "카카오 공유 디버거에 URL을 넣어 보세요. 카카오가 가져간 태그와 오류가 그대로 보입니다. 이미 공유된 적이 있는 링크라면 '캐시 초기화'를 누른 뒤 다시 공유하세요.",
    },
    {
      q: "OG 태그가 검색 순위에도 영향을 주나요?",
      a: "직접적인 순위 요소는 아닙니다. 다만 공유됐을 때 카드가 제대로 보여야 클릭이 생기고, 그렇게 생긴 방문과 언급은 간접적으로 도움이 됩니다.",
    },
  ],
  related: ["site-not-on-google", "seo-aeo-geo"],
  references: [
    { title: "The Open Graph protocol", url: "https://ogp.me/" },
    { title: "Kakao Developers: 공유 디버거", url: "https://developers.kakao.com/tool/debugger/sharing" },
    { title: "Meta for Developers: 공유 디버거", url: "https://developers.facebook.com/tools/debug/" },
    {
      title: "X Developer: Cards markup",
      url: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
    },
  ],
};
