import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocaleFromPath } from "@/services/getLocaleFromPath";
import {
  allowLanguages,
  defaultLang,
  defaultTheme,
  langKey,
  localeHeaderKey,
  themeKey,
} from "./constans";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  let theme = req.cookies.get(themeKey)?.value;
  let lang = req.cookies.get(langKey)?.value;

  // issue #64 — URL locale is the source of truth: forward it to server
  // components as a request header so cookie-less crawlers get /en in English.
  const urlLocale = getLocaleFromPath(pathname);
  const requestHeaders = new Headers(req.headers);
  if (urlLocale) requestHeaders.set(localeHeaderKey, urlLocale);
  else requestHeaders.delete(localeHeaderKey);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (!theme) {
    theme = defaultTheme;
    response.cookies.set(themeKey, theme, { httpOnly: false });
  }

  if (!lang) {
    const acceptLang = req.headers.get("accept-language");
    const userLang = acceptLang?.split(",")?.[0] || "";
    lang = defaultLang;
    if (allowLanguages.includes(userLang)) lang = userLang as Language;
    response.cookies.set(langKey, lang, { httpOnly: false });
  }

  const hasLocalePrefix = allowLanguages.some(
    (locale) =>
      !pathname ||
      pathname === "/" ||
      pathname.startsWith(`/${locale}/`) ||
      pathname === `/${locale}`,
  );

  if (!hasLocalePrefix) {
    req.nextUrl.pathname = `/${lang}${pathname || "/"}`;
    const redirectResponse = NextResponse.redirect(req.nextUrl);
    for (const c of response.cookies.getAll()) {
      redirectResponse.cookies.set(c);
    }
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
