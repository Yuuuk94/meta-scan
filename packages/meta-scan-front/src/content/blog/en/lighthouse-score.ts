import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "lighthouse-score",
  lang: "en",
  title: "Improving Your Lighthouse Score: What to Fix First",
  description:
    "The Lighthouse performance score is a weighted mix of five metrics. Which matter most, what to fix first, and how lab scores differ from field data.",
  publishedAt: "2026-11-12",
  hub: "lighthouse",
  isHub: true,
  summary: [
    "Lighthouse is Google's page audit tool. It scores performance, accessibility, best practices and SEO from 0 to 100. Chrome DevTools, PageSpeed Insights and META_SCAN's results screen all run the same engine.",
    "The fastest way to raise the performance score is to start with the heaviest-weighted metrics. Total Blocking Time (TBT), Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) make up 80% of it.",
  ],
  sections: [
    {
      heading: "How the performance score is calculated",
      blocks: [
        {
          type: "table",
          head: ["Metric", "Meaning", "Weight"],
          rows: [
            ["TBT (Total Blocking Time)", "Total time the main thread was blocked and couldn't respond to input", "30%"],
            ["LCP (Largest Contentful Paint)", "When the largest element on screen (often the hero image or heading) rendered", "25%"],
            ["CLS (Cumulative Layout Shift)", "How much content moved around while loading", "25%"],
            ["FCP (First Contentful Paint)", "When the first text or image rendered", "10%"],
            ["Speed Index", "How quickly the screen fills in", "10%"],
          ],
        },
        {
          type: "p",
          text: "Weights are for Lighthouse 10. Get TBT, LCP and CLS under control and most of the score follows. Shaving FCP alone barely moves it.",
        },
      ],
    },
    {
      heading: "Priority 1: reduce LCP",
      blocks: [
        {
          type: "p",
          text: "The LCP element is usually the hero image. If it is discovered late, is too large, or waits behind other resources, LCP suffers.",
        },
        {
          type: "list",
          items: [
            "**Don't lazy-load the hero image**: `loading=\"lazy\"` on an above-the-fold image makes it later. Use `fetchpriority=\"high\"` instead.",
            "**Size and format**: resize to the displayed size and switch to WebP or AVIF. Use `srcset` for different devices.",
            "**Discoverable in the HTML**: CSS background images and images injected by JavaScript are found late by the browser.",
            "**Server response time**: if the first HTML arrives late, every metric slips with it. Check caching and your CDN.",
          ],
        },
      ],
    },
    {
      heading: "Priority 2: reduce TBT",
      blocks: [
        {
          type: "p",
          text: "TBT grows when JavaScript holds the main thread for long stretches. It is the most common reason framework-based sites score poorly.",
        },
        {
          type: "list",
          items: [
            "Remove unused JavaScript. Lighthouse's \"Reduce unused JavaScript\" audit lists the waste per file.",
            "Load heavy libraries dynamically, only on the screens that need them.",
            "Defer third-party scripts such as ads, analytics and chat widgets with `async`/`defer`, or until user interaction.",
            "Move what can be server-rendered to server components so less code ships to the client.",
          ],
        },
        {
          type: "callout",
          label: "From experience",
          text: "When I improved a product using Lighthouse as the benchmark, the biggest wins came not from new optimization tricks but from removing what wasn't used. Simply looking at what is in the bundle with a bundle analyzer turns up several things to fix.",
        },
      ],
    },
    {
      heading: "Priority 3: fix CLS",
      blocks: [
        {
          type: "list",
          items: [
            "Set `width` and `height` on images and videos so space is reserved.",
            "Give late-loading areas such as ads and banners a minimum height.",
            "Reduce web-font swap shifts with `font-display` and fallback font size adjustments.",
            "Don't insert new elements above existing content. Pinning a cookie banner to the bottom of the screen is safe.",
          ],
        },
      ],
    },
    {
      heading: "Accessibility, best practices and SEO",
      blocks: [
        {
          type: "p",
          text: "The other three categories are mostly pass/fail checks, so fixing an item raises the score immediately.",
        },
        {
          type: "table",
          head: ["Category", "Common failures", "Fix"],
          rows: [
            ["Accessibility", "Missing image alt, low color contrast, unnamed buttons and links", "Alt text, contrast of 4.5:1 or more, aria-label"],
            ["Best practices", "Console errors, low-resolution images, outdated libraries", "Fix errors, serve appropriately sized images"],
            ["SEO", "Missing meta description, blocked crawling, link text like \"click here\"", "Write descriptions, check robots, descriptive link text"],
          ],
        },
        {
          type: "p",
          text: "A Lighthouse SEO score of 100 doesn't guarantee search visibility; it only checks technical basics. That is why META_SCAN shows indexing, previews and AI signals cards alongside the Lighthouse scores.",
        },
      ],
    },
    {
      heading: "Why the score changes every run",
      blocks: [
        {
          type: "p",
          text: "Lighthouse is a lab measurement. Machine performance, network conditions and server response time make the same page score a few points differently on each run. Look at the trend across several runs rather than one number.",
        },
        {
          type: "list",
          items: [
            "PageSpeed Insights and META_SCAN emulate a low-end mobile device on a slow network by default, so scores are lower than on your laptop's Chrome. That is expected.",
            "Real-user experience comes from field data in the Chrome UX Report (CrUX). Search Console's Core Web Vitals report shows this data.",
            "In the field, \"good\" means LCP within 2.5 s, INP within 200 ms and CLS under 0.1. INP can't be measured in the lab, so TBT serves as its proxy.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is the Lighthouse score a ranking factor?",
      a: "The Lighthouse score itself isn't. Google uses Core Web Vitals from real-user data as one of its page experience signals, and that weighs less than content relevance.",
    },
    {
      q: "Should I aim for 100?",
      a: "No. A performance score of 90 or above is already in the \"good\" band, and beyond that the effort rarely changes what users feel. Fixing failing accessibility and SEO items usually pays off more.",
    },
    {
      q: "Desktop or mobile score?",
      a: "Google indexes the mobile version first, so prioritize mobile. If mobile is good, desktop usually follows.",
    },
  ],
  related: ["seo-aeo-geo", "heading-structure", "title-description"],
  references: [
    {
      title: "Chrome for Developers: Lighthouse performance scoring",
      url: "https://developer.chrome.com/docs/lighthouse/performance/performance-scoring",
    },
    { title: "web.dev: Web Vitals", url: "https://web.dev/articles/vitals" },
    { title: "web.dev: Optimize Largest Contentful Paint", url: "https://web.dev/articles/optimize-lcp" },
    { title: "web.dev: Optimize Cumulative Layout Shift", url: "https://web.dev/articles/optimize-cls" },
    { title: "PageSpeed Insights", url: "https://pagespeed.web.dev/" },
  ],
};
