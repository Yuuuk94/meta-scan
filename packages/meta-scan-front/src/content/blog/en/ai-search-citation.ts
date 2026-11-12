import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "ai-search-citation",
  lang: "en",
  title: "How to Get Your Site Cited by ChatGPT and AI Search",
  description:
    "How to get cited by ChatGPT search, Perplexity and Google AI Overviews: crawler access, indexing, answer-first writing and trust signals.",
  publishedAt: "2026-11-12",
  hub: "aiSignals",
  isHub: true,
  summary: [
    "For AI search to cite you, it first has to be **able to read you** (crawlers allowed, text in the HTML) and then have **a reason to pick you** (a paragraph that answers the question, evidence, a clear author).",
    "There is no secret tag. Google says no special markup is needed for AI Overviews, and other AI search products also build answers by reading web pages. Covering the basics without gaps is the most reliable approach.",
  ],
  sections: [
    {
      heading: "How AI search picks its sources",
      blocks: [
        {
          type: "p",
          text: "AI search products work in a broadly similar way. They take the question, find relevant pages through their own crawler or a search index, read them, summarize an answer and attach the pages they relied on as source links.",
        },
        {
          type: "table",
          head: ["Service", "Where pages come from", "What to check"],
          rows: [
            ["Google AI Overviews / AI Mode", "Google's search index", "Indexed on Google, snippets allowed"],
            ["ChatGPT search", "OAI-SearchBot crawling plus third-party search results", "OAI-SearchBot not blocked; indexed on Bing too"],
            ["Perplexity", "PerplexityBot crawling", "PerplexityBot not blocked"],
            ["Claude web search", "Claude-SearchBot and others", "Anthropic's search crawler not blocked"],
          ],
        },
        {
          type: "p",
          text: "The common thread is clear: crawlers must get in and the page must be in a search index before it is even a candidate. Only then does the question \"is this a good answer?\" come up.",
        },
      ],
    },
    {
      heading: "Step 1: make it readable",
      blocks: [
        {
          type: "list",
          items: [
            "**Allow AI search crawlers**: make sure robots.txt doesn't block OAI-SearchBot, PerplexityBot or Claude-SearchBot. That is separate from training crawlers (GPTBot, ClaudeBot). See [AI crawler settings](/en/blog/ai-crawlers).",
            "**Check your CDN and firewall**: robots.txt may allow AI crawlers while a CDN's bot protection, such as Cloudflare's, blocks them. Review your bot management settings.",
            "**Put the text in the HTML**: pages that only render their content after JavaScript runs can look empty to some crawlers. Server rendering or static generation is safer.",
            "**Allow snippets**: with `nosnippet` or a very short `max-snippet`, Google won't use the page as grounding for AI Overviews.",
          ],
        },
        {
          type: "callout",
          label: "How to check",
          text: "Run `curl -s your-url | grep 'first sentence of your article'` in a terminal. If nothing prints, the HTML crawlers receive doesn't contain your content.",
        },
      ],
    },
    {
      heading: "Step 2: get indexed",
      blocks: [
        {
          type: "p",
          text: "Much of AI search starts from regular search indexes, so a site with zero Google and Bing indexing rarely appears in AI answers. If you aren't indexed yet, start with [site not showing up on Google](/en/blog/site-not-on-google).",
        },
        {
          type: "list",
          items: [
            "Submit your sitemap in Google Search Console",
            "Register in Bing Webmaster Tools as well (importing from Search Console takes minutes)",
            "Keep thin pages out with noindex to protect overall quality",
          ],
        },
      ],
    },
    {
      heading: "Step 3: write paragraphs that are answers",
      blocks: [
        {
          type: "p",
          text: "AI pulls the part of a page that matches the question and summarizes it. If the answer is scattered through the middle of the article it is hard to pick; if it is stated up front it is easy.",
        },
        {
          type: "list",
          items: [
            "**Conclusion first**: answer the question in two or three sentences at the top. That is why every article on this blog opens with a summary.",
            "**Question-style headings**: use the sentences people actually ask, like \"What size should og:image be?\"",
            "**Concrete values**: \"1200×630 pixels\" instead of \"a suitable size\", \"under 2.5 seconds\" instead of \"fast\".",
            "**Tables and lists**: comparisons and steps are easier to extract from tables and numbered lists than from prose.",
            "**FAQ**: collect short questions the body didn't cover at the end.",
          ],
        },
      ],
    },
    {
      heading: "Step 4: look trustworthy",
      blocks: [
        {
          type: "p",
          text: "When several pages give the same answer, AI tries to pick the more credible one. The criteria are nearly identical to Google's guidance on helpful, reliable content.",
        },
        {
          type: "list",
          items: [
            "Who wrote it: author name, about page, contact details",
            "What it is based on: links to official docs, sources for numbers",
            "When it was written: published and updated dates",
            "What the site is: Organization and Article structured data, a consistent site name and description",
          ],
        },
        {
          type: "p",
          text: "Structured data doesn't guarantee citation, but it lets machines read author, date and page type without guessing. The basics are in [JSON-LD basics](/en/blog/json-ld-basics).",
        },
      ],
    },
    {
      heading: "How to tell whether you are cited",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Ask ChatGPT search and Perplexity questions your articles answer, and read the source list.",
            "In analytics such as GA4, look for referral traffic from `chatgpt.com` and `perplexity.ai`.",
            "Search server or CDN logs for OAI-SearchBot and PerplexityBot. If they never visit, the problem is step 1.",
            "Google Search Console's performance report counts AI Overview impressions together with regular search impressions.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN's AI signals card shows the site-side items in one place: whether AI crawlers are blocked, structured data, FAQ, and how much the content depends on JavaScript rendering.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Does being cited by AI search bring more visitors?",
      a: "Some users click the source links, so it does lead to visits. Many users are satisfied with the answer and don't click, though, so the brand-mention effect can matter more than raw traffic.",
    },
    {
      q: "If I block GPTBot, will I disappear from ChatGPT search?",
      a: "OpenAI runs GPTBot (training) and OAI-SearchBot (search) separately. Block GPTBot and allow OAI-SearchBot to stay out of training while still appearing in search.",
    },
    {
      q: "Should I write separate content for AI search?",
      a: "No. Articles with a clear conclusion and solid evidence are good for people and for AI. Repeating keywords or hiding text just for AI can violate search engine spam policies.",
    },
  ],
  related: ["seo-aeo-geo", "ai-crawlers", "json-ld-basics", "llms-txt"],
  references: [
    {
      title: "Google Search Central: AI features and your website",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Google Search Central: Creating helpful, reliable, people-first content",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
    { title: "Perplexity: Perplexity Crawlers", url: "https://docs.perplexity.ai/guides/bots" },
    { title: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters" },
  ],
};
