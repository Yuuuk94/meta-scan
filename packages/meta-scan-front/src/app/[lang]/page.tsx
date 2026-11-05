import type { Metadata } from "next";
import { getPageMetadata } from "@/services/getPageMetadata";
import { getDictionary } from "@/dictionaries";
import { siteUrl } from "@/constans";
import {
  buildOrganizationSchema,
  buildWebApplicationSchema,
  buildWebSiteSchema,
} from "@/services/buildSiteSchemas";
import { buildFaqSchema } from "@/services/buildFaqSchema";
import { JsonLd } from "@/ui/atoms/JsonLd";
import { FAQSection } from "@/ui/organisms/FAQSection";
import { HeroSection } from "@/ui/organisms/HeroSection";
import { ProcessSection } from "@/ui/organisms/ProcessSection";
import { getSiteSetting } from "@/utils/siteSetting";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang, "seoHome", "");
}

export default async function HomePage() {
  const { theme, lang } = await getSiteSetting();
  const dict = await getDictionary(lang);
  const t = dict.main;
  const schemaInput = {
    lang,
    siteUrl,
    name: dict.seo.siteName,
    description: dict.seo.seoHome.description,
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection theme={theme} lang={lang} t={t} />
      {/* Process Section */}
      <ProcessSection theme={theme} lang={lang} t={t} />
      {/* FAQ Section */}
      <FAQSection theme={theme} lang={lang} t={t} />
      {/* FAQ JSON-LD (issue #11) — only rendered here, on HomePage, since
       * FAQSection is the only place this FAQ data appears. */}
      <JsonLd data={buildFaqSchema(t)} />
      {/* issue #64 — site-level structured data (home only) */}
      <JsonLd data={buildWebApplicationSchema(schemaInput)} />
      <JsonLd data={buildWebSiteSchema(schemaInput)} />
      <JsonLd data={buildOrganizationSchema(schemaInput)} />
    </>
  );
}
