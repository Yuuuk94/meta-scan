import { cookies } from "next/headers";
import { defaultLang, defaultTheme, langKey, themeKey } from "@/constans";

export const getSiteSetting = async () => {
  const co = await cookies();
  const theme: Theme = (co.get(themeKey)?.value as Theme) || defaultTheme;
  const lang: Language = (co.get(langKey)?.value as Language) || defaultLang;
  return {
    co,
    theme,
    lang,
  };
};
