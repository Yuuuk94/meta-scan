import { getDictionary } from "@/dictionaries";
import { ToggleSetting } from "@/ui/molecules/ToggleSetting";
import { ServiceStatus } from "./ServiceStatus";
import Link from "next/link";

interface RootHeaderProps extends DefaultProps {
  ready: boolean;
}

export const RootHeader = async ({ theme, lang, ready }: RootHeaderProps) => {
  const t = (await getDictionary(lang)).head;

  return (
    // 4px solid Ink boundary, no shadow/blur (design-system.md §5: "헤더/푸터는 굵은
    // 룰... 그림자로 뜨는 느낌 없음"). Sticky + backdrop-blur read as a floating glass
    // panel (glassmorphism, explicitly banned in §7) — dropped in favor of a flat,
    // opaque bar that sits on the page like the rest of this system.
    <header className="sticky top-0 z-50 border-b-4 border-foreground bg-background">
      {/* 80px desktop / 64px mobile per the Mobile artboards (zine-index intake §2.2) — the
       * fixed h-16/h-20 row height carries this rather than py-*, since the design pins an
       * exact header height, not just a padding value. */}
      <div className="content-frame flex h-16 items-center justify-between sm:h-20">
        {/* Wordmark only — the reference design (Main-Zine.png) has no logo icon
         * next to "META—SCAN", just the text. The wireframe's circular
         * placeholder is on the opposite (right) side of the header, unrelated
         * to the logo, and isn't a real feature yet (no user accounts) — not
         * fabricated here. */}
        <Link href={`/${lang}`}>
          <p className="font-display text-base font-black uppercase leading-none tracking-tight text-foreground sm:text-lg">
            {t.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t.subtitle}</p>
        </Link>

        <div className="flex items-center gap-2">
          <ToggleSetting theme={theme} lang={lang} t={t} />
          <ServiceStatus ready={ready} />
        </div>
      </div>
    </header>
  );
};
