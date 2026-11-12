import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "og-tags-preview",
  lang: "en",
  title: "Link Preview Not Showing? Fixing Open Graph Tags",
  description:
    "Shared link shows no image or an old title? Required Open Graph tags, image size, and how to clear cached previews on Facebook, LinkedIn and Slack.",
  publishedAt: "2026-11-12",
  hub: "previews",
  isHub: true,
  summary: [
    "When a link is shared, Slack, Facebook, LinkedIn, X, WhatsApp and similar apps read the page's Open Graph (OG) tags to build a card with a title, description and image. Missing or wrong tags give you an empty card.",
    "Three causes cover most cases: og:image is a relative path, the image is too large or inaccessible, or the service is still showing a cached preview after you fixed things.",
  ],
  sections: [
    {
      heading: "The tags you need",
      blocks: [
        {
          type: "p",
          text: "OG tags go inside the HTML `<head>` as `meta property` elements. These five produce a proper card on almost every service.",
        },
        {
          type: "code",
          text: '<meta property="og:title" content="Page title" />\n<meta property="og:description" content="One or two sentences" />\n<meta property="og:image" content="https://yourdomain.com/og.png" />\n<meta property="og:url" content="https://yourdomain.com/page" />\n<meta property="og:type" content="website" />',
        },
        {
          type: "table",
          head: ["Tag", "Role", "Common mistake"],
          rows: [
            ["og:title", "Card title", "Every page has the same title"],
            ["og:description", "Card description", "Left empty or far too long"],
            ["og:image", "Card image", "A relative path like `/og.png`"],
            ["og:url", "Canonical address", "A development server URL"],
            ["og:type", "Content type", "`website` on an article page (`article` is better)"],
          ],
        },
      ],
    },
    {
      heading: "Why the image doesn't show",
      blocks: [
        {
          type: "list",
          items: [
            "**Relative path**: `og:image` must be a full URL starting with `https://`. Many preview crawlers don't resolve paths against the page URL.",
            "**Not reachable**: images behind a login, hotlink protection, or a folder blocked by robots.txt can't be fetched by preview crawlers either. Open the image URL in a private window.",
            "**Size and ratio**: a landscape 1200×630 pixels (about 1.91:1) is the safest choice. Too small and you get a tiny thumbnail; too heavy and the fetch can fail.",
            "**Tags injected by JavaScript**: most preview crawlers don't run JavaScript. Tags added to `<head>` on the client won't be seen; they must be in the server-rendered HTML.",
          ],
        },
        {
          type: "callout",
          label: "How to check",
          text: "View page source (Ctrl+U) and search for `og:image`. If it isn't in the source but shows in the DevTools Elements tab, it is being added by JavaScript.",
        },
      ],
    },
    {
      heading: "Fixed it, but the old preview still shows",
      blocks: [
        {
          type: "p",
          text: "Each service caches preview cards. Once a link has been shared, the old card can persist for a while after you fix the tags. Each service's debugger can clear the cache and refetch.",
        },
        {
          type: "table",
          head: ["Service", "Tool", "How"],
          rows: [
            ["Facebook, Instagram, WhatsApp", "Meta Sharing Debugger", "Enter the URL and click 'Scrape Again'"],
            ["LinkedIn", "Post Inspector", "Entering the URL fetches it fresh"],
            ["X (Twitter)", "No public validator", "Previews refresh on their own; share a new URL variant to test"],
            ["Slack", "No dedicated tool", "Add a query such as `?v=2` and share it as a new link"],
          ],
        },
      ],
    },
    {
      heading: "Do X cards need separate tags?",
      blocks: [
        {
          type: "p",
          text: "X reads `twitter:` tags first and falls back to OG tags. So correct OG tags already give you a basic card. To get the large image card, add this one line.",
        },
        { type: "code", text: '<meta name="twitter:card" content="summary_large_image" />' },
        {
          type: "p",
          text: "Without it, you get the small square thumbnail card (`summary`). For landing pages and articles where sharing matters, the large card tends to win more clicks.",
        },
      ],
    },
    {
      heading: "Pre-launch checklist",
      blocks: [
        {
          type: "list",
          items: [
            "The page source contains og:title, og:description, og:image and og:url",
            "The og:image URL opens straight away in a private window",
            "The image is close to 1200×630 and well under a few MB",
            "twitter:card is set to summary_large_image",
            "Frequently shared pages were checked once in the Meta and LinkedIn tools",
          ],
        },
      ],
    },
    {
      heading: "Make every page different",
      blocks: [
        {
          type: "p",
          text: "Many sites put one set of OG tags on every page. Then any shared article shows the home page card and the recipient has no idea what it is about. At minimum, match each page's OG title and description to its own title and description.",
        },
        {
          type: "p",
          text: "In Next.js, return `openGraph` from each page's `generateMetadata`; in WordPress, SEO plugins generate it from the post title and excerpt. META_SCAN's Previews card shows mock-ups of how the link will look in Google, X and messaging apps, and checks for missing tags and image size.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "What exact size should og:image be?",
      a: "1200×630 pixels is the most widely used. Services crop differently, so keep important text and logos centered with margins around the edges.",
    },
    {
      q: "The preview only fails on one app.",
      a: "Run the URL through that service's debugger if it has one; it shows the tags it saw and any errors. If the link was shared before, clear the cache there and share it again.",
    },
    {
      q: "Do OG tags affect search rankings?",
      a: "Not directly. But a proper card earns clicks when shared, and the visits and mentions that follow help indirectly.",
    },
  ],
  related: ["site-not-on-google", "seo-aeo-geo", "title-description"],
  references: [
    { title: "The Open Graph protocol", url: "https://ogp.me/" },
    { title: "Meta for Developers: Sharing Debugger", url: "https://developers.facebook.com/tools/debug/" },
    { title: "LinkedIn Post Inspector", url: "https://www.linkedin.com/post-inspector/" },
    {
      title: "X Developer: Cards markup",
      url: "https://developer.x.com/en/docs/x-for-websites/cards/overview/markup",
    },
  ],
};
