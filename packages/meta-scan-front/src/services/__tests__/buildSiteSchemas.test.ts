import {
  buildOrganizationSchema,
  buildWebApplicationSchema,
  buildWebSiteSchema,
} from "@/services/buildSiteSchemas";

const input = {
  lang: "en" as const,
  siteUrl: "https://meta-scan.biz",
  name: "META_SCAN.BIZ",
  description: "desc",
};

describe("site JSON-LD builders (issue #64)", () => {
  it("WebApplication has required fields, free offer and inLanguage", () => {
    expect(buildWebApplicationSchema(input)).toEqual({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "META_SCAN.BIZ",
      url: "https://meta-scan.biz/en",
      description: "desc",
      applicationCategory: "WebApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      inLanguage: "en",
    });
  });

  it("WebSite carries name/url/inLanguage", () => {
    expect(buildWebSiteSchema(input)).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "META_SCAN.BIZ",
      url: "https://meta-scan.biz/en",
      inLanguage: "en",
    });
  });

  it("Organization carries name/url/logo", () => {
    expect(buildOrganizationSchema(input)).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "META_SCAN.BIZ",
      url: "https://meta-scan.biz",
      logo: "https://meta-scan.biz/og.png",
    });
  });
});
