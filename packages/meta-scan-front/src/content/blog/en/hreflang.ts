import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "hreflang",
  lang: "en",
  title: "hreflang Setup and SEO for Multilingual Sites",
  description:
    "hreflang links language versions so search engines show the right one. Syntax, x-default, return links, and the cookie-based language trap.",
  publishedAt: "2026-11-12",
  hub: "i18n",
  isHub: true,
  summary: [
    "hreflang tells search engines \"the Korean version of this page is here and the English version is here\". Google then shows Korean speakers the Korean page and English speakers the English one.",
    "The key prerequisite is that **each language has its own URL**. If one URL switches language based on a cookie or browser setting, search engines only ever see one language and hreflang has nothing to work with.",
  ],
  sections: [
    {
      heading: "How to write it",
      blocks: [
        {
          type: "p",
          text: "The most common method is `link` tags in each page's `<head>`. Every language version must carry the same complete list, **including itself**.",
        },
        {
          type: "code",
          text: '<!-- identical on /ko/blog/robots-txt and /en/blog/robots-txt -->\n<link rel="alternate" hreflang="ko" href="https://example.com/ko/blog/robots-txt" />\n<link rel="alternate" hreflang="en" href="https://example.com/en/blog/robots-txt" />\n<link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/robots-txt" />',
        },
        {
          type: "table",
          head: ["Method", "Advantage", "Good for"],
          rows: [
            ["HTML link tags", "Simplest, easy to check in source", "Most websites"],
            ["HTTP Link header", "Works for non-HTML files", "PDFs and other documents"],
            ["Sitemap xhtml:link", "No changes to page HTML", "Very large sites"],
          ],
        },
        {
          type: "p",
          text: "Use one method. Mixing them makes maintenance harder and invites conflicting information.",
        },
      ],
    },
    {
      heading: "Language and region codes",
      blocks: [
        {
          type: "list",
          items: [
            "Language: ISO 639-1 two-letter codes such as `ko`, `en`, `ja`",
            "Region, when needed: add an ISO 3166-1 two-letter country code, as in `en-US`, `en-GB`, `zh-TW`",
            "A country code can't stand alone: `kr` is wrong, `ko-KR` is right",
            "Classic typos: Korean is `ko`, not `kr`; the UK is `en-GB`, not `en-UK`",
          ],
        },
        {
          type: "p",
          text: "`x-default` is the page to show when no version matches the user's language: a language picker or the most general version (often English). It is optional but makes your intent explicit.",
        },
      ],
    },
    {
      heading: "The most common mistake: no return link",
      blocks: [
        {
          type: "p",
          text: "If the Korean page points to the English page, the English page must point back. One-way annotations are ignored. This stops other sites from claiming your page as their translation.",
        },
        {
          type: "table",
          head: ["Mistake", "Result"],
          rows: [
            ["Linked in one direction only", "The whole pairing is ignored"],
            ["Page leaves itself out of the list", "Flagged by some tools; not the recommended form"],
            ["hreflang URL redirects or 404s", "That language link is ignored"],
            ["All language versions canonical to one language", "The other language pages drop out of the index"],
          ],
        },
        {
          type: "callout",
          label: "Key point",
          text: "Each language version should be canonical to itself. Canonical means \"the preferred URL for the same content\", and a translation is different content. See [canonical tags](/en/blog/canonical-tag).",
        },
      ],
    },
    {
      heading: "The cookie and auto-redirect trap",
      blocks: [
        {
          type: "p",
          text: "Many sites switch language automatically based on IP, the browser's Accept-Language header or a cookie. Convenient for users, but a problem for search engines: Googlebot mostly crawls from the US, without a language preference and without cookies.",
        },
        {
          type: "callout",
          label: "Real example",
          text: "META_SCAN originally picked the language from a cookie, not the URL. Visiting `/en` with a Korean cookie showed Korean, so to a search engine `/ko` and `/en` were duplicates of each other. Now the language in the URL always wins, and the cookie only decides where to send a first-time visitor.",
        },
        {
          type: "list",
          items: [
            "A language URL always shows that language. The URL decides.",
            "Auto-redirect only from a language-neutral root (`/`), never from a URL that already has a language.",
            "Offer a banner such as \"이 페이지는 한국어로도 볼 수 있어요\" or a language switcher instead.",
          ],
        },
      ],
    },
    {
      heading: "Translation quality and thin pages",
      blocks: [
        {
          type: "p",
          text: "hreflang only links translations; whether a translation deserves indexing is a separate question. Unedited machine translation can be judged low quality. Also avoid listing empty pages in one language for content that only exists in another.",
        },
        {
          type: "p",
          text: "That is why META_SCAN kept its English blog index noindex until English articles existed, and only links language versions that actually exist for each post.",
        },
      ],
    },
    {
      heading: "How to verify",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Search each language page's source for `hreflang` and confirm the full list is identical on every version.",
            "Open each URL in the list and confirm it returns 200 in the right language. Use a private window without cookies.",
            "In Search Console URL Inspection, check that the Google-selected canonical for the English page is the English page itself.",
            "META_SCAN's i18n & UX card checks whether hreflang is present along with the mobile viewport setting.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Isn't the html lang attribute enough?",
      a: "Google barely uses `<html lang>` and detects language from the content. Links between translations can only be expressed with hreflang. Still set lang correctly, since screen readers and browser translation use it.",
    },
    {
      q: "My site is in one language. Do I need hreflang?",
      a: "No. hreflang only matters when the same content exists in other languages or for other regions.",
    },
    {
      q: "Does Bing use hreflang?",
      a: "Bing relies more on the content-language meta tag and the html lang attribute than on hreflang. Setting hreflang for Google plus a correct lang attribute covers both.",
    },
  ],
  related: ["canonical-tag", "sitemap-xml", "title-description"],
  references: [
    {
      title: "Google Search Central: Tell Google about localized versions of your page",
      url: "https://developers.google.com/search/docs/specialty/international/localized-versions",
    },
    {
      title: "Google Search Central: Managing multi-regional and multilingual sites",
      url: "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
    },
    {
      title: "Google Search Central: How Google crawls locale-adaptive pages",
      url: "https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages",
    },
    { title: "ISO 639 language codes (Library of Congress)", url: "https://www.loc.gov/standards/iso639-2/php/code_list.php" },
  ],
};
