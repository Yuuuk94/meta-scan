import Link from "next/link";
import type { BlogBlock, BlogPost } from "@/content/blog/types";
import { InlineText } from "@/ui/atoms/InlineText";
import { NumberLabel } from "@/ui/atoms/NumberLabel";

export interface BlogArticleText {
  breadcrumbHome: string;
  blogTitle: string;
  published: string;
  updated: string;
  summary: string;
  faqTitle: string;
  relatedTitle: string;
  referencesTitle: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  authorTitle: string;
  authorBio: string;
  authorLink: string;
}

interface BlogArticleProps {
  post: BlogPost;
  related: { slug: string; title: string }[];
  authorName: string;
  t: BlogArticleText;
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="leading-[1.85] text-foreground-secondary">
          <InlineText text={block.text} />
        </p>
      );
    case "h3":
      return <h3 className="pt-2 text-lg font-bold text-foreground">{block.text}</h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`space-y-2 pl-5 leading-[1.8] text-foreground-secondary ${block.ordered ? "list-decimal" : "list-disc"}`}
        >
          {block.items.map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-[1.5px] border-foreground text-sm">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="border-[1.5px] border-foreground bg-muted px-3 py-2 text-left font-bold text-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, i) => (
                    <td key={i} className="border-[1.5px] border-foreground px-3 py-2 align-top text-foreground-secondary">
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className="border-l-4 border-accent bg-muted px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{block.label}</p>
          <p className="mt-1 leading-relaxed text-foreground">
            <InlineText text={block.text} />
          </p>
        </aside>
      );
    case "code":
      return (
        <pre className="overflow-x-auto border-[1.5px] border-foreground bg-muted p-4 font-mono text-sm leading-relaxed text-foreground">
          <code>{block.text}</code>
        </pre>
      );
  }
}

// issue #76 — single blog post template: summary → numbered sections → FAQ
// → related → references → author → scan CTA.
export function BlogArticle({ post, related, authorName, t }: BlogArticleProps) {
  const lang = post.lang;
  return (
    <article className="content-frame py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="breadcrumb" className="text-xs text-muted-foreground">
          <Link href={`/${lang}`} className="hover:text-accent">{t.breadcrumbHome}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/blog`} className="hover:text-accent">{t.blogTitle}</Link>
        </nav>

        <h1 className="mt-4 font-display text-3xl font-black leading-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-xs text-muted-foreground">
          <Link href={`/${lang}/about`} className="font-bold text-foreground hover:text-accent">{authorName}</Link>
          <span className="mx-2">·</span>
          {t.published} <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          {post.updatedAt && (
            <>
              <span className="mx-2">·</span>
              {t.updated} <time dateTime={post.updatedAt}>{post.updatedAt}</time>
            </>
          )}
        </p>

        <section className="mt-8 border-[1.5px] border-foreground p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{t.summary}</p>
          <div className="mt-2 space-y-3">
            {post.summary.map((s) => (
              <p key={s} className="leading-relaxed text-foreground">
                <InlineText text={s} />
              </p>
            ))}
          </div>
        </section>

        {post.sections.map((section, i) => (
          <section key={section.heading} className="mt-12">
            <h2 className="flex items-baseline gap-3 font-display text-2xl font-extrabold text-foreground">
              <NumberLabel value={i + 1} className="text-2xl" />
              <span>{section.heading}</span>
            </h2>
            <div className="mt-5 space-y-5">
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </div>
          </section>
        ))}

        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold text-foreground">{t.faqTitle}</h2>
          <dl className="mt-5 divide-y-[1.5px] divide-border border-y-[1.5px] border-border">
            {post.faq.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-bold text-foreground">Q. {f.q}</dt>
                <dd className="mt-2 leading-relaxed text-foreground-secondary">
                  <InlineText text={f.a} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-extrabold text-foreground">{t.relatedTitle}</h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/${lang}/blog/${r.slug}`} className="text-accent hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-display text-xl font-extrabold text-foreground">{t.referencesTitle}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-foreground-secondary">
            {post.references.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <aside className="mt-14 flex flex-col gap-2 border-t-[1.5px] border-border pt-8">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t.authorTitle}</p>
          <p className="font-bold text-foreground">{authorName}</p>
          <p className="text-sm leading-relaxed text-foreground-secondary">{t.authorBio}</p>
          <Link href={`/${lang}/about`} className="text-sm font-bold text-accent hover:underline">
            {t.authorLink} →
          </Link>
        </aside>

        <section className="mt-10 bg-foreground p-6 text-background sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">{t.ctaTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed opacity-80">{t.ctaBody}</p>
          <Link
            href={`/${lang}`}
            className="mt-5 inline-block bg-accent px-5 py-3 text-sm font-bold text-accent-foreground hover:opacity-90"
          >
            {t.ctaButton}
          </Link>
        </section>
      </div>
    </article>
  );
}
