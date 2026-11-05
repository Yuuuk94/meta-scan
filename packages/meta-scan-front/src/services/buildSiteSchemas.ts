// issue #64 — home-page JSON-LD builders (WebApplication / WebSite /
// Organization), same pure-function pattern as buildFaqSchema.
interface Input {
  lang: Language;
  siteUrl: string | undefined;
  name: string;
  description: string;
}

const context = "https://schema.org";

export function buildWebApplicationSchema({ lang, siteUrl, name, description }: Input) {
  return {
    "@context": context,
    "@type": "WebApplication",
    name,
    url: `${siteUrl}/${lang}`,
    description,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    inLanguage: lang,
  };
}

export function buildWebSiteSchema({ lang, siteUrl, name }: Input) {
  return {
    "@context": context,
    "@type": "WebSite",
    name,
    url: `${siteUrl}/${lang}`,
    inLanguage: lang,
  };
}

export function buildOrganizationSchema({ siteUrl, name }: Input) {
  return {
    "@context": context,
    "@type": "Organization",
    name,
    url: siteUrl,
    logo: `${siteUrl}/og.png`,
  };
}
