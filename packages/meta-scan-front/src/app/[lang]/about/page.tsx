import type { Metadata } from "next";
import Link from "next/link";
import { blogAuthorName } from "@/constans";
import { getDictionary } from "@/dictionaries";
import { getPageMetadata } from "@/services/getPageMetadata";
import { getSiteSetting } from "@/utils/siteSetting";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "yuuuk94@gmail.com";
const githubUrl = "https://github.com/Yuuuk94/meta-scan";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang, "seoAbout", "/about");
}

// issue #76 — who builds META_SCAN and why (AdSense / E-E-A-T trust page).
export default async function AboutPage() {
  const { lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).about;

  return (
    <div className="content-frame py-12 sm:py-16">
      <article className="max-w-3xl">
        <h1 className="font-display text-4xl font-black text-foreground">{t.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground">{t.lead}</p>

        {t.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="font-display text-2xl font-extrabold text-foreground">{s.heading}</h2>
            <div className="mt-4 space-y-4">
              {s.body.map((p) => (
                <p key={p} className="leading-[1.85] text-foreground-secondary">{p}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12 border-t-[1.5px] border-border pt-8">
          <h2 className="font-display text-2xl font-extrabold text-foreground">{t.contactTitle}</h2>
          <p className="mt-2 font-bold text-foreground">{blogAuthorName}</p>
          <ul className="mt-4 space-y-2 text-foreground-secondary">
            <li>
              {t.emailLabel}:{" "}
              <a href={`mailto:${contactEmail}`} className="text-accent underline">{contactEmail}</a>
            </li>
            <li>
              GitHub:{" "}
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                {githubUrl.replace("https://", "")}
              </a>
            </li>
          </ul>
          <Link href={`/${lang}/blog`} className="mt-6 inline-block font-bold text-accent hover:underline">
            {t.blogLink} →
          </Link>
        </section>
      </article>
    </div>
  );
}
