import { cookies, headers } from "next/headers";
import {
  allowLanguages,
  crrUrlKey,
  defaultLang,
  defaultTheme,
  langKey,
  localeHeaderKey,
  themeKey,
} from "@/constans";

// issue #64 — the URL locale (forwarded by middleware as a request header)
// wins over the `lang` cookie; the cookie only decides for bare "/" where
// there is no locale prefix.
export const getSiteSetting = async () => {
  const co = await cookies();
  const hd = await headers();
  const theme: Theme = (co.get(themeKey)?.value as Theme) || defaultTheme;
  const urlLang = hd.get(localeHeaderKey);
  const lang: Language = allowLanguages.includes(urlLang ?? "")
    ? (urlLang as Language)
    : (co.get(langKey)?.value as Language) || defaultLang;

  const crrUrl = co.get(crrUrlKey)?.value;

  return {
    co,
    theme,
    lang,
    crrUrl,
  };
};
