import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "sitemap-xml",
  lang: "en",
  title: "How to Create and Submit a sitemap.xml",
  description:
    "A sitemap tells search engines which pages exist. Format, what to include and leave out, size limits, and submitting to Google and Bing.",
  publishedAt: "2026-11-12",
  hub: "indexing",
  summary: [
    "sitemap.xml is an XML file that tells search engines \"these are the URLs on my site\". Google can find pages by following links without one, but new sites with few external links and large sites get discovered more slowly.",
    "What matters more than having the file is **what goes in it**. List only the canonical URLs you want in search results; leave out noindex pages, redirecting URLs and duplicates.",
  ],
  sections: [
    {
      heading: "Basic format",
      blocks: [
        {
          type: "p",
          text: "Sitemaps follow the protocol defined at sitemaps.org. The simplest form is a `<url>` with a single `<loc>`. `<lastmod>` (last modified date) is optional but helps when it is accurate.",
        },
        {
          type: "code",
          text: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://yourdomain.com/</loc>\n    <lastmod>2026-11-01</lastmod>\n  </url>\n  <url>\n    <loc>https://yourdomain.com/blog/first-post</loc>\n    <lastmod>2026-11-10</lastmod>\n  </url>\n</urlset>',
        },
        {
          type: "table",
          head: ["Tag", "Required", "Does Google use it?"],
          rows: [
            ["loc", "Yes", "Yes. Must be a full URL starting with `https://`"],
            ["lastmod", "No", "Yes, if it is consistently accurate"],
            ["changefreq", "No", "Ignored"],
            ["priority", "No", "Ignored"],
          ],
        },
        {
          type: "p",
          text: "Many generators add `changefreq` and `priority` by default, but Google says it ignores them. They don't hurt, but don't spend time on them. On the other hand, stamping every page's `lastmod` with the build time destroys trust in it; use the date the content actually changed.",
        },
      ],
    },
    {
      heading: "What to include and what to leave out",
      blocks: [
        {
          type: "p",
          text: "A sitemap is a list that says \"please index these URLs\". Mixing in URLs you don't want indexed sends conflicting signals, which is why Search Console shows warnings like \"Submitted URL marked 'noindex'\".",
        },
        {
          type: "table",
          head: ["Include", "Leave out"],
          rows: [
            ["Home, key feature pages, blog posts", "Pages with noindex"],
            ["Canonical URLs that point to themselves", "URLs that redirect elsewhere"],
            ["Each language's canonical URL on multilingual sites", "Search, filter and sort parameter URLs"],
            ["Pages viewable without logging in", "Login, account and checkout pages"],
          ],
        },
        {
          type: "callout",
          label: "Real example",
          text: "META_SCAN's sitemap originally included the scan progress and result screens. Those are tool screens that only mean something once a URL is entered, so on their own they have almost no content. They now carry noindex and are out of the sitemap.",
        },
      ],
    },
    {
      heading: "Size limits and sitemap index files",
      blocks: [
        {
          type: "p",
          text: "A single sitemap can hold up to 50,000 URLs and 50 MB uncompressed. Beyond that, split it into several files and create a sitemap index that lists them; then submit just the index URL.",
        },
        {
          type: "code",
          text: '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>https://yourdomain.com/sitemap-pages.xml</loc>\n  </sitemap>\n  <sitemap>\n    <loc>https://yourdomain.com/sitemap-blog.xml</loc>\n  </sitemap>\n</sitemapindex>',
        },
        {
          type: "p",
          text: "Even on smaller sites, splitting by type lets you see per-group status in Search Console, for example how many blog posts are indexed.",
        },
      ],
    },
    {
      heading: "Generating it in common frameworks",
      blocks: [
        {
          type: "p",
          text: "Maintaining a sitemap by hand means forgetting to add new pages. Most frameworks can generate it at build or request time.",
        },
        {
          type: "table",
          head: ["Setup", "How"],
          rows: [
            ["Next.js (App Router)", "Return an array of URLs from `app/sitemap.ts` and it is served at `/sitemap.xml`. You can read your posts to set lastModified."],
            ["WordPress", "Core provides `/wp-sitemap.xml` since 5.5; SEO plugins replace it with their own."],
            ["Static site generators", "Gatsby, Astro, Hugo and others have official plugins or built-in support."],
            ["Custom server", "Add one route that reads public pages from your database and returns XML."],
          ],
        },
      ],
    },
    {
      heading: "How to submit it",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "**Reference it in robots.txt**: add `Sitemap: https://yourdomain.com/sitemap.xml` at the bottom. Google and Bing both read it.",
            "**Google Search Console**: enter the sitemap URL under Indexing > Sitemaps. Processing status and discovered URL counts appear there.",
            "**Bing Webmaster Tools**: submit it there too, or import your Search Console property. Bing's index also feeds some AI search products.",
          ],
        },
        {
          type: "p",
          text: "Google used to accept sitemap pings at `google.com/ping?sitemap=...`, but it retired that endpoint in 2023. Today the supported routes are robots.txt, Search Console submission and an accurate lastmod.",
        },
      ],
    },
    {
      heading: "What to check after submitting",
      blocks: [
        {
          type: "list",
          items: [
            "The status in Search Console's Sitemaps screen is \"Success\". \"Couldn't fetch\" usually means a 404 or a robots.txt block.",
            "The discovered page count is close to the number of URLs you listed.",
            "In Indexing > Pages, filtered by sitemap, why unindexed URLs aren't indexed.",
            "No URLs in the sitemap use http, another domain, or a development address.",
          ],
        },
        {
          type: "p",
          text: "Submitting a sitemap doesn't mean every URL gets indexed. It helps discovery; indexing depends on quality and duplication. For a step-by-step diagnosis see [site not showing up on Google](/en/blog/site-not-on-google).",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Does a small 10-page site need a sitemap?",
      a: "Not strictly. Google finds a small, well-linked site on its own. But a sitemap costs almost nothing and makes indexing status easier to follow in Search Console, so it is worth having.",
    },
    {
      q: "Do I need to resubmit after updating the sitemap?",
      a: "Not if the URL is the same; Google rereads submitted sitemaps periodically. If it is urgent, submit the same URL again in Search Console.",
    },
    {
      q: "Can I include images and videos?",
      a: "Yes, there are image, video and news extensions. For a typical service site, accurate page URLs are enough.",
    },
  ],
  related: ["site-not-on-google", "robots-txt", "noindex-check"],
  references: [
    { title: "sitemaps.org: Sitemaps XML format", url: "https://www.sitemaps.org/protocol.html" },
    {
      title: "Google Search Central: Build and submit a sitemap",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
    {
      title: "Google Search Central: Manage your sitemaps with sitemap index files",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps",
    },
    {
      title: "Google Search Central Blog: Sitemaps ping endpoint is going away",
      url: "https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping",
    },
    { title: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters" },
  ],
};
