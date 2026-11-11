import Link from "next/link";

interface LatestPostsSectionProps {
  lang: Language;
  title: string;
  moreLabel: string;
  posts: { slug: string; title: string; description: string; publishedAt: string }[];
}

// issue #76 — home "latest posts" (crawl path into the blog + real text).
export function LatestPostsSection({ lang, title, moreLabel, posts }: LatestPostsSectionProps) {
  if (posts.length === 0) return null;
  return (
    <section className="border-t-[1.5px] border-border py-20">
      <div className="content-frame">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold text-foreground">{title}</h2>
          <Link href={`/${lang}/blog`} className="text-sm font-bold text-accent hover:underline">
            {moreLabel}
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug} className="flex flex-col bg-background p-6">
              <time className="text-xs text-muted-foreground" dateTime={p.publishedAt}>
                {p.publishedAt}
              </time>
              <h3 className="mt-2 font-display text-xl font-bold leading-snug text-foreground">
                <Link href={`/${lang}/blog/${p.slug}`} className="hover:text-accent">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
