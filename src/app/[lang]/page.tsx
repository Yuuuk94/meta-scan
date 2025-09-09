import { getDictionary } from "@/dictionaries";
import { HeroSection } from "@/templates/main/HeroSection";
import { getSiteSetting } from "@/utils/cookies";

export default async function Home() {
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).main;

  return (
    <>
      {/* Hero Section */}
      <HeroSection theme={theme} lang={lang} t={t} />
      {/* Features Section */}
      {/* Process Section */}
    </>
  );
}
