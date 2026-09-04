import { getContent } from "@/app/[lang]/privacy/content";

const testContactEmail = "test@example.com";

// issue #19 analytics-integration — the privacy page previously claimed no
// analytics data is shared with third parties at all. Now that GA4 is
// wired in (gated on consent), that section must be updated to disclose it
// instead of contradicting it, in both languages.
describe("/privacy third-party sharing disclosure (issue #19)", () => {
  const { ko, en } = getContent(testContactEmail);

  const findThirdPartySection = (sections: { heading: string; body: string[] }[]) =>
    sections.find((s) => /third part|제3자/i.test(s.heading));

  it("en: no longer flatly denies sharing analytics data with third parties", () => {
    const section = findThirdPartySection(en.sections);
    expect(section).toBeDefined();
    const body = section!.body.join(" ");
    expect(body).not.toMatch(/don't share.*analytics/i);
  });

  it("en: discloses GA4 + Google + opt-in/opt-out via the consent banner", () => {
    const section = findThirdPartySection(en.sections);
    const body = section!.body.join(" ");
    expect(body).toMatch(/Google Analytics|GA4/);
    expect(body).toMatch(/Google/);
    expect(body).toMatch(/consent/i);
  });

  it("ko: discloses GA4 + Google + 동의 배너를 통한 옵트인/옵트아웃", () => {
    const section = findThirdPartySection(ko.sections);
    const body = section!.body.join(" ");
    expect(body).toMatch(/Google Analytics|GA4/);
    expect(body).toMatch(/Google/);
    expect(body).toMatch(/동의/);
  });
});
