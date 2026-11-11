// issue #76 — blog JSON-LD builders (Article / BreadcrumbList / FAQPage).
const context = "https://schema.org";

interface ArticleInput {
  post: {
    slug: string;
    lang: Language;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
  };
  siteUrl: string | undefined;
  siteName: string;
  author: { name: string; url: string };
}

export function buildArticleSchema({ post, siteUrl, siteName, author }: ArticleInput) {
  return {
    "@context": context,
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: post.lang,
    mainEntityOfPage: `${siteUrl}/${post.lang}/blog/${post.slug}`,
    image: `${siteUrl}/og.png`,
    author: { "@type": "Person", name: author.name, url: author.url },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/og.png` },
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": context,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqPageSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": context,
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
