import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "canonical-tag",
  lang: "en",
  title: "Canonical Tags: How to Handle Duplicate URLs",
  description:
    "When one page opens at several URLs, Google picks one. How to declare it with a canonical tag, common mistakes, and when to redirect instead.",
  publishedAt: "2026-11-12",
  hub: "indexing",
  summary: [
    "A canonical tag tells search engines \"the preferred URL for this page is this one\". It is one line in `<head>`: `<link rel=\"canonical\" href=\"full URL\">`.",
    "More sites have duplicate URLs than you would think. http vs https, www vs non-www, a trailing slash, or a tracking parameter all make a different URL to Google. Canonical is the easiest way to say which one to index.",
  ],
  sections: [
    {
      heading: "Where duplicate URLs come from",
      blocks: [
        {
          type: "p",
          text: "To a person these are the same page, but different URL strings are different pages to a search engine. On most sites, all of the following show the same content.",
        },
        {
          type: "code",
          text: "https://example.com/shoes\nhttps://www.example.com/shoes\nhttp://example.com/shoes\nhttps://example.com/shoes/\nhttps://example.com/shoes?utm_source=newsletter\nhttps://example.com/shoes?sort=price",
        },
        {
          type: "p",
          text: "When Google finds a cluster like this, it picks one as canonical, shows it in results and hides the rest. The risks are that it picks a URL you didn't want, and that links and signals get split across several URLs.",
        },
      ],
    },
    {
      heading: "How to use it",
      blocks: [
        { type: "code", text: '<link rel="canonical" href="https://example.com/shoes" />' },
        {
          type: "list",
          items: [
            "**Use absolute URLs**: a relative `/shoes` works, but writing out `https://` and the domain removes any chance of misinterpretation.",
            "**Point to yourself**: even pages with no duplicates benefit from a self-referencing canonical, so a version shared with parameters still resolves cleanly.",
            "**One per page**: with two or more canonicals Google may ignore them all. Check for themes and plugins each adding their own.",
            "**Inside `<head>`**: a canonical in `<body>` is ignored.",
          ],
        },
        {
          type: "callout",
          label: "Key point",
          text: "Canonical is a hint, not a command. Google weighs canonical tags, redirects, internal links and sitemaps together. Make all of those point to the same URL.",
        },
      ],
    },
    {
      heading: "Redirect or canonical?",
      blocks: [
        {
          type: "table",
          head: ["Method", "Strength", "When to use it"],
          rows: [
            ["301 redirect", "Strong", "The old URL is no longer needed (http→https, www unification, moved pages)"],
            ["rel=canonical", "Medium", "Both URLs must stay available to users (sort/filter parameters, print versions)"],
            ["Only canonical URLs in the sitemap", "Weak", "As a supporting signal alongside the others"],
          ],
        },
        {
          type: "p",
          text: "For http/https or www variants, users have no reason to stay on the old URL, so a redirect is the right answer: people and crawlers converge on one address. For a product list that differs only by sort order, users need the URL, so you can't redirect; declare the canonical instead.",
        },
      ],
    },
    {
      heading: "Common mistakes",
      blocks: [
        { type: "h3", text: "Every page points to the home page" },
        {
          type: "p",
          text: "Put a single canonical in a shared layout and every page declares the same URL as canonical. Google then treats every other page as a duplicate of home and doesn't index them. Canonicals must be computed per page.",
        },
        { type: "h3", text: "A development domain slips in" },
        {
          type: "p",
          text: "If the site URL comes from an environment variable, production can end up with a staging domain or `localhost` in the canonical. Right after deploying, search the page source for `canonical` and confirm it is the production domain.",
        },
        { type: "h3", text: "Canonical combined with noindex" },
        {
          type: "p",
          text: "\"Another URL is preferred\" (canonical) and \"don't index this page\" (noindex) say different things. Together they send mixed signals. Use canonical to consolidate duplicates and noindex to remove a page; pick one.",
        },
        { type: "h3", text: "Translations pointing to one language" },
        {
          type: "p",
          text: "If the English page's canonical points to the Korean page, the English page drops out of the index. Each language version should be canonical to itself, with hreflang describing the relationship. See [hreflang setup](/en/blog/hreflang).",
        },
      ],
    },
    {
      heading: "See which URL Google chose",
      blocks: [
        {
          type: "p",
          text: "Search Console's URL Inspection shows \"User-declared canonical\" and \"Google-selected canonical\" side by side. If they differ, Google didn't accept your canonical.",
        },
        {
          type: "list",
          items: [
            "Do internal links point to a different URL than the canonical (for example, with a trailing slash)?",
            "Does the sitemap list non-canonical URLs?",
            "Is the canonical target a 404, a redirect, or noindex?",
            "Are the two pages actually near-identical? Google may ignore a canonical between very different pages.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN's Indexing card checks whether a page has a canonical set. Which URL Google actually selected is only visible in Search Console, so check both.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is there a penalty for not having a canonical?",
      a: "No direct penalty; Google chooses one itself. But it may choose a URL you didn't want, or split signals, so a self-referencing canonical is recommended.",
    },
    {
      q: "Can a canonical point to another domain?",
      a: "Yes. When the same article is syndicated to other sites, pointing the canonical at the original is common. Confirm the publisher actually includes it.",
    },
    {
      q: "Should paginated lists all point to page 1?",
      a: "No. Pages 2 and 3 have different content, so each is canonical to itself. Pointing them all to page 1 makes the items deeper in the list harder to discover.",
    },
  ],
  related: ["site-not-on-google", "noindex-check", "sitemap-xml"],
  references: [
    {
      title: "Google Search Central: Consolidate duplicate URLs",
      url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    },
    {
      title: "Google Search Central: What is canonicalization",
      url: "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
    },
    {
      title: "Google Search Central: Redirects and Google Search",
      url: "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
    },
    { title: "RFC 6596: The Canonical Link Relation", url: "https://www.rfc-editor.org/rfc/rfc6596" },
  ],
};
