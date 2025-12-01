"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Languages, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allowLanguages, allowTheme, langKey, themeKey } from "@/constans";
import { setDocumentCookies } from "@/utils/cookies";

export const ToggleSetting = ({ theme, lang }: DefaultProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTheme = () => {
    const next = allowTheme.filter((a) => a != theme)[0];
    document.documentElement.setAttribute("data-theme", next);
    setDocumentCookies(themeKey, next);
    router.refresh();
  };

  const setLang = () => {
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
        className={`flex items-center gap-2 transition-all duration-300 ${
          theme === "dark"
            ? "text-gray-200 hover:bg-cyan-500/10 hover:text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-600"
        }`}
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
        className={`flex items-center gap-2 transition-all duration-300 ${
          theme === "dark"
            ? "text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-600"
        }`}
      >
        <Languages className="h-4 w-4" />
        {lang === "en" ? "한국어" : "English"}
      </Button>
    </>
  );
};
