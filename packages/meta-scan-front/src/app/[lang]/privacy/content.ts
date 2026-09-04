export const getContent = (
  contactEmail: string,
): Record<Language, { lead: string; sections: { heading: string; body: string[] }[] }> => ({
  ko: {
    lead: "Meta-Scan은 회원가입 없이 URL을 스캔해 결과를 보여주는 무료 도구입니다. 이 문서는 그 과정에서 어떤 정보가 오가는지 간단히 설명합니다.",
    sections: [
      {
        heading: "수집하는 정보",
        body: [
          "계정 정보는 수집하지 않습니다. 스캔을 요청하면 입력한 URL을 서버가 직접 확인하며, 브라우저에는 테마·언어·최근 스캔 URL 3가지 쿠키만 저장됩니다(개인 식별 정보 아님).",
        ],
      },
      {
        heading: "보관 및 제3자 제공",
        body: [
          "스캔 결과는 데이터베이스에 저장하지 않는 무상태 방식으로 처리되며, 수집한 정보를 광고·마케팅 목적으로 제3자에게 판매하지 않습니다.",
          "다만 방문자가 이 사이트를 어떻게 이용하는지 파악하기 위해 Google Analytics(GA4)를 사용하며, 이 경우 개인을 식별하지 않는 익명화된 집계 데이터가 Google에 전달됩니다. 이 데이터 수집은 화면 하단의 쿠키 동의 배너를 통해 언제든 동의하거나 거부(옵트인/옵트아웃)할 수 있으며, 거부하면 Google Analytics 스크립트 자체가 로드되지 않습니다.",
        ],
      },
      {
        heading: "쿠키 관리 및 문의",
        body: [
          `쿠키는 브라우저 설정에서 언제든 직접 삭제할 수 있습니다. 이 정책에 대한 문의는 ${contactEmail}으로 연락해 주세요.`,
        ],
      },
    ],
  },
  en: {
    lead: "Meta-Scan is a free tool that scans a URL and shows the results without requiring an account. This document briefly explains what information moves through that process.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We don't collect account information. When you request a scan, the server fetches the URL you entered directly, and your browser stores only three cookies — theme, language, and your last scan URL — none of which identify you personally.",
        ],
      },
      {
        heading: "Retention & third parties",
        body: [
          "Scan results are processed statelessly and aren't written to a database, and we don't sell collected information to third parties for advertising or marketing.",
          "We do use Google Analytics (GA4) to understand how visitors use this site; this shares anonymized, aggregate data with Google, without identifying you personally. You can opt in or opt out of this at any time via the cookie consent banner at the bottom of the page — declining means the Google Analytics script never loads at all.",
        ],
      },
      {
        heading: "Managing cookies & contact",
        body: [
          `You can clear these cookies at any time from your browser settings. Questions about this policy can be sent to ${contactEmail}.`,
        ],
      },
    ],
  },
});
