import { getContent } from "@/app/[lang]/privacy/content";

const testContactEmail = "test@example.com";

// issue #48 domain-migration (scope added mid-dev) — AdSense's program
// policies require disclosing that third parties (including Google) use
// cookies for ad personalization and that visitors can opt out, separately
// from the existing GA4 disclosure. Always shown regardless of whether ads
// are actually active (no env-var gating needed for a policy document).
describe("/privacy AdSense third-party ad cookie disclosure (issue #48)", () => {
  const { ko, en } = getContent(testContactEmail);

  const findThirdPartySection = (
    sections: { heading: string; body: string[] }[]
  ) => sections.find((s) => /third part|제3자/i.test(s.heading));

  it("en: discloses that third parties (incl. Google) use cookies to serve ads", () => {
    const section = findThirdPartySection(en.sections);
    expect(section).toBeDefined();
    const body = section!.body.join(" ");
    expect(body).toMatch(/AdSense|advertis/i);
    expect(body).toMatch(/third[- ]part(y|ies)/i);
    expect(body).toMatch(/cookie/i);
  });

  it("en: links to Google Ad Settings for opting out of personalized ads", () => {
    const section = findThirdPartySection(en.sections);
    const body = section!.body.join(" ");
    expect(body).toMatch(/adssettings\.google\.com/);
    expect(body).toMatch(/opt.?out/i);
  });

  it("ko: 애드센스/제3자 광고 쿠키 사용을 고지한다", () => {
    const section = findThirdPartySection(ko.sections);
    expect(section).toBeDefined();
    const body = section!.body.join(" ");
    expect(body).toMatch(/애드센스|광고/);
    expect(body).toMatch(/제3자/);
    expect(body).toMatch(/쿠키/);
  });

  it("ko: 구글 광고 설정(adssettings.google.com) 옵트아웃 링크를 안내한다", () => {
    const section = findThirdPartySection(ko.sections);
    const body = section!.body.join(" ");
    expect(body).toMatch(/adssettings\.google\.com/);
    expect(body).toMatch(/거부|옵트아웃/);
  });
});
