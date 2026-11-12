import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "llms-txt",
  lang: "en",
  title: "What Is llms.txt? How to Make One, What to Expect",
  description:
    "llms.txt is a Markdown summary of your site's key pages for AI tools. Format, an example, common mistakes, and an honest look at its effect.",
  publishedAt: "2026-11-12",
  hub: "aiSignals",
  summary: [
    "llms.txt is a Markdown file at your site root (`/llms.txt`) that tells AI models what the site is and where its important pages are. It was proposed in September 2024 by Jeremy Howard of Answer.AI.",
    "It takes ten minutes to write and costs nothing. But it isn't an official standard yet, and few major AI search providers say they use it for ranking or citation. Make one with accurate expectations.",
  ],
  sections: [
    {
      heading: "Why the file exists",
      blocks: [
        {
          type: "p",
          text: "Web pages carry a lot of material unrelated to the content: navigation, ads, scripts. A model has a limited context window when it answers, so reading a whole site as raw HTML is wasteful.",
        },
        {
          type: "p",
          text: "The idea behind llms.txt is simple: alongside the HTML meant for people, offer a short summary and a list of key links in Markdown that is easy for AI to read. It is especially useful for well-structured sites like developer documentation.",
        },
      ],
    },
    {
      heading: "Format: a fixed order",
      blocks: [
        {
          type: "p",
          text: "The format proposed at llmstxt.org follows the order below. Only the H1 on the first line is required, but the rest is what makes the file useful.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "`# Site name` (H1, required)",
            "`> One- or two-sentence summary` (blockquote)",
            "Optional paragraphs with more detail about the site",
            "`## Section name` headings, each followed by a `- [Link title](URL): description` list",
            "An `## Optional` section for links that can be skipped when context is short",
          ],
        },
        {
          type: "code",
          text: "# META_SCAN.BIZ\n\n> Free SEO/AEO/GEO checker. Enter one URL to check meta tags,\n> robots.txt, sitemap, structured data, AI signals and Lighthouse.\n\n## Tool\n\n- [META_SCAN.BIZ](https://meta-scan.biz/en): checker home\n\n## Blog\n\n- [How to check robots.txt](https://meta-scan.biz/en/blog/robots-txt): syntax and common mistakes\n\n## Optional\n\n- [Terms](https://meta-scan.biz/en/terms)",
        },
      ],
    },
    {
      heading: "Common mistakes",
      blocks: [
        {
          type: "table",
          head: ["Mistake", "Problem", "Fix"],
          rows: [
            ["`/llms.txt` returns the home page HTML", "Looks like the file exists but it doesn't (soft 404)", "Make sure it responds with real `text/plain` content"],
            ["Listing every page", "The summary stops being a summary", "Keep it to the 10–30 key pages"],
            ["Links without descriptions", "The model can't tell which page to read", "Add a one-line `: description` to each"],
            ["Stale content", "Points to pages that no longer exist", "Generate it at build time, like a sitemap"],
          ],
        },
        {
          type: "callout",
          label: "Real example",
          text: "META_SCAN itself used to return the home page with a 200 at `/llms.txt`. The file didn't exist and the router caught every path. Open the URL directly and check that the response content-type is `text/plain`.",
        },
      ],
    },
    {
      heading: "How to add one in common setups",
      blocks: [
        {
          type: "p",
          text: "The simplest option is a static file. If your site keeps adding pages, though, a hand-maintained file goes stale quickly, so generating it at build time like a sitemap is better.",
        },
        {
          type: "table",
          head: ["Setup", "How"],
          rows: [
            ["Static site or plain hosting", "Put `llms.txt` in your static folder (often `public/`) so it is served from the root."],
            ["Next.js (App Router)", "Create a GET handler in `app/llms.txt/route.ts` that responds with `text/plain`, building the link list from your content."],
            ["WordPress", "Use a plugin that generates llms.txt, or upload the file to the site root."],
          ],
        },
        {
          type: "p",
          text: "Whatever you choose, open the URL after deploying, confirm the content-type header is `text/plain`, and check that the Markdown shows as-is.",
        },
      ],
    },
    {
      heading: "What to expect from it",
      blocks: [
        {
          type: "p",
          text: "To be candid, there is little evidence yet that llms.txt improves AI search visibility. Google says no special AI text files or markup are needed to appear in AI features such as AI Overviews.",
        },
        {
          type: "p",
          text: "There are still reasons to make one. Developer tools and agents that read site documentation increasingly use the file, and it costs almost nothing. Writing it also forces you to decide what your site's key pages are, which helps SEO directly.",
        },
        {
          type: "p",
          text: "What matters more for AI search: not blocking AI crawlers in robots.txt, having the main text in the HTML without JavaScript, answer-first paragraphs and FAQs, and structured data. META_SCAN's AI signals card checks these together.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Without llms.txt, will I be left out of AI search?",
      a: "No. Most AI search products crawl ordinary web pages to build answers. llms.txt is an optional extra signal, and there is no evidence of a penalty for not having one.",
    },
    {
      q: "How is it different from robots.txt?",
      a: "robots.txt is a set of rules that allow or block crawlers. llms.txt is a document that summarizes your site for AI. llms.txt can't block anything.",
    },
    {
      q: "What is llms-full.txt?",
      a: "A variant that inlines the full text of key documents into one file instead of linking to them. It is mostly used by documentation-heavy developer sites. For a typical service site, llms.txt alone is enough.",
    },
  ],
  related: ["robots-txt", "seo-aeo-geo", "ai-search-citation"],
  references: [
    { title: "llmstxt.org: The /llms.txt file (original proposal)", url: "https://llmstxt.org/" },
    {
      title: "Google Search Central: AI features and your website",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
  ],
};
