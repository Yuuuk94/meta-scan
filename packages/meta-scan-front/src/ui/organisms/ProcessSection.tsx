import { NumberLabel } from "@/ui/atoms/NumberLabel";

export const ProcessSection = ({ t }: DefaultPageProps) => {
  const steps = [
    { title: t.step1Title, desc: t.step1Desc },
    { title: t.step2Title, desc: t.step2Desc },
    { title: t.step3Title, desc: t.step3Desc },
    { title: t.step4Title, desc: t.step4Desc },
  ];

  return (
    // Bold top/bottom rules frame the section, background tone shifts to
    // Card Paper — the section-break pattern this system uses instead of
    // card shadows (design-system.md §5).
    <section className="border-y-4 border-foreground bg-card py-16">
      <div className="content-frame">
        <h2 className="font-display text-3xl font-extrabold text-foreground">
          {t.howItWorksTitle}
        </h2>

        {/* Hardline grid: 1px background showing through 1px gaps acts as
         * the column rule instead of a gap utility (design-system.md §4:
         * "카드 그룹(그리드) 사이는 1px 검정 룰로 셀을 구분"). */}
        <div className="mt-8 grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-4">
          {steps.map(({ title, desc }, index) => (
            // Mobile row is horizontal (fixed-width number badge left, title+desc
            // stacked right); desktop tile is vertical (number on top, then title,
            // then desc) — not just a column-count collapse (zine-index intake §3.1).
            <div
              key={index}
              className="flex items-start gap-3 bg-card p-4 sm:flex-col sm:gap-2.5 sm:p-6"
            >
              <NumberLabel
                value={index + 1}
                className="w-[34px] shrink-0 text-2xl sm:w-auto sm:text-3xl"
              />
              <div className="flex flex-col gap-1 sm:gap-2.5">
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
                <p className="text-[13px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
