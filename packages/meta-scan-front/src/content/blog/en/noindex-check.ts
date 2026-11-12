import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "noindex-check",
  lang: "en",
  title: "How to Check for an Accidental noindex",
  description:
    "Page vanished from search? Check the noindex meta tag and X-Robots-Tag header, common causes in WordPress, Next.js and Vercel, and what to do next.",
  publishedAt: "2026-11-12",
  hub: "indexing",
  summary: [
    "noindex is an instruction: \"don't include this page in search results\". When Google finds it, the page is dropped from the index, even if it was indexed before, on the next crawl.",
    "noindex can live in two places: an HTML meta tag and an HTTP response header. View-source doesn't show headers, so check both or you can miss the cause.",
  ],
  sections: [
    {
      heading: "The two places noindex hides",
      blocks: [
        {
          type: "table",
          head: ["Location", "Form", "How to check"],
          rows: [
            ["HTML meta tag", '`<meta name="robots" content="noindex">`', "View source (Ctrl+U) and search for noindex"],
            ["HTTP response header", "`X-Robots-Tag: noindex`", "DevTools Network tab > document request > response headers"],
          ],
        },
        {
          type: "p",
          text: "The meta tag can target a specific crawler, as in `name=\"googlebot\"`, instead of `name=\"robots\"`. Search the source for the word `noindex`, not `robots`, so you catch these too.",
        },
        {
          type: "p",
          text: "Because X-Robots-Tag also works on non-HTML files like PDFs and images, it is often set in bulk in server or CDN configuration, which also makes it easy to apply to an entire site by accident.",
        },
      ],
    },
    {
      heading: "Check both from the terminal",
      blocks: [
        {
          type: "p",
          text: "Browser extensions and login state can change what you see, so a clean request like a crawler's is more reliable.",
        },
        {
          type: "code",
          text: "# Is there an X-Robots-Tag header?\ncurl -sI https://yourdomain.com/page | grep -i x-robots\n\n# Is there a noindex in the HTML?\ncurl -s https://yourdomain.com/page | grep -io '<meta[^>]*noindex[^>]*>'",
        },
        {
          type: "p",
          text: "If neither prints anything, the server's response contains no noindex. JavaScript can still change meta tags later, so to be certain, run Search Console URL Inspection's \"Test live URL\" to see the page as Google rendered it.",
        },
      ],
    },
    {
      heading: "Common causes",
      blocks: [
        { type: "h3", text: "WordPress's search engine visibility setting" },
        {
          type: "p",
          text: "If \"Discourage search engines from indexing this site\" under Settings > Reading is checked, every page gets noindex. Turning it on during the build and forgetting to turn it off at launch is the classic case.",
        },
        { type: "h3", text: "Staging settings leak into production" },
        {
          type: "p",
          text: "If an environment variable switches noindex on for non-production builds, a wrong value in production removes the whole site. Add \"search the home page source for noindex\" to your release checklist.",
        },
        { type: "h3", text: "Hosting preview deployments" },
        {
          type: "p",
          text: "Hosts such as Vercel automatically add `X-Robots-Tag: noindex` to preview deployment URLs. That is intended, but if your production domain is attached to a preview deployment, production gets noindex too. Make sure the domain is attached to the production deployment.",
        },
        { type: "h3", text: "Inherited framework metadata" },
        {
          type: "p",
          text: "In frameworks like Next.js where layout metadata cascades to child pages, `robots: { index: false }` on a layout applies to everything beneath it. Trying to hide one thin page and hiding a whole section happens here.",
        },
      ],
    },
    {
      heading: "Why not combine it with robots.txt",
      blocks: [
        {
          type: "p",
          text: "Some sites block a page in robots.txt and add noindex to be extra sure, but that stops noindex from working. Google can't read a page blocked by robots.txt, so it never sees the noindex. Pages with external links can then linger in results as a bare URL with no description.",
        },
        {
          type: "callout",
          label: "Key point",
          text: "To remove a page from search results, use noindex only and keep it crawlable in robots.txt. Google has to read the page to see the noindex.",
        },
      ],
    },
    {
      heading: "Pages that should have noindex",
      blocks: [
        {
          type: "p",
          text: "noindex isn't only a source of accidents. Removing pages with no value as search results raises the average quality of what is indexed across your site.",
        },
        {
          type: "list",
          items: [
            "Internal site search results",
            "Login, sign-up and password reset screens",
            "Cart, checkout and account pages",
            "Tool screens that only mean something with input (META_SCAN's scan progress and result screens are an example)",
            "Tag or category lists with almost no content",
          ],
        },
        {
          type: "p",
          text: "For these, `noindex, follow` keeps the page out of the index while still letting crawlers follow its links to discover other pages.",
        },
      ],
    },
    {
      heading: "After removing noindex",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Run the curl commands above against production and confirm both the tag and header are gone.",
            "In Search Console URL Inspection, run \"Test live URL\" and look for \"Indexing allowed\".",
            "Click \"Request indexing\". Requesting a few key pages is enough; the rest are picked up via the sitemap and links.",
            "Watch \"Excluded by 'noindex' tag\" in Indexing > Pages shrink over days to weeks.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Will the page come back immediately after I remove noindex?",
      a: "Google has to recrawl it first. With an indexing request it usually happens within days, but if the whole site was removed it can take weeks.",
    },
    {
      q: "What is the difference between noindex and nofollow?",
      a: "noindex means don't put this page in results; nofollow means don't follow the links on this page. They are independent, so use only what you need.",
    },
    {
      q: "Does Bing respect noindex too?",
      a: "Yes. Bing supports the robots meta tag and X-Robots-Tag. Bing Webmaster Tools' URL Inspection shows how Bing sees the page.",
    },
  ],
  related: ["site-not-on-google", "robots-txt", "canonical-tag"],
  references: [
    {
      title: "Google Search Central: Block search indexing with noindex",
      url: "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    },
    {
      title: "Google Search Central: Robots meta tag, data-nosnippet, and X-Robots-Tag specifications",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
    },
    {
      title: "Search Console Help: URL Inspection tool",
      url: "https://support.google.com/webmasters/answer/9012289",
    },
    { title: "Vercel Docs: Environments", url: "https://vercel.com/docs/deployments/environments" },
  ],
};
