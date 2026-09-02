import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";
import { NumberLabel } from "@/ui/atoms/NumberLabel";

const lastUpdated = "2026-08-13";

export const content: Record<
  Language,
  { lead: string; sections: { heading: string; body: string[] }[] }
> = {
  ko: {
    lead: "Meta-Scan은 웹사이트 URL을 입력받아 메타 태그, robots.txt, sitemap, Lighthouse 진단 결과를 보여주는 무료 진단 도구입니다. 이 문서는 서비스를 이용할 때 어떤 정보가 오가는지 설명합니다.",
    sections: [
      {
        heading: "수집하는 정보",
        body: [
          "회원가입이나 로그인 없이 서비스를 이용할 수 있으며, 별도의 계정 정보를 수집하지 않습니다.",
          "스캔을 요청하면 입력한 URL을 서버가 직접 요청(HEAD/GET, 헤드리스 브라우저 로드)해 메타 태그, robots.txt, sitemap, Lighthouse 점수를 확인합니다. 이 과정에서 입력한 URL 자체가 서버로 전달됩니다.",
          "브라우저에는 세 가지 쿠키만 저장됩니다: 화면 테마(theme), 언어 설정(lang), 마지막으로 요청한 스캔 URL(crrUrl). 모두 개인을 식별하지 않는 환경설정 값입니다.",
        ],
      },
      {
        heading: "정보 보관 기간",
        body: [
          "스캔 결과는 현재 데이터베이스에 저장되지 않는 무상태(stateless) 방식으로 처리됩니다. 서버가 재시작되면 그동안의 처리 내역도 함께 사라집니다.",
          "쿠키는 브라우저에만 저장되며, 브라우저 설정에서 언제든 직접 삭제할 수 있습니다.",
        ],
      },
      {
        heading: "제3자 제공",
        body: [
          "수집한 정보를 광고, 마케팅, 분석 목적으로 제3자에게 판매하거나 공유하지 않습니다.",
          "스캔 대상 URL은 Lighthouse 실행을 위해 서버 내 Chrome 프로세스로만 전달되며, 외부 분석·광고 서비스로 전송되지 않습니다.",
        ],
      },
      {
        heading: "쿠키",
        body: [
          "theme — 다크/라이트 모드 선택값을 기억합니다.",
          "lang — 한국어/영어 중 선택한 언어를 기억합니다.",
          "crrUrl — 스캔을 요청한 URL을 다음 화면(진행 상황, 결과)으로 전달하는 데 사용됩니다.",
        ],
      },
      {
        heading: "이용자의 권리",
        body: [
          "브라우저 설정에서 쿠키를 삭제하면 이 서비스가 저장한 값도 함께 삭제됩니다.",
          "본인이 소유하거나 스캔 권한이 없는 사이트의 스캔으로 인한 책임은 요청한 이용자에게 있습니다.",
        ],
      },
      {
        heading: "문의",
        body: [
          "이 정책에 대한 문의는 privacy@meta-scan.dev로 연락해 주세요. (서비스가 베타 단계인 만큼 연락처는 변경될 수 있습니다.)",
        ],
      },
      {
        heading: "정책 변경",
        body: [
          "서비스 기능이 바뀌면 이 문서도 함께 갱신됩니다. 변경 시 이 페이지 상단의 최종 수정일이 업데이트됩니다.",
        ],
      },
    ],
  },
  en: {
    lead: "Meta-Scan is a free diagnostic tool that scans a website URL and shows its meta tags, robots.txt, sitemap, and Lighthouse audit results. This document explains what information moves through the service while you use it.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "You can use the service without creating an account or signing in — we don't collect account information.",
          "When you request a scan, the server fetches the URL you entered directly (HEAD/GET requests, and a headless browser load) to read its meta tags, robots.txt, sitemap, and Lighthouse scores. The URL itself is sent to our server in this process.",
          "Only three cookies are stored in your browser: display theme (theme), language (lang), and the last scan URL you requested (crrUrl). None of these identify you personally.",
        ],
      },
      {
        heading: "How long we keep information",
        body: [
          "Scan results are currently processed statelessly and are not written to a database. Restarting the server clears any in-flight processing state.",
          "Cookies live only in your browser and can be cleared at any time from your browser settings.",
        ],
      },
      {
        heading: "Sharing with third parties",
        body: [
          "We don't sell or share collected information with third parties for advertising, marketing, or analytics.",
          "The URL you scan is only passed to a Chrome process running on our server to execute Lighthouse — it isn't sent to any external analytics or advertising service.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "theme — remembers your dark/light mode choice.",
          "lang — remembers whether you're using Korean or English.",
          "crrUrl — carries the URL you requested a scan for into the next screen (progress, then results).",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Clearing cookies in your browser removes the values this service has stored.",
          "You're responsible for scans you request against sites you don't own or don't have permission to scan.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions about this policy can be sent to privacy@meta-scan.dev. (The service is in beta, so this contact may change.)",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "This document is updated whenever the service's data handling changes. The \"last updated\" date at the top of this page reflects the most recent revision.",
        ],
      },
    ],
  },
};

export default async function PrivacyPage() {
  const { lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).legal;
  const { lead, sections } = content[lang];

  return (
    <div className="content-frame py-16">
      <article className="max-w-3xl">
        <h1 className="font-display text-4xl font-black text-foreground">
          {t.privacyTitle}
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
