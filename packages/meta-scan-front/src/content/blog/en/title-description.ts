import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "title-description",
  lang: "en",
  title: "Writing Title Tags and Meta Descriptions That Work",
  description:
    "Title tags and meta descriptions are what people see first in search. Sensible lengths, why Google rewrites titles, and common mistakes.",
  publishedAt: "2026-11-12",
  hub: "basicSeo",
  isHub: true,
  summary: [
    "`<title>` becomes the blue headline in search results and the browser tab; `<meta name=\"description\">` often becomes the snippet below it. Both should differ on every page and say clearly what the page offers.",
    "There is no exact character limit. Google truncates by pixel width, so aim for roughly 50–60 characters for titles and 120–160 for descriptions, and put the important words first.",
  ],
  sections: [
    {
      heading: "Title: your headline in search",
      blocks: [
        {
          type: "p",
          text: "The title is a strong signal of what a page is about and the first sentence that decides whether someone clicks. Good titles share a few traits.",
        },
        {
          type: "list",
          items: [
            "**Unique topic first**: \"Page topic - Brand\" survives truncation better than \"Brand - Page topic\".",
            "**Words people search for**: use the user's vocabulary, not internal jargon. \"Site not showing up on Google\" gets searched; \"index coverage remediation\" doesn't.",
            "**Consistent with the H1**: when the title and the main heading say different things, Google is more likely to rewrite the title.",
            "**No keyword lists**: \"SEO, SEO checker, SEO tool, free SEO\" reads as spam and gets replaced.",
          ],
        },
        {
          type: "table",
          head: ["Weak", "Better"],
          rows: [
            ["Home", "Free SEO/AEO/GEO Checker - META_SCAN.BIZ"],
            ["Blog", "How to Check robots.txt and 5 Common Mistakes"],
            ["Product | Shop | Shoes | Sneakers | Best Price", "Lightweight Running Shoe XYZ, Size 9 - Brand"],
          ],
        },
      ],
    },
    {
      heading: "Why Google rewrites titles",
      blocks: [
        {
          type: "p",
          text: "Google builds the result headline (officially the \"title link\") from your title first, but if it judges the title unsuitable it uses the H1, other headings or anchor text instead. Typical triggers:",
        },
        {
          type: "list",
          items: [
            "The title is empty or meaningless, like \"Untitled\" or \"Home\"",
            "Many pages on the site share the same title",
            "The title is very long or repeats keywords",
            "The title and the page content (H1) disagree",
          ],
        },
        {
          type: "callout",
          label: "Real example",
          text: "For a while every META_SCAN page had the title \"META_SCAN.BIZ\" and the same description, because metadata lived only in the root layout. Each page now builds its own title in the form `META_SCAN.BIZ - page topic`.",
        },
      ],
    },
    {
      heading: "Description: the reason to click",
      blocks: [
        {
          type: "p",
          text: "The meta description isn't a ranking factor, but it often appears under the title and influences clicks. Google may show a passage from the page instead when it matches the query better.",
        },
        {
          type: "list",
          items: [
            "Say concretely what the reader gets. \"We provide a variety of information\" says nothing.",
            "Include numbers and scope: \"7 checks\", \"in 5 minutes\", \"free\" help people decide.",
            "Make it unique per page. Repeated descriptions are mostly ignored in favor of text from the page.",
            "Double quotes can break the HTML attribute; make sure they are escaped.",
          ],
        },
      ],
    },
    {
      heading: "How long should they be?",
      blocks: [
        {
          type: "p",
          text: "Google truncates by pixel width, not character count. Wide characters and capitals use more space, and CJK text is cut sooner than Latin text. There is no official limit, but these are common working ranges.",
        },
        {
          type: "table",
          head: ["Item", "English", "Korean / CJK", "If longer"],
          rows: [
            ["Title", "About 50–60 characters", "About 25–35 characters", "The end is cut with …"],
            ["Description", "About 120–160 characters", "About 80–120 characters", "Cut off or replaced by page text"],
          ],
        },
        {
          type: "p",
          text: "Order matters more than length: put the most important words first so a truncated version still makes sense. META_SCAN's Basic SEO card checks that the title and description exist and fall within sensible lengths, and the Previews card shows how the result is likely to look.",
        },
      ],
    },
    {
      heading: "Making every page different",
      blocks: [
        {
          type: "table",
          head: ["Setup", "How"],
          rows: [
            ["Next.js (App Router)", "Return title and description from each page's `generateMetadata`. A `title.template` in the layout gives you a shared \"%s - Brand\" format."],
            ["WordPress", "Fill in the title and description fields of your SEO plugin per post. Left empty, they are generated from the post title and opening text."],
            ["Shops and large catalogs", "Build a template from product name, category and key attributes, then hand-tune the most important pages."],
          ],
        },
        {
          type: "p",
          text: "After launch, use Search Console's performance report to find pages with many impressions but a low click-through rate, and rewrite their titles and descriptions. It is the quickest way to gain visits without changing rankings.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Should the brand name be in every title?",
      a: "It isn't required but is common. Google may show the site name separately, so keep the brand short at the end and lead with the page topic.",
    },
    {
      q: "What happens if I leave the description empty?",
      a: "Google picks a passage from the page. It may not be the one you would choose, and some link previews will show an empty description.",
    },
    {
      q: "Do I need a meta keywords tag?",
      a: "Google has said for many years that it doesn't use meta keywords. Adding it has no effect, so don't spend time on it.",
    },
  ],
  related: ["og-tags-preview", "heading-structure", "site-not-on-google"],
  references: [
    {
      title: "Google Search Central: Influencing your title links in search results",
      url: "https://developers.google.com/search/docs/appearance/title-link",
    },
    {
      title: "Google Search Central: Control your snippets in search results",
      url: "https://developers.google.com/search/docs/appearance/snippet",
    },
    {
      title: "Google Search Central: SEO Starter Guide",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    {
      title: "Next.js Docs: generateMetadata",
      url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata",
    },
  ],
};
