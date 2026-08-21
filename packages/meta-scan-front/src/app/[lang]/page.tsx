import { getDictionary } from "@/dictionaries";
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
    </>
  );
}
