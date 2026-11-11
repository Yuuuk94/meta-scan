import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "lighthouse-score",
  lang: "ko",
  title: "Lighthouse 점수 올리는 순서: 성능부터 접근성까지",
  description:
    "Lighthouse 성능 점수는 다섯 개 지표의 가중합입니다. 어떤 지표가 점수를 가장 많이 좌우하는지, 무엇부터 고치면 효과가 큰지, 실험실 점수와 실제 사용자 데이터의 차이까지 정리했습니다.",
  publishedAt: "2026-11-11",
  hub: "lighthouse",
  isHub: true,
  summary: [
    "Lighthouse는 구글이 만든 웹페이지 감사 도구로, 성능·접근성·모범 사례·SEO 네 영역을 0~100점으로 채점합니다. 크롬 개발자 도구, PageSpeed Insights, 그리고 META_SCAN 결과 화면에서 같은 엔진으로 실행됩니다.",
    "성능 점수를 올리는 가장 빠른 길은 가중치가 큰 지표부터 보는 것입니다. 총 차단 시간(TBT), 최대 콘텐츠 페인트(LCP), 레이아웃 이동(CLS) 세 개가 점수의 80%를 차지합니다.",
  ],
  sections: [
    {
      heading: "성능 점수는 어떻게 계산되나",
      blocks: [
        {
          type: "table",
          head: ["지표", "뜻", "가중치"],
          rows: [
            ["TBT (Total Blocking Time)", "메인 스레드가 막혀 입력에 반응하지 못한 시간 합계", "30%"],
            ["LCP (Largest Contentful Paint)", "화면에서 가장 큰 요소(보통 대표 이미지나 제목)가 그려진 시점", "25%"],
            ["CLS (Cumulative Layout Shift)", "로딩 중 화면 요소가 밀려난 정도", "25%"],
            ["FCP (First Contentful Paint)", "첫 글자나 이미지가 그려진 시점", "10%"],
            ["Speed Index", "화면이 채워지는 속도", "10%"],
          ],
        },
        {
          type: "p",
          text: "가중치는 Lighthouse 10 기준입니다. 표에서 보듯 TBT, LCP, CLS 세 개를 잡으면 점수 대부분이 따라옵니다. 반대로 FCP만 아무리 줄여도 점수는 크게 오르지 않습니다.",
        },
      ],
    },
    {
      heading: "1순위: LCP 줄이기",
      blocks: [
        {
          type: "p",
          text: "LCP 요소는 대부분 첫 화면의 대표 이미지입니다. 이 이미지가 늦게 발견되거나, 너무 크거나, 다른 리소스 뒤에 줄 서 있으면 LCP가 늦어집니다.",
        },
        {
          type: "list",
          items: [
            "**대표 이미지는 지연 로딩하지 않기**: 첫 화면 이미지에 `loading=\"lazy\"`를 걸면 오히려 늦어집니다. 대신 `fetchpriority=\"high\"`를 줍니다.",
            "**크기와 형식**: 화면에 표시되는 크기에 맞춰 줄이고 WebP나 AVIF로 바꿉니다. `srcset`으로 기기별 크기를 나눕니다.",
            "**HTML에서 바로 발견되게**: CSS 배경 이미지나 자바스크립트가 나중에 넣는 이미지는 브라우저가 늦게 발견합니다.",
            "**서버 응답 시간**: 첫 HTML이 늦게 오면 모든 지표가 같이 밀립니다. 캐시와 CDN을 확인합니다.",
          ],
        },
      ],
    },
    {
      heading: "2순위: TBT 줄이기",
      blocks: [
        {
          type: "p",
          text: "TBT는 자바스크립트가 메인 스레드를 오래 붙잡고 있을 때 늘어납니다. 프레임워크 기반 사이트에서 점수가 낮은 가장 흔한 원인입니다.",
        },
        {
          type: "list",
          items: [
            "쓰지 않는 자바스크립트를 걷어냅니다. Lighthouse의 \"사용하지 않는 JavaScript 줄이기\" 항목에 파일별 낭비량이 나옵니다.",
            "무거운 라이브러리는 필요한 화면에서만 동적으로 불러옵니다.",
            "광고, 분석, 채팅 위젯 같은 서드파티 스크립트를 `async`나 `defer`로, 혹은 사용자 상호작용 이후로 미룹니다.",
            "서버에서 렌더링할 수 있는 부분은 서버 컴포넌트로 옮겨 클라이언트로 보내는 코드 자체를 줄입니다.",
          ],
        },
        {
          type: "callout",
          label: "경험담",
          text: "제가 실무에서 Lighthouse를 기준으로 서비스를 개선할 때도 가장 효과가 컸던 건 새로운 최적화 기법보다 \"안 쓰는 것을 덜어내는 일\"이었습니다. 번들 분석기로 무엇이 들어 있는지 한 번 보는 것만으로도 고칠 거리가 여럿 나옵니다.",
        },
      ],
    },
    {
      heading: "3순위: CLS 잡기",
      blocks: [
        {
          type: "list",
          items: [
            "이미지와 동영상에 `width`, `height`를 명시해 공간을 미리 확보합니다.",
            "광고·배너처럼 나중에 들어오는 영역은 최소 높이를 지정해 둡니다.",
            "웹폰트가 바뀌며 글자 폭이 달라지는 현상은 `font-display`와 대체 폰트 크기 조정으로 줄입니다.",
            "기존 콘텐츠 위에 새 요소를 끼워 넣지 않습니다. 쿠키 동의 배너는 화면 아래에 고정하는 방식이 안전합니다.",
          ],
        },
      ],
    },
    {
      heading: "접근성·모범 사례·SEO 점수",
      blocks: [
        {
          type: "p",
          text: "나머지 세 영역은 대부분 통과/실패 항목의 묶음이라 고치기만 하면 점수가 바로 오릅니다.",
        },
        {
          type: "table",
          head: ["영역", "자주 걸리는 항목", "해결"],
          rows: [
            ["접근성", "이미지 alt 누락, 낮은 색 대비, 이름 없는 버튼·링크", "alt 텍스트, 대비 4.5:1 이상, aria-label"],
            ["모범 사례", "콘솔 오류, 낮은 해상도 이미지, 오래된 라이브러리", "오류 수정, 적정 해상도 이미지"],
            ["SEO", "meta description 누락, 크롤링 차단, 링크 텍스트가 '여기'", "description 작성, robots 확인, 설명적인 링크 텍스트"],
          ],
        },
        {
          type: "p",
          text: "Lighthouse SEO 점수가 100이어도 검색 노출이 보장되지는 않습니다. 기술적 기본 조건만 확인하는 감사이기 때문입니다. META_SCAN이 Lighthouse 점수와 별도로 색인, 미리보기, AI 신호 카드를 두는 이유입니다.",
        },
      ],
    },
    {
      heading: "점수가 매번 다르게 나오는 이유",
      blocks: [
        {
          type: "p",
          text: "Lighthouse는 실험실(lab) 측정입니다. 실행하는 컴퓨터 성능, 네트워크 상태, 서버 응답 시간에 따라 같은 페이지도 실행할 때마다 몇 점씩 다르게 나옵니다. 하나의 숫자보다 여러 번 실행한 경향을 보세요.",
        },
        {
          type: "list",
          items: [
            "PageSpeed Insights와 META_SCAN은 기본적으로 저사양 모바일 기기와 느린 네트워크를 흉내 내어 측정합니다. 내 노트북 크롬에서 잰 점수보다 낮게 나오는 게 정상입니다.",
            "실제 사용자의 경험은 크롬 사용자 경험 보고서(CrUX)의 현장(field) 데이터로 봅니다. 서치콘솔의 Core Web Vitals 보고서가 이 데이터입니다.",
            "현장 기준 '좋음'은 LCP 2.5초 이하, INP 200밀리초 이하, CLS 0.1 이하입니다. INP는 실험실에서 측정할 수 없어 TBT가 대신 참고 지표 역할을 합니다.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Lighthouse 점수가 검색 순위에 직접 반영되나요?",
      a: "Lighthouse 점수 자체는 순위 요소가 아닙니다. 구글은 실제 사용자 데이터 기반의 Core Web Vitals를 페이지 경험 신호 중 하나로 쓰는데, 그 비중은 콘텐츠 관련성보다 작습니다.",
    },
    {
      q: "100점을 목표로 해야 하나요?",
      a: "아니요. 성능은 90점 이상이면 '좋음' 구간입니다. 그 이상은 들이는 노력에 비해 실제 사용자 체감 차이가 작습니다. 실패 항목이 있는 접근성과 SEO를 먼저 정리하는 편이 효과가 큽니다.",
    },
    {
      q: "데스크톱과 모바일 점수 중 무엇을 봐야 하나요?",
      a: "구글은 모바일 버전을 기준으로 색인하므로 모바일 점수를 우선 보세요. 모바일에서 좋으면 데스크톱은 대체로 따라옵니다.",
    },
  ],
  related: ["seo-aeo-geo", "heading-structure", "title-description"],
  references: [
    {
      title: "Chrome for Developers: Lighthouse 성능 점수 계산",
      url: "https://developer.chrome.com/docs/lighthouse/performance/performance-scoring",
    },
    { title: "web.dev: Core Web Vitals", url: "https://web.dev/articles/vitals" },
    { title: "web.dev: LCP 최적화", url: "https://web.dev/articles/optimize-lcp" },
    { title: "web.dev: CLS 최적화", url: "https://web.dev/articles/optimize-cls" },
    { title: "PageSpeed Insights", url: "https://pagespeed.web.dev/" },
  ],
};
