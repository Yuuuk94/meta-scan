import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allowLanguages, blogAuthorName, defaultLang, siteUrl } from "@/constans";
import { posts } from "@/content/blog";
import { getDictionary } from "@/dictionaries";
import { getPost, getPostLanguages } from "@/services/blogPosts";
import { buildPageMetadata } from "@/services/buildPageMetadata";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
} from "@/services/buildBlogSchemas";
import { JsonLd } from "@/ui/atoms/JsonLd";
import { BlogArticle, type BlogArticleText } from "@/ui/organisms/BlogArticle";

type Params = Promise<{ lang: string; slug: string }>;

const toLang = (raw: string) =>
  (allowLanguages.includes(raw) ? raw : defaultLang) as Language;

export function generateStaticParams() {
  return posts.map((p) => ({ lang: p.lang, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = toLang(raw);
  const post = getPost(lang, slug);
  if (!post) return {};
  const { seo } = await getDictionary(lang);
  const meta = buildPageMetadata({
    lang,
    path: `/blog/${slug}`,
    seo: { title: post.title, description: post.description, siteName: seo.siteName },
    siteUrl,
    languages: getPostLanguages(slug),
    ogType: "article",
  });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [blogAuthorName],
    },
  };
}

// issue #76 — single blog post.
export default async function BlogPostPage({ params }: { params: Params }) {
  const { lang: raw, slug } = await params;
  const lang = toLang(raw);
  const post = getPost(lang, slug);
  if (!post) notFound();

  const dict = await getDictionary(lang);
  const t = dict.blog as unknown as BlogArticleText & { title: string };
  const related = post.related
    .map((s) => getPost(lang, s))
    .filter((p) => p !== undefined)
    .map((p) => ({ slug: p.slug, title: p.title }));
  const postUrl = `${siteUrl}/${lang}/blog/${slug}`;

  return (
    <>
      <BlogArticle post={post} related={related} authorName={blogAuthorName} t={{ ...t, blogTitle: t.title }} />
      <JsonLd
        data={buildArticleSchema({
          post,
          siteUrl,
          siteName: dict.seo.siteName,
          author: { name: blogAuthorName, url: `${siteUrl}/${lang}/about` },
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: t.breadcrumbHome, url: `${siteUrl}/${lang}` },
          { name: t.title, url: `${siteUrl}/${lang}/blog` },
          { name: post.title, url: postUrl },
        ])}
      />
      <JsonLd data={buildFaqPageSchema(post.faq)} />
    </>
  );
}
