import type { Metadata } from "next";
import { allowLanguages, defaultLang, siteUrl } from "@/constans";
import { getDictionary } from "@/dictionaries";
import { buildPageMetadata } from "@/services/buildPageMetadata";

export type SeoPageKey =
  | "seoHome"
  | "seoRequestScan"
  | "seoScan"
  | "seoPrivacy"
  | "seoTerms"
  | "seoAbout"
  | "seoBlog";

// issue #76 — tool screens with no standalone content stay out of the index.
const noindexKeys: SeoPageKey[] = ["seoRequestScan", "seoScan"];

// issue #64 — shared by every page's generateMetadata: resolves the locale
// from the route param (URL is the source of truth), pulls copy from the
// dictionary's `seo` entries and builds the metadata.
export async function getPageMetadata(
  rawLang: string,
  key: SeoPageKey,
  path: string,
  canonicalLang?: Language,
): Promise<Metadata> {
  const lang = (allowLanguages.includes(rawLang) ? rawLang : defaultLang) as Language;
  const { seo } = await getDictionary(lang);
  return buildPageMetadata({
    lang,
    canonicalLang,
    path,
    seo: { ...seo[key], siteName: seo.siteName },
    siteUrl,
    noindex: noindexKeys.includes(key),
  });
}
