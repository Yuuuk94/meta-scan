import type { MetadataRoute } from "next";
import { allowLanguages, siteRoutes, siteUrl } from "@/constans";
import { getPosts } from "@/services/blogPosts";

// meta-scan's own sitemap.xml (issue #10) — one entry per locale x content
// route, plus the blog index and posts for locales that have posts (#76).
export default function sitemap(): MetadataRoute.Sitemap {
  return (allowLanguages as Language[]).flatMap((locale) => {
    const posts = getPosts(locale);
    const pages = siteRoutes.map((route) => ({ url: `${siteUrl}/${locale}${route}` }));
    if (posts.length === 0) return pages;
    return [
      ...pages,
      { url: `${siteUrl}/${locale}/blog`, lastModified: posts[0].publishedAt },
      ...posts.map((p) => ({
        url: `${siteUrl}/${locale}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? p.publishedAt,
      })),
    ];
  });
}
