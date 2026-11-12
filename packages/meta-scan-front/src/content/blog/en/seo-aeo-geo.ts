import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "seo-aeo-geo",
  lang: "en",
  title: "SEO vs AEO vs GEO: What Each One Means",
  description:
    "SEO gets you into search results, AEO gets you used as the answer, GEO gets you cited by AI. How they differ, overlap, and what to do first.",
  publishedAt: "2026-11-12",
  hub: "basics",
  summary: [
    "SEO (search engine optimization) is about showing up in Google and Bing results. AEO (answer engine optimization) and GEO (generative engine optimization) are about being used and cited by services that **answer the question directly**, such as ChatGPT search, Perplexity and Google's AI Overviews.",
    "The three are layers, not alternatives. AI search still crawls the web and leans on search indexes, so a site with broken SEO basics rarely shows up in AI answers either.",
  ],
  sections: [
    {
      heading: "The three in one table",
      blocks: [
        {
          type: "table",
          head: ["", "Goal", "Where it shows", "Key question"],
          rows: [
            ["SEO", "Rank and get clicks", "Classic search result lists", "Can search engines find and understand my page?"],
            ["AEO", "Be picked as the answer", "Featured snippets, AI answers, voice assistants", "Does my page answer the question right away?"],
            ["GEO", "Be cited or recommended by generative AI", "ChatGPT, Perplexity, AI Overviews", "Is my content trustworthy enough to use as a source?"],
          ],
        },
        {
          type: "p",
          text: "AEO and GEO overlap so much that people use them interchangeably. Roughly, AEO leans on question-and-answer structure, while GEO leans on the signals a generative model uses to choose its sources.",
        },
      ],
    },
    {
      heading: "SEO: still the floor everything stands on",
      blocks: [
        {
          type: "p",
          text: "AI search products crawl pages or query search indexes before they answer. If crawlers are blocked, the page isn't indexed, or the main text only appears after JavaScript runs, AI systems struggle to read it too.",
        },
        {
          type: "list",
          items: [
            "Crawling: robots.txt doesn't block crawlers and the server answers normally",
            "Indexing: noindex and canonical do what you intend, and a sitemap exists",
            "Understanding: a unique title and description per page, meaningful headings",
            "Experience: works on mobile, loads fast (Lighthouse performance)",
          ],
        },
        {
          type: "p",
          text: "When I improved a product using SEO work and Lighthouse metrics as the yardstick, the biggest wins came from fixing these basics one at a time. Before any clever technique, let search engines read what they were missing.",
        },
      ],
    },
    {
      heading: "AEO: structure that answers the question",
      blocks: [
        {
          type: "p",
          text: "People ask AI tools full questions: \"how do I check robots.txt\", \"what size should an og:image be\". If your page answers that in its first paragraph, it is much easier to pick.",
        },
        {
          type: "list",
          items: [
            "Lead with the conclusion in a short summary",
            "Use question-style subheadings and a FAQ section",
            "Mark up question-and-answer pairs with structured data such as FAQPage",
            "Put comparisons and steps in tables and numbered lists",
          ],
        },
        {
          type: "callout",
          label: "Key point",
          text: "AEO is less a new technology than a writing habit: give the reader the answer immediately. Writing that works for people works for AI.",
        },
      ],
    },
    {
      heading: "GEO: would an AI trust and cite you?",
      blocks: [
        {
          type: "p",
          text: "Generative AI reads several sources and synthesizes an answer. Pages that get chosen as sources tend to share a few traits.",
        },
        {
          type: "list",
          items: [
            "It is clear who wrote it (author, about page, contact details)",
            "Claims have evidence (links to official docs, sourced numbers)",
            "Site and brand information is consistent (Organization structured data, the same name and description everywhere)",
            "The main text is in the HTML (low dependence on JavaScript)",
            "AI search crawlers (OAI-SearchBot, PerplexityBot and others) aren't blocked",
          ],
        },
        {
          type: "p",
          text: "There are AI-specific files such as llms.txt, but their effect isn't proven yet. Cover the five items above first.",
        },
      ],
    },
    {
      heading: "One question, three lenses",
      blocks: [
        {
          type: "p",
          text: "Take the query \"og image size\". From an SEO lens, what matters is whether your article appears on the first page of Google for it. From an AEO lens, it is whether your article states \"1200×630 pixels\" in the first paragraph. From a GEO lens, it is whether ChatGPT links your article as a source when it answers.",
        },
        {
          type: "p",
          text: "All three start from the same article: one search engines can read, that answers the question directly, and that backs it up with credible sources.",
        },
      ],
    },
    {
      heading: "Where to start",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "**Check SEO settings**: make sure nothing blocks crawling or indexing. If this is broken, nothing else matters.",
            "**Per-page metadata**: write a different title, description and OG tags for every page.",
            "**Content that answers questions**: write one page per real question and add a FAQ.",
            "**Trust signals**: author information, sources and structured data.",
            "**AI crawler policy**: allow AI search crawlers; block only training crawlers if you want to.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN follows this order with separate cards for basic SEO, indexing, previews, AI signals, content and internationalization, marking each item pass, warning, fail or info. Nothing is collapsed into a single score, so you can see what to fix first.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "If my SEO is good, do I still need AEO and GEO?",
      a: "The basics overlap a lot but not completely. Answer-first structure, trust signals like authorship and sources, and whether AI crawlers are allowed all need separate attention.",
    },
    {
      q: "How can I tell whether AI search cites my site?",
      a: "Ask ChatGPT or Perplexity questions in your field and look at the source links. You can also check server logs for visits from crawlers such as OAI-SearchBot and PerplexityBot.",
    },
    {
      q: "Isn't GEO just a new marketing buzzword?",
      a: "The term is new but the problem is real. As more people get answers directly, being inside the AI answer matters alongside ranking in the result list.",
    },
  ],
  related: ["site-not-on-google", "llms-txt", "og-tags-preview"],
  references: [
    {
      title: "Google Search Central: SEO Starter Guide",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    {
      title: "Google Search Central: AI features and your website",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Google Search Central: Creating helpful, reliable, people-first content",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    { title: "OpenAI: Overview of OpenAI Crawlers", url: "https://platform.openai.com/docs/bots" },
  ],
};
