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
  /** Locales this page exists in (default: all). Issue #76 — Korean-only posts. */
  languages?: Language[];
  /** Thin tool screens are kept out of the index (issue #76). */
  noindex?: boolean;
  ogType?: "website" | "article";
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
  languages: available = allowLanguages as Language[],
  noindex = false,
  ogType = "website",
}: Input): Metadata {
  const { title, description, siteName } = seo;
  const image = `${siteUrl}/og.png`;
  const languages: Record<string, string> = {};
  for (const l of available) languages[l] = `${siteUrl}/${l}${path}`;
  const xDefault = available.includes(defaultLang) ? defaultLang : available[0];
  languages["x-default"] = `${siteUrl}/${xDefault}${path}`;

  return {
    title,
    description,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: `${siteUrl}/${canonicalLang}${path}`, languages },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}${path}`,
      locale: ogLocale[lang],
      siteName,
      type: ogType,
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
