import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "ai-crawlers",
  lang: "en",
  title: "AI Crawlers (GPTBot and Others): Allow or Block",
  description:
    "GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended: what each does and robots.txt examples that separate training from search.",
  publishedAt: "2026-11-12",
  hub: "aiSignals",
  summary: [
    "AI companies run separate crawlers for separate jobs: **model training**, **AI search and answers**, and **visits on a user's request**. Knowing the split lets you say \"don't train on me, but show me in search\".",
    "You configure this in robots.txt. robots.txt is a voluntary convention, though, so if you need hard blocking you have to do it at the server or CDN.",
  ],
  sections: [
    {
      heading: "The main AI crawlers",
      blocks: [
        {
          type: "table",
          head: ["User-agent", "Company", "Purpose"],
          rows: [
            ["GPTBot", "OpenAI", "Collects data for model training"],
            ["OAI-SearchBot", "OpenAI", "Surfaces sites in ChatGPT search"],
            ["ChatGPT-User", "OpenAI", "Visits when a ChatGPT user asks it to"],
            ["ClaudeBot", "Anthropic", "Collects data for model training"],
            ["Claude-SearchBot", "Anthropic", "Crawls to improve search results"],
            ["Claude-User", "Anthropic", "Visits on a user's request"],
            ["PerplexityBot", "Perplexity", "Surfaces sites in Perplexity search"],
            ["Perplexity-User", "Perplexity", "Visits on a user's request"],
            ["Google-Extended", "Google", "Control token for Gemini training and grounding"],
            ["Applebot-Extended", "Apple", "Control token for Apple's generative model training"],
            ["CCBot", "Common Crawl", "Public web archive (a source for many AI training sets)"],
          ],
        },
        {
          type: "p",
          text: "Google-Extended and Applebot-Extended aren't separate crawlers but robots.txt control tokens. Googlebot and Applebot do the fetching; the token only decides whether that data may be used for generative AI. Blocking Google-Extended therefore has no effect on Google Search visibility or ranking.",
        },
      ],
    },
    {
      heading: "Choosing a policy",
      blocks: [
        {
          type: "table",
          head: ["Goal", "Training crawlers", "Search crawlers"],
          rows: [
            ["Maximum AI search visibility", "Allow", "Allow"],
            ["Visible in search, no training", "Block", "Allow"],
            ["Keep away from AI entirely", "Block", "Block"],
          ],
        },
        {
          type: "p",
          text: "For free tools and blogs that live on discoverability, like META_SCAN, the first or second option is typical. Paid content and publishers that care about copyright may consider blocking training. Blocking search crawlers too also removes the chance of being cited as a source in AI answers.",
        },
      ],
    },
    {
      heading: "robots.txt examples",
      blocks: [
        { type: "h3", text: "No training, search allowed" },
        {
          type: "code",
          text: "User-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: https://yourdomain.com/sitemap.xml",
        },
        { type: "h3", text: "Block only some folders" },
        {
          type: "code",
          text: "User-agent: GPTBot\nDisallow: /premium/\nDisallow: /members/",
        },
        {
          type: "p",
          text: "A crawler that finds a group matching its own name follows only that group and ignores `User-agent: *`. So shared rules in the `*` group (such as `/admin/`) must be repeated in each bot-specific group. This is easy to miss.",
        },
      ],
    },
    {
      heading: "When robots.txt isn't enough",
      blocks: [
        {
          type: "list",
          items: [
            "**User-initiated agents**: companies note that agents like ChatGPT-User, which fetch a page because a user asked, may treat robots.txt differently from automatic crawlers. Check the current official docs.",
            "**Bots that ignore the rules**: scrapers that hide their name or ignore robots.txt can only be stopped with a server firewall or CDN bot management.",
            "**Impersonators**: anyone can fake a user-agent string. OpenAI and others publish their crawler IP ranges, so match IPs when you analyze logs.",
          ],
        },
        {
          type: "callout",
          label: "Watch out",
          text: "The opposite also happens. CDNs such as Cloudflare offer one-click AI crawler blocking and may enable it by default on newly added domains. If robots.txt allows AI crawlers but you never show up in AI search, check your CDN settings.",
        },
      ],
    },
    {
      heading: "Verify after you change it",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Open `/robots.txt` in a browser to confirm the deployed content is what you intended.",
            "Check server or CDN logs for each user-agent's requests and status codes. If an allowed bot gets 403s, a firewall is blocking it.",
            "Check the robots.txt report in Google Search Console for syntax errors.",
            "Scan your site with META_SCAN: the AI signals card shows whether the main AI search crawlers are blocked by robots.txt.",
          ],
        },
        {
          type: "p",
          text: "Crawler names are added and changed as company policies evolve. This list reflects the time of writing, so confirm the latest names in the official docs below before configuring.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "If I block GPTBot, is data already collected deleted?",
      a: "No. robots.txt only applies to future crawling. Data already collected is handled under each company's own policy.",
    },
    {
      q: "Does blocking Google-Extended hurt my Google ranking?",
      a: "No. Google states that Google-Extended doesn't affect inclusion or ranking in Google Search. AI Overviews in Google Search use the regular search index and are separate from Google-Extended.",
    },
    {
      q: "Can I block all AI bots with one line?",
      a: "robots.txt has no directive meaning \"all AI bots\"; you list them by name. For bulk blocking, a CDN's bot management feature is easier to maintain.",
    },
  ],
  related: ["ai-search-citation", "robots-txt", "llms-txt"],
  references: [
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
    {
      title: "Anthropic: Does Anthropic crawl data from the web?",
      url: "https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    { title: "Perplexity: Perplexity Crawlers", url: "https://docs.perplexity.ai/guides/bots" },
    {
      title: "Google Search Central: Google's common crawlers (including Google-Extended)",
      url: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers",
    },
    { title: "Apple: About Applebot", url: "https://support.apple.com/en-us/119829" },
  ],
};
