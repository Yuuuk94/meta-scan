import { defaultLang, defaultTheme } from "@/constans";
import { cookies } from "next/headers";

export const getSiteSetting = async () => {
  const co = await cookies();
  const theme: Theme = (co.get("theme")?.value as Theme) || defaultTheme;
  const lang: Language = (co.get("lang")?.value as Language) || defaultLang;
  return {
    theme,
    lang,
  };
};
