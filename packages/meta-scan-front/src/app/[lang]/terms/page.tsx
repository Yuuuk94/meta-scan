import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";
import { NumberLabel } from "@/components/ui/number-label";

const lastUpdated = "2026-08-13";

const content: Record<
  Language,
  { lead: string; sections: { heading: string; body: string[] }[] }
> = {
  ko: {
    lead: "이 약관은 Meta-Scan(이하 '서비스')을 이용할 때 적용된다. 서비스를 이용하면 아래 내용에 동의한 것으로 간주한다.",
    sections: [
      {
        heading: "서비스 소개",
        body: [
          "Meta-Scan은 입력한 URL의 메타 태그, robots.txt, sitemap, Lighthouse(성능·SEO·접근성·모범사례) 결과를 보여주는 무료 진단 도구다.",
          "서비스는 현재 베타 단계로 운영되며, 계정 가입이나 결제 없이 이용할 수 있다.",
        ],
      },
      {
        heading: "허용되는 이용",
        body: [
          "본인이 소유했거나 스캔 권한이 있는 사이트를 대상으로 서비스를 이용하라.",
          "서비스나 인프라에 과도한 부하를 주는 자동화된 대량 요청, 취약점 탐색 목적의 스캔은 허용되지 않는다.",
        ],
      },
      {
        heading: "면책 조항",
        body: [
          "스캔 결과(점수, 진단 항목)는 참고용 정보이며 정확성·완전성을 보장하지 않는다. 실제 SEO·성능 개선 여부는 별도로 검증하라.",
          "서비스는 '있는 그대로(as-is)' 제공되며, 특정 목적에 대한 적합성을 보증하지 않는다.",
        ],
      },
      {
        heading: "서비스 변경 및 중단",
        body: [
          "베타 서비스 특성상 사전 고지 없이 기능이 추가, 변경, 중단될 수 있다.",
          "서버 부하나 장애로 일부 스캔이 실패할 수 있으며, 이 경우 재시도를 안내한다.",
        ],
      },
      {
        heading: "책임의 제한",
        body: [
          "서비스 이용 또는 이용 불가로 발생하는 간접적·부수적 손해에 대해 서비스 운영자는 법이 허용하는 한도 내에서 책임을 지지 않는다.",
        ],
      },
      {
        heading: "약관 변경",
        body: [
          "약관 내용은 서비스 개선에 따라 변경될 수 있으며, 변경 시 이 페이지 상단의 최종 수정일이 업데이트된다.",
        ],
      },
      {
        heading: "문의",
        body: ["약관에 대한 문의는 legal@meta-scan.dev로 연락하라."],
      },
    ],
  },
  en: {
    lead: "These terms apply when you use Meta-Scan (the \"service\"). By using the service, you agree to the terms below.",
    sections: [
      {
        heading: "About the service",
        body: [
          "Meta-Scan is a free diagnostic tool that shows meta tags, robots.txt, sitemap, and Lighthouse (performance, SEO, accessibility, best practices) results for a URL you provide.",
          "The service currently runs in beta and doesn't require an account or payment.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Please only scan sites you own or have permission to scan.",
          "Automated bulk requests that place excessive load on the service or infrastructure, and scans intended to probe for vulnerabilities, aren't permitted.",
        ],
      },
      {
        heading: "Disclaimer",
        body: [
          "Scan results (scores, diagnostic items) are informational and aren't guaranteed to be accurate or complete. Verify any SEO or performance changes independently before relying on them.",
          "The service is provided \"as is\" without warranties of fitness for a particular purpose.",
        ],
      },
      {
        heading: "Changes and availability",
        body: [
          "Being a beta service, features may be added, changed, or removed without prior notice.",
          "Some scans may fail due to server load or outages; when that happens, we'll suggest retrying.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "To the extent permitted by law, the service operator isn't liable for indirect or incidental damages arising from your use of, or inability to use, the service.",
        ],
      },
      {
        heading: "Changes to these terms",
        body: [
          "These terms may change as the service evolves. The \"last updated\" date at the top of this page reflects the most recent revision.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about these terms can be sent to legal@meta-scan.dev."],
      },
    ],
  },
};

export default async function TermsPage() {
  const { lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).legal;
  const { lead, sections } = content[lang];

  return (
    <div className="content-frame py-16">
      <article className="max-w-3xl">
        <h1 className="font-display text-4xl font-black text-foreground">
          {t.termsTitle}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {t.updated}: {lastUpdated}
        </p>

        <p className="mt-10 max-w-2xl text-foreground-secondary">{lead}</p>

        <div className="mt-10 flex flex-col">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              className="flex gap-4 border-b-[1.5px] border-border py-5 last:border-none sm:gap-5 sm:py-6"
            >
              <NumberLabel
                value={index + 1}
                className="w-8 shrink-0 text-xl sm:w-11 sm:text-2xl"
              />
              <div>
                <h2 className="mb-3 text-[15px] font-bold text-foreground">
                  {section.heading}
                </h2>
                <div className="space-y-2.5">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-relaxed text-foreground-secondary"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
