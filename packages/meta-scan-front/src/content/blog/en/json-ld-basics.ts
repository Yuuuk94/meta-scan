import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "json-ld-basics",
  lang: "en",
  title: "Structured Data (JSON-LD) Basics: Article, FAQ, Org",
  description:
    "JSON-LD lets search engines and AI read a page's type, author and dates. Common types, how to validate them, and what rich results to expect.",
  publishedAt: "2026-11-12",
  hub: "aiSignals",
  summary: [
    "Structured data describes facts like \"this page is an article, written by this person, on this date\" using a shared vocabulary (Schema.org). Of the available formats, Google recommends JSON-LD in a `<script type=\"application/ld+json\">` tag.",
    "Structured data doesn't raise rankings. It makes pages eligible for rich results (breadcrumbs, product prices and so on) and helps search engines and AI interpret the page correctly.",
  ],
  sections: [
    {
      heading: "What JSON-LD looks like",
      blocks: [
        {
          type: "p",
          text: "JSON-LD can go anywhere in the HTML, usually in `<head>` or at the end of the body. `@context` names the vocabulary (Schema.org) and `@type` says what the data describes.",
        },
        {
          type: "code",
          text: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "How to Check robots.txt and 5 Common Mistakes",\n  "datePublished": "2026-11-12",\n  "dateModified": "2026-11-12",\n  "author": { "@type": "Person", "name": "Author Name" },\n  "publisher": { "@type": "Organization", "name": "META_SCAN.BIZ" }\n}\n</script>',
        },
        {
          type: "p",
          text: "Microdata and RDFa mix the markup into HTML attributes. JSON-LD stays separate from the visible markup, which makes it easier to maintain: your framework just serializes data to JSON.",
        },
      ],
    },
    {
      heading: "The types you will use most",
      blocks: [
        {
          type: "table",
          head: ["Type", "Where", "Key properties"],
          rows: [
            ["Organization", "Home page", "name, url, logo, sameAs (official profiles)"],
            ["WebSite", "Home page", "name, url"],
            ["Article / BlogPosting", "Blog posts, news", "headline, datePublished, dateModified, author"],
            ["BreadcrumbList", "Pages in a hierarchy", "itemListElement (position, name, item)"],
            ["FAQPage", "Pages with a visible Q&A list", "mainEntity (Question, acceptedAnswer)"],
            ["Product", "Product detail pages", "name, offers (price), aggregateRating"],
            ["SoftwareApplication / WebApplication", "Tool or app pages", "name, applicationCategory, offers"],
          ],
        },
        {
          type: "p",
          text: "META_SCAN's blog posts carry Article, BreadcrumbList and FAQPage; the home page carries WebApplication, WebSite and Organization. Pick what fits each page; more isn't better.",
        },
      ],
    },
    {
      heading: "How much to expect from rich results",
      blocks: [
        {
          type: "p",
          text: "Structured data was once sold as \"add it and your results get fancy\", but Google has narrowed rich results considerably over the past few years.",
        },
        {
          type: "list",
          items: [
            "**FAQ rich results**: since 2023 they are shown only for well-known, authoritative government and health sites. Other sites can add FAQPage but won't get the expandable questions in results.",
            "**HowTo rich results**: discontinued in 2023.",
            "**Still active**: breadcrumbs (BreadcrumbList), product price and reviews (Product), events, recipes, job postings and more still appear as rich results.",
          ],
        },
        {
          type: "callout",
          label: "Why add it anyway",
          text: "Even without the FAQ rich result, FAQPage tells machines exactly which questions and answers the page contains. That can help answer engines find Q&A pairs, so if the page really has a FAQ, it is worth marking up.",
        },
      ],
    },
    {
      heading: "Rules to follow",
      blocks: [
        {
          type: "list",
          items: [
            "**Match the visible content**: reviews or FAQs that exist only in structured data violate Google's policies and can lead to a manual action.",
            "**Different per page**: giving every article the same headline or date is a common bug. Generate it from page data.",
            "**Fill required properties**: each type has properties Google requires; without them, the page isn't eligible.",
            "**Date format**: use ISO 8601, like `2026-11-12` or `2026-11-12T09:00:00+09:00`.",
            "**Full URLs**: url, logo and image take complete `https://` addresses.",
          ],
        },
      ],
    },
    {
      heading: "How to validate it",
      blocks: [
        {
          type: "table",
          head: ["Tool", "Use"],
          rows: [
            ["Google Rich Results Test", "Whether the page is eligible for Google rich results and has all required properties"],
            ["Schema Markup Validator", "Checks against the full Schema.org vocabulary, regardless of Google support"],
            ["Search Console > Enhancements", "Tracks valid and invalid items per type across the site"],
          ],
        },
        {
          type: "p",
          text: "Before release, run code or a URL through the Rich Results Test; after release, watch the Enhancements reports for new errors. META_SCAN's AI signals card also shows whether a page has JSON-LD and which types it contains.",
        },
      ],
    },
    {
      heading: "Adding it in a framework",
      blocks: [
        {
          type: "p",
          text: "In Next.js (App Router), the documented approach is to render `<script type=\"application/ld+json\" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />` in the page component. Keeping a separate function that builds the object from your content makes it easy to test. In WordPress, most SEO plugins add Article, Organization and BreadcrumbList automatically.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Does structured data improve rankings?",
      a: "Google says structured data isn't a ranking factor. There can be an indirect effect when a rich result improves click-through.",
    },
    {
      q: "Can I have more than one JSON-LD block?",
      a: "Yes. Use one script tag per type or combine them with `@graph`. Just avoid declaring the same fact differently in two places.",
    },
    {
      q: "Do other search engines read JSON-LD?",
      a: "Bing and other major engines support Schema.org structured data including JSON-LD. Which types produce rich results differs by engine, so check each one's documentation.",
    },
  ],
  related: ["ai-search-citation", "seo-aeo-geo", "title-description"],
  references: [
    {
      title: "Google Search Central: Introduction to structured data markup",
      url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    },
    {
      title: "Google Search Central: General structured data guidelines",
      url: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
    },
    {
      title: "Google Search Central Blog: Changes to HowTo and FAQ rich results (2023)",
      url: "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
    },
    { title: "Schema.org", url: "https://schema.org/" },
    { title: "Google Rich Results Test", url: "https://search.google.com/test/rich-results" },
    { title: "Schema Markup Validator", url: "https://validator.schema.org/" },
  ],
};
