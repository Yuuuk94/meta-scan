import { FeaturesSection } from "@/templates/main/FeaturesSection";
import { HeroSection } from "@/templates/main/HeroSection";
import { ProcessSection } from "@/templates/main/ProcessSections";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeaturesSection />
      {/* Process Section */}
      <ProcessSection />
    </>
  );
}
