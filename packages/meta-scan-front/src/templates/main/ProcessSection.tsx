import { Globe, Search, Zap } from "lucide-react";

export const ProcessSection = ({ t }: DefaultPageProps) => {
  const steps = [
    { icon: Globe, title: t.step1Title, desc: t.step1Desc },
    { icon: Zap, title: t.step2Title, desc: t.step2Desc },
    { icon: Search, title: t.step3Title, desc: t.step3Desc },
  ];

  return (
    <section className="border-t border-border bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-semibold text-foreground">
            {t.howItWorksTitle}
          </h2>

          <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
            {/* connecting line, desktop only */}
            <div className="pointer-events-none absolute top-6 left-[16.6%] right-[16.6%] hidden h-px bg-border md:block" />

            {steps.map(({ icon: Icon, title, desc }, index) => (
              <div key={index} className="relative text-center">
                <div className="relative z-10 mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="mb-1 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="mx-auto max-w-[26ch] text-sm text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
