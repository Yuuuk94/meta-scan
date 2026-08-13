import { getDictionary } from "@/dictionaries";
import { Scan } from "lucide-react";
import { ToggleSetting } from "./ToggleSetting";
import { ServiceStatus } from "./ServiceStatus";
import Link from "next/link";

interface RootHeaderProps extends DefaultProps {
  ready: boolean;
}

export const RootHeader = async ({ theme, lang, ready }: RootHeaderProps) => {
  const t = (await getDictionary(lang)).head;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* LOGO */}
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Scan className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none text-foreground">
              {t.title}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ToggleSetting theme={theme} lang={lang} />
          <ServiceStatus ready={ready} />
        </div>
      </div>
    </header>
  );
};
