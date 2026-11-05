import type { Metadata } from "next";
import { allowLanguages, defaultLang } from "@/constans";

export interface PageSeo {
  title: string;
  description: string;
  siteName: string;
}

interface Input {
  lang: Language;
  /** Language used for canonical/x-default targets (bare "/" -> default). */
  canonicalLang?: Language;
  /** Route after the locale prefix: "" (home) or "/privacy" etc. */
  path: string;
  seo: PageSeo;
  siteUrl: string | undefined;
}

const ogLocale: Record<Language, string> = { ko: "ko_KR", en: "en_US" };

// issue #64 — per-page, per-locale metadata (title/description/OG/Twitter +
// canonical/hreflang). Copy comes from dictionaries' `seo` entries.
export function buildPageMetadata({
  lang,
  canonicalLang = lang,
  path,
  seo,
  siteUrl,
}: Input): Metadata {
  const { title, description, siteName } = seo;
  const image = `${siteUrl}/og.png`;
  const languages: Record<string, string> = {};
  for (const l of allowLanguages) languages[l] = `${siteUrl}/${l}${path}`;
  languages["x-default"] = `${siteUrl}/${defaultLang}${path}`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/${canonicalLang}${path}`, languages },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}${path}`,
      locale: ogLocale[lang],
      siteName,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
