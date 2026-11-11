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
import { CheckGroupsSection } from "@/ui/organisms/CheckGroupsSection";
import { LatestPostsSection } from "@/ui/organisms/LatestPostsSection";
import { getPost, getPosts } from "@/services/blogPosts";
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

  // issue #76 — each check group links to its hub guide when it exists.
  const hubSlugs = ["title-description", "site-not-on-google", "og-tags-preview", "ai-search-citation", "", "hreflang", "lighthouse-score"];
  const checkGroups = hubSlugs.map((slug, i) => ({
    title: (t as Record<string, string>)[`checkGroup${i + 1}Title`],
    body: (t as Record<string, string>)[`checkGroup${i + 1}Body`],
    href: slug && getPost(lang, slug) ? `/${lang}/blog/${slug}` : undefined,
  }));

  return (
    <>
      {/* Hero Section */}
      <HeroSection theme={theme} lang={lang} t={t} />
      {/* Process Section */}
      <ProcessSection theme={theme} lang={lang} t={t} />
      <CheckGroupsSection
        title={t.checkGroupsTitle as string}
        linkLabel={t.checkGroupsLink as string}
        groups={checkGroups}
      />
      <LatestPostsSection
        lang={lang}
        title={t.latestPostsTitle as string}
        moreLabel={t.latestPostsMore as string}
        posts={getPosts(lang)}
      />
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
