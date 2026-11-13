// issue #76 — meta-scan's own /llms.txt (https://llmstxt.org format).
interface Input {
  siteUrl: string | undefined;
  posts: { lang: Language; slug: string; title: string; description: string }[];
}

export function buildLlmsTxt({ siteUrl, posts }: Input): string {
  const lines = [
    "# META_SCAN.BIZ",
    "",
    "> Free SEO/AEO/GEO checker. Enter one URL to check meta tags, robots.txt, sitemap, structured data, AI signals (llms.txt, AI crawler access) and Lighthouse scores, each judged pass/warning/fail/info.",
    "",
    "META_SCAN.BIZ is a free web tool with no sign-up. Results are computed per scan and are not stored on the server. The blog explains each check and how to fix it.",
    "",
    "## Tool",
    "",
    `- [META_SCAN.BIZ (Korean)](${siteUrl}/ko): SEO/AEO/GEO 분석기`,
    `- [META_SCAN.BIZ (English)](${siteUrl}/en): SEO/AEO/GEO checker`,
    `- [About (Korean)](${siteUrl}/ko/about): who builds it and why`,
    `- [About (English)](${siteUrl}/en/about): who builds it and why`,
    "",
    "## Blog",
    "",
    ...posts.map(
      (p) => `- [${p.title}](${siteUrl}/${p.lang}/blog/${p.slug}): ${p.description}`,
    ),
    "",
    "## Optional",
    "",
    `- [Privacy policy](${siteUrl}/en/privacy)`,
    `- [Terms of service](${siteUrl}/en/terms)`,
    "",
  ];
  return lines.join("\n");
}
