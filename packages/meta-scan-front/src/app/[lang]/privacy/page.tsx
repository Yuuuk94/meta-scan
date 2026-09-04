import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";
import { NumberLabel } from "@/ui/atoms/NumberLabel";
import { getContent } from "./content";

const lastUpdated = "2026-08-13";
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "yuuuk94@gmail.com";

export default async function PrivacyPage() {
  const { lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).legal;
  const { lead, sections } = getContent(contactEmail)[lang];

  return (
    <div className="content-frame py-16">
      <article className="max-w-3xl">
        <h1 className="font-display text-4xl font-black text-foreground">
          {t.privacyTitle}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {t.updated}: {lastUpdated}
        </p>

        <p className="mt-10 max-w-2xl text-foreground-secondary">{lead}</p>

        <div className="mt-10 flex flex-col">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              className="flex gap-4 border-b-[1.5px] border-border py-5 last:border-none sm:gap-5 sm:py-6"
            >
              <NumberLabel
                value={index + 1}
                className="w-8 shrink-0 text-xl sm:w-11 sm:text-2xl"
              />
              <div>
                <h2 className="mb-3 text-[15px] font-bold text-foreground">
                  {section.heading}
                </h2>
                <div className="space-y-2.5">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-relaxed text-foreground-secondary"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
