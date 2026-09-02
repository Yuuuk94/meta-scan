export const getContent = (
  contactEmail: string,
): Record<Language, { lead: string; sections: { heading: string; body: string[] }[] }> => ({
  ko: {
    lead: "이 약관은 Meta-Scan(이하 '서비스')을 이용할 때 적용됩니다. 서비스를 이용하면 아래 내용에 동의한 것으로 간주합니다.",
    sections: [
      {
        heading: "서비스 소개",
        body: [
          "Meta-Scan은 입력한 URL의 메타 태그, robots.txt, sitemap, Lighthouse 결과를 보여주는 무료 진단 도구이며, 현재 베타 단계로 계정 가입이나 결제 없이 이용할 수 있습니다.",
        ],
      },
      {
        heading: "이용 시 유의사항",
        body: [
          "본인이 소유했거나 스캔 권한이 있는 사이트만 스캔해 주세요. 스캔 결과는 참고용 정보이며, 서비스는 '있는 그대로' 제공되어 정확성·완전성을 보장하지 않습니다.",
        ],
      },
      {
        heading: "서비스 변경 및 책임 제한",
        body: [
          "베타 서비스 특성상 사전 고지 없이 기능이 바뀌거나 중단될 수 있으며, 서비스 이용으로 발생하는 간접적 손해에 대해 법이 허용하는 한도 내에서 책임지지 않습니다.",
        ],
      },
      {
        heading: "약관 변경 및 문의",
        body: [
          `약관은 서비스 개선에 따라 변경될 수 있으며, 문의는 ${contactEmail}으로 연락해 주세요.`,
        ],
      },
    ],
  },
  en: {
    lead: "These terms apply when you use Meta-Scan (the \"service\"). By using the service, you agree to the terms below.",
    sections: [
      {
        heading: "About the service",
        body: [
          "Meta-Scan is a free diagnostic tool that shows meta tags, robots.txt, sitemap, and Lighthouse results for a URL you provide. It currently runs in beta and doesn't require an account or payment.",
        ],
      },
      {
        heading: "Using the service",
        body: [
          "Please only scan sites you own or have permission to scan. Results are informational, and the service is provided \"as is\" without guarantees of accuracy or completeness.",
        ],
      },
      {
        heading: "Changes & limitation of liability",
        body: [
          "Being a beta service, features may be added, changed, or removed without prior notice, and to the extent permitted by law we aren't liable for indirect damages arising from your use of the service.",
        ],
      },
      {
        heading: "Changes to these terms & contact",
        body: [
          `These terms may change as the service evolves. Questions can be sent to ${contactEmail}.`,
        ],
      },
    ],
  },
});
