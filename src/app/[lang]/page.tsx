import { getDictionary } from "@/dictionaries";
import { FAQSection } from "@/templates/main/FAQSection";
import { HeroSection } from "@/templates/main/HeroSection";
import { ProcessSection } from "@/templates/main/ProcessSection";
import { getSiteSetting } from "@/utils/cookies";

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
    </>
  );
}
