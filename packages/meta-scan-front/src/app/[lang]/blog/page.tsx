import type { Metadata } from "next";
import Link from "next/link";
import { allowLanguages, defaultLang, siteUrl } from "@/constans";
import { getDictionary } from "@/dictionaries";
import { getPosts } from "@/services/blogPosts";
import { buildPageMetadata } from "@/services/buildPageMetadata";
import { buildBreadcrumbSchema } from "@/services/buildBlogSchemas";
import { JsonLd } from "@/ui/atoms/JsonLd";

const toLang = (raw: string) =>
  (allowLanguages.includes(raw) ? raw : defaultLang) as Language;

const localesWithPosts = () =>
  (allowLanguages as Language[]).filter((l) => getPosts(l).length > 0);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const { seo } = await getDictionary(lang);
  const available = localesWithPosts();
  return buildPageMetadata({
    lang,
    path: "/blog",
    seo: { ...seo.seoBlog, siteName: seo.siteName },
    siteUrl,
    languages: available.length ? available : [lang],
    noindex: getPosts(lang).length === 0,
  });
}

// issue #76 — site blog index.
export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = toLang((await params).lang);
  const dict = await getDictionary(lang);
  const t = dict.blog;
  const posts = getPosts(lang);
  const hubs = t.hubs as Record<string, string>;

  return (
    <div className="content-frame py-12 sm:py-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-black text-foreground">{t.title}</h1>
        <p className="mt-4 leading-relaxed text-foreground-secondary">{t.intro}</p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-foreground-secondary">
          {t.empty}{" "}
          <Link href="/ko/blog" className="text-accent underline">{t.emptyLink}</Link>
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug} className="flex flex-col bg-background p-6">
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-accent">{hubs[p.hub]}</span>
                <span className="mx-2">·</span>
                <time dateTime={p.publishedAt}>{p.publishedAt}</time>
              </p>
              <h2 className="mt-2 font-display text-xl font-bold leading-snug text-foreground">
                <Link href={`/${lang}/blog/${p.slug}`} className="hover:text-accent">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{p.description}</p>
            </li>
          ))}
        </ul>
      )}

      <JsonLd
        data={buildBreadcrumbSchema([
          { name: t.breadcrumbHome, url: `${siteUrl}/${lang}` },
          { name: t.title, url: `${siteUrl}/${lang}/blog` },
        ])}
      />
    </div>
  );
}
