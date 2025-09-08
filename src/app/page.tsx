import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/cookies";

export default async function Home() {
  const { theme, lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).main;

  return (
    <>
      {/* Hero Section */}
      {/* Features Section */}
      {/* Process Section */}
    </>
  );
}
