import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "site-not-on-google",
  lang: "en",
  title: "Site Not Showing Up on Google? 7 Things to Check",
  description:
    "New site missing from Google? Check robots.txt, noindex, your sitemap, canonical tags and Search Console indexing status, in that order.",
  publishedAt: "2026-11-12",
  hub: "indexing",
  isHub: true,
  summary: [
    "A page is missing from Google for one of two reasons: Google **couldn't fetch it** (crawling blocked, server errors) or Google fetched it and **decided not to index it** (noindex, duplicates, quality).",
    "Working through the seven checks below finds the cause in most cases. The first four are configuration mistakes you can fix in minutes; the last three take time and content.",
  ],
  sections: [
    {
      heading: "First, confirm it really isn't indexed",
      blocks: [
        {
          type: "p",
          text: "Search Google for `site:yourdomain.com` to get a rough view of indexed pages. Zero results means nothing is indexed. A handful of results means you are probably indexed but ranking poorly. Those two problems have completely different fixes.",
        },
        {
          type: "p",
          text: "`site:` counts are approximate, so use Google Search Console for a real answer. Its **URL Inspection** tool tells you \"URL is on Google\" or \"URL is not on Google\" along with the reason. If you haven't verified your site in Search Console yet, do that first.",
        },
        {
          type: "callout",
          label: "Key point",
          text: "Even a healthy new site can take days to weeks to be indexed. If you are still at zero after a month, one of the items below is likely the cause.",
        },
      ],
    },
    {
      heading: "Is robots.txt blocking crawlers?",
      blocks: [
        {
          type: "p",
          text: "Open `https://yourdomain.com/robots.txt` in a browser. If it looks like this, every search engine is blocked. It is remarkably common to ship a development setting like this to production.",
        },
        { type: "code", text: "User-agent: *\nDisallow: /" },
        {
          type: "p",
          text: "Having no robots.txt at all is fine; Google treats a 404 as \"no restrictions\". But if the robots.txt URL returns a server error (5xx), Google may pause crawling the whole site. For syntax and common mistakes see [how to check robots.txt](/en/blog/robots-txt).",
        },
      ],
    },
    {
      heading: "Did a noindex slip in?",
      blocks: [
        {
          type: "p",
          text: "View the page source (Ctrl+U) and search for `noindex`. If `<meta name=\"robots\" content=\"noindex\">` is present, Google may crawl the page but won't put it in results. WordPress's \"Discourage search engines from indexing this site\" option, staging settings and some SEO plugins are the usual culprits.",
        },
        {
          type: "p",
          text: "It can also arrive as an HTTP response header, `X-Robots-Tag: noindex`, which page source won't show. Check the document request's response headers in the browser's Network tab. More in [checking for an accidental noindex](/en/blog/noindex-check).",
        },
        {
          type: "callout",
          label: "Watch out",
          text: "Google can't read a page that robots.txt blocks, so it can't see the noindex either. To remove a page from results, use noindex and leave it crawlable.",
        },
      ],
    },
    {
      heading: "Do you have a sitemap, and did you submit it?",
      blocks: [
        {
          type: "p",
          text: "A sitemap (`sitemap.xml`) lists the pages you want indexed. Google can find pages through links without one, but a new site with few external links gets discovered slowly.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Add `Sitemap: https://yourdomain.com/sitemap.xml` to the bottom of robots.txt.",
            "Submit the sitemap URL in Search Console under Indexing > Sitemaps.",
            "Submit it in Bing Webmaster Tools as well; Bing's index also feeds some AI search products.",
          ],
        },
      ],
    },
    {
      heading: "Does the canonical point somewhere else?",
      blocks: [
        {
          type: "p",
          text: "`<link rel=\"canonical\" href=\"...\">` declares the preferred URL for a page. If every page's canonical points at the home page, or at a development address (`localhost`, a staging domain), Google won't index the page itself. See [canonical tags](/en/blog/canonical-tag) for details.",
        },
        {
          type: "table",
          head: ["Situation", "Symptom", "Fix"],
          rows: [
            ["Every canonical points to home", "Only home is indexed; others are duplicates", "Make each page canonical to itself"],
            ["Canonical uses a dev domain", "Nothing indexed; 'alternate page with proper canonical'", "Check production environment variables"],
            ["Mixed http/https or www", "One page split across several URLs", "Redirect to one version and align canonicals"],
          ],
        },
      ],
    },
    {
      heading: "Read the indexing status in Search Console",
      blocks: [
        {
          type: "p",
          text: "Search Console's Indexing > Pages report groups unindexed URLs by reason. With configuration fixed, most remaining pages fall into one of these two buckets.",
        },
        {
          type: "table",
          head: ["Status", "Meaning", "What to do"],
          rows: [
            ["Discovered – currently not indexed", "Google knows the URL but hasn't crawled it yet", "Add internal and external links, then wait"],
            ["Crawled – currently not indexed", "Google read it but judged it not worth indexing", "Strengthen the content; consolidate thin or duplicate pages"],
          ],
        },
        {
          type: "p",
          text: "After fixing something, click **Request indexing** in URL Inspection to speed up the recrawl. It doesn't guarantee indexing, but it helps Google see your changes sooner.",
        },
      ],
    },
    {
      heading: "Content and links: the two that take time",
      blocks: [
        {
          type: "p",
          text: "If everything is configured correctly and pages still aren't indexed, Google simply doesn't see enough reason to index them. Sites that are only a tool screen with almost no text, or pages that barely differ from each other, are the classic cases.",
        },
        {
          type: "list",
          items: [
            "Give each page an explanation you can only get there, with its own title and description.",
            "Keep pages that shouldn't be search results (internal search, empty lists, login screens) out with noindex to protect overall quality signals.",
            "Leave links where people actually click: a GitHub README, a community post, your personal blog. External links are the fastest way for Google to discover a new site.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN's Indexing card checks robots.txt, the sitemap, canonical and noindex in one pass. Search Console status and content quality are things you still need to review yourself.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "How long until a new site shows up on Google?",
      a: "There is no fixed timeline. Days to a few weeks is typical, longer for a new domain with no links. Submitting a sitemap and requesting indexing in Search Console can speed up discovery.",
    },
    {
      q: "No site: results — does that mean my site is penalized?",
      a: "Not necessarily; it may just not be crawled yet. Use URL Inspection for the exact status. Manual actions, if any, are listed under Security & Manual Actions in Search Console.",
    },
    {
      q: "I show up on Google but not on Bing.",
      a: "Bing needs its own registration. Add your site in Bing Webmaster Tools (you can import from Search Console) and submit your sitemap there.",
    },
  ],
  related: ["robots-txt", "noindex-check", "sitemap-xml", "canonical-tag"],
  references: [
    {
      title: "Google Search Central: How Google Search works",
      url: "https://developers.google.com/search/docs/fundamentals/how-search-works",
    },
    {
      title: "Google Search Central: Block indexing with noindex",
      url: "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    },
    {
      title: "Google Search Central: Build and submit a sitemap",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
    {
      title: "Google Search Central: Consolidate duplicate URLs",
      url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    },
    {
      title: "Search Console Help: Page indexing report",
      url: "https://support.google.com/webmasters/answer/7440203",
    },
  ],
};
