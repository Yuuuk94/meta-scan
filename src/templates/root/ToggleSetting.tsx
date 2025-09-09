"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages, Moon, Sun } from "lucide-react";
import { allowLanguages, allowTheme, langKey, themeKey } from "@/constans";

interface ToggleSettingProps extends DefautProps {}

export const ToggleSetting = ({ theme, lang }: ToggleSettingProps) => {
  const router = useRouter();

  const toggleCallback = (key: string, next: string) => {
    document.cookie = key + "=" + next;
    router.refresh();
  };
  const setTheme = () => {
    const next = allowTheme.filter((a) => a != theme)[0];
    document.documentElement.setAttribute("data-theme", next);
    toggleCallback(themeKey, next);
  };
  const setLang = () => {
    const next = allowLanguages.filter((a) => a != lang)[0];
    toggleCallback(langKey, next);
  };
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={setTheme}
        className={`flex items-center gap-2 transition-all duration-300 ${
          theme === "dark"
            ? "text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
            : "text-gray-600 hover:bg-gray-100"
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
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Languages className="h-4 w-4" />
        {lang === "en" ? "한국어" : "English"}
      </Button>
    </>
  );
};
