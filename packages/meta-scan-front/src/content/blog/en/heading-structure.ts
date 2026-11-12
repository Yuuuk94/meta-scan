import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "heading-structure",
  lang: "en",
  title: "Heading Structure and Content Depth for SEO",
  description:
    "Headings are your page's table of contents. Rules for H1–H3, word-count myths, the risk of JavaScript-only content, and avoiding thin pages.",
  publishedAt: "2026-11-12",
  hub: "content",
  isHub: true,
  summary: [
    "Headings (H1–H6) aren't a way to make text bigger; they are the page's table of contents. Search engines, AI systems and screen readers all use them to understand structure.",
    "There is no minimum word count. What matters is whether the page offers enough you can't get elsewhere. Still, a site made only of tool screens with almost nothing to read is at a disadvantage in quality reviews.",
  ],
  sections: [
    {
      heading: "Headings are a table of contents",
      blocks: [
        {
          type: "code",
          text: "H1  How to Check robots.txt and 5 Common Mistakes\n  H2  Basic syntax\n  H2  How to check your robots.txt now\n  H2  Five common mistakes\n    H3  1. Disallow: / left over after launch\n    H3  2. Using robots.txt to keep pages out of the index\n  H2  What about AI crawlers?",
        },
        {
          type: "p",
          text: "Reading only the headings should tell you what the page covers. Then search engines grasp the topic and each section's role easily, AI can extract the part that matches a question, and screen reader users can jump heading by heading to what they need.",
        },
      ],
    },
    {
      heading: "Heading rules",
      blocks: [
        {
          type: "list",
          items: [
            "**One H1 for the page topic**: use the article title or page name. Google says multiple H1s aren't a problem, but one keeps the topic clear and avoids accessibility warnings.",
            "**Don't skip levels**: jumping from H2 to H4 breaks the outline. If you need a smaller heading, shrink it with CSS and keep the level.",
            "**Not for styling**: don't use headings just to make text big, and don't fake real headings with bold `<div>`s; the structure disappears.",
            "**Descriptive wording**: \"Basic syntax of robots.txt\" beats \"Overview\" or \"Misc\" for both search and AI citation.",
            "**Match the title and H1**: when they say different things, Google is more likely to rewrite your search result title.",
          ],
        },
        {
          type: "callout",
          label: "How to check",
          text: "Paste `[...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ' ' + h.textContent.trim())` into the DevTools console to list the page's headings in order.",
        },
      ],
    },
    {
      heading: "Myths about content length",
      blocks: [
        {
          type: "p",
          text: "You will often hear that Google prefers articles over some number of words. Google has repeatedly said word count isn't a ranking factor. For a short question, a short answer may be best.",
        },
        {
          type: "p",
          text: "That doesn't make depth irrelevant. The problem isn't length itself but **thin content**. Pages that Google and AdSense consider low value share some patterns.",
        },
        {
          type: "table",
          head: ["Thin page type", "Example", "What to do"],
          rows: [
            ["A tool screen and nothing else", "One input box and a button", "Add how-to guidance, help interpreting results, related guides"],
            ["Near-duplicate pages", "Dozens of pages differing only by city name", "Merge them or give each unique information"],
            ["Content copied from elsewhere", "Translations or summaries of official docs only", "Add first-hand experience, comparisons, examples"],
            ["Empty lists and search results", "Categories with no posts", "Remove them from the index with noindex"],
          ],
        },
        {
          type: "callout",
          label: "Real example",
          text: "META_SCAN started as a tool site with a URL box and a short intro, and AdSense rejected it several times for low-value content. This blog, the about page and the home page's explanation of each check exist to fix exactly that.",
        },
      ],
    },
    {
      heading: "Why the text belongs in the HTML",
      blocks: [
        {
          type: "p",
          text: "Google can render JavaScript, but rendering happens later than crawling and can fail. Link preview crawlers and some AI crawlers don't run JavaScript at all.",
        },
        {
          type: "list",
          items: [
            "Put core text and headings in the first HTML response via server rendering or static generation.",
            "Content inside tabs and accordions should still be in the HTML. Content fetched from the server on click may never be seen by crawlers.",
            "Lists that only expand via a \"load more\" button should also be reachable through ordinary `<a href>` links to the next page.",
          ],
        },
        {
          type: "p",
          text: "META_SCAN compares the HTML the server sends first with the HTML after the browser runs JavaScript, and its AI signals card shows how much the content depends on JavaScript.",
        },
      ],
    },
    {
      heading: "Making the body easy to read",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Put the conclusion in the first paragraph. People arriving from search came for an answer.",
            "One idea per paragraph.",
            "Comparisons in tables, steps in numbered lists.",
            "Back claims with evidence. Links to official documentation and results you tested yourself are the strongest.",
            "Link related articles inline so readers know what to read next.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is having two H1s bad for SEO?",
      a: "Google says it doesn't penalize multiple H1s. For accessibility and clarity, a single H1 holding the page topic is still recommended.",
    },
    {
      q: "How many words does an article need to rank?",
      a: "There is no set number. What counts is whether it fully answers the searcher's question. A realistic benchmark is to see what the top results cover and add something more useful.",
    },
    {
      q: "Does text inside images count as content?",
      a: "Search engines have trouble reading text in images as content. Put important information in real text, and give images descriptive alt text.",
    },
  ],
  related: ["title-description", "ai-search-citation", "site-not-on-google"],
  references: [
    {
      title: "Google Search Central: Creating helpful, reliable, people-first content",
      url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "Google Search Central: JavaScript SEO basics",
      url: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
    },
    {
      title: "Google Search Central: SEO Starter Guide",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    { title: "W3C WAI: Headings tutorial", url: "https://www.w3.org/WAI/tutorials/page-structure/headings/" },
    {
      title: "Google AdSense Help: Low value content",
      url: "https://support.google.com/adsense/answer/10015918",
    },
  ],
};
