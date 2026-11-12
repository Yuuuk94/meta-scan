import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "robots-txt",
  lang: "en",
  title: "How to Check robots.txt and 5 Common Mistakes",
  description:
    "One robots.txt line can remove a site from search. Syntax, how to check yours, common mistakes like a leftover Disallow, and AI crawlers.",
  publishedAt: "2026-11-12",
  hub: "indexing",
  summary: [
    "robots.txt is a plain text file at the root of your site that tells crawlers which paths they may and may not fetch.",
    "The most common accident is a `Disallow: /` added during development that survives into production. The most common misunderstanding is that robots.txt blocks crawling, not indexing.",
  ],
  sections: [
    {
      heading: "Basic syntax",
      blocks: [
        {
          type: "p",
          text: "robots.txt must live at the domain root, like `https://yourdomain.com/robots.txt`; in a subfolder it is ignored. Each subdomain (`blog.yourdomain.com`) and each protocol (http/https) has its own robots.txt.",
        },
        {
          type: "code",
          text: "User-agent: *\nDisallow: /admin/\nAllow: /admin/public/\n\nSitemap: https://yourdomain.com/sitemap.xml",
        },
        {
          type: "table",
          head: ["Directive", "Meaning", "Example"],
          rows: [
            ["User-agent", "Which crawler the group applies to; `*` means all", "`User-agent: Googlebot`"],
            ["Disallow", "Path that should not be crawled", "`Disallow: /admin/`"],
            ["Allow", "Exception inside a disallowed path", "`Allow: /admin/public/`"],
            ["Sitemap", "Full URL of your sitemap", "`Sitemap: https://.../sitemap.xml`"],
          ],
        },
        {
          type: "p",
          text: "Paths are case-sensitive: `Disallow: /Admin/` doesn't block `/admin/`. When rules overlap, Google follows the most specific (longest) matching rule.",
        },
      ],
    },
    {
      heading: "How to check your robots.txt now",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Type `yourdomain.com/robots.txt` into the address bar. A 404 means the file doesn't exist, in which case Google crawls without restrictions.",
            "In Search Console, open Settings > robots.txt report to see the version Google last fetched, when, and any errors.",
            "For a specific page, use URL Inspection and look at whether crawling is allowed.",
          ],
        },
        {
          type: "callout",
          label: "Key point",
          text: "A 404 for robots.txt is fine, but a server error such as 500 can make Google pause crawling the entire site. If the file exists, it must return 200.",
        },
      ],
    },
    {
      heading: "Five common mistakes",
      blocks: [
        { type: "h3", text: "1. Disallow: / left over after launch" },
        {
          type: "p",
          text: "A `Disallow: /` meant to keep staging out of search ships to production. If you split robots.txt by environment variable, opening the live file right after each deploy is the most reliable safeguard.",
        },
        { type: "h3", text: "2. Using robots.txt to keep pages out of the index" },
        {
          type: "p",
          text: "A blocked page can still appear in results as a bare URL if other sites link to it, because Google can't read its content. To remove a page from results, leave it crawlable and add `noindex`.",
        },
        { type: "h3", text: "3. Blocking CSS and JavaScript folders" },
        {
          type: "p",
          text: "Blocking resource folders such as `Disallow: /static/` stops Google rendering the page properly, which can lead to wrong conclusions about mobile-friendliness or content. Don't block resources.",
        },
        { type: "h3", text: "4. A missing trailing slash" },
        {
          type: "p",
          text: "`Disallow: /blog` blocks `/blog`, `/blog/`, `/blog-old` and `/blogger`. To block just the folder, write `Disallow: /blog/`.",
        },
        { type: "h3", text: "5. Relying on unsupported directives" },
        {
          type: "p",
          text: "Google doesn't support `Crawl-delay`, and a `Noindex:` line in robots.txt does nothing. For Google, the meaningful directives are `User-agent`, `Disallow`, `Allow` and `Sitemap`.",
        },
      ],
    },
    {
      heading: "What about AI crawlers?",
      blocks: [
        {
          type: "p",
          text: "AI companies run their own named crawlers, and most say they follow robots.txt. The important detail is that one company may run separate crawlers for **training** and for **search and answers**.",
        },
        {
          type: "table",
          head: ["Name", "Company", "Purpose"],
          rows: [
            ["GPTBot", "OpenAI", "Collects data for model training"],
            ["OAI-SearchBot", "OpenAI", "Surfaces sites in ChatGPT search"],
            ["ClaudeBot", "Anthropic", "Collects data for model training"],
            ["PerplexityBot", "Perplexity", "Surfaces sites in Perplexity search"],
            ["Google-Extended", "Google", "Controls use for Gemini (no effect on Google Search)"],
          ],
        },
        {
          type: "p",
          text: "If you want AI answers to cite you, at least don't block the search and answer crawlers. If you don't want to be used for training, block only the training crawlers.",
        },
        {
          type: "code",
          text: "# Block training, allow search\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /",
        },
        {
          type: "p",
          text: "Crawler names and policies change, so confirm them in each company's documentation. A fuller list is in [AI crawler settings](/en/blog/ai-crawlers). META_SCAN's AI signals card checks whether these rules block AI search visibility.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is it a problem if I have no robots.txt?",
      a: "No. Without one (404), Google assumes no restrictions and crawls everything. It is still worth having one to point to your sitemap.",
    },
    {
      q: "How quickly do robots.txt changes take effect?",
      a: "Google generally caches robots.txt for up to about a day. If it is urgent, you can request a recrawl from the robots.txt report in Search Console.",
    },
    {
      q: "I only want to hide one page from search.",
      a: "Add `<meta name=\"robots\" content=\"noindex\">` to that page and don't block it in robots.txt. Google has to read the page to see the noindex.",
    },
  ],
  related: ["site-not-on-google", "llms-txt", "ai-crawlers"],
  references: [
    {
      title: "Google Search Central: Introduction to robots.txt",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
    },
    {
      title: "Google Search Central: Create and submit a robots.txt file",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt",
    },
    {
      title: "Google Search Central: How Google interprets the robots.txt specification",
      url: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt",
    },
    { title: "RFC 9309: Robots Exclusion Protocol", url: "https://www.rfc-editor.org/rfc/rfc9309" },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
  ],
};
