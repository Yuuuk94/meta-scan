import { getDictionary } from "@/dictionaries";
import { buildFaqSchema } from "@/services/buildFaqSchema";
import { JsonLd } from "@/ui/atoms/JsonLd";
import { FAQSection } from "@/ui/organisms/FAQSection";
import { HeroSection } from "@/ui/organisms/HeroSection";
import { ProcessSection } from "@/ui/organisms/ProcessSection";
import { getSiteSetting } from "@/utils/siteSetting";

export default async function HomePage() {
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).main;

  return (
    <>
      {/* Hero Section */}
      <HeroSection theme={theme} lang={lang} t={t} />
      {/* Process Section */}
      <ProcessSection theme={theme} lang={lang} t={t} />
      {/* FAQ Section */}
      <FAQSection theme={theme} lang={lang} t={t} />
      {/* FAQ JSON-LD (issue #11) — only rendered here, on HomePage, since
       * FAQSection is the only place this FAQ data appears. */}
      <JsonLd data={buildFaqSchema(t)} />
    </>
  );
}
