import Link from "next/link";
import { Scan } from "lucide-react";
import { getDictionary } from "@/dictionaries";
import { ServiceStatus } from "./ServiceStatus";

interface RootFooterProps extends DefaultProps {
  ready: boolean;
}

export const RootFooter = async ({ lang, ready }: RootFooterProps) => {
  const t = (await getDictionary(lang)).footer;

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Scan className="h-4 w-4" />
          <span className="text-sm">{t.copyright}</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href={`/${lang}/privacy`} className="hover:text-foreground">
              {t.privacy}
            </Link>
            <Link href={`/${lang}/terms`} className="hover:text-foreground">
              {t.terms}
            </Link>
          </nav>
          <ServiceStatus fullLabel ready={ready} />
        </div>
      </div>
    </footer>
  );
};
