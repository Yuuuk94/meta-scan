"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Languages, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allowLanguages, allowTheme, langKey, themeKey } from "@/constans";
import { setDocumentCookies } from "@/utils/cookies";

export const ToggleSetting = ({ theme, lang, t }: DefaultPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTheme = () => {
    if (pathname.includes("/request")) return;
    const next = allowTheme.filter((a) => a != theme)[0];
    document.documentElement.setAttribute("data-theme", next);
    setDocumentCookies(themeKey, next);
    router.refresh();
  };

  const setLang = () => {
    if (pathname.includes("/request")) return;
    const next = allowLanguages.filter((a) => a != lang)[0];
    setDocumentCookies(langKey, next);
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") + `?${searchParams}`);
  };
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={setTheme}
        className="text-muted-foreground hover:text-foreground"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={setLang}
        className="text-muted-foreground hover:text-foreground"
      >
        <Languages className="h-4 w-4" />
        {t.toggleLanguage}
      </Button>
    </>
  );
};
