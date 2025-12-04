import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  allowLanguages,
  defaultLang,
  defaultTheme,
  langKey,
  themeKey,
} from "./constans";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const theme = req.cookies.get(themeKey)?.value;
  const lang = req.cookies.get(langKey)?.value;

  const response = NextResponse.next();

  if (!theme) response.cookies.set(themeKey, defaultTheme, { httpOnly: false });

  if (!lang) {
    const acceptLang = req.headers.get("accept-language");
    const userLang = acceptLang?.split(",")?.[0] || "";
    let lang = defaultLang;
    if (allowLanguages.includes(userLang)) lang = userLang as Language;
    response.cookies.set(langKey, lang, { httpOnly: false });
  }

  const hasLocalePrefix = allowLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocalePrefix) {
    req.nextUrl.pathname = `/${lang}/${pathname}`;
    const redirectResponse = NextResponse.redirect(req.nextUrl);
    for (const c of response.cookies.getAll()) {
      redirectResponse.cookies.set(c);
    }
    return redirectResponse;
  }

  return response;
}
