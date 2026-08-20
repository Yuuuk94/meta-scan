import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { ServiceStatus } from "./ServiceStatus";

interface RootFooterProps extends DefaultProps {
  ready: boolean;
}

export const RootFooter = async ({ lang, ready }: RootFooterProps) => {
  const t = (await getDictionary(lang)).footer;

  return (
    // Hairline top rule, flat background — no elevated "card" footer
    // (design-system.md §5).
    <footer className="border-t-[1.5px] border-border">
      {/* Mobile is a left-aligned two-row stack (no items-center) per every Mobile
       * artboard (zine-index intake §2.3) — desktop keeps the centered single row. */}
      <div className="content-frame flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-muted-foreground">{t.copyright}</span>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href={`/${lang}/privacy`} className="hover:text-accent">
              {t.privacy}
            </Link>
            <Link href={`/${lang}/terms`} className="hover:text-accent">
              {t.terms}
            </Link>
          </nav>
          <ServiceStatus fullLabel ready={ready} />
        </div>
      </div>
    </footer>
  );
};
